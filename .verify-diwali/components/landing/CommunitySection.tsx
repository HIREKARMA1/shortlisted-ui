'use client';

import { useTranslation } from '@/lib/i18n/context';

type CommunityGalleryItem = {
  id: string;
  image_url: string;
};

type CommunityContent = {
  collage_url: string | null;
  gallery: CommunityGalleryItem[];
};

const bulletKeys = ['support', 'collaborate', 'studyGroups', 'referrals'] as const;

export function CommunitySection({ content }: { content: CommunityContent }) {
  const { t } = useTranslation();

  if (!content.collage_url && content.gallery.length === 0) return null;

  return (
    <section className="border-t border-line-default bg-white py-10 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#202230] via-[#293C69] to-[#32549F] px-8 md:px-16 lg:px-20">
          <div className="flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="flex-1 space-y-6 py-12 md:py-16">
              <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                {t('landing.community.title')}
              </h2>
              <ul className="space-y-3 text-sm text-white/90 md:text-base">
                {bulletKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    <span>{t(`landing.community.bullets.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {content.collage_url && (
              <div className="relative flex-1 self-stretch">
                <div className="relative flex h-full min-h-[240px] items-end lg:min-h-[320px]">
                  <img
                    src={content.collage_url}
                    alt={t('landing.community.collageAlt')}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {content.gallery.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {content.gallery.map((item, index) => (
              <div
                key={item.id}
                className={`relative aspect-[4/3] overflow-hidden ${index === 0 ? 'rounded-xl' : 'rounded-lg'}`}
              >
                <img
                  src={item.image_url}
                  alt={t('landing.community.galleryAlt')}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
