'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type VideoQualitySource = {
  label: string;
  src: string;
};

type ClassVideoPlayerProps = {
  title: string;
  src?: string;
  sources?: VideoQualitySource[];
  poster?: string;
  labels: {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    fullscreen: string;
    exitFullscreen: string;
    pip: string;
    settings: string;
    speed: string;
    quality: string;
    unavailable: string;
  };
};

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      const parts = parsed.pathname.split('/');
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf('shorts');
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function ClassVideoPlayer({ title, src, sources, poster, labels }: ClassVideoPlayerProps) {
  const qualityOptions = useMemo<VideoQualitySource[]>(() => {
    if (sources?.length) return sources;
    if (src?.trim()) return [{ label: 'Auto', src: src.trim() }];
    return [];
  }, [sources, src]);

  const primarySrc = qualityOptions[0]?.src ?? '';
  const youtubeId = primarySrc ? getYoutubeId(primarySrc) : null;

  if (!primarySrc) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-black text-sm text-white/70">
        {labels.unavailable}
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Html5VideoPlayer
      title={title}
      qualityOptions={qualityOptions}
      poster={poster}
      labels={labels}
    />
  );
}

function Html5VideoPlayer({
  title,
  qualityOptions,
  poster,
  labels,
}: {
  title: string;
  qualityOptions: VideoQualitySource[];
  poster?: string;
  labels: ClassVideoPlayerProps['labels'];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [qualityIndex, setQualityIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [pipSupported, setPipSupported] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [menu, setMenu] = useState<'none' | 'settings' | 'speed' | 'quality'>('none');
  const [seeking, setSeeking] = useState(false);

  const activeSrc = qualityOptions[qualityIndex]?.src ?? qualityOptions[0]?.src;

  const clearHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && menu === 'none') {
        setShowControls(false);
      }
    }, 2800);
  }, [menu]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc) return;
    const prevTime = video.currentTime;
    const hadSrc = Boolean(video.currentSrc);
    video.crossOrigin = 'anonymous';
    video.disablePictureInPicture = false;
    video.src = activeSrc;
    video.load();
    const restore = () => {
      if (hadSrc) video.currentTime = prevTime;
      video.playbackRate = speed;
      void video.play().catch(() => undefined);
    };
    video.addEventListener('loadedmetadata', restore, { once: true });
    return () => video.removeEventListener('loadedmetadata', restore);
  }, [activeSrc]); // eslint-disable-line react-hooks/exhaustive-deps -- keep time on quality switch

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const video = videoRef.current;
    type WebkitVideo = HTMLVideoElement & {
      webkitSetPresentationMode?: (mode: 'inline' | 'picture-in-picture' | 'fullscreen') => void;
    };
    const canPip =
      Boolean(document.pictureInPictureEnabled) ||
      typeof (video as WebkitVideo | null)?.webkitSetPresentationMode === 'function';
    setPipSupported(canPip);

    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const onPipEnter = () => setIsPip(true);
    const onPipLeave = () => setIsPip(false);

    document.addEventListener('fullscreenchange', onFs);
    video?.addEventListener('enterpictureinpicture', onPipEnter);
    video?.addEventListener('leavepictureinpicture', onPipLeave);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      video?.removeEventListener('enterpictureinpicture', onPipEnter);
      video?.removeEventListener('leavepictureinpicture', onPipLeave);
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (video.paused) void video.play();
        else video.pause();
      } else if (e.key === 'ArrowRight') {
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        video.currentTime = Math.max(0, video.currentTime - 5);
      } else if (e.key === 'f') {
        const el = containerRef.current;
        if (!el) return;
        if (document.fullscreenElement) void document.exitFullscreen();
        else void el.requestFullscreen().catch(() => undefined);
      } else if (e.key === 'm') {
        video.muted = !video.muted;
        setMuted(video.muted);
      } else if (e.key === 'Escape') {
        setMenu('none');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play().catch(() => undefined);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await el.requestFullscreen().catch(() => undefined);
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;

    type WebkitVideo = HTMLVideoElement & {
      webkitSetPresentationMode?: (mode: 'inline' | 'picture-in-picture' | 'fullscreen') => void;
      webkitPresentationMode?: 'inline' | 'picture-in-picture' | 'fullscreen';
    };
    const webkitVideo = video as WebkitVideo;

    try {
      if (typeof webkitVideo.webkitSetPresentationMode === 'function') {
        const next =
          webkitVideo.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture';
        webkitVideo.webkitSetPresentationMode(next);
        setIsPip(next === 'picture-in-picture');
        return;
      }

      if (!document.pictureInPictureEnabled || video.disablePictureInPicture) {
        setPipSupported(false);
        return;
      }

      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      if (video.paused || video.ended) {
        await video.play();
      }

      await video.requestPictureInPicture();
    } catch {
      try {
        if (video.paused) await video.play();
        await video.requestPictureInPicture();
      } catch {
        setPipSupported(false);
      }
    }
  };

  const seekFromClientX = (clientX: number, target: HTMLElement) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setCurrent(video.currentTime);
  };

  const onProgressPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setSeeking(true);
    seekFromClientX(e.clientX, e.currentTarget);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-lg bg-black select-none"
      onMouseMove={revealControls}
      onMouseLeave={() => {
        if (playing && menu === 'none') setShowControls(false);
      }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        poster={poster || undefined}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onClick={() => void togglePlay()}
        onPlay={() => {
          setPlaying(true);
          scheduleHide();
        }}
        onPause={() => {
          setPlaying(false);
          setShowControls(true);
        }}
        onTimeUpdate={() => {
          if (!seeking && videoRef.current) setCurrent(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration || 0);
        }}
        onVolumeChange={() => {
          if (!videoRef.current) return;
          setMuted(videoRef.current.muted);
          setVolume(videoRef.current.volume);
        }}
        aria-label={title}
      />

      {!playing && (
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1b52a4] shadow-lg"
          aria-label={labels.play}
        >
          <Play className="ml-1 h-7 w-7 fill-current" />
        </button>
      )}

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200',
          showControls || menu !== 'none' ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div
          className="group relative mb-2.5 h-1.5 cursor-pointer rounded-full bg-white/30"
          onPointerDown={onProgressPointerDown}
          onPointerMove={(e) => {
            if (!seeking) return;
            seekFromClientX(e.clientX, e.currentTarget);
          }}
          onPointerUp={() => setSeeking(false)}
          onPointerCancel={() => setSeeking(false)}
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-[#1b52a4]" style={{ width: `${progress}%` }} />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="relative flex items-center gap-1.5 text-white sm:gap-2">
          <button
            type="button"
            className="rounded p-1.5 hover:bg-white/15"
            onClick={() => void togglePlay()}
            aria-label={playing ? labels.pause : labels.play}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
          </button>

          <button
            type="button"
            className="rounded p-1.5 hover:bg-white/15"
            onClick={toggleMute}
            aria-label={muted || volume === 0 ? labels.unmute : labels.mute}
          >
            {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              const video = videoRef.current;
              if (!video) return;
              video.volume = next;
              video.muted = next === 0;
              setVolume(next);
              setMuted(next === 0);
            }}
            className="hidden h-1 w-20 cursor-pointer accent-[#1b52a4] sm:block"
            aria-label={labels.mute}
          />

          <span className="ml-1 font-sans text-[11px] tabular-nums text-white/90 sm:text-xs">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <div className="relative">
              <button
                type="button"
                className="rounded p-1.5 hover:bg-white/15"
                onClick={() => setMenu((m) => (m === 'none' ? 'settings' : 'none'))}
                aria-label={labels.settings}
              >
                <Settings className="h-5 w-5" />
              </button>

              {menu !== 'none' && (
                <div className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-lg bg-[#1f1f1f] py-1 text-sm shadow-xl ring-1 ring-white/10">
                  {menu === 'settings' && (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/10"
                        onClick={() => setMenu('speed')}
                      >
                        <span>{labels.speed}</span>
                        <span className="text-white/60">{speed === 1 ? 'Normal' : `${speed}x`}</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/10"
                        onClick={() => setMenu('quality')}
                      >
                        <span>{labels.quality}</span>
                        <span className="text-white/60">{qualityOptions[qualityIndex]?.label ?? 'Auto'}</span>
                      </button>
                    </>
                  )}

                  {menu === 'speed' && (
                    <>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-white/70 hover:bg-white/10"
                        onClick={() => setMenu('settings')}
                      >
                        ← {labels.speed}
                      </button>
                      {SPEEDS.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/10',
                            speed === rate && 'bg-white/10',
                          )}
                          onClick={() => {
                            setSpeed(rate);
                            setMenu('none');
                          }}
                        >
                          <span>{rate === 1 ? 'Normal' : `${rate}`}</span>
                          {speed === rate && <span>✓</span>}
                        </button>
                      ))}
                    </>
                  )}

                  {menu === 'quality' && (
                    <>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-white/70 hover:bg-white/10"
                        onClick={() => setMenu('settings')}
                      >
                        ← {labels.quality}
                      </button>
                      {qualityOptions.map((option, index) => (
                        <button
                          key={`${option.label}-${option.src}`}
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/10',
                            qualityIndex === index && 'bg-white/10',
                          )}
                          onClick={() => {
                            setQualityIndex(index);
                            setMenu('none');
                          }}
                        >
                          <span>{option.label}</span>
                          {qualityIndex === index && <span>✓</span>}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {pipSupported && (
              <button
                type="button"
                className={cn('rounded p-1.5 hover:bg-white/15', isPip && 'bg-white/15')}
                onClick={(e) => {
                  e.stopPropagation();
                  void togglePip();
                }}
                aria-label={labels.pip}
                aria-pressed={isPip}
              >
                <PictureInPicture2 className="h-5 w-5" />
              </button>
            )}

            <button
              type="button"
              className="rounded p-1.5 hover:bg-white/15"
              onClick={() => void toggleFullscreen()}
              aria-label={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
