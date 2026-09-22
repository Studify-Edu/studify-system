/**
 * =======================================================================
 * STUDIFY ASSISTANT SOUND ENGINE (محرك الصوتيات السينمائي المتكامل)
 * =======================================================================
 * Standalone, zero-latency procedural audio engine for the Assistant Portal.
 * Uses Web Audio API synthesis: 100% offline, zero network requests,
 * no external audio asset dependencies, perfectly tuned cinematic tones.
 * 
 * Includes:
 *  - iOS-style haptic micro-interactions (clicks, taps, inputs, toggles)
 *  - Night / Morning theme transformation chords
 *  - Cloud sync ascent & celestial completion chimes
 *  - Cash drawer slide & iconic "Cha-Ching" coin registers
 *  - Verified attendance double-ding & warnings
 *  - Student profile cards, VIP regal chimes, debt clearance fanfares
 *  - Intelligent DOM event delegation with throttling
 *  - Full integration with mute controls (window.isMuted)
 * =======================================================================
 */

(function (window, document) {
  'use strict';

  // Private Audio Context & Nodes
  let ctx = null;
  let masterGain = null;
  let masterCompressor = null;
  let isInitialized = false;

  // Master Volume (comfortable ergonomic levels)
  const MASTER_VOLUME = 0.28;

  // Throttling trackers to prevent cacophony
  let lastTypingTime = 0;
  let lastClickTime = 0;

  /**
   * Safe initialization on first user gesture
   */
  function initAudioContext() {
    if (ctx && ctx.state !== 'closed') {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      ctx = new AudioContextClass();

      // Master Compressor to prevent clipping & ensure silky cinematic polish
      masterCompressor = ctx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-18, ctx.currentTime);
      masterCompressor.knee.setValueAtTime(12, ctx.currentTime);
      masterCompressor.ratio.setValueAtTime(6, ctx.currentTime);
      masterCompressor.attack.setValueAtTime(0.003, ctx.currentTime);
      masterCompressor.release.setValueAtTime(0.15, ctx.currentTime);

      // Master Gain
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(MASTER_VOLUME, ctx.currentTime);

      masterCompressor.connect(masterGain);
      masterGain.connect(ctx.destination);

      isInitialized = true;
      return ctx;
    } catch (e) {
      console.warn('[AssistantSounds] AudioContext initialization failed:', e);
      return null;
    }
  }

  // Resume on any user interaction
  const unlockEvents = ['click', 'keydown', 'touchstart', 'pointerdown'];
  function unlockAudio() {
    if (!ctx) initAudioContext();
    else if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    unlockEvents.forEach(evt => window.removeEventListener(evt, unlockAudio, { passive: true }));
  }
  unlockEvents.forEach(evt => window.addEventListener(evt, unlockAudio, { passive: true, once: true }));

  /**
   * Helper: Check if sound should play
   */
  function canPlay() {
    if (window.isMuted) return false;
    const stored = localStorage.getItem('ca_muted');
    if (stored === '1') return false;
    return true;
  }

  /**
   * Helper: Create noise buffer for swooshes / mechanical clicks
   */
  function createNoiseBuffer(duration = 0.2) {
    if (!ctx) return null;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // =======================================================================
  // CORE SYNTHESIS ENGINE & SOUND BANK
  // =======================================================================
  const AssistantSounds = {
    version: '1.0.0-cinematic',

    isMuted: function () {
      return !canPlay();
    },

    setVolume: function (vol) {
      if (masterGain && ctx) {
        const clamped = Math.max(0, Math.min(1, vol));
        masterGain.gain.setTargetAtTime(clamped * MASTER_VOLUME, ctx.currentTime, 0.05);
      }
    },

    /**
     * 1. Haptic Micro-Tap (Apple iOS style tactile tick)
     */
    tap: function (pitchMult = 1.0) {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const jitter = (Math.random() - 0.5) * 0.04;
      const freq = 160 * (pitchMult + jitter);

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.018);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(gain);
      gain.connect(masterCompressor);

      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1800 * (pitchMult + jitter), now);
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.008);

      gain2.gain.setValueAtTime(0.06, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      osc2.connect(gain2);
      gain2.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.02);
      osc2.start(now);
      osc2.stop(now + 0.01);
    },

    click: function () {
      this.tap(1.15);
    },

    /**
     * 2. Soft Typing Tick (Typing tactile response on inputs)
     */
    typingTick: function () {
      const nowMs = Date.now();
      if (nowMs - lastTypingTime < 65) return;
      lastTypingTime = nowMs;

      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const jitter = (Math.random() - 0.5) * 0.08;

      const osc = c.createOscillator();
      const filter = c.createBiquadFilter();
      const gain = c.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 * (1 + jitter), now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.012);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.014);
    },

    /**
     * 3. Navigation Tab Switch (Smooth airy dimensional glide)
     */
    tabSwitch: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterCompressor);

      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(280, now + 0.06);

      gain2.gain.setValueAtTime(0.05, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc2.connect(gain2);
      gain2.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.13);
      osc2.start(now);
      osc2.stop(now + 0.09);
    },

    /**
     * 4. Theme: Night Mode (Deep celestial starry chime)
     */
    themeNight: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [164.81, 246.94, 415.30, 622.25];

      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        const filter = c.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 0.7);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.11 / (idx + 1), startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterCompressor);

        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });

      setTimeout(() => {
        if (!canPlay() || !ctx) return;
        const tNow = ctx.currentTime;
        const tw = ctx.createOscillator();
        const twGain = ctx.createGain();
        tw.type = 'sine';
        tw.frequency.setValueAtTime(1244.5, tNow);
        twGain.gain.setValueAtTime(0.04, tNow);
        twGain.gain.exponentialRampToValueAtTime(0.0001, tNow + 0.35);
        tw.connect(twGain);
        twGain.connect(masterCompressor);
        tw.start(tNow);
        tw.stop(tNow + 0.38);
      }, 140);
    },

    /**
     * 5. Theme: Morning / Light Mode (Golden sunrise bright chime)
     */
    themeMorning: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        const startTime = now + idx * 0.045;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(masterCompressor);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    },

    /**
     * 6. Language Switch (Bilingual harmonic morph)
     */
    langSwitch: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc1 = c.createOscillator();
      const gain1 = c.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc1.connect(gain1);
      gain1.connect(masterCompressor);

      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.16);

      gain2.gain.setValueAtTime(0.001, now + 0.06);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(masterCompressor);

      osc1.start(now);
      osc1.stop(now + 0.15);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.24);
    },

    /**
     * 7. Cloud Sync: Start Upload (Ascending futuristic cyber sweep)
     */
    cloudSyncStart: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const filter = c.createBiquadFilter();
      const gain = c.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.24);
    },

    /**
     * 8. Cloud Sync: Success (Celestial completion sparkle)
     */
    cloudSyncSuccess: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [783.99, 1046.50, 1318.51, 1567.98];

      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        const startTime = now + idx * 0.05;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.11, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(masterCompressor);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    },

    /**
     * 9. Cloud Sync: Error (Muted descending drop)
     */
    cloudSyncError: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.24);
    },

    /**
     * 10. Attendance: Barcode / Quick ID Scan Chirp
     */
    attendanceScan: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.06);
    },

    /**
     * 11. Attendance: Verified Success (Crystal-clear double ding)
     */
    attendanceSuccess: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      // First Ding: A5 (880Hz)
      const osc1 = c.createOscillator();
      const gain1 = c.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.16, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(masterCompressor);
      osc1.start(now);
      osc1.stop(now + 0.28);

      // Second Ding: E6 (1318.5Hz) - 80ms delay
      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);
      gain2.gain.setValueAtTime(0.001, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.20, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(masterCompressor);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.48);
    },

    /**
     * 12. Attendance: Warning / Already Registered
     */
    attendanceWarning: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [440, 370];
      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        const st = now + idx * 0.1;
        gain.gain.setValueAtTime(0.12, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.12);

        osc.connect(gain);
        gain.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.14);
      });
    },

    /**
     * 13. Attendance: Remove / Undo Attendance
     */
    attendanceRemove: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.12);
    },

    /**
     * 14. Student Card: Open Profile
     */
    studentOpen: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.13);
    },

    /**
     * 15. Student Card: Close Profile
     */
    studentClose: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.09);
    },

    /**
     * 16. Student Form: New Registration Form Unfold (Blueprint Chime)
     */
    newStudentForm: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [493.88, 739.99]; // B4, F#5
      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        const st = now + idx * 0.06;
        gain.gain.setValueAtTime(0.001, st);
        gain.gain.linearRampToValueAtTime(0.14, st + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.28);

        osc.connect(gain);
        gain.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.3);
      });
    },

    /**
     * 17. Student Saved: Success Lock + Chime
     */
    studentSave: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      this.tap(0.85);

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now + 0.03); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      const st = now + 0.03;
      gain.gain.setValueAtTime(0.001, st);
      gain.gain.linearRampToValueAtTime(0.14, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);

      osc.connect(gain);
      gain.connect(masterCompressor);

      osc.start(st);
      osc.stop(st + 0.38);
    },

    /**
     * 18. Rank VIP: Luxury Regal Harp & Gold Chime
     */
    rankVIP: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [739.99, 932.33, 1108.73, 1479.98];

      notes.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        const st = now + idx * 0.05;
        gain.gain.setValueAtTime(0.001, st);
        gain.gain.linearRampToValueAtTime(0.13, st + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.45);

        osc.connect(gain);
        gain.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.5);
      });
    },

    /**
     * 19. Rank Warn: Caution amber tone
     */
    rankWarn: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(311.13, now); // D#4

      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(masterCompressor);
      osc.start(now);
      osc.stop(now + 0.25);
    },

    /**
     * 20. Revenue Drawer Open (Mechanical slide + coin clink)
     */
    revenueOpen: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const noise = createNoiseBuffer(0.12);
      if (noise) {
        const src = c.createBufferSource();
        src.buffer = noise;

        const filter = c.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(2.0, now);

        const nGain = c.createGain();
        nGain.gain.setValueAtTime(0.08, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        src.connect(filter);
        filter.connect(nGain);
        nGain.connect(masterCompressor);
        src.start(now);
      }

      const coins = [1900, 2400];
      coins.forEach((f, idx) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.05 + idx * 0.03);

        const st = now + 0.05 + idx * 0.03;
        g.gain.setValueAtTime(0.07, st);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.16);

        osc.connect(g);
        g.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.18);
      });
    },

    /**
     * 21. Cash Payment / Money Added ("Cha-Ching" + Silver Coin Cascade)
     */
    cashPayment: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      // "Cha"
      const snap = c.createOscillator();
      const snapGain = c.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(450, now);
      snap.frequency.exponentialRampToValueAtTime(120, now + 0.03);
      snapGain.gain.setValueAtTime(0.18, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      snap.connect(snapGain);
      snapGain.connect(masterCompressor);
      snap.start(now);
      snap.stop(now + 0.035);

      // "Ching"
      const ringNotes = [2093.0, 2637.02];
      ringNotes.forEach(f => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.035);

        g.gain.setValueAtTime(0.15, now + 0.035);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(g);
        g.connect(masterCompressor);
        osc.start(now + 0.035);
        osc.stop(now + 0.7);
      });

      // Coin drops
      const coinDrops = [1850, 2300, 2150];
      coinDrops.forEach((freq, i) => {
        const cOsc = c.createOscillator();
        const cGain = c.createGain();
        cOsc.type = 'sine';
        const dropTime = now + 0.08 + i * 0.045;
        cOsc.frequency.setValueAtTime(freq, dropTime);

        cGain.gain.setValueAtTime(0.06, dropTime);
        cGain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.18);

        cOsc.connect(cGain);
        cGain.connect(masterCompressor);
        cOsc.start(dropTime);
        cOsc.stop(dropTime + 0.2);
      });
    },

    /**
     * 22. Debt Cleared / Full Package Paid (Triumphal Fanfare & Celebration)
     */
    debtCleared: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const fanfare = [523.25, 783.99, 1046.50, 1318.51];
      fanfare.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        const st = now + idx * 0.06;
        gain.gain.setValueAtTime(0.001, st);
        gain.gain.linearRampToValueAtTime(0.14, st + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.45);

        osc.connect(gain);
        gain.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.5);
      });

      setTimeout(() => {
        this.cashPayment();
      }, 180);
    },

    /**
     * 23. WhatsApp & Messaging: Ping / Whoosh
     */
    messageSend: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterCompressor);
      osc.start(now);
      osc.stop(now + 0.14);

      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1350, now + 0.07);
      gain2.gain.setValueAtTime(0.15, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(masterCompressor);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.3);
    },

    /**
     * 24. Marketing Pulse / Digital Radar Broadcast
     */
    marketingPulse: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const filter = c.createBiquadFilter();
      const gain = c.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150, now);
      filter.Q.setValueAtTime(8.0, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterCompressor);

      osc.start(now);
      osc.stop(now + 0.38);
    },

    /**
     * 25. Modal Open: Dimensional spatial zoom
     */
    modalOpen: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(masterCompressor);
      osc.start(now);
      osc.stop(now + 0.14);
    },

    /**
     * 26. Modal Close: Soft suction dismiss pop
     */
    modalClose: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(masterCompressor);
      osc.start(now);
      osc.stop(now + 0.08);
    },

    /**
     * 27. Delete / Eraser Swoosh
     */
    deleteSwoosh: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const noise = createNoiseBuffer(0.09);
      if (noise) {
        const src = c.createBufferSource();
        src.buffer = noise;

        const filter = c.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        filter.Q.setValueAtTime(1.5, now);

        const g = c.createGain();
        g.gain.setValueAtTime(0.12, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        src.connect(filter);
        filter.connect(g);
        g.connect(masterCompressor);
        src.start(now);
      }
    },

    /**
     * 28. Mute Toggle Announcement
     */
    muteAnnouncement: function (isNowMuted) {
      if (isNowMuted) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;
      const notes = [659.25, 987.77]; // E5, B5
      notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        const st = now + i * 0.07;
        g.gain.setValueAtTime(0.12, st);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.28);

        osc.connect(g);
        g.connect(masterCompressor);
        osc.start(st);
        osc.stop(st + 0.3);
      });
    },

    /**
     * 29. Polite Error Drop
     */
    error: function () {
      if (!canPlay()) return;
      const c = initAudioContext();
      if (!c) return;

      const now = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(masterCompressor);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  // =======================================================================
  // BACKWARD COMPATIBILITY BRIDGE
  // =======================================================================
  window.playSound = function (type) {
    if (!canPlay()) return;
    switch (type) {
      case 'money':
      case 'cash':
        AssistantSounds.cashPayment();
        break;
      case 'success':
        AssistantSounds.attendanceSuccess();
        break;
      case 'pop':
        AssistantSounds.tap(1.2);
        break;
      case 'error':
        AssistantSounds.error();
        break;
      case 'beep':
        AssistantSounds.attendanceScan();
        break;
      case 'tap':
      case 'click':
      default:
        AssistantSounds.tap(1.0);
        break;
    }
  };

  // =======================================================================
  // INTELLIGENT DOM EVENT DELEGATION
  // =======================================================================
  function setupDOMDelegation() {
    document.addEventListener('click', function (e) {
      if (!canPlay()) return;

      const now = Date.now();
      if (now - lastClickTime < 45) return;
      lastClickTime = now;

      const target = e.target;
      if (!target) return;

      // Close buttons / Dismiss
      if (target.closest('.close-modal-btn, .closeModalBtn, [data-dismiss], .btn-close, .modal-close')) {
        AssistantSounds.modalClose();
        return;
      }

      // Checkboxes & Toggles
      if (target.matches('input[type="checkbox"], input[type="radio"]') || target.closest('.toggle-switch, .switch')) {
        AssistantSounds.tap(1.3);
        return;
      }

      // Navigation tabs
      if (target.closest('.nav-item, .tab-btn, .sidebar-link, [data-tab]')) {
        AssistantSounds.tabSwitch();
        return;
      }

      // Action Buttons, Chips, Icons
      const btn = target.closest('button, .btn, .chip, .badge-btn, .icon-btn, .topbar-icon-btn, select');
      if (btn) {
        const id = btn.id || '';
        if (id === 'topbarThemeToggle' || id === 'topbarLangToggle' || id === 'changeLangBtn' ||
            id === 'cloudSyncIndicator' || id === 'openRevenueModalBtn' || id === 'toggleSoundsBtn') {
          return;
        }
        AssistantSounds.tap(1.0);
      }
    }, { capture: true, passive: true });

    // Typing Keystroke Listener
    document.addEventListener('keydown', function (e) {
      if (!canPlay()) return;
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) return;

      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
        AssistantSounds.typingTick();
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDOMDelegation);
  } else {
    setupDOMDelegation();
  }

  window.AssistantSounds = AssistantSounds;

})(window, document);
