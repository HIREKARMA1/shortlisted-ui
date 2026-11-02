'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { ClassVideoPlayer, type VideoQualitySource } from '@/components/free-trial/ClassVideoPlayer';

export type ClassVideoModalLabels = {
  close: string;
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

type ClassVideoModalProps = {
  open: boolean;
  title: string;
  duration?: string;
  level?: string;
  videoUrl?: string;
  videoSources?: VideoQualitySource[];
  posterUrl?: string;
  labels: ClassVideoModalLabels;
  onClose: () => void;
};

export function ClassVideoModal({
  open,
  title,
  duration,
  level,
  videoUrl,
  videoSources,
  posterUrl,
  labels,
  onClose,
}: ClassVideoModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label={labels.close}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#0f1115] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate font-serif text-base font-bold text-white sm:text-lg">{title}</h2>
            {(duration || level) && (
              <p className="mt-0.5 font-sans text-xs text-white/60">
                {[duration, level].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={labels.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <ClassVideoPlayer
            title={title}
            src={videoUrl}
            sources={videoSources}
            poster={posterUrl}
            labels={labels}
          />
        </div>
      </div>
    </div>
  );
}
