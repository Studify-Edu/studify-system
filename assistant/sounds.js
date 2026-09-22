/**
 * =======================================================================
 * STUDIFY — STUDIO SFX ENGINE (REAL MP3 AUDIO ENGINE)
 * =======================================================================
 * High-fidelity, real studio-recorded UI sound effects.
 * 
 * Architecture:
 * - Preloaded in-memory Web Audio API AudioBuffers for 0ms latency.
 * - Automatic offline support via Service Worker caching.
 * - Seamless fallback to HTML5 Audio if Web Audio is suspended.
 * - 100% backward-compatible with all existing system calls.
 * =======================================================================
 */

(function (window, document) {
  'use strict';

  // Determine base path for audio assets dynamically
  var scriptSrc = (document.currentScript && document.currentScript.src) || '';
  var soundDir = '';
  if (scriptSrc.indexOf('/assistant/') !== -1 || scriptSrc.indexOf('/admin/') !== -1) {
    soundDir = '../assets/sounds/';
  } else if (window.location.pathname.indexOf('/assistant/') !== -1 || window.location.pathname.indexOf('/admin/') !== -1) {
    soundDir = '../assets/sounds/';
  } else {
    soundDir = './assets/sounds/';
  }

  // Audio files manifest (All CC0 Studio Recorded Micro-SFX)
  var SOUND_MANIFEST = {
    scan:        'scan.mp3',
    cash:        'cash.mp3',
    achievement: 'achievement.mp3',
    warning:     'warning.mp3',
    error:       'error.mp3',
    send:        'send.mp3',
    lock:        'lock.mp3',
    delete:      'delete.mp3',
    tap:         'tap.mp3'
  };

  var audioCtx = null;
  var buffers = {};
  var audioElements = {};
  var isUnlocked = false;

  // Master volume control (comfortable studio level)
  var MASTER_VOLUME = 0.65;

  function isMuted() {
    if (window.isMuted) return true;
    try {
      if (localStorage.getItem('ca_muted') === '1') return true;
    } catch (_) {}
    return false;
  }

  function getAudioContext() {
    if (!audioCtx) {
      try {
        var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          audioCtx = new AudioCtxClass();
        }
      } catch (e) {
        console.warn('[SoundEngine] AudioContext unavailable:', e);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  // Preload and decode all sound files into RAM for instantaneous trigger
  function preloadSounds() {
    var ctx = getAudioContext();

    Object.keys(SOUND_MANIFEST).forEach(function (name) {
      var url = soundDir + SOUND_MANIFEST[name];

      // Also prepare standard HTML5 Audio as a dependable fallback
      try {
        var el = new Audio();
        el.preload = 'auto';
        el.src = url;
        audioElements[name] = el;
      } catch (_) {}

      // Decode into Web Audio buffer for true 0ms latency
      if (ctx && typeof fetch === 'function') {
        fetch(url)
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.arrayBuffer();
          })
          .then(function (arr) {
            return ctx.decodeAudioData(arr);
          })
          .then(function (decoded) {
            buffers[name] = decoded;
          })
          .catch(function () {
            // Silently fall back to HTMLAudioElement if fetch/decode fails
          });
      }
    });
  }

  // Unlock audio policy on first user gesture (Safari / Chrome / Android requirement)
  function unlock() {
    if (isUnlocked) return;
    var ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(function () {
        isUnlocked = true;
      }).catch(function () {});
    } else {
      isUnlocked = true;
    }
  }

  if (typeof window.addEventListener === 'function') {
    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(function (evt) {
      window.addEventListener(evt, unlock, { passive: true, once: true });
    });
  }

  // Core sound playback primitive
  function play(name, customVolume) {
    if (isMuted()) return;

    var vol = (typeof customVolume === 'number') ? customVolume : MASTER_VOLUME;
    var ctx = getAudioContext();

    // 1. Primary: Fast Web Audio Buffer playback (0ms latency)
    if (ctx && buffers[name]) {
      try {
        var source = ctx.createBufferSource();
        source.buffer = buffers[name];
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      } catch (e) {
        console.warn('[SoundEngine] Buffer playback failed, falling back:', e);
      }
    }

    // 2. Secondary: HTML5 Audio fallback
    if (audioElements[name]) {
      try {
        var el = audioElements[name].cloneNode();
        el.volume = Math.min(Math.max(vol, 0), 1);
        el.play().catch(function () {});
      } catch (_) {}
    }
  }

  // Gentle haptic feedback on devices with vibration motor
  function vibe(pattern) {
    try {
      if (navigator.vibrate && !isMuted()) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  // Public Sound Controller
  var SFX = {
    // Attendance & Scanning
    attendanceScan: function () {
      play('scan', 0.8);
      vibe([15]);
    },
    attendanceSuccess: function () {
      play('scan', 0.85);
      vibe([18, 30, 18]);
    },
    attendanceWarning: function () {
      play('warning', 0.8);
      vibe([30, 40, 30]);
    },
    attendanceRemove: function () {
      play('delete', 0.65);
      vibe([20]);
    },

    // Financial & Transactions
    cashPayment: function () {
      play('cash', 0.85);
      vibe([25, 40, 35]);
    },
    debtCleared: function () {
      play('achievement', 0.9);
      vibe([20, 30, 20, 30, 40]);
    },

    // Alerts & Notifications
    error: function () {
      play('error', 0.75);
      vibe([40, 50, 40]);
    },
    messageSend: function () {
      play('send', 0.75);
      vibe([12]);
    },
    marketingPulse: function () {
      play('send', 0.7);
      vibe([10]);
    },

    // System Operations
    shiftLock: function () {
      play('lock', 0.85);
      vibe([25]);
    },
    deleteSwoosh: function () {
      play('delete', 0.7);
      vibe([15]);
    },

    // UI Micro-Interactions
    tap: function () {
      play('tap', 0.45);
      vibe([6]);
    },
    click: function () {
      play('tap', 0.5);
      vibe([8]);
    },

    // Theme & State hooks
    themeMorning: function () { play('tap', 0.5); },
    themeNight: function () { play('tap', 0.5); },
    langSwitch: function () { play('tap', 0.5); },
    studentOpen: function () { play('tap', 0.4); },
    studentClose: function () { play('tap', 0.35); },
    studentSave: function () { play('scan', 0.7); },
    newStudentForm: function () { play('tap', 0.45); },
    revenueOpen: function () { play('cash', 0.75); },
    rankVIP: function () { play('achievement', 0.8); },
    rankWarn: function () { play('warning', 0.75); },
    cloudSyncStart: function () { play('tap', 0.4); },
    cloudSyncSuccess: function () { play('scan', 0.7); },
    cloudSyncError: function () { play('error', 0.75); },
    muteAnnouncement: function (muted) {
      if (!muted) play('tap', 0.6);
    },

    // Direct manual play
    play: play,
    preload: preloadSounds
  };

  // Legacy compatibility bridge
  window.playSound = function (type) {
    switch (type) {
      case 'money':
        SFX.cashPayment();
        break;
      case 'success':
      case 'pop':
        SFX.attendanceSuccess();
        break;
      case 'error':
        SFX.error();
        break;
      case 'beep':
      case 'tap':
      case 'click':
      default:
        SFX.tap();
        break;
    }
  };

  // Expose Globally
  window.AssistantSounds = SFX;
  window.SoundEngine = SFX;

  // Start preloading immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadSounds);
  } else {
    preloadSounds();
  }

})(window, document);
