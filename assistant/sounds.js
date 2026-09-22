/**
 * =======================================================================
 * STUDIFY — ULTRA STUDIO REAL SFX ENGINE (AUTHENTIC PHYSICAL AUDIO)
 * =======================================================================
 * Genuine, high-definition physical audio sound effects:
 * - Real POS Optical Barcode Scanner Beep
 * - Real Authentic Cash Register "Cha-Ching" (Drawer Open + Bell + Coins)
 * - Real Digital Electronic POS Terminal Beep (Instapay / Vodafone Cash)
 * - Real Apple Pay Achievement & Debt Cleared Chime
 * - Real Sparkling Gold Crown Chime (Student VIP Rank)
 * - Real Status Toggles (Normal & Warning)
 * - Real Cloud Sync Initiated & Cloud Sync Complete Chimes
 * - Real Cosmic Globe Spin Chime (Language Switch)
 * - Real iPhone iOS Keyboard Typing Click & Delete Key
 * - Real Morning Sunrise & Nightfall Atmospheric Theme Chimes
 * - Real Crystal Notification Tone (Messages & Alerts)
 * - Real Tactile Navigation Tab Switch & Micro-Touch Ticks
 * 
 * Architecture:
 * - Preloaded in-memory Web Audio API AudioBuffers for 0ms latency.
 * - Automatic background listener for iOS keyboard typing sounds.
 * - Automatic touch/hover micro-ticks on navigation elements.
 * - 100% offline support via Service Worker caching.
 * =======================================================================
 */

(function (window, document) {
  'use strict';

  // Strict check: Disable audio completely in Admin portal (sound is for assistant portal only)
  if (window.location.pathname.indexOf('/admin/') !== -1 || (window.location.href && window.location.href.indexOf('admin.html') !== -1)) {
    window.playSound = function () {};
    window.AssistantSounds = {
      isMuted: function () { return true; },
      play: function () {},
      preload: function () {},
      attachNavInteractions: function () {}
    };
    window.SoundEngine = window.AssistantSounds;
    return;
  }

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
    scan:          'scan.mp3',          // Real Optical Retail Barcode Scanner Beep
    cash:          'cash.mp3',          // Real Physical Cash Register "Cha-Ching" (Physical Cash Deposit)
    digital_pay:   'digital_pay.mp3',   // Real Digital Terminal Beep (Instapay / Vodafone Cash Deposit)
    achievement:   'achievement.mp3',   // Real Apple Pay Milestone / Debt Cleared Chime
    vip:           'vip.mp3',           // Real Sparkling Gold Crown Chime (Student VIP Rank)
    status_normal: 'status_normal.mp3', // Real Clean Status Toggle (Normal Student)
    status_warn:   'status_warn.mp3',   // Real Amber Alert Sound (Warning Student)
    sync_start:    'sync_start.mp3',    // Real Cloud Uplink / Sync Start Sound
    sync_done:     'sync_done.mp3',     // Real Cloud Upload Complete Chime
    globe:         'globe.mp3',         // Real Cosmic Globe Spin Chime (Language Switch)
    notif:         'notif.mp3',         // Authentic Apple iOS Note / WhatsApp Tri-Tone Message Chime
    notif_iphone:  'notif_iphone.mp3',  // Direct alias for iPhone notification chime
    page_attendance: 'page_attendance.mp3', // Real Attendance Clock-in Stamp + Arrival Chime (اليومية / الحضور)
    page_students:   'page_students.mp3',   // Real Index Card Ledger / Roster Flip (المسجلين)
    page_syllabus:   'page_syllabus.mp3',   // Real Academic Coursebook / Lecture Chime (المادة / المنهج)
    paper_sheet:     'paper_sheet.mp3',     // Real Crisp Paper Sheet Registration Form (طالب جديد)
    tab_switch:    'tab_switch.mp3',    // Real Mechanical Push Sound (Tab / Page Switch)
    touch_tick:    'touch_tick.mp3',    // Real Subtle Micro-Tick (Touch / Hover on Nav)
    warning:       'warning.mp3',       // Real Caution / Alert Sound
    error:         'error.mp3',         // Real Error / Rejection Sound
    send:          'send.mp3',          // Real iMessage / WhatsApp Sent Swoosh
    lock:          'lock.mp3',          // Real Heavy Lock / Safe Bolt Click
    menu:          'menu.mp3',          // Real Menu / Navigation Reveal Chime
    theme_day:     'theme_day.mp3',     // Real Morning Theme Sunrise Chime
    theme_night:   'theme_night.mp3',   // Real Night Theme Twilight Chime
    lang:          'lang.mp3',          // Real Language Switch Tink
    key_type:      'key_type.mp3',      // Real iPhone iOS Keyboard Typing Click
    key_delete:    'key_delete.mp3',    // Real iPhone iOS Keyboard Delete Key
    delete:        'delete.mp3',        // Fast deletion swoop
    tap:           'tap.mp3'            // Subtle micro-tap
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
  // AUTOMATIC NAVIGATION TOUCH & TAB SWITCH SOUNDS
  // =========================================================================
  var lastTouchTickTime = 0;
  function attachNavInteractions() {
    if (typeof document.querySelectorAll !== 'function') return;
    var navItems = document.querySelectorAll('.nav-item, .nav-group-header, .topbar-icon-btn, .tab-btn');
    navItems.forEach(function (el) {
      if (el._sfxAttached) return;
      el._sfxAttached = true;

      // Micro-tick on hover / pointer enter
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          var now = Date.now();
          if (now - lastTouchTickTime > 40) {
            lastTouchTickTime = now;
            SFX.touchTick();
          }
        }
      }, { passive: true });

      // Micro-tick on touchstart for touchscreens
      el.addEventListener('touchstart', function () {
        var now = Date.now();
        if (now - lastTouchTickTime > 50) {
          lastTouchTickTime = now;
          SFX.touchTick();
        }
      }, { passive: true });

      // Distinct contextual sound on clicking tabs and pages
      if (el.classList.contains('nav-item') || el.classList.contains('tab-btn') || el.classList.contains('admin-nav-item')) {
        el.addEventListener('click', function () {
          var id = el.id || '';
          if (id === 'btnTabHome' || id === 'navBtnDailyReport') {
            SFX.pageAttendance();
          } else if (id === 'btnTabStudents') {
            SFX.pageStudents();
          } else if (id === 'btnTabSyllabus' || id === 'btnTabPackages' || id === 'navBtnSyllabus' || id === 'navBtnPackages') {
            SFX.pageSyllabus();
          } else {
            SFX.tabSwitch();
          }
        }, { passive: true });
      }
    });
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

    // 2. Financial Transactions (Physical Cash vs Digital Mobile/Card Deposit)
    cashPayment: function () {
      // Authentic physical cash register "cha-ching" + drawer open!
      play('cash', 1.0);
      vibe([30, 50, 40]);
    },
    digitalPayment: function () {
      // Official digital POS terminal / mobile transfer confirmation (Instapay & Vodafone Cash)!
      play('digital_pay', 1.0);
      vibe([20, 30, 20]);
    },
    debtCleared: function () {
      play('achievement', 1.0);
      vibe([20, 30, 20, 30, 40]);
    },

    // 3. Student Rank & Status (VIP vs Normal vs Warning)
    rankVIP: function () {
      // Sparkling gold crown luxury chime (NOT the payment sound!)
      play('vip', 1.0);
      vibe([25, 35, 25]);
    },
    rankNormal: function () {
      // Clean status state toggle
      play('status_normal', 0.9);
      vibe([15]);
    },
    rankWarn: function () {
      // Distinct amber alert
      play('status_warn', 1.0);
      vibe([30, 40, 30]);
    },

    // 4. Cloud Sync (Dedicated Start and Done Chimes)
    cloudSyncStart: function () {
      play('sync_start', 1.0);
      vibe([25]);
    },
    cloudSyncSuccess: function () {
      // Beautiful iCloud / Cloud confirmation chime (NOT a barcode scan beep!)
      play('sync_done', 1.0);
      vibe([20, 30, 20]);
    },
    cloudSyncError: function () {
      play('error', 1.0);
      vibe([40, 50, 40]);
    },

    // 5. Language Switch (Cosmic Globe Spin Chime)
    langSwitch: function () {
      play('globe', 1.0);
      vibe([20]);
    },

    // 6. Navigation, Tabs & Contextual Pages
    pageAttendance: function () {
      // Real electronic attendance clock-in stamp + arrival confirmation chime (اليومية / تسجيل الحضور)
      play('page_attendance', 1.0);
      vibe([18, 30]);
    },
    pageStudents: function () {
      // Real index card ledger / registered student roster flip (الطلاب المسجلين)
      play('page_students', 0.95);
      vibe([15]);
    },
    pageSyllabus: function () {
      // Real academic coursebook opening & study lecture chime (المادة / المنهج)
      play('page_syllabus', 1.0);
      vibe([20]);
    },
    paperSheet: function () {
      // Real crisp registration paper form rustle and desk slide (كارت / استمارة طالب جديد)
      play('paper_sheet', 1.0);
      vibe([16]);
    },
    tabSwitch: function () {
      play('tab_switch', 0.9);
      vibe([12]);
    },
    touchTick: function () {
      play('touch_tick', 0.6);
      vibe([5]);
    },

    // 7. Notifications & Alerts (Authentic Apple iOS Note / WhatsApp Tri-Tone Message Chime)
    notification: function () {
      play('notif', 1.0);
      vibe([25, 40]);
    },
    notificationIPhone: function () {
      play('notif_iphone', 1.0);
      vibe([25, 40]);
    },
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

    // 8. System Operations & Safe
    shiftLock: function () {
      play('lock', 1.0);
      vibe([30]);
    },
    revenueOpen: function () {
      play('cash', 1.0);
    },
    deleteSwoosh: function () {
      play('delete', 0.85);
      vibe([20]);
    },

    // 9. Themes
    themeMorning: function () {
      play('theme_day', 0.9);
      vibe([15]);
    },
    themeNight: function () {
      play('theme_night', 0.9);
      vibe([15]);
    },

    // 10. Menus & Forms
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
      // Real crisp registration paper form rustle and desk slide
      play('paper_sheet', 1.0);
      vibe([16]);
    },

    // 11. Tactile UI Clicks & Keyboard
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
    preload: preloadSounds,
    attachNavInteractions: attachNavInteractions
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

  // Start preloading and attach DOM interactions
  function initEngine() {
    preloadSounds();
    attachNavInteractions();
    // Re-attach if DOM changes (e.g. dynamic tabs or menus)
    if (typeof MutationObserver !== 'undefined' && document.body) {
      var observer = new MutationObserver(function () {
        attachNavInteractions();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }

})(window, document);
