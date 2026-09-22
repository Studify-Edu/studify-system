/**
 * =======================================================================
 * STUDIFY ASSISTANT SOUND ENGINE — STUDIO EDITION v3.0
 * =======================================================================
 *
 * Architecture: Physical Modelling + Procedural Synthesis
 * Inspiration:  Apple iOS Taptic Engine · macOS Sound Design ·
 *               Stripe · Linear · Cash App · Duolingo
 *
 * Key Technologies:
 *  - Karplus-Strong physical string synthesis  → chimes, dings, bells
 *  - Noise-excitation + resonant filters       → mechanical clicks, keys
 *  - Convolution reverb (IR generated on-init) → depth & space
 *  - Multi-oscillator beating chords           → harmonics & richness
 *  - Dynamic gain shaping (ADSR)               → natural attack & decay
 *  - DynamicsCompressor master bus             → glue & polish
 *  - navigator.vibrate haptic integration      → mobile tactile feedback
 *  - 'input' + 'keydown' listeners             → catches virtual keyboards
 *  - 'touchstart' gesture unlock               → iOS audio context unlock
 *
 * =======================================================================
 */

(function (window, document) {
  'use strict';

  // --- Audio Graph Nodes ---
  let ctx = null;
  let masterGain = null;
  let masterComp = null;
  let reverbNode = null;
  let reverbSend = null;

  // --- Throttle Trackers ---
  let lastTypingTime  = 0;
  let lastTapTime     = 0;

  // --- Constants ---
  const MASTER_VOL   = 0.30;
  const REVERB_WET   = 0.18;
  const TAP_THROTTLE = 40;
  const KEY_THROTTLE = 60;

  // --- Mobile Haptic Patterns (ms) ---
  const HapticPattern = {
    tap:              [5],
    type:             [3],
    success:          [12, 40, 12],
    warn:             [25, 30, 25],
    error:            [30, 40, 60],
    cashRegister:     [18],
    jackpot:          [20, 40, 20, 40, 40],
    delete:           [15],
    modal:            [8],
    vip:              [10, 30, 10],
    themeSwitch:      [6],
    sync:             [8],
    syncDone:         [12, 30, 12],
  };

  function haptic(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  }

  // --- AudioContext Bootstrap ---

  function initAudioContext() {
    if (ctx && ctx.state !== 'closed') {
      if (ctx.state === 'suspended') ctx.resume().catch(function() {});
      return ctx;
    }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();

      masterComp = ctx.createDynamicsCompressor();
      masterComp.threshold.setValueAtTime(-20, ctx.currentTime);
      masterComp.knee.setValueAtTime(10, ctx.currentTime);
      masterComp.ratio.setValueAtTime(5, ctx.currentTime);
      masterComp.attack.setValueAtTime(0.002, ctx.currentTime);
      masterComp.release.setValueAtTime(0.12, ctx.currentTime);

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(MASTER_VOL, ctx.currentTime);

      buildReverb();

      masterComp.connect(masterGain);
      masterGain.connect(ctx.destination);

      return ctx;
    } catch (e) {
      return null;
    }
  }

  /**
   * Generate a synthetic plate reverb impulse response.
   */
  function buildReverb() {
    if (!ctx) return;
    var rate    = ctx.sampleRate;
    var len     = Math.floor(rate * 1.4);
    var impulse = ctx.createBuffer(2, len, rate);

    for (var ch = 0; ch < 2; ch++) {
      var data = impulse.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var decay = Math.pow(1 - i / len, 4.5);
        data[i] = (Math.random() * 2 - 1) * decay;
        data[i] += Math.sin(i * 0.02 + ch * 1.7) * 0.015 * decay;
      }
    }

    reverbNode = ctx.createConvolver();
    reverbNode.buffer = impulse;

    reverbSend = ctx.createGain();
    reverbSend.gain.setValueAtTime(REVERB_WET, ctx.currentTime);

    reverbNode.connect(reverbSend);
    reverbSend.connect(masterGain);
  }

  function connectWithReverb(node, reverbAmount) {
    if (reverbAmount === undefined) reverbAmount = 1.0;
    node.connect(masterComp);
    if (reverbNode && reverbAmount > 0) {
      var send = ctx.createGain();
      send.gain.setValueAtTime(reverbAmount, ctx.currentTime);
      node.connect(send);
      send.connect(reverbNode);
    }
  }

  // --- Unlock on first gesture (iOS requirement) ---
  function unlockAudio() {
    if (!ctx) initAudioContext();
    else if (ctx.state === 'suspended') ctx.resume().catch(function() {});
  }
  ['click','keydown','touchstart','pointerdown','input'].forEach(function(evt) {
    window.addEventListener(evt, unlockAudio, { passive: true, once: true });
  });

  function canPlay() {
    if (window.isMuted) return false;
    try {
      if (localStorage.getItem('ca_muted') === '1') return false;
    } catch(_) {}
    return true;
  }

  // --- Core Synthesis Primitives ---

  /**
   * Karplus-Strong Physical String Model
   * Produces realistic plucked-string / chime resonance.
   */
  function pluckString(freq, duration, gainPeak, brightness) {
    if (gainPeak === undefined) gainPeak = 0.5;
    if (brightness === undefined) brightness = 1.0;
    if (!ctx) return null;
    var now    = ctx.currentTime;
    var sRate  = ctx.sampleRate;
    var period = Math.floor(sRate / freq);

    var buf  = ctx.createBuffer(1, period, sRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < period; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.9;
    }

    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(freq * 18 * brightness, now);
    lp.Q.setValueAtTime(0.5, now);

    var gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainPeak, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(lp);
    lp.connect(gainNode);

    src.start(now);
    src.stop(now + duration);
    return gainNode;
  }

  /**
   * Noise-Excitation Mechanical Click
   * Filtered white noise burst — the real way to make keyboard / switch sounds.
   */
  function mechanicalClick(freq, q, duration, gainPeak) {
    if (freq === undefined) freq = 800;
    if (q === undefined) q = 4;
    if (duration === undefined) duration = 0.018;
    if (gainPeak === undefined) gainPeak = 0.12;
    if (!ctx) return null;
    var now    = ctx.currentTime;
    var bufLen = Math.ceil(ctx.sampleRate * duration);
    var buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    var data   = buf.getChannelData(0);
    for (var i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    var src = ctx.createBufferSource();
    src.buffer = buf;

    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(freq, now);
    bp.Q.setValueAtTime(q, now);

    var shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.setValueAtTime(4000, now);
    shelf.gain.setValueAtTime(6, now);

    var gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainPeak, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(bp);
    bp.connect(shelf);
    shelf.connect(gainNode);

    src.start(now);
    src.stop(now + duration);
    return gainNode;
  }

  /**
   * Sine tone with ADSR envelope
   */
  function tone(freq, startTime, duration, gainPeak, type) {
    if (gainPeak === undefined) gainPeak = 0.3;
    if (type === undefined) type = 'sine';
    if (!ctx) return null;
    var osc = ctx.createOscillator();
    var gn  = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gn.gain.setValueAtTime(0.001, startTime);
    gn.gain.linearRampToValueAtTime(gainPeak, startTime + 0.008);
    gn.gain.exponentialRampToValueAtTime(gainPeak * 0.6, startTime + duration * 0.4);
    gn.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gn);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
    return gn;
  }

  /**
   * Noise whoosh / sweep
   */
  function noiseWhoosh(durationSec, gainPeak, filterSweepDown) {
    if (durationSec === undefined) durationSec = 0.12;
    if (gainPeak === undefined) gainPeak = 0.15;
    if (filterSweepDown === undefined) filterSweepDown = true;
    if (!ctx) return null;
    var now    = ctx.currentTime;
    var bufLen = Math.ceil(ctx.sampleRate * durationSec);
    var buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    var data   = buf.getChannelData(0);
    for (var i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    var src = ctx.createBufferSource();
    src.buffer = buf;

    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.setValueAtTime(1.8, now);
    if (filterSweepDown) {
      bp.frequency.setValueAtTime(3200, now);
      bp.frequency.exponentialRampToValueAtTime(280, now + durationSec);
    } else {
      bp.frequency.setValueAtTime(280, now);
      bp.frequency.exponentialRampToValueAtTime(3200, now + durationSec);
    }

    var gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(gainPeak, now + durationSec * 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    src.connect(bp);
    bp.connect(gainNode);
    src.start(now);
    src.stop(now + durationSec);
    return gainNode;
  }

  // --- The Sound Library ---

  var AssistantSounds = {

    // 1. iOS-STYLE HAPTIC TAP
    tap: function (intensity) {
      if (intensity === undefined) intensity = 1.0;
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var jitter = 1 + (Math.random() - 0.5) * 0.06;
      var click  = mechanicalClick(720 * jitter, 3.5, 0.016, 0.10 * intensity);
      if (click) click.connect(masterComp);
    },

    // 2. SOFT UI BUTTON CLICK
    click: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var body = mechanicalClick(380, 2, 0.022, 0.09);
      var cri  = mechanicalClick(2800, 8, 0.008, 0.06);
      if (body) body.connect(masterComp);
      if (cri)  cri.connect(masterComp);
    },

    // 3. KEYBOARD / TYPING TICK — iOS Keyboard Inspired
    typingTick: function () {
      var now = Date.now();
      if (now - lastTypingTime < KEY_THROTTLE) return;
      lastTypingTime = now;
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.type);

      var profiles = [
        { f: 520, q: 3.2, dur: 0.014, g: 0.085 },
        { f: 440, q: 2.8, dur: 0.016, g: 0.095 },
        { f: 380, q: 2.5, dur: 0.018, g: 0.100 },
      ];
      var p = profiles[Math.floor(Math.random() * profiles.length)];
      var jitter = 1 + (Math.random() - 0.5) * 0.05;
      var click = mechanicalClick(p.f * jitter, p.q, p.dur, p.g);
      if (click) click.connect(masterComp);
    },

    // 4. NAVIGATION TAB SWITCH
    tabSwitch: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var w = noiseWhoosh(0.09, 0.10, true);
      if (w) connectWithReverb(w, 0.5);
      var t1 = tone(1480, c.currentTime + 0.015, 0.08, 0.06);
      if (t1) connectWithReverb(t1, 0.6);
    },

    // 5. NIGHT / DARK THEME — Descending Minor Pentatonic
    themeNight: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.themeSwitch);
      var notes = [
        { freq: 659.25, delay: 0,    dur: 2.2, gain: 0.40 },
        { freq: 493.88, delay: 0.10, dur: 2.0, gain: 0.32 },
        { freq: 392.00, delay: 0.20, dur: 1.8, gain: 0.28 },
        { freq: 261.63, delay: 0.30, dur: 2.5, gain: 0.22 },
      ];
      notes.forEach(function(n) {
        var s = pluckString(n.freq, n.dur, n.gain, 0.8);
        if (s) {
          var delayed = ctx.createDelay(1.0);
          delayed.delayTime.setValueAtTime(n.delay, c.currentTime);
          s.connect(delayed);
          connectWithReverb(delayed, 1.0);
        }
      });
      var w = noiseWhoosh(0.18, 0.08, true);
      if (w) connectWithReverb(w, 0.8);
    },

    // 6. MORNING / LIGHT THEME — Ascending C Major Arpeggio
    themeMorning: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.themeSwitch);
      var notes = [
        { freq: 523.25, delay: 0,    dur: 1.8, gain: 0.30 },
        { freq: 659.25, delay: 0.10, dur: 1.6, gain: 0.28 },
        { freq: 783.99, delay: 0.20, dur: 1.6, gain: 0.26 },
        { freq: 1046.5, delay: 0.32, dur: 2.0, gain: 0.24 },
      ];
      notes.forEach(function(n) {
        var s = pluckString(n.freq, n.dur, n.gain, 1.2);
        if (s) {
          var delayed = ctx.createDelay(1.0);
          delayed.delayTime.setValueAtTime(n.delay, c.currentTime);
          s.connect(delayed);
          connectWithReverb(delayed, 0.9);
        }
      });
      var w = noiseWhoosh(0.14, 0.08, false);
      if (w) connectWithReverb(w, 0.6);
    },

    // 7. LANGUAGE SWITCH
    langSwitch: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var t1 = tone(880, c.currentTime,        0.22, 0.22);
      var t2 = tone(660, c.currentTime + 0.10, 0.20, 0.18);
      if (t1) connectWithReverb(t1, 0.7);
      if (t2) connectWithReverb(t2, 0.7);
    },

    // 8. CLOUD SYNC START
    cloudSyncStart: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.sync);
      var w = noiseWhoosh(0.20, 0.12, false);
      if (w) connectWithReverb(w, 0.5);
      var t1 = tone(440, c.currentTime,        0.15, 0.14);
      var t2 = tone(660, c.currentTime + 0.10, 0.15, 0.14);
      if (t1) connectWithReverb(t1, 0.4);
      if (t2) connectWithReverb(t2, 0.4);
    },

    // 9. CLOUD SYNC SUCCESS — Celestial Crystal Bells
    cloudSyncSuccess: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.syncDone);
      var notes = [
        { freq: 1318.5, delay: 0,    dur: 1.6, gain: 0.35, bright: 1.5 },
        { freq: 1975.5, delay: 0.07, dur: 1.4, gain: 0.28, bright: 1.6 },
        { freq: 2637.0, delay: 0.14, dur: 1.2, gain: 0.22, bright: 1.8 },
      ];
      notes.forEach(function(n) {
        var s = pluckString(n.freq, n.dur, n.gain, n.bright);
        if (s) {
          var delayed = ctx.createDelay(0.5);
          delayed.delayTime.setValueAtTime(n.delay, c.currentTime);
          s.connect(delayed);
          connectWithReverb(delayed, 1.0);
        }
      });
    },

    // 10. CLOUD SYNC ERROR
    cloudSyncError: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.error);
      var t1 = tone(440, c.currentTime,        0.25, 0.20, 'triangle');
      var t2 = tone(294, c.currentTime + 0.18, 0.28, 0.20, 'triangle');
      if (t1) connectWithReverb(t1, 0.6);
      if (t2) connectWithReverb(t2, 0.6);
    },

    // 11. BARCODE SCAN — Laser Zap
    attendanceScan: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var now = c.currentTime;
      var osc = c.createOscillator();
      var gn  = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.055);
      gn.gain.setValueAtTime(0.18, now);
      gn.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      var hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(900, now);
      osc.connect(hp); hp.connect(gn);
      gn.connect(masterComp);
      osc.start(now); osc.stop(now + 0.06);
    },

    // 12. ATTENDANCE SUCCESS — Crystal Double Ding (Apple Pay Style)
    //     C6 then G6 — rising perfect fifth. Signature sound.
    attendanceSuccess: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.success);

      var bell1 = pluckString(1046.5, 1.8, 0.55, 1.4);
      if (bell1) {
        var d1 = c.createDelay(0.2);
        d1.delayTime.setValueAtTime(0, c.currentTime);
        bell1.connect(d1);
        connectWithReverb(d1, 1.0);
      }

      var bell2 = pluckString(1567.98, 1.6, 0.48, 1.5);
      if (bell2) {
        var d2 = c.createDelay(0.5);
        d2.delayTime.setValueAtTime(0.14, c.currentTime);
        bell2.connect(d2);
        connectWithReverb(d2, 1.0);
      }

      var w = noiseWhoosh(0.08, 0.05, false);
      if (w) connectWithReverb(w, 0.4);
    },

    // 13. ATTENDANCE WARNING — Warm Amber Marimba
    attendanceWarning: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.warn);
      var t1 = tone(587.33, c.currentTime,        0.28, 0.24, 'triangle');
      var t2 = tone(440.00, c.currentTime + 0.18, 0.30, 0.22, 'triangle');
      if (t1) connectWithReverb(t1, 0.5);
      if (t2) connectWithReverb(t2, 0.5);
    },

    // 14. ATTENDANCE REMOVE / UNDO
    attendanceRemove: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.delete);
      var t1 = tone(587.33, c.currentTime,        0.18, 0.18, 'sine');
      var t2 = tone(349.23, c.currentTime + 0.12, 0.18, 0.15, 'sine');
      var w  = noiseWhoosh(0.10, 0.07, true);
      if (t1) t1.connect(masterComp);
      if (t2) t2.connect(masterComp);
      if (w)  connectWithReverb(w, 0.3);
    },

    // 15. NEW STUDENT FORM OPEN
    newStudentForm: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.modal);
      var w  = noiseWhoosh(0.14, 0.09, false);
      var t1 = tone(783.99, c.currentTime + 0.06, 0.20, 0.15);
      if (w)  connectWithReverb(w, 0.5);
      if (t1) connectWithReverb(t1, 0.6);
    },

    // 16. STUDENT CARD OPEN
    studentOpen: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var w  = noiseWhoosh(0.11, 0.08, false);
      var t1 = tone(880, c.currentTime + 0.04, 0.18, 0.14);
      if (w)  connectWithReverb(w, 0.4);
      if (t1) connectWithReverb(t1, 0.5);
    },

    // 17. STUDENT CARD CLOSE
    studentClose: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var w = noiseWhoosh(0.10, 0.07, true);
      if (w) connectWithReverb(w, 0.3);
      var t1 = tone(587.33, c.currentTime + 0.03, 0.16, 0.12);
      if (t1) t1.connect(masterComp);
    },

    // 18. STUDENT SAVE — Stamp + Confirm Chime
    studentSave: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.success);
      var body = mechanicalClick(180, 2.5, 0.040, 0.18);
      if (body) body.connect(masterComp);
      var bell = pluckString(1046.5, 1.0, 0.35, 1.3);
      if (bell) {
        var d = c.createDelay(0.2);
        d.delayTime.setValueAtTime(0.04, c.currentTime);
        bell.connect(d);
        connectWithReverb(d, 0.8);
      }
    },

    // 19. RANK VIP — Royal Harp Glissando (Cmaj9)
    rankVIP: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.vip);
      var freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      freqs.forEach(function(f, i) {
        var s = pluckString(f, 1.6 - i * 0.1, 0.38 - i * 0.03, 1.3);
        if (s) {
          var d = c.createDelay(0.5);
          d.delayTime.setValueAtTime(i * 0.06, c.currentTime);
          s.connect(d);
          connectWithReverb(d, 1.0);
        }
      });
    },

    // 20. RANK WARNING
    rankWarn: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.warn);
      var t1 = tone(440, c.currentTime,        0.30, 0.22, 'triangle');
      var t2 = tone(330, c.currentTime + 0.22, 0.32, 0.20, 'triangle');
      if (t1) connectWithReverb(t1, 0.5);
      if (t2) connectWithReverb(t2, 0.5);
    },

    // 21. REVENUE DRAWER OPEN — Mechanical Thunk + Coin Shimmer
    revenueOpen: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.cashRegister);
      var thud = mechanicalClick(90, 1.5, 0.045, 0.20);
      if (thud) thud.connect(masterComp);
      setTimeout(function() {
        if (!canPlay()) return;
        var now = c.currentTime;
        [1046.5, 1318.5, 1567.98].forEach(function(f, i) {
          var s = pluckString(f, 0.4, 0.12 - i * 0.03, 2.0);
          if (s) {
            var d = c.createDelay(0.2);
            d.delayTime.setValueAtTime(i * 0.04, now);
            s.connect(d);
            connectWithReverb(d, 0.7);
          }
        });
      }, 80);
    },

    // 22. CASH PAYMENT — Authentic "Cha-Ching" Register
    //     Lever click → metallic DING → silver coin cascade
    cashPayment: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.cashRegister);

      var now = c.currentTime;

      var click = mechanicalClick(320, 4, 0.025, 0.22);
      if (click) click.connect(masterComp);

      var ding = pluckString(1174.66, 0.9, 0.48, 2.0);
      if (ding) {
        var d1 = c.createDelay(0.2);
        d1.delayTime.setValueAtTime(0.07, now);
        ding.connect(d1);
        connectWithReverb(d1, 0.8);
      }

      var coinFreqs = [2093.0, 2637.0, 3136.0];
      coinFreqs.forEach(function(f, i) {
        var coin = pluckString(f, 0.35, 0.22, 2.5);
        if (coin) {
          var d = c.createDelay(0.2);
          d.delayTime.setValueAtTime(0.14 + i * 0.06, now);
          coin.connect(d);
          connectWithReverb(d, 0.6);
        }
      });
    },

    // 23. DEBT CLEARED / JACKPOT — Grand Orchestral Celebration
    //     Cmaj9 chord + coin waterfall + triumph shimmer wash
    debtCleared: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.jackpot);

      var now = c.currentTime;

      var chordFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chordFreqs.forEach(function(f, i) {
        var s = pluckString(f, 2.5 - i * 0.15, 0.42 - i * 0.05, 1.5);
        if (s) {
          var d = c.createDelay(0.3);
          d.delayTime.setValueAtTime(i * 0.04, now);
          s.connect(d);
          connectWithReverb(d, 1.0);
        }
      });

      var coins = [2093, 2349, 2637, 2794, 3136, 3520];
      coins.forEach(function(f, i) {
        var coin = pluckString(f, 0.5, 0.25 - i * 0.02, 2.8);
        if (coin) {
          var d = c.createDelay(0.5);
          d.delayTime.setValueAtTime(0.12 + i * 0.08, now);
          coin.connect(d);
          connectWithReverb(d, 0.7);
        }
      });

      var w = noiseWhoosh(0.25, 0.10, false);
      if (w) connectWithReverb(w, 0.9);
    },

    // 24. WHATSAPP MESSAGE SEND
    messageSend: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var w  = noiseWhoosh(0.08, 0.09, false);
      var t1 = tone(1046.5, c.currentTime + 0.03, 0.10, 0.14);
      if (w)  connectWithReverb(w, 0.3);
      if (t1) connectWithReverb(t1, 0.4);
    },

    // 25. MARKETING TAB — Radar Pulse
    marketingPulse: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var now = c.currentTime;
      var osc = c.createOscillator();
      var gn  = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
      gn.gain.setValueAtTime(0.001, now);
      gn.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gn.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gn);
      connectWithReverb(gn, 0.7);
      osc.start(now); osc.stop(now + 0.2);
    },

    // 26. MODAL OPEN
    modalOpen: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.modal);
      var w  = noiseWhoosh(0.12, 0.08, false);
      var t1 = tone(783.99, c.currentTime + 0.05, 0.15, 0.12);
      if (w)  connectWithReverb(w, 0.6);
      if (t1) connectWithReverb(t1, 0.5);
    },

    // 27. MODAL CLOSE
    modalClose: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.tap);
      var click = mechanicalClick(500, 3, 0.020, 0.10);
      var w     = noiseWhoosh(0.09, 0.06, true);
      if (click) click.connect(masterComp);
      if (w)     connectWithReverb(w, 0.3);
    },

    // 28. DELETE SWOOSH
    deleteSwoosh: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.delete);
      var w  = noiseWhoosh(0.16, 0.14, true);
      var t1 = tone(349.23, c.currentTime + 0.06, 0.16, 0.12, 'triangle');
      if (w)  connectWithReverb(w, 0.5);
      if (t1) t1.connect(masterComp);
    },

    // 29. MUTE ANNOUNCEMENT
    muteAnnouncement: function (isMuted) {
      if (isMuted) {
        var c = initAudioContext(); if (!c) return;
        var t1 = tone(880, c.currentTime,        0.20, 0.15);
        var t2 = tone(440, c.currentTime + 0.14, 0.25, 0.12);
        if (t1) connectWithReverb(t1, 0.5);
        if (t2) connectWithReverb(t2, 0.5);
      } else {
        if (!canPlay()) return;
        var c = initAudioContext(); if (!c) return;
        var t1 = tone(523.25, c.currentTime,        0.18, 0.16);
        var t2 = tone(783.99, c.currentTime + 0.12, 0.18, 0.18);
        if (t1) connectWithReverb(t1, 0.6);
        if (t2) connectWithReverb(t2, 0.6);
      }
    },

    // 30. GENERIC ERROR
    error: function () {
      if (!canPlay()) return;
      var c = initAudioContext(); if (!c) return;
      haptic(HapticPattern.error);
      var t1 = tone(349.23, c.currentTime,        0.22, 0.22, 'triangle');
      var t2 = tone(261.63, c.currentTime + 0.16, 0.25, 0.20, 'triangle');
      if (t1) connectWithReverb(t1, 0.4);
      if (t2) connectWithReverb(t2, 0.4);
    },

  };

  // --- DOM Event Delegation ---

  function setupDOMDelegation() {

    // Tap / Click on interactive elements
    document.addEventListener('pointerdown', function (e) {
      if (!canPlay()) return;
      var now = Date.now();
      if (now - lastTapTime < TAP_THROTTLE) return;
      lastTapTime = now;

      var target = e.target;
      if (!target) return;

      var tag = target.tagName ? target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;

      if (target.matches('input[type="checkbox"], input[type="radio"]') ||
          target.closest('.toggle-switch, .switch, .toggle')) {
        AssistantSounds.click();
        return;
      }

      if (
        target.matches('button, a, [role="button"], .btn, .card, .tab, .nav-item, .sidebar-item, label, select') ||
        target.closest('button, a, [role="button"], .btn, .card, .tab, .nav-item, .sidebar-item')
      ) {
        AssistantSounds.tap();
        return;
      }

    }, { capture: true, passive: true });

    // Typing on physical keyboard
    document.addEventListener('keydown', function (e) {
      if (!canPlay()) return;
      var skip = ['Shift','Control','Alt','Meta','CapsLock','Tab','Escape','Enter','Backspace','Delete','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
      if (skip.indexOf(e.key) !== -1) return;
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
        AssistantSounds.typingTick();
      }
    }, { passive: true });

    // Typing on MOBILE virtual keyboard — 'input' catches what 'keydown' misses
    document.addEventListener('input', function (e) {
      if (!canPlay()) return;
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
        var now = Date.now();
        if (now - lastTypingTime < KEY_THROTTLE) return;
        AssistantSounds.typingTick();
      }
    }, { passive: true });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDOMDelegation);
  } else {
    setupDOMDelegation();
  }

  // --- Backward Compatibility Bridge ---
  // Maps legacy playSound(type) calls in app.js to the studio engine.
  window.playSound = function (type) {
    switch (type) {
      case 'money':   AssistantSounds.cashPayment();       break;
      case 'success': AssistantSounds.attendanceSuccess(); break;
      case 'pop':     AssistantSounds.attendanceSuccess(); break;
      case 'error':   AssistantSounds.error();             break;
      case 'beep':    AssistantSounds.tap();               break;
      case 'tap':     AssistantSounds.tap();               break;
      case 'click':   AssistantSounds.click();             break;
      default:        AssistantSounds.tap();               break;
    }
  };

  // --- Public API ---
  window.AssistantSounds = AssistantSounds;

}(window, document));
