/**
 * =======================================================================
 * STUDIFY — CINEMATIC SFX ENGINE v4.0
 * =======================================================================
 *
 * PHILOSOPHY — WHY THIS IS DIFFERENT:
 * ─────────────────────────────────────────────────────────────────────
 * Every previous version used musical notes: chimes, arpeggios, bells.
 * That is why they sounded like games. Real premium UI audio (Apple
 * Vision Pro, Stripe, Linear, Bloomberg, Figma) does NOT use music.
 *
 * This engine uses ONLY:
 *
 *  ① Sub-bass physical impacts  (40–100 Hz sine + pitch envelope)
 *     → You FEEL it, not just hear it. Camera shutters. Vault locks.
 *
 *  ② FM synthesis               (Frequency Modulation)
 *     → Complex metallic timbre without any oscillator sounding "pure"
 *     → The technique behind DX7, Bell textures, and all cinema hits
 *
 *  ③ Spectral noise sculpting   (multi-stage cascaded filters)
 *     → Organic air, breath, mechanism — not bandpass beeps
 *
 *  ④ Waveshaper saturation      (analog warmth curve)
 *     → Rounds hard edges, adds presence and density
 *
 *  ⑤ Stereo field automation    (L/R micro-offset panning)
 *     → Sounds move through space, not flat mono blobs
 *
 *  ⑥ Strategic silence          (restraint = confidence)
 *     → Micro-interactions: nearly inaudible. Big moments: hit hard.
 *
 * NO MUSICAL NOTES. NO CHIMES. NO ARPEGGIOS. NO KARPLUS-STRONG.
 *
 * References: Zaza Sound (cinema FX), Boom Library, Apple HIG Audio,
 *             Jon Hopkins production style, Hans Zimmer Interstellar SFX.
 * =======================================================================
 */

(function (window, document) {
  'use strict';

  // ── Audio graph ────────────────────────────────────────────────────────
  var ctx          = null;
  var masterGain   = null;
  var masterComp   = null;
  var convReverb   = null;
  var dryBus       = null;
  var wetBus       = null;

  // ── Throttle ───────────────────────────────────────────────────────────
  var lastTypingMs = 0;
  var lastTapMs    = 0;
  var TYPING_GAP   = 55;
  var TAP_GAP      = 38;

  // ── Master volume (cinematic: quieter = more premium) ──────────────────
  var MASTER = 0.26;

  // ── Haptic patterns (Android vibration) ───────────────────────────────
  var HX = {
    micro:   [4],
    type:    [3],
    confirm: [10, 30, 10],
    warn:    [20, 25, 20],
    heavy:   [18],
    release: [15, 40, 30, 40, 25],
    lock:    [12],
    delete:  [14],
    modal:   [7],
  };

  function vibe(p) {
    try { if (navigator.vibrate) navigator.vibrate(p); } catch (_) {}
  }

  // ── Init ───────────────────────────────────────────────────────────────
  function boot() {
    if (ctx && ctx.state !== 'closed') {
      if (ctx.state === 'suspended') ctx.resume().catch(noop);
      return ctx;
    }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();

      // Compressor — cinematic "glue": gentle ratio, fast release
      masterComp = ctx.createDynamicsCompressor();
      masterComp.threshold.setValueAtTime(-24, ctx.currentTime);
      masterComp.knee.setValueAtTime(8, ctx.currentTime);
      masterComp.ratio.setValueAtTime(4, ctx.currentTime);
      masterComp.attack.setValueAtTime(0.001, ctx.currentTime);
      masterComp.release.setValueAtTime(0.08, ctx.currentTime);

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(MASTER, ctx.currentTime);

      // Dry bus (no reverb — most sounds go here)
      dryBus = ctx.createGain();
      dryBus.gain.setValueAtTime(1.0, ctx.currentTime);

      // Wet bus — cinematic plate reverb, only for BIG moments
      buildCinematicReverb();

      masterComp.connect(masterGain);
      dryBus.connect(masterComp);
      masterGain.connect(ctx.destination);

      return ctx;
    } catch (e) { return null; }
  }

  function noop() {}

  /**
   * Build a LONG cinematic reverb — 2.8 second plate.
   * Used ONLY on climactic events: debtCleared, jackpot, etc.
   * All other sounds are completely DRY (professional restraint).
   */
  function buildCinematicReverb() {
    var rate    = ctx.sampleRate;
    var len     = Math.floor(rate * 2.8);
    var buf     = ctx.createBuffer(2, len, rate);

    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        // Sparse early reflections + dense late reverb
        var early = (i < rate * 0.08) ? (Math.random() * 2 - 1) * (1 - t * 4) : 0;
        var late  = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2) * 0.7;
        // Metallic shimmer component
        var shim  = Math.sin(i * 0.008 + ch * 2.3) * 0.025 * Math.pow(1 - t, 5);
        d[i] = early + late + shim;
      }
    }

    convReverb = ctx.createConvolver();
    convReverb.buffer = buf;
    wetBus = ctx.createGain();
    wetBus.gain.setValueAtTime(0.22, ctx.currentTime);
    convReverb.connect(wetBus);
    wetBus.connect(masterGain);
  }

  // Unlock audio on first gesture (iOS / Android requirement)
  function unlock() {
    if (!ctx) boot();
    else if (ctx.state === 'suspended') ctx.resume().catch(noop);
  }
  ['click','keydown','touchstart','pointerdown','input'].forEach(function(e) {
    window.addEventListener(e, unlock, { passive: true, once: true });
  });

  function canPlay() {
    if (window.isMuted) return false;
    try { if (localStorage.getItem('ca_muted') === '1') return false; } catch (_) {}
    return true;
  }

  // ══════════════════════════════════════════════════════════════════════
  // SYNTHESIS PRIMITIVES — All new, none musical
  // ══════════════════════════════════════════════════════════════════════

  /**
   * SUB THUD — Physical bass impact (felt in the chest).
   * Sine oscillator with pitch drop envelope: starts ~60% higher,
   * rapidly drops to target — this is what gives it "weight".
   * Used in nearly every interaction as the foundation layer.
   *
   * @param {number} freqHz     — target frequency (40–120Hz ideal)
   * @param {number} peakGain   — peak amplitude before compressor
   * @param {number} decaySec   — how long it sustains
   * @param {number} startAt    — offset from ctx.currentTime
   */
  function subThud(freqHz, peakGain, decaySec, startAt) {
    if (!ctx) return null;
    var t   = ctx.currentTime + (startAt || 0);
    var osc = ctx.createOscillator();
    var sat = waveshaper(3);       // analog warmth
    var gn  = ctx.createGain();

    osc.type = 'sine';
    // Pitch drop: starts high, lands on freqHz — gives IMPACT not tone
    osc.frequency.setValueAtTime(freqHz * 2.2, t);
    osc.frequency.exponentialRampToValueAtTime(freqHz, t + 0.018);
    osc.frequency.exponentialRampToValueAtTime(freqHz * 0.6, t + decaySec);

    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(peakGain, t + 0.002);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + decaySec);

    osc.connect(sat); sat.connect(gn);
    osc.start(t); osc.stop(t + decaySec + 0.02);
    return gn;
  }

  /**
   * FM METALLIC PING — Frequency Modulation synthesis.
   * Carrier × Modulator produces inharmonic partials that sound like
   * struck metal, not a musical instrument.
   * Used for: transaction confirms, lock sounds, scan hits.
   *
   * @param {number} carrHz     — carrier frequency
   * @param {number} modRatio   — modulator = carrHz × modRatio
   * @param {number} modIndex   — modulation depth (higher = more metallic)
   * @param {number} decaySec
   * @param {number} peakGain
   * @param {number} startAt
   */
  function fmMetal(carrHz, modRatio, modIndex, decaySec, peakGain, startAt) {
    if (!ctx) return null;
    var t     = ctx.currentTime + (startAt || 0);
    var modHz = carrHz * modRatio;

    var mod    = ctx.createOscillator();
    var modGn  = ctx.createGain();
    var carrier= ctx.createOscillator();
    var gn     = ctx.createGain();

    mod.type = 'sine';
    mod.frequency.setValueAtTime(modHz, t);

    // Modulation index decays — shifts from metallic to cleaner over time
    modGn.gain.setValueAtTime(carrHz * modIndex, t);
    modGn.gain.exponentialRampToValueAtTime(carrHz * modIndex * 0.1, t + decaySec * 0.6);
    modGn.gain.exponentialRampToValueAtTime(0.01, t + decaySec);

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(carrHz, t);

    gn.gain.setValueAtTime(0, t);
    gn.gain.linearRampToValueAtTime(peakGain, t + 0.004);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + decaySec);

    mod.connect(modGn);
    modGn.connect(carrier.frequency);
    carrier.connect(gn);

    mod.start(t); mod.stop(t + decaySec + 0.01);
    carrier.start(t); carrier.stop(t + decaySec + 0.01);
    return gn;
  }

  /**
   * SPECTRAL NOISE SCULPT — Multi-stage filtered noise burst.
   * This is how professional SFX houses create mechanical/air sounds.
   * 3 cascaded filters shape white noise into something organic.
   *
   * @param {number} loHz     — low shelf cutoff
   * @param {number} hiHz     — high cut
   * @param {number} peakHz   — resonant peak
   * @param {number} peakQ    — resonance sharpness
   * @param {number} durationSec
   * @param {number} peakGain
   * @param {boolean} sweepUp — if true, filter sweeps up in freq
   * @param {number} startAt
   */
  function sculptNoise(loHz, hiHz, peakHz, peakQ, durationSec, peakGain, sweepUp, startAt) {
    if (!ctx) return null;
    var t      = ctx.currentTime + (startAt || 0);
    var bufLen = Math.ceil(ctx.sampleRate * durationSec);
    var buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    var data   = buf.getChannelData(0);
    for (var i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    var src = ctx.createBufferSource();
    src.buffer = buf;

    // Stage 1: Highpass (remove rumble below loHz)
    var hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(loHz, t);
    hp.Q.setValueAtTime(0.7, t);

    // Stage 2: Lowpass (remove harshness above hiHz)
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(hiHz, t);
    lp.Q.setValueAtTime(0.7, t);

    // Stage 3: Peaking resonance (gives it a "voice")
    var pk = ctx.createBiquadFilter();
    pk.type = 'peaking';
    pk.Q.setValueAtTime(peakQ, t);
    pk.gain.setValueAtTime(12, t);
    if (sweepUp) {
      pk.frequency.setValueAtTime(peakHz * 0.3, t);
      pk.frequency.exponentialRampToValueAtTime(peakHz, t + durationSec * 0.7);
    } else {
      pk.frequency.setValueAtTime(peakHz, t);
      pk.frequency.exponentialRampToValueAtTime(peakHz * 0.25, t + durationSec);
    }

    var gn = ctx.createGain();
    gn.gain.setValueAtTime(0.001, t);
    gn.gain.linearRampToValueAtTime(peakGain, t + durationSec * 0.1);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + durationSec);

    src.connect(hp); hp.connect(lp); lp.connect(pk); pk.connect(gn);
    src.start(t); src.stop(t + durationSec);
    return gn;
  }

  /**
   * WAVESHAPER — Analog saturation curve.
   * Adds warmth, density, presence. Rounds sharp digital transients.
   * @param {number} amount — saturation drive (1 = light, 5 = heavy)
   */
  function waveshaper(amount) {
    var ws = ctx.createWaveShaper();
    var k  = typeof amount === 'number' ? amount : 2;
    var n  = 256;
    var curve = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
    ws.curve = curve;
    ws.oversample = '4x';
    return ws;
  }

  /**
   * STEREO PANNER — Subtle stereo positioning.
   * Use small values (±0.15) for width without hearing obvious panning.
   */
  function panner(panValue) {
    if (ctx.createStereoPanner) {
      var p = ctx.createStereoPanner();
      p.pan.setValueAtTime(panValue, ctx.currentTime);
      return p;
    }
    var p = ctx.createPanner();
    p.setPosition(panValue, 0, 1 - Math.abs(panValue));
    return p;
  }

  /** Route a node to the dry bus (most sounds) */
  function toDry(node) { if (node) node.connect(dryBus); }

  /** Route a node to BOTH dry and cinematic reverb (only for BIG moments) */
  function toCinematic(node) {
    if (!node) return;
    node.connect(dryBus);
    if (convReverb) node.connect(convReverb);
  }

  // ══════════════════════════════════════════════════════════════════════
  // THE SOUND LIBRARY — 30 Cinematic SFX Sounds, Zero Musical Notes
  // ══════════════════════════════════════════════════════════════════════

  var SFX = {

    // ────────────────────────────────────────────────────────────────────
    // 1. TAP — "Precision Mechanism"
    //    Like a high-end DSLR shutter or a Swiss watch click.
    //    Sub-thud (physical) + spectral snap (mechanical).
    //    Ultra dry. The sound of something perfectly engineered.
    // ────────────────────────────────────────────────────────────────────
    tap: function (intensity) {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var iv = (intensity !== undefined) ? intensity : 1.0;
      var sub  = subThud(72, 0.55 * iv, 0.055, 0);
      var snap = sculptNoise(800, 7000, 2800, 3, 0.014, 0.18 * iv, false, 0);
      toDry(sub); toDry(snap);
    },

    // ────────────────────────────────────────────────────────────────────
    // 2. CLICK — "Deadbolt"
    //    Heavier than tap. Like a heavy door latch engaging.
    //    More sub + FM metallic body.
    // ────────────────────────────────────────────────────────────────────
    click: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var sub  = subThud(58, 0.65, 0.085, 0);
      var body = fmMetal(280, 3.5, 0.8, 0.060, 0.22, 0);
      var snap = sculptNoise(1200, 9000, 3500, 4, 0.018, 0.14, false, 0);
      toDry(sub); toDry(body); toDry(snap);
    },

    // ────────────────────────────────────────────────────────────────────
    // 3. TYPING TICK — "Thock"
    //    Three distinct key profiles — rotates to break monotony.
    //    All sub-heavy, no high-pitched click sounds.
    //    "Marble", "Cream", "Liquid" mechanical switch characters.
    // ────────────────────────────────────────────────────────────────────
    typingTick: function () {
      var now = Date.now();
      if (now - lastTypingMs < TYPING_GAP) return;
      lastTypingMs = now;
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.type);

      var profile = Math.floor(Math.random() * 3);
      var jit = 1 + (Math.random() - 0.5) * 0.08;

      if (profile === 0) {
        // MARBLE — Deep thock, clean top
        var s = subThud(105 * jit, 0.50, 0.045, 0);
        var n = sculptNoise(600, 5000, 1800, 2.5, 0.012, 0.10, false, 0);
        toDry(s); toDry(n);
      } else if (profile === 1) {
        // CREAM — Softer, rounder, more hollow
        var s = subThud(85 * jit, 0.44, 0.050, 0);
        var n = sculptNoise(400, 3500, 1200, 2, 0.014, 0.08, false, 0);
        toDry(s); toDry(n);
      } else {
        // LIQUID — Slightly poppier, bright snap
        var s = subThud(95 * jit, 0.48, 0.042, 0);
        var n = sculptNoise(700, 6500, 2200, 3.5, 0.011, 0.12, false, 0);
        toDry(s); toDry(n);
      }
    },

    // ────────────────────────────────────────────────────────────────────
    // 4. TAB SWITCH — "Air Shift"
    //    Room pressure change. NOT a whoosh — more like displacement.
    //    Two spectral noise bands moving in opposite directions.
    // ────────────────────────────────────────────────────────────────────
    tabSwitch: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var lo = sculptNoise(60, 400, 180, 1.5, 0.120, 0.12, true, 0);
      var hi = sculptNoise(2000, 12000, 5000, 2, 0.090, 0.09, false, 0);
      var p1 = panner(-0.12);
      var p2 = panner(0.12);
      if (lo) { lo.connect(p1); p1.connect(dryBus); }
      if (hi) { hi.connect(p2); p2.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 5. THEME NIGHT — "Density"
    //    The room gets heavier. Sub-low rumble fades in.
    //    High frequencies die. Felt more than heard.
    // ────────────────────────────────────────────────────────────────────
    themeNight: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.modal);
      // Deep sub rumble fade-in (barely audible)
      var sub  = subThud(42, 0.35, 0.800, 0.2);
      // Air pressure: noise that sweeps DOWN (heavy, descending)
      var air  = sculptNoise(30, 1200, 600, 1.2, 0.700, 0.14, false, 0.1);
      // FM "weight" — low inharmonic tone
      var body = fmMetal(68, 2.1, 1.4, 0.500, 0.18, 0.05);
      toDry(sub); toDry(air);
      if (body) { body.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 6. THEME MORNING — "Breath"
    //    The room lightens. Sub rumble that RISES then releases.
    //    Like pressure releasing from a sealed chamber.
    // ────────────────────────────────────────────────────────────────────
    themeMorning: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.modal);
      var sub  = subThud(55, 0.30, 0.600, 0.1);
      var air  = sculptNoise(80, 3500, 800, 1.0, 0.600, 0.15, true, 0);
      var crack= sculptNoise(2500, 14000, 6000, 2, 0.080, 0.10, true, 0.35);
      toDry(sub); toDry(air); toDry(crack);
    },

    // ────────────────────────────────────────────────────────────────────
    // 7. LANGUAGE SWITCH — "Pivot"
    //    Two opposing transients — left → right. Quick, decisive.
    // ────────────────────────────────────────────────────────────────────
    langSwitch: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var a = subThud(68, 0.45, 0.060, 0);
      var b = subThud(82, 0.40, 0.060, 0.08);
      var pa = panner(-0.25);
      var pb = panner(0.25);
      if (a) { a.connect(pa); pa.connect(dryBus); }
      if (b) { b.connect(pb); pb.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 8. CLOUD SYNC START — "Launch"
    //    Rising air column — like a rocket pressurizing.
    //    Sub builds, then releases into a sharp transient.
    // ────────────────────────────────────────────────────────────────────
    cloudSyncStart: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var air = sculptNoise(60, 2000, 400, 1.4, 0.200, 0.18, true, 0);
      var hit = sculptNoise(1500, 12000, 4000, 3.5, 0.035, 0.22, false, 0.195);
      toDry(air); toDry(hit);
    },

    // ────────────────────────────────────────────────────────────────────
    // 9. CLOUD SYNC SUCCESS — "Lock Confirmed"
    //    Clean double impact: low → high. Brief. Confident.
    //    Sub thud then FM metallic confirm. No reverb. Pure authority.
    // ────────────────────────────────────────────────────────────────────
    cloudSyncSuccess: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.confirm);
      var thud = subThud(65, 0.55, 0.100, 0);
      var ping = fmMetal(420, 4.2, 1.8, 0.160, 0.32, 0.065);
      var snap = sculptNoise(3000, 15000, 7000, 4, 0.025, 0.18, false, 0.07);
      toDry(thud); toDry(ping); toDry(snap);
    },

    // ────────────────────────────────────────────────────────────────────
    // 10. CLOUD SYNC ERROR — "Dead Stop"
    //     Single hard sub hit. Abrupt, low-frequency. NOT a "sad" tone.
    //     The sound of something stopping that shouldn't have.
    // ────────────────────────────────────────────────────────────────────
    cloudSyncError: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.warn);
      var thud = subThud(58, 0.65, 0.150, 0);
      var body = fmMetal(160, 2.8, 2.2, 0.180, 0.24, 0.02);
      toDry(thud); toDry(body);
    },

    // ────────────────────────────────────────────────────────────────────
    // 11. BARCODE / ATTENDANCE SCAN — "Sweep Strike"
    //     FM metallic zap — precision scanner energy.
    //     Tight, directional. Industrial, not musical.
    // ────────────────────────────────────────────────────────────────────
    attendanceScan: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var zap  = fmMetal(880, 6.0, 3.5, 0.065, 0.28, 0);
      var snap = sculptNoise(2000, 16000, 8000, 5, 0.020, 0.20, false, 0);
      toDry(zap); toDry(snap);
    },

    // ────────────────────────────────────────────────────────────────────
    // 12. ATTENDANCE SUCCESS — "Vault Lock"
    //     THE signature sound. Deep satisfying LOCK — like a safe door.
    //
    //     Layer 1: Heavy sub thud (physical impact you feel)
    //     Layer 2: FM metallic body (the mechanism engaging)
    //     Layer 3: Spectral shimmer (resonance dying away)
    //
    //     This should feel FINAL. SECURE. LOCKED IN.
    //     NOT a chime. NOT a bell. A MECHANISM.
    // ────────────────────────────────────────────────────────────────────
    attendanceSuccess: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.confirm);

      // Layer 1: The physical weight of the lock
      var thud  = subThud(52, 0.80, 0.180, 0);

      // Layer 2: The metallic mechanism body
      var body  = fmMetal(340, 3.8, 2.5, 0.250, 0.40, 0.008);

      // Layer 3: High resonance decay — the room responding
      var shim  = sculptNoise(2500, 14000, 6000, 4.5, 0.200, 0.22, false, 0.05);

      // Stereo width: body left of center, shimmer right
      var pl = panner(-0.18);
      var pr = panner(0.18);

      toDry(thud);
      if (body) { body.connect(pl); pl.connect(dryBus); }
      if (shim) { shim.connect(pr); pr.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 13. ATTENDANCE WARNING — "Pulse"
    //     Double low-frequency pulse. Subtle but clear.
    //     Like a system heartbeat: "I noticed. But it's okay."
    // ────────────────────────────────────────────────────────────────────
    attendanceWarning: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.warn);
      var p1 = subThud(72, 0.50, 0.100, 0);
      var p2 = subThud(68, 0.38, 0.100, 0.160);
      toDry(p1); toDry(p2);
    },

    // ────────────────────────────────────────────────────────────────────
    // 14. ATTENDANCE REMOVE — "Release"
    //     Air escape + downward sweep. Something unclamping.
    // ────────────────────────────────────────────────────────────────────
    attendanceRemove: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.delete);
      var air  = sculptNoise(80, 3000, 1200, 2, 0.140, 0.14, false, 0);
      var body = fmMetal(220, 2.5, 1.5, 0.120, 0.18, 0.01);
      toDry(air); toDry(body);
    },

    // ────────────────────────────────────────────────────────────────────
    // 15. NEW STUDENT FORM OPEN — "Deploy"
    //     System deploying a new surface. Sub + ascending air.
    // ────────────────────────────────────────────────────────────────────
    newStudentForm: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.modal);
      var sub = subThud(60, 0.40, 0.100, 0);
      var air = sculptNoise(100, 4000, 800, 1.8, 0.150, 0.15, true, 0.02);
      toDry(sub); toDry(air);
    },

    // ────────────────────────────────────────────────────────────────────
    // 16. STUDENT CARD OPEN — "Surface Slide"
    //     Panel extending. Low-mid rumble with crisp edge.
    // ────────────────────────────────────────────────────────────────────
    studentOpen: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var slide = sculptNoise(80, 2500, 600, 1.5, 0.120, 0.14, true, 0);
      var edge  = sculptNoise(3000, 16000, 8000, 3, 0.018, 0.12, false, 0.11);
      toDry(slide); toDry(edge);
    },

    // ────────────────────────────────────────────────────────────────────
    // 17. STUDENT CARD CLOSE — "Retract"
    //     Inverse of studentOpen — panel snapping back.
    // ────────────────────────────────────────────────────────────────────
    studentClose: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var slide = sculptNoise(80, 2500, 1800, 1.8, 0.100, 0.12, false, 0);
      var thud  = subThud(66, 0.30, 0.065, 0.09);
      toDry(slide); toDry(thud);
    },

    // ────────────────────────────────────────────────────────────────────
    // 18. STUDENT SAVE — "Stamp"
    //     Heavy impaction — like a rubber stamp, or a data commit.
    //     Sub hit + FM body + high snap. Immediate. No ambiguity.
    // ────────────────────────────────────────────────────────────────────
    studentSave: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.confirm);
      var stamp = subThud(62, 0.70, 0.120, 0);
      var body  = fmMetal(290, 4.0, 2.0, 0.120, 0.30, 0.005);
      var snap  = sculptNoise(4000, 18000, 9000, 5, 0.016, 0.18, false, 0.008);
      toDry(stamp); toDry(body); toDry(snap);
    },

    // ────────────────────────────────────────────────────────────────────
    // 19. RANK VIP — "Power Up"
    //     Pressurized ascent — like a turbine spooling.
    //     NO harp, NO chimes — sub swell + FM metallic shimmer.
    // ────────────────────────────────────────────────────────────────────
    rankVIP: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.confirm);
      var swell = sculptNoise(40, 800, 200, 1, 0.500, 0.20, true, 0);
      var fm1   = fmMetal(180, 5.0, 3.0, 0.400, 0.22, 0.1);
      var fm2   = fmMetal(360, 4.5, 2.5, 0.350, 0.18, 0.22);
      var spark = sculptNoise(5000, 20000, 10000, 4, 0.100, 0.18, true, 0.38);
      toDry(swell); toDry(fm1); toDry(fm2); toDry(spark);
    },

    // ────────────────────────────────────────────────────────────────────
    // 20. RANK WARN — "Alert Pulse"
    //     Three descending low pulses. Not alarming — just informing.
    // ────────────────────────────────────────────────────────────────────
    rankWarn: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.warn);
      toDry(subThud(76, 0.48, 0.090, 0));
      toDry(subThud(70, 0.38, 0.090, 0.130));
      toDry(subThud(64, 0.28, 0.090, 0.260));
    },

    // ────────────────────────────────────────────────────────────────────
    // 21. REVENUE DRAWER OPEN — "Metal Slide"
    //     Heavy drawer mechanism: low rumble + metallic slide + stop.
    // ────────────────────────────────────────────────────────────────────
    revenueOpen: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.heavy);
      var rumble = sculptNoise(40, 600, 180, 1.2, 0.220, 0.18, true, 0);
      var slide  = sculptNoise(200, 4000, 1200, 2, 0.160, 0.15, false, 0.15);
      var stop   = subThud(58, 0.55, 0.080, 0.30);
      toDry(rumble); toDry(slide); toDry(stop);
    },

    // ────────────────────────────────────────────────────────────────────
    // 22. CASH PAYMENT — "Transaction"
    //     NOT a cash register — this is a high-security system confirming.
    //
    //     Layer 1: Heavy impaction  (authority, weight, finality)
    //     Layer 2: FM metallic body (system engaging, precision)
    //     Layer 3: Sub decay        (physical mass, presence)
    //
    //     Should feel like: a bank vault, a confirmed wire transfer,
    //     a Bloomberg terminal executing a trade.
    // ────────────────────────────────────────────────────────────────────
    cashPayment: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.heavy);

      var impact = subThud(58, 0.85, 0.200, 0);
      var body   = fmMetal(380, 3.2, 2.8, 0.240, 0.45, 0.012);
      var click  = sculptNoise(1500, 10000, 4500, 4, 0.022, 0.25, false, 0.005);
      var sub2   = subThud(42, 0.35, 0.350, 0.020);   // sub tail

      var pl = panner(-0.15);
      toDry(impact);
      if (body)  { body.connect(pl); pl.connect(dryBus); }
      toDry(click);
      toDry(sub2);
    },

    // ────────────────────────────────────────────────────────────────────
    // 23. DEBT CLEARED — "RELEASE" (the biggest sound in the system)
    //
    //     This is a CINEMATIC STINGER. Like the final chord of a Hans
    //     Zimmer cue. Or the moment the containment door opens in a
    //     sci-fi film. This moment is EARNED.
    //
    //     Movement: TENSION → BUILD → EXPLOSIVE RELEASE → DECAY
    //
    //     Layer 1: Sub boom      (massive physical impact)
    //     Layer 2: FM chaos      (complex metallic burst — inharmonic)
    //     Layer 3: Noise swell   (the room responding, air pressure)
    //     Layer 4: High sparkle  (the energy dissipating upward)
    //     Layer 5: Reverb tail   (cinematic space — the ONLY place we use it)
    // ────────────────────────────────────────────────────────────────────
    debtCleared: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.release);

      // Layer 1: The sub BOOM — like a cannon at distance
      var boom = subThud(45, 1.0, 0.500, 0);

      // Layer 2a: Metallic crash — inharmonic, explosive
      var crash1 = fmMetal(280, 6.5, 4.5, 0.400, 0.55, 0.005);
      // Layer 2b: Higher metallic ring
      var crash2 = fmMetal(520, 5.8, 3.8, 0.350, 0.40, 0.025);

      // Layer 3: Room-filling air pressure swell
      var swell  = sculptNoise(50, 5000, 800, 1.5, 0.550, 0.28, true, 0);

      // Layer 4: High-frequency energy release (sparkle)
      var spark  = sculptNoise(6000, 20000, 12000, 3, 0.220, 0.22, true, 0.08);

      // Layer 5: Sub decay tail (lingering mass)
      var tail   = subThud(38, 0.35, 0.800, 0.08);

      // Route to CINEMATIC reverb — this is the only sound that gets it
      toCinematic(boom);
      toCinematic(crash1);
      toCinematic(crash2);
      toCinematic(swell);
      toCinematic(spark);
      toDry(tail);
    },

    // ────────────────────────────────────────────────────────────────────
    // 24. MESSAGE SEND — "Dispatch"
    //     Quick air burst — like pneumatic mail tube firing.
    // ────────────────────────────────────────────────────────────────────
    messageSend: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var burst = sculptNoise(400, 8000, 2500, 3, 0.075, 0.16, true, 0);
      var pr = panner(0.2);
      if (burst) { burst.connect(pr); pr.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 25. MARKETING PULSE — "Signal"
    //     FM sweep — radar/sonar energy. Forward, directional.
    // ────────────────────────────────────────────────────────────────────
    marketingPulse: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var radar = fmMetal(220, 8.0, 4.0, 0.150, 0.28, 0);
      var air   = sculptNoise(500, 6000, 2000, 2.5, 0.100, 0.14, true, 0.02);
      toDry(radar); toDry(air);
    },

    // ────────────────────────────────────────────────────────────────────
    // 26. MODAL OPEN — "Surface Emerge"
    //     Sub + upward air sweep. Layer surfaces from depth.
    // ────────────────────────────────────────────────────────────────────
    modalOpen: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.modal);
      var sub = subThud(58, 0.38, 0.100, 0);
      var air = sculptNoise(100, 5000, 1000, 1.8, 0.160, 0.15, true, 0.01);
      toDry(sub); toDry(air);
    },

    // ────────────────────────────────────────────────────────────────────
    // 27. MODAL CLOSE — "Retraction"
    //     Snappy downward sweep. Rapid, precise.
    // ────────────────────────────────────────────────────────────────────
    modalClose: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.micro);
      var air  = sculptNoise(120, 5000, 2000, 2, 0.090, 0.12, false, 0);
      var thud = subThud(64, 0.28, 0.055, 0.08);
      toDry(air); toDry(thud);
    },

    // ────────────────────────────────────────────────────────────────────
    // 28. DELETE SWOOSH — "Obliterate"
    //     Hard left-to-right sweep. Violent air displacement.
    // ────────────────────────────────────────────────────────────────────
    deleteSwoosh: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.delete);
      var lo = sculptNoise(60, 1200, 400, 1.5, 0.160, 0.16, false, 0);
      var hi = sculptNoise(3000, 18000, 8000, 2.5, 0.120, 0.14, false, 0.02);
      var pl = panner(-0.3);
      var pr = panner(0.3);
      if (lo) { lo.connect(pl); pl.connect(dryBus); }
      if (hi) { hi.connect(pr); pr.connect(dryBus); }
    },

    // ────────────────────────────────────────────────────────────────────
    // 29. MUTE / UNMUTE
    //     Muting: Low sub thud that fades (system going to sleep).
    //     Unmuting: Rising air + FM ping (system waking up).
    // ────────────────────────────────────────────────────────────────────
    muteAnnouncement: function (isMuted) {
      if (isMuted) {
        // Even while muting, play one farewell impact
        var c = boot(); if (!c) return;
        var thud = subThud(55, 0.40, 0.200, 0);
        var body = fmMetal(200, 3.0, 1.5, 0.250, 0.18, 0.01);
        toDry(thud); toDry(body);
      } else {
        if (!canPlay()) return;
        var c = boot(); if (!c) return;
        var air  = sculptNoise(80, 3000, 600, 1.5, 0.180, 0.16, true, 0);
        var ping = fmMetal(350, 5.0, 2.0, 0.200, 0.26, 0.12);
        toDry(air); toDry(ping);
      }
    },

    // ────────────────────────────────────────────────────────────────────
    // 30. ERROR — "Interrupt"
    //     Two close low impacts — NOT a descending tone.
    //     The sound of something stopping HARD.
    // ────────────────────────────────────────────────────────────────────
    error: function () {
      if (!canPlay()) return;
      var c = boot(); if (!c) return;
      vibe(HX.warn);
      var h1 = subThud(66, 0.60, 0.110, 0);
      var h2 = subThud(62, 0.48, 0.110, 0.130);
      var n  = sculptNoise(600, 5000, 2000, 4, 0.040, 0.18, false, 0.065);
      toDry(h1); toDry(h2); toDry(n);
    },

  };

  // ── DOM Event Delegation ───────────────────────────────────────────────

  function setupDelegation() {

    // Tap on interactive elements
    document.addEventListener('pointerdown', function (e) {
      if (!canPlay()) return;
      var now = Date.now();
      if (now - lastTapMs < TAP_GAP) return;
      lastTapMs = now;

      var target = e.target;
      if (!target) return;
      var tag = target.tagName ? target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;

      if (target.matches && (
          target.matches('input[type="checkbox"],input[type="radio"]') ||
          target.closest('.toggle-switch,.switch,.toggle')
      )) { SFX.click(); return; }

      if (target.matches && (
          target.matches('button,a,[role="button"],.btn,.card,.tab,.nav-item,.sidebar-item,label,select') ||
          target.closest('button,a,[role="button"],.btn,.card,.tab,.nav-item,.sidebar-item')
      )) { SFX.tap(); }

    }, { capture: true, passive: true });

    // Physical keyboard typing
    document.addEventListener('keydown', function (e) {
      if (!canPlay()) return;
      var skip = ['Shift','Control','Alt','Meta','CapsLock','Tab','Escape',
                  'Enter','Backspace','Delete','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
      if (skip.indexOf(e.key) !== -1) return;
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
        SFX.typingTick();
      }
    }, { passive: true });

    // Virtual keyboard (iOS / Android) — fires on every character
    document.addEventListener('input', function (e) {
      if (!canPlay()) return;
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
        var now = Date.now();
        if (now - lastTypingMs < TYPING_GAP) return;
        SFX.typingTick();
      }
    }, { passive: true });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDelegation);
  } else {
    setupDelegation();
  }

  // ── Legacy bridge: routes all old playSound(type) to SFX engine ────────
  window.playSound = function (type) {
    switch (type) {
      case 'money':   SFX.cashPayment();       break;
      case 'success': SFX.attendanceSuccess(); break;
      case 'pop':     SFX.attendanceSuccess(); break;
      case 'error':   SFX.error();             break;
      case 'beep':    SFX.tap();               break;
      case 'tap':     SFX.tap();               break;
      case 'click':   SFX.click();             break;
      default:        SFX.tap();               break;
    }
  };

  // ── Public API ─────────────────────────────────────────────────────────
  window.AssistantSounds = SFX;

}(window, document));
