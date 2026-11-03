'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { isSeasonalHeroLocalDateActive } from '@/lib/home/content';
import { useHome, type BatchInfo } from './HomeProvider';
import styles from './DiwaliOfferPopup.module.css';

type ParticleKind = 'flash' | 'puff' | 'paper' | 'dot' | 'str';
type Particle = {
  k: ParticleKind;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  r?: number;
  vr?: number;
  w?: number;
  h?: number;
  c?: string;
  age: number;
  max: number;
  ph?: number;
  tr?: { x: number; y: number }[];
};

const CONFETTI_PALETTE = ['#ffd36b', '#fec40d', '#f58020', '#00a2e5', '#ffffff', '#098855', '#d64246', '#ff9a3c', '#c9d6ea'];
const STRING_LIGHTS = Array.from({ length: 10 }, (_, index) => {
  const swag = index < 5 ? 0 : 1;
  const k = (index % 5) + 1;
  const t = k / 6;
  const u = 1 - t;
  const x0 = swag * 220;
  const x1 = x0 + 220;
  const x = u * u * x0 + 2 * u * t * (x0 + 110) + t * t * x1;
  const y = u * u * 6 + 2 * u * t * 40 + t * t * 6;
  const colors = ['#ffd36b', '#ff9a3c', '#fff3c4'];
  return { id: index, x, y, color: colors[index % colors.length], delay: -((index * 0.4) % 3) };
});

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatRupees(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function getOffer(batch: BatchInfo | null) {
  const amount = batch?.subscription_amount_inr;
  const regularAmount = batch?.regular_amount_inr;
  if (!batch?.offer_active || amount == null || regularAmount == null || regularAmount <= amount) return null;
  const savings = regularAmount - amount;
  return { amount, regularAmount, savings, savingsPercent: Math.round((savings / regularAmount) * 100) };
}

function PartyPopper({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <path d="M55 140Q60 147 65 140L96 42A36 11 0 0 1 24 42Z" fill="url(#dop-pb)" />
      <g clipPath="url(#dop-pc)">
        <path d="M0 62L120 30V44L0 76Z" fill="#fec40d" />
        <path d="M0 92L120 60V70L0 102Z" fill="#fff" opacity=".85" />
        <path d="M0 118L120 86V98L0 130Z" fill="#fec40d" />
      </g>
      <path d="M45 52L58 130" stroke="#fff" strokeOpacity=".28" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="60" cy="42" rx="36" ry="11" fill="#ffd36b" />
      <ellipse cx="60" cy="42" rx="31" ry="8" fill="#431216" />
      <g fill="none" strokeWidth="4" strokeLinecap="round">
        <path d="M46 40C38 22 58 20 50 4" stroke={mirrored ? '#f58020' : '#00a2e5'} />
        <path d="M60 38C68 20 48 12 62 -6" stroke={mirrored ? '#00a2e5' : '#fec40d'} />
        <path d="M74 40C86 26 68 16 80 2" stroke={mirrored ? '#fec40d' : '#098855'} />
      </g>
      <rect x="40" y="6" width="6" height="3" fill={mirrored ? '#098855' : '#f58020'} transform="rotate(30 40 6)" />
      <circle cx="86" cy="12" r="3" fill={mirrored ? '#00a2e5' : '#d64246'} />
      <circle className="dopMouth" cx="60" cy="28" r="1" fill="none" />
    </svg>
  );
}

function OfferStringLights() {
  return (
    <svg className={styles.dopLights} viewBox="0 0 440 40" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      {[0, 1].map((swag) => {
        const x0 = swag * 220;
        return <path key={swag} d={`M${x0} 6Q${x0 + 110} 40 ${x0 + 220} 6`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.3" />;
      })}
      {STRING_LIGHTS.map((bulb) => (
        <g key={bulb.id} className={styles.dopBulb} style={{ animationDelay: `${bulb.delay}s` }}>
          <circle cx={bulb.x} cy={bulb.y + 5} r="8" fill={bulb.color} opacity=".22" />
          <circle cx={bulb.x} cy={bulb.y + 5} r="3.8" fill={bulb.color} />
        </g>
      ))}
    </svg>
  );
}

function Rangoli() {
  return (
    <svg className={styles.dopRangoli} viewBox="-150 -150 300 300" aria-hidden="true">
      <defs>
        <g id="dop-pt" fill="none" stroke="#ffd36b" strokeOpacity=".3" strokeWidth=".9">
          <ellipse cx="0" cy="-84" rx="13" ry="38" />
          <ellipse cx="0" cy="-122" rx="7" ry="20" />
          <circle cx="0" cy="-143" r="2" fill="#ffd36b" fillOpacity=".45" />
        </g>
      </defs>
      {Array.from({ length: 12 }, (_, i) => <use key={i} href="#dop-pt" transform={`rotate(${i * 30})`} />)}
      <g fill="none" stroke="#ffd36b" strokeOpacity=".26" strokeWidth=".9">
        <circle r="30" /><circle r="52" /><circle r="140" />
      </g>
    </svg>
  );
}

function HeaderDiyas() {
  return (
    <svg className={styles.dopDiyas} viewBox="0 0 440 50" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id="dop-dh"><stop offset="0" stopColor="#ffd36b" stopOpacity=".9" /><stop offset="1" stopColor="#ffd36b" stopOpacity="0" /></radialGradient>
        <linearGradient id="dop-df" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3c4" /><stop offset=".5" stopColor="#fec40d" /><stop offset="1" stopColor="#f58020" /></linearGradient>
        <linearGradient id="dop-db" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f58020" /><stop offset="1" stopColor="#a8460f" /></linearGradient>
      </defs>
      {[40, 120, 200, 280, 360].map((x) => (
        <g key={x} transform={`translate(${x},0)`}>
          <circle cx="20" cy="22" r="20" fill="url(#dop-dh)" opacity=".55" />
          <path d="M3 30Q20 50 37 30Q20 36 3 30Z" fill="url(#dop-db)" />
          <ellipse cx="20" cy="30" rx="17" ry="3.2" fill="#c4560f" />
          <path className={styles.dopFlame} d="M20 6C25 13 26 18 20 26C14 18 15 13 20 6Z" fill="url(#dop-df)" />
        </g>
      ))}
    </svg>
  );
}

function OfferIcon({ kind }: { kind: 'jobs' | 'coordinator' | 'batch' }) {
  if (kind === 'jobs') {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>;
  }
  if (kind === 'coordinator') {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3" /></svg>;
}

export function DiwaliOfferPopup() {
  const { batch, batchLoading, ready, hideTrialPromos, subscribeHref } = useHome();
  const offer = getOffer(batch);
  const offerReady = Boolean(offer);
  const [mounted, setMounted] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [fontFamily, setFontFamily] = useState('var(--font-display, Inter, sans-serif)');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const leftPopperRef = useRef<HTMLButtonElement>(null);
  const rightPopperRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);
  const popperClassTimersRef = useRef<number[]>([]);
  const burstRef = useRef<((x: number, y: number, direction: number, count: number) => void) | null>(null);
  const openRef = useRef(false);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const home = document.querySelector('.sl-home')?.parentElement;
    const loadedFont = home ? getComputedStyle(home).getPropertyValue('--font-home-display').trim() : '';
    if (loadedFont) setFontFamily(loadedFont);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = window.setTimeout(() => setDelayElapsed(true), 2000);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setEntered(false);
    if (focusTimerRef.current != null) window.clearTimeout(focusTimerRef.current);
    if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      const previous = previouslyFocusedRef.current;
      if (previous?.isConnected) previous.focus();
    }, 300);
  }, []);

  useEffect(() => {
    if (!mounted || !delayElapsed || !ready || batchLoading || !offerReady || hideTrialPromos || !isSeasonalHeroLocalDateActive() || hasOpenedRef.current) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openRef.current = true;
    hasOpenedRef.current = true;
    setVisible(true);
    window.requestAnimationFrame(() => setEntered(true));
    focusTimerRef.current = window.setTimeout(() => ctaRef.current?.focus(), 60);
  }, [mounted, delayElapsed, ready, batchLoading, offerReady, hideTrialPromos]);

  useEffect(() => {
    if (!visible || !entered) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const particles: Particle[] = [];
    let frame = 0;
    let running = false;
    let last = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    const animate = (now: number) => {
      const dt = Math.min(0.033, Math.max(0, (now - last) / 1000));
      last = now;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.age += dt;
        if (p.age > p.max || (p.y > window.innerHeight + 60 && p.k !== 'flash')) {
          particles.splice(i, 1);
          continue;
        }
        const f = p.age / p.max;

        if (p.k === 'flash') {
          const radius = 10 + f * 70;
          const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          gradient.addColorStop(0, `rgba(255,246,207,${0.95 * (1 - f)})`);
          gradient.addColorStop(1, `rgba(255,211,107,${0.75 * (1 - f)})`);
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(p.x, p.y, radius, 0, Math.PI * 2);
          context.fill();
          continue;
        }

        if (p.k === 'puff') {
          p.x += (p.vx ?? 0) * dt;
          p.y += (p.vy ?? 0) * dt;
          p.vx = (p.vx ?? 0) * 0.96;
          p.vy = (p.vy ?? 0) * 0.96;
          const radius = (p.r ?? 10) + f * 46;
          const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          gradient.addColorStop(0, `rgba(255,255,255,${0.34 * (1 - f)})`);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(p.x, p.y, radius, 0, Math.PI * 2);
          context.fill();
          continue;
        }

        const drag = Math.exp(-2.7 * dt);
        p.vx = (p.vx ?? 0) * drag;
        p.vy = (p.vy ?? 0) * drag + 560 * dt;
        p.x += (p.vx ?? 0) * dt + Math.sin(p.age * 5 + (p.ph ?? 0)) * 26 * dt;
        p.y += (p.vy ?? 0) * dt;
        const alpha = f > 0.75 ? 1 - (f - 0.75) / 0.25 : 1;
        context.globalAlpha = alpha;
        context.fillStyle = p.c ?? '#ffd36b';

        if (p.k === 'str') {
          p.tr = p.tr ?? [];
          p.tr.push({ x: p.x, y: p.y });
          if (p.tr.length > 26) p.tr.shift();
          context.beginPath();
          p.tr.forEach((point, index) => {
            const offset = Math.sin(index * 0.75 + (p.ph ?? 0) + p.age * 6) * (2 + index * 0.28);
            if (index === 0) context.moveTo(point.x + offset, point.y + offset * 0.4);
            else context.lineTo(point.x + offset, point.y + offset * 0.4);
          });
          context.strokeStyle = p.c ?? '#ffd36b';
          context.lineWidth = 3.2;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.stroke();
        } else if (p.k === 'dot') {
          context.beginPath();
          context.arc(p.x, p.y, (p.w ?? 5) / 2.4, 0, Math.PI * 2);
          context.fill();
        } else {
          p.r = (p.r ?? 0) + (p.vr ?? 0) * dt;
          const flicker = Math.cos(p.age * 11 + (p.ph ?? 0));
          context.save();
          context.translate(p.x, p.y);
          context.rotate(p.r);
          context.scale(1, Math.max(0.2, Math.abs(flicker)));
          context.fillRect(-(p.w ?? 6) / 2, -(p.h ?? 4) / 2, p.w ?? 6, p.h ?? 4);
          context.restore();
        }
        context.globalAlpha = 1;
      }

      if (particles.length) frame = window.requestAnimationFrame(animate);
      else {
        running = false;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const start = () => {
      if (running || reducedMotion.matches || particles.length === 0) return;
      running = true;
      last = performance.now();
      frame = window.requestAnimationFrame(animate);
    };
    const burst = (x: number, y: number, angle: number, count: number) => {
      if (reducedMotion.matches) return;
      particles.push({ k: 'flash', x, y, age: 0, max: 0.18 });
      for (let j = 0; j < 8; j += 1) {
        particles.push({ k: 'puff', x: x + randomBetween(-6, 6), y: y + randomBetween(-6, 6), vx: Math.cos(angle) * randomBetween(20, 90) + randomBetween(-30, 30), vy: Math.sin(angle) * randomBetween(20, 90) - randomBetween(10, 40), r: randomBetween(10, 20), age: 0, max: randomBetween(0.8, 1.3) });
      }
      for (let m = 0; m < count; m += 1) {
        const spread = Math.random() < 0.8 ? randomBetween(-16, 16) : randomBetween(-34, 34);
        const a = ((angle + spread) * Math.PI) / 180;
        const speed = randomBetween(650, 1650);
        const type = Math.random();
        particles.push({ k: type < 0.72 ? 'paper' : 'dot', x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: randomBetween(0, 6), vr: randomBetween(-14, 14), w: randomBetween(5, 11), h: randomBetween(3, 7), c: CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)], age: 0, max: randomBetween(2.6, 4.2), ph: randomBetween(0, 6.3) });
      }
      for (let z = 0; z < 7; z += 1) {
        const a = ((angle + randomBetween(-22, 22)) * Math.PI) / 180;
        const speed = randomBetween(750, 1500);
        particles.push({ k: 'str', x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, c: CONFETTI_PALETTE[Math.floor(Math.random() * 7)], age: 0, max: randomBetween(2.4, 3.4), ph: randomBetween(0, 6.3), tr: [] });
      }
      start();
    };
    burstRef.current = burst;

    const resizeListener = () => resize();
    window.addEventListener('resize', resizeListener);

    const audioPop = () => {
      try {
        const AudioContextClass = window.AudioContext;
        if (!AudioContextClass) return;
        const audio = new AudioContextClass();
        const now = audio.currentTime;
        const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.16), audio.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) {
          const progress = i / data.length;
          data[i] = (Math.random() * 2 - 1) * (1 - progress) ** 3;
        }
        const noise = audio.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = audio.createGain();
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        noise.connect(noiseGain).connect(audio.destination);
        noise.start(now);

        const oscillator = audio.createOscillator();
        const toneGain = audio.createGain();
        oscillator.frequency.setValueAtTime(170, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.12);
        toneGain.gain.setValueAtTime(0.55, now);
        toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        oscillator.connect(toneGain).connect(audio.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.16);
        window.setTimeout(() => void audio.close(), 500);
      } catch {
        // Some browsers block Web Audio; the visual interaction still works.
      }
    };

    const fire = (side: 'left' | 'right', direction: number, count: number, sound: boolean) => {
      const button = side === 'left' ? leftPopperRef.current : rightPopperRef.current;
      const mouth = button?.querySelector('.dopMouth');
      if (!button || !mouth) return;
      const rect = mouth.getBoundingClientRect();
      burstRef.current?.(rect.left + rect.width / 2, rect.top + rect.height / 2, direction > 0 ? -60 : -120, count);
      if (sound) audioPop();
      if (!reducedMotion.matches) {
        button.classList.remove(styles.dopFire);
        void button.offsetWidth;
        button.classList.add(styles.dopFire);
        const removeTimer = window.setTimeout(() => button.classList.remove(styles.dopFire), 500);
        popperClassTimersRef.current.push(removeTimer);
      }
    };

    const timers = [
      window.setTimeout(() => { fire('left', 1, 75, false); fire('right', -1, 75, false); }, 420),
      window.setTimeout(() => { fire('left', 1, 35, false); fire('right', -1, 35, false); }, 1300),
    ];
    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        particles.length = 0;
        if (frame) window.cancelAnimationFrame(frame);
        running = false;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    reducedMotion.addEventListener('change', onReducedMotionChange);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('resize', resizeListener);
      reducedMotion.removeEventListener('change', onReducedMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
      particles.length = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      burstRef.current = null;
    };
  }, [visible, entered]);

  useEffect(() => {
    if (!visible || !entered) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter((node) => !node.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, entered, close]);

  useEffect(() => () => {
    if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current);
    if (focusTimerRef.current != null) window.clearTimeout(focusTimerRef.current);
    popperClassTimersRef.current.forEach(window.clearTimeout);
  }, []);

  const onBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  if (!mounted || !visible || !offer) return null;

  const seatsOpen = batch?.seats_remaining;
  const batchSize = batch?.max_seats;
  const showSeats = typeof seatsOpen === 'number' && Number.isFinite(seatsOpen) && typeof batchSize === 'number' && Number.isFinite(batchSize) && batchSize > 0;
  const safeBatchSize = showSeats ? Math.max(0, Math.trunc(batchSize as number)) : 0;
  const safeSeatsOpen = showSeats ? Math.max(0, Math.min(safeBatchSize, Math.trunc(seatsOpen as number))) : 0;
  const takenSeats = safeBatchSize - safeSeatsOpen;
  const dialogStyle = { '--dop-font-family': fontFamily } as CSSProperties;
  const batchTileText = typeof batch?.max_seats === 'number' && Number.isFinite(batch.max_seats)
    ? `Batch of up to ${batch.max_seats}`
    : 'Small batch';

  return createPortal(
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="dop-pb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9c2a2e" /><stop offset=".32" stopColor="#e4494f" /><stop offset=".48" stopColor="#ff8576" /><stop offset=".7" stopColor="#d64246" /><stop offset="1" stopColor="#8a1f23" /></linearGradient>
          <clipPath id="dop-pc"><path d="M55 140Q60 147 65 140L96 42A36 11 0 0 1 24 42Z" /></clipPath>
        </defs>
      </svg>
      <canvas ref={canvasRef} className={styles.dopCanvas} aria-hidden="true" />
      <div className={`${styles.dopOverlay} ${styles.dopShow} ${entered ? styles.dopIn : ''}`} style={dialogStyle} onMouseDown={onBackdropMouseDown}>
        <div ref={dialogRef} className={styles.dopWrap} role="dialog" aria-modal="true" aria-labelledby="dop-title" tabIndex={-1}>
          <div className={styles.dopCard}>
            <div className={styles.dopHead}>
              <OfferStringLights />
              <button className={styles.dopClose} type="button" aria-label="Close offer" onClick={close}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
              <Rangoli />
              <div className={styles.dopLabel}>Diwali offer</div>
              <div className={styles.dopBig} id="dop-title"><b>{offer.savingsPercent}%</b><span>OFF</span></div>
              <p className={styles.dopSub}>Shubh Deepavali! Celebrate with {offer.savingsPercent}% off the AI Virtual Placement Cell.</p>
              <HeaderDiyas />
            </div>

            <div className={styles.dopBody}>
              <div className={styles.dopPriceBox}>
                <div className={styles.dopPriceColumn}><small>Regular price</small><span className={styles.dopOldPrice}>{formatRupees(offer.regularAmount)}</span></div>
                <svg className={styles.dopArrow} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                <div className={styles.dopPriceColumn}><small>Diwali price</small><span className={styles.dopNewPrice}>{formatRupees(offer.amount)}</span></div>
              </div>
              <span className={styles.dopSave}>You save {formatRupees(offer.savings)} · one-time payment</span>

              <div className={styles.dopTiles}>
                <div className={styles.dopTile}><i className={styles.dopTileIcon}><OfferIcon kind="jobs" /></i>AI-matched jobs</div>
                <div className={styles.dopTile}><i className={styles.dopTileIcon}><OfferIcon kind="coordinator" /></i>Dedicated coordinator</div>
                <div className={styles.dopTile}><i className={styles.dopTileIcon}><OfferIcon kind="batch" /></i>{batchTileText}</div>
              </div>

              {showSeats && (
                <div className={styles.dopSeats}>
                  <b>{safeSeatsOpen} of {safeBatchSize} seats open</b>
                  <span className={styles.dopDots} aria-hidden="true">
                    {Array.from({ length: safeBatchSize }, (_, i) => <i key={i} className={i < takenSeats ? styles.dopTaken : undefined} />)}
                  </span>
                </div>
              )}
              <Link ref={ctaRef} className={styles.dopCta} href={subscribeHref} onClick={close}>Claim your seat</Link>
              <button className={styles.dopLater} type="button" onClick={close}>Maybe later</button>
              <p className={styles.dopFine}>Terms shown at checkout.</p>
            </div>
          </div>

          <button ref={leftPopperRef} className={`${styles.dopPopper} ${styles.dopPopperLeft}`} type="button" aria-label="Fire the left party popper" onClick={() => firePoppers('left')}>
            <PartyPopper />
          </button>
          <button ref={rightPopperRef} className={`${styles.dopPopper} ${styles.dopPopperRight}`} type="button" aria-label="Fire the right party popper" onClick={() => firePoppers('right')}>
            <PartyPopper mirrored />
          </button>
          <div className={styles.dopHint}>Tap a party popper to celebrate</div>
        </div>
      </div>
    </>,
    document.body,
  );

  function firePoppers(side: 'left' | 'right') {
    const button = side === 'left' ? leftPopperRef.current : rightPopperRef.current;
    const mouth = button?.querySelector('.dopMouth');
    if (!button || !mouth) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const rect = mouth.getBoundingClientRect();
      burstRef.current?.(rect.left + rect.width / 2, rect.top + rect.height / 2, side === 'left' ? -60 : -120, 70);
    }
    // The reference pop sound is only played from this user-initiated popper click.
    playPopSound();
    if (!reduceMotion) {
      button.classList.remove(styles.dopFire);
      void button.offsetWidth;
      button.classList.add(styles.dopFire);
      const removeTimer = window.setTimeout(() => button.classList.remove(styles.dopFire), 500);
      popperClassTimersRef.current.push(removeTimer);
    }
  }
}

function playPopSound() {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const now = audio.currentTime;
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.16), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    const noise = audio.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audio.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    noise.connect(noiseGain).connect(audio.destination);
    noise.start(now);
    const oscillator = audio.createOscillator();
    const toneGain = audio.createGain();
    oscillator.frequency.setValueAtTime(170, now);
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    toneGain.gain.setValueAtTime(0.55, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    oscillator.connect(toneGain).connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
    window.setTimeout(() => void audio.close(), 500);
  } catch {
    // Some browsers block Web Audio; the visual interaction still works.
  }
}
