'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mic, Volume2, VolumeX, X } from 'lucide-react';
import { config } from '@/lib/config';
import { Button } from '@/components/ui/Button';

type Caption = { role: 'interviewer' | 'candidate'; text: string };
type QuestionProgress = { current: number; total: number };
type RoomPhase = 'connecting' | 'speaking' | 'listening' | 'thinking' | 'ended';

type EventPayload = {
  type: string;
  text?: string;
  seconds_remaining?: number;
  data?: string;
  mime_type?: string;
  available?: boolean;
  tts_available?: boolean;
  is_final?: boolean;
  utterance_end?: boolean;
  utterance_id?: string;
  question_progress?: QuestionProgress;
};

type QueuedUtterance = {
  id: string;
  mimeType: string;
  chunks: string[];
  complete: boolean;
  textFallback: string;
};

const SILENCE_MS = 3000;
const MIN_AUTO_SUBMIT_CHARS = 40;
const MIN_AUTO_SUBMIT_WORDS = 8;

function wsBaseUrl() {
  return config.api.baseUrl.replace(/^http/, 'ws');
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function toBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return window.btoa(binary);
}

function floatTo16BitPCM(input: Float32Array) {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}

function downsampleTo16k(input: Float32Array, inputSampleRate: number) {
  if (inputSampleRate === 16000) return input;
  const ratio = inputSampleRate / 16000;
  const newLength = Math.max(1, Math.round(input.length / ratio));
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i += 1) {
    const start = Math.floor(i * ratio);
    result[i] = input[Math.min(start, input.length - 1)] || 0;
  }
  return result;
}

function answerIsSubstantial(text: string) {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  return trimmed.length >= MIN_AUTO_SUBMIT_CHARS || words.length >= MIN_AUTO_SUBMIT_WORDS;
}

export function InterviewRoom({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const ttsEnabledRef = useRef(true);
  const serverTtsAvailableRef = useRef(false);
  const listeningRef = useRef(false);
  const phaseRef = useRef<RoomPhase>('connecting');
  const finalTranscriptRef = useRef('');
  const submittingRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);
  const utteranceQueueRef = useRef<QueuedUtterance[]>([]);
  const utteranceMapRef = useRef<Map<string, QueuedUtterance>>(new Map());
  const playingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const startListeningRef = useRef<() => Promise<void>>(async () => undefined);
  const stopListeningRef = useRef<() => void>(() => undefined);
  const thinkingAudioRef = useRef<{
    ctx: AudioContext;
    nodes: AudioNode[];
    stop: () => void;
  } | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  const [captions, setCaptions] = useState<Caption[]>([]);
  const [liveCaption, setLiveCaption] = useState('');
  const [connected, setConnected] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [serverTtsAvailable, setServerTtsAvailable] = useState(false);
  const [progress, setProgress] = useState<QuestionProgress | null>(null);
  const [phase, setPhase] = useState<RoomPhase>('connecting');
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const setRoomPhase = useCallback((next: RoomPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const send = useCallback((message: Record<string, unknown>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const stopThinkingSound = useCallback(() => {
    thinkingAudioRef.current?.stop();
    thinkingAudioRef.current = null;
  }, []);

  const startThinkingSound = useCallback(() => {
    stopThinkingSound();
    if (!ttsEnabledRef.current) return;
    try {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 360;
      filter.Q.value = 0.7;
      filter.connect(master);

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const gainA = ctx.createGain();
      const gainB = ctx.createGain();
      oscA.type = 'sine';
      oscB.type = 'sine';
      oscA.frequency.value = 174;
      oscB.frequency.value = 220;
      gainA.gain.value = 0.55;
      gainB.gain.value = 0.35;
      oscA.connect(gainA);
      oscB.connect(gainB);
      gainA.connect(filter);
      gainB.connect(filter);
      oscA.start();
      oscB.start();

      const now = ctx.currentTime;
      // Quiet ambient pad — peak ~0.01
      master.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      // Slow gentle swell, then fade toward silence after ~4s so long waits are not fatiguing
      master.gain.setValueAtTime(0.01, now + 0.6);
      master.gain.linearRampToValueAtTime(0.008, now + 2.4);
      master.gain.linearRampToValueAtTime(0.01, now + 3.2);
      master.gain.exponentialRampToValueAtTime(0.0008, now + 4.2);

      const fadeTimer = window.setTimeout(() => {
        if (!thinkingAudioRef.current) return;
        try {
          const t = ctx.currentTime;
          master.gain.cancelScheduledValues(t);
          master.gain.setValueAtTime(Math.max(master.gain.value, 0.0008), t);
          master.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        } catch {
          /* ignore */
        }
      }, 4200);

      thinkingAudioRef.current = {
        ctx,
        nodes: [oscA, oscB, gainA, gainB, filter, master],
        stop: () => {
          window.clearTimeout(fadeTimer);
          try {
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
            master.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            oscA.stop(t + 0.35);
            oscB.stop(t + 0.35);
          } catch {
            /* ignore */
          }
          void ctx.close().catch(() => undefined);
        },
      };
    } catch {
      /* Web Audio unavailable */
    }
  }, [stopThinkingSound]);

  const speakWithBrowser = useCallback((text: string, onEnded?: () => void) => {
    if (!text || !ttsEnabledRef.current || !('speechSynthesis' in window)) {
      onEnded?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onend = () => onEnded?.();
    utterance.onerror = () => onEnded?.();
    window.speechSynthesis.speak(utterance);
  }, []);

  const playNextUtterance = useCallback(() => {
    if (playingRef.current) return;
    const next = utteranceQueueRef.current[0];
    if (!next || !next.complete) return;
    playingRef.current = true;
    stopThinkingSound();
    setRoomPhase('speaking');
    stopListeningRef.current();

    const finish = () => {
      utteranceQueueRef.current.shift();
      utteranceMapRef.current.delete(next.id);
      playingRef.current = false;
      currentAudioRef.current = null;
      if (utteranceQueueRef.current.length) {
        playNextUtterance();
      } else if (phaseRef.current !== 'ended' && phaseRef.current !== 'thinking') {
        void startListeningRef.current();
      }
    };

    if (!ttsEnabledRef.current) {
      finish();
      return;
    }

    if (!next.chunks.length) {
      speakWithBrowser(next.textFallback, finish);
      return;
    }

    const blob = new Blob(
      next.chunks.map((chunk) => Uint8Array.from(window.atob(chunk), (c) => c.charCodeAt(0))),
      { type: next.mimeType || 'audio/mpeg' },
    );
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      finish();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      speakWithBrowser(next.textFallback, finish);
    };
    audio.play().catch(() => {
      URL.revokeObjectURL(url);
      speakWithBrowser(next.textFallback, finish);
    });
  }, [setRoomPhase, speakWithBrowser, stopThinkingSound]);

  const enqueueUtteranceText = useCallback(
    (utteranceId: string, text: string) => {
      let entry = utteranceMapRef.current.get(utteranceId);
      if (!entry) {
        entry = { id: utteranceId, mimeType: 'audio/mpeg', chunks: [], complete: false, textFallback: text };
        utteranceMapRef.current.set(utteranceId, entry);
        utteranceQueueRef.current.push(entry);
      } else {
        entry.textFallback = text || entry.textFallback;
      }
      if (!serverTtsAvailableRef.current) {
        entry.complete = true;
        playNextUtterance();
      } else {
        window.setTimeout(() => {
          const pending = utteranceMapRef.current.get(utteranceId);
          if (pending && !pending.complete) {
            pending.complete = true;
            setServerTtsAvailable(false);
            playNextUtterance();
          }
        }, 8000);
      }
    },
    [playNextUtterance],
  );

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current = null;
    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
    send({ type: 'voice_end' });
  }, [send]);

  const submitAnswer = useCallback(
    (text: string, { force = false }: { force?: boolean } = {}) => {
      const trimmed = text.trim();
      if (!trimmed || submittingRef.current) return;
      if (!force && !answerIsSubstantial(trimmed)) return;
      submittingRef.current = true;
      stopListening();
      setLiveCaption('');
      setHasDraft(false);
      finalTranscriptRef.current = '';
      setCaptions((current) => [...current, { role: 'candidate', text: trimmed }]);
      setRoomPhase('thinking');
      startThinkingSound();
      send({ type: 'candidate_answer', text: trimmed });
      window.setTimeout(() => {
        submittingRef.current = false;
      }, 800);
    },
    [send, setRoomPhase, startThinkingSound, stopListening],
  );

  const scheduleAutoSubmit = useCallback(() => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = window.setTimeout(() => {
      if (!listeningRef.current) return;
      const draft = finalTranscriptRef.current.trim();
      if (!draft) return;
      if (!answerIsSubstantial(draft)) {
        // Keep listening through short fragments / mid-thought pauses.
        scheduleAutoSubmit();
        return;
      }
      submitAnswer(draft);
    }, SILENCE_MS);
  }, [submitAnswer]);

  const startListening = useCallback(async () => {
    if (listeningRef.current || playingRef.current || phaseRef.current === 'ended') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;
      finalTranscriptRef.current = '';
      setLiveCaption('');
      setHasDraft(false);
      listeningRef.current = true;
      setRoomPhase('listening');

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      send({
        type: 'voice_start',
        encoding: 'linear16',
        sample_rate: 16000,
        mime_type: 'audio/l16',
      });

      processor.onaudioprocess = (event) => {
        if (!listeningRef.current) return;
        const input = event.inputBuffer.getChannelData(0);
        const downsampled = downsampleTo16k(input, audioContext.sampleRate || 48000);
        const pcm = floatTo16BitPCM(downsampled);
        send({ type: 'voice_chunk', data: toBase64(pcm) });
      };
      const mute = audioContext.createGain();
      mute.gain.value = 0;
      source.connect(processor);
      processor.connect(mute);
      mute.connect(audioContext.destination);
    } catch {
      toast.error('Microphone permission is required for this voice interview.');
      setRoomPhase('listening');
    }
  }, [send, setRoomPhase]);

  useEffect(() => {
    startListeningRef.current = startListening;
    stopListeningRef.current = stopListening;
  }, [startListening, stopListening]);

  useEffect(() => {
    ttsEnabledRef.current = ttsEnabled;
    if (!ttsEnabled) stopThinkingSound();
  }, [ttsEnabled, stopThinkingSound]);
  useEffect(() => {
    serverTtsAvailableRef.current = serverTtsAvailable;
  }, [serverTtsAvailable]);

  useEffect(() => {
    if (!stickToBottomRef.current) return;
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [captions, liveCaption, phase]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/auth/login/student');
      return;
    }
    const socket = new WebSocket(`${wsBaseUrl()}/api/v1/ws/sessions/${sessionId}?token=${encodeURIComponent(token)}`);
    socketRef.current = socket;
    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: 'voice_preferences', tts_enabled: true }));
      socket.send(JSON.stringify({ type: 'ready' }));
    };
    socket.onmessage = (raw) => {
      const event = JSON.parse(raw.data) as EventPayload;
      if (typeof event.seconds_remaining === 'number') setSecondsRemaining(event.seconds_remaining);
      if (event.question_progress?.current && event.question_progress?.total) {
        setProgress(event.question_progress);
      }

      if (event.type === 'interviewer_message' && event.text) {
        stopThinkingSound();
        setCaptions((current) => [...current, { role: 'interviewer', text: event.text! }]);
        const utteranceId = event.utterance_id || `text-${Date.now()}`;
        enqueueUtteranceText(utteranceId, event.text);
        setRoomPhase('speaking');
      }

      if (event.type === 'tts_audio_start' && event.utterance_id) {
        let entry = utteranceMapRef.current.get(event.utterance_id);
        if (!entry) {
          entry = {
            id: event.utterance_id,
            mimeType: event.mime_type || 'audio/mpeg',
            chunks: [],
            complete: false,
            textFallback: '',
          };
          utteranceMapRef.current.set(event.utterance_id, entry);
          utteranceQueueRef.current.push(entry);
        }
        entry.mimeType = event.mime_type || entry.mimeType;
        setServerTtsAvailable(true);
      }

      if (event.type === 'tts_audio_chunk' && event.utterance_id && event.data) {
        const entry = utteranceMapRef.current.get(event.utterance_id);
        if (entry) entry.chunks.push(event.data);
      }

      if (event.type === 'tts_audio_end' && event.utterance_id) {
        const entry = utteranceMapRef.current.get(event.utterance_id);
        if (entry) {
          entry.complete = true;
          playNextUtterance();
        }
      }

      if (event.type === 'tts_audio' && event.data) {
        const utteranceId = event.utterance_id || `legacy-${Date.now()}`;
        let entry = utteranceMapRef.current.get(utteranceId);
        if (!entry) {
          entry = {
            id: utteranceId,
            mimeType: event.mime_type || 'audio/mpeg',
            chunks: [],
            complete: false,
            textFallback: '',
          };
          utteranceMapRef.current.set(utteranceId, entry);
          utteranceQueueRef.current.push(entry);
        }
        entry.chunks = [event.data];
        entry.complete = true;
        setServerTtsAvailable(true);
        playNextUtterance();
      }

      if (event.type === 'evaluation') {
        setRoomPhase('thinking');
        startThinkingSound();
      }

      if (event.type === 'transcript') {
        if (event.utterance_end) {
          // Empty utterance-end only refreshes silence; do not force a short submit.
          scheduleAutoSubmit();
          return;
        }
        if (!event.text) return;
        if (event.is_final) {
          const separator = finalTranscriptRef.current && !/\s$/.test(finalTranscriptRef.current) ? ' ' : '';
          finalTranscriptRef.current = `${finalTranscriptRef.current}${separator}${event.text}`;
          setLiveCaption(finalTranscriptRef.current);
          setHasDraft(Boolean(finalTranscriptRef.current.trim()));
          scheduleAutoSubmit();
        } else {
          const separator = finalTranscriptRef.current && !/\s$/.test(finalTranscriptRef.current) ? ' ' : '';
          const live = `${finalTranscriptRef.current}${separator}${event.text}`;
          setLiveCaption(live);
          setHasDraft(Boolean(live.trim()));
          scheduleAutoSubmit();
        }
      }

      if (event.type === 'voice_status') {
        if (typeof event.available === 'boolean') setVoiceAvailable(event.available);
        if (typeof event.tts_available === 'boolean') {
          setServerTtsAvailable(event.tts_available);
          if (event.tts_available === false) {
            utteranceQueueRef.current.forEach((entry) => {
              entry.complete = true;
            });
            playNextUtterance();
            if (event.text) toast(event.text);
          }
        }
      }

      if (event.type === 'error') toast.error(event.text || 'Interview error');
      if (event.type === 'end') {
        stopThinkingSound();
        setRoomPhase('ended');
        stopListening();
        router.replace(`/mock-interviews/report/${sessionId}`);
      }
    };
    socket.onerror = () => toast.error('The interview connection was lost.');
    socket.onclose = () => {
      setConnected(false);
      stopThinkingSound();
      stopListening();
    };
    return () => {
      socket.close();
      stopThinkingSound();
      stopListening();
      currentAudioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, [
    enqueueUtteranceText,
    playNextUtterance,
    router,
    scheduleAutoSubmit,
    sessionId,
    setRoomPhase,
    startThinkingSound,
    stopListening,
    stopThinkingSound,
  ]);

  useEffect(() => {
    if (!connected || secondsRemaining <= 0) return;
    const timer = window.setInterval(() => setSecondsRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [connected, secondsRemaining]);

  const phaseLabel =
    phase === 'speaking'
      ? 'Interviewer speaking'
      : phase === 'listening'
        ? voiceAvailable
          ? 'Listening… take your time'
          : 'Waiting for microphone…'
        : phase === 'thinking'
          ? 'Analyzing your answer…'
          : phase === 'ended'
            ? 'Interview ended'
            : 'Connecting…';

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_#e8f1ff_0%,_#f7f8fb_45%,_#eef2f7_100%)] pb-[env(safe-area-inset-bottom)]">
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-white/60 px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Voice practice</p>
          <p className="truncate text-sm text-ink-muted">
            {connected ? phaseLabel : 'Connecting...'}
            {progress ? ` · Q ${progress.current} of ${progress.total}` : ''}
          </p>
        </div>
        <div className="font-mono text-lg font-semibold text-ink-primary sm:text-xl">{formatTimer(secondsRemaining)}</div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="p-2"
            title={ttsEnabled ? 'Mute interviewer' : 'Unmute interviewer'}
            onClick={() => {
              const next = !ttsEnabled;
              setTtsEnabled(next);
              if (!next) {
                currentAudioRef.current?.pause();
                window.speechSynthesis?.cancel();
                stopThinkingSound();
              }
              send({ type: 'voice_preferences', tts_enabled: next });
            }}
          >
            {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" className="p-2" title="End interview" onClick={() => send({ type: 'end' })}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl shrink-0 flex-col items-center px-4 pb-3 pt-5 sm:pt-8">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
          <div
            className={`absolute inset-0 rounded-full bg-brand-blue/20 ${
              phase === 'thinking'
                ? 'animate-ping'
                : phase === 'speaking' || phase === 'listening'
                  ? 'animate-pulse'
                  : ''
            }`}
          />
          {phase === 'thinking' ? (
            <div className="absolute inset-[-6px] animate-spin rounded-full border-2 border-transparent border-t-brand-blue/70 border-r-brand-sky/50" />
          ) : null}
          <div
            className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-sky text-white shadow-lg transition-transform sm:h-32 sm:w-32 ${
              phase === 'speaking' || phase === 'thinking' ? 'scale-110' : phase === 'listening' ? 'scale-105' : 'scale-100'
            }`}
          >
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80 sm:text-xs">AI</p>
              <p className="mt-0.5 text-sm font-semibold sm:text-lg">
                {phase === 'thinking' ? 'Analyzing' : 'Interviewer'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-ink-muted sm:mt-6 sm:gap-3">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
              phase === 'listening' ? 'bg-brand-red text-white' : 'bg-white text-brand-blue shadow-card'
            }`}
          >
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span>You · candidate</span>
        </div>

        {phase === 'listening' && hasDraft ? (
          <Button
            className="mt-4"
            variant="accent"
            onClick={() => submitAnswer(finalTranscriptRef.current, { force: true })}
          >
            I&apos;m done
          </Button>
        ) : null}
      </section>

      <section className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 pb-4 sm:px-4">
        <div
          className={`flex h-full min-h-0 max-h-[48dvh] flex-col overflow-hidden rounded-2xl border bg-white/85 shadow-card backdrop-blur sm:max-h-none ${
            phase === 'thinking' ? 'border-brand-blue/40 ring-2 ring-brand-blue/20' : 'border-white/70'
          }`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-line-default px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Transcript</p>
            {phase === 'thinking' ? (
              <p className="animate-pulse text-xs font-medium text-brand-blue">Analyzing your answer…</p>
            ) : null}
          </div>

          <div
            ref={transcriptScrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4"
            onScroll={(event) => {
              const el = event.currentTarget;
              stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            }}
          >
            {captions.length === 0 && !liveCaption ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                Captions will appear here as you and the interviewer speak.
              </p>
            ) : null}
            {captions.map((caption, index) => (
              <div
                key={`${caption.role}-${index}-${caption.text.slice(0, 24)}`}
                className={`flex ${caption.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 sm:max-w-[85%] ${
                    caption.role === 'candidate'
                      ? 'bg-brand-blue text-white'
                      : 'border border-line-default bg-white text-ink-primary'
                  }`}
                >
                  {caption.text}
                </div>
              </div>
            ))}
            {liveCaption ? (
              <div className="flex justify-end">
                <div className="max-w-[92%] rounded-2xl border border-dashed border-brand-blue/40 bg-brand-blue/10 px-3.5 py-2.5 text-sm leading-6 text-ink-primary sm:max-w-[85%]">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-blue">Live</p>
                  {liveCaption}
                </div>
              </div>
            ) : null}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </section>
    </main>
  );
}
