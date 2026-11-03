'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { getLockedStudentPath, getPostLoginPath, type Session } from '@/lib/auth/session';
import { useSession } from '@/hooks/useSession';

export type BatchInfo = {
  seats_remaining?: number;
  max_seats?: number;
  batch_name?: string;
  subscription_amount_inr?: number;
  regular_amount_inr?: number;
  offer_active?: boolean;
  offer_name?: string | null;
  savings_inr?: number;
  has_open_batch?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  batch_name: string;
  feedback: string;
  image_url: string;
};

export type SuccessStory = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
};

export type CommunityContent = {
  collage_url: string | null;
  gallery: { id: string; image_url: string }[];
};

export type SiteInfo = {
  office_address?: string;
  contact_email?: string;
  contact_phone?: string;
};

type HomeState = {
  ready: boolean;
  session: Session | null;
  isLoggedIn: boolean;
  isPaidStudent: boolean;
  isInactive: boolean;
  isStaff: boolean;
  hideTrialPromos: boolean;
  dashboardHref: string;
  trialHref: string;
  subscribeHref: string;
  batch: BatchInfo | null;
  batchLoading: boolean;
  testimonials: Testimonial[];
  stories: SuccessStory[];
  community: CommunityContent;
  storiesLoading: boolean;
  siteInfo: SiteInfo | null;
};

const HomeContext = createContext<HomeState | null>(null);

export function HomeProvider({ children }: { children: ReactNode }) {
  const { session, ready, isLoggedIn } = useSession();
  const [batch, setBatch] = useState<BatchInfo | null>(null);
  const [batchLoading, setBatchLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [community, setCommunity] = useState<CommunityContent>({ collage_url: null, gallery: [] });
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);

  useEffect(() => {
    api
      .getActiveBatch()
      .then(setBatch)
      .catch(() => setBatch(null))
      .finally(() => setBatchLoading(false));
    Promise.all([
      api.getTestimonials().catch(() => []),
      api.getSuccessStories().catch(() => []),
      api.getCommunity().catch(() => ({ collage_url: null, gallery: [] })),
      api.getSiteInfo().catch(() => null),
    ]).then(([t, s, c, info]) => {
      setTestimonials(Array.isArray(t) ? t : []);
      setStories(Array.isArray(s) ? s : []);
      setCommunity({
        collage_url: c?.collage_url ?? null,
        gallery: Array.isArray(c?.gallery) ? c.gallery : [],
      });
      setSiteInfo(info);
      setStoriesLoading(false);
    });
  }, []);

  const value = useMemo<HomeState>(() => {
    const isStaff = !!session && session.userType !== 'student';
    const isPaidStudent = session?.userType === 'student' && session.accessStatus === 'active';
    const isInactive = session?.userType === 'student' && session.accessStatus === 'inactive';
    const dashboardHref = session ? getPostLoginPath(session) : '/auth/login';
    const trialHref = !session
      ? '/auth/login?redirect=%2Ffree-trial'
      : isPaidStudent || isStaff
        ? dashboardHref
        : isInactive
          ? '/dashboard/student/inactive'
          : '/free-trial';
    const subscribeHref = !session
      ? '/auth/login?redirect=%2Fsubscribe'
      : isPaidStudent || isStaff
        ? dashboardHref
        : isInactive
          ? '/dashboard/student/inactive'
          : getLockedStudentPath(session);
    return {
      ready,
      session,
      isLoggedIn,
      isPaidStudent,
      isInactive,
      isStaff,
      hideTrialPromos: isPaidStudent || isStaff,
      dashboardHref,
      trialHref,
      subscribeHref,
      batch,
      batchLoading,
      testimonials,
      stories,
      community,
      storiesLoading,
      siteInfo,
    };
  }, [
    ready,
    session,
    isLoggedIn,
    batch,
    batchLoading,
    testimonials,
    stories,
    community,
    storiesLoading,
    siteInfo,
  ]);

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHome must be used inside HomeProvider');
  return ctx;
}
