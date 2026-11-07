/**
 * Single owner for the mock-interview analysing ambient pad.
 * Independent of interviewer TTS mute.
 * Uses one shared AudioContext for the room lifetime so autoplay unlock sticks.
 */

type PadNodes = {
  master: GainNode;
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

export class InterviewAudioStateManager {
  private sharedCtx: AudioContext | null = null;
  private pad: PadNodes | null = null;
  private analyzing = false;
  private envelopeTimer: number | null = null;

  get isAnalyzing() {
    return this.analyzing;
  }

  /** Unlock / attach a shared context from a user gesture (mic open or submit). */
  async ensureContext(existing?: AudioContext | null) {
    try {
      if (existing && existing.state !== 'closed') {
        this.sharedCtx = existing;
      }
      if (!this.sharedCtx || this.sharedCtx.state === 'closed') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.sharedCtx = new AudioCtx();
      }
      if (this.sharedCtx.state === 'suspended') {
        await this.sharedCtx.resume();
      }
      return this.sharedCtx;
    } catch {
      return null;
    }
  }

  async startAnalyzing() {
    if (this.analyzing && this.pad) {
      await this.resumeIfNeeded();
      return;
    }
    this.analyzing = true;
    await this.ensureContext();
    await this.startPad();
    // Soft gain pulse on the same oscillators — never tear down / recreate contexts.
    this.envelopeTimer = window.setInterval(() => {
      if (!this.analyzing || !this.pad || !this.sharedCtx) return;
      void this.resumeIfNeeded();
      this.pulseEnvelope();
    }, 5000);
  }

  ensureAnalyzing() {
    if (!this.analyzing) {
      void this.startAnalyzing();
      return;
    }
    void this.resumeIfNeeded();
    if (!this.pad) void this.startPad();
  }

  stopAnalyzing() {
    this.analyzing = false;
    if (this.envelopeTimer != null) {
      window.clearInterval(this.envelopeTimer);
      this.envelopeTimer = null;
    }
    this.stopPad();
  }

  dispose() {
    this.stopAnalyzing();
    if (this.sharedCtx && this.sharedCtx.state !== 'closed') {
      void this.sharedCtx.close().catch(() => undefined);
    }
    this.sharedCtx = null;
  }

  private async resumeIfNeeded() {
    const ctx = this.sharedCtx;
    if (!ctx || ctx.state === 'closed') return;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
    }
  }

  private pulseEnvelope() {
    if (!this.pad || !this.sharedCtx) return;
    const { master } = this.pad;
    const now = this.sharedCtx.currentTime;
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.02), now);
      master.gain.linearRampToValueAtTime(0.048, now + 0.4);
      master.gain.linearRampToValueAtTime(0.038, now + 2.2);
      master.gain.linearRampToValueAtTime(0.045, now + 4.5);
    } catch {
      /* ignore */
    }
  }

  private async startPad() {
    try {
      const ctx = await this.ensureContext();
      if (!ctx || !this.analyzing) return;
      if (this.pad) {
        this.pulseEnvelope();
        return;
      }

      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      filter.Q.value = 0.6;
      filter.connect(master);

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const gainA = ctx.createGain();
      const gainB = ctx.createGain();
      oscA.type = 'sine';
      oscB.type = 'sine';
      oscA.frequency.value = 174;
      oscB.frequency.value = 220;
      gainA.gain.value = 0.55;
      gainB.gain.value = 0.35;
      oscA.connect(gainA);
      oscB.connect(gainB);
      gainA.connect(filter);
      gainB.connect(filter);

      // Slow tremolo so the pad stays noticeable during long waits.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.35;
      lfoGain.gain.value = 0.012;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);

      oscA.start();
      oscB.start();
      lfo.start();

      const now = ctx.currentTime;
      master.gain.exponentialRampToValueAtTime(0.045, now + 0.35);
      master.gain.setValueAtTime(0.045, now + 0.35);
      master.gain.linearRampToValueAtTime(0.038, now + 2.5);
      master.gain.linearRampToValueAtTime(0.045, now + 4);

      this.pad = { master, oscA, oscB, lfo, lfoGain };
    } catch {
      this.pad = null;
    }
  }

  private stopPad() {
    const pad = this.pad;
    this.pad = null;
    if (!pad || !this.sharedCtx) return;
    try {
      const t = this.sharedCtx.currentTime;
      pad.master.gain.cancelScheduledValues(t);
      pad.master.gain.setValueAtTime(Math.max(pad.master.gain.value, 0.0001), t);
      pad.master.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      pad.oscA.stop(t + 0.25);
      pad.oscB.stop(t + 0.25);
      pad.lfo.stop(t + 0.25);
    } catch {
      /* ignore */
    }
  }
}
