'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { SectionHeading } from '@/components/free-trial/SectionHeading';
import { ClassCard, type ClassCardData } from '@/components/free-trial/ClassCard';
import { ClassVideoModal } from '@/components/free-trial/ClassVideoModal';

function readClasses(value: unknown): ClassCardData[] {
  return Array.isArray(value) ? (value as ClassCardData[]) : [];
}

export function FreeTrialClassesSection() {
  const { t, tRaw } = useTranslation();
  const items = readClasses(tRaw('freeTrial.classes.items'));
  const [active, setActive] = useState<ClassCardData | null>(null);

  const playerLabels = useMemo(
    () => ({
      close: t('freeTrial.classes.player.close'),
      play: t('freeTrial.classes.player.play'),
      pause: t('freeTrial.classes.player.pause'),
      mute: t('freeTrial.classes.player.mute'),
      unmute: t('freeTrial.classes.player.unmute'),
      fullscreen: t('freeTrial.classes.player.fullscreen'),
      exitFullscreen: t('freeTrial.classes.player.exitFullscreen'),
      pip: t('freeTrial.classes.player.pip'),
      settings: t('freeTrial.classes.player.settings'),
      speed: t('freeTrial.classes.player.speed'),
      quality: t('freeTrial.classes.player.quality'),
      unavailable: t('freeTrial.classes.player.unavailable'),
    }),
    [t],
  );

  return (
    <section id="courses" className="border-t border-[#eef1f5] bg-[#f5f7fa] py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <SectionHeading
          title={t('freeTrial.classes.title')}
          subtitle={t('freeTrial.classes.subtitle')}
          align="center"
        />

        <div className="-mx-4 mt-8 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <ClassCard
              key={item.id}
              item={item}
              playAria={t('freeTrial.classes.playAria')}
              className="w-[210px] shrink-0 sm:w-auto"
              onPlay={setActive}
            />
          ))}
        </div>
      </PageContainer>

      <ClassVideoModal
        open={Boolean(active)}
        title={active?.title ?? ''}
        duration={active?.duration}
        level={active?.level}
        videoUrl={active?.videoUrl}
        videoSources={active?.videoSources}
        posterUrl={active?.thumbnailUrl}
        labels={playerLabels}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
