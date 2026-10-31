'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { sidebarStorageKey } from '@/lib/home/content';

type ShellState = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  unlockOpen: boolean;
  setUnlockOpen: (open: boolean) => void;
  activeSection: string;
};

const ShellContext = createContext<ShellState | null>(null);

function readCollapsed() {
  try {
    return localStorage.getItem(sidebarStorageKey) === '1';
  } catch {
    return false;
  }
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setCollapsed(readCollapsed());
  }, []);

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
    const ids = ['home', 'plans', 'faq'];
    const nodes = ids.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => !!node);
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(sidebarStorageKey, next ? '1' : '0');
      } catch {
        /* ignore private mode */
      }
      return next;
    });
  };

  return (
    <ShellContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        mobileOpen,
        setMobileOpen,
        paletteOpen,
        setPaletteOpen,
        contactOpen,
        setContactOpen,
        unlockOpen,
        setUnlockOpen,
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
