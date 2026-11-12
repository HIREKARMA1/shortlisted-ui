'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { plans } from '@/lib/home/content';
import { TERMS_URL } from '@/lib/legal-links';
import { useHome } from './HomeProvider';
import { OutlineLink, PrimaryLink } from './primitives';
import styles from './PlansAndBatch.module.css';

const COUNTDOWN_END = new Date(2026, 10, 30, 23, 59, 59).getTime();
const STRING_LIGHT_COLORS = ['#ffd45a', '#ff9a3c', '#fff1b8', '#ff7a45'];

type Countdown = [number, number, number, number];
type Bulb = { x: number; y: number; color: string; delay: number; id: number };

function buildLights(width: number) {
  const segments = Math.max(5, Math.round(width / 260));
  const segmentWidth = width / segments;
  let path = 'M0 8';
  const bulbs: Bulb[] = [];
  let index = 0;

  for (let segment = 0; segment < segments; segment += 1) {
    path += ` Q${segment * segmentWidth + segmentWidth / 2} 58 ${(segment + 1) * segmentWidth} 8`;
    for (let bulbIndex = 1; bulbIndex < 6; bulbIndex += 1) {
      const t = bulbIndex / 6;
      const x = segment * segmentWidth + t * segmentWidth;
      const y = 2 * t * (1 - t) * 58 + 8;
      bulbs.push({ x, y, color: STRING_LIGHT_COLORS[index % STRING_LIGHT_COLORS.length], delay: (index % 7) * 0.35, id: index });
      index += 1;
    }
  }

  return { path, bulbs };
}

function PlansStringLights() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const { path, bulbs } = buildLights(width);
  return (
    <svg className={styles.stringLights} viewBox={`0 0 ${width} 90`} preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d={path} fill="none" stroke="#0a1238" strokeWidth="2" />
      {bulbs.map((bulb) => (
        <g key={bulb.id} className={styles.bulb} style={{ animationDelay: `${bulb.delay}s` }}>
          <circle cx={bulb.x} cy={bulb.y + 10} r="13" fill={bulb.color} opacity=".25" />
          <path d={`M${bulb.x - 4} ${bulb.y + 4}h8l2 10a6 6 0 1 1-12 0z`} fill={bulb.color} />
        </g>
      ))}
    </svg>
  );
}

function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const particles: { x: number; y: number; r: number; v: number; o: number }[] = [];
    const size = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
    };
    size();
    for (let i = 0; i < 45; i += 1) {
      particles.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2.2 + 0.6, v: Math.random() * 0.5 + 0.2, o: Math.random() * Math.PI * 2 });
    }

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.v;
        particle.o += 0.03;
        particle.x += Math.sin(particle.o) * 0.3;
        if (particle.y < -5) {
          particle.y = height + 5;
          particle.x = Math.random() * width;
        }
        context.beginPath();
        context.fillStyle = `rgba(255,205,90,${0.35 + Math.sin(particle.o) * 0.3})`;
        context.shadowColor = '#ffb21f';
        context.shadowBlur = 8;
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });
      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener('resize', size);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', size);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.embers} aria-hidden="true" />;
}

function Diya() {
  return (
    <svg className={styles.diya} viewBox="0 0 60 60" aria-hidden="true">
      <g className={styles.flame}>
        <path d="M30 4c8 9 9 15 0 22-9-7-8-13 0-22z" fill="#ffb21f" />
        <path d="M30 12c4 5 4 8 0 12-4-4-4-7 0-12z" fill="#fff3b0" />
      </g>
      <path d="M6 30h48c0 12-10 20-24 20S6 42 6 30z" fill="#c2561b" />
      <path d="M6 30h48" stroke="#f6c453" strokeWidth="3" />
    </svg>
  );
}

function getCountdown(): Countdown {
  const remaining = Math.max(0, COUNTDOWN_END - Date.now());
  return [
    Math.floor(remaining / 86_400_000),
    Math.floor((remaining % 86_400_000) / 3_600_000),
    Math.floor((remaining % 3_600_000) / 60_000),
    Math.floor((remaining % 60_000) / 1000),
  ];
}

export function PlansAndBatch() {
  const { batch, paymentConfig, hideTrialPromos, trialHref, dashboardHref, subscribeHref } = useHome();
  const [countdown, setCountdown] = useState<Countdown>([0, 0, 0, 0]);
  const amount = batch?.subscription_amount_inr ?? paymentConfig?.amount_inr;
  const regularAmount = batch?.regular_amount_inr ?? paymentConfig?.regular_amount_inr;
  const offerActive = batch?.offer_active ?? paymentConfig?.offer_active;
  const showOffer = Boolean(offerActive && amount != null && regularAmount != null && regularAmount > amount);
  const savings = showOffer ? regularAmount! - amount! : 0;
  const savingsPercent = showOffer ? Math.round((savings / regularAmount!) * 100) : 0;

  useEffect(() => {
    const tick = () => setCountdown(getCountdown());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="plans"
      className={`${styles.plansSection} scroll-mt-[88px]`}
      aria-label="Plans and pricing"
    >
      <EmberCanvas />
      <PlansStringLights />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>Pricing · Diwali Special</div>
          <h2 className={styles.title}>Light up your career this <span className={styles.titleAccent}>Diwali</span></h2>
          <p className={styles.subtitle}>Try the free trial first, then subscribe once to unlock the full placement cell, at our biggest festive price.</p>
          <div className={styles.timer} aria-label="Offer countdown">
            {countdown.map((value, index) => (
              <div className={styles.timerBox} key={index}>
                <b>{String(value).padStart(2, '0')}</b>
                <small>{['Days', 'Hours', 'Mins', 'Secs'][index]}</small>
              </div>
            ))}
          </div>
          <div className={styles.timerLabel}>DIWALI OFFER ENDS IN</div>
        </header>

        <div className={styles.planGrid}>
          <article className={`${styles.card} ${styles.freeCard}`}>
            <div className={styles.tag}>{plans.trial.eyebrow}</div>
            <h3 className={styles.cardTitle}>{plans.trial.name}</h3>
            <div className={styles.price}>
              <span className={styles.priceBig}>Free</span>
              <small>{plans.trial.note}</small>
            </div>
            <ul className={styles.featureList}>
              {plans.trial.items.map((item) => (
                <li className={styles.featureItem} key={item}>
                  <i className={styles.checkIcon}><Check aria-hidden /></i>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.note}>{plans.trial.description}</p>
            <OutlineLink href={hideTrialPromos ? dashboardHref : trialHref} className={styles.button}>
              {hideTrialPromos ? 'Go to dashboard' : plans.trial.cta}
            </OutlineLink>
          </article>

          <div className={styles.proShell}>
            <article className={`${styles.card} ${styles.proCard}`}>
              <Diya />
              <div className={styles.ribbon}>
                {showOffer ? `🪔 ${(batch?.offer_name || 'DIWALI OFFER').toUpperCase()} · SAVE ${savingsPercent}%` : plans.full.ribbon}
              </div>
              <div className={`${styles.tag} ${styles.proTag}`}>Full placement cell</div>
              <h3 className={styles.cardTitle}>{plans.full.name}</h3>
              <div className={styles.price}>
                {showOffer && <span className={styles.oldPrice}>₹{regularAmount!.toLocaleString('en-IN')}</span>}
                <span className={styles.priceBig}>{amount != null ? `₹${amount.toLocaleString('en-IN')}` : 'At checkout'}</span>
              </div>
              {showOffer && <span className={styles.save}>You save ₹{savings.toLocaleString('en-IN')} with this offer</span>}
              <ul className={styles.featureList}>
                {plans.full.items.map((item) => (
                  <li className={styles.featureItem} key={item}>
                    <i className={styles.checkIcon}><Check aria-hidden /></i>
                    {item}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>
                Split-fee enrollment applies. Remaining program fee is payable upon confirmed placement.{' '}
                <Link href={TERMS_URL} className={styles.noteLink}>
                  Read our Terms &amp; Conditions
                </Link>{' '}
                before you subscribe.
              </p>
              <PrimaryLink href={hideTrialPromos ? dashboardHref : subscribeHref} className={`${styles.button} ${styles.primaryButton}`}>
                {hideTrialPromos ? 'Go to dashboard' : 'Claim Your Seat'}
              </PrimaryLink>
            </article>
          </div>
        </div>

        <div className={styles.trust}>✨ Limited Diwali seats · Wishing you a bright and successful career ✨</div>
      </div>
    </section>
  );
}
