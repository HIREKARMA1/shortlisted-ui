'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mic, MicOff, Repeat2, Send, Volume2, VolumeX, X } from 'lucide-react';
import { config } from '@/lib/config';
import { Button } from '@/components/ui/Button';

type Message = { role: 'interviewer' | 'candidate'; text: string };
type QuestionProgress = { current: number; total: number };
type EventPayload = {
  type: string;
  text?: string;
  seconds_remaining?: number;
  score?: number;
  appreciation?: string;
  next_action?: string;
  data?: string;
  mime_type?: string;
  available?: boolean;
  tts_available?: boolean;
  question_progress?: QuestionProgress;
};

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

export function InterviewRoom({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const spokenReplyRef = useRef<HTMLAudioElement | null>(null);
  const ttsEnabledRef = useRef(true);
  const serverTtsAvailableRef = useRef(false);
  const lastInterviewerTextRef = useRef('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState('');
  const [connected, setConnected] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [serverTtsAvailable, setServerTtsAvailable] = useState(false);
  const [progress, setProgress] = useState<QuestionProgress | null>(null);

  const send = useCallback((message: Record<string, unknown>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(message));
  }, []);

  const speakWithBrowser = useCallback((text: string) => {
    if (!text || !ttsEnabledRef.current || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);
  useEffect(() => { serverTtsAvailableRef.current = serverTtsAvailable; }, [serverTtsAvailable]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.replace('/auth/login/student'); return; }
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
        setMessages((current) => [...current, { role: 'interviewer', text: event.text! }]);
        lastInterviewerTextRef.current = event.text;
        if (!serverTtsAvailableRef.current) speakWithBrowser(event.text);
      }
      if (event.type === 'evaluation') {
        const note = event.appreciation?.trim()
          ? event.appreciation.trim()
          : event.next_action === 'follow_up'
            ? 'Answer noted — follow-up coming up.'
            : 'Answer noted.';
        toast.success(note);
      }
      if (event.type === 'transcript' && event.text) setAnswer(event.text);
      if (event.type === 'voice_status') {
        if (typeof event.available === 'boolean') setVoiceAvailable(event.available);
        if (typeof event.tts_available === 'boolean') {
          setServerTtsAvailable(event.tts_available);
          if (!event.tts_available) speakWithBrowser(lastInterviewerTextRef.current);
        }
        if (event.text) toast(event.text);
      }
      if (event.type === 'tts_audio' && event.data) {
        window.speechSynthesis?.cancel();
        spokenReplyRef.current?.pause();
        const audio = new Audio(`data:${event.mime_type || 'audio/mpeg'};base64,${event.data}`);
        spokenReplyRef.current = audio;
        audio.play().catch(() => toast.error('Audio was blocked by the browser. Click the speaker button to enable it.'));
      }
      if (event.type === 'error') toast.error(event.text || 'Interview error');
      if (event.type === 'end') router.replace(`/mock-interviews/report/${sessionId}`);
    };
    socket.onerror = () => toast.error('The interview connection was lost.');
    socket.onclose = () => setConnected(false);
    return () => { socket.close(); audioStreamRef.current?.getTracks().forEach((track) => track.stop()); spokenReplyRef.current?.pause(); window.speechSynthesis?.cancel(); };
  }, [router, sessionId, speakWithBrowser]);

  useEffect(() => {
    if (!connected || secondsRemaining <= 0) return;
    const timer = window.setInterval(() => setSecondsRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [connected, secondsRemaining]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const text = answer.trim();
    if (!text || sending) return;
    setMessages((current) => [...current, { role: 'candidate', text }]);
    setAnswer(''); setSending(true); send({ type: 'candidate_answer', text });
    window.setTimeout(() => setSending(false), 350);
  };

  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop();
      send({ type: 'voice_end' });
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = async (event) => { if (event.data.size) send({ type: 'voice_chunk', data: toBase64(await event.data.arrayBuffer()) }); };
      recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); audioStreamRef.current = null; };
      send({ type: 'voice_start' });
      recorder.start(300);
      setRecording(true);
    } catch { toast.error('Microphone permission was not granted. You can continue in text mode.'); }
  };

  return (
    <main className="flex min-h-dvh flex-col bg-surface-page">
      <header className="flex items-center justify-between border-b border-line-default bg-white px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Live practice</p>
          <p className="text-sm text-ink-muted">
            {connected ? 'Connected' : 'Connecting...'}
            {progress ? ` · Q ${progress.current} of ${progress.total}` : ''}
          </p>
        </div>
        <div className="font-mono text-xl font-semibold text-ink-primary">{formatTimer(secondsRemaining)}</div>
        <Button variant="ghost" className="p-2" title="End interview" onClick={() => send({ type: 'end' })}>
          <X className="h-5 w-5" />
        </Button>
      </header>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        <div className="flex-1 space-y-4 overflow-y-auto pb-6">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.role === 'candidate'
                    ? 'bg-brand-blue text-white'
                    : 'border border-line-default bg-white text-ink-primary shadow-card'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="border-t border-line-default bg-surface-page pt-4">
          <div className="flex gap-2">
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your answer, or use the microphone when available..."
              className="min-h-24 flex-1 resize-none rounded-md border border-line-default bg-white p-3 text-sm outline-none focus:border-brand-sky"
            />
            <div className="flex flex-col gap-2">
              <Button type="button" variant={recording ? 'danger' : 'secondary'} className="p-3" title={recording ? 'Stop microphone' : 'Start microphone'} onClick={toggleRecording}>
                {recording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button type="button" variant="secondary" className="p-3" title="Repeat current question" onClick={() => send({ type: 'repeat_question' })}>
                <Repeat2 className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="p-3"
                title={ttsEnabled ? 'Mute spoken questions' : 'Enable spoken questions'}
                onClick={() => {
                  const next = !ttsEnabled;
                  setTtsEnabled(next);
                  if (!next) {
                    spokenReplyRef.current?.pause();
                    window.speechSynthesis?.cancel();
                  }
                  send({ type: 'voice_preferences', tts_enabled: next });
                }}
              >
                {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button type="submit" variant="accent" className="p-3" disabled={!answer.trim() || sending} title="Send answer">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {recording && (
            <p className="mt-2 text-xs text-brand-red">
              Recording. {voiceAvailable ? 'Transcribing your response.' : 'Voice service unavailable; your audio will not be transcribed.'}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
