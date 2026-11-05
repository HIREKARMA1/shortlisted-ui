/**
 * Single owner for the mock-interview analysing ambient pad.
 * Independent of interviewer TTS mute.
 */

type ThinkingHandle = {
  ctx: AudioContext;
  stop: () => void;
};

export class InterviewAudioStateManager {
  private thinking: ThinkingHandle | null = null;
  private loopTimer: number | null = null;
  private analyzing = false;

  get isAnalyzing() {
    return this.analyzing;
  }

  async startAnalyzing() {
    if (this.analyzing && this.thinking) return;
    this.stopAnalyzing();
    this.analyzing = true;
    await this.spawnPad();
    // Keep a soft loop alive for long LLM waits (restart envelope every 6s).
    this.loopTimer = window.setInterval(() => {
      if (!this.analyzing) return;
      void this.spawnPad();
    }, 6000);
  }

  ensureAnalyzing() {
    if (!this.analyzing) {
      void this.startAnalyzing();
      return;
    }
    if (!this.thinking) void this.spawnPad();
  }

  stopAnalyzing() {
    this.analyzing = false;
    if (this.loopTimer != null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.thinking?.stop();
    this.thinking = null;
  }

  dispose() {
    this.stopAnalyzing();
  }

  private async spawnPad() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 360;
      filter.Q.value = 0.7;
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
      oscA.start();
      oscB.start();

      const now = ctx.currentTime;
      master.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      master.gain.setValueAtTime(0.01, now + 0.5);
      master.gain.linearRampToValueAtTime(0.008, now + 2.5);
      master.gain.linearRampToValueAtTime(0.01, now + 4);
      master.gain.exponentialRampToValueAtTime(0.004, now + 5.5);

      const previous = this.thinking;
      this.thinking = {
        ctx,
        stop: () => {
          try {
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
            master.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
            oscA.stop(t + 0.3);
            oscB.stop(t + 0.3);
          } catch {
            /* ignore */
          }
          void ctx.close().catch(() => undefined);
        },
      };
      previous?.stop();
    } catch {
      /* Web Audio unavailable */
    }
  }
}
