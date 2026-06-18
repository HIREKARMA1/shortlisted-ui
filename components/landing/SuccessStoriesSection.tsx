'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

type SuccessStory = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
};

const DESKTOP_CARD_WIDTH = 288;
const DESKTOP_CARD_GAP = 20;

function WaveDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="currentColor" aria-hidden>
      <rect x="8" y="28" width="8" height="24" rx="2" />
      <rect x="24" y="18" width="8" height="44" rx="2" />
      <rect x="40" y="8" width="8" height="64" rx="2" />
      <rect x="56" y="22" width="8" height="36" rx="2" />
      <rect x="72" y="14" width="8" height="52" rx="2" />
      <rect x="88" y="26" width="8" height="28" rx="2" />
      <rect x="104" y="32" width="8" height="16" rx="2" />
    </svg>
  );
}

function StoryCard({
  story,
  onPlay,
  className,
}: {
  story: SuccessStory;
  onPlay: (story: SuccessStory) => void;
  className?: string;
}) {
  const canPlay = Boolean(story.video_url);

  return (
    <article
      data-story-card
      className={[
        'w-full shrink-0 snap-start overflow-hidden rounded-xl bg-white p-4 sm:w-72',
        className,
      ].join(' ')}
    >
      <div className="group relative mb-2 overflow-hidden rounded-xl border border-black/10">
        <button
          type="button"
          onClick={() => canPlay && onPlay(story)}
          disabled={!canPlay}
          className="relative aspect-video w-full cursor-pointer disabled:cursor-default"
          aria-label={canPlay ? `Play video: ${story.title}` : story.title}
        >
          {story.thumbnail_url ? (
            <img
              src={story.thumbnail_url}
              alt={story.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#eceff3] px-3 text-center text-sm font-medium leading-snug text-[#8b95a5]">
              {story.title}
            </div>
          )}
          {canPlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff0000] shadow-lg transition group-hover:scale-105 sm:h-16 sm:w-16">
                <Play className="ml-1 h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
              </span>
            </div>
          )}
        </button>
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-ink-muted">{story.title}</p>
    </article>
  );
}

export function SuccessStoriesSection({ stories }: { stories: SuccessStory[] }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState<SuccessStory | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const desktopViewportWidth = DESKTOP_CARD_WIDTH * 3 + DESKTOP_CARD_GAP * 2;

  const updateScrollState = useCallback(() => {
    const track = desktopTrackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = desktopTrackRef.current;
    if (!track) return;

    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [stories.length, updateScrollState]);

  const scrollDesktop = (direction: 'left' | 'right') => {
    const track = desktopTrackRef.current;
    if (!track) return;
    const amount = DESKTOP_CARD_WIDTH + DESKTOP_CARD_GAP;
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (stories.length === 0) return null;

  const header = (
    <div className="mb-12 max-w-2xl space-y-4">
      <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-tight">
        {t('landing.successStories.title')}
      </h2>
      <p className="text-base text-white/80 md:text-lg md:leading-7">
        {t('landing.successStories.subtitle')}
      </p>
    </div>
  );

  return (
    <section className="border-t border-line-default bg-[#f3f4f6] py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="relative mx-auto w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#2ec4b0] to-[#1b2559] py-16 shadow-xl">
          <WaveDecor className="pointer-events-none absolute left-10 top-1/2 h-20 w-28 -translate-y-1/2 text-white/15" />
          <WaveDecor className="pointer-events-none absolute bottom-16 left-24 h-24 w-32 text-[#0c1638]/40" />
          <WaveDecor className="pointer-events-none absolute right-10 top-10 h-20 w-24 text-white/15" />

          <div className="relative z-10 px-6 sm:px-8">
            <div className="lg:hidden">
              {header}
              <div
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} onPlay={setPlaying} className="w-[min(100%,288px)]" />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              {header}

              <div className="flex flex-col items-end gap-5">
                <div
                  ref={desktopTrackRef}
                  className="w-full overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ maxWidth: desktopViewportWidth }}
                >
                  <div className="ml-auto flex w-max gap-5">
                    {stories.map((story) => (
                      <StoryCard key={story.id} story={story} onPlay={setPlaying} />
                    ))}
                  </div>
                </div>

                {stories.length > 3 && (
                  <div className="flex items-center gap-3" style={{ width: desktopViewportWidth }}>
                    <button
                      type="button"
                      aria-label="Previous stories"
                      onClick={() => scrollDesktop('left')}
                      disabled={!canScrollLeft}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next stories"
                      onClick={() => scrollDesktop('right')}
                      disabled={!canScrollRight}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {playing?.video_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPlaying(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={playing.title}
          >
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              key={playing.id}
              src={playing.video_url}
              controls
              autoPlay
              className="w-full rounded-2xl bg-black shadow-2xl"
            />
            <p className="mt-3 text-center text-sm font-medium text-white/90">{playing.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
