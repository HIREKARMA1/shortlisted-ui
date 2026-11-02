'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ShellState = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  unlockOpen: boolean;
  setUnlockOpen: (open: boolean) => void;
  pendingTargetHref: string | null;
  setPendingTargetHref: (href: string | null) => void;
  activeSection: string;
};

const ShellContext = createContext<ShellState | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [pendingTargetHref, setPendingTargetHref] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const ids = ['home', 'journey', 'desk', 'trainers', 'stories', 'plans', 'faq', 'contact'];
    const nodes = ids.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => !!node);
    if (!nodes.length) return;

    const updateHash = (sectionId: string) => {
      setActiveSection(sectionId);
      if (typeof window === 'undefined') return;
      if (sectionId === 'home') {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        const nextHash = `#${sectionId}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
        }
      }
    };

    const onScroll = () => {
      if (window.scrollY < 120) {
        updateHash('home');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 120) {
          updateHash('home');
          return;
        }
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          updateHash(visible.target.id);
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0.15, 0.4] },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <ShellContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        paletteOpen,
        setPaletteOpen,
        unlockOpen,
        setUnlockOpen,
        pendingTargetHref,
        setPendingTargetHref,
        activeSection,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside ShellProvider');
  return ctx;
}
