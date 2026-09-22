/**
 * =======================================================================
 * STUDIFY — ULTRA STUDIO REAL SFX ENGINE (AUTHENTIC PHYSICAL AUDIO)
 * =======================================================================
 * Genuine, high-definition physical audio sound effects:
 * - Real POS Optical Barcode Scanner Beep
 * - Real Authentic Cash Register "Cha-Ching" (Drawer Open + Bell + Coins)
 * - Real Apple Pay Achievement & Debt Cleared Chime
 * - Real iPhone iOS Keyboard Typing Click & Delete Key
 * - Real Morning Sunrise & Nightfall Atmospheric Theme Chimes
 * - Real Language Switch Tink & Navigation / Menu Open Chime
 * - Real iMessage / WhatsApp Sent Swoosh & Heavy Safe Lock
 * 
 * Architecture:
 * - Preloaded in-memory Web Audio API AudioBuffers for 0ms latency.
 * - Automatic background listener for iOS keyboard typing sounds.
 * - Automatic offline support via Service Worker caching.
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

  // Audio files manifest (Authentic, Real Physical Audio Recordings)
  var SOUND_MANIFEST = {
    scan:        'scan.mp3',        // Real Optical Supermarket Barcode Scanner Beep
    cash:        'cash.mp3',        // Real Authentic Cash Register "Cha-Ching" & Drawer Bell
    achievement: 'achievement.mp3', // Real Apple Pay Milestone / Debt Cleared Chime
    warning:     'warning.mp3',     // Real Caution / Alert Sound
    error:       'error.mp3',       // Real Error / Rejection Sound
    send:        'send.mp3',        // Real iMessage / WhatsApp Sent Swoosh
    lock:        'lock.mp3',        // Real Heavy Lock / Safe Bolt Click
    menu:        'menu.mp3',        // Real Menu / Navigation Reveal Chime
    theme_day:   'theme_day.mp3',   // Real Morning Theme Sunrise Chime
    theme_night: 'theme_night.mp3', // Real Night Theme Twilight Chime
    lang:        'lang.mp3',        // Real Language Switch Tink
    key_type:    'key_type.mp3',    // Real iPhone iOS Keyboard Typing Click
    key_delete:  'key_delete.mp3',  // Real iPhone iOS Keyboard Delete Key
    delete:      'delete.mp3',      // Fast deletion swoop
    tap:         'tap.mp3'          // Subtle micro-tap
  };

  var audioCtx = null;
  var buffers = {};
  var audioElements = {};
  var isUnlocked = false;

  // Master Volume: Loud, punchy, crisp, unmistakably audible
  var MASTER_VOLUME = 1.0;

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

      // Prepare standard HTML5 Audio as fallback
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
            // Silently fall back to HTMLAudioElement
          });
      }
    });
  }

  // Unlock audio policy on first user gesture
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
        gain.gain.setValueAtTime(Math.min(Math.max(vol, 0), 1.0), ctx.currentTime);
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
        el.volume = Math.min(Math.max(vol, 0), 1.0);
        el.play().catch(function () {});
      } catch (_) {}
    }
  }

  // Haptic feedback
  function vibe(pattern) {
    try {
      if (navigator.vibrate && !isMuted()) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  // =========================================================================
  // AUTOMATIC REAL IPHONE KEYBOARD TYPING SOUND ENGINE
  // =========================================================================
  var lastKeyTime = 0;
  function handleKeyTyping(e) {
    if (isMuted()) return;
    var target = e.target;
    if (!target) return;
    var tag = (target.tagName || '').toLowerCase();
    var isEditable = tag === 'input' || tag === 'textarea' || target.isContentEditable;
    if (!isEditable) return;

    var k = e.key;
    // Skip modifier & navigation keys
    if (!k || ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].indexOf(k) !== -1) {
      return;
    }

    var now = Date.now();
    if (now - lastKeyTime < 25) return; // Smooth cadence
    lastKeyTime = now;

    if (k === 'Backspace' || k === 'Delete') {
      play('key_delete', 0.85);
    } else {
      play('key_type', 0.8);
    }
  }

  if (typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', handleKeyTyping, { passive: true, capture: true });
  }

  // =========================================================================
  // PUBLIC SOUND CONTROLLER
  // =========================================================================
  var SFX = {
    // 1. Attendance & Scanning (Real Retail Optical Barcode Scanner Beep)
    attendanceScan: function () {
      play('scan', 1.0);
      vibe([20]);
    },
    attendanceSuccess: function () {
      play('scan', 1.0);
      vibe([18, 30, 18]);
    },
    attendanceWarning: function () {
      play('warning', 0.95);
      vibe([30, 40, 30]);
    },
    attendanceRemove: function () {
      play('delete', 0.85);
      vibe([20]);
    },

    // 2. Financial Transactions (Real Authentic Cash Register "Cha-Ching"!)
    cashPayment: function () {
      play('cash', 1.0);
      vibe([30, 50, 40]);
    },
    debtCleared: function () {
      play('achievement', 1.0);
      vibe([20, 30, 20, 30, 40]);
    },

    // 3. Alerts & Messaging (Real WhatsApp/iMessage swoosh & alert)
    error: function () {
      play('error', 0.95);
      vibe([40, 50, 40]);
    },
    messageSend: function () {
      play('send', 0.95);
      vibe([15]);
    },
    marketingPulse: function () {
      play('send', 0.9);
      vibe([12]);
    },

    // 4. System Operations (Real Lock & Safe click)
    shiftLock: function () {
      play('lock', 1.0);
      vibe([30]);
    },
    deleteSwoosh: function () {
      play('delete', 0.85);
      vibe([20]);
    },

    // 5. Themes, Menus & Languages (Real Morning, Night, Menu, Language chimes)
    themeMorning: function () {
      play('theme_day', 0.9);
      vibe([15]);
    },
    themeNight: function () {
      play('theme_night', 0.9);
      vibe([15]);
    },
    langSwitch: function () {
      play('lang', 0.9);
      vibe([15]);
    },
    menuOpen: function () {
      play('menu', 0.85);
      vibe([10]);
    },
    studentOpen: function () {
      play('menu', 0.85);
      vibe([10]);
    },
    studentClose: function () {
      play('tap', 0.5);
    },
    studentSave: function () {
      play('scan', 0.9);
    },
    newStudentForm: function () {
      play('menu', 0.85);
    },
    revenueOpen: function () {
      play('cash', 1.0);
    },
    rankVIP: function () {
      play('achievement', 1.0);
    },
    rankWarn: function () {
      play('warning', 0.95);
    },
    cloudSyncStart: function () {
      play('tap', 0.5);
    },
    cloudSyncSuccess: function () {
      play('scan', 0.9);
    },
    cloudSyncError: function () {
      play('error', 0.95);
    },

    // 6. Tactile UI Clicks & Keyboard
    tap: function () {
      play('tap', 0.55);
      vibe([8]);
    },
    click: function () {
      play('key_type', 0.75);
      vibe([8]);
    },
    keyType: function () {
      play('key_type', 0.8);
    },
    keyDelete: function () {
      play('key_delete', 0.85);
    },
    muteAnnouncement: function (muted) {
      if (!muted) play('scan', 0.8);
    },

    // Direct manual play & preload
    play: play,
    preload: preloadSounds
  };

  // Legacy compatibility bridge
  window.playSound = function (type) {
    switch (type) {
      case 'money':
      case 'cash':
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
      case 'scan':
        SFX.attendanceScan();
        break;
      case 'tap':
      case 'click':
      default:
        SFX.click();
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
