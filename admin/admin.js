// =========================================================
// STUDIFY ADMIN PORTAL ENGINE (admin.js)
// Standalone Manager Dashboard & High-Performance Control Logic
// =========================================================

// Admin portal is strictly silent - zero audio output
window.playSound = function() {};
const silentSoundTarget = {
  isMuted: function() { return true; },
  play: function() {},
  preload: function() {},
  attachNavInteractions: function() {},
  tabSwitch: function() {},
  pageAttendance: function() {},
  pageStudents: function() {},
  pageSyllabus: function() {},
  marketingPulse: function() {},
  notification: function() {},
  tap: function() {},
  error: function() {},
  cashPayment: function() {}
};
window.AssistantSounds = new Proxy(silentSoundTarget, {
  get: function(target, prop) {
    if (prop in target) return target[prop];
    return function() {}; // Safe fallback for any sound method
  }
});
window.SoundEngine = window.AssistantSounds;

const SUPABASE_URL = "https://erwrrvafuxezszgbiswg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyd3JydmFmdXhlenN6Z2Jpc3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTI4NzMsImV4cCI6MjEwMjgyODg3M30.xNbyENlnwes4XPWFoc10tooQTIC49WYo2zurvugkf9g";

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
window.supabaseClient = supabase;

// BroadcastChannel for 0-latency multi-tab sync
const permChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('studify_permissions_sync') : null;

// Instant Shift System State from cache to prevent any visual flicker on reload
const cachedShiftSys = localStorage.getItem('studify_shift_system_enabled');
window.shiftSystemEnabled = (cachedShiftSys === 'true'); // Defaults to false (OFF) if null or 'false'

// Listen for cross-tab shift changes and discount updates
if (permChannel) {
  permChannel.onmessage = (e) => {
    const data = e.data;
    if (!data) return;
    if (data.type === 'DAILY_SHIFT_CHANGE') {
      if (typeof data.shift_system_enabled === 'boolean') {
        window.shiftSystemEnabled = data.shift_system_enabled;
        localStorage.setItem('studify_shift_system_enabled', data.shift_system_enabled ? 'true' : 'false');
        const curD = document.getElementById("adminDailyDateInput")?.value || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
        if (typeof window.renderDailyApprovalWidget === 'function') {
          window.renderDailyApprovalWidget(curD);
        }
      }
      if (data.date && typeof dailyApprovalMap === 'object' && dailyApprovalMap) {
        dailyApprovalMap[data.date] = {
          status: data.isApproved ? 'approved' : 'pending',
          updated_at: new Date().toISOString()
        };
        if (typeof window.renderDailyApprovalWidget === 'function') {
          window.renderDailyApprovalWidget(data.date);
        }
      }
    } else if (data.type === 'STUDENT_DISCOUNT_UPDATED' || data.type === 'DECISION_APPROVED') {
      const stId = String(data.student_id);
      if (typeof students === 'object' && students[stId]) {
        if (data.discount !== undefined) students[stId].discount = Number(data.discount) || 0;
        if (data.packageDiscounts) students[stId].packageDiscounts = data.packageDiscounts;
      }
      if (window.selectedDirectDecisionStudent && String(window.selectedDirectDecisionStudent.id) === stId) {
        if (data.discount !== undefined) window.selectedDirectDecisionStudent.discount = Number(data.discount) || 0;
        if (data.packageDiscounts) window.selectedDirectDecisionStudent.packageDiscounts = data.packageDiscounts;
        if (typeof window.handleDirectDecisionPackageChange === 'function') {
          window.handleDirectDecisionPackageChange();
        }
      }
      if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    }
  };
}

// =============================================================================
// COMPLETE ADMIN LOCALIZATION DICTIONARY & I18N ENGINE
// =============================================================================
let currentLang = localStorage.getItem("ca_lang") || "ar";

const ADMIN_DICT = {
  "asst_hint_letters_only": { ar: "ط§ظƒطھط¨ ط§ظ„ط§ط³ظ… ظپظ‚ط· ط¨ط­ط±ظˆظپ ط¥ظ†ط¬ظ„ظٹط²ظٹط© طµط؛ظٹط±ط© ط¨ط¯ظˆظ† ظ…ط³ط§ظپط§طھ.", en: "Enter name with lowercase English letters & numbers only." },
  "asst_email_preview_prefix": { ar: "ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ظ…ط¹طھظ…ط¯ ظ„ظ„ط¯ط®ظˆظ„:", en: "Official Login Email:" },
  "asst_lbl_password_simple": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Password" },
  "asst_pass_ph": { ar: "ط£ط¯ط®ظ„ ظƒظ„ظ…ط© ظ…ط±ظˆط± ظ‚ظˆظٹط© ظ„ظ„ظ…ط³ط§ط¹ط¯", en: "Enter a strong password for assistant" },
  "asst_eye_title": { ar: "ط¥ط¸ظ‡ط§ط± / ط¥ط®ظپط§ط، ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Show / Hide password" },
  "modal_btn_cancel": { ar: "ط¥ظ„ط؛ط§ط،", en: "Cancel" },
  "modal_btn_create_asst": { ar: "ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨", en: "Create Account" },
  "trans_switching_theme": { ar: "ط¬ط§ط±ظٹ طھط¨ط¯ظٹظ„ ط§ظ„ظ…ط¸ظ‡ط±..", en: "Switching theme..." },
  "btn_login_admin": { ar: "ط¯ط®ظˆظ„ ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…", en: "Login as Administrator" },
  "prompt_switch_to_asst": { ar: "ظ‡ظ„ ط£ظ†طھ ظ…ط³ط§ط¹ط¯طں", en: "Are you an assistant?" },
  "action_switch_to_asst": { ar: "ط§ظ„ط§ظ†طھظ‚ط§ظ„ ظ„ط¨ظˆط§ط¨ط© ط§ظ„ظ…ط³ط§ط¹ط¯ ظˆط§ظ„ط¹ظ…ظ„ظٹط§طھ", en: "Go to Assistant Portal & Operations" },
  "nav_daily": { ar: "الرئيسية", en: "Home" },
  "nav_term": { ar: "الترم", en: "Term" },
  "nav_assistants": { ar: "السكرتارية", en: "Assistants" },
  "nav_more": { ar: "المزيد", en: "More" },

  "dec_val_ph": { ar: "ظ…ط«ط§ظ„: 100", en: "e.g. 100" },
  "dec_reason_ph": { ar: "ظ…ط«ط§ظ„: ظ‚ط±ط§ط± ظ…ط¯ظٹط± - ط¸ط±ظپ ط®ط§طµ / طھظپظˆظ‚ ط¯ط±ط§ط³ظٹ", en: "e.g. Manager Decision - Special case / Academic excellence" },
  "dec_no_pending": { ar: "ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ظ…ط¹ظ„ظ‚ط© ط­ط§ظ„ظٹط§ظ‹", en: "No pending requests at this time" },
  "stat_term_total_discounts": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط®طµظˆظ…ط§طھ ظˆط§ظ„ط¥ط¹ظپط§ط،ط§طھ (ط¬)", en: "Total Discounts & Exemptions (EGP)" },
  "pkg_loading": { ar: "ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط§ظ„ط¨ط§ظ‚ط§طھ..", en: "Loading packages..." },
  "syll_loading": { ar: "ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط§ظ„ظ…ظ†ظ‡ط¬..", en: "Loading syllabus..." },
  "asst_lbl_username": { ar: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… (ط­ط³ط§ط¨ ط§ظ„ط¯ط®ظˆظ„)", en: "Username (Login Account)" },
  "asst_lbl_password": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط£ظˆظ„ظٹط© ظ„ظ„ظ…ط³ط§ط¹ط¯", en: "Initial Password" },
  "asst_lbl_display_name": { ar: "ط§ظ„ط§ط³ظ… ط§ظ„ط¸ط§ظ‡ط± ظ„ظ„ظ…ط³ط§ط¹ط¯ (ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„)", en: "Display Name (Full Name)" },
  "trans_switching": { ar: "ط¬ط§ط±ظٹ ط§ظ„ط§ظ†طھظ‚ط§ظ„..", en: "Switching..." },

  // Assistants View & Modals
  "asst_mgmt_title": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طھط­ظƒظ… ظپظٹ ط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Assistants & Permissions Management" },
  "asst_mgmt_desc": { ar: "طھط­ظƒظ… ط¨ط´ظƒظ„ ظ…ط¨ط§ط´ط± ظپظٹ ط§ظ„ظ…ظٹط²ط§طھ ط§ظ„ظ…طھط§ط­ط© ظ„ظƒظ„ ظ…ط³ط§ط¹ط¯. ط£ظٹ طھط¹ط¯ظٹظ„ ظٹطھظ… طھط·ط¨ظٹظ‚ظ‡ ظپظˆط±ط§ظ‹ ظˆظ„ط­ط¸ظٹط§ظ‹ ظپظٹ طµظپط­ط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط§ظ„ظ…ظپطھظˆط­ط©.", en: "Directly control permissions available for each assistant. Any modifications are applied instantly to the assistant's active session." },
  "btn_add_asst": { ar: "ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯", en: "Add New Assistant" },
  "asst_created_at": { ar: "طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،:", en: "Created:" },
  "btn_asst_pass": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Password" },
  "btn_asst_delete": { ar: "ط­ط°ظپ", en: "Delete" },
  "asst_empty_title": { ar: "ظ„ط§ ظٹظˆط¬ط¯ ظ…ط³ط§ط¹ط¯ظٹظ† ظ…ط³ط¬ظ„ظٹظ† ط¨ط¹ط¯", en: "No assistants registered yet" },
  "asst_empty_desc": { ar: "ط§ط¶ط؛ط· ط¹ظ„ظ‰ 'ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯' ظ„ط¥ظ†ط´ط§ط، ط£ظˆظ„ ط­ط³ط§ط¨ ظˆطھط­ط¯ظٹط¯ طµظ„ط§ط­ظٹط§طھظ‡.", en: "Click 'Add New Assistant' to create the first account and configure permissions." },
  "asst_loading": { ar: "ط¬ط§ط±ظٹ ط¬ظ„ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ...", en: "Loading assistants and permissions..." },

  // Edit Password Modal
  "modal_edit_pass_title": { ar: "طھط¹ط¯ظٹظ„ ظƒظ„ظ…ط© ظ…ط±ظˆط± ط§ظ„ظ…ط³ط§ط¹ط¯:", en: "Update Assistant Password:" },
  "modal_edit_pass_desc": { ar: "ظ…ط¹ط§ظٹظ†ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ظˆطھط¹ظٹظٹظ† ظƒظ„ظ…ط© ظ…ط±ظˆط± ط¬ط¯ظٹط¯ط© ظˆظ…ط­ط¯ط«ط© ظپظˆط±ط§ظ‹", en: "View current password and set a new updated password instantly" },
  "modal_current_pass_lbl": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ط§ظ„ظ…ط³ط¬ظ„ط©:", en: "Current Registered Password:" },
  "modal_current_pass_hint": { ar: "ظ‡ط°ظ‡ ظ‡ظٹ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ط§ظ„ظ…ط³طھط®ط¯ظ…ط© ظ„ظ„ط¯ط®ظˆظ„.", en: "This is the current password used for logging in." },
  "modal_new_pass_lbl": { ar: "ط£ط¯ط®ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©:", en: "Enter New Password:" },
  "modal_new_pass_ph": { ar: "ط§ظƒطھط¨ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط© ظ‡ظ†ط§", en: "Type the new password here" },
  "modal_new_pass_hint": { ar: "ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ 6 ط®ط§ظ†ط§طھ (ط­ط±ظˆظپ ط£ظˆ ط£ط±ظ‚ط§ظ…).", en: "At least 6 characters (letters or numbers)." },
  "modal_btn_save_pass": { ar: "طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Update Password" },

  // Navigation & Sections
  "nav_sec_finance": { ar: "ط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„ظ…ط§ظ„ظٹط©", en: "Financial Reports" },
  "nav_daily_report": { ar: "ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ظٹظˆظ…ظٹ", en: "Daily Report" },
  "nav_term_report": { ar: "طھظ‚ط±ظٹط± ط§ظ„طھط±ظ… ط§ظ„ظ…ط§ظ„ظٹ", en: "Term Financial Report" },
  "nav_sec_management": { ar: "ط§ظ„ط¥ط¯ط§ط±ط© ظˆط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†", en: "Management & Assistants" },
  "nav_assistants": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Assistants & Permissions" },
  "nav_decisions": { ar: "ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ", en: "Decision Requests" },
  "nav_packages": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ", en: "Packages Management" },
  "nav_syllabus": { ar: "ط®ط±ظٹط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬", en: "Syllabus Roadmap" },
  "nav_sec_system": { ar: "ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ…", en: "System Settings" },
  "nav_settings": { ar: "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھظ‚ط¯ظ…ط© ظˆط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ", en: "Advanced Settings & Backup" },
  "nav_sec_subscription": { ar: "ط§ظ„ط§ط´طھط±ط§ظƒ ظˆط§ظ„ط¨ط§ظ‚ط©", en: "Subscription & Plan" },
  "nav_subscription": { ar: "ط®ط·ط© ط§ظ„ط§ط´طھط±ط§ظƒ", en: "Subscription Plan" },
  "nav_logout": { ar: "طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬", en: "Logout" },
  "nav_mobile_menu": { ar: "ط§ظ„ظ‚ط§ط¦ظ…ط©", en: "Menu" },

  // Topbar
  "topbar_theme_title": { ar: "طھط¨ط¯ظٹظ„ ط§ظ„ظ…ط¸ظ‡ط±", en: "Toggle Theme" },
  "topbar_lang_title": { ar: "طھط¨ط¯ظٹظ„ ط§ظ„ظ„ط؛ط© / Switch Language", en: "Switch Language" },
  "topbar_user_title": { ar: "ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ ظˆط§ظ„ط­ط³ط§ط¨", en: "Profile & Account" },

  // Login Screen
  "login_badge": { ar: "ط§ظ„ط¥ط¯ط§ط±ط© ط§ظ„ط¹ظ„ظٹط§ ظˆط§ظ„طھط­ظƒظ… ط§ظ„ظ…ط±ظƒط²ظٹ", en: "Executive Management & Central Control" },
  "login_title": { ar: "ظ„ظˆط­ط© طھط­ظƒظ… ط§ظ„ط¥ط¯ط§ط±ط©", en: "Admin Control Panel" },
  "login_desc": { ar: "طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ظ…ط®طµطµ ظ„ظ…ط¯ظٹط± ط§ظ„ظ…ط±ظƒط²", en: "Dedicated login for Center Director" },
  "login_user_lbl": { ar: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ظˆ ط§ظ„ط¨ط±ظٹط¯ (ط§ظ„ظ…ط¯ظٹط±)", en: "Username or Email (Manager)" },
  "login_pass_lbl": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Password" },
  "login_submit_btn": { ar: "ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©", en: "Login to Admin Dashboard" },
  "login_to_asst_portal": { ar: "ط¨ظˆط§ط¨ط© ط§ظ„ظ…ط³ط§ط¹ط¯ ظˆط§ظ„ط¹ظ…ظ„ظٹط§طھ", en: "Assistant & Operations Portal" },
  "login_asst_desc": { ar: "طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ط§ظ„ظٹظˆظ…ظٹ ظˆط§ظ„ظ…ظ‡ط§ظ… ط§ظ„ظ…ظٹط¯ط§ظ†ظٹط©", en: "Daily attendance & field operations" },

  // View 1: Daily Report
  "daily_shift_title": { ar: "ط­ط§ظ„ط© طھط´ط؛ظٹظ„ ط§ظ„ط´ظٹظپطھ ظˆط§ظ„ظٹظˆظ…ظٹط©", en: "Shift & Operations Status" },
  "daily_shift_frozen": { ar: "ظ…ط؛ظ„ظ‚ ظˆظ…ط¬ظ…ط¯ (OFF)", en: "Closed & Frozen (OFF)" },
  "daily_shift_active": { ar: "ظ…ظپطھظˆط­ ظˆظ†ط´ط· (LIVE)", en: "Open & Active (LIVE)" },
  "daily_shift_desc_frozen": { ar: "ط§ظ„ظٹظˆظ…ظٹط© ظ…طھظˆظ‚ظپط© ط§ظ„ط¢ظ†طŒ ظ„ط§ ظٹظ…ظƒظ† ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ† طھط³ط¬ظٹظ„ ط­ط¶ظˆط± ط¬ط¯ظٹط¯ ظ„ط­ظٹظ† ظپطھط­ ط§ظ„ط´ظٹظپطھ.", en: "Daily operations are currently paused. Assistants cannot record new attendance until shift is opened." },
  "daily_shift_desc_active": { ar: "ط§ظ„ظٹظˆظ…ظٹط© ظ‚ظٹط¯ ط§ظ„ط¹ظ…ظ„ ط§ظ„ظ…ط¨ط§ط´ط± ظˆطھط³طھظ‚ط¨ظ„ ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط¨ظ„ط­ط¸طھظ‡ط§.", en: "Daily operations are live and receiving real-time attendance and revenue transactions." },
  "daily_btn_activate": { ar: "طھظپط¹ظٹظ„ ظˆط¨ط¯ط، طھط´ط؛ظٹظ„ ط§ظ„ظٹظˆظ…ظٹط©", en: "Activate & Open Shift" },
  "daily_btn_freeze": { ar: "طھط¬ظ…ظٹط¯ ظˆظ‚ظپظ„ ط§ظ„ظٹظˆظ…ظٹط©", en: "Freeze & Close Shift" },
  "stat_today_revenue": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط¥ظٹط±ط§ط¯ ط§ظ„ظٹظˆظ…", en: "Total Today's Revenue" },
  "stat_today_expenses": { ar: "ظ…طµط±ظˆظپط§طھ ط§ظ„ظٹظˆظ…", en: "Today's Expenses" },
  "stat_net_vault": { ar: "طµط§ظپظٹ ط§ظ„ظ†ظ‚ط¯ظٹط© ط¨ط§ظ„ط®ط²ظٹظ†ط©", en: "Net Cash in Vault" },
  "stat_today_attending": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ط­ط§ط¶ط±ظٹظ†", en: "Total Attending Students" },
  "daily_approval_title": { ar: "ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط³ط§ط¨ط§طھ ط§ظ„ظٹظˆظ…ظٹط© ظˆطھطµظپظٹط± ط§ظ„ط´ظٹظپطھ", en: "Daily Financial Approval & Shift Closeout" },
  "daily_approval_desc": { ar: "ط§ظ„ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ†ظ‡ط§ط¦ظٹ ظ„ظ„ظ…ط¨ط§ظ„ط؛ ط§ظ„ظ…ط­طµظ„ط© ظˆط§ط³طھظ„ط§ظ… ط§ظ„ط®ط²ظٹظ†ط© ظ…ظ† ط§ظ„ظ…ط³ط§ط¹ط¯ ط§ظ„ظ…ط³ط¤ظˆظ„.", en: "Final approval of collected funds and cash vault handoff from the shift assistant." },
  "daily_btn_approve": { ar: "ط§ط¹طھظ…ط§ط¯ ط§ظ„ط­ط³ط§ط¨ ظˆط§ط³طھظ„ط§ظ… ط§ظ„ط®ط²ظٹظ†ط©", en: "Approve Accounts & Receive Vault" },
  "daily_approved_badge": { ar: "ظ…ط¹طھظ…ط¯ ظˆظ…ط³طھظ„ظ…", en: "Approved & Received" },
  "daily_tbl_st_title": { ar: "ط³ط¬ظ„ ط­ط¶ظˆط± ظˆظ…ط¯ظپظˆط¹ط§طھ ط§ظ„ظٹظˆظ… ط§ظ„طھظپطµظٹظ„ظٹ", en: "Today's Detailed Attendance & Payments Log" },
  "th_st_id": { ar: "ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨", en: "Student ID" },
  "th_st_name": { ar: "ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨", en: "Student Name" },
  "th_st_class": { ar: "ط§ظ„طµظپ / ط§ظ„ظ…ط§ط¯ط©", en: "Class / Subject" },
  "th_amount": { ar: "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹", en: "Amount Paid" },
  "th_time": { ar: "طھظˆظ‚ظٹطھ ط§ظ„طھط³ط¬ظٹظ„", en: "Timestamp" },
  "th_actions": { ar: "ط¥ط¬ط±ط§ط،ط§طھ", en: "Actions" },

  // View 2: Term Financial Report
  "term_report_title": { ar: "طھظ‚ط±ظٹط± ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ظˆط§ظ„ظ…طµط±ظˆظپط§طھ ظ„ظ„طھط±ظ… ط§ظ„ظ…ط§ظ„ظٹ", en: "Term Financial Revenue & Expense Report" },
  "filter_from_date": { ar: "ظ…ظ† طھط§ط±ظٹط®:", en: "From Date:" },
  "filter_to_date": { ar: "ط¥ظ„ظ‰ طھط§ط±ظٹط®:", en: "To Date:" },
  "filter_class_all": { ar: "ط¬ظ…ظٹط¹ ط§ظ„ظ…ط±ط§ط­ظ„ ط§ظ„ط¯ط±ط§ط³ظٹط©", en: "All Academic Grades" },
  "btn_export_excel": { ar: "طھطµط¯ظٹط± Excel", en: "Export Excel" },
  "btn_print_term": { ar: "ط·ط¨ط§ط¹ط© ط§ظ„طھظ‚ط±ظٹط±", en: "Print Report" },
  "stat_term_revenue": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط¥ظٹط±ط§ط¯ط§طھ ط§ظ„طھط±ظ…", en: "Total Term Revenue" },
  "stat_term_expenses": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ظ…طµط±ظˆظپط§طھ ط§ظ„طھط±ظ…", en: "Total Term Expenses" },
  "stat_term_profit": { ar: "طµط§ظپظٹ ط£ط±ط¨ط§ط­ ط§ظ„ظ…ط±ظƒط²", en: "Center Net Profit" },
  "search_st_placeholder": { ar: "ط§ط¨ط­ط« ط¨ط§ظ„ط§ط³ظ… ط£ظˆ ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨...", en: "Search by student name or ID..." },
  "th_st_phone": { ar: "ظ‡ط§طھظپ ط§ظ„ط·ط§ظ„ط¨", en: "Student Phone" },
  "th_parent_phone": { ar: "ظ‡ط§طھظپ ظˆظ„ظٹ ط§ظ„ط£ظ…ط±", en: "Parent Phone" },
  "th_total_paid": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط¯ظپظˆط¹", en: "Total Paid" },
  "th_discount": { ar: "ط§ظ„ط®طµظ…", en: "Discount" },
  "th_att_count": { ar: "ظ…ط±ط§طھ ط§ظ„ط­ط¶ظˆط±", en: "Attendances" },
  "th_payment_status": { ar: "ط­ط§ظ„ط© ط§ظ„ط³ط¯ط§ط¯", en: "Payment Status" },

  // View 3: Assistants
  "asst_page_title": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طھط­ظƒظ… ظپظٹ ط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Assistants & Permissions Management" },
  "asst_page_desc": { ar: "طھط­ظƒظ… ط¨ط´ظƒظ„ ظ…ط¨ط§ط´ط± ظپظٹ ط§ظ„ظ…ظٹط²ط§طھ ط§ظ„ظ…طھط§ط­ط© ظ„ظƒظ„ ظ…ط³ط§ط¹ط¯. ط£ظٹ طھط¹ط¯ظٹظ„ ظٹطھظ… طھط·ط¨ظٹظ‚ظ‡ ظپظˆط±ظٹط§ظ‹ ظˆظ„ط­ط¸ظٹط§ظ‹ ظپظٹ طµظپط­ط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط§ظ„ظ…ظپطھظˆط­ط©.", en: "Directly manage features and permissions for each assistant. Changes apply instantly in real-time." },
  "btn_add_new_asst": { ar: "ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯", en: "Add New Assistant" },
  "th_username": { ar: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…", en: "Username" },
  "th_role": { ar: "ط§ظ„ط¯ظˆط± ط§ظ„ظˆط¸ظٹظپظٹ", en: "Role" },
  "th_status": { ar: "ط§ظ„ط­ط§ظ„ط©", en: "Status" },
  "th_permissions": { ar: "ط§ظ„طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ظ…ظ†ظˆط­ط©", en: "Granted Permissions" },
  "th_password": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", en: "Password" },
  "btn_edit_pass": { ar: "طھط¹ط¯ظٹظ„", en: "Edit" },
  "perm_can_add_student": { ar: "ط¥ط¶ط§ظپط© ط·ط§ظ„ط¨", en: "Add Student" },
  "perm_can_edit_student": { ar: "طھط¹ط¯ظٹظ„ ط¨ظٹط§ظ†ط§طھ", en: "Edit Student" },
  "perm_can_delete_student": { ar: "ط­ط°ظپ ط·ط§ظ„ط¨", en: "Delete Student" },
  "perm_show_revenue": { ar: "ط±ط¤ظٹط© ط§ظ„ط¥ظٹط±ط§ط¯", en: "View Revenue" },
  "perm_manage_expenses": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…طµط±ظˆظپط§طھ", en: "Manage Expenses" },
  "perm_manage_packages": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ", en: "Manage Packages" },
  "perm_manage_booklets": { ar: "ط¬ط±ط¯ ط§ظ„ظ…ط°ظƒط±ط§طھ", en: "Inventory Booklets" },
  "perm_manage_syllabus": { ar: "طھط­ط¯ظٹط« ط§ظ„ظ…ظ†ظ‡ط¬", en: "Update Syllabus" },
  "perm_export_excel": { ar: "طھطµط¯ظٹط± Excel", en: "Export Excel" },
  "perm_manage_groups": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ", en: "Manage Groups" },

  // View 4: Decision Requests
  "decisions_page_title": { ar: "طµظ†ط¯ظˆظ‚ ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ ط§ظ„ظˆط§ط±ط¯ط© ظ…ظ† ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†", en: "Assistant Decision Requests Inbox" },
  "decisions_page_desc": { ar: "ظ…ط±ط§ط¬ط¹ط© ظˆط§ط¹طھظ…ط§ط¯ ط£ظˆ ط±ظپط¶ ط·ظ„ط¨ط§طھ ط§ظ„ط®طµظ… ظˆط§ظ„ط¥ط¹ظپط§ط، ط§ظ„ظ…ط§ظ„ظٹ ط§ظ„ظ…ظ‚ط¯ظ…ط© ظ…ظ† ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†.", en: "Review, approve, or reject discount and fee exemption requests submitted by assistants." },
  "tab_dec_pending": { ar: "ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…ط¹ظ„ظ‚ط©", en: "Pending Requests" },
  "tab_dec_approved": { ar: "ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…ظ‚ط¨ظˆظ„ط©", en: "Approved Requests" },
  "tab_dec_rejected": { ar: "ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…ط±ظپظˆط¶ط©", en: "Rejected Requests" },
  "btn_approve_req": { ar: "ظ‚ط¨ظˆظ„ ظˆط§ط¹طھظ…ط§ط¯ ط§ظ„ط®طµظ…", en: "Approve & Apply Discount" },
  "btn_reject_req": { ar: "ط±ظپط¶ ط§ظ„ط·ظ„ط¨", en: "Reject Request" },

  // View 5: Packages & Expenses
  "packages_mgmt_title": { ar: "ط¥ط¯ط§ط±ط© ط¨ط§ظ‚ط§طھ ظˆط£ط³ط¹ط§ط± ط§ظ„ظ…ط±ظƒط²", en: "Center Packages & Pricing Management" },
  "btn_add_new_pkg": { ar: "ط¥ط¶ط§ظپط© ط¨ط§ظ‚ط© ط¬ط¯ظٹط¯ط©", en: "Add New Package" },
  "expenses_record_title": { ar: "طھط³ط¬ظٹظ„ ظˆطھظˆط«ظٹظ‚ ظ…طµط±ظˆظپط§طھ ط§ظ„ظ…ط±ظƒط²", en: "Record & Document Center Expenses" },
  "lbl_expense_reason": { ar: "ط¨ظ†ط¯ ط§ظ„ظ…طµط±ظˆظپ / ط§ظ„ط³ط¨ط¨", en: "Expense Item / Purpose" },
  "lbl_expense_amount": { ar: "ط§ظ„ظ…ط¨ظ„ط؛ (ط¬)", en: "Amount (EGP)" },
  "lbl_expense_date": { ar: "ط§ظ„طھط§ط±ظٹط®", en: "Date" },
  "btn_record_expense": { ar: "طھط³ط¬ظٹظ„ ط§ظ„ظ…طµط±ظˆظپ", en: "Record Expense" },

  // View 6: Syllabus Roadmap
  "syllabus_mgmt_title": { ar: "ط¥ط¶ط§ظپط© ظˆطھط­ط¯ظٹط« ط®ط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬ ط§ظ„ط¯ط±ط§ط³ظٹ", en: "Add & Update Syllabus Roadmap Plan" },
  "lbl_syll_name": { ar: "ط§ط³ظ… ط§ظ„ظپطµظ„ / ط§ظ„ط¯ط±ط³", en: "Chapter / Lesson Name" },
  "lbl_syll_status": { ar: "ط­ط§ظ„ط© ط§ظ„ط´ط±ط­", en: "Progress Status" },
  "syll_status_not_started": { ar: "ظ„ظ… ظٹط¨ط¯ط£ ط¨ط¹ط¯", en: "Not Started" },
  "syll_status_in_progress": { ar: "ط¬ط§ط±ظٹ ط§ظ„ط´ط±ط­", en: "In Progress" },
  "syll_status_completed": { ar: "طھظ… ط§ظ„ط§ظ†طھظ‡ط§ط،", en: "Completed" },
  "lbl_syll_notes": { ar: "ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„ط­طµط© ط§ظ„ط£ط®ظٹط±ط© (طھط¸ظ‡ط± ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†)", en: "Latest Session Notes (Visible to Assistants)" },
  "btn_save_lesson": { ar: "ط­ظپط¸ ظˆط¥ط¶ط§ظپط© ظ„ظ„ط¬ط¯ظˆظ„", en: "Save & Add to Roadmap" },
  "syllabus_timeline_title": { ar: "ط®ط±ظٹط·ط© ط§ظ„ط¯ط±ظˆط³ ط§ظ„ط­ط§ظ„ظٹط©", en: "Current Lessons Roadmap" },

  // View 7: Subscriptions
  "sub_title": { ar: "ط®ط·ط· ط§ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ظ…طھط§ط­ط© â€” Standard", en: "Available Subscription Plans â€” Standard" },
  "sub_plan_flexible": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظ†ط©", en: "Flexible Plan" },
  "sub_plan_comfortable": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظٹط­ط©", en: "Comfortable Plan" },
  "sub_plan_golden": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ط°ظ‡ط¨ظٹط© (ط§ظ„طھط±ظ…)", en: "Golden Term Plan" },
  "sub_btn_contact": { ar: "طھظˆط§طµظ„ ظ„ظ„ط§ط´طھط±ط§ظƒ", en: "Contact to Subscribe" },

  // View 8: Settings, Appearance & Danger Zone
  "admin_set_ui_title": { ar: "ط§ظ„ظ…ط¸ظ‡ط± ظˆطھط®طµظٹطµ ط§ظ„ظ„ط؛ط©", en: "Appearance & Language Customization" },
  "admin_lbl_theme": { ar: "ظ…ط¸ظ‡ط± ط§ظ„ظ†ط¸ط§ظ… (ط§ظ„ط«ظٹظ…):", en: "System Theme:" },
  "admin_theme_dark": { ar: "ط§ظ„ظˆط¶ط¹ ط§ظ„ظ„ظٹظ„ظٹ ط§ظ„ظپط§ط®ط± (Dark Mode)", en: "Luxury Dark Mode" },
  "admin_theme_light": { ar: "ط§ظ„ظˆط¶ط¹ ط§ظ„ظ†ظ‡ط§ط±ظٹ (Light Mode)", en: "Crisp Light Mode" },
  "backup_card_title": { ar: "ط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ ظˆطھطµط¯ظٹط± ط§ظ„ط¨ظٹط§ظ†ط§طھ", en: "Data Backup & Export" },
  "btn_export_full_db": { ar: "طھطµط¯ظٹط± ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظƒط§ظ…ظ„ط© (Excel)", en: "Export Full Database (Excel)" },
  "btn_import_excel": { ar: "ط§ط³طھظٹط±ط§ط¯ ط¨ظٹط§ظ†ط§طھ ظ…ظ† Excel", en: "Import Data from Excel" },
  "danger_zone_title": { ar: "ظ…ظ†ط·ظ‚ط© ط§ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط­ط³ط§ط³ط© (Danger Zone)", en: "Sensitive Operations (Danger Zone)" },
  "danger_zone_desc": { ar: "طھطµظپظٹط± ط¨ظٹط§ظ†ط§طھ ط§ظ„ط­ط¶ظˆط± ط£ظˆ ط¥ط¹ط§ط¯ط© طھط¹ظٹظٹظ† ط§ظ„ظ†ط¸ط§ظ… ط¨ط§ظ„ظƒط§ظ…ظ„. ظ‡ط°ظ‡ ط§ظ„ط®ط·ظˆط© ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹ ط¹ظ†ظ‡ط§ ط¥ظ„ط§ ط¨ط§ط³طھط±ط¬ط§ط¹ ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط©.", en: "Reset attendance records or perform a complete factory reset. This action is irreversible unless restored from backup." },
  "btn_reset_term": { ar: "طھطµظپظٹط± ط­ط¶ظˆط± ظˆظ…طµط§ط±ظٹظپ ط§ظ„طھط±ظ… ط¨ط§ظ„ظƒط§ظ…ظ„", en: "Reset Entire Term Attendance & Expenses" },
  "btn_factory_reset": { ar: "ط¥ط¹ط§ط¯ط© طھظ‡ظٹط¦ط© ط§ظ„ظ†ط¸ط§ظ… ط¨ط§ظ„ظƒط§ظ…ظ„ (ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹)", en: "Factory Reset Entire System" },

  // Modals & General
  "modal_add_asst_title": { ar: "ط¥ط¶ط§ظپط© ط­ط³ط§ط¨ ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯", en: "Add New Assistant Account" },
  "modal_add_asst_desc": { ar: "ظ‚ظ… ط¨ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط¢ظ…ظ† ظ„ظ…ط³ط§ط¹ط¯ظƒ ظ„ط¥ط¯ط§ط±ط© ط§ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„ظ…ظٹط¯ط§ظ†ظٹط© ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Create a secure account for your assistant to handle field operations and permissions" },
  "modal_asst_user_lbl": { ar: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ„ظ…ط³ط§ط¹ط¯", en: "Assistant Username" },
  "modal_asst_user_hint": { ar: "ط§ط³ظ… ط¨ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط© ظپظ‚ط· ط¨ط¯ظˆظ† ظ…ط³ط§ظپط§طھطŒ ط³ظٹطھظ… ط§ط³طھط®ط¯ط§ظ…ظ‡ ظپظٹ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„", en: "English characters only without spaces, used for signing in" },
  "modal_asst_pass_lbl": { ar: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ظ…ط¤ظ‚طھط©", en: "Temporary Password" },
  "modal_asst_pass_hint": { ar: "6 ط£ط­ط±ظپ ط£ظˆ ط£ط±ظ‚ط§ظ… ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„طŒ ظٹظ…ظƒظ† ظ„ظ„ظ…ط³ط§ط¹ط¯ طھط؛ظٹظٹط±ظ‡ط§ ظ„ط§ط­ظ‚ط§ظ‹", en: "At least 6 characters, assistant can change it later" },
  "modal_btn_cancel": { ar: "ط¥ظ„ط؛ط§ط،", en: "Cancel" },
  "modal_btn_create_asst": { ar: "ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨ ظˆطھظپط¹ظٹظ„ ط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Create Account & Grant Permissions" },

  // Daily Report & Status Banner
  "stat_attended_today": { ar: "ط·ظ„ط§ط¨ ط­ط¶ط±ظˆط§ ط§ظ„ظٹظˆظ…", en: "Attended Today" },
  "stat_shift_revenue": { ar: "ط¥ظٹط±ط§ط¯ ط§ظ„ظˆط±ط¯ظٹط© (ط¬)", en: "Shift Revenue (EGP)" },
  "stat_absent_today": { ar: "ط؛ظٹط§ط¨ ط§ظ„ظٹظˆظ…", en: "Absent Today" },
  "stat_expenses_today": { ar: "ظ…طµط±ظˆظپط§طھ ط§ظ„ظٹظˆظ… (ط¬)", en: "Today's Expenses (EGP)" },
  "daily_breakdown_title": { ar: "طھظپط§طµظٹظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ ظ„ظٹظˆظ…:", en: "Attendance & Groups Details for:" },
  "daily_reject_lbl": { ar: "ط³ط¨ط¨ ط§ظ„طھط¹ظ„ظٹظ‚ ط£ظˆ ط§ظ„ط±ظپط¶ (ظٹط¸ظ‡ط± ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†):", en: "Suspension or Rejection Reason (Visible to Assistants):" },
  "daily_reject_ph": { ar: "ط§ظƒطھط¨ ط³ط¨ط¨ ط§ظ„ط±ظپط¶ ط£ظˆ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ ظ‡ظ†ط§..", en: "Type rejection reason or instructions here.." },
  "daily_confirm_reject_btn": { ar: "طھط£ظƒظٹط¯ ط§ظ„ط±ظپط¶", en: "Confirm Rejection" },

  // Term Financial Report
  "stat_term_total_students": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ط³ط¬ظ„ظٹظ†", en: "Total Registered Students" },
  "stat_term_total_rev": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط§ظ„ظ…ط­طµظ„ط© (ط¬)", en: "Total Collected Revenue (EGP)" },
  "lbl_breakdown_btn": { ar: "ط¹ط±ط¶ ط§ظ„طھظپط§طµظٹظ„", en: "View Details" },
  "btn_vault_transfer": { ar: "طھط­ظˆظٹظ„ ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ†", en: "Transfer Between Vaults" },
  "btn_vault_transfers_history": { ar: "ط³ط¬ظ„ ط§ظ„طھط­ظˆظٹظ„ط§طھ", en: "Transfers History" },
  "vault_trans_modal_title": { ar: "طھط­ظˆظٹظ„ ط£ظ…ظˆط§ظ„ ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ط­ظٹط©", en: "Inter-Vault Fund Transfer" },
  "vault_trans_modal_subtitle": { ar: "ظ…ظ†ط§ظ‚ظ„ط© ظ†ظ‚ط¯ظٹط© ظˆط¨ظ†ظƒظٹط© ظ„ط¶ط¨ط· ط§ظ„ط³ظٹظˆظ„ط© ط§ظ„ظپط¹ظ„ظٹط© ط¯ظˆظ† ط§ظ„ظ…ط³ط§ط³ ط¨ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ظ‚ط¨ظˆط¶ط§طھ", en: "Transfer cash and electronic balances without affecting gross receipts" },
  "lbl_from_vault": { ar: "ظ…ظ† ط®ط²ظٹظ†ط© (ط§ظ„ظ…طµط¯ط±) *", en: "From Vault (Source) *" },
  "lbl_to_vault": { ar: "ط¥ظ„ظ‰ ط®ط²ظٹظ†ط© (ط§ظ„ظ‡ط¯ظپ) *", en: "To Vault (Destination) *" },
  "lbl_trans_amount": { ar: "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط±ط§ط¯ طھط­ظˆظٹظ„ظ‡ (ط¬ظ†ظٹظ‡) *", en: "Amount to Transfer (EGP) *" },
  "lbl_trans_note": { ar: "ط§ظ„ط¨ظٹط§ظ† / ط³ط¨ط¨ ط§ظ„طھط­ظˆظٹظ„ (ط§ط®طھظٹط§ط±ظٹ)", en: "Statement / Transfer Reason (Optional)" },
  "btn_confirm_trans": { ar: "طھط£ظƒظٹط¯ ظˆطھظ†ظپظٹط° ط§ظ„طھط­ظˆظٹظ„", en: "Confirm & Execute Transfer" },
  "vault_hist_modal_title": { ar: "ط³ط¬ظ„ ط­ط±ظƒط§طھ ط§ظ„طھط­ظˆظٹظ„ ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ†", en: "Inter-Vault Transfers Log" },
  "vault_hist_modal_subtitle": { ar: "طھظˆط«ظٹظ‚ ظƒط§ظ…ظ„ ظ„ظƒط§ظپط© ط§ظ„ظ…ظ†ط§ظ‚ظ„ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ظ…ظ†ظپط°ط© ط¨ظٹظ† ط§ظ„ظƒط§ط´ ظˆط¥ظ†ط³طھط§ط¨ط§ظٹ ظˆط§ظ„ظ…ط­ط§ظپط¸", en: "Complete log of fund transfers between cash, instapay, and wallets" },
  "exp_modal_title": { ar: "طھظپط§طµظٹظ„ ط§ظ„ظ…طµط±ظˆظپط§طھ ط§ظ„طھط´ط؛ظٹظ„ظٹط©", en: "Operating Expenses Details" },
  "exp_modal_subtitle": { ar: "ظ…ط±ط§ط¬ط¹ط© ظƒط§ظ…ظ„ط© ظ„ظ„ظ…طµط±ظˆظپط§طھ ظ…ط¹ ظپظ„طھط±ط© ظ…ط®طµطµط© ط¨ط§ظ„طھط§ط±ظٹط® ظˆط§ظ„ظپطھط±ط©", en: "Review expenses with date range filtering" },
  "wd_modal_title": { ar: "طھظپط§طµظٹظ„ ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط± / ط§ظ„ط´ط®طµظٹط©", en: "Teacher / Personal Withdrawals Details" },
  "wd_modal_subtitle": { ar: "ظ…طھط§ط¨ط¹ط© ط¯ظ‚ظٹظ‚ط© ظ„ظ„ط£ط±ط¨ط§ط­ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ط®ط§طµط© ظ…ط¹ ظپظ„طھط±ط© ط§ظ„طھط§ط±ظٹط® ظ„ظƒظ„ ظپطھط±ط©", en: "Track owner profits and withdrawals with date range filtering" },
  "disc_modal_title": { ar: "طھظپط§طµظٹظ„ ط§ظ„ط®طµظˆظ…ط§طھ ظˆط§ظ„ط¥ط¹ظپط§ط،ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©", en: "Financial Discounts & Exemptions" },
  "disc_modal_subtitle": { ar: "ط¨ظٹط§ظ† ط´ط§ظ…ظ„ ط¨ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ظ…ظ†ظˆط­ظٹظ† ط®طµظˆظ…ط§طھ ظˆط¥ط¹ظپط§ط،ط§طھ ظ…ط§ط¯ظٹط© ظ…ط¹ ط£ط±طµط¯طھظ‡ظ… ط§ظ„ط­ط§ظ„ظٹط©", en: "Comprehensive list of discounted students and current debt" },
  "disc_total_amount_lbl": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ظ…ط¨ط§ظ„ط؛ ط§ظ„ط®طµظˆظ…ط§طھ ط§ظ„ظ…ظ…ظ†ظˆط­ط©", en: "Total Granted Discounts" },
  "disc_students_count_lbl": { ar: "ط¹ط¯ط¯ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ط³طھظپظٹط¯ظٹظ† ظ…ظ† ط§ظ„ط®طµظ…", en: "Count of Discounted Students" },
  "btn_all_term": { ar: "ظƒظ„ ط§ظ„طھط±ظ…", en: "All Term" },
  "btn_today": { ar: "ط§ظ„ظٹظˆظ…", en: "Today" },
  "btn_apply_filter": { ar: "طھط·ط¨ظٹظ‚", en: "Apply" },
  "rev_modal_title": { ar: "طھظپط§طµظٹظ„ ظˆطھظˆط²ظٹط¹ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط§ظ„ظ…ط­طµظ„ط©", en: "Collected Revenue Breakdown" },
  "rev_modal_subtitle": { ar: "طھط­ظ„ظٹظ„ ظ…ط§ظ„ظٹ طھظپطµظٹظ„ظٹ ظ„ظ…طµط§ط¯ط± ط§ظ„ط¯ط®ظ„ ظˆطھظˆط²ظٹط¹ ط§ظ„طھط¯ظپظ‚ط§طھ ط§ظ„ظ†ظ‚ط¯ظٹط© ظˆط§ظ„ط¨ظ†ظƒظٹط©", en: "Detailed financial analysis of income sources and cash flow distribution" },
  "rev_grand_total_lbl": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ط§ظ„ظƒظ„ظٹط© ط§ظ„ظ…ط­طµظ„ط©", en: "Grand Total Collected Revenue" },
  "rev_src_regular": { ar: "ط·ظ„ط§ط¨ ظ…ظ†طھط¸ظ…ظٹظ†", en: "Regular Students" },
  "rev_src_session": { ar: "ط·ظ„ط§ط¨ ط­طµط©", en: "Session Students" },
  "rev_src_booklets": { ar: "ظ…ط°ظƒط±ط§طھ ظˆظ…ط®ط²ظ†", en: "Booklets & Supplies" },
  "rev_card_regular_title": { ar: "ط§ط´طھط±ط§ظƒط§طھ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ظ†طھط¸ظ…ظٹظ†", en: "Regular Students Subscriptions" },
  "rev_card_session_title": { ar: "ط­ط¶ظˆط± ط·ظ„ط§ط¨ ط§ظ„ط­طµط© ط§ظ„ظپظˆط±ظٹط©", en: "Immediate Session Attendance" },
  "rev_card_booklets_title": { ar: "ظ…ط¨ظٹط¹ط§طھ ط§ظ„ظ…ط°ظƒط±ط§طھ ظˆط§ظ„ظ…ط®ط²ظ†", en: "Booklets & Inventory Sales" },
  "rev_sec_treasury_title": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ظ‚ط¨ظˆط¶ط§طھ ط­ط³ط¨ ظˆط³ظٹظ„ط© ط§ظ„ط¯ظپط¹ (ط´ط§ظ…ظ„ ظƒط§ظپط© ط§ظ„ظ…طµط§ط¯ط±)", en: "Total Collections by Payment Method (All Sources Combined)" },
  "treasury_cash_total": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظƒط§ط´ (ط§ظ„ط¯ط±ط¬)", en: "Total Cash (Drawer)" },
  "treasury_instapay_total": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط¥ظ†ط³طھط§ط¨ط§ظٹ", en: "Total InstaPay" },
  "treasury_wallet_total": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´", en: "Total Vodafone Cash" },
  "stat_term_total_exp": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…طµط±ظˆظپط§طھ ط§ظ„طھط´ط؛ظٹظ„ظٹط© (ط¬)", en: "Total Operating Expenses (EGP)" },
  "stat_term_total_withdrawals": { ar: "ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط± / ط§ظ„ط´ط®طµظٹط© (ط¬)", en: "Teacher / Owner Withdrawals (EGP)" },
  "stat_term_net_vault": { ar: "طµط§ظپظٹ ط±طµظٹط¯ ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ظ…طھط§ط­ (ط¬)", en: "Net Available Vaults Balance (EGP)" },
  "stat_term_total_debt": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…طھط¨ظ‚ظٹ ظˆط§ظ„ط¯ظٹظˆظ† (ط¬)", en: "Total Outstanding & Debt (EGP)" },
  "term_vaults_title": { ar: "ط£ط±طµط¯ط© ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ط­ظٹط© ظˆط­ط±ظƒط© ط§ظ„طھط¯ظپظ‚ ط§ظ„ظ…ط§ظ„ظٹ", en: "Live Vault Balances & Cash Flow" },
  "term_vaults_sync_subtitle": { ar: "طھط­ط¯ظٹط« ظپظˆط±ظٹ ظˆطھط²ط§ظ…ظ†ظٹ ظ„ظƒط§ظپط© ظˆط³ط§ط¦ظ„ ط§ظ„ط¯ظپط¹", en: "Real-time sync for all payment methods" },
  "vault_cash_drawer": { ar: "ط¯ط±ط¬ ط§ظ„ظƒط§ط´ (ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ†ظ‚ط¯ظٹط©)", en: "Cash Drawer (Vault)" },
  "vault_cash_sub": { ar: "ط§ظ„ظ…ظ‚ط¨ظˆط¶ط§طھ ظˆط§ظ„ظ…طµط±ظˆظپط§طھ ط§ظ„ظˆط±ظ‚ظٹط©", en: "Paper cash receipts & expenses" },
  "pill_cash": { ar: "ظƒط§ط´", en: "Cash" },
  "lbl_cash_in": { ar: "ط§ظ„ظ…ظ‚ط¨ظˆط¶ ظ†ظ‚ط¯ط§ظ‹:", en: "Cash Received:" },
  "lbl_cash_out": { ar: "ط§ظ„ظ…ظ†طµط±ظپ / ط§ظ„ظ…ط³ط­ظˆط¨:", en: "Disbursed / Withdrawn:" },
  "lbl_cash_balance": { ar: "ط§ظ„ط±طµظٹط¯ ط§ظ„ظپط¹ظ„ظٹ ط§ظ„ط­ط§ظ„ظٹ ط¨ط§ظ„ط¯ط±ط¬:", en: "Current Actual Drawer Balance:" },
  "vault_wallet_account": { ar: "ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´", en: "Vodafone Cash (E-Wallet)" },
  "vault_wallet_sub": { ar: "ط§ظ„ظ…ط­ط§ظپط¸ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹط© ط§ظ„ط°ظƒظٹط©", en: "Smart electronic wallets" },
  "pill_wallet": { ar: "ظ…ط­ظپط¸ط©", en: "Wallet" },
  "lbl_wallet_in": { ar: "ط§ظ„ظ…ظ‚ط¨ظˆط¶ ط¨ط§ظ„ظ…ط­ظپط¸ط©:", en: "Wallet Received:" },
  "lbl_wallet_out": { ar: "ط§ظ„ظ…ظ†طµط±ظپ / ط§ظ„ظ…ط³ط­ظˆط¨:", en: "Disbursed / Withdrawn:" },
  "lbl_wallet_balance": { ar: "ط§ظ„ط±طµظٹط¯ ط§ظ„ظپط¹ظ„ظٹ ط§ظ„ط­ط§ظ„ظٹ ط¨ط§ظ„ظ…ط­ظپط¸ط©:", en: "Current Actual Wallet Balance:" },
  "vault_instapay_account": { ar: "ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ (InstaPay)", en: "InstaPay Account" },
  "vault_instapay_sub": { ar: "ط§ظ„طھط­ظˆظٹظ„ط§طھ ط§ظ„ط¨ظ†ظƒظٹط© ط§ظ„ظ„ط­ط¸ظٹط©", en: "Instant electronic bank transfers" },
  "pill_instapay": { ar: "InstaPay", en: "InstaPay" },
  "lbl_instapay_in": { ar: "ط§ظ„ظ…ظ‚ط¨ظˆط¶ ط¨ط¥ظ†ط³طھط§ط¨ط§ظٹ:", en: "InstaPay Received:" },
  "lbl_instapay_out": { ar: "ط§ظ„ظ…ظ†طµط±ظپ / ط§ظ„ظ…ط³ط­ظˆط¨:", en: "Disbursed / Withdrawn:" },
  "lbl_instapay_balance": { ar: "ط§ظ„ط±طµظٹط¯ ط§ظ„ظپط¹ظ„ظٹ ط§ظ„ط­ط§ظ„ظٹ ط¨ط¥ظ†ط³طھط§ط¨ط§ظٹ:", en: "Current Actual InstaPay Balance:" },
  "term_tx_title": { ar: "ط³ط¬ظ„ ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط±", en: "Expenses & Withdrawals Log" },
  "tx_filter_all": { ar: "ط§ظ„ظƒظ„", en: "All" },
  "tx_filter_expense": { ar: "ظ…طµط±ظˆظپط§طھ ط³ظ†طھط±", en: "Center Expenses" },
  "tx_filter_withdrawal": { ar: "ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط±", en: "Owner Withdrawals" },
  "btn_record_center_exp": { ar: "طھط³ط¬ظٹظ„ ظ…طµط±ظˆظپ ط³ظ†طھط±", en: "Record Center Expense" },
  "btn_record_withdrawal": { ar: "طھط³ط¬ظٹظ„ ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط±", en: "Record Owner Withdrawal" },
  "th_date": { ar: "ط§ظ„طھط§ط±ظٹط®", en: "Date" },
  "th_type": { ar: "ط§ظ„ظ†ظˆط¹", en: "Type" },
  "th_reason": { ar: "ط§ظ„ط¨ظٹط§ظ† / ط§ظ„ط³ط¨ط¨", en: "Description / Purpose" },
  "th_vault": { ar: "ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ط©", en: "Used Vault" },
  "th_amount": { ar: "ط§ظ„ظ…ط¨ظ„ط؛", en: "Amount" },
  "th_action": { ar: "ط§ظ„ط¥ط¬ط±ط§ط،", en: "Action" },
  "tx_empty": { ar: "ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ ظ…ط³ط¬ظ„ط© ط­طھظ‰ ط§ظ„ط¢ظ†", en: "No recorded transactions yet" },
  "term_detailed_statement": { ar: "ظƒط´ظپ ط­ط³ط§ط¨ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„طھظپطµظٹظ„ظٹ", en: "Detailed Students Financial Statement" },
  "term_search_ph": { ar: "ط¨ط­ط« ط¨ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨..", en: "Search by student name.." },
  "term_all_classes": { ar: "ط¬ظ…ظٹط¹ ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ", en: "All Groups" },
  "th_student_name": { ar: "ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨", en: "Student Name" },
  "th_group": { ar: "ط§ظ„ظ…ط¬ظ…ظˆط¹ط©", en: "Group" },
  "th_required": { ar: "ط§ظ„ظ…ط·ظ„ظˆط¨", en: "Required" },
  "th_paid": { ar: "ط§ظ„ظ…ط¯ظپظˆط¹", en: "Paid" },
  "th_remaining": { ar: "ط§ظ„ظ…طھط¨ظ‚ظٹ", en: "Remaining" },
  "th_att_count": { ar: "ظ…ط±ط§طھ ط§ظ„ط­ط¶ظˆط±", en: "Attendances" },

  // Assistants View
  "asst_mgmt_title": { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طھط­ظƒظ… ظپظٹ ط§ظ„طµظ„ط§ط­ظٹط§طھ", en: "Assistants & Permissions Management" },
  "asst_mgmt_desc": { ar: "طھط­ظƒظ… ط¨ط´ظƒظ„ ظ…ط¨ط§ط´ط± ظپظٹ ط§ظ„ظ…ظٹط²ط§طھ ط§ظ„ظ…طھط§ط­ط© ظ„ظƒظ„ ظ…ط³ط§ط¹ط¯. ط£ظٹ طھط¹ط¯ظٹظ„ ظٹطھظ… طھط·ط¨ظٹظ‚ظ‡ ظپظˆط±ظٹط§ظ‹ ظˆظ„ط­ط¸ظٹط§ظ‹ ظپظٹ طµظپط­ط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط§ظ„ظ…ظپطھظˆط­ط©.", en: "Directly manage features available to each assistant. Any changes apply instantly to the active assistant page." },
  "btn_add_asst": { ar: "ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯", en: "Add New Assistant" },

  // Decision Requests
  "dec_direct_title": { ar: "ط¥طµط¯ط§ط± ظˆطھط·ط¨ظٹظ‚ ظ‚ط±ط§ط± ظ…ط¨ط§ط´ط± ظ„ط·ط§ظ„ط¨ (ط®طµظ… / ط¥ط¹ظپط§ط، / طھط¹ط¯ظٹظ„ ظ…طµط§ط±ظٹظپ)", en: "Issue Direct Student Decision (Discount / Exemption / Custom Fee)" },
  "dec_student_lbl": { ar: "ط±ظ‚ظ… ط§ظ„ط·ط§ظ„ط¨ (ID) ط£ظˆ ط§ظ„ط§ط³ظ…", en: "Student ID or Name" },
  "dec_student_ph": { ar: "ط§ط¯ط®ظ„ ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨ ط£ظˆ ط§ط¨ط­ط« ط¨ط§ظ„ط§ط³ظ…...", en: "Enter student code or search name..." },
  "dec_type_lbl": { ar: "ظ†ظˆط¹ ط§ظ„ظ‚ط±ط§ط±", en: "Decision Type" },
  "dec_opt_discount": { ar: "ط®طµظ… ظ…ط§ظ„ظٹ ظ…ط­ط¯ط¯ (ط¬ظ†ظٹظ‡)", en: "Specific Financial Discount (EGP)" },
  "dec_opt_exemption": { ar: "ط¥ط¹ظپط§ط، ظƒط§ظ…ظ„ ظ…ظ† ط§ظ„ظ…طµط§ط±ظٹظپ", en: "Full Fee Exemption" },
  "dec_opt_custom_fee": { ar: "طھط­ط¯ظٹط¯ ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…طµط§ط±ظٹظپ ط§ظ„ظ…ط·ظ„ظˆط¨ط©", en: "Set Total Required Fee" },
  "dec_btn_check": { ar: "ظپط­طµ ط§ظ„ط·ط§ظ„ط¨", en: "Check Student" },
  "dec_lbl_req": { ar: "ط§ظ„ظ…ط·ظ„ظˆط¨ ط§ظ„ط£طµظ„ظٹ", en: "Original Required" },
  "dec_lbl_disc": { ar: "ط§ظ„ط®طµظ… ط§ظ„ط­ط§ظ„ظٹ", en: "Current Discount" },
  "dec_lbl_paid": { ar: "ط§ظ„ظ…ط¯ظپظˆط¹ ط­طھظ‰ ط§ظ„ط¢ظ†", en: "Paid So Far" },
  "dec_lbl_rem": { ar: "ط§ظ„ظ…طھط¨ظ‚ظٹ ط¨ط¹ط¯ ط§ظ„ط³ط¯ط§ط¯", en: "Remaining After Payment" },
  "dec_disc_val_lbl": { ar: "ظ‚ظٹظ…ط© ط§ظ„ط®طµظ… ط§ظ„ظ…ط·ظ„ظˆط¨ط© (ط¬ظ†ظٹظ‡)", en: "Required Discount Value (EGP)" },
  "dec_reason_lbl": { ar: "ط³ط¨ط¨ ط§ظ„ظ‚ط±ط§ط± / ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„ظ…ط¯ظٹط± (طھط¸ظ‡ط± ظپظٹ ط§ظ„ط³ط¬ظ„ط§طھ)", en: "Decision Reason / Manager Notes" },
  "dec_apply_btn": { ar: "طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط± ظپظˆط±ط§ظ‹", en: "Apply Decision Immediately" },
  "dec_inbox_title": { ar: "طµظ†ط¯ظˆظ‚ ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ ط§ظ„ظ…ط¹ظ„ظ‚ط© ظ…ظ† ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†", en: "Pending Assistant Decision Requests Inbox" },
  "dec_btn_refresh": { ar: "طھط­ط¯ظٹط«", en: "Refresh" },

  // Packages & Expenses
  "pkg_title": { ar: "ط¥ط¯ط§ط±ط© ط¨ط§ظ‚ط§طھ ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط±", en: "Group Packages & Pricing Management" },
  "pkg_add_btn": { ar: "ط¥ط¶ط§ظپط© ط¨ط§ظ‚ط© ط¬ط¯ظٹط¯ط©", en: "Add New Package" },
  "exp_title": { ar: "طھط³ط¬ظٹظ„ ظˆظ…طھط§ط¨ط¹ط© ط§ظ„ظ…طµط±ظˆظپط§طھ", en: "Record & Monitor Expenses" },
  "exp_reason_lbl": { ar: "ط¨ظ†ط¯ ط§ظ„ظ…طµط±ظˆظپ / ط§ظ„ط³ط¨ط¨", en: "Expense Item / Reason" },
  "exp_reason_ph": { ar: "ظ…ط«ط§ظ„: ظپظˆط§طھظٹط± ظƒظ‡ط±ط¨ط§ط، / ط·ط¨ط§ط¹ط© ظˆط±ظ‚", en: "e.g. Electricity bills / Paper printing" },
  "exp_amount_lbl": { ar: "ط§ظ„ظ…ط¨ظ„ط؛ (ط¬)", en: "Amount (EGP)" },
  "exp_date_lbl": { ar: "ط§ظ„طھط§ط±ظٹط®", en: "Date" },
  "exp_record_btn": { ar: "طھط³ط¬ظٹظ„ ط§ظ„ظ…طµط±ظˆظپ", en: "Record Expense" },

  // Syllabus
  "syl_title": { ar: "ط¥ط¶ط§ظپط© ظˆطھط­ط¯ظٹط« ط®ط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬ ط§ظ„ط¯ط±ط§ط³ظٹ", en: "Add & Update Syllabus Roadmap Plan" },
  "syl_lesson_lbl": { ar: "ط§ط³ظ… ط§ظ„ظپطµظ„ / ط§ظ„ط¯ط±ط³", en: "Chapter / Lesson Name" },
  "syl_lesson_ph": { ar: "ظ…ط«ط§ظ„: Chapter 2 - Electric Flux", en: "e.g. Chapter 2 - Electric Flux" },
  "syl_status_lbl": { ar: "ط­ط§ظ„ط© ط§ظ„ط´ط±ط­", en: "Teaching Status" },
  "syl_opt_not_started": { ar: "ظ„ظ… ظٹط¨ط¯ط£ ط¨ط¹ط¯", en: "Not Started" },
  "syl_opt_in_progress": { ar: "ط¬ط§ط±ظٹ ط§ظ„ط´ط±ط­", en: "In Progress" },
  "syl_opt_completed": { ar: "طھظ… ط§ظ„ط§ظ†طھظ‡ط§ط،", en: "Completed" },
  "syl_notes_lbl": { ar: "ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„ط­طµط© ط§ظ„ط£ط®ظٹط±ط© (طھط¸ظ‡ط± ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†)", en: "Latest Session Notes (Visible to Assistants)" },
  "syl_notes_ph": { ar: "ظ…ط«ط§ظ„: طھظ… ط¥ظ†ظ‡ط§ط، ط§ظ„ظ…ط³ط§ط¦ظ„ ظˆط§ظ„ظˆط§ط¬ط¨ طµظپط­ط© 45", en: "e.g. Completed problems and homework page 45" },
  "syl_save_btn": { ar: "ط­ظپط¸ ظˆط¥ط¶ط§ظپط© ظ„ظ„ط¬ط¯ظˆظ„", en: "Save & Add to Schedule" },
  "syl_timeline_title": { ar: "ط®ط±ظٹط·ط© ط§ظ„ط¯ط±ظˆط³ ط§ظ„ط­ط§ظ„ظٹط©", en: "Current Lessons Roadmap" },

  // Subscription Plans & Lock Screen
  "lock_title": { ar: "ط§ظ†طھظ‡طھ ظپطھط±ط© ط§ط´طھط±ط§ظƒظƒ", en: "Subscription Expired" },
  "lock_desc": { ar: "ط¹ظپظˆط§ظ‹طŒ ظ„ظ‚ط¯ ط§ظ†طھظ‡طھ ظپطھط±ط© ط§ط´طھط±ط§ظƒظƒ ظپظٹ ظ†ط¸ط§ظ… Studify.<br>ظٹط±ط¬ظ‰ ط§ظ„طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ ظ„طھط¬ط¯ظٹط¯ ط§ظ„ط§ط´طھط±ط§ظƒ ظˆط§ظ„ط§ط³طھظ…ط±ط§ط± ظپظٹ ط§ط³طھط®ط¯ط§ظ… ط§ظ„ظ†ط¸ط§ظ….", en: "Your Studify subscription has expired.<br>Please contact technical support to renew your subscription and continue using the system." },
  "lock_contact_text": { ar: "ظ„ظ„طھط¬ط¯ظٹط¯ طھظˆط§طµظ„ ظ…ط¹ ظپط±ظٹظ‚ ط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ", en: "Contact Technical Support to Renew" },
  "sub_loading": { ar: "ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط§ط´طھط±ط§ظƒ...", en: "Loading subscription details..." },
  "sub_title_std": { ar: "ط®ط·ط· ط§ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ظ…طھط§ط­ط© â€” Standard", en: "Available Subscription Plans â€” Standard" },
  "sub_title_upcoming": { ar: "ط§ظ„ط¨ط§ظ‚ط§طھ ط§ظ„ظ‚ط§ط¯ظ…ط© ظ‚ط±ظٹط¨ط§ظ‹", en: "Upcoming Future Packages" },
  
  // Plan 1: Monthly
  "sub_monthly_name": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظ†ط©", en: "Flexible Plan" },
  "sub_monthly_dur": { ar: "ط§ط´طھط±ط§ظƒ ط´ظ‡ط± ظˆط§ط­ط¯", en: "1 Month Subscription" },
  "sub_monthly_badge": { ar: "ط§ظ„ط¨ط§ظ‚ط© ط§ظ„ط£ط³ط§ط³ظٹط©", en: "Basic Plan" },
  "sub_monthly_curr": { ar: "ط¬ظ†ظٹظ‡ / ط´ظ‡ط±", en: "EGP / Month" },
  "sub_monthly_subtext": { ar: "ط§ظ„ط³ط¹ط± ط§ظ„ط£ط³ط§ط³ظٹ ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ط´ظ‡ط± ط§ظ„ظˆط§ط­ط¯", en: "Standard price for 1 month subscription" },
  
  // Plan 2: Quarterly
  "sub_quarterly_name": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظٹط­ط©", en: "Comfort Plan" },
  "sub_quarterly_dur": { ar: "ط§ط´طھط±ط§ظƒ 3 ط´ظ‡ظˆط±", en: "3 Months Subscription" },
  "sub_quarterly_saving": { ar: "ظˆظپظ‘ط± 600 ط¬", en: "Save 600 EGP" },
  "sub_quarterly_old_price": { ar: "6,000 ط¬", en: "6,000 EGP" },
  "sub_quarterly_discount_badge": { ar: "ط®طµظ… ط±ط¨ط¹ ط³ظ†ظˆظٹ", en: "Quarterly Discount" },
  "sub_quarterly_curr": { ar: "ط¬ظ†ظٹظ‡ / 3 ط´ظ‡ظˆط±", en: "EGP / 3 Months" },
  "sub_quarterly_subtext": { ar: "ظٹط¹ط§ط¯ظ„ <b>1,799 ط¬</b> ظپظ‚ط· ط´ظ‡ط±ظٹط§ظ‹", en: "Equates to only <b>1,799 EGP</b> / month" },
  
  // Plan 3: Golden / Semi-Annual
  "sub_golden_ribbon": { ar: "ط§ظ„ط£ظƒط«ط± ط·ظ„ط¨ط§ظ‹ ظˆطھظˆظپظٹط±ط§ظ‹", en: "Most Popular & Best Value" },
  "sub_golden_name": { ar: "ط§ظ„ط®ط·ط© ط§ظ„ط°ظ‡ط¨ظٹط©", en: "Golden Plan" },
  "sub_golden_dur": { ar: "ط§ط´طھط±ط§ظƒ طھط±ظ… ظƒط§ظ…ظ„ (5 ط´ظ‡ظˆط±)", en: "Full Term Subscription (5 Months)" },
  "sub_golden_saving": { ar: "ظˆظپظ‘ط± 2,000 ط¬ (ط´ظ‡ط± ظ…ط¬ط§ظ†ط§ظ‹)", en: "Save 2,000 EGP (1 Month Free)" },
  "sub_golden_old_price": { ar: "10,000 ط¬", en: "10,000 EGP" },
  "sub_golden_free_month": { ar: "ط´ظ‡ط± ظƒط§ظ…ظ„ ظ…ط¬ط§ظ†ط§ظ‹", en: "1 Full Month Free" },
  "sub_golden_curr": { ar: "ط¬ظ†ظٹظ‡ / طھط±ظ… ظƒط§ظ…ظ„", en: "EGP / Full Term" },
  "sub_golden_subtext": { ar: "ظٹط¹ط§ط¯ظ„ <b>1,599 ط¬</b> ظپظ‚ط· ط´ظ‡ط±ظٹط§ظ‹ (ظˆظپط± 2,000 ط¬)", en: "Equates to only <b>1,599 EGP</b> / month (Save 2,000 EGP)" },
  "sub_btn_contact_golden": { ar: "طھظˆط§طµظ„ ظ„ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ط°ظ‡ط¨ظٹ", en: "Contact for Golden Plan" },
  
  // Shared Plan Features
  "sub_feat_full_system": { ar: "ط§ظ„ظ†ط¸ط§ظ… ط§ظ„طھط´ط؛ظٹظ„ظٹ ظˆط§ظ„ظ…ط§ظ„ظٹ ط§ظ„ظƒط§ظ…ظ„", en: "Full Operational & Financial System" },
  "sub_feat_full_system_all": { ar: "ط§ظ„ظ†ط¸ط§ظ… ط§ظ„طھط´ط؛ظٹظ„ظٹ ظˆط§ظ„ظ…ط§ظ„ظٹ ط¨ط§ظ„ظƒط§ظ…ظ„", en: "Full Operational & Financial System" },
  "sub_feat_max_st_600": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>600 ط·ط§ظ„ط¨ ظپظ‚ط·</b>", en: "Maximum <b>600 Students only</b>" },
  "sub_feat_max_asst_2": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>2 ظ…ط³ط§ط¹ط¯ ظپظ‚ط·</b>", en: "Maximum <b>2 Assistants only</b>" },
  "sub_feat_max_st_750": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>750 ط·ط§ظ„ط¨</b>", en: "Maximum <b>750 Students</b>" },
  "sub_feat_max_asst_4": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>4 ظ…ط³ط§ط¹ط¯ظٹظ†</b>", en: "Maximum <b>4 Assistants</b>" },
  "sub_feat_max_st_1000": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>1,000 ط·ط§ظ„ط¨</b>", en: "Maximum <b>1,000 Students</b>" },
  "sub_feat_max_asst_5": { ar: "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ <b>5 ظ…ط³ط§ط¹ط¯ظٹظ†</b>", en: "Maximum <b>5 Assistants</b>" },
  "sub_feat_peace_mind": { ar: "ط±ط§ط­ط© ط¨ط§ظ„ ظ…ظ† ط§ظ„طھط¬ط¯ظٹط¯ ط§ظ„ظ…طھظƒط±ط±", en: "Peace of mind from frequent renewals" },
  "sub_feat_term_stability": { ar: "ط§ط³طھظ‚ط±ط§ط± طھط§ظ… ظ„طھط±ظ… ط¯ط±ط§ط³ظٹ ظƒط§ظ…ظ„ (5 ط´ظ‡ظˆط±)", en: "Complete stability for full academic term (5 months)" },
  "sub_feat_support_24h": { ar: "<b>ط¯ط¹ظ… ظپظ†ظٹ ظ…طھظˆط§طµظ„ 24 ط³ط§ط¹ظ‡ ظ„ط­ظ„ ط§ظ„ظ…ط´ط§ظƒظ„ ط§ظ„طھظ‚ظ†ظٹط©</b>", en: "<b>24/7 continuous technical support for any issues</b>" },
  "sub_feat_wa_golden": { ar: "<b>ط­ظ…ظ„ط§طھ ط§ظ„طھط³ظˆظٹظ‚ ط§ظ„ط°ظƒظٹط© ط¨ط§ظ„ظˆط§طھط³ط§ط¨ (ظ…ظٹط²ط© ط­طµط±ظٹط©)</b>", en: "<b>Smart WhatsApp marketing campaigns (Exclusive feature)</b>" },
  "sub_feat_wa_locked": { ar: "ط­ظ…ظ„ط§طھ ط§ظ„طھط³ظˆظٹظ‚ ط§ظ„ط°ظƒظٹط© ط¨ط§ظ„ظˆط§طھط³ط§ط¨ (ظ…ط؛ظ„ظ‚ط©)", en: "Smart WhatsApp Marketing Campaigns (Locked)" },
  "sub_btn_contact": { ar: "طھظˆط§طµظ„ ظ„ظ„ط§ط´طھط±ط§ظƒ", en: "Contact to Subscribe" },
  
  // Upcoming Plans
  "sub_pro_name": { ar: "ط¨ط§ظ‚ط© Pro â€” طھط·ط¨ظٹظ‚ ط§ظ„ظ…ظˆط¨ط§ظٹظ„ ط§ظ„ط°ظƒظٹ", en: "Pro Package â€” Smart Mobile App" },
  "sub_pro_subtitle": { ar: "طھط·ط¨ظٹظ‚ ظ…ظˆط¨ط§ظٹظ„ ظ…ط®طµطµ ظ„ظ„ط·ظ„ط§ط¨ ظˆط£ظˆظ„ظٹط§ط، ط§ظ„ط£ظ…ظˆط± ظ„ظ…طھط§ط¨ط¹ط© ط­ط¶ظˆط± ظˆظ…ظˆط§ط¹ظٹط¯ ط§ظ„ط³ظ†طھط± ظ„ط­ط¸ظٹط§ظ‹", en: "Dedicated mobile app for students & parents to track center attendance and schedules in real-time" },
  "sub_vip_name": { ar: "ط¨ط§ظ‚ط© VIP â€” ط§ظ„ظ…ظ†طµط© ط§ظ„طھط¹ظ„ظٹظ…ظٹط© ط§ظ„ظ…طھظƒط§ظ…ظ„ط©", en: "VIP Package â€” All-in-One Learning Platform" },
  "sub_vip_subtitle": { ar: "ظ†ط¸ط§ظ… طھط¹ظ„ظٹظ…ظٹ ظˆط³ط­ط§ط¨ظٹ ظƒط§ظ…ظ„ ظ…ط¹ ظ†ط·ط§ظ‚ ظ…ط®طµطµ ظˆط³ظٹط±ظپط±ط§طھ ط®ط§طµط© ط¨ط§ظ„ط³ظ†طھط±", en: "Complete cloud learning platform with custom domain and dedicated servers for your center" },
  "sub_badge_coming_soon": { ar: "ظ‚ط±ظٹط¨ط§ظ‹<br>Coming Soon", en: "Coming Soon" },
  "sub_pro_f1": { ar: "ظƒط§ط±طھ ط§ظ„ط·ط§ظ„ط¨ ط§ظ„ط°ظƒظٹ ظ…ط¹ ظƒظˆط¯ QR ظ…ط¯ظ…ط¬ ظ„طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ط§ظ„ط°ط§طھظٹ ظˆط§ظ„ط³ط±ظٹط¹", en: "Smart student ID card with QR code for instant self-attendance" },
  "sub_pro_f2": { ar: "ط¥ط´ط¹ط§ط±ط§طھ ظپظˆط±ظٹط© ظˆطھظ†ط¨ظٹظ‡ط§طھ ظ„ظˆظ„ظٹ ط§ظ„ط£ظ…ط± ط¨ط§ظ„ط؛ظٹط§ط¨ ظˆط§ظ„ط¯ط±ط¬ط§طھ ط¨ط¹ط¯ ظƒظ„ ط­طµط©", en: "Instant notifications to parents for absences and grades after every session" },
  "sub_pro_f3": { ar: "ظ„ظˆط­ط© ظ…طھط§ط¨ط¹ط© ظ…ط³طھظˆظ‰ ط§ظ„ط·ط§ظ„ط¨ ظˆطھظپط§طµظٹظ„ ط§ظ„ظˆط§ط¬ط¨ط§طھ ظˆط§ظ„ط§ط®طھط¨ط§ط±ط§طھ ط§ظ„ط¯ظˆط±ظٹط©", en: "Student dashboard with homework details and periodic test analytics" },
  "sub_pro_f4": { ar: "ظ…طھط§ط¨ط¹ط© ط§ظ„ط£ظ‚ط³ط§ط· ط§ظ„ط´ظ‡ط±ظٹط© ظˆظپظˆط§طھظٹط± ط³ط¯ط§ط¯ ط§ظ„ظƒظˆط±ط³ط§طھ ط£ظˆظ†ظ„ط§ظٹظ† ط¨ط¶ط؛ط·ط© ط²ط±", en: "Track monthly installments and online course invoices with 1-click" },
  "sub_vip_f1": { ar: "ظ…ظ†طµط© ظˆط¨ظˆط§ط¨ط© ط®ط§طµط© ط¨ط§ط³ظ… ظˆظ†ط·ط§ظ‚ ط§ظ„ط³ظ†طھط± ط§ظ„ظ…ط³طھظ‚ظ„ (Custom Domain)", en: "Custom branded web portal with independent center domain (Custom Domain)" },
  "sub_vip_f2": { ar: "ظ…ط´ط؛ظ„ ط­طµطµ ظˆظپظٹط¯ظٹظˆظ‡ط§طھ ظ…ط´ظپط± ظˆظ…ط­ظ…ظٹ ط¨ط§ظ„ظƒط§ظ…ظ„ ط¶ط¯ طھط³ط¬ظٹظ„ ظˆطھطµظˆظٹط± ط§ظ„ط´ط§ط´ط©", en: "Encrypted lesson video player fully protected against screen capture and recording" },
  "sub_vip_f3": { ar: "ط¨ظ†ظƒ ط£ط³ط¦ظ„ط© ط°ظƒظٹ ظˆط§ط®طھط¨ط§ط±ط§طھ ط¥ظ„ظƒطھط±ظˆظ†ظٹط© ط¨طھطµط­ظٹط­ ظپظˆط±ظٹ ظˆطھط­ظ„ظٹظ„ ط£ط¯ط§ط، ط¨ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ", en: "Smart question bank and online tests with automated grading and AI performance insights" },
  "sub_vip_f4": { ar: "ط§ط³طھظٹط¹ط§ط¨ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ ظ„ظ„ط·ظ„ط§ط¨ ظˆط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظ…ط¹ ط³ظٹط±ظپط± ظ…ط®طµطµ ظˆط¯ط¹ظ… VIP", en: "Unlimited capacity for students and assistants with dedicated high-speed server & VIP support" }
,
  "lbl_from_date": { ar: "ظ…ظ† طھط§ط±ظٹط®:", en: "From Date:" },
  "lbl_to_date": { ar: "ط¥ظ„ظ‰ طھط§ط±ظٹط®:", en: "To Date:" },
  "opt_cash": { ar: "ظƒط§ط´", en: "Cash" },
  "opt_instapay": { ar: "ط¥ظ†ط³طھط§ط¨ط§ظٹ", en: "InstaPay" },
  "opt_wallet": { ar: "ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´", en: "Vodafone Cash" },
  "rev_tbl_title": { ar: "ط³ط¬ظ„ ط­ط±ظƒط§طھ ط§ظ„طھط­طµظٹظ„ ظˆط§ظ„طھظˆط±ظٹط¯ ظپظٹ ط§ظ„ظپطھط±ط© ط§ظ„ظ…ط­ط¯ط¯ط©", en: "Collection & Supply Log for the Selected Period" },
  "tbl_th_date": { ar: "ط§ظ„طھط§ط±ظٹط®", en: "Date" },
  "tbl_th_source": { ar: "ط§ظ„ط¨ظٹط§ظ† / ط§ظ„ظ…طµط¯ط±", en: "Description / Source" },
  "tbl_th_channel": { ar: "ظ†ظˆط¹ ط§ظ„ط¥ظٹط±ط§ط¯", en: "Revenue Type" },
  "tbl_th_amount": { ar: "ط§ظ„ظ…ط¨ظ„ط؛", en: "Amount" },
  "tbl_th_method": { ar: "ط·ط±ظٹظ‚ط© ط§ظ„ط¯ظپط¹", en: "Payment Method" },
  "lbl_avail_bal": { ar: "ط§ظ„ط±طµظٹط¯ ط§ظ„ظ…طھط§ط­:", en: "Available Balance:" },
  "lbl_curr_bal": { ar: "ط§ظ„ط±طµظٹط¯ ط§ظ„ط­ط§ظ„ظٹ:", en: "Current Balance:" },
  "trans_note_ph": { ar: "ظ…ظ„ط§ط­ط¸ط§طھ ط§ظ„طھط­ظˆظٹظ„ (ط§ط®طھظٹط§ط±ظٹ)...", en: "Transfer notes (optional)..." },
  "tbl_th_datetime": { ar: "ط§ظ„طھط§ط±ظٹط® ظˆط§ظ„ظˆظ‚طھ", en: "Date & Time" },
  "tbl_th_from": { ar: "ظ…ظ† ط®ط²ظٹظ†ط©", en: "From Vault" },
  "tbl_th_to": { ar: "ط¥ظ„ظ‰ ط®ط²ظٹظ†ط©", en: "To Vault" },
  "tbl_th_note": { ar: "ظ…ظ„ط§ط­ط¸ط§طھ", en: "Notes" },
  "exp_period_total": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ظ…طµط±ظˆظپط§طھ ط§ظ„ظپطھط±ط©", en: "Total Period Expenses" },
  "tbl_th_reason": { ar: "ط¨ظ†ط¯ ط§ظ„ظ…طµط±ظˆظپ", en: "Expense Item" },
  "wd_period_total": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط³ط­ظˆط¨ط§طھ", en: "Total Withdrawals" },
  "tbl_th_vault_source": { ar: "ظ…ط³ط­ظˆط¨ ظ…ظ†", en: "Withdrawn From" },
  "search_student_ph": { ar: "ط§ط¨ط­ط« ط¨ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨ ط£ظˆ ظƒظˆط¯ ط§ظ„ظ€ ID...", en: "Search by student name or ID..." },
  "tbl_th_student": { ar: "ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨", en: "Student Name" },
  "tbl_th_class": { ar: "ط§ظ„طµظپ / ط§ظ„ظ…ط¬ظ…ظˆط¹ط©", en: "Class / Group" },
  "tbl_th_disc_amt": { ar: "ظ‚ظٹظ…ط© ط§ظ„ط®طµظ…", en: "Discount Amount" },
  "tbl_th_paid": { ar: "ط§ظ„ظ…ط¯ظپظˆط¹", en: "Paid" },
  "tbl_th_debt": { ar: "ط§ظ„ظ…طھط¨ظ‚ظٹ", en: "Remaining" },
  "tbl_th_action": { ar: "ط§ظ„ط¥ط¬ط±ط§ط،", en: "Action" },
  "btn_prev": { ar: "ط§ظ„ط³ط§ط¨ظ‚", en: "Previous" },
  "btn_next": { ar: "ط§ظ„طھط§ظ„ظٹ", en: "Next" },
  "debts_modal_title": { ar: "ط§ظ„ط¯ظٹظˆظ† ظˆط§ظ„ظ…ط¯ظپظˆط¹ط§طھ ط§ظ„ظ…طھط£ط®ط±ط©", en: "Debts & Overdue Payments" },
  "debts_modal_subtitle": { ar: "ظƒط´ظپ ط­ط³ط§ط¨ ظ„ظ„ط·ظ„ط§ط¨ ط£طµط­ط§ط¨ ط§ظ„ظ…ط¯ظٹظˆظ†ظٹط§طھ ط؛ظٹط± ط§ظ„ظ…ط³ط¯ط¯ط©", en: "Statement of account for students with outstanding debts" },
  "debts_modal_total_lbl": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط¯ظٹظˆظ† ط§ظ„ظ…طھط£ط®ط±ط©", en: "Total Overdue Debts" },
  "debts_modal_count_lbl": { ar: "ط¹ط¯ط¯ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…طھط¹ط«ط±ظٹظ†", en: "Count of Students with Debts" },
  "tbl_th_required": { ar: "ط§ظ„ظ…ط·ظ„ظˆط¨ ط³ط¯ط§ط¯ظ‡", en: "Required Amount" },
  "vaults_breakdown_title": { ar: "طھظپط§طµظٹظ„ ط§ظ„ط®ط²ط§ط¦ظ† ظˆط§ظ„ط£ط±طµط¯ط©", en: "Vaults & Balances Details" },
  "vaults_breakdown_subtitle": { ar: "ظ…ط±ط§ظ‚ط¨ط© ط§ظ„ط³ظٹظˆظ„ط© ط§ظ„ظ†ظ‚ط¯ظٹط© ظپظٹ ط§ظ„ط®ط²ط§ط¦ظ† ظˆط§ظ„ظ…ط­ط§ظپط¸ ط§ظ„ظ…ط®طھظ„ظپط©", en: "Monitor cash liquidity in different vaults and wallets" },
  "lbl_grand_liquidity": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط³ظٹظˆظ„ط© (ط¬ظ…ظٹط¹ ط§ظ„ط®ط²ط§ط¦ظ†)", en: "Total Liquidity (All Vaults)" },
  "btn_transfer_vaults": { ar: "طھط­ظˆظٹظ„ ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ†", en: "Transfer Between Vaults" },
  "students_modal_title": { ar: "ظ‚ط§ط¦ظ…ط© ظˆط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ط³ط¬ظ„ظٹظ†", en: "List and Data of Registered Students" },
  "students_modal_subtitle": { ar: "ط§ط³طھط¹ط±ط§ط¶ ط´ط§ظ…ظ„ ظ„ط¨ظٹط§ظ†ط§طھ ظˆط§ط´طھط±ط§ظƒط§طھ ط§ظ„ط·ظ„ط§ط¨ ظ…ط¹ طھط±ظ‚ظٹظ… ط§ظ„طµظپط­ط§طھ ظˆط§ظ„ط¨ط­ط« ط§ظ„ظپظˆط±ظٹ", en: "Comprehensive view of students data and subscriptions with paging and instant search" },
  "lbl_total_registered": { ar: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ط³ط¬ظ„ظٹظ†:", en: "Total Registered Students:" },
  "lbl_pkg_students": { ar: "ط·ظ„ط§ط¨ ط¨ط§ظ‚ط§طھ / ط¹ط§ظ…:", en: "Package / General Students:" },
  "lbl_session_students": { ar: "ط·ظ„ط§ط¨ ط­طµطµ ظپط±ط¯ظٹط©:", en: "Single Session Students:" },
  "students_search_ph": { ar: "ط¨ط­ط« ط¨ط§ظ„ط§ط³ظ… ط£ظˆ ط§ظ„ظƒظˆط¯ ط£ظˆ ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ...", en: "Search by name, ID or phone..." },
  "opt_all_classes": { ar: "ط¬ظ…ظٹط¹ ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ ظˆط§ظ„طµظپظˆظپ", en: "All Groups and Classes" },
  "tbl_th_id": { ar: "#ID", en: "#ID" },
  "tbl_th_st_phone": { ar: "ظ‡ط§طھظپ ط§ظ„ط·ط§ظ„ط¨", en: "Student Phone" },
  "tbl_th_parent_phone": { ar: "ظ‡ط§طھظپ ظˆظ„ظٹ ط§ظ„ط£ظ…ط±", en: "Parent Phone" },
  "tbl_th_pay_status": { ar: "ط­ط§ظ„ط© ط§ظ„ط³ط¯ط§ط¯", en: "Payment Status" },
  "rev_dist_ratio": { ar: "ظ†ط³ط¨ ط§ظ„طھظˆط²ظٹط¹ ط­ط³ط¨ ط§ظ„ظ‚ظ†ظˆط§طھ:", en: "Distribution Ratio by Channels:" },
  "exp_cash": { ar: "ط§ظ„ظ…ظ†طµط±ظپ ظƒط§ط´:", en: "Cash Spent:" },
  "exp_insta": { ar: "ط§ظ„ظ…ظ†طµط±ظپ ط¥ظ†ط³طھط§ط¨ط§ظٹ:", en: "InstaPay Spent:" },
  "exp_voda": { ar: "ط§ظ„ظ…ظ†طµط±ظپ ظپظˆط¯ط§ظپظˆظ†:", en: "Vodafone Spent:" },
  "exp_cash_vault": { ar: "إجمالي كاش (الخزينة):", en: "Total Cash (Vault):" },
  "exp_main_vault": { ar: "خزينة الكاش الرئيسي", en: "Main Cash Vault" },
};

window.adminT = function(key) {
  if (ADMIN_DICT[key] && ADMIN_DICT[key][currentLang]) {
    return ADMIN_DICT[key][currentLang];
  }
  return key;
};

window.applyAdminLanguage = function() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  if (document.body) document.body.dir = currentLang === "ar" ? "rtl" : "ltr";

  // Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (ADMIN_DICT[key] && ADMIN_DICT[key][currentLang]) {
      el.innerHTML = ADMIN_DICT[key][currentLang];
    }
  });

  // Translate all input placeholders with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (ADMIN_DICT[key] && ADMIN_DICT[key][currentLang]) {
      el.placeholder = ADMIN_DICT[key][currentLang];
    }
  });

  // Translate all titles with data-i18n-title
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (ADMIN_DICT[key] && ADMIN_DICT[key][currentLang]) {
      el.title = ADMIN_DICT[key][currentLang];
    }
  });

  // Update Topbar and Switcher Buttons
  const isAr = currentLang === "ar";
  const topbarLangBadge = document.getElementById("adminTopbarLangCode");
  if (topbarLangBadge) topbarLangBadge.innerText = isAr ? "EN" : "ط¹ط±ط¨ظٹ";

  const currentLabel = document.getElementById("adminLangCurrentLabel");
  if (currentLabel) currentLabel.innerText = isAr ? "ط§ظ„ظ„ط؛ط© ط§ظ„ط­ط§ظ„ظٹط©: ط§ظ„ط¹ط±ط¨ظٹط©" : "Current Language: English";

  const subLabel = document.getElementById("adminLangSubLabel");
  if (subLabel) subLabel.innerText = isAr ? "ط§ظ†ظ‚ط± ظ„ظ„طھط¨ط¯ظٹظ„ ط¥ظ„ظ‰ English ط¨ط§ظ„ظƒط§ظ…ظ„" : "Click to switch completely to Arabic";

  const btnText = document.getElementById("adminSettingsLangBtnText");
  if (btnText) btnText.innerText = isAr ? "English" : "ط§ظ„ط¹ط±ط¨ظٹط©";

  // Update current active tab title in Topbar
  const tabConfigs = {
    dailyReport:  { title: isAr ? "ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ظٹظˆظ…ظٹ" : "Daily Report", icon: "fa-calendar-day" },
    termReport:   { title: isAr ? "طھظ‚ط±ظٹط± ط§ظ„طھط±ظ… ط§ظ„ظ…ط§ظ„ظٹ" : "Term Financial Report", icon: "fa-chart-line" },
    assistants:   { title: isAr ? "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ" : "Assistants & Permissions", icon: "fa-user-shield" },
    decisions:    { title: isAr ? "طµظ†ط¯ظˆظ‚ ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ" : "Decision Requests Inbox", icon: "fa-bell" },
    packages:     { title: isAr ? "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ" : "Packages Management", icon: "fa-boxes-stacked" },
    syllabus:     { title: isAr ? "ط®ط±ظٹط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬" : "Syllabus Roadmap", icon: "fa-book-open" },
    settings:     { title: isAr ? "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھظ‚ط¯ظ…ط© ظˆط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ" : "Advanced Settings & Backup", icon: "fa-sliders" },
    subscription: { title: isAr ? "ط®ط·ط© ط§ظ„ط§ط´طھط±ط§ظƒ ظˆط§ظ„ط¨ط§ظ‚ط©" : "Subscription Plan & Status", icon: "fa-crown" }
  };

  const activeNav = document.querySelector(".admin-nav-item.active");
  if (activeNav) {
    const id = activeNav.id;
    for (const [k, cfg] of Object.entries(tabConfigs)) {
      if (id.toLowerCase().includes(k.toLowerCase())) {
        const pageTitle = document.getElementById("adminPageTitle");
        if (pageTitle) pageTitle.textContent = cfg.title;
        break;
      }
    }
  }

  // Update theme selector option if exists
  const themeSel = document.getElementById("adminThemeSelector");
  if (themeSel) {
    themeSel.value = localStorage.getItem("ca_theme") || "dark";
  }

    // Live re-render active view in new language immediately
  const activeView = document.querySelector(".admin-view:not(.hidden)");
  if (activeView) {
    const id = activeView.id;
    if (id === "viewDailyReport") {
      const dateInp = document.getElementById("adminDailyDateInput");
      const d = (dateInp && dateInp.value) ? dateInp.value : (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
      if (typeof window.loadDailyReport === 'function') window.loadDailyReport(d);
    } else if (id === "viewTermReport") {
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } else if (id === "viewAssistants") {
      if (typeof window.fetchAssistants === 'function') window.fetchAssistants();
    } else if (id === "viewDecisions") {
      if (typeof window.fetchDecisions === 'function') window.fetchDecisions();
    } else if (id === "viewPackages") {
      if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
    } else if (id === "viewSyllabus") {
      if (typeof window.renderAdminSyllabus === 'function') window.renderAdminSyllabus();
    } else if (id === "viewSubscription") {
      if (typeof window.renderSubscriptionView === 'function') window.renderSubscriptionView();
      else if (typeof window.loadSubscriptionData === 'function') window.loadSubscriptionData();
    }
  }
};

window.toggleAdminLanguage = function() {
  const targetLang = currentLang === "ar" ? "en" : "ar";
  const overlay = document.getElementById("adminLangSwitchOverlay");
  const textEl = document.getElementById("adminLangSwitchText");
  const btn = document.getElementById("adminLangToggleBtn");

  if (btn) btn.classList.add("lang-animating");

  if (overlay && textEl) {
    textEl.innerText = targetLang === "en" ? "Switching to English..." : "ط¬ط§ط±ظٹ ط§ظ„طھط¨ط¯ظٹظ„ ط¥ظ„ظ‰ ط§ظ„ط¹ط±ط¨ظٹط©...";
    overlay.classList.add("active");

    setTimeout(() => {
      currentLang = targetLang;
      localStorage.setItem("ca_lang", currentLang);
      window.applyAdminLanguage();

      setTimeout(() => {
        overlay.classList.remove("active");
        if (btn) btn.classList.remove("lang-animating");
      }, 350);
    }, 500);
  } else {
    currentLang = targetLang;
    localStorage.setItem("ca_lang", currentLang);
    window.applyAdminLanguage();
    if (btn) {
      setTimeout(() => btn.classList.remove("lang-animating"), 650);
    }
  }
};

window.switchAdminTheme = function(val) {
  if (typeof window.toggleAdminTheme === 'function') {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    if (current !== val) {
      window.toggleAdminTheme();
    }
  }
};

// Initialize Language on Startup
if (typeof window.applyAdminLanguage === 'function') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.applyAdminLanguage());
  } else {
    window.applyAdminLanguage();
  }
}


// Realtime WebSocket channel for cross-device instant sync (< 150ms)
let realtimeShiftChannel = null;
if (supabase) {
  try {
    realtimeShiftChannel = supabase.channel('studify_realtime_shift_sync');
    realtimeShiftChannel
      .on('broadcast', { event: 'DAILY_SHIFT_CHANGE' }, (event) => {
        const payload = event.payload || {};
        console.log('[Admin Realtime Sync] Received DAILY_SHIFT_CHANGE:', payload);
        if (typeof payload.shift_system_enabled === 'boolean') {
          window.shiftSystemEnabled = payload.shift_system_enabled;
          localStorage.setItem('studify_shift_system_enabled', payload.shift_system_enabled ? 'true' : 'false');
          const curD = document.getElementById("adminDailyDateInput")?.value || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
          if (typeof window.renderDailyApprovalWidget === 'function') {
            window.renderDailyApprovalWidget(curD);
          }
        }
        if (payload.date && typeof dailyApprovalMap === 'object' && dailyApprovalMap) {
          dailyApprovalMap[payload.date] = {
            status: payload.isApproved ? 'approved' : 'pending',
            updated_at: payload.updatedAt || new Date().toISOString()
          };
          if (typeof window.renderDailyApprovalWidget === 'function') {
            window.renderDailyApprovalWidget(payload.date);
          }
        }
      })
      .subscribe((status) => {
        console.log('[Admin Realtime Shift] Status:', status);
      });
  } catch(e) {
    console.warn('[Admin Realtime Shift] Error:', e);
  }
}

// State
let students = {};
let packages = {};
let groupFees = {};
let attByDate = {};
let revenueByDate = {};
let sessionStudentsByDate = {};

window.getAdminUniqueSessionStudents = function() {
  const list = [];
  const seen = new Set();
  const dates = Object.keys(sessionStudentsByDate || {}).sort().reverse();
  dates.forEach(d => {
    const arr = sessionStudentsByDate[d] || [];
    arr.forEach((it, idx) => {
      const key = (it.name || '').trim().toLowerCase() + '___' + (it.phone || '').trim();
      if (!seen.has(key)) {
        seen.add(key);
        let attCount = 0;
        let totalPaid = 0;
        dates.forEach(d2 => {
          (sessionStudentsByDate[d2] || []).forEach(r => {
            const k2 = (r.name || '').trim().toLowerCase() + '___' + (r.phone || '').trim();
            if (k2 === key) {
              attCount++;
              totalPaid += (Number(r.amount) || 0);
            }
          });
        });
        list.push({
          ...it,
          date: d,
          originalIndex: idx,
          attCount: attCount,
          totalPaid: totalPaid
        });
      }
    });
  });
  return list;
};

window.getAdminUniqueSessionStudentsCount = function() {
  return window.getAdminUniqueSessionStudents().length;
};
let expensesByDate = [];
let vaultTransfers = [];
let booklets = {};
let syllabusList = [];
let currentCenterId = localStorage.getItem("ca_manager_id") || "ahmedqutb11232_gmail_com";
let dailyApprovalMap = JSON.parse(localStorage.getItem('studify_daily_approval_map') || '{}');
let dailyShiftStatus = 'open';

// SUBSCRIPTION STATE (always loaded from Supabase, never stored in localStorage)
let SUBSCRIPTION = {
  isActive: false, planKey: null, planName: 'â€”',
  startDate: null, endDate: null,
  maxStudents: 600, maxAssistants: 2, marketingEnabled: false,
  daysLeft: 0, totalDays: 30, loaded: false
};
window.SUBSCRIPTION = SUBSCRIPTION;

// Admin Realtime Live Sync across all devices (Students, Settings, Communications)
if (supabase) {
  try {
    supabase.channel('admin-realtime-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, payload => {
        try {
          if (payload.eventType === 'DELETE') {
            if (payload.old && payload.old.id) {
              delete students[String(payload.old.id)];
            }
          } else if (payload.new && payload.new.id) {
            const row = payload.new;
            if (row.status === 'deleted') {
              delete students[String(row.id)];
            } else {
              const existing = students[String(row.id)] || {};
              students[String(row.id)] = {
                id: row.id,
                name: row.name || existing.name || '',
                className: row.class_name || row.className || existing.className || '',
                phone: row.phone || existing.phone || '',
                parentPhone: row.parent_phone || row.parentPhone || existing.parentPhone || '',
                paid: Number(row.paid !== undefined ? row.paid : existing.paid) || 0,
                discount: Number(row.discount !== undefined ? row.discount : existing.discount) || 0,
                packageDiscounts: row.package_discounts || row.packageDiscounts || existing.packageDiscounts || {},
                paymentPlan: row.payment_plan || row.paymentPlan || existing.paymentPlan || 'cash',
                packages: Array.isArray(row.packages) ? row.packages : (existing.packages || []),
                payments: row.payments || existing.payments || [],
                attendanceDates: row.attendance_dates || existing.attendanceDates || [],
                status: row.status || existing.status || 'active'
              };
            }
          }
          if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
          if (typeof window.renderTermTable === 'function') window.renderTermTable();
          const dInput = document.getElementById("adminDailyDateInput");
          if (typeof window.loadDailyReport === 'function') window.loadDailyReport(dInput ? dInput.value : nowDateStr());
        } catch(err) {
          console.warn('[Admin Realtime Students] Error handling payload:', err);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
        try {
          if (payload.new && payload.new.config) {
            const cfg = payload.new.config;
            if (cfg.att_by_date) attByDate = cfg.att_by_date;
            if (cfg.revenue_by_date) revenueByDate = cfg.revenue_by_date;
            if (cfg.session_students_by_date) sessionStudentsByDate = cfg.session_students_by_date;
            if (cfg.daily_approval_map) {
              dailyApprovalMap = cfg.daily_approval_map;
              localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));
            }
            if (cfg.student_package_discounts) {
              const spd = cfg.student_package_discounts;
              Object.keys(spd).forEach(stId => {
                if (students[stId]) {
                  students[stId].packageDiscounts = spd[stId];
                  let tot = 0;
                  for (const p in spd[stId]) {
                    tot += Number(spd[stId][p]) || 0;
                  }
                  students[stId].discount = tot;
                }
              });
              if (window.selectedDirectDecisionStudent && spd[window.selectedDirectDecisionStudent.id]) {
                window.selectedDirectDecisionStudent.packageDiscounts = spd[window.selectedDirectDecisionStudent.id];
                if (typeof window.handleDirectDecisionPackageChange === 'function') {
                  window.handleDirectDecisionPackageChange();
                }
              }
              if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
              if (typeof window.renderTermTable === 'function') window.renderTermTable();
            }
            if (Array.isArray(cfg.expenses_by_date)) {
              expensesByDate = cfg.expenses_by_date;
            } else if (cfg.expenses_by_date && typeof cfg.expenses_by_date === 'object') {
              const flatList = [];
              for (const dateKey in cfg.expenses_by_date) {
                const items = cfg.expenses_by_date[dateKey];
                if (Array.isArray(items)) {
                  items.forEach(item => {
                    if (item) flatList.push({
                      id: item.id || `tx_${item.timestamp || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                      date: item.date || dateKey,
                      reason: item.reason || '',
                      amount: Number(item.amount) || 0,
                      method: item.method || 'cash',
                      type: item.type || (item.isWithdrawal ? 'withdrawal' : 'expense'),
                      recipient: item.recipient || '',
                      timestamp: item.timestamp || Date.now()
                    });
                  });
                }
              }
              expensesByDate = flatList;
            }
            const dInput = document.getElementById("adminDailyDateInput");
            const curDate = dInput ? dInput.value : nowDateStr();
            if (typeof window.loadDailyReport === 'function') window.loadDailyReport(curDate);
            if (typeof window.renderDailyApprovalWidget === 'function') window.renderDailyApprovalWidget(curDate);
            if (cfg.subscription && typeof window.loadSubscriptionData === 'function') window.loadSubscriptionData();
            if (cfg.group_fees) {
              Object.keys(cfg.group_fees).forEach(pkgName => {
                const extra = cfg.group_fees[pkgName] || {};
                packages[pkgName] = {
                  name: pkgName,
                  subject: extra.subject || pkgName || '',
                  price: Number(extra.price) || 0,
                  installmentPrice: Number(extra.installmentPrice) || Number(extra.price) || 0,
                  hasInstallments: !!extra.hasInstallments,
                  expiryType: extra.expiryType || 'time',
                  startDate: extra.startDate || '',
                  endDate: extra.endDate || '',
                  sessionLimit: Number(extra.sessionLimit) || 8
                };
                groupFees[pkgName] = Number(extra.price) || 0;
              });
              if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
              if (typeof window.renderTermTable === 'function') window.renderTermTable();
            }
            if (cfg.syllabus_data || cfg.syllabus) {
              const sylRaw = cfg.syllabus_data || cfg.syllabus;
              if (Array.isArray(sylRaw)) {
                syllabusList = sylRaw.map(s => ({
                  title: s.title || s.name || '',
                  name: s.name || s.title || '',
                  status: s.status || 'not_started',
                  notes: s.notes || '',
                  updated_at: s.updated_at || s.date || ''
                }));
                if (typeof window.renderAdminSyllabus === 'function') window.renderAdminSyllabus();
              }
            }
          }
        } catch(err) {
          console.warn('[Admin Realtime Settings] Error handling payload:', err);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, async (payload) => {
        try {
          if (payload.eventType === 'DELETE' && payload.old && payload.old.name) {
            delete packages[payload.old.name];
            delete groupFees[payload.old.name];
          } else if (payload.new && payload.new.name) {
            const p = payload.new;
            const existing = packages[p.name] || {};
            packages[p.name] = {
              name: p.name,
              subject: existing.subject || p.name,
              price: Number(p.price) || 0,
              installmentPrice: Number(p.installment_price) || 0,
              hasInstallments: !!p.has_installments,
              expiryType: existing.expiryType || 'time',
              startDate: existing.startDate || '',
              endDate: existing.endDate || '',
              sessionLimit: existing.sessionLimit || 8
            };
            groupFees[p.name] = Number(p.price) || 0;
          }
          if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
          if (typeof window.renderTermTable === 'function') window.renderTermTable();
        } catch(err) {
          console.warn('[Admin Realtime Packages] Error:', err);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communications' }, payload => {
        try {
          if (typeof fetchDecisionsCount === 'function') fetchDecisionsCount();
          const decView = document.getElementById("viewDecisions");
          if (decView && !decView.classList.contains("hidden") && typeof window.fetchDecisions === 'function') {
            window.fetchDecisions();
          }
        } catch(err) {
          console.warn('[Admin Realtime Communications] Error handling payload:', err);
        }
      })
      .subscribe((status) => {
        console.log('[Admin Realtime Live Sync] Status:', status);
      });
  } catch(e) {
    console.warn('[Admin Realtime Live Sync] Error:', e);
  }
}

// Permissions Definitions (All 11 permissions, grouped cleanly)
export function getPermissionTitle(permKey) {
  const found = PERMISSIONS_DEFS.find(p => p.key === permKey);
  if (found && found.label) {
    return typeof found.label === 'object' ? (found.label[currentLang] || found.label.ar) : found.label;
  }
  return permKey;
}

export const PERMISSIONS_DEFS = [
  { 
    key: "show_revenue", 
    label: { ar: "ط¥ط¸ظ‡ط§ط± ط§ظ„ط¥ظٹط±ط§ط¯ ط§ظ„ظٹظˆظ…ظٹ", en: "Show Daily Revenue" }, 
    desc: { ar: "ظٹط¹ط±ط¶ ط±ظ‚ظ… ط¥ظٹط±ط§ط¯ ط§ظ„ظˆط±ط¯ظٹط© ط§ظ„ط­ط§ظ„ظٹ ظپظٹ ط§ظ„ط´ط±ظٹط· ط§ظ„ط¹ظ„ظˆظٹ ظ„ظ„ظ…ط³ط§ط¹ط¯", en: "Displays current shift revenue in assistant topbar" }, 
    icon: "fa-wallet", 
    group: "financial" 
  },
  { 
    key: "can_request_discount", 
    label: { ar: "ط·ظ„ط¨ ط®طµظ… / ط¥ط¹ظپط§ط،", en: "Request Discount / Exemption" }, 
    desc: { ar: "ط¥ط¸ظ‡ط§ط± ط²ط± 'ط®طµظ…' ط¹ظ†ط¯ ط§ظ„ط¯ظپط¹ ظ„ظٹطھظ…ظƒظ† ط§ظ„ظ…ط³ط§ط¹ط¯ ظ…ظ† ط·ظ„ط¨ ط¥ط¹ظپط§ط،", en: "Show 'Discount' button during payment to request exemption" }, 
    icon: "fa-tags", 
    group: "financial" 
  },
  
  { 
    key: "can_add_student", 
    label: { ar: "ط¥ط¶ط§ظپط© ط·ط§ظ„ط¨ ط¬ط¯ظٹط¯", en: "Add New Student" }, 
    desc: { ar: "ظٹط³ظ…ط­ ط¨ظپطھط­ ظƒط§ط±طھ 'ط¥ط¶ط§ظپط© ط·ط§ظ„ط¨ ط¬ط¯ظٹط¯' ظˆطھط³ط¬ظٹظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ", en: "Allows opening 'Add New Student' card and recording details" }, 
    icon: "fa-user-plus", 
    group: "data" 
  },
  { 
    key: "can_manage_packages", 
    label: { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط±", en: "Manage Packages & Pricing" }, 
    desc: { ar: "ط¥طھط§ط­ط© ظپطھط­ طµظپط­ط© ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط± ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¬ط§ظ†ط¨ظٹط©", en: "Allows opening packages and pricing from sidebar" }, 
    icon: "fa-box-open", 
    group: "data" 
  },
  { 
    key: "can_access_settings", 
    label: { ar: "ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ…", en: "System Settings" }, 
    desc: { ar: "ط§ظ„ط³ظ…ط§ط­ ط¨ظپطھط­ ظ„ظˆط­ط© ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھظ‚ط¯ظ…ط© (ظ†ط³ط® ط§ط­طھظٹط§ط·ظٹ - طھطµظپظٹط± - ط¥ظ„ط®)", en: "Allows opening advanced settings (Backup, Reset, etc.)" }, 
    icon: "fa-gears", 
    group: "data" 
  },

  { 
    key: "can_access_syllabus", 
    label: { ar: "ط§ظ„ظ…ظ†ظ‡ط¬ ط§ظ„ط¯ط±ط§ط³ظٹ", en: "Syllabus Roadmap" }, 
    desc: { ar: "ط§ظ„ط³ظ…ط§ط­ ط¨ظپطھط­ ظˆط¹ط±ط¶ ط®ط±ظٹط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬ ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¬ط§ظ†ط¨ظٹط©", en: "Allows viewing and updating syllabus roadmap" }, 
    icon: "fa-book-open", 
    group: "pages" 
  },
  { 
    key: "can_view_reports", 
    label: { ar: "ط§ظ„ظˆطµظˆظ„ ظ„طµظپط­ط© ط§ظ„طھظ‚ط§ط±ظٹط±", en: "Access Reports Page" }, 
    desc: { ar: "ط§ظ„ط³ظ…ط§ط­ ظ„ظ„ظ…ط³ط§ط¹ط¯ ط¨ظپطھط­ ظ‚ط³ظ… ط§ظ„ط­ط³ط§ط¨ط§طھ ظˆط§ظ„طھظ‚ط§ط±ظٹط±", en: "Allows opening accounts and reports section" }, 
    icon: "fa-chart-pie", 
    group: "pages" 
  },
  { 
    key: "can_access_marketing", 
    label: { ar: "ط£ط¯ظˆط§طھ ط§ظ„طھط³ظˆظٹظ‚", en: "Marketing Tools" }, 
    desc: { ar: "ط¥طھط§ط­ط© ظپطھط­ طµظپط­ط© ط§ظ„طھط³ظˆظٹظ‚ ظˆط¥ط±ط³ط§ظ„ ط±ط³ط§ط¦ظ„ ظ„ظ„ط·ظ„ط§ط¨", en: "Allows opening marketing and student messaging" }, 
    icon: "fa-bullhorn", 
    group: "pages" 
  },
  { 
    key: "can_access_session_students", 
    label: { ar: "ط·ظ„ط§ط¨ ط§ظ„ط­طµط©", en: "Session Students" }, 
    desc: { ar: "ط§ظ„ط³ظ…ط§ط­ ط¨ط¹ط±ط¶ ظ‚ط§ط¦ظ…ط© ط§ظ„ط­ط¶ظˆط± ط§ظ„ظ…ط®طµطµط© ظ„ظ„ط­طµط© ط§ظ„ط­ط§ظ„ظٹط©", en: "Allows viewing the current session student attendance list" }, 
    icon: "fa-clipboard-user", 
    group: "pages" 
  },
  { 
    key: "can_access_booklets", 
    label: { ar: "ظ…ط®ط²ظˆظ† ط§ظ„ظ…ط°ظƒط±ط§طھ", en: "Booklets Inventory" }, 
    desc: { ar: "ط§ظ„ط³ظ…ط§ط­ ط¨ظپطھط­ ط¬ط±ط¯ ط§ظ„ظ…ط°ظƒط±ط§طھ ظˆط¥ط¯ط§ط±ط© ط§ظ„ظ…ط¨ظٹط¹ط§طھ", en: "Allows opening booklet inventory and sales" }, 
    icon: "fa-book", 
    group: "pages" 
  }
];

const PERM_GROUPS = [
  { id: "financial", icon: "fa-money-bill-wave", title: { ar: "ط§ظ„طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط§ظ„ظٹط©", en: "Financial Permissions" } },
  { id: "data", icon: "fa-server", title: { ar: "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆط§ظ„ظ†ط¸ط§ظ…", en: "Data & System Management" } },
  { id: "pages", icon: "fa-layer-group", title: { ar: "طµظ„ط§ط­ظٹط§طھ ط§ظ„طµظپط­ط§طھ ظˆط§ظ„ط£ط¯ظˆط§طھ", en: "Pages & Tools Permissions" } }
];


// =============================================================================
// GLOBAL NOTIFICATION & INTERCEPTOR ENGINE (FULL ARABIC & ENGLISH LOCALIZATION)
// =============================================================================
const GLOBAL_NOTIF_DICT = {
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Please enter username and password",
  "ط£ط¯ط®ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Please enter username and password",
  "ط£ط¯ط®ظ„ ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Please enter email and password",
  "ط£ط¯ط®ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Please enter password",
  "ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„ ط؛ظٹط± طµط­ظٹط­ط©طŒ ظٹط±ط¬ظ‰ ط§ظ„طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط³ط§ط¨ ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Invalid credentials. Please verify your username and password.",
  "ط®ط·ط£ ظپظٹ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„: ط§ظ„ط±ط¬ط§ط، ط§ظ„طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط³ط§ط¨ ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Login error: Please check your username and password.",
  "ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ ط£ظˆ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط®ط§ط·ط¦ط©.": "Assistant account not found or password incorrect.",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­. ظ…ط±ط­ط¨ط§ظ‹ ط¨ظƒ.": "Logged in successfully. Welcome!",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­. ط¬ط§ط±ظٹ ط§ظ„طھظˆط¬ظٹظ‡ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©...": "Logged in successfully. Redirecting to admin portal...",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ط¨ظ†ط¬ط§ط­": "Logged out successfully",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬": "Logged out",
  "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„": "An error occurred during login",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Please enter password",
  "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط؛ظٹط± طµط­ظٹط­ط©": "Incorrect password",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ„ظ„ظ…طھط§ط¨ط¹ط©": "Please enter password to proceed",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظƒظ„ظ…ط© ظ…ط±ظˆط± ط§ظ„ظ…ط¯ظٹط±": "Please enter manager password",
  "ظƒظ„ظ…ط© ظ…ط±ظˆط± ط§ظ„ظ…ط¯ظٹط± ط؛ظٹط± طµط­ظٹط­ط©!": "Incorrect manager password!",
  "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط؛ظٹط± طµط­ظٹط­ط©!": "Incorrect password!",
  "ظٹط¬ط¨ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ظƒظ…ط¯ظٹط± ط£ظˆظ„ط§ظ‹": "Must login as manager first",
  "طھظ… ظپطھط­ ط§ظ„ط´ظٹظپطھ ط¨ظ†ط¬ط§ط­": "Shift opened successfully",
  "طھظ… ط¥ط؛ظ„ط§ظ‚ ط§ظ„ط´ظٹظپطھ ط¨ظ†ط¬ط§ط­": "Shift closed successfully",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ط³ط¨ط¨ طھط¹ظ„ظٹظ‚ ط£ظˆ ط±ظپط¶ ط§ظ„ظٹظˆظ…ظٹط©": "Please specify the reason for suspending or rejecting the daily shift",
  "طھظ… ط­ظپط¸ ظ‚ط±ط§ط± ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط©": "Daily shift approval saved",
  "طھظ… ط±ظپط¶ ط§ظ„ظٹظˆظ…ظٹط©": "Daily shift rejected",
  "طھظ†ط¨ظٹظ‡: ط§ظ„ظٹظˆظ…ظٹط© ظ…ط¹ظ„ظ‚ط© ط­ط§ظ„ظٹط§ظ‹": "Warning: Daily shift is currently suspended",
  "طھظ… ظپطھط­ ط´ظٹظپطھ ط¬ط¯ظٹط¯": "New shift opened",
  "طھظ… طھط¹ظ„ظٹظ‚ ط§ظ„ظٹظˆظ…ظٹط©": "Daily shift suspended",
  "طھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط© ط¨ظ†ط¬ط§ط­": "Daily shift approved successfully",
  "طھظ… طھط£ظƒظٹط¯ ط§ط³طھظ„ط§ظ… ط§ظ„ظ†ظ‚ط¯ظٹط© ظˆط¥ط؛ظ„ط§ظ‚ ط§ظ„ظٹظˆظ…ظٹط©": "Cash receipt confirmed and daily shift closed",
  "طھظ… ظپطھط­ ط§ظ„ط´ظٹظپطھ ظˆط§ظ„ظٹظˆظ…ظٹط© ط¨ظ†ط¬ط§ط­ ظ…ظ† ظ‚ظگط¨ظ„ ط§ظ„ظ…ط¯ظٹط±.": "Shift and daily register opened successfully by manager.",
  "ط§ظ„ظٹظˆظ…ظٹط© ظ…ط¹طھظ…ط¯ط© ظˆط§ظ„ظ†ط¸ط§ظ… ظ…ظپطھظˆط­ ظ„ظ„ط¹ظ…ظ„": "Daily register approved and system open for work",
  "ط§ظ„ظٹظˆظ…ظٹط© ظ…ط¹ظ„ظ‚ط© ظˆظپظٹ ط§ظ†طھط¸ط§ط± ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ…ط¯ظٹط±": "Daily register suspended awaiting manager approval",
  "ظ‡ط°ظ‡ ط§ظ„ظ…ظٹط²ط© ظ…ظ‚ظپظˆظ„ط© ظ…ظ† ظ‚ظگط¨ظژظ„ ط§ظ„ظ…ط¯ظٹط±": "This feature is locked by the manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط± ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Packages & Pricing is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط± ظ…ظ‚ظپظ„ ظ…ظ† ظ‚ظگط¨ظژظ„ ط§ظ„ظ…ط¯ظٹط±": "Sorry, Packages & Pricing is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط§ظ„ظ…ظ†ظ‡ط¬ ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Syllabus is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط§ظ„طھظ‚ط§ط±ظٹط± ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Reports section is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط£ط¯ظˆط§طھ ط§ظ„طھط³ظˆظٹظ‚ ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Marketing Tools section is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط·ظ„ط§ط¨ ط§ظ„ط­طµط© ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Session Students section is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ظ…ط®ط²ظˆظ† ط§ظ„ظ…ط°ظƒط±ط§طھ ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Booklets Inventory is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ظ‚ط³ظ… ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, Settings section is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ط¥ط¶ط§ظپط© ط·ط§ظ„ط¨ ط¬ط¯ظٹط¯ ظ…ظ‚ظپظ„ط© ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, adding new students is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ طھط¹ط¯ظٹظ„ ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط£ط³ط¹ط§ط± ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, editing packages is locked by manager",
  "ط¹ظپظˆط§ظ‹طŒ ط®طµظ…/ط¥ط¹ظپط§ط، ط§ظ„ط·ظ„ط§ط¨ ظ…ظ‚ظپظ„ ظ…ظ† ط§ظ„ظ…ط¯ظٹط±": "Sorry, student discount/exemption is locked by manager",
  "ط¥ط±ط³ط§ظ„ ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ ظ…ظ‚ظپظ„ ظ…ظ† ظ‚ظگط¨ظ„ ط§ظ„ظ…ط¯ظٹط±": "Sending decision requests is locked by manager",
  "ظپط´ظ„ طھط­ط¯ظٹط« ط§ظ„طµظ„ط§ط­ظٹط© ظپظٹ ط§ظ„ط³ط­ط§ط¨ط©": "Failed to update permission in cloud",
  "طھظ… طھط­ط¯ظٹط« ط§ظ„طµظ„ط§ط­ظٹط§طھ ظ…ظ† ظ‚ظگط¨ظ„ ط§ظ„ظ…ط¯ظٹط± ظپظˆط±ظٹط§ظ‹": "Permissions updated by manager instantly",
  "طھظ… طھط­ط¯ظٹط« طµظ„ط§ط­ظٹط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant permission updated successfully",
  "ظپط´ظ„ طھط­ط¯ظٹط« ط§ظ„طµظ„ط§ط­ظٹط©": "Failed to update permission",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ط¨ظ†ط¬ط§ط­": "Attendance recorded successfully",
  "ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ ظ…ط§ط¯ط© ط§ظ„ط­ط¶ظˆط± ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ط¨ط§ظ„ط£ط¹ظ„ظ‰ ط£ظˆظ„ط§ظ‹": "Please select attendance subject from the top menu first",
  "ط§ظ„ط·ط§ظ„ط¨ ط؛ظٹط± ظ…ط³ط¬ظ„": "Student not registered",
  "ط§ظ„ط·ط§ظ„ط¨ ط؛ظٹط± ظ…ظˆط¬ظˆط¯": "Student not found",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط؛ظٹط§ط¨ ط¨ظ†ط¬ط§ط­": "Absence recorded successfully",
  "ط§ظ„ط·ط§ظ„ط¨ ظ…ط³ط¬ظ„ ط­ط¶ظˆط± ط¨ط§ظ„ظپط¹ظ„ ط§ظ„ظٹظˆظ…": "Student is already marked present today",
  "طھظ… ط¥ظ„ط؛ط§ط، طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط±": "Attendance cancelled",
  "طھظ… ط¥ظ„ط؛ط§ط، طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…ط¨ظ„ط؛ ط¨ظ†ط¬ط§ط­": "Attendance and payment cancelled successfully",
  "طھظ… ط¥ظ„ط؛ط§ط، طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…ط¨ظ„ط؛": "Attendance and payment cancelled",
  "طھظ… طھط³ط¬ظٹظ„ ط­ط¶ظˆط± ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student attendance recorded successfully",
  "طھظ… طھط³ط¬ظٹظ„ ط­ط¶ظˆط± ط§ظ„ط­طµط© ظˆطھط­طµظٹظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ظ†ط¬ط§ط­": "Session attendance recorded and payment collected successfully",
  "طھظ… ط¥ط¹ط·ط§ط، ط¥ظ†ط°ط§ط±": "Warning issued",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¥ظ†ط°ط§ط± ط¨ظ†ط¬ط§ط­": "Warning recorded successfully",
  "طھظ… ط¥ظ„ط؛ط§ط، ط§ظ„ط¥ظ†ط°ط§ط±": "Warning cancelled",
  "ط¥ظ„ط؛ط§ط، ط§ظ„ط­ط¶ظˆط± ط§ظ„ظ…ط§ظ„ظٹ": "Cancel Financial Attendance",
  "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظˆط¥ظ„ط؛ط§ط، ط­ط¶ظˆط± ظ‡ط°ط§ ط§ظ„ط·ط§ظ„ط¨ ط§ظ„ظ…ط§ظ„ظٹ ظ„ظ„ظٹظˆظ…طں": "Are you sure you want to cancel and delete this student's financial attendance for today?",
  "ظ†ط¹ظ…طŒ ط¥ظ„ط؛ط§ط، ط§ظ„ط­ط¶ظˆط±": "Yes, cancel attendance",
  "طھظ… ط­ظپط¸ ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student saved successfully",
  "طھظ… طھط­ط¯ظٹط« ط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student updated successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student deleted successfully",
  "طھظ… ط§ط³طھط±ط¬ط§ط¹ ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student restored successfully",
  "طھظ… ط§ظ„ط§ط³طھط±ط¬ط§ط¹": "Restored successfully",
  "ظ‡ط°ط§ ط§ظ„ظƒظˆط¯ ظ…ط­ط¬ظˆط² ظˆظ…ط³ط¬ظ„ ط¨ظ‡ ط¨ظٹط§ظ†ط§طھ ط¨ط§ظ„ظپط¹ظ„": "This ID is already registered",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨": "Please enter student name",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨": "Please enter student ID",
  "ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨ ط؛ظٹط± طµط­ظٹط­": "Invalid student ID",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط±ظ‚ظ… ط§ظ„ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹": "Please enter student phone number first",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط±ظ‚ظ… ظˆظ„ظٹ ط§ظ„ط£ظ…ط± ط£ظˆظ„ط§ظ‹": "Please enter parent phone number first",
  "ظٹط±ط¬ظ‰ ظ…ظ„ط، ظƒط§ظپط© ط§ظ„ط¨ظٹط§ظ†ط§طھ": "Please fill in all required fields",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط±ظ‚ظ… ط£ظˆ ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨": "Please enter student name or phone number",
  "ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط·ط§ظ„ط¨ ط¨ظ‡ط°ط§ ط§ظ„ط±ظ‚ظ… ط£ظˆ ط§ظ„ط§ط³ظ…": "No student found with this name or number",
  "ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹": "Please select a student first",
  "ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹ ظ…ظ† ط§ظ„ط¨ط­ط«": "Please select a student from search first",
  "ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط£ظˆ ظپطھط­ ظ…ظ„ظپ ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹": "Please select or open a student file first",
  "ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط£ظˆ ظپطھط­ ظ…ظ„ظپ ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹ ظ„ط·ط¨ط§ط¹ط© ط§ظ„ط¥ظ‚ط±ط§ط±": "Please select or open a student file first to print acknowledgment",
  "طھظ… ط§ظ„طھط­ط¯ظٹط« ظ„ظ€ ط¹ط§ط¯ظٹ": "Updated to Standard member",
  "طھظ… ط§ظ„طھط±ظ‚ظٹط© ظ„ظ€ VIP": "Upgraded to VIP member",
  "طھظ… طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط¹ط¶ظˆظٹط©": "Membership status updated",
  "طھظ… ط­ظپط¸ ط§ظ„طھظ‚ظٹظٹظ… ط¨ظ†ط¬ط§ط­": "Student evaluation saved successfully",
  "طھظ… طھط­ط¯ظٹط« ط¨ط§ظ‚ط§طھ ط§ظ„ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­": "Student packages updated successfully",
  "ظ†ط´ط·ط©": "Active",
  "طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ظˆطھط·ط¨ظٹظ‚ ط§ظ„ط®طµظ…": "Discount approved and applied",
  "طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ظˆطھط·ط¨ظٹظ‚ ط§ظ„ط®طµظ… ط¨ظ†ط¬ط§ط­": "Discount approved and applied successfully",
  "طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط·ظ„ط¨ ط§ظ„ط®طµظ…": "Discount request approved",
  "طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط·ظ„ط¨ظƒ": "Your request was approved",
  "ظپط´ظ„ طھظ†ظپظٹط° ط§ظ„ط·ظ„ط¨": "Failed to execute request",
  "طھظ… ط±ظپط¶ ط§ظ„ط·ظ„ط¨": "Request rejected",
  "طھظ… ط±ظپط¶ ط·ظ„ط¨ظƒ": "Your request was rejected",
  "ظپط´ظ„ ظپظٹ ط§ظ„ط±ظپط¶": "Failed to reject request",
  "ظپط´ظ„ ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ظپط¶": "Failed to process rejection",
  "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ‚ط±ط§ط±": "Error occurred while approving decision",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظ‚ظٹظ…ط© ط§ظ„ط®طµظ… ط§ظ„ظ…ظ‚طھط±ط­ط© ط¨ط§ظ„ط¬ظ†ظٹظ‡": "Please enter proposed discount amount in EGP",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ‚ظٹظ…ط© ط®طµظ… طµط­ظٹط­ط©": "Please enter a valid discount amount",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ط³ط¨ط¨ ط·ظ„ط¨ ط§ظ„ظ‚ط±ط§ط± ظ„ظٹط¹طھظ…ط¯ظ‡ ط§ظ„ظ…ط¯ظٹط±": "Please enter reason for decision request",
  "طھظ… ط¥ط±ط³ط§ظ„ ط·ظ„ط¨ ط§ظ„ظ‚ط±ط§ط± ظ„ظ„ظ…ط¯ظٹط± ط¨ظ†ط¬ط§ط­طŒ ظˆط³طھطµظ„ظƒ ط§ظ„ظ…ظˆط§ظپظ‚ط© ظپظˆط± ط§ط¹طھظ…ط§ط¯ظ‡ط§ ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط©": "Decision request sent to manager successfully",
  "ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ظ…ط¹ظ„ظ‚ط©": "No pending requests",
  "طھظ… ط§ط¹طھظ…ط§ط¯ ظˆطھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط± ط¨ظ†ط¬ط§ط­": "Decision approved and applied successfully",
  "ظ‚ط±ط§ط± ط®طµظ… ظ…ط¨ط§ط´ط± ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط©": "Direct discount decision from management",
  "ط­ظ…ظ„ط§طھ ط§ظ„طھط³ظˆظٹظ‚ ظ…طھط§ط­ط© ط­طµط±ظٹط§ظ‹ ظپظٹ ط§ظ„ط®ط·ط© ط§ظ„ط°ظ‡ط¨ظٹط© - ظٹط±ط¬ظ‰ طھط±ظ‚ظٹط© ط¨ط§ظ‚ط© ط§ظ„ط§ط´طھط±ط§ظƒ ظ„ظ„ظˆطµظˆظ„ ط¥ظ„ظ‰ ظ‡ط°ظ‡ ط§ظ„ظ…ظٹط²ط©": "Marketing campaigns are exclusive to Golden Plan. Please upgrade your subscription.",
  "طھظ… ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط·ظ„ط§ط¨": "Maximum student limit reached",
  "طھظ… طھط¬ط§ظˆط² ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ط§ظ„ظ…ط³ظ…ظˆط­ ط¨ظ‡": "Maximum assistants limit reached for your plan",
  "طھظ… ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†": "Maximum assistants limit reached",
  "طھظ… ظ‚ظپظ„ ط§ظ„ظ†ط¸ط§ظ…: ط§ظ†طھظ‡طھ ظپطھط±ط© ط§ظ„ط§ط´طھط±ط§ظƒ": "System locked: Subscription has expired",
  "ط§ظ†طھظ‡ط§ط، طµظ„ط§ط­ظٹط© ط§ط´طھط±ط§ظƒ ط§ظ„ظ†ط¸ط§ظ…": "System Subscription Expired",
  "طھظˆط§طµظ„ ظ„ظ„طھط¬ط¯ظٹط¯ ط§ظ„ظپظˆط±ظٹ": "Contact for Instant Renewal",
  "ط¹ط±ط¶ ط®ط·ط· ط§ظ„ط§ط´طھط±ط§ظƒ": "View Subscription Plans",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ظپط¹ط© ط¨ظ†ط¬ط§ط­": "Payment recorded successfully",
  "طھظ… ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ ط¨ظ†ط¬ط§ط­": "Changes saved successfully",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط¨ظ„ط؛ طµط­ظٹط­": "Please enter a valid amount",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨ ظˆط§ظ„ظ…ط¨ظ„ط؛ ط¨ط´ظƒظ„ طµط­ظٹط­": "Please enter student name and amount correctly",
  "ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط§ظ„ط¨ط§ظ‚ط© ط§ظ„ظ…ط±ط§ط¯ ط§ظ„ط¯ظپط¹ ظ„ظ‡ط§": "Please select the package to pay for",
  "طھظ… طھطµط­ظٹط­ ط§ظ„ط¯ظپط¹ط© ط¨ظ†ط¬ط§ط­": "Payment corrected successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ط¯ظپط¹ط© ط¨ظ†ط¬ط§ط­": "Payment deleted successfully",
  "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ط±طµظٹط¯ ط¨ظ†ط¬ط§ط­": "Balance added successfully",
  "طھظ… ط®طµظ… ط§ظ„ظ…ط¨ظ„ط؛ ط¨ظ†ط¬ط§ط­": "Amount deducted successfully",
  "طھظ… ط­ظپط¸ ظˆطھط­ط¯ظٹط« ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­": "Package saved & updated successfully",
  "طھظ… طھط­ط¯ظٹط« ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­": "Package updated successfully",
  "طھظ… ط­ظپط¸ ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­": "Package saved successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط© ظ†ظ‡ط§ط¦ظٹط§ظ‹ ظ…ظ† ط§ظ„ط³ط­ط§ط¨ط© ظˆط§ظ„ظ†ط¸ط§ظ…": "Package permanently deleted from cloud & system",
  "طھظ… ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­": "Package deleted successfully",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ظˆط³ط¹ط± ط§ظ„ط¨ط§ظ‚ط© ط¨ط´ظƒظ„ طµط­ظٹط­": "Please enter a valid package name and price",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©": "Please enter package name",
  "ط³ط¹ط± ط§ظ„ط¨ط§ظ‚ط© ظٹط¬ط¨ ط£ظ† ظٹظƒظˆظ† ط±ظ‚ظ…ط§ظ‹": "Package price must be a number",
  "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ظ…طµط±ظˆظپ ط¨ظ†ط¬ط§ط­": "Expense recorded successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ظ…طµط±ظˆظپ ط¨ظ†ط¬ط§ط­": "Expense deleted successfully",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ط¨ظ†ط¯ ظˆظ‚ظٹظ…ط© ط§ظ„ظ…طµط±ظˆظپ": "Please enter expense item and amount",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط¨ظ†ط¯ ظˆظ…ط¨ظ„ط؛ ط§ظ„ظ…طµط±ظˆظپ": "Please enter expense item and amount",
  "طھظ… ط­ظپط¸ ظˆطھط­ط¯ظٹط« ط§ظ„ظ…ظ†ظ‡ط¬ ط¨ظ†ط¬ط§ط­": "Syllabus saved & updated successfully",
  "طھظ… ط­ظپط¸ ط§ظ„ط¯ط±ط³ ط¨ظ†ط¬ط§ط­": "Lesson saved successfully",
  "طھظ…طھ ط¥ط¶ط§ظپط© ط§ظ„ط¯ط±ط³ ظ„ط®ط±ظٹط·ط© ط§ظ„ظ…ظ†ظ‡ط¬": "Lesson added to syllabus map",
  "طھظ… طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط¯ط±ط³ ط¨ظ†ط¬ط§ط­": "Lesson status updated successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ط¯ط±ط³ ظ…ظ† ط§ظ„ظ…ظ†ظ‡ط¬ ط¨ظ†ط¬ط§ط­": "Lesson deleted from syllabus successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ط¯ط±ط³ ظ…ظ† ط§ظ„ظ…ظ†ظ‡ط¬": "Lesson deleted from syllabus",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط¹ظ†ظˆط§ظ† ط§ظ„ط¯ط±ط³": "Please enter lesson title",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¯ط±ط³ / ط§ظ„ظپطµظ„": "Please enter lesson / chapter name",
  "طھظ… ط¨ظٹط¹ ط§ظ„ظ…ط°ظƒط±ط© ط¨ظ†ط¬ط§ط­": "Booklet sold successfully",
  "طھظ… ط§ط³طھط±ط¬ط§ط¹ ط§ظ„ظ…ط°ظƒط±ط© ظ„ظ„ظ…ط®ط²ظˆظ†": "Booklet returned to inventory",
  "طھظ… طھط­ط¯ظٹط« ظƒظ…ظٹط© ط§ظ„ظ…ط®ط²ظˆظ† ط¨ظ†ط¬ط§ط­": "Inventory quantity updated successfully",
  "طھظ… طھط­ط¯ظٹط« ط§ظ„ط¹ط¯ط¯ ط§ظ„ظƒظ„ظٹ ط¨ظ†ط¬ط§ط­": "Total count updated successfully",
  "طھظ… ط­ظپط¸ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط°ظƒط±ط© ط¨ظ†ط¬ط§ط­": "Booklet saved successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ظ…ط°ظƒط±ط© ط¨ظ†ط¬ط§ط­": "Booklet deleted successfully",
  "طھظ… ط­ط°ظپ ط§ظ„ظ…ط°ظƒط±ط© ظ…ظ† ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ط®ط²ظˆظ†": "Booklet deleted from inventory list",
  "ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…طھط§ط­ط© ظپظٹ ط§ظ„ظ…ط®ط²ظˆظ† ظ„ط§ طھظƒظپظٹ": "Insufficient stock quantity available",
  "ط§ظ„ظ…ط®ط²ظˆظ† ظپط§ط±ط؛ ط­ط§ظ„ظٹط§ظ‹": "Inventory is currently out of stock",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط°ظƒط±ط© ط£ظˆ ط§ظ„ظˆط±ظ‚": "Please enter booklet or paper name",
  "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط¹ط¯ط¯ ط§ظ„ظ†ط³ط® ط§ظ„ظ…ط³طھظ„ظ…ط©": "Please enter received copies count",
  "طھظ… ط§ط³طھظ„ط§ظ… ظˆط¥ط¶ط§ظپط© ط§ظ„ظ…ط°ظƒط±ط© ظ„ظ„ظ…ط®ط²ظˆظ† ط¨ظ†ط¬ط§ط­": "Booklet received and added to inventory successfully",
  "ط§ظ†طھظ‡ظ‰ ظ…ط®ط²ظˆظ† ظ‡ط°ظ‡ ط§ظ„ظ…ط°ظƒط±ط©طŒ ظٹط±ط¬ظ‰ طھط¹ط¯ظٹظ„ ط§ظ„ط¹ط¯ط¯ ط§ظ„ظƒظ„ظٹ ط¥ط°ط§ ظ‚ظ…طھ ط¨ط·ط¨ط§ط¹ط© ظ†ط³ط® ط¥ط¶ط§ظپظٹط©.": "Stock depleted for this booklet. Please update total count if extra copies are printed.",
  "ظ„ظ… ظٹطھظ… ط¨ظٹط¹ ط£ظٹ ظ†ط³ط®ط© ظ…ظ† ظ‡ط°ظ‡ ط§ظ„ظ…ط°ظƒط±ط© ظ„ط¥ط±ط¬ط§ط¹ظ‡ط§": "No copies of this booklet have been sold to return",
  "طھط¹ط¯ظٹظ„ ط±طµظٹط¯ ط§ظ„ظ…ط°ظƒط±ط©": "Edit Booklet Stock",
  "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„": "Save Changes",
  "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ <i class=\"fa-solid fa-check\"></i>": "Save Changes <i class=\"fa-solid fa-check\"></i>",
  "ط­ط°ظپ ظ…ط°ظƒط±ط© ظ…ظ† ط§ظ„ط¬ط±ط¯": "Delete Booklet from Inventory",
  "ظ†ط¹ظ…طŒ ط­ط°ظپ ط§ظ„ظ…ط°ظƒط±ط©": "Yes, delete booklet",
  "طھظ… طھطµظپظٹط© ط§ظ„ط£ط±ظ‚ط§ظ… ط§ظ„ظ…ط³طھظ‡ط¯ظپط© ط¨ظ†ط¬ط§ط­": "Target numbers filtered successfully",
  "ظ‚ط§ط¦ظ…ط© ط§ظ„ط£ط±ظ‚ط§ظ… ظپط§ط±ط؛ط©طŒ ظ‚ظ… ط¨طھطµظپظٹط© ط¯ط§طھط§ ط§ظ„ط·ظ„ط§ط¨ ط£ظˆظ„ط§ظ‹.": "Numbers list is empty, filter students data first.",
  "ظپط´ظ„ ط§ظ„ظ†ط³ط® ط§ظ„ظ…ط¨ط§ط´ط±طŒ ظٹط±ط¬ظ‰ طھظƒط±ط§ط± ط§ظ„ظ…ط­ط§ظˆظ„ط©": "Direct copy failed, please try again",
  "ط¨ط¯ط، طھط´ط؛ظٹظ„ ط§ظ„ط¨ط« ط§ظ„طھظ„ظ‚ط§ط¦ظٹ ط§ظ„ط¢ظ…ظ†طŒ ظٹط±ط¬ظ‰ ط§ظ„ط³ظ…ط§ط­ ط¨ط§ظ„ظ†ظˆط§ظپط° ط§ظ„ظ…ظ†ط¨ط«ظ‚ط© (Pop-ups)": "Starting safe auto broadcast, please allow pop-ups",
  "طھظ… ط¥ظٹظ‚ط§ظپ ط§ظ„ط¨ط« ظ…ط¤ظ‚طھط§ظ‹": "Broadcast paused",
  "طھظ… ط§ط³طھط¦ظ†ط§ظپ ط§ظ„ط¨ط« ط§ظ„طھظ„ظ‚ط§ط¦ظٹ â–¶": "Auto broadcast resumed â–¶",
  "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط¹ظ„ط§ظ† ظ„ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†": "Announcement broadcasted to all assistants",
  "طھظ… ط­ط°ظپ ط§ظ„ط¥ط¹ظ„ط§ظ† ط¨ظ†ط¬ط§ط­": "Announcement deleted successfully",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظ†طµ ط§ظ„ط¥ط¹ظ„ط§ظ†": "Please write the announcement text",
  "طھظ… طھط­ط¯ظٹط¯ ظƒط§ظپط© ط§ظ„ط±ط³ط§ط¦ظ„ ظƒظ…ظ‚ط±ظˆط،ط©": "All messages marked as read",
  "ظ„ط§ طھظˆط¬ط¯ ط±ط³ط§ط¦ظ„ ظ…ظ‚ط±ظˆط،ط© ظ„ظ…ط³ط­ظ‡ط§": "No read messages to clear",
  "طھظ… ظ…ط³ط­ ط§ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظ…ظ‚ط±ظˆط،ط© ط¨ظ†ط¬ط§ط­": "Read messages cleared successfully",
  "ظپط´ظ„ ظ…ط³ط­ ط§ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظ…ظ‚ط±ظˆط،ط©": "Failed to clear read messages",
  "طھظ… ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط¨ظ†ط¬ط§ط­": "Settings saved successfully",
  "طھظ… طھط±ظ‚ظٹط© ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط© ط¨ظ†ط¬ط§ط­": "Local database successfully upgraded",
  "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط­ظپط¸ ط§ظ„ط¨ظٹط§ظ†ط§طھ.": "An error occurred while saving data.",
  "ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ. طھط£ظƒط¯ ظ…ظ† ط§ظ„ط¥ظ†طھط±ظ†طھ.": "Failed to connect to database. Please check your internet.",
  "ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط³ط­ط§ط¨ظٹط©": "Failed to connect to cloud database",
  "ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط³ط­ط§ط¨ط©": "Cloud connection failed",
  "ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„": "Connection failed",
  "طھط­ط°ظٹط±: ظپط´ظ„ ظ…ط²ط§ظ…ظ†ط© ط¨ط¹ط¶ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† ط§ظ„ط³ط­ط§ط¨ط©": "Warning: Some cloud data failed to sync",
  "طھظ†ط¨ظٹظ‡: ط­ط¯ط« ط¨ط·ط، ظپظٹ ظ…ط²ط§ظ…ظ†ط© ط§ظ„ط³ط­ط§ط¨ط©طŒ ط¬ط§ط±ظٹ ط§ظ„ط¥ط¹ط§ط¯ط© طھظ„ظ‚ط§ط¦ظٹط§ظ‹": "Notice: Cloud sync delayed, retrying automatically",
  "ط¹ط§ط¯ ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط¥ظ†طھط±ظ†طھ ط¬ط§ط±ظٹ ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط©...": "Internet restored. Syncing with cloud...",
  "طھظ…طھ ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط© ط¨ظ†ط¬ط§ط­": "Cloud sync completed successfully",
  "طھظ… ط¹ظ…ظ„ ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط© ط¨ظ†ط¬ط§ط­": "Backup created successfully",
  "طھظ… طھطµط¯ظٹط± ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط© ط´ط§ظ…ظ„ط©": "Comprehensive backup exported successfully",
  "طھظ… ط§ط³طھط¹ط§ط¯ط© ط§ظ„ظ†ط³ط®ط© ط§ظ„ط§ط­طھظٹط§ط·ظٹط© ط¨ظ†ط¬ط§ط­": "Backup restored successfully",
  "طھظ… طھطµظپظٹط± ط­ط¶ظˆط± ظˆظ…طµط§ط±ظٹظپ ط§ظ„طھط±ظ… ط¨ط§ظ„ظƒط§ظ…ظ„ ط¨ظ†ط¬ط§ط­": "Term attendance and expenses reset successfully",
  "ط§ظ„ظ…ظ„ظپ ظپط§ط±ط؛ ط£ظˆ ظ„ط§ ظٹط­طھظˆظٹ ط¹ظ„ظ‰ ط¨ظٹط§ظ†ط§طھ طµط§ظ„ط­ط©": "The file is empty or contains no valid data",
  "ظ…ظƒطھط¨ط© ط§ظ„ط¥ظƒط³ظٹظ„ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©طŒ طھط£ظƒط¯ ظ…ظ† ظˆط¬ظˆط¯ ظ…ظ„ظپ xlsx.full.min.js ظپظٹ ظپظˆظ„ط¯ط± assets": "Excel library missing. Please check xlsx.full.min.js in assets folder",
  "ظ…ظƒطھط¨ط© ط§ظ„ط¥ظƒط³ظٹظ„ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©": "Excel library not found",
  "ظ…ظƒطھط¨ط© Excel ط؛ظٹط± ظ…طھظˆظپط±ط©": "Excel library not available",
  "طھظ… طھطµط¯ظٹط± ظ†ط³ط®ط© Excel ط¨ظ†ط¬ط§ط­.": "Excel file exported successfully.",
  "ظپط´ظ„ طھطµط¯ظٹط± ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¥ظ„ظ‰ Excel": "Failed to export data to Excel",
  "ط¬ط§ط±ظٹ ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظˆط§ظ„ط±ظپط¹ ط¥ظ„ظ‰ ط§ظ„ط³ط­ط§ط¨ط©...": "Syncing and uploading to cloud...",
  "طھظ…طھ ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظˆطھط­ط¯ظٹط« ط§ظ„طµظ„ط§ط­ظٹط§طھ ط¨ظ†ط¬ط§ط­": "Sync and permissions update completed successfully",
  "طھظ…طھ ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظˆط±ظپط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¥ظ„ظ‰ ط§ظ„ط³ط­ط§ط¨ط© ط¨ظ†ط¬ط§ط­": "Sync and data upload to cloud completed successfully",
  "ط®ط·ط£ ظپظٹ ط§ظ„ظ…ط²ط§ظ…ظ†ط©طŒ طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط§طھطµط§ظ„": "Sync error, check connection",
  "ط¹ظ…ظٹظ„ Supabase ط؛ظٹط± ظ…ظ‡ظٹط£": "Supabase client not initialized",
  "ط¬ط§ط±ظٹ ط±ظپط¹ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط© ط¥ظ„ظ‰ Supabase...": "Uploading all local data to Supabase...",
  "طھظ… ط±ظپط¹ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¨ظ†ط¬ط§ط­ ط¥ظ„ظ‰ Supabase.": "All data successfully uploaded to Supabase.",
  "ط¥ط¹ط§ط¯ط© طھظ‡ظٹط¦ط© ط§ظ„ظ†ط¸ط§ظ… ظˆط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹": "Reset System to Factory Settings",
  "طھط­ط°ظٹط± ط´ط¯ظٹط¯ ط§ظ„ط®ط·ظˆط±ط©: ط³ظٹطھظ… ظ…ط³ط­ ظƒط§ظپط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط§ط¨ ظˆط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…طµط±ظˆظپط§طھ ط¨ط§ظ„ظƒط§ظ…ظ„. ط§ظƒطھط¨ \"ظ…ط³ط­\" ظ„ظ„طھط£ظƒظٹط¯:": "Extreme danger: All student data, packages, attendance, and expenses will be completely wiped. Type \"ظ…ط³ط­\" to confirm:",
  "طھط£ظƒظٹط¯ ط§ظ„ط­ط°ظپ ط§ظ„ط´ط§ظ…ظ„": "Confirm Complete Wipe",
  "طھظ… ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹": "Factory Reset Complete",
  "طھظ… ظ…ط³ط­ ظƒط§ظپط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¨ظ†ط¬ط§ط­ ظˆط¥ط¹ط§ط¯ط© طھط´ط؛ظٹظ„ ط§ظ„ظ†ط¸ط§ظ….": "All data successfully erased and system restarted.",
  "طھظ… ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant account created successfully",
  "ط¬ط§ط±ظٹ ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯... ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±": "Creating assistant account... Please wait",
  "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­.": "Assistant added successfully.",
  "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant added successfully",
  "طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ظ…ط±ظˆط± ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant password updated successfully",
  "طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط¨ظ†ط¬ط§ط­": "Password updated successfully",
  "ظپط´ظ„ طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Failed to update password",
  "طھظ… ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯": "Assistant deleted",
  "طھظ… ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant deleted successfully",
  "طھظ… ط­ط°ظپ ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­": "Assistant account deleted successfully",
  "ظپط´ظ„ ظپظٹ ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯.": "Failed to delete assistant.",
  "ظپط´ظ„ ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯": "Failed to delete assistant",
  "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظٹط¬ط¨ ط£ظ† ظٹط­طھظˆظٹ ط¹ظ„ظ‰ ط­ط±ظˆظپ ط¥ظ†ط¬ظ„ظٹط²ظٹط© طµط؛ظٹط±ط© ظˆط£ط±ظ‚ط§ظ… ظپظ‚ط· ط¨ط¯ظˆظ† ظ…ط³ط§ظپط§طھ": "Username must contain lowercase English letters & numbers only without spaces",
  "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظٹط¬ط¨ ط£ظ† ظٹظƒظˆظ† ط¨ط­ط±ظˆظپ ط¥ظ†ط¬ظ„ظٹط²ظٹط© ظپظ‚ط· ظˆط¨ط¯ظˆظ† ظ…ط³ط§ظپط§طھ": "Username must be English letters only without spaces",
  "ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† ظ…ط¯ظٹط±ط§ظ‹ ظ„ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ظٹظ†.": "You must be a manager to add assistants.",
  "ظپط´ظ„ ط¥ط¶ط§ظپط© ط§ظ„ظ…ط³ط§ط¹ط¯": "Failed to add assistant",
  "طھظ… ظ†ط³ط® ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ط¥ظ„ظ‰ ط§ظ„ط­ط§ظپط¸ط©": "Current password copied to clipboard",
  "طھظ… ظ†ط³ط® ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Password copied to clipboard",
  "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©": "Please enter the new password",
  "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظٹط¬ط¨ ط£ظ† طھطھظƒظˆظ† ظ…ظ† 6 ط®ط§ظ†ط§طھ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„": "Password must be at least 6 characters",
  "طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Change Password",
  "ط­ظپط¸ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±": "Save Password",
  "طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط®ط§طµط© ط¨ظƒ": "Change Your Password",
  "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©": "Please enter the new password",
  "طھط؛ظٹظٹط±": "Change",
  "ط¬ط§ط±ظٹ طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±...": "Changing password...",
  "طھظ… طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط¨ظ†ط¬ط§ط­.": "Password changed successfully.",
  "ط¬ط§ط±ظٹ ط¬ظ„ط¨ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط³ط§ط¹ط¯...": "Fetching assistant data...",
  "طھط£ظƒظٹط¯": "Confirm",
  "طھط£ظƒظٹط¯ ط§ظ„ط­ط°ظپ": "Confirm Delete",
  "طھط£ظƒظٹط¯ ط§ظ„ط§ط³طھظٹط±ط§ط¯": "Confirm Import",
  "ظ†ط¹ظ…طŒ ط§ط³طھط¨ط¯ظ„": "Yes, replace",
  "طھط£ظƒظٹط¯ ط§ظ„ط®طµظ…": "Confirm Discount",
  "طھط£ظƒظٹط¯ ط§ظ„طھطµظپظٹط±": "Confirm Reset",
  "ظ†ط¹ظ…طŒ طµظپط±": "Yes, reset",
  "طھط£ظƒظٹط¯ ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹": "Confirm Factory Reset",
  "ظ†ط¹ظ…طŒ ط§ظ…ط³ط­ ظƒظ„ ط´ظٹط،": "Yes, erase everything",
  "طھط­ط°ظٹط± ط´ط¯ظٹط¯": "Severe Warning",
  "ظ†ط¹ظ…طŒ ط§ط³طھط±ط¬ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ": "Yes, restore data",
  "ظ†ط¹ظ…طŒ ط§ط­ط°ظپ": "Yes, delete",
  "ط¥ظ„ط؛ط§ط،": "Cancel",
  "طھط±ط§ط¬ط¹": "Cancel",
  "ط­ظپط¸": "Save",
  "ط¥ط؛ظ„ط§ظ‚": "Close",
  "طھظ…": "Done",
  "ط®ط·ط£": "Error",
  "طھط­ط°ظٹط±": "Warning",
  "ظ†ط¬ط§ط­": "Success",
  "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯طں": "Are you sure?",
  "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط°ظپطں": "Are you sure you want to delete?",
  "ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹ ط¹ظ† ظ‡ط°ظ‡ ط§ظ„ط®ط·ظˆط©!": "This action cannot be undone!",
  "طھظ†ط¨ظٹظ‡": "Notice",
  "طھظ†ط¨ظٹظ‡ ط¹ط§ظ…": "General Notice",
  "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† طھطµظپظٹط± ط§ظ„طھط±ظ…طں": "Are you sure you want to reset the term?",
  "ط³ظٹطھظ… ظ…ط³ط­ ط³ط¬ظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…طµط±ظˆظپط§طھ ط¨ط§ظ„ظƒط§ظ…ظ„!": "All attendance records and expenses will be wiped!",
  "ظ†ط¹ظ…طŒ طµظپط± ط§ظ„طھط±ظ…": "Yes, reset term",
  "ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ظٹظˆظ…ظٹ": "Daily Report",
  "طھظ‚ط±ظٹط± ط§ظ„طھط±ظ…": "Term Report",
  "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†": "Assistant Management",
  "طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط³ط§ط¹ط¯": "Assistant Permissions",
  "ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ": "Decision Requests",
  "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ظ…طµط§ط±ظٹظپ": "Packages & Expenses Management",
  "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھظ‚ط¯ظ…ط©": "Advanced Settings",
  "<i class='fa-solid fa-money-bill-wave'></i> ط§ظ„طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط§ظ„ظٹط©": "<i class='fa-solid fa-money-bill-wave'></i> Financial Permissions",
  "<i class='fa-solid fa-server'></i> ط¥ط¯ط§ط±ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆط§ظ„ظ†ط¸ط§ظ…": "<i class='fa-solid fa-server'></i> Data & System Management",
  "<i class='fa-regular fa-file-lines'></i> طµظ„ط§ط­ظٹط§طھ ط§ظ„طµظپط­ط§طھ ظˆط§ظ„ط£ط¯ظˆط§طھ": "<i class='fa-regular fa-file-lines'></i> Pages & Tools Permissions"
};

const DYNAMIC_NOTIF_RULES = [
  {
    pattern: /^طھظ… ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط·ظ„ط§ط¨( \((.*?)\))?/i,
    replace: (m, p1, p2) => p2 ? `Maximum student limit reached (${p2})` : `Maximum student limit reached`
  },
  {
    pattern: /^ط§ظ„ط·ط§ظ„ط¨ ط؛ظٹط± ظ…ط³ط¬ظ„:(.*)/i,
    replace: (m, p1) => `Student not registered: ${p1}`
  },
  {
    pattern: /^ط¨ط§ظ‚طھظƒظ… ط§ظ„ط­ط§ظ„ظٹط© طھط³ظ…ط­ ط¨ط­ط¯ ط£ظ‚طµظ‰ (.*?) ط·ط§ظ„ط¨/i,
    replace: (m, p1) => `Your current plan allows a maximum of ${p1} students. Please contact management to upgrade.`
  },
  {
    pattern: /^طھظ… طھط·ط¨ظٹظ‚ ط§ظ„ط®طµظ… ط¹ظ„ظ‰ (.*)$/i,
    replace: (m, p1) => `Discount applied to ${p1}`
  },
  {
    pattern: /^طھظ… طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط± ط¨ظ†ط¬ط§ط­ ظ„ظ„ط·ط§ظ„ط¨:(.*)$/i,
    replace: (m, p1) => `Decision applied successfully for student:${p1}`
  },
  {
    pattern: /^طھظ… ط§ط³طھظٹط±ط§ط¯ (.*?) ط·ط§ظ„ط¨ ط¨ظ†ط¬ط§ط­/i,
    replace: (m, p1) => `Successfully imported ${p1} students`
  },
  {
    pattern: /^طھظ… ط¨ظٹط¹ ظ†ط³ط®ط© ظ…ظ† (.*) ظˆط¥ط¶ط§ظپط© (.*?) ط¬ ظ„ظ„ط®ط²ظٹظ†ط© ظƒط§ط´$/i,
    replace: (m, p1, p2) => `Sold 1 copy of ${p1}, added ${p2} EGP cash to treasury`
  },
  {
    pattern: /^طھظ… ط¥ط±ط¬ط§ط¹ ظ†ط³ط®ط© ظ…ظ† (.*) ط¨ظ†ط¬ط§ط­$/i,
    replace: (m, p1) => `1 copy of ${p1} returned successfully`
  },
  {
    pattern: /^طھظ… ظ†ط³ط® (.*?) ط±ظ‚ظ… ظ…ظˆط¨ط§ظٹظ„ ط¨ظ†ط¬ط§ط­/i,
    replace: (m, p1) => `Copied ${p1} mobile numbers successfully`
  },
  {
    pattern: /^طھظ… ظپطھط­ ط´ظٹظپطھ ظٹظˆظ… \((.*?)\) ط¨ظ†ط¬ط§ط­/i,
    replace: (m, p1) => `Shift for day (${p1}) opened successfully and assistant operations resumed.`
  },
  {
    pattern: /^طھظ… ط¥ط؛ظ„ط§ظ‚ ط´ظٹظپطھ ظٹظˆظ… \((.*?)\) ظˆطھط¬ظ…ظٹط¯ ط§ظ„ط¹ظ…ظ„ظٹط§طھ/i,
    replace: (m, p1) => `Shift for day (${p1}) closed and assistant operations frozen immediately.`
  },
  {
    pattern: /^طھظ… طھط¹ظ„ظٹظ‚ ظٹظˆظ…ظٹط© \((.*?)\) ظˆط¥ط±ط³ط§ظ„ ط§ظ„ظ…ظ„ط§ط­ط¸ط©/i,
    replace: (m, p1) => `Daily register (${p1}) suspended and notice sent to assistants`
  },
  {
    pattern: /^ط£ط¯ط®ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط© ظ„ظ„ظ…ط³ط§ط¹ط¯ \((.*)\):$/i,
    replace: (m, p1) => `Enter new password for assistant (${p1}):`
  },
  {
    pattern: /^ط£ط¯ط®ظ„ ط§ظ„ط¹ط¯ط¯ ط§ظ„ظƒظ„ظٹ ط§ظ„ظ…ط³طھظ„ظ… ظ„ظ…ط°ظƒط±ط© \((.*)\):$/i,
    replace: (m, p1) => `Enter total received count for booklet (${p1}):`
  },
  {
    pattern: /^ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ…ط°ظƒط±ط© \((.*)\) ظ…ظ† ظ‚ط§ط¦ظ…ط© ط§ظ„ط¬ط±ط¯طں$/i,
    replace: (m, p1) => `Are you sure you want to delete booklet (${p1}) from inventory?`
  },
  {
    pattern: /^طھظ… (طھظپط¹ظٹظ„|طھط¹ط·ظٹظ„|طھط­ط¯ظٹط«) طµظ„ط§ط­ظٹط© آ«(.*?)آ» ظ„ظ„ظ…ط³ط§ط¹ط¯ ([^\s.]+)(\.)?( ط¨ظ†ط¬ط§ط­)?/i,
    replace: (m, p1, p2, p3) => {
      const act = p1 === 'طھظپط¹ظٹظ„' ? 'enabled' : (p1 === 'طھط¹ط·ظٹظ„' ? 'disabled' : 'updated');
      const permMap = {
        'ط¥ط¸ظ‡ط§ط± ط§ظ„ط¥ظٹط±ط§ط¯ ط§ظ„ظٹظˆظ…ظٹ': 'Show Daily Revenue',
        'ط¹ط±ط¶ ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ ظˆط§ظ„ط®ط²ظٹظ†ط©': 'Show Revenue & Treasury',
        'ط§ظ„ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹ ظ„ظ„ط¥ظٹط±ط§ط¯ط§طھ': 'Daily Approval of Revenue',
        'ط¥ط¶ط§ظپط© ظˆطھط¹ط¯ظٹظ„ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط§ط¨': 'Add & Edit Student Data',
        'ط·ظ„ط¨ ط®طµظ… ط£ظˆ ط¥ط¹ظپط§ط،': 'Request Discount or Exemption',
        'ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط§ط´طھط±ط§ظƒط§طھ': 'Manage Packages & Subscriptions',
        'ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ… ظˆط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ': 'System Settings & Backup',
        'ط®ط±ظٹط·ط© ط§ظ„ظ…ظ†ظ‡ط¬ ط§ظ„ط¯ط±ط§ط³ظٹ': 'Syllabus Map',
        'ط§ظ„طھظ‚ط§ط±ظٹط± ظˆط§ظ„ط­ط³ط§ط¨ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©': 'Financial Reports & Accounts',
        'ط­ظ…ظ„ط§طھ ط§ظ„طھط³ظˆظٹظ‚ ط¨ط§ظ„ظˆط§طھط³ط§ط¨': 'WhatsApp Marketing Campaigns',
        'ط·ظ„ط§ط¨ ط§ظ„ط­طµط© ظˆط§ظ„ط؛ظٹط§ط¨ ط§ظ„ط³ط±ظٹط¹': 'Session Students & Quick Attendance',
        'ط¥ط¯ط§ط±ط© ظˆظ…ط¨ظٹط¹ط§طھ ط§ظ„ظ…ط°ظƒط±ط§طھ': 'Booklets Inventory & Sales',
        'ط­ط°ظپ ط§ظ„ط·ظ„ط§ط¨': 'Delete Students'
      };
      const pName = permMap[p2] || p2;
      return `Successfully ${act} permission "${pName}" for assistant ${p3}`;
    }
  },
  {
    pattern: /^ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط±:(.*)/i,
    replace: (m, p1) => `Error occurred while applying decision: ${p1}`
  },
  {
    pattern: /^ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط±ظپط¹:(.*)/i,
    replace: (m, p1) => `Error occurred during upload: ${p1}`
  },
  {
    pattern: /^ظپط´ظ„ ط¥ط±ط³ط§ظ„ ط§ظ„ط·ظ„ط¨:(.*)/i,
    replace: (m, p1) => `Failed to send request: ${p1}`
  },
  {
    pattern: /^ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ظ‚ط±ط§ط،ط© ظ…ظ„ظپ Excel:(.*)/i,
    replace: (m, p1) => `Error reading Excel file: ${p1}`
  },
  {
    pattern: /^ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھطµظپظٹط±:(.*)/i,
    replace: (m, p1) => `Error resetting data: ${p1}`
  },
  {
    pattern: /^ظپط´ظ„ ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹:(.*)/i,
    replace: (m, p1) => `Factory reset failed: ${p1}`
  },
  {
    pattern: /^ط§ظ„ط¨ط§ظ‚ط© ظ…ظ†طھظ‡ظٹط©/i,
    replace: () => `Package expired`
  },
  {
    pattern: /^ط¹ظ„ظ‰ ظˆط´ظƒ ط§ظ„ط§ظ†طھظ‡ط§ط،/i,
    replace: () => `About to expire`
  },
  {
    pattern: /^طھظ… طھط³ط¬ظٹظ„ ط­ط¶ظˆط± ط§ظ„ط·ط§ظ„ط¨ (.+) ط¨ظ†ط¬ط§ط­/i,
    replace: (m, p1) => `Attendance recorded for ${p1} successfully.`
  },
  {
    pattern: /ط§ظ†طھظ‡طھ ظپطھط±ط© طµظ„ط§ط­ظٹط© ط§ط´طھط±ط§ظƒ ط§ظ„ظ…ط±ظƒط² ط¨ط§ظ„ظƒط§ظ…ظ„/i,
    replace: () => `<p style="color:var(--text-secondary);margin-bottom:12px">Center subscription has expired completely.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">Operations are suspended until renewed by management.</p>`
  },
  {
    pattern: /ط§ظ†طھظ‡طھ ظپطھط±ط© طµظ„ط§ط­ظٹط© ط§ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ط®ط§طµط© ط¨ظ†ط¸ط§ظ… ط§ظ„ط³ظ†طھط± ط¨ط§ظ„ظƒط§ظ…ظ„/i,
    replace: () => `<p style="color:var(--text-secondary);margin-bottom:12px">Center subscription has expired completely.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">All operations are suspended until renewed by management.</p>`
  },
  {
    pattern: /ط¨ط§ظ‚طھظƒ ط§ظ„ط­ط§ظ„ظٹط© طھط³ظ…ط­ ط¨ط­ط¯ ط£ظ‚طµظ‰ <b>(.*?) ط·ط§ظ„ط¨<\/b>/is,
    replace: (m, p1) => `<p style="color:var(--text-secondary);margin-bottom:12px">Your current plan allows a maximum of <b>${p1} students</b>.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> Please upgrade your plan to add more students.</p>`
  },
  {
    pattern: /ط¨ط§ظ‚طھظƒ ط§ظ„ط­ط§ظ„ظٹط© طھط³ظ…ط­ ط¨ط­ط¯ ط£ظ‚طµظ‰ <b>(.*?) ظ…ط³ط§ط¹ط¯<\/b>/is,
    replace: (m, p1) => `<p style="color:var(--text-secondary);margin-bottom:12px">Your current plan allows a maximum of <b>${p1} assistants</b>.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> Please upgrade your plan to add more assistant accounts.</p>`
  },
  {
    pattern: /ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ظ„ظ„ظ…ط³ط§ط¹ط¯ <b>(.*?)<\/b> ظ‡ظٹ:/i,
    replace: (m, p1) => `<div style="text-align: left; margin-bottom: 15px;">Current password for assistant <b>${p1}</b> is:</div>`
  }
];

function translateNotification(msg) {
  if (!msg || typeof msg !== 'string') return msg;
  const isEn = (window.currentLang === 'en' || (typeof currentLang !== 'undefined' && currentLang === 'en'));
  if (!isEn) return msg;

  const trimmed = msg.trim();
  if (GLOBAL_NOTIF_DICT[trimmed]) {
    return GLOBAL_NOTIF_DICT[trimmed];
  }

  for (let i = 0; i < DYNAMIC_NOTIF_RULES.length; i++) {
    const rule = DYNAMIC_NOTIF_RULES[i];
    if (rule.pattern.test(trimmed)) {
      return trimmed.replace(rule.pattern, rule.replace);
    }
  }

  return msg;
}
window.translateNotification = translateNotification;

function installSwalInterceptor() {
  if (window.Swal && !window._swalIntercepted) {
    window._swalIntercepted = true;
    const _origSwalFire = window.Swal.fire;
    window.Swal.fire = function(...args) {
      const isEn = (window.currentLang === 'en' || (typeof currentLang !== 'undefined' && currentLang === 'en'));
      if (isEn) {
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
          const opt = { ...args[0] };
          if (typeof opt.title === 'string') opt.title = translateNotification(opt.title);
          if (typeof opt.text === 'string') opt.text = translateNotification(opt.text);
          if (typeof opt.html === 'string') opt.html = translateNotification(opt.html);
          if (typeof opt.confirmButtonText === 'string') opt.confirmButtonText = translateNotification(opt.confirmButtonText);
          if (typeof opt.cancelButtonText === 'string') opt.cancelButtonText = translateNotification(opt.cancelButtonText);
          return _origSwalFire.call(window.Swal, opt);
        } else if (typeof args[0] === 'string') {
          args[0] = translateNotification(args[0]);
          if (typeof args[1] === 'string') args[1] = translateNotification(args[1]);
          if (typeof args[2] === 'string') args[2] = translateNotification(args[2]);
        }
      }
      return _origSwalFire.apply(window.Swal, args);
    };
  }
}
installSwalInterceptor();

// Helper: Toast
export function showToast(rawMsg, type = "info") {
  if (typeof AssistantSounds !== "undefined") {
    AssistantSounds.notification();
  } else if (typeof window.AssistantSounds !== "undefined") {
    window.AssistantSounds.notification();
  }
  const msg = translateNotification(rawMsg);
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  else if (type === "err") icon = "fa-circle-xmark";
  else if (type === "warning") icon = "fa-bell";
  t.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.remove(); }, 3500);
}
window.showToast = showToast;

// Helper: Date format
export function nowDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
window.nowDateStr = nowDateStr;

// ========================================================
// 1. AUTHENTICATION & MULTI-TAB ISOLATION
// ========================================================
export async function checkAdminAuth() {
  const adminSession = localStorage.getItem("ca_admin_session");
  const loginWrapper = document.getElementById("adminLoginWrapper");
  const dashboardLayout = document.getElementById("adminDashboardLayout");

  if (!adminSession) {
    if (loginWrapper) loginWrapper.classList.remove("hidden");
    if (dashboardLayout) dashboardLayout.style.display = "none";
    return false;
  }

  if (loginWrapper) loginWrapper.classList.add("hidden");
  if (dashboardLayout) dashboardLayout.style.display = "flex";

  const rawAdmin = localStorage.getItem("ca_admin_username") || "Ahmed Qutb";
  let displayAdmin = rawAdmin;
  if (rawAdmin.includes("@")) {
    const part = rawAdmin.split("@")[0].toLowerCase();
    if (part.includes("ahmed") || part.includes("qutb")) {
      displayAdmin = "Ahmed Qutb";
    } else {
      displayAdmin = rawAdmin.split("@")[0];
    }
  }
  const nameEl = document.getElementById("adminTopName");
  if (nameEl) nameEl.textContent = displayAdmin;

  const today = nowDateStr();
  const dateInput = document.getElementById("adminDailyDateInput");
  if (dateInput && !dateInput.value) dateInput.value = today;
  if (typeof window.renderDailyApprovalWidget === 'function') {
    window.renderDailyApprovalWidget(today);
  }
  if (typeof window.loadDailyReport === 'function') {
    window.loadDailyReport(today);
  }

  return true;
}

window.navigateWithTransition = function(url) {
  const isAr = (currentLang === "ar");
  const card = document.querySelector('.admin-login-card') || document.querySelector('.login-card');
  if (card) {
    card.classList.add('card-exit-transition');
  }
  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
    const txt = overlay.querySelector('.transition-text');
    if (txt) txt.textContent = isAr ? "ط¬ط§ط±ظٹ ط§ظ„ط§ظ†طھظ‚ط§ظ„.." : "Switching Portal...";
    overlay.classList.add('active');
  }
  setTimeout(() => {
    let target = url;
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/assistant/')) {
      if (url.includes('index.html')) target = 'index.html';
      else if (url.includes('admin.html')) target = 'admin.html';
    } else {
      if (url.includes('index.html')) target = '../assistant/index.html';
      else if (url.includes('admin.html')) target = 'admin.html';
    }
    window.location.replace(target);
  }, 280);
};

window.handleAdminLogin = async function() {
  const u = document.getElementById("adminLoginUser").value.trim();
  const p = document.getElementById("adminLoginPass").value.trim();
  if (!u || !p) return showToast("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", "err");

  const btn = document.getElementById("adminLoginSubmitBtn");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ط¬ط§ط±ظٹ ط§ظ„طھط­ظ‚ظ‚...'; }

  try {
    if (!supabase) throw new Error("ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ط®ط§ط¯ظ… ط§ظ„ط³ط­ط§ط¨ط©");

    // Check manager_account
    const { data, error } = await supabase
      .from('manager_account')
      .select('*')
      .eq('username', u)
      .eq('password', p);

    if (error || !data || data.length === 0) {
      showToast("ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„ ط؛ظٹط± طµط­ظٹط­ط©طŒ ظٹط±ط¬ظ‰ ط§ظ„طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط³ط§ط¨ ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", "err");
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©'; }
      return;
    }

    const row = data[0];
    const managerId = (row.manager_id || row.center_id || String(row.id || u)).replace(/[@.]/g, '_');
    
    // Set dedicated Admin Session keys (never clobbering assistant keys)
    localStorage.setItem("ca_admin_session", "1");
    localStorage.setItem("ca_admin_username", row.name || u);
    localStorage.setItem("ca_manager_id", managerId);
    currentCenterId = managerId;

    showToast("طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­. ظ…ط±ط­ط¨ط§ظ‹ ط¨ظƒ.", "success");
    setTimeout(() => { location.reload(); }, 600);

  } catch(err) {
    console.error("Admin Login Error:", err);
    showToast(err.message || "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„", "err");
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©'; }
  }
};

window.handleAdminLogout = function() {
  const isAr = (currentLang === "ar");
  const btn = document.getElementById("adminLogoutBtn");
  if (btn) {
    btn.classList.add("logging-out");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${isAr ? "ط¬ط§ط±ظٹ طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬..." : "Logging out..."}</span>`;
  }

  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
    const txt = overlay.querySelector(".transition-text");
    if (txt) txt.textContent = isAr ? "ط¬ط§ط±ظٹ طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬..." : "Logging out...";
    overlay.classList.add('active');
  }

  // Close mobile sidebar drawer immediately if open
  if (typeof window.toggleAdminMobileSidebar === 'function') {
    window.toggleAdminMobileSidebar(false);
  }

  // Clear admin authentication & session keys
  localStorage.removeItem("ca_admin_session");
  localStorage.removeItem("ca_admin_username");

  // Smooth instant reload
  setTimeout(() => {
    location.reload();
  }, 250);
};

window.toggleAdminPass = function() {
  const inp = document.getElementById("adminLoginPass");
  const eye = document.getElementById("adminPassEye");
  if (!inp || !eye) return;
  if (inp.type === "password") {
    inp.type = "text";
    eye.className = "fa-solid fa-eye-slash";
  } else {
    inp.type = "password";
    eye.className = "fa-solid fa-eye";
  }
};

window.toggleAdminTheme = function() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  if (typeof window.switchThemeWithAnimation === "function") {
    window.switchThemeWithAnimation(next);
  } else {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("studify_admin_theme", next);
    localStorage.setItem("ca_theme", next);
    const icon = document.getElementById("adminThemeIcon");
    if (icon) icon.className = next === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
};

// ========================================================
// 2. DATA ENGINE: LOAD FROM SUPABASE & LOCAL CACHE
// ========================================================
// Helper: Save arbitrary center configuration to settings (id: 1)
export async function saveCenterConfig(partialConfig) {
  if (!supabase) return;
  try {
    const { data: cur } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
    const cfg = cur?.config || {};
    Object.assign(cfg, partialConfig);
    cfg.last_modified = Date.now();
    await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);
  } catch(e) {
    console.error("saveCenterConfig Error:", e);
  }
}
window.saveCenterConfig = saveCenterConfig;

async function loadAllAdminData() {
  if (!supabase) return;
  try {
    const [stRes, pkgRes, bklRes, setRes] = await Promise.all([
      supabase.from('students').select('*').not('id', 'is', null),
      supabase.from('packages').select('*'),
      supabase.from('booklets').select('*').not('id', 'is', null),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle()
    ]);

    // Extract Settings Config first
    const sRow = setRes && setRes.data ? setRes.data : {};
    const cfg = sRow.config || {};
    const stPkgsMap = cfg.student_packages || {};
    const stRanksMap = cfg.student_ranks || {};
    const stPkgDiscountsMap = cfg.student_package_discounts || {};
    const cfgGroupFees = cfg.group_fees || {};
    vaultTransfers = Array.isArray(cfg.vault_transfers) ? cfg.vault_transfers : [];

    // Students (with packages, payments, attendanceDates, discounts)
    if (stRes.data) {
      students = {};
      stRes.data.forEach(s => {
        let cName = s.class_name || s.className || '';
        if (cName === 'ط¹ط§ظ…' || cName === 'Without Package' || cName === 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' || cName === 'Without Package') cName = '';
        let pList = (Array.isArray(s.packages) && s.packages.length > 0) 
          ? s.packages.filter(p => p && p !== 'ط¹ط§ظ…' && p !== 'Without Package' && p !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && p !== 'Without Package') 
          : (stPkgsMap[s.id] || (cName ? [cName] : []));
        if (typeof pList === 'string') pList = [pList];
        if (!Array.isArray(pList)) pList = [];
        pList = pList.filter(p => p && p !== 'ط¹ط§ظ…' && p !== 'Without Package' && p !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && p !== 'Without Package');

        const restoredDiscounts = (stPkgDiscountsMap && stPkgDiscountsMap[s.id]) || s.package_discounts || s.packageDiscounts || (Number(s.discount) > 0 && pList.length === 1 ? { [pList[0]]: Number(s.discount) } : {});

        students[String(s.id)] = {
          id: s.id,
          name: s.name || '',
          className: cName,
          phone: s.phone || '',
          parentPhone: s.parent_phone || s.parentPhone || '',
          paid: Number(s.paid) || 0,
          discount: Number(s.discount) || 0,
          packageDiscounts: restoredDiscounts,
          paymentPlan: s.payment_plan || s.paymentPlan || 'cash',
          rank: stRanksMap[s.id] || s.rank || 'normal',
          packages: pList,
          payments: s.payments || [],
          attendanceDates: s.attendance_dates || [],
          status: s.status || 'active'
        };
      });
    }

    // Packages: Load and merge from settings.config.group_fees and packages table
    packages = {};
    groupFees = {};

    // 1. Base from settings.config.group_fees (contains subject, expiryType, dates, sessions)
    Object.keys(cfgGroupFees).forEach(pkgName => {
      const extra = cfgGroupFees[pkgName] || {};
      packages[pkgName] = {
        name: pkgName,
        subject: extra.subject || pkgName || '',
        price: Number(extra.price) || 0,
        installmentPrice: Number(extra.installmentPrice) || Number(extra.price) || 0,
        hasInstallments: !!extra.hasInstallments,
        expiryType: extra.expiryType || 'time',
        startDate: extra.startDate || '',
        endDate: extra.endDate || '',
        sessionLimit: Number(extra.sessionLimit) || 8
      };
      groupFees[pkgName] = Number(extra.price) || 0;
    });

    // 2. Overlay from packages table (authoritative for price, subject, installments)
    if (pkgRes.data && Array.isArray(pkgRes.data)) {
      pkgRes.data.forEach(p => {
        const existing = packages[p.name] || {};
        packages[p.name] = {
          name: p.name,
          subject: p.subject || existing.subject || p.name || '',
          price: Number(p.price) || existing.price || 0,
          installmentPrice: Number(p.installment_price) || existing.installmentPrice || Number(p.price) || 0,
          hasInstallments: !!p.has_installments,
          expiryType: existing.expiryType || 'time',
          startDate: existing.startDate || '',
          endDate: existing.endDate || '',
          sessionLimit: existing.sessionLimit || 8
        };
        groupFees[p.name] = Number(p.price) || existing.price || 0;
      });
    }

    // Booklets
    if (bklRes.data) {
      booklets = {};
      bklRes.data.forEach(b => { booklets[b.id] = b; });
    }

    // Settings & Center Data (attendance, revenue, expenses, syllabus, daily approval)
    if (setRes && setRes.data) {
      const s = setRes.data;
      const cfg = s.config || {};
      dailyShiftStatus = s.daily_shift_status || 'open';
      dailyApprovalMap = cfg.daily_approval_map || dailyApprovalMap || {};
      if (typeof cfg.shift_system_enabled === 'boolean') {
        window.shiftSystemEnabled = cfg.shift_system_enabled;
      } else {
        window.shiftSystemEnabled = (cfg.shift_system_enabled !== false);
      }
      localStorage.setItem('studify_shift_system_enabled', window.shiftSystemEnabled ? 'true' : 'false');
      
      const today = nowDateStr();
      // If today is not yet explicitly set in the map, inherit from global daily_shift_status
      if (!dailyApprovalMap[today]) {
        dailyApprovalMap[today] = {
          status: dailyShiftStatus === 'open' ? 'approved' : 'pending',
          updated_at: s.updated_at
        };
      }
      localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));

      attByDate = cfg.att_by_date || cfg.attendance_by_date || {};
      if (cfg.revenue_by_date) revenueByDate = cfg.revenue_by_date;
      if (cfg.session_students_by_date && typeof cfg.session_students_by_date === 'object') {
        sessionStudentsByDate = cfg.session_students_by_date;
      } else {
        sessionStudentsByDate = {};
      }
      if (Array.isArray(cfg.expenses_by_date)) {
        expensesByDate = cfg.expenses_by_date;
      } else if (cfg.expenses_by_date && typeof cfg.expenses_by_date === 'object') {
        const flatList = [];
        for (const dateKey in cfg.expenses_by_date) {
          const items = cfg.expenses_by_date[dateKey];
          if (Array.isArray(items)) {
            items.forEach(item => {
              if (item) {
                flatList.push({
                  id: item.id || `tx_${item.timestamp || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  date: item.date || dateKey,
                  reason: item.reason || '',
                  amount: Number(item.amount) || 0,
                  method: item.method || 'cash',
                  type: item.type || (item.isWithdrawal ? 'withdrawal' : 'expense'),
                  recipient: item.recipient || '',
                  timestamp: item.timestamp || Date.now()
                });
              }
            });
          }
        }
        expensesByDate = flatList;
      } else {
        expensesByDate = [];
      }
      const sylRaw = s.syllabus_data || cfg.syllabus_data || cfg.syllabus;
      if (Array.isArray(sylRaw)) {
        syllabusList = sylRaw.map(s => ({
          title: s.title || s.name || '',
          name: s.name || s.title || '',
          status: s.status || 'not_started',
          notes: s.notes || '',
          updated_at: s.updated_at || s.date || new Date().toISOString()
        }));
      }
    }
  } catch(e) {
    console.error("Admin Load Data Error:", e);
    showToast("طھط­ط°ظٹط±: ظپط´ظ„ ظ…ط²ط§ظ…ظ†ط© ط¨ط¹ط¶ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† ط§ظ„ط³ط­ط§ط¨ط©", "warning");
  } finally {
    const today = nowDateStr();
    const dateInput = document.getElementById("adminDailyDateInput");
    const activeDate = (dateInput && dateInput.value) ? dateInput.value : today;
    if (dateInput && !dateInput.value) dateInput.value = today;
    
    try {
      if (typeof window.renderDailyApprovalWidget === 'function') window.renderDailyApprovalWidget(activeDate);
      if (typeof window.loadDailyReport === 'function') window.loadDailyReport(activeDate);
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
      if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
      if (typeof window.renderAdminSyllabus === 'function') window.renderAdminSyllabus();
      if (typeof fetchDecisionsCount === 'function') fetchDecisionsCount();
      if (typeof window.loadSubscriptionData === 'function') window.loadSubscriptionData();
      if (typeof window.fetchAssistants === 'function') window.fetchAssistants();
    } catch(err) {
      console.warn('Initial admin render warning:', err);
    }
  }
}

// ========================================================
// 3. TAB NAVIGATION
// ========================================================
window.switchAdminTab = function(tabKey) {
  // Update Nav Items in Sidebar
  document.querySelectorAll(".admin-nav-item").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-view").forEach(v => v.classList.add("hidden"));

  const isAr = (currentLang === "ar");
  const tabConfigs = {
    dailyReport:  { view: "viewDailyReport",  btn: "navBtnDailyReport",  title: isAr ? "ط§ظ„طھظ‚ط±ظٹط± ط§ظ„ظٹظˆظ…ظٹ" : "Daily Report", icon: "fa-calendar-day" },
    termReport:   { view: "viewTermReport",   btn: "navBtnTermReport",   title: isAr ? "طھظ‚ط±ظٹط± ط§ظ„طھط±ظ… ط§ظ„ظ…ط§ظ„ظٹ" : "Term Financial Report", icon: "fa-chart-line" },
    assistants:   { view: "viewAssistants",   btn: "navBtnAssistants",   title: isAr ? "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ" : "Assistants & Permissions", icon: "fa-user-shield" },
    decisions:    { view: "viewDecisions",    btn: "navBtnDecisions",    title: isAr ? "طµظ†ط¯ظˆظ‚ ط·ظ„ط¨ط§طھ ط§ظ„ظ‚ط±ط§ط±ط§طھ" : "Decision Requests Inbox", icon: "fa-bell" },
    packages:     { view: "viewPackages",     btn: "navBtnPackages",     title: isAr ? "ط¥ط¯ط§ط±ط© ط§ظ„ط¨ط§ظ‚ط§طھ" : "Packages Management", icon: "fa-boxes-stacked" },
    syllabus:     { view: "viewSyllabus",     btn: "navBtnSyllabus",     title: isAr ? "ط®ط±ظٹط·ط© ط³ظٹط± ط§ظ„ظ…ظ†ظ‡ط¬" : "Syllabus Roadmap", icon: "fa-book-open" },
    settings:     { view: "viewSettings",     btn: "navBtnSettings",     title: isAr ? "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھظ‚ط¯ظ…ط© ظˆط§ظ„ظ†ط³ط® ط§ظ„ط§ط­طھظٹط§ط·ظٹ" : "Advanced Settings & Backup", icon: "fa-sliders" },
    subscription: { view: "viewSubscription", btn: "navBtnSubscription", title: isAr ? "ط®ط·ط© ط§ظ„ط§ط´طھط±ط§ظƒ ظˆط§ظ„ط¨ط§ظ‚ط©" : "Subscription Plan & Status", icon: "fa-crown" }
  };

  const c = tabConfigs[tabKey] || tabConfigs.dailyReport;
  const viewEl = document.getElementById(c.view);
  const btnEl = document.getElementById(c.btn);
  const titleEl = document.getElementById("adminPageTitle");
  const iconEl = document.getElementById("adminPageIcon");

  if (viewEl) viewEl.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
  
  // Update mobile bottom nav
  document.querySelectorAll(".mob-nav-item").forEach(btn => btn.classList.remove("active"));
  let mobBtnId = null;
  if (tabKey === 'dailyReport') mobBtnId = 'mobNavDaily';
  if (tabKey === 'termReport') mobBtnId = 'mobNavTerm';
  if (tabKey === 'assistants') mobBtnId = 'mobNavAssistants';
  if (mobBtnId) {
    const mBtn = document.getElementById(mobBtnId);
    if (mBtn) mBtn.classList.add("active");
  }
  if (titleEl) titleEl.textContent = c.title;
  if (iconEl) iconEl.className = `fa-solid ${c.icon}`;

  // Auto-close mobile sidebar drawer on tab selection
  if (typeof window.toggleAdminMobileSidebar === 'function') {
    window.toggleAdminMobileSidebar(false);
  }

  // Smooth scroll content area to top on mobile
  const content = document.querySelector(".admin-content");
  if (content) content.scrollTo({ top: 0, behavior: 'smooth' });

  // Tab specific refreshes
  if (tabKey === "dailyReport") window.loadDailyReport(document.getElementById("adminDailyDateInput")?.value || nowDateStr());
  if (tabKey === "termReport") window.renderTermTable();
  if (tabKey === "packages") window.renderAdminPackages();
  if (tabKey === "syllabus") window.renderAdminSyllabus();
  if (tabKey === "assistants") window.fetchAssistants();
  if (tabKey === "decisions") window.fetchDecisions();
  if (tabKey === "subscription" && typeof window.renderSubscriptionView === 'function') window.renderSubscriptionView();
};

// ========================================================
// 4. DAILY SHIFT OPERATIONS & REPORT ENGINE
// ========================================================
export function renderDailyApprovalWidget(dateStr) {
  const d = dateStr || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  const widget = document.getElementById("dailyApprovalWidget");
  if (!widget) return;

  const isAr = (currentLang === "ar");
  const isFeatureEnabled = (window.shiftSystemEnabled !== false);
  const info = dailyApprovalMap[d];
  const isApproved = info ? (info.status === 'approved' || info === 'approved' || info === true) : (dailyShiftStatus === 'open');

  if (!isFeatureEnabled) {
    // â”€â”€ STATE 1: FEATURE DISABLED (OFF) â”€â”€
    // In this state, the feature itself is off. Assistants operate without daily shift lockout.
    // As per user request: When OFF, NEVER show "طھظ…طھ ط§ظ„ظ…ط±ط§ط¬ط¹ط© ظˆط§ظ„ظ‚ط±ط§ط،ط©" or action buttons!
    widget.className = "approval-card feature-disabled";
    widget.innerHTML = `
      <div class="approval-card-header">
        <div class="approval-header-left">
          <div class="approval-card-title">
            <span class="approval-status-icon icon-disabled"><i class="fa-solid fa-power-off"></i></span>
            <span class="approval-title-text">${isAr ? 'ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھ ط§ظ„ظٹظˆظ…ظٹ ظˆط§ظ„ط§ط¹طھظ…ط§ط¯' : 'Daily Shift & Approval System'}</span>
            <span class="approval-badge-pill disabled">
              <i class="fa-solid fa-ban"></i> ${isAr ? 'ظ…ط¹ط·ظ„ ط¨ط§ظ„ظƒط§ظ…ظ„ (OFF)' : 'Disabled (OFF)'}
            </span>
          </div>
        </div>
        <div class="approval-header-switch">
          <div class="switch-control-group">
            <span class="switch-control-label">${isAr ? 'ظ…ظپطھط§ط­ ط§ظ„ظ…ظٹط²ط©:' : 'Feature:'}</span>
            <button type="button" class="master-power-switch state-off" onclick="window.toggleShiftSystemFeature(true)" title="${isAr ? 'طھظپط¹ظٹظ„ ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ' : 'Enable Shift System'}" aria-label="طھظپط¹ظٹظ„ ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ">
              <span class="switch-rail">
                <span class="rail-text-on">ON</span>
                <span class="rail-text-off">OFF</span>
                <span class="switch-knob">
                  <i class="fa-solid fa-power-off"></i>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div class="approval-card-body">
        <p class="approval-card-desc">
          ${isAr 
            ? 'ظ…ظٹط²ط© ط¥ط؛ظ„ط§ظ‚ ظˆط§ط¹طھظ…ط§ط¯ ط§ظ„ط´ظٹظپطھ ط§ظ„ظٹظˆظ…ظٹ ظ…ط¹ط·ظ„ط© ط­ط§ظ„ظٹط§ظ‹. ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظ…طھط§ط­ط© ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ط¨ط´ظƒظ„ ط¯ط§ط¦ظ… ظˆظ…ط³طھظ…ط± ط¯ظˆظ† ط§ظ„ط­ط§ط¬ط© ظ„ط§ط¹طھظ…ط§ط¯ ظٹظˆظ…ظٹ ط£ظˆ ط¥ط؛ظ„ط§ظ‚ ظٹط¯ظˆظٹ ظ„ظ„ط´ظٹظپطھ.'
            : 'The daily shift system is currently disabled. Assistants have uninterrupted access to operations without daily shift requirements.'}
        </p>
      </div>
    `;
    return;
  }

  // â”€â”€ STATE 2: FEATURE ENABLED (ON) â”€â”€
  const titleText = isAr ? `ط­ط§ظ„ط© طھط´ط؛ظٹظ„ ط§ظ„ط´ظٹظپطھ ط§ظ„ظٹظˆظ…ظٹ (${d})` : `Daily Shift Status (${d})`;
  const badgeHtml = isApproved 
    ? (isAr ? '<i class="fa-solid fa-circle-play"></i> ظ…ظپطھظˆط­ ظ„ظ„ط¹ظ…ظ„ (ظ†ط´ط·)' : '<i class="fa-solid fa-circle-play"></i> Active (ON)')
    : (isAr ? '<i class="fa-solid fa-lock"></i> ظ…ط؛ظ„ظ‚ ظˆظ…ط¬ظ…ط¯ (ط¨ط§ظ†طھط¸ط§ط± ط§ظ„ط§ط¹طھظ…ط§ط¯)' : '<i class="fa-solid fa-lock"></i> Locked & Suspended (OFF)');

  const descText = isApproved
    ? (isAr 
        ? 'ط§ظ„ط´ظٹظپطھ ظ…ظپطھظˆط­ ظˆظ†ط´ط· ط­ط§ظ„ظٹط§ظ‹. ظٹظ…ظƒظ† ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ† طھط³ط¬ظٹظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„طھط­طµظٹظ„ ظˆط§ظ„ط¹ظ…ظ„ظٹط§طھ ط¨ط´ظƒظ„ ط·ط¨ظٹط¹ظٹ. ط¹ظ†ط¯ ط§ظ†طھظ‡ط§ط، ط§ظ„ظٹظˆظ…طŒ ط§ظ†ظ‚ط± ط¹ظ„ظ‰ ط²ط± ط¥ط؛ظ„ط§ظ‚ ط§ظ„ط´ظٹظپطھ ظ„طھط¬ظ…ظٹط¯ ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظˆظ…ط±ط§ط¬ط¹ط© ط§ظ„ط­ط³ط§ط¨ط§طھ.'
        : 'The shift is currently active and assistants can log attendance and collections. Click Close Shift to freeze operations and audit accounts.')
    : (isAr
        ? 'ط§ظ„ط´ظٹظپطھ ظ…ط؛ظ„ظ‚ ظˆظ…ط¬ظ…ط¯ ط­ط§ظ„ظٹط§ظ‹ ظ„ط¯ظ‰ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†. طھظ… طھط¬ظ…ظٹط¯ ظƒط§ظپط© ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظ„ط­ظٹظ† ظ…ط±ط§ط¬ط¹ط© ظˆط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط©. ط§ظ†ظ‚ط± ط¹ظ„ظ‰ "ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط© ظˆظپطھط­ ط§ظ„ط´ظٹظپطھ" ظ„ظ„ط¨ط¯ط،.'
        : 'The shift is currently locked and all assistant operations are frozen. Click "Approve Report & Open Shift" to activate.');

  widget.className = `approval-card feature-enabled ${isApproved ? 'approved' : 'pending'}`;
  widget.innerHTML = `
    <div class="approval-card-header">
      <div class="approval-header-left">
        <div class="approval-card-title">
          <span class="approval-status-icon ${isApproved ? 'icon-approved' : 'icon-pending'}">
            <i class="fa-solid ${isApproved ? 'fa-circle-check' : 'fa-lock'}"></i>
          </span>
          <span class="approval-title-text">${titleText}</span>
          <span class="approval-badge-pill ${isApproved ? 'approved' : 'pending'}">
            ${badgeHtml}
          </span>
        </div>
      </div>
      <div class="approval-header-switch">
        <div class="switch-control-group">
          <span class="switch-control-label active">${isAr ? 'ط§ظ„ظ…ظٹط²ط© ظ…ظپط¹ظ„ط©:' : 'Feature:'}</span>
          <button type="button" class="master-power-switch state-on" onclick="window.toggleShiftSystemFeature(false)" title="${isAr ? 'طھط¹ط·ظٹظ„ ظ…ظٹط²ط© ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ' : 'Disable Shift System'}" aria-label="طھط¹ط·ظٹظ„ ظ…ظٹط²ط© ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ">
            <span class="switch-rail">
              <span class="rail-text-on">ON</span>
              <span class="rail-text-off">OFF</span>
              <span class="switch-knob">
                <i class="fa-solid fa-lock-open"></i>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="approval-card-body">
      <p class="approval-card-desc">
        ${descText}
      </p>
      ${(info && info.approved_by && isApproved) ? `
        <div class="approval-approved-by">
          <i class="fa-solid fa-signature"></i> <span>${isAr ? 'طھظ… ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط© ظˆظپطھط­ ط§ظ„ط´ظٹظپطھ ط¨ظˆط§ط³ط·ط©:' : 'Approved & opened by:'} ${info.approved_by}</span>
        </div>
      ` : ''}
    </div>

    <div class="approval-card-footer">
      ${!isApproved ? `
        <button type="button" class="btn-shift-action btn-shift-open" onclick="window.approveDailyReportAndOpenShift('${d}')">
          <i class="fa-solid fa-check-double"></i>
          <span>${isAr ? 'طھظ…طھ ط§ظ„ظ…ط±ط§ط¬ط¹ط© ظˆط§ظ„ظ‚ط±ط§ط،ط© â€” ط§ط¹طھظ…ط§ط¯ ظˆظپطھط­ ط§ظ„ط´ظٹظپطھ (ON)' : 'Reviewed & Approved â€” Open Shift (ON)'}</span>
        </button>
      ` : `
        <button type="button" class="btn-shift-action btn-shift-close" onclick="window.toggleDailyApproval('${d}', false)">
          <i class="fa-solid fa-lock"></i>
          <span>${isAr ? 'ط¥ط؛ظ„ط§ظ‚ ظˆطھط¬ظ…ظٹط¯ ط§ظ„ط´ظٹظپطھ (Turn OFF)' : 'Close & Freeze Shift (Turn OFF)'}</span>
        </button>
      `}
    </div>
  `;
}
window.renderDailyApprovalWidget = renderDailyApprovalWidget;

export async function toggleShiftSystemFeature(enable) {
  const isAr = (currentLang === "ar");
  const d = (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);

  if (!enable) {
    const res = await Swal.fire({
      title: isAr ? 'طھط¹ط·ظٹظ„ ظ…ظٹط²ط© ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ' : 'Disable Shift System',
      text: isAr ? 'ط¹ظ†ط¯ طھط¹ط·ظٹظ„ ط§ظ„ظ…ظٹط²ط©طŒ ط³ظٹط¹ظ…ظ„ ط§ظ„ظ†ط¸ط§ظ… ظ„ط¯ظ‰ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ط¨ط´ظƒظ„ ط¯ط§ط¦ظ… ظˆظ…ط³طھظ…ط± ط¯ظˆظ† ط£ظٹ ط­ط¬ط¨ ط£ظˆ ظ‚ظپظ„ ظٹظˆظ…ظٹ. ظ‡ظ„ طھط±ظٹط¯ ط§ظ„ط§ط³طھظ…ط±ط§ط±طں' : 'Disabling this will allow assistants to operate continuously without daily lockouts. Proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ طھط¹ط·ظٹظ„ ط§ظ„ظ…ظٹط²ط© (OFF)' : 'Yes, Disable (OFF)',
      confirmButtonColor: '#EF4444',
      cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
    });
    if (!res.isConfirmed) return;
  }

  window.shiftSystemEnabled = enable;
  localStorage.setItem('studify_shift_system_enabled', enable ? 'true' : 'false');
  window.renderDailyApprovalWidget(d);

  showToast(
    enable 
      ? (isAr ? 'طھظ… طھظپط¹ظٹظ„ ظ…ظٹط²ط© ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھ ظˆط§ظ„ظٹظˆظ…ظٹط© ط¨ظ†ط¬ط§ط­.' : 'Shift system enabled.') 
      : (isAr ? 'طھظ… طھط¹ط·ظٹظ„ ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ â€” ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظ…طھط§ط­ط© ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ط¯ط§ط¦ظ…ط§ظ‹.' : 'Shift system disabled.'),
    enable ? 'success' : 'info'
  );

  try {
    const isApprovedNow = enable ? (dailyApprovalMap[d]?.status === 'approved' || dailyShiftStatus === 'open') : true;

    if (permChannel) {
      permChannel.postMessage({ 
        type: 'DAILY_SHIFT_CHANGE', 
        date: d, 
        isApproved: isApprovedNow, 
        shift_system_enabled: enable 
      });
    }
    if (realtimeShiftChannel) {
      realtimeShiftChannel.send({
        type: 'broadcast',
        event: 'DAILY_SHIFT_CHANGE',
        payload: { 
          date: d, 
          isApproved: isApprovedNow, 
          shift_system_enabled: enable,
          managerId: currentCenterId, 
          updatedAt: new Date().toISOString() 
        }
      });
    }
    if (supabase) {
      const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
      const cfg = curSettings?.config || {};
      cfg.shift_system_enabled = enable;
      cfg.last_shift_update = Date.now();

      await supabase.from('settings').update({
        config: cfg,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
    }
  } catch(e) {
    console.error("Toggle shift system feature error:", e);
  }
}
window.toggleShiftSystemFeature = toggleShiftSystemFeature;

export async function approveDailyReportAndOpenShift(dateStr) {
  const d = dateStr || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  const isAr = (currentLang === "ar");

  const idsCount = (attByDate && attByDate[d]) ? attByDate[d].length : 0;
  const revAmount = (revenueByDate && revenueByDate[d]) ? revenueByDate[d] : 0;
  const sessCount = (sessionStudentsByDate && sessionStudentsByDate[d]) ? sessionStudentsByDate[d].length : 0;
  const totalAtt = idsCount + sessCount;

  const res = await Swal.fire({
    title: isAr ? 'ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط© ظˆظپطھط­ ط§ظ„ط´ظٹظپطھ' : 'Approve Report & Open Shift',
    html: isAr
      ? `<div style="text-align: start; font-size: 0.95em; line-height: 1.6;">
          <p style="margin-bottom: 12px;">ظ‡ظ„ ظ‚ظ…طھ ط¨ظ…ط±ط§ط¬ط¹ط© ط¥ط­طµط§ط¦ظٹط§طھ ظٹظˆظ…ظٹط© <b>(${d})</b> ظˆطھط±ظٹط¯ ط§ط¹طھظ…ط§ط¯ظ‡ط§ ظˆظپطھط­ ط§ظ„ط´ظٹظپطھ ظ„ظ„ط¹ظ…ظ„ ظ„ط¯ظ‰ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظپظˆط±ط§ظ‹طں</p>
          <div style="background: var(--bg-inset, #f8fafc); border: 1px solid var(--border, #e2e8f0); border-radius: 10px; padding: 12px; display: flex; justify-content: space-around; text-align: center;">
            <div>
              <div style="font-size: 0.8em; color: var(--text-secondary);">ط­ط¶ظˆط± ط§ظ„ظٹظˆظ…</div>
              <strong style="color: var(--success); font-size: 1.2em;">${totalAtt} ط·ط§ظ„ط¨</strong>
            </div>
            <div style="border-inline-start: 1px solid var(--border, #e2e8f0);"></div>
            <div>
              <div style="font-size: 0.8em; color: var(--text-secondary);">ط¥ظٹط±ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط©</div>
              <strong style="color: var(--primary); font-size: 1.2em;">${revAmount.toLocaleString()} ط¬</strong>
            </div>
          </div>
        </div>`
      : `<p>Confirm review of daily report for <b>(${d})</b> and open shift operations for assistants?</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ طھظ… ط§ظ„ط§ط·ظ„ط§ط¹ ظˆط§ظ„ط§ط¹طھظ…ط§ط¯ (ظپطھط­ ط§ظ„ط´ظٹظپطھ ON)' : 'Yes, Approve & Open (ON)',
    confirmButtonColor: '#10B981',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
  });

  if (!res.isConfirmed) return;

  await window.toggleDailyApproval(d, true);
}
window.approveDailyReportAndOpenShift = approveDailyReportAndOpenShift;

export async function toggleDailyApproval(dateStr, toActive) {
  const d = dateStr || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  const isAr = (currentLang === "ar");
  const managerName = localStorage.getItem("ca_admin_username") || "Ahmed Qutb";

  if (toActive) {
    dailyShiftStatus = 'open';
    dailyApprovalMap[d] = {
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: managerName
    };
    localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));

    window.renderDailyApprovalWidget(d);
    showToast(`طھظ… ظپطھط­ ط´ظٹظپطھ ظٹظˆظ… (${d}) ط¨ظ†ط¬ط§ط­ ظˆط¨ط¯ط، ط¹ظ…ظ„ظٹط§طھ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظپظˆط±ط§ظ‹.`, "success");

    try {
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_CHANGE', date: d, isApproved: true });
      }
      if (realtimeShiftChannel) {
        realtimeShiftChannel.send({
          type: 'broadcast',
          event: 'DAILY_SHIFT_CHANGE',
          payload: { date: d, isApproved: true, managerId: currentCenterId, updatedAt: new Date().toISOString() }
        });
      }
      if (supabase) {
        const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = curSettings?.config || {};
        cfg.daily_approval_map = dailyApprovalMap;
        cfg.last_shift_update = Date.now();

        await supabase.from('settings').update({
          daily_shift_status: 'open',
          daily_approved_by: managerName,
          config: cfg,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      }
    } catch(e) {
      console.error("Shift open error:", e);
    }
  } else {
    const res = await Swal.fire({
      title: isAr ? 'ط¥ط؛ظ„ط§ظ‚ ظˆطھط¬ظ…ظٹط¯ ط§ظ„ط´ظٹظپطھ (Turn OFF)' : 'Close & Freeze Shift (Turn OFF)',
      text: isAr ? `ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط¥ط؛ظ„ط§ظ‚ ط´ظٹظپطھ ظٹظˆظ… (${d}) ظˆطھط¬ظ…ظٹط¯ ظƒط§ظپط© ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظ„ط¯ظ‰ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظ„ط­ظٹظ† ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظٹظˆظ…ظٹط©طں` : `Are you sure you want to close shift for day (${d}) and freeze assistant operations?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ ط¥ط؛ظ„ط§ظ‚ ط§ظ„ط´ظٹظپطھ (OFF)' : 'Yes, Close Shift (OFF)',
      confirmButtonColor: '#EF4444',
      cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
    });
    if (!res.isConfirmed) return;

    dailyShiftStatus = 'closed';
    dailyApprovalMap[d] = {
      status: 'pending',
      locked_at: new Date().toISOString(),
      locked_by: managerName
    };
    localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));

    window.renderDailyApprovalWidget(d);
    showToast(`طھظ… ط¥ط؛ظ„ط§ظ‚ ط´ظٹظپطھ ظٹظˆظ… (${d}) ظˆطھط¬ظ…ظٹط¯ ط§ظ„ط¹ظ…ظ„ظٹط§طھ ظ„ط¯ظ‰ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظپظˆط±ظٹط§ظ‹.`, "warning");

    try {
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_CHANGE', date: d, isApproved: false });
      }
      if (realtimeShiftChannel) {
        realtimeShiftChannel.send({
          type: 'broadcast',
          event: 'DAILY_SHIFT_CHANGE',
          payload: { date: d, isApproved: false, managerId: currentCenterId, updatedAt: new Date().toISOString() }
        });
      }
      if (supabase) {
        const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = curSettings?.config || {};
        cfg.daily_approval_map = dailyApprovalMap;
        cfg.last_shift_update = Date.now();

        await supabase.from('settings').update({
          daily_shift_status: 'closed',
          daily_approved_by: managerName,
          config: cfg,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      }
    } catch(e) {
      console.error("Shift close error:", e);
    }
  }
}
window.toggleDailyApproval = toggleDailyApproval;

export async function confirmRejectDailyShift() {
  const note = (document.getElementById("dailyRejectReasonInput")?.value || "").trim();
  const d = document.getElementById("adminDailyDateInput")?.value || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  if (!note) return showToast("ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ط³ط¨ط¨ طھط¹ظ„ظٹظ‚ ط£ظˆ ط±ظپط¶ ط§ظ„ظٹظˆظ…ظٹط©", "err");
  
  dailyShiftStatus = 'closed';
  dailyApprovalMap[d] = {
    status: 'pending',
    reason: note,
    locked_at: new Date().toISOString(),
    locked_by: localStorage.getItem("ca_admin_username") || "Ahmed Qutb"
  };
  localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));
  window.renderDailyApprovalWidget(d);
  document.getElementById("rejectNoteBox")?.classList.add("hidden");
  showToast(`طھظ… طھط¹ظ„ظٹظ‚ ظٹظˆظ…ظٹط© (${d}) ظˆط¥ط±ط³ط§ظ„ ط§ظ„ظ…ظ„ط§ط­ط¸ط© ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†`, "warning");

  try {
    if (permChannel) {
      permChannel.postMessage({ type: 'DAILY_SHIFT_CHANGE', date: d, isApproved: false, reason: note });
    }
    if (realtimeShiftChannel) {
      realtimeShiftChannel.send({
        type: 'broadcast',
        event: 'DAILY_SHIFT_CHANGE',
        payload: { date: d, isApproved: false, reason: note, managerId: currentCenterId, updatedAt: new Date().toISOString() }
      });
    }
    if (supabase) {
      const { data: cur } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
      const cfg = cur?.config || {};
      cfg.daily_approval_map = dailyApprovalMap;
      cfg.last_shift_update = Date.now();
      await supabase.from('settings').update({
        daily_shift_status: note || 'closed',
        config: cfg,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
    }
  } catch(e) { console.error(e); }
}
window.confirmRejectDailyShift = confirmRejectDailyShift;

export function loadDailyReport(dateStr) {
  const d = dateStr || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  
  if (typeof window.renderDailyApprovalWidget === 'function') {
    window.renderDailyApprovalWidget(d);
  }

  const ids = (attByDate && attByDate[d]) ? attByDate[d] : [];
  const sessList = (sessionStudentsByDate && sessionStudentsByDate[d]) ? sessionStudentsByDate[d] : [];
  const rev = (revenueByDate && revenueByDate[d]) ? revenueByDate[d] : 0;
  let expArr = [];
  if (Array.isArray(expensesByDate)) {
    expArr = expensesByDate.filter(e => e && e.date === d);
  } else if (expensesByDate && typeof expensesByDate === 'object') {
    expArr = Array.isArray(expensesByDate[d]) ? expensesByDate[d] : [];
  }
  const sessCount = (typeof window.getAdminUniqueSessionStudentsCount === 'function') ? window.getAdminUniqueSessionStudentsCount() : 0;
  const totalSt = Object.keys(students || {}).length + sessCount;
  let totalExp = 0;
  expArr.forEach(e => totalExp += (Number(e && e.amount) || 0));

  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";

  // Update Stat Cards (Regular students + Session students)
  const statAttend = document.getElementById("statDailyAttend");
  const statRev = document.getElementById("statDailyRevenue");
  const statAbsent = document.getElementById("statDailyAbsent");
  const statExp = document.getElementById("statDailyExpenses");

  const totalAttended = ids.length + sessList.length;
  if (statAttend) statAttend.textContent = totalAttended;
  if (statRev) statRev.textContent = rev.toLocaleString() + currencySuffix;
  if (statAbsent) statAbsent.textContent = Math.max(0, totalSt - totalAttended);
  if (statExp) statExp.textContent = totalExp.toLocaleString() + currencySuffix;

  // Render Groups Breakdown
  const body = document.getElementById("dailyGroupsBreakdown");
  if (body) {
    if (ids.length === 0 && sessList.length === 0 && expArr.length === 0) {
      body.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 24px;">${isAr ? `ظ„ط§ طھظˆط¬ط¯ ط¨ظٹط§ظ†ط§طھ ظ…ط³ط¬ظ„ط© ظ„ظ‡ط°ط§ ط§ظ„طھط§ط±ظٹط® (${d})` : `No data recorded for this date (${d})`}</div>`;
    } else {
      let groups = {};
      ids.forEach(id => {
        const st = (students && students[id]) ? students[id] : null;
        const cls = (st && st.className && st.className !== 'ط¹ط§ظ…' && st.className !== 'Without Package') ? st.className.trim() : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package");
        if (!groups[cls]) groups[cls] = { count: 0, revenue: 0 };
        groups[cls].count++;
        if (st && st.paid !== undefined) {
          const p = (packages && packages[cls]) ? packages[cls] : null;
          let req = p ? p.price : 0;
          if (req > 0) groups[cls].revenue += req;
        }
      });

      // Add session students to groups breakdown
      sessList.forEach(sSt => {
        const defaultSessLabel = "";
        const rawCls = (sSt && sSt.className) ? sSt.className.trim() : defaultSessLabel;
        const grpKey = rawCls.includes("ط­طµط©") || rawCls.includes("Session") ? rawCls : `${rawCls} (${defaultSessLabel})`;
        if (!groups[grpKey]) groups[grpKey] = { count: 0, revenue: 0 };
        groups[grpKey].count++;
        groups[grpKey].revenue += (Number(sSt.amount) || 0);
      });

      let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">';
      for (const g in groups) {
        html += `
          <div style="background: var(--bg-inset); border: 1px solid var(--border); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 700; color: var(--primary); font-size: 1.05em;">${g}</span>
              <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'ط¥ظٹط±ط§ط¯ طھظ‚ط¯ظٹط±ظٹ:' : 'Estimated Revenue:'} ${groups[g].revenue} ${currencySuffix}</div>
            </div>
            <span style="background: var(--gradient-subtle); color: var(--primary); font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 0.9em;">
              ${groups[g].count} ${isAr ? 'ط·ط§ظ„ط¨' : 'Students'}
            </span>
          </div>
        `;
      }
      html += '</div>';
      body.innerHTML = html;
    }
  }

  // Render Expenses Breakdown
  const expBody = document.getElementById("dailyExpensesBreakdown");
  if (expBody) {
    if (expArr.length > 0) {
      let expHtml = `<h4 style="color: var(--danger); font-size: 0.95em; margin-bottom: 10px; font-weight: 700;"><i class="fa-solid fa-receipt"></i> ${isAr ? 'ظ…طµط±ظˆظپط§طھ ط§ظ„ظٹظˆظ…:' : "Today's Expenses:"}</h4>`;
      expHtml += '<div style="display: flex; flex-direction: column; gap: 8px;">';
      expArr.forEach(e => {
        expHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; background: var(--bg-danger-subtle); border: 1px solid rgba(239,68,68,0.2); padding: 8px 14px; border-radius: 8px; font-size: 0.88em;">
            <span>${e.reason || (isAr ? "ظ…طµط±ظˆظپ" : "Expense")}</span>
            <b style="color: var(--danger); font-size: 1.05em;">${e.amount} ${currencySuffix}</b>
          </div>
        `;
      });
      expHtml += '</div>';
      expBody.innerHTML = expHtml;
    } else {
      expBody.innerHTML = '';
    }
  }
}
window.loadDailyReport = loadDailyReport;


// ========================================================
// 5. TERM FINANCIAL REPORT
// ========================================================
window.currentTxFilter = 'all';

window.filterTransactions = function(filter) {
  window.currentTxFilter = filter || 'all';
  document.querySelectorAll(".tx-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.txFilter === window.currentTxFilter);
  });
  window.renderTermTransactionsTable();
};

window.renderTermTransactionsTable = function() {
  const tbody = document.getElementById("termTransactionsTableBody");
  if (!tbody) return;

  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";
  const list = Array.isArray(expensesByDate) ? [...expensesByDate] : [];

  list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const filtered = list.filter(item => {
    if (!item) return false;
    const isWd = (item.type === 'withdrawal' || item.isWithdrawal);
    if (window.currentTxFilter === 'expense') return !isWd;
    if (window.currentTxFilter === 'withdrawal') return isWd;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ ظ…ط³ط¬ظ„ط©" : "No recorded transactions"}</td></tr>`;
    return;
  }

  const methodLabels = {
    cash: { ar: "ط¯ط±ط¬ ط§ظ„ظƒط§ط´", en: "Cash Drawer", icon: "fa-money-bill-wave", color: "#10b981" },
    wallet: { ar: "ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´", en: "Vodafone Cash", icon: "fa-wallet", color: "#ef4444" },
    instapay: { ar: "ط¥ظ†ط³طھط§ط¨ط§ظٹ", en: "InstaPay", icon: "fa-mobile-screen-button", color: "#0284c7" }
  };

  let html = "";
  filtered.forEach((item, idx) => {
    const isWd = (item.type === 'withdrawal' || item.isWithdrawal);
    const mInfo = methodLabels[item.method || 'cash'] || methodLabels.cash;
    const typeBadge = isWd 
      ? `<span class="badge-withdrawal"><i class="fa-solid fa-hand-holding-dollar"></i> ${isAr ? "ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط±" : "Owner Withdrawal"}</span>`
      : `<span class="badge-expense"><i class="fa-solid fa-receipt"></i> ${isAr ? "ظ…طµط±ظˆظپ ط³ظ†طھط±" : "Center Expense"}</span>`;
    
    const methodBadge = `<span class="badge-treasury" style="color:${mInfo.color};"><i class="fa-solid ${mInfo.icon}"></i> ${isAr ? mInfo.ar : mInfo.en}</span>`;
    const amtColor = isWd ? "#f59e0b" : "#ef4444";
    const rawId = item.id || String(item.timestamp || idx);

    html += `
      <tr>
        <td style="font-weight:700; white-space:nowrap;">${item.date || 'â€”'}</td>
        <td>${typeBadge}</td>
        <td style="font-weight:700; color:var(--text-primary);">${item.reason || 'â€”'}</td>
        <td>${methodBadge}</td>
        <td style="font-weight:900; color:${amtColor}; white-space:nowrap;">${Number(item.amount || 0).toLocaleString()} ${currencySuffix}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
};

window.renderTermTable = function() {
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";
  const search = (document.getElementById("termSearchInput")?.value || "").toLowerCase().trim();
  const clsFilter = document.getElementById("termClassFilter")?.value || "";
  const tbody = document.getElementById("termReportTableBody");
  const clsSel = document.getElementById("termClassFilter");

  // Populate classes
  if (clsSel) {
    const existing = [...clsSel.options].map(o => o.value);
    const sessClasses = (typeof window.getAdminUniqueSessionStudents === 'function') ? window.getAdminUniqueSessionStudents().map(s => s.className || "") : [];
    const classes = [...new Set([...Object.values(students).map(s => (s.className && s.className !== 'ط¹ط§ظ…' && s.className !== 'Without Package') ? s.className : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package")), ...sessClasses])];
    classes.forEach(c => {
      if (!existing.includes(c)) {
        const opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        clsSel.appendChild(opt);
      }
    });
  }

  // 1. Calculate Student Revenue, Debts & Treasuries Inflow
  let totalRev = 0, totalDebt = 0, totalDiscounts = 0, matchCount = 0;
  let cashIn = 0, walletIn = 0, instapayIn = 0;
  let regCash = 0, regWallet = 0, regInstapay = 0;
  let sessCash = 0, sessWallet = 0, sessInstapay = 0;
  let bklCash = 0, bklWallet = 0, bklInstapay = 0;
  let rowsHtml = "";

  Object.values(students).forEach(st => {
    if (!st || !st.name) return;

    // Track Payments into Treasuries (all enrolled students)
    if (st.payments && Array.isArray(st.payments) && st.payments.length > 0) {
      st.payments.forEach(p => {
        const pAmt = Number(p.amount) || 0;
        const pMethod = p.method || 'cash';
        if (pMethod === 'cash') { cashIn += pAmt; regCash += pAmt; }
        else if (pMethod === 'wallet') { walletIn += pAmt; regWallet += pAmt; }
        else if (pMethod === 'instapay') { instapayIn += pAmt; regInstapay += pAmt; }
        else { cashIn += pAmt; regCash += pAmt; }
      });
    } else if (Number(st.paid) > 0) {
      const pAmt = Number(st.paid) || 0;
      const pMethod = st.paymentPlan || 'cash';
      if (pMethod === 'cash') { cashIn += pAmt; regCash += pAmt; }
      else if (pMethod === 'wallet') { walletIn += pAmt; regWallet += pAmt; }
      else if (pMethod === 'instapay') { instapayIn += pAmt; regInstapay += pAmt; }
      else { cashIn += pAmt; regCash += pAmt; }
    }

    if (search && !st.name.toLowerCase().includes(search) && !String(st.id).includes(search)) return;
    const cls = (st.className && st.className !== 'ط¹ط§ظ…' && st.className !== 'Without Package') ? st.className.trim() : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package");
    if (clsFilter && cls !== clsFilter) return;

    matchCount++;
    let req = 0;
    const pkgKeys = Object.keys(packages || {});
    const normName = str => String(str || '').replace(/^ط¨ط§ظ‚ط©\s+/, '').trim().toLowerCase();

    // Look for matching package price in packages object or groupFees
    const getPriceForPkg = (candidate) => {
      if (!candidate) return 0;
      const clean = normName(candidate);
      if (packages[candidate]) return Number(packages[candidate].price) || 0;
      if (groupFees[candidate]) return typeof groupFees[candidate] === 'object' ? (Number(groupFees[candidate].price) || 0) : (Number(groupFees[candidate]) || 0);
      for (const pk in packages) {
        if (normName(pk) === clean) return Number(packages[pk].price) || 0;
      }
      for (const gk in groupFees) {
        if (normName(gk) === clean) {
          return typeof groupFees[gk] === 'object' ? (Number(groupFees[gk].price) || 0) : (Number(groupFees[gk]) || 0);
        }
      }
      return 0;
    };

    const stPkgs = (Array.isArray(st.packages) && st.packages.length > 0) 
      ? st.packages.filter(p => p && p !== 'ط¹ط§ظ…' && p !== 'Without Package' && p !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && p !== 'Without Package') 
      : (cls && cls !== 'ط¹ط§ظ…' && cls !== 'Without Package' && cls !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && cls !== 'Without Package' ? [cls] : []);
    const checked = new Set();
    stPkgs.forEach(pName => {
      const clean = normName(pName);
      if (!clean || checked.has(clean)) return;
      checked.add(clean);
      req += getPriceForPkg(pName);
    });
    
    const paid = Number(st.paid) || 0;
    const discount = Number(st.discount) || 0;
    const debt = Math.max(0, req - paid - discount);
    
    // Attendance count
    const attCount = (st.attendanceDates && st.attendanceDates.length > 0) 
      ? st.attendanceDates.length 
      : Object.values(attByDate).reduce((acc, list) => acc + (list.includes(String(st.id)) ? 1 : 0), 0);

    totalRev += paid;
    totalDebt += debt;
    totalDiscounts += discount;

    const discountBadge = discount > 0 
      ? `<span style="display:inline-block; font-size:0.75em; background:rgba(245,158,11,0.15); color:#F59E0B; padding:1px 5px; border-radius:4px; margin-inline-start:4px;">(${isAr ? 'ط®طµظ… ' + discount + ' ط¬' : 'Disc. ' + discount + ' EGP'})</span>`
      : '';
    const statusText = debt > 0 
      ? (debt + currencySuffix) 
      : `<span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.85em; padding:3px 8px; border-radius:6px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${isAr ? "ط®ط§ظ„طµ" : "Paid"}</span>`;
    const profileBtnText = isAr ? "ظ…ظ„ظپ ط§ظ„ط·ط§ظ„ط¨" : "Profile";

    rowsHtml += `
      <tr>
        <td style="font-weight: 700;">${st.name} <span style="font-size:0.8em; color:var(--text-secondary);">(#${st.id})</span></td>
        <td><span style="background:var(--gradient-subtle); color:var(--primary); font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${cls}</span></td>
        <td>${req > 0 ? (req + currencySuffix) : "â€”"}</td>
        <td style="color:var(--success); font-weight:700;">
          ${paid > 0 ? (paid + currencySuffix) : ("0" + currencySuffix)}
          ${discountBadge}
        </td>
        <td style="color:${debt > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:700;">${statusText}</td>
        <td style="font-weight:700;">${attCount}</td>
        <td>
          <a href="../assistant/index.html?openId=${st.id}" target="_blank" style="text-decoration:none;" class="btn secondary smallBtn">
            <i class="fa-solid fa-folder-open"></i> ${profileBtnText}
          </a>
        </td>
      </tr>
    `;
  });

  // 1b. Render Session Students in Term Table
  if (typeof window.getAdminUniqueSessionStudents === 'function') {
    const sessList = window.getAdminUniqueSessionStudents();
    sessList.forEach(sSt => {
      const sCls = sSt.className || "";
      if (search && !sSt.name.toLowerCase().includes(search) && !(isAr ? "ط·ط§ظ„ط¨ ط­طµط©" : "session").toLowerCase().includes(search)) return;
      if (clsFilter && sCls !== clsFilter) return;

      matchCount++;

      rowsHtml += `
        <tr style="background: rgba(59, 130, 246, 0.02);">
          <td style="font-weight: 700;">
            ${sSt.name} 
            <span class="badge" style="background:rgba(59,130,246,0.12); color:#2563eb; border:1px solid rgba(59,130,246,0.3); font-weight:700; font-size:0.75em; padding:2px 6px; border-radius:4px; margin-inline-start:4px; display:inline-flex; align-items:center; gap:3px;">
              <i class="fa-solid fa-user-clock"></i> ${isAr ? "ط·ط§ظ„ط¨ ط­طµط©" : "Session"}
            </span>
          </td>
          <td><span style="background:rgba(59,130,246,0.1); color:#2563eb; font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${sCls}</span></td>
          <td>${sSt.totalPaid > 0 ? (sSt.totalPaid + currencySuffix) : "â€”"}</td>
          <td style="color:var(--success); font-weight:700;">
            ${sSt.totalPaid + currencySuffix}
          </td>
          <td style="color:var(--success); font-weight:700;">
            <span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.85em; padding:3px 8px; border-radius:6px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${isAr ? "ط®ط§ظ„طµ" : "Paid"}</span>
          </td>
          <td style="font-weight:700;">${sSt.attCount}</td>
          <td>
            <span class="badge" style="background:var(--bg-inset); color:var(--text-secondary); border:1px solid var(--border); padding:4px 8px; border-radius:6px; font-size:0.82em;">
              <i class="fa-solid fa-clock-rotate-left"></i> ${sSt.date || "â€”"}
            </span>
          </td>
        </tr>
      `;
    });
  }

  // 2. Add Session Students Inflow to Treasuries
  for (const d in sessionStudentsByDate) {
    const sList = sessionStudentsByDate[d] || [];
    sList.forEach(it => {
      const amt = Number(it.amount) || 0;
      const m = it.method || 'cash';
      if (m === 'cash') { cashIn += amt; sessCash += amt; }
      else if (m === 'wallet') { walletIn += amt; sessWallet += amt; }
      else if (m === 'instapay') { instapayIn += amt; sessInstapay += amt; }
      else { cashIn += amt; sessCash += amt; }
      totalRev += amt;
    });
  }

  // 2b. Add Booklet Inventory Sales Inflow
  let totalBookletSales = 0;
  Object.values(booklets || {}).forEach(b => {
    const soldQty = Number(b.sold) || 0;
    const price = Number(b.price) || 0;
    const bRev = soldQty * price;
    if (bRev > 0) {
      totalBookletSales += bRev;
      bklCash += bRev;
      cashIn += bRev;
      totalRev += bRev;
    }
  });

  // Store global financial breakdown for the detailed modal
  window.financialBreakdownData = {
    regCash, regInstapay, regWallet,
    regTotal: regCash + regInstapay + regWallet,
    sessCash, sessInstapay, sessWallet,
    sessTotal: sessCash + sessInstapay + sessWallet,
    bklCash, bklInstapay, bklWallet,
    bklTotal: totalBookletSales,
    grandTotal: totalRev,
    totalCash: cashIn,
    totalInstapay: instapayIn,
    totalWallet: walletIn,
    currencySuffix: currencySuffix
  };

  // 3. Process Expenses & Withdrawals
  let totalExpenses = 0;
  let totalWithdrawals = 0;
  let cashOut = 0, walletOut = 0, instapayOut = 0;

  const txList = Array.isArray(expensesByDate) ? expensesByDate : [];
  txList.forEach(e => {
    if (!e) return;
    const amt = Number(e.amount) || 0;
    const m = e.method || 'cash';
    const isWd = (e.type === 'withdrawal' || e.isWithdrawal);

    if (isWd) {
      totalWithdrawals += amt;
    } else {
      totalExpenses += amt;
    }

    if (m === 'cash') cashOut += amt;
    else if (m === 'wallet') walletOut += amt;
    else if (m === 'instapay') instapayOut += amt;
    else cashOut += amt;
  });

  // 4. Balances Calculations with Inter-Vault Transfers
  let cashTransfersIn = 0, cashTransfersOut = 0;
  let walletTransfersIn = 0, walletTransfersOut = 0;
  let instapayTransfersIn = 0, instapayTransfersOut = 0;

  (vaultTransfers || []).forEach(tr => {
    if (!tr) return;
    const amt = Number(tr.amount) || 0;
    if (tr.from_vault === 'cash') cashTransfersOut += amt;
    if (tr.to_vault === 'cash') cashTransfersIn += amt;

    if (tr.from_vault === 'wallet') walletTransfersOut += amt;
    if (tr.to_vault === 'wallet') walletTransfersIn += amt;

    if (tr.from_vault === 'instapay') instapayTransfersOut += amt;
    if (tr.to_vault === 'instapay') instapayTransfersIn += amt;
  });

  const cashBalance = cashIn - cashOut + (cashTransfersIn - cashTransfersOut);
  const walletBalance = walletIn - walletOut + (walletTransfersIn - walletTransfersOut);
  const instapayBalance = instapayIn - instapayOut + (instapayTransfersIn - instapayTransfersOut);
  const netVaultBalance = cashBalance + walletBalance + instapayBalance;

  window.vaultLiveBalances = {
    cash: cashBalance,
    wallet: walletBalance,
    instapay: instapayBalance,
    cashIn, walletIn, instapayIn,
    cashOut, walletOut, instapayOut
  };

  // 5. Update KPI Cards
  const statTermSt = document.getElementById("statTermStudents");
  const statTermRev = document.getElementById("statTermRevenue");
  const statTermExp = document.getElementById("statTermExpenses");
  const statTermWd = document.getElementById("statTermWithdrawals");
  const statTermNet = document.getElementById("statTermNetVault");
  const statTermDbt = document.getElementById("statTermDebt");
  const statTermDisc = document.getElementById("statTermTotalDiscounts");

  if (statTermSt) statTermSt.textContent = matchCount;
  if (statTermRev) statTermRev.textContent = totalRev.toLocaleString() + currencySuffix;
  if (statTermExp) statTermExp.textContent = totalExpenses.toLocaleString() + currencySuffix;
  if (statTermWd) statTermWd.textContent = totalWithdrawals.toLocaleString() + currencySuffix;
  if (statTermNet) statTermNet.textContent = netVaultBalance.toLocaleString() + currencySuffix;
  if (statTermDbt) statTermDbt.textContent = totalDebt.toLocaleString() + currencySuffix;
  if (statTermDisc) statTermDisc.textContent = totalDiscounts.toLocaleString() + currencySuffix;

  // 6. Update Treasuries Cards
  if (document.getElementById("termCashIn")) document.getElementById("termCashIn").textContent = cashIn.toLocaleString() + currencySuffix;
  if (document.getElementById("termCashOut")) document.getElementById("termCashOut").textContent = cashOut.toLocaleString() + currencySuffix;
  if (document.getElementById("termCashBalance")) document.getElementById("termCashBalance").textContent = cashBalance.toLocaleString() + currencySuffix;

  if (document.getElementById("termWalletIn")) document.getElementById("termWalletIn").textContent = walletIn.toLocaleString() + currencySuffix;
  if (document.getElementById("termWalletOut")) document.getElementById("termWalletOut").textContent = walletOut.toLocaleString() + currencySuffix;
  if (document.getElementById("termWalletBalance")) document.getElementById("termWalletBalance").textContent = walletBalance.toLocaleString() + currencySuffix;

  if (document.getElementById("termInstapayIn")) document.getElementById("termInstapayIn").textContent = instapayIn.toLocaleString() + currencySuffix;
  if (document.getElementById("termInstapayOut")) document.getElementById("termInstapayOut").textContent = instapayOut.toLocaleString() + currencySuffix;
  if (document.getElementById("termInstapayBalance")) document.getElementById("termInstapayBalance").textContent = instapayBalance.toLocaleString() + currencySuffix;

  // 7. Render Student Table
  if (tbody) {
    tbody.innerHTML = rowsHtml || `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ظ†طھط§ط¦ط¬ ظ…ط·ط§ط¨ظ‚ط©" : "No matching records found"}</td></tr>`;
  }

  // 8. Render Transactions Table
  window.renderTermTransactionsTable();
};

// ========================================================
// 6. ASSISTANTS MANAGEMENT & INSTANT PERMISSIONS
// ========================================================
window.fetchAssistants = async function() {
  const listEl = document.getElementById("adminAssistantsList");
  if (!listEl) return;
  if (!supabase) return;

  const isAr = (currentLang === "ar");
  listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "ط¬ط§ط±ظٹ ط¬ظ„ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ..." : "Loading assistants & permissions..."}</div>`;

  try {
    const { data: assistants, error } = await supabase
      .from('assistants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Cache assistants for instant lookup
    window.cachedAssistants = assistants || [];

    if (!assistants || assistants.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border);">
          <i class="fa-solid fa-users-slash" style="font-size: 2.5em; margin-bottom: 12px; opacity: 0.5;"></i>
          <p style="font-size: 1.1em; font-weight: 700;">${isAr ? "ظ„ط§ ظٹظˆط¬ط¯ ظ…ط³ط§ط¹ط¯ظٹظ† ظ…ط³ط¬ظ„ظٹظ† ط¨ط¹ط¯" : "No assistants registered yet"}</p>
          <p style="font-size: 0.85em; margin-top: 4px;">${isAr ? 'ط§ط¶ط؛ط· ط¹ظ„ظ‰ "ط¥ط¶ط§ظپط© ظ…ط³ط§ط¹ط¯ ط¬ط¯ظٹط¯" ظ„ط¥ظ†ط´ط§ط، ط£ظˆظ„ ط­ط³ط§ط¨ ظˆطھط­ط¯ظٹط¯ طµظ„ط§ط­ظٹط§طھظ‡.' : 'Click "Add New Assistant" to create the first account and configure permissions.'}</p>
        </div>
      `;
      return;
    }

    let html = "";
    assistants.forEach(asst => {
      const uName = asst.username;
      const pass = (asst.password || '').replace(/'/g, "\\'");
      const initial = (uName[0] || "A").toUpperCase();
      const dateLocale = isAr ? "ar-EG" : "en-US";
      const createdAt = asst.created_at ? new Date(asst.created_at).toLocaleDateString(dateLocale) : "â€”";
      const asstPerms = asst.permissions || {};

      // Render Permission Groups
      let groupsHtml = "";
      PERM_GROUPS.forEach(grp => {
        const itemsInGroup = PERMISSIONS_DEFS.filter(p => p.group === grp.id);
        const groupTitle = typeof grp.title === 'object' ? (grp.title[currentLang] || grp.title.ar) : grp.title;
        groupsHtml += `
          <div class="perm-group-box">
            <div class="perm-group-title">
              <i class="fa-solid ${grp.icon}"></i> ${groupTitle}
            </div>
            <div class="perm-items-grid">
        `;

        itemsInGroup.forEach(p => {
          const isChecked = asstPerms[p.key] !== false; // default true if not set
          const pLabel = typeof p.label === 'object' ? (p.label[currentLang] || p.label.ar) : p.label;
          const pDesc = typeof p.desc === 'object' ? (p.desc[currentLang] || p.desc.ar) : p.desc;
          groupsHtml += `
            <div class="perm-item-premium">
              <i class="fa-solid ${p.icon} perm-icon"></i>
              <div class="perm-text">
                <span class="perm-text-title">${pLabel}</span>
                <span class="perm-text-desc">${pDesc}</span>
              </div>
              <label class="ios-toggle">
                <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.togglePermission('${uName}', '${p.key}', this.checked)">
                <span class="ios-slider"></span>
              </label>
            </div>
          `;
        });

        groupsHtml += `</div></div>`;
      });

      html += `
        <div class="assistant-card" id="asstCard_${uName}">
          <div class="asst-header">
            <div class="asst-user-info">
              <div class="asst-avatar">${initial}</div>
              <div class="asst-details">
                <h3>${uName}</h3>
                <span>${isAr ? "طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،:" : "Created:"} ${createdAt}</span>
              </div>
            </div>
            <div class="asst-actions">
              <button class="btn secondary smallBtn" onclick="window.openEditAssistantPasswordModal('${uName}', '${pass}')">
                <i class="fa-solid fa-key"></i> ${isAr ? "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" : "Password"}
              </button>
              <button class="btn danger smallBtn" onclick="window.deleteAssistant('${uName}')">
                <i class="fa-solid fa-trash"></i> ${isAr ? "ط­ط°ظپ" : "Delete"}
              </button>
            </div>
          </div>

          <div style="margin-top: 14px;">
            ${groupsHtml}
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

  } catch(err) {
    console.error("Fetch Assistants Error:", err);
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center; padding:20px;">${currentLang === 'ar' ? 'ظپط´ظ„ طھط­ظ…ظٹظ„ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†:' : 'Failed to load assistants:'} ${err.message}</div>`;
  }
};

// INSTANT PERMISSION TOGGLER WITH REAL-TIME BROADCAST
window.togglePermission = async function(username, permKey, isAllowed) {
  if (!supabase) return;
  try {
    // 1. Fetch current permissions
    const { data: asst } = await supabase
      .from('assistants')
      .select('permissions')
      .eq('username', username)
      .single();

    const perms = asst ? (asst.permissions || {}) : {};
    perms[permKey] = isAllowed;

    // 2. Save in Supabase
    await supabase
      .from('assistants')
      .update({ permissions: perms })
      .eq('username', username);

    // 3. BROADCAST IMMEDIATELY (Instant sync to any open assistant tabs in < 5ms)
    if (permChannel) {
      permChannel.postMessage({
        type: 'PERMISSIONS_UPDATED',
        username: username,
        permissions: perms,
        changedKey: permKey,
        newValue: isAllowed
      });
    }

    localStorage.setItem(`ca_asst_permissions_${username}`, JSON.stringify(perms));
    localStorage.setItem("ca_asst_permissions", JSON.stringify(perms));

    const statusText = isAllowed ? 'طھظپط¹ظٹظ„' : 'طھط¹ط·ظٹظ„';
    const permName = getPermissionTitle(permKey);
    const msgText = `طھظ… ${statusText} طµظ„ط§ط­ظٹط© آ«${permName}آ» ظ„ظ„ظ…ط³ط§ط¹ط¯ ${username}.`;
    if (typeof window.createNotification === 'function') {
      window.createNotification(msgText, isAllowed ? 'info' : 'warning');
    }

    showToast(`طھظ… ${statusText} طµظ„ط§ط­ظٹط© آ«${permName}آ» ظ„ظ„ظ…ط³ط§ط¹ط¯ ${username} ط¨ظ†ط¬ط§ط­`, "success");

  } catch(err) {
    console.error("Toggle Permission Error:", err);
    showToast("ظپط´ظ„ طھط­ط¯ظٹط« ط§ظ„طµظ„ط§ط­ظٹط© ظپظٹ ط§ظ„ط³ط­ط§ط¨ط©", "err");
  }
};

window.openAddAssistantModal = function() {
  const m = document.getElementById("addAssistantModal");
  if (m) {
    m.classList.remove("hidden");
    if (typeof window.applyAdminLanguage === "function") window.applyAdminLanguage();
    const uInp = document.getElementById("newAsstUsernameInput");
    const pInp = document.getElementById("newAsstPasswordInput");
    if (uInp) {
      uInp.value = "";
      setTimeout(() => uInp.focus(), 50);
    }
    if (pInp) {
      pInp.value = "";
      pInp.type = "password";
      const eyeIcon = document.getElementById("asstPassEyeIcon");
      if (eyeIcon) {
        eyeIcon.className = "fa-regular fa-eye";
      }
    }
    window.updateAsstPreview();
  }
};

window.closeAddAssistantModal = function() {
  const m = document.getElementById("addAssistantModal");
  if (m) m.classList.add("hidden");
};

window.toggleNewAsstPassword = function() {
  const passInp = document.getElementById("newAsstPasswordInput");
  const eyeIcon = document.getElementById("asstPassEyeIcon");
  if (!passInp) return;
  if (passInp.type === "password") {
    passInp.type = "text";
    if (eyeIcon) eyeIcon.className = "fa-regular fa-eye-slash";
  } else {
    passInp.type = "password";
    if (eyeIcon) eyeIcon.className = "fa-regular fa-eye";
  }
};

window.updateAsstPreview = function() {
  const uInp = document.getElementById("newAsstUsernameInput");
  const previewEl = document.getElementById("asstEmailPreviewText");
  if (!previewEl) return;
  let val = uInp ? uInp.value.trim().toLowerCase() : "";
  val = val.replace(/@studify\.com$/i, '').trim();
  previewEl.textContent = (val || "username") + "@studify.com";
};

window.submitNewAssistant = async function() {
  const uInp = document.getElementById("newAsstUsernameInput");
  const pInp = document.getElementById("newAsstPasswordInput");
  const btn = document.getElementById("submitNewAssistantBtn");

  let u = uInp ? uInp.value.trim().toLowerCase() : "";
  u = u.replace(/@studify\.com$/i, '').trim();
  const p = pInp ? pInp.value.trim() : "";

  if (!u || !p) return showToast("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظˆظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", "err");
  if (!/^[a-z0-9_]+$/.test(u)) return showToast("ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظٹط¬ط¨ ط£ظ† ظٹط­طھظˆظٹ ط¹ظ„ظ‰ ط­ط±ظˆظپ ط¥ظ†ط¬ظ„ظٹط²ظٹط© طµط؛ظٹط±ط© ظˆط£ط±ظ‚ط§ظ… ظپظ‚ط· ط¨ط¯ظˆظ† ظ…ط³ط§ظپط§طھ", "err");

  // Check assistant plan limit before adding
  if (typeof window.checkAssistantLimit === 'function') {
    const canAdd = await window.checkAssistantLimit();
    if (!canAdd) return;
  }

  try {
    if (!supabase) return showToast("ظپط´ظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط³ط­ط§ط¨ط©", "err");

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ط¬ط§ط±ظٹ ط§ظ„ط¥ظ†ط´ط§ط،...';
    }
    
    // Default all permissions to true initially
    const initialPerms = {};
    PERMISSIONS_DEFS.forEach(def => { initialPerms[def.key] = true; });

    const fullEmail = `${u}@studify.com`;

    const { error } = await supabase.from('assistants').insert([{
      username: u,
      email: fullEmail,
      password: p,
      permissions: initialPerms
    }]);

    if (error) {
      if (error.code === '23505') throw new Error("ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظ…ط­ط¬ظˆط² ظ…ط³ط¨ظ‚ط§ظ‹طŒ ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط§ط³ظ… ط¢ط®ط±.");
      throw error;
    }

    showToast("طھظ… ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­", "success");
    if (uInp) uInp.value = "";
    if (pInp) pInp.value = "";
    window.closeAddAssistantModal();
    window.fetchAssistants();

  } catch(err) {
    console.error("Submit New Assistant Error:", err);
    showToast(err.message || "ظپط´ظ„ ط¥ط¶ط§ظپط© ط§ظ„ظ…ط³ط§ط¹ط¯", "err");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨';
    }
  }
};

// ========================================================
// LUXURY EDIT ASSISTANT PASSWORD MODAL CONTROLLERS
// ========================================================
let activeEditingAssistant = null;

window.openEditAssistantPasswordModal = async function(username, currentPass) {
  activeEditingAssistant = username;

  // If currentPass not passed or empty, look up from cache or fetch from Supabase
  let passVal = currentPass || '';
  if (!passVal && window.cachedAssistants) {
    const found = window.cachedAssistants.find(a => a.username === username);
    if (found) passVal = found.password || '';
  }
  if (!passVal && supabase) {
    try {
      const { data } = await supabase.from('assistants').select('password').eq('username', username).single();
      if (data) passVal = data.password || '';
    } catch(e) {
      console.warn("Could not fetch old pass:", e);
    }
  }

  const modal = document.getElementById("editAssistantPasswordModal");
  const userEl = document.getElementById("editAsstModalUsername");
  const currPassInp = document.getElementById("editAsstCurrentPasswordInput");
  const newPassInp = document.getElementById("editAsstNewPasswordInput");

  if (userEl) userEl.textContent = username;
  if (currPassInp) {
    currPassInp.value = passVal || "â€¢â€¢â€¢â€¢â€¢â€¢";
    currPassInp.type = "password";
  }
  const oldIcon = document.getElementById("oldPassEyeIcon");
  if (oldIcon) oldIcon.className = "fa-regular fa-eye";

  if (newPassInp) {
    newPassInp.value = "";
    newPassInp.type = "password";
  }
  const newIcon = document.getElementById("newPassEyeIcon");
  if (newIcon) newIcon.className = "fa-regular fa-eye";

  if (modal) {
    modal.classList.remove("hidden");
    if (typeof window.applyAdminLanguage === "function") window.applyAdminLanguage();
  }
};

window.closeEditAssistantPasswordModal = function() {
  const modal = document.getElementById("editAssistantPasswordModal");
  if (modal) modal.classList.add("hidden");
  activeEditingAssistant = null;
};

window.toggleOldPasswordVisibility = function() {
  const inp = document.getElementById("editAsstCurrentPasswordInput");
  const icon = document.getElementById("oldPassEyeIcon");
  if (!inp || !icon) return;

  if (inp.type === "password") {
    inp.type = "text";
    icon.className = "fa-regular fa-eye-slash";
  } else {
    inp.type = "password";
    icon.className = "fa-regular fa-eye";
  }
};

window.toggleNewPasswordVisibility = function() {
  const inp = document.getElementById("editAsstNewPasswordInput");
  const icon = document.getElementById("newPassEyeIcon");
  if (!inp || !icon) return;

  if (inp.type === "password") {
    inp.type = "text";
    icon.className = "fa-regular fa-eye-slash";
  } else {
    inp.type = "password";
    icon.className = "fa-regular fa-eye";
  }
};

window.copyCurrentAssistantPassword = function() {
  const inp = document.getElementById("editAsstCurrentPasswordInput");
  if (!inp || !inp.value) return;

  navigator.clipboard.writeText(inp.value).then(() => {
    showToast(currentLang === 'ar' ? "طھظ… ظ†ط³ط® ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط­ط§ظ„ظٹط© ط¥ظ„ظ‰ ط§ظ„ط­ط§ظپط¸ط©" : "Current password copied to clipboard", "success");
  }).catch(() => {
    inp.select();
    document.execCommand('copy');
    showToast(currentLang === 'ar' ? "طھظ… ظ†ط³ط® ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" : "Password copied", "success");
  });
};

window.submitEditAssistantPassword = async function() {
  const username = activeEditingAssistant;
  if (!username) return;

  const newPassInp = document.getElementById("editAsstNewPasswordInput");
  const newPass = newPassInp ? newPassInp.value.trim() : "";

  if (!newPass) {
    showToast(currentLang === 'ar' ? "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©" : "Please enter the new password", "warn");
    return;
  }
  if (newPass.length < 6) {
    showToast(currentLang === 'ar' ? "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظٹط¬ط¨ ط£ظ† طھطھظƒظˆظ† ظ…ظ† 6 ط®ط§ظ†ط§طھ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„" : "Password must be at least 6 characters", "warn");
    return;
  }

  const btn = document.getElementById("submitEditPasswordBtn");
  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (currentLang === 'ar' ? "ط¬ط§ط±ظٹ ط§ظ„ط­ظپط¸..." : "Saving...");
    }

    if (!supabase) throw new Error("No supabase connection");

    const { error } = await supabase
      .from('assistants')
      .update({ password: newPass })
      .eq('username', username);

    if (error) throw error;

    showToast(currentLang === 'ar' ? `طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ظ…ط±ظˆط± ط§ظ„ظ…ط³ط§ط¹ط¯ (${username}) ط¨ظ†ط¬ط§ط­` : `Password for (${username}) updated successfully`, "success");
    window.closeEditAssistantPasswordModal();
    window.fetchAssistants();

  } catch(err) {
    console.error("Update Password Error:", err);
    showToast(currentLang === 'ar' ? "ظپط´ظ„ طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±: " + err.message : "Failed to update password: " + err.message, "err");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (currentLang === 'ar' ? "طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" : "Update Password");
    }
  }
};

window.changeAssistantPassword = function(username) {
  window.openEditAssistantPasswordModal(username);
};

window.deleteAssistant = async function(username) {
  const isAr = (currentLang === "ar");
  const res = await Swal.fire({
    title: isAr ? 'طھط£ظƒظٹط¯ ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯' : 'Confirm Delete Assistant',
    text: isAr ? `ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ط­ط³ط§ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ (${username}) ظ†ظ‡ط§ط¦ظٹط§ظ‹طں` : `Are you sure you want to permanently delete assistant (${username})?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ ط§ط­ط°ظپ' : 'Yes, Delete',
    confirmButtonColor: '#EF4444',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
  });

  if (res.isConfirmed) {
    try {
      if (!supabase) return;
      await supabase.from('assistants').delete().eq('username', username);
      showToast("طھظ… ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯ ط¨ظ†ط¬ط§ط­", "success");
      window.fetchAssistants();
    } catch(err) {
      console.error(err);
      showToast("ظپط´ظ„ ط­ط°ظپ ط§ظ„ظ…ط³ط§ط¹ط¯", "err");
    }
  }
};

// ========================================================
// 7. DECISIONS INBOX
// ========================================================
async function fetchDecisionsCount() {
  if (!supabase) return;
  try {
    const { count } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'manager_request')
      .eq('status', 'pending');

    const badge = document.getElementById("adminDecisionsBadge");
    if (count && count > 0) {
      if (badge) {
        badge.textContent = count;
        badge.classList.remove("hidden");
      }
    } else {
      if (badge) badge.classList.add("hidden");
    }
  } catch(e) { console.error(e); }
}

// DIRECT MANAGER DECISION ISSUANCE
// ========================================================
window.selectedDirectDecisionStudent = null;

window.handleDirectDecisionStudentSearch = function(val) {
  const q = String(val || '').trim().toLowerCase();
  const card = document.getElementById("directDecisionStudentCard");
  const feedback = document.getElementById("directDecisionSearchFeedback");

  if (!q) {
    if (card) card.classList.add("hidden");
    if (feedback) { feedback.classList.add("hidden"); feedback.innerHTML = ""; }
    window.selectedDirectDecisionStudent = null;
    return;
  }

  let found = null;
  if (students[q]) {
    found = students[q];
  } else {
    for (const id in students) {
      const s = students[id];
      if (s && (String(s.id) === q || (s.name && s.name.toLowerCase().includes(q)))) {
        found = s;
        break;
      }
    }
  }

  if (found) {
    if (feedback) { feedback.classList.add("hidden"); feedback.innerHTML = ""; }
    window.displayDirectDecisionStudent(found);
  } else {
    if (card) card.classList.add("hidden");
    window.selectedDirectDecisionStudent = null;
  }
};

window.searchDirectDecisionStudent = function() {
  const inp = document.getElementById("directDecisionStudentInput");
  const val = inp ? inp.value.trim() : '';
  const card = document.getElementById("directDecisionStudentCard");
  const feedback = document.getElementById("directDecisionSearchFeedback");

  if (!val) {
    showToast("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط±ظ‚ظ… ط£ظˆ ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨ ظ„ظ„ط¨ط­ط«", "warn");
    if (feedback) {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; color:#f59e0b; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:12px 16px; font-weight:600;">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨ (ID) ط£ظˆ ظƒطھط§ط¨ط© ط§ط³ظ…ظ‡ ط£ظˆظ„ط§ظ‹ ظ„ظ„ظ‚ظٹط§ظ… ط¨ط§ظ„ظپط­طµ.</span>
        </div>`;
    }
    return;
  }

  window.handleDirectDecisionStudentSearch(val);

  if (!window.selectedDirectDecisionStudent) {
    if (card) card.classList.add("hidden");
    if (feedback) {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; color:#ef4444; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:10px; padding:12px 16px; font-weight:600;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-circle-xmark" style="font-size:1.15em;"></i>
            <span>ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط£ظٹ ط·ط§ظ„ط¨ ظ…ط³ط¬ظ„ ط¨ط§ظ„ظ…ط¹ط±ظپ ط£ظˆ ط§ظ„ط§ط³ظ… ( <b>${val}</b> ). ظٹط±ط¬ظ‰ ط§ظ„طھط£ظƒط¯ ظ…ظ† ط§ظ„ط±ظ‚ظ… ط£ظˆ ظƒطھط§ط¨ط© ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨ ط¨ط´ظƒظ„ طµط­ظٹط­.</span>
          </div>
          <button type="button" class="btn secondary smallBtn" onclick="document.getElementById('directDecisionStudentInput').focus();" style="padding:4px 10px; font-size:0.82em;">
            ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ط­ط§ظˆظ„ط©
          </button>
        </div>`;
    }
    showToast("ظ„ظ… ظٹطھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط·ط§ظ„ط¨ ط¨ظ‡ط°ط§ ط§ظ„ط±ظ‚ظ… ط£ظˆ ط§ظ„ط§ط³ظ…", "err");
  } else {
    if (feedback) { feedback.classList.add("hidden"); feedback.innerHTML = ""; }
    showToast(`طھظ… ط§ظ„ط¹ط«ظˆط± ط¹ظ„ظ‰ ط§ظ„ط·ط§ظ„ط¨: ${window.selectedDirectDecisionStudent.name || window.selectedDirectDecisionStudent.id}`, "success");
  }
};

window.displayDirectDecisionStudent = function(st) {
  window.selectedDirectDecisionStudent = st;
  const card = document.getElementById("directDecisionStudentCard");
  if (!card) return;

  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";
  document.getElementById("ddsIdBadge").textContent = "ID: " + st.id;
  document.getElementById("ddsName").textContent = st.name || (isAr ? "ط·ط§ظ„ط¨ ط¨ط¯ظˆظ† ط§ط³ظ…" : "Unnamed Student");
  document.getElementById("ddsClass").textContent = st.className || (isAr ? "ط؛ظٹط± ظ…ط­ط¯ط¯" : "Unspecified");

  // Populate Target Package Selector (Strictly student packages only, no 'all' global option!)
  const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
  const pkgSelect = document.getElementById("directDecisionTargetPackage");
  if (pkgSelect) {
    let optHtml = `<option value="">-- ${isAr ? 'ط§ط®طھط± ط§ظ„ط¨ط§ظ‚ط© ط§ظ„ظ…ط³طھظ‡ط¯ظپط© ط¨ط§ظ„ظ‚ط±ط§ط±' : 'Select Targeted Package'} --</option>`;
    stPkgs.forEach(pName => {
      let pPrice = 0;
      if (packages && packages[pName]) pPrice = packages[pName].price || 0;
      else if (groupFees && groupFees[pName]) pPrice = groupFees[pName].price || groupFees[pName] || 0;
      optHtml += `<option value="${pName}">${pName} (${pPrice > 0 ? pPrice + currencySuffix : (isAr ? 'ط³ط¹ط± ظ…ط®طµطµ' : 'Custom')})</option>`;
    });
    pkgSelect.innerHTML = optHtml;

    // Auto-select first package if available
    if (stPkgs.length > 0) {
      pkgSelect.value = stPkgs[0];
    }
  }

  // Update stats display according to selected package
  window.handleDirectDecisionPackageChange();

  card.classList.remove("hidden");
};

window.handleDirectDecisionPackageChange = function() {
  const st = window.selectedDirectDecisionStudent;
  if (!st) return;

  const pkgSelect = document.getElementById("directDecisionTargetPackage");
  const selectedPkg = pkgSelect ? pkgSelect.value : '';
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";

  if (!selectedPkg) {
    document.getElementById("ddsRequired").textContent = "0" + currencySuffix;
    document.getElementById("ddsCurrentDiscount").textContent = "0" + currencySuffix;
    document.getElementById("ddsPaid").textContent = "0" + currencySuffix;
    document.getElementById("ddsRemaining").textContent = "0" + currencySuffix;
    return;
  }

  // Price of selected package
  let pPrice = 0;
  if (packages && packages[selectedPkg]) pPrice = Number(packages[selectedPkg].price) || 0;
  else if (groupFees && groupFees[selectedPkg]) pPrice = Number(groupFees[selectedPkg].price || groupFees[selectedPkg]) || 0;

  // Existing discount on this package (matching exact key, normalized key, or legacy student.discount)
  const normName = str => String(str || '').replace(/^ط¨ط§ظ‚ط©\s+/, '').trim().toLowerCase();
  const cleanSel = normName(selectedPkg);

  let curDisc = 0;
  if (st.packageDiscounts && st.packageDiscounts[selectedPkg] !== undefined) {
    curDisc = Number(st.packageDiscounts[selectedPkg]) || 0;
  } else if (st.packageDiscounts) {
    for (const p in st.packageDiscounts) {
      if (normName(p) === cleanSel) {
        curDisc = Number(st.packageDiscounts[p]) || 0;
        break;
      }
    }
  }

  const stPkgs = (Array.isArray(st.packages) && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
  if (curDisc === 0 && Number(st.discount) > 0 && stPkgs.length <= 1) {
    curDisc = Number(st.discount) || 0;
  }

  // Payments applied to this package
  let pPaid = 0;
  let hasExplicitPkgPayment = false;
  if (st.payments && Array.isArray(st.payments)) {
    st.payments.forEach(p => {
      const pPkg = p.pkgName || (stPkgs.length === 1 ? stPkgs[0] : "");
      if (pPkg && normName(pPkg) === cleanSel) {
        pPaid += Number(p.amount) || 0;
        hasExplicitPkgPayment = true;
      }
    });
  }

  if (!hasExplicitPkgPayment) {
    let totalReq = 0;
    stPkgs.forEach(pkgName => {
      let foundPrice = packages[pkgName] ? Number(packages[pkgName].price) : (Number(groupFees[pkgName]) || 0);
      if (!foundPrice) {
        for (const pk in packages) {
          if (normName(pk) === normName(pkgName)) { foundPrice = Number(packages[pk].price) || 0; break; }
        }
      }
      totalReq += foundPrice;
    });
    if (totalReq === 0) totalReq = pPrice;
    const studentPaid = Number(st.paid) || 0;
    pPaid = totalReq > 0 ? Math.round((pPrice / totalReq) * studentPaid) : studentPaid;
  }

  // Net remaining after discount and payments
  const netRequired = Math.max(0, pPrice - curDisc);
  const pRemaining = Math.max(0, netRequired - pPaid);

  document.getElementById("ddsRequired").textContent = pPrice + currencySuffix;
  document.getElementById("ddsCurrentDiscount").textContent = curDisc + currencySuffix;
  document.getElementById("ddsPaid").textContent = pPaid + currencySuffix;
  document.getElementById("ddsRemaining").textContent = pRemaining + currencySuffix;

  const valInp = document.getElementById("directDecisionValueInput");
  if (valInp) {
    valInp.value = curDisc > 0 ? curDisc : "";
  }
};

window.handleDirectDecisionTypeChange = function(type) {
  const wrap = document.getElementById("directDecisionValueWrap");
  const lbl = document.getElementById("directDecisionValueLbl");
  const inp = document.getElementById("directDecisionValueInput");
  if (!wrap || !lbl || !inp) return;

  if (type === "exemption") {
    wrap.style.opacity = "0.4";
    wrap.style.pointerEvents = "none";
    lbl.textContent = "ط¥ط¹ظپط§ط، ظƒط§ظ…ظ„ (100%)";
    inp.value = "";
  } else if (type === "custom_fee") {
    wrap.style.opacity = "1";
    wrap.style.pointerEvents = "";
    lbl.textContent = "ط§ظ„ظ…طµط§ط±ظٹظپ ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹط© ط§ظ„ظ…ط·ظ„ظˆط¨ط© (ط¬ظ†ظٹظ‡)";
    inp.placeholder = "ظ…ط«ط§ظ„: 250";
  } else {
    wrap.style.opacity = "1";
    wrap.style.pointerEvents = "";
    lbl.textContent = "ظ‚ظٹظ…ط© ط§ظ„ط®طµظ… ط§ظ„ظ…ط·ظ„ظˆط¨ط© (ط¬ظ†ظٹظ‡)";
    inp.placeholder = "ظ…ط«ط§ظ„: 100";
  }
};

window.applyDirectDecision = async function() {
  const st = window.selectedDirectDecisionStudent;
  if (!st || !supabase) {
    showToast("ظٹط±ط¬ظ‰ ظپط­طµ ظˆط§ط®طھظٹط§ط± ط·ط§ظ„ط¨ ط£ظˆظ„ط§ظ‹", "err");
    return;
  }

  const targetPkg = document.getElementById("directDecisionTargetPackage")?.value;
  if (!targetPkg) {
    showToast("ظٹط±ط¬ظ‰ ط§ط®طھظٹط§ط± ط§ظ„ط¨ط§ظ‚ط© ط§ظ„ظ…ط³طھظ‡ط¯ظپط© ط¨ط§ظ„ظ‚ط±ط§ط±", "warn");
    return;
  }

  const type = document.getElementById("directDecisionType")?.value || "discount";
  const val = Number(document.getElementById("directDecisionValueInput")?.value) || 0;
  const reason = document.getElementById("directDecisionReasonInput")?.value.trim() || "ظ‚ط±ط§ط± ظ…ط¨ط§ط´ط± ظ…ظ† ط§ظ„ظ…ط¯ظٹط±";

  // Price of targeted package
  let pkgPrice = 0;
  if (packages && packages[targetPkg]) pkgPrice = packages[targetPkg].price || 0;
  else if (groupFees && groupFees[targetPkg]) pkgPrice = groupFees[targetPkg].price || groupFees[targetPkg] || 0;

  let newPkgDiscount = 0;
  let summaryText = "";

  if (type === "exemption") {
    newPkgDiscount = pkgPrice;
    summaryText = `ط¥ط¹ظپط§ط، ظƒط§ظ…ظ„ ظ…ظ† ظ…طµط§ط±ظٹظپ ط¨ط§ظ‚ط© [${targetPkg}] (ط§ظ„ظ…ط·ظ„ظˆط¨: ${pkgPrice} ط¬)`;
  } else if (type === "custom_fee") {
    newPkgDiscount = Math.max(0, pkgPrice - val);
    summaryText = `طھط­ط¯ظٹط¯ ظ…طµط§ط±ظٹظپ ط¨ط§ظ‚ط© [${targetPkg}] ط¨ظ‚ظٹظ…ط© ${val} ط¬ (ط®طµظ…: ${newPkgDiscount} ط¬)`;
  } else {
    if (val <= 0) {
      showToast("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ‚ظٹظ…ط© ط®طµظ… طµط­ظٹط­ط© ط£ظƒط¨ط± ظ…ظ† ط§ظ„طµظپط±", "warn");
      return;
    }
    newPkgDiscount = Math.min(pkgPrice, val);
    summaryText = `ط®طµظ… ظ…ط§ظ„ظٹ ط¨ظ‚ظٹظ…ط© ${val} ط¬ ط¹ظ„ظ‰ ط¨ط§ظ‚ط© [${targetPkg}]`;
  }

  try {
    st.packageDiscounts = st.packageDiscounts || {};
    st.packageDiscounts[targetPkg] = newPkgDiscount;

    // Recalculate total student discount as sum of package discounts
    let totalDiscount = 0;
    for (const p in st.packageDiscounts) {
      totalDiscount += Number(st.packageDiscounts[p]) || 0;
    }
    st.discount = totalDiscount;
    st.lastModified = Date.now();

    // Immediately keep memory store in sync
    if (students && students[String(st.id)]) {
      students[String(st.id)].packageDiscounts = st.packageDiscounts;
      students[String(st.id)].discount = st.discount;
      students[String(st.id)].lastModified = st.lastModified;
    }

    // 1. Update students table in Supabase
    await supabase.from('students').update({
      discount: st.discount,
      last_modified: st.lastModified
    }).eq('id', st.id);

    // 2. Update settings.config.student_package_discounts
    const { data: setRow } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
    const cfg = (setRow && setRow.config) ? setRow.config : {};
    if (!cfg.student_package_discounts) cfg.student_package_discounts = {};
    cfg.student_package_discounts[st.id] = st.packageDiscounts;
    await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);

    // 3. Instant tab-to-tab sync via BroadcastChannel
    if (permChannel) {
      try {
        permChannel.postMessage({
          type: 'STUDENT_DISCOUNT_UPDATED',
          student_id: st.id,
          discount: st.discount,
          packageDiscounts: st.packageDiscounts
        });
      } catch(e) {}
    }

    // 4. Record the decision in communications
    const decId = "dec_" + Date.now();
    await supabase.from('communications').insert([{
      id: decId,
      type: 'manager_request',
      title: type,
      student_id: String(st.id),
      target_pkg: targetPkg,
      amount: (type === "exemption") ? pkgPrice : (type === "custom_fee" ? newPkgDiscount : val),
      sender_name: 'ظ…ط¯ظٹط± ط§ظ„ظ…ط±ظƒط² (ظ‚ط±ط§ط± ظ…ط¨ط§ط´ط±)',
      message: `[ط§ظ„ط¨ط§ظ‚ط©: ${targetPkg}] ${reason}`,
      status: 'approved',
      created_at: new Date().toISOString()
    }]);

    // 5. Send unread message to assistant with student_id
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: 'ظ‚ط±ط§ط± ط®طµظ… ظ…ط¨ط§ط´ط± ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط©',
      student_id: String(st.id),
      message: `ط£طµط¯ط± ط§ظ„ظ…ط¯ظٹط± ظ‚ط±ط§ط±ط§ظ‹ ظ„ظ„ط·ط§ظ„ط¨ ${st.name || st.id} (${summaryText}). ط§ظ„ط³ط¨ط¨: ${reason}`,
      status: 'unread'
    }]);

    showToast(`طھظ… طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط± ط¨ظ†ط¬ط§ط­ ظ„ظ„ط·ط§ظ„ط¨: ${st.name || st.id} ط¹ظ„ظ‰ ط¨ط§ظ‚ط© [${targetPkg}]`, "success");

    const card = document.getElementById("directDecisionStudentCard");
    if (card) card.classList.add("hidden");
    const searchInp = document.getElementById("directDecisionStudentInput");
    if (searchInp) searchInp.value = "";
    const feedback = document.getElementById("directDecisionSearchFeedback");
    if (feedback) { feedback.classList.add("hidden"); feedback.innerHTML = ""; }
    window.selectedDirectDecisionStudent = null;

    if (typeof window.renderAdminPackages === 'function') window.renderAdminPackages();
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    if (typeof window.fetchDecisions === 'function') window.fetchDecisions();

  } catch(err) {
    console.error(err);
    showToast("ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط±: " + err.message, "err");
  }
};

window.fetchDecisions = async function() {
  const listEl = document.getElementById("adminDecisionsList");
  if (!listEl || !supabase) return;
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";
  listEl.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "ط¬ط§ط±ظٹ ط¬ظ„ط¨ ط§ظ„ط·ظ„ط¨ط§طھ..." : "Loading decision requests..."}</div>`;

  try {
    const { data: reqs, error } = await supabase
      .from('communications')
      .select('*')
      .eq('type', 'manager_request')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    fetchDecisionsCount();

    if (!reqs || reqs.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ظ‚ط±ط§ط±ط§طھ ظ…ط¹ظ„ظ‚ط© ط­ط§ظ„ظٹط§ظ‹. ظƒظ„ ط´ظٹط، ظ…ط³طھظ‚ط±." : "No pending decision requests currently. All clear."}</div>`;
      return;
    }

    let html = "";
    reqs.forEach(r => {
      const date = new Date(r.created_at).toLocaleString(isAr ? "ar-EG" : "en-US");
      const isExempt = (r.title === "exemption" || r.sub_type === "exemption");
      const subType = isExempt ? "exemption" : "discount";
      const typeLabel = isExempt ? (isAr ? "ط¥ط¹ظپط§ط، ظƒط§ظ…ظ„ (100%)" : "Full Exemption (100%)") : (isAr ? `ط®طµظ… ط¨ظ‚ظٹظ…ط© ${r.amount} ط¬` : `Discount of ${r.amount} EGP`);
      const studentCodeTitle = isAr ? `ط·ط§ظ„ط¨ ظƒظˆط¯: ${r.student_id || 'â€”'}` : `Student ID: ${r.student_id || 'â€”'}`;
      const requestedByLabel = isAr ? "ط·ظ„ط¨ ط¨ظˆط§ط³ط·ط©:" : "Requested by:";
      const senderTitle = r.sender_name || (isAr ? "ظ…ط³ط§ط¹ط¯" : "Assistant");
      const reasonLabel = isAr ? "ط§ظ„ط³ط¨ط¨:" : "Reason:";
      const amountText = isExempt ? (isAr ? "ط¥ط¹ظپط§ط،" : "Exemption") : (r.amount + currencySuffix);
      const approveText = isAr ? "ظ…ظˆط§ظپظ‚ط©" : "Approve";
      const rejectText = isAr ? "ط±ظپط¶" : "Reject";

      // Targeted package badge
      let targetPkgName = r.target_pkg || "";
      if (!targetPkgName && r.message && r.message.startsWith("[ط§ظ„ط¨ط§ظ‚ط©:")) {
        const match = r.message.match(/\[ط§ظ„ط¨ط§ظ‚ط©:\s*(.*?)\]/);
        if (match) targetPkgName = match[1];
      }
      const pkgBadgeHtml = targetPkgName 
        ? `<span class="badge" style="background:rgba(37,99,235,0.12); color:var(--primary); font-size:0.82em; font-weight:700; padding:2px 8px; border-radius:6px; margin-inline-start:6px;"><i class="fa-solid fa-boxes-packing"></i> ${targetPkgName === 'all' ? (isAr ? 'ظƒط§ظپط© ط§ظ„ط¨ط§ظ‚ط§طھ' : 'All Packages') : targetPkgName}</span>`
        : '';

      html += `
        <div class="decision-card">
          <div class="decision-card-info">
            <div class="decision-student-name">${studentCodeTitle} ${pkgBadgeHtml}</div>
            <div class="decision-meta">${typeLabel} â€¢ ${requestedByLabel} <b>${senderTitle}</b> â€¢ ${date}</div>
            <div class="decision-meta" style="margin-top: 4px; color: var(--text-primary);">${reasonLabel} ${r.message || 'â€”'}</div>
          </div>
          <div class="decision-amount">${amountText}</div>
          <div class="decision-actions">
            <button class="btn success smallBtn" onclick="window.approveDecision('${r.id}', '${r.student_id}', '${subType}', ${r.amount || 0}, '${targetPkgName || ''}')">
              <i class="fa-solid fa-check"></i> ${approveText}
            </button>
            <button class="btn danger smallBtn" onclick="window.rejectDecision('${r.id}', '${r.student_id}')">
              <i class="fa-solid fa-xmark"></i> ${rejectText}
            </button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

  } catch(err) {
    console.error(err);
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center;">${isAr ? "ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط·ظ„ط¨ط§طھ: " : "Failed to load requests: "}${err.message}</div>`;
  }
};

window.approveDecision = async function(reqId, studentId, subType, amount, targetPkg) {
  try {
    if (!supabase) return;
    
    // 1. Update Student record if exists
    const st = students[String(studentId)];
    if (st) {
      let req = 0;
      const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? ["ط¨ط§ظ‚ط© " + st.className, st.className] : []);
      stPkgs.forEach(pName => {
        if (packages[pName]) req += (packages[pName].price || 0);
        else if (groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
      });

      if (subType === "exemption") {
        st.discount = req;
      } else {
        st.discount = Math.min(req, (Number(st.discount) || 0) + Number(amount));
      }

      if (targetPkg && targetPkg !== 'all') {
        st.packageDiscounts = st.packageDiscounts || {};
        st.packageDiscounts[targetPkg] = (subType === "exemption") ? req : ((Number(st.packageDiscounts[targetPkg]) || 0) + Number(amount));
      }

      st.lastModified = Date.now();
      await supabase.from('students').update({
        discount: st.discount,
        last_modified: st.lastModified
      }).eq('id', st.id);

      if (targetPkg && targetPkg !== 'all') {
        const { data: setRow } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = (setRow && setRow.config) ? setRow.config : {};
        if (!cfg.student_package_discounts) cfg.student_package_discounts = {};
        cfg.student_package_discounts[st.id] = st.packageDiscounts;
        await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);
      }

      if (permChannel) {
        try { permChannel.postMessage({ type: 'DECISION_APPROVED', reqId, student_id: studentId, discount: st.discount, packageDiscounts: st.packageDiscounts }); } catch(e) {}
      }
    }

    // 2. Mark request approved
    await supabase.from('communications').update({ status: 'approved' }).eq('id', reqId);

    // 3. Notify assistant
    const pkgText = (targetPkg && targetPkg !== 'all') ? ` [${targetPkg}]` : '';
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: 'طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط·ظ„ط¨ ط§ظ„ظ‚ط±ط§ط±',
      message: `ظˆط§ظپظ‚ ط§ظ„ظ…ط¯ظٹط± ط¹ظ„ظ‰ ط·ظ„ط¨ ط§ظ„ط·ط§ظ„ط¨ (${studentId})${pkgText} ط¨ظ‚ظٹظ…ط© ${subType === "exemption" ? "ط¥ط¹ظپط§ط، ظƒط§ظ…ظ„" : amount + " ط¬"}`,
      status: 'unread'
    }]);

    showToast("طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© ظˆطھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط±ط§ط± ط¨ظ†ط¬ط§ط­", "success");
    window.renderTermTable();
    window.fetchDecisions();
  } catch(err) {
    console.error(err);
    showToast("ظپط´ظ„ ط§ط¹طھظ…ط§ط¯ ط§ظ„ظ‚ط±ط§ط±: " + err.message, "err");
  }
};

window.rejectDecision = async function(reqId, studentId) {
  try {
    if (!supabase) return;
    await supabase.from('communications').update({ status: 'rejected' }).eq('id', reqId);
    showToast("طھظ… ط±ظپط¶ ط§ظ„ط·ظ„ط¨", "info");
    window.fetchDecisions();
  } catch(err) {
    console.error(err);
    showToast("ظپط´ظ„ ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ط±ظپط¶", "err");
  }
};

// ========================================================
// 8. PACKAGES & EXPENSES (ENHANCED WITH ANALYTICS & WIDE MODAL)
// ========================================================

function formatPackageDuration(startDate, endDate, isAr) {
  if (!startDate || !endDate) return null;
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = d2 - d1;
  if (isNaN(diffTime) || diffTime < 0) return null;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const months = Math.floor(days / 30);
  const remDays = days % 30;

  if (isAr) {
    let breakdown = [];
    if (months > 0) breakdown.push(`${months} ${months === 1 ? 'ط´ظ‡ط±' : (months === 2 ? 'ط´ظ‡ط±ط§ظ†' : (months <= 10 ? 'ط£ط´ظ‡ط±' : 'ط´ظ‡ط±ط§ظ‹'))}`);
    if (remDays > 0) breakdown.push(`${remDays} ${remDays === 1 ? 'ظٹظˆظ…' : (remDays === 2 ? 'ظٹظˆظ…ط§ظ†' : (remDays <= 10 ? 'ط£ظٹط§ظ…' : 'ظٹظˆظ…ط§ظ‹'))}`);
    const summary = breakdown.length > 0 ? breakdown.join(' ظˆ ') : `${days} ظٹظˆظ…`;
    return {
      days,
      text: `${days} ظٹظˆظ…ط§ظ‹ (${summary})`,
      short: `${days} ظٹظˆظ…`
    };
  } else {
    let breakdown = [];
    if (months > 0) breakdown.push(`${months} month${months > 1 ? 's' : ''}`);
    if (remDays > 0) breakdown.push(`${remDays} day${remDays > 1 ? 's' : ''}`);
    const summary = breakdown.length > 0 ? breakdown.join(' and ') : `${days} days`;
    return {
      days,
      text: `${days} days (${summary})`,
      short: `${days} d`
    };
  }
}
window.formatPackageDuration = formatPackageDuration;

window.getPkgDetails = function(name) {
  return packages[name] || {};
};

window.renderAdminPackages = function() {
  const container = document.getElementById("adminPackagesListContainer");
  if (!container) return;
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ط¬" : " EGP";

  const keys = Object.keys(packages || {});
  if (keys.length === 0) {
    container.innerHTML = `<div style="color:var(--text-secondary); padding:20px; text-align:center;">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط¨ط§ظ‚ط§طھ ظ…ط¶ط§ظپط© ط¨ط¹ط¯." : "Generals added yet."}</div>`;
    return;
  }

  let html = "";
  keys.forEach(k => {
    const p = packages[k] || {};
    const details = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(k) : p;
    const subj = details.subject || p.subject || k;
    const price = Number(details.price || p.price || 0);

    // Enrolled students with robust normalization & single-package fallback
    const normName = str => String(str || '').replace(/^ط¨ط§ظ‚ط©\s+/, '').trim().toLowerCase();
    const cleanK = normName(k);

    const enrolledStudents = Object.values(students || {}).filter(st => {
      if (!st || !st.name) return false;
      // 1. Check student packages list
      if (Array.isArray(st.packages) && st.packages.length > 0) {
        const has = st.packages.some(p => normName(p) === cleanK);
        if (has) return true;
      }
      // 2. Check student className
      if (st.className && normName(st.className) === cleanK) return true;
      return false;
    });
    const count = enrolledStudents.length;

    // Financial analytics calculation (taking package discounts and explicit payments into account)
    let totalPkgExpected = 0;
    let collectedRevenue = 0;

    enrolledStudents.forEach(st => {
      let curDisc = 0;
      if (st.packageDiscounts && st.packageDiscounts[k] !== undefined) {
        curDisc = Number(st.packageDiscounts[k]) || 0;
      } else if (st.packageDiscounts) {
        for (const p in st.packageDiscounts) {
          if (normName(p) === cleanK) {
            curDisc = Number(st.packageDiscounts[p]) || 0;
            break;
          }
        }
      }
      const stPkgs = (Array.isArray(st.packages) && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
      if (curDisc === 0 && Number(st.discount) > 0 && stPkgs.length <= 1) {
        curDisc = Number(st.discount) || 0;
      }

      const netExpected = Math.max(0, price - curDisc);
      totalPkgExpected += netExpected;

      let totalReq = 0;
      stPkgs.forEach(pkgName => {
        const cleanP = normName(pkgName);
        let foundPrice = packages[pkgName] ? Number(packages[pkgName].price) : (Number(groupFees[pkgName]) || 0);
        if (!foundPrice) {
          for (const pk in packages) {
            if (normName(pk) === cleanP) { foundPrice = Number(packages[pk].price) || 0; break; }
          }
        }
        totalReq += foundPrice;
      });
      if (totalReq === 0) totalReq = price;

      let explicitPaid = 0;
      let hasExplicit = false;
      if (st.payments && Array.isArray(st.payments)) {
        st.payments.forEach(p => {
          const pPkg = p.pkgName || (stPkgs.length === 1 ? stPkgs[0] : "");
          if (pPkg && normName(pPkg) === cleanK) {
            explicitPaid += Number(p.amount) || 0;
            hasExplicit = true;
          }
        });
      }

      let pkgShare = 0;
      if (hasExplicit) {
        pkgShare = Math.min(netExpected, explicitPaid);
      } else {
        const studentPaid = Number(st.paid) || 0;
        pkgShare = totalReq > 0 ? Math.min(netExpected, Math.round((price / totalReq) * studentPaid)) : Math.min(netExpected, studentPaid);
      }
      collectedRevenue += pkgShare;
    });

    const expectedRevenue = totalPkgExpected;
    const remainingRevenue = Math.max(0, expectedRevenue - collectedRevenue);
    const collectedPercent = expectedRevenue > 0 ? Math.min(100, Math.round((collectedRevenue / expectedRevenue) * 100)) : 0;

    // Duration & Validity Badges
    let validityBadgeHtml = "";
    if (details.expiryType === 'time' && details.startDate && details.endDate) {
      const durObj = formatPackageDuration(details.startDate, details.endDate, isAr);
      const durShort = durObj ? durObj.short : '';
      validityBadgeHtml = `
        <span class="admin-pkg-validity-badge" title="${isAr ? 'ط§ظ„ظ…ط¯ط© ط§ظ„ط²ظ…ظ†ظٹط© ظ„ظ„ط¨ط§ظ‚ط©' : 'Package Duration'}">
          <i class="fa-regular fa-calendar-days"></i> ${details.startDate} ${isAr ? "ط¥ظ„ظ‰" : "to"} ${details.endDate}
        </span>
        ${durShort ? `<span class="admin-pkg-duration-pill"><i class="fa-solid fa-clock"></i> ${durShort}</span>` : ''}
      `;
    } else if (details.expiryType === 'sessions' && details.sessionLimit > 0) {
      validityBadgeHtml = `
        <span class="admin-pkg-validity-badge" style="color:#ec4899;">
          <i class="fa-solid fa-ticket"></i> ${details.sessionLimit} ${isAr ? "ط­طµطµ ظ…ط³ظ…ظˆط­ط©" : "Allowed Sessions"}
        </span>
      `;
    } else {
      validityBadgeHtml = `
        <span class="admin-pkg-validity-badge">
          <i class="fa-solid fa-infinity"></i> ${isAr ? "ظ…ظپطھظˆط­ط© ط¨ط¯ظˆظ† ط§ظ†طھظ‡ط§ط،" : "Unlimited Validity"}
        </span>
      `;
    }

    const subjBadge = subj ? `<span class="admin-pkg-subj-badge"><i class="fa-solid fa-book-bookmark"></i> ${subj}</span>` : '';

    html += `
      <div class="admin-pkg-card">
        <div class="admin-pkg-card-top">
          <div style="flex:1; min-width:0;">
            <div class="admin-pkg-title-wrap">
              <h4 class="admin-pkg-name">${k}</h4>
              ${subjBadge}
            </div>
            <div class="admin-pkg-validity-wrap">
              ${validityBadgeHtml}
            </div>
          </div>
          <div class="admin-pkg-price-pill">
            <span class="admin-pkg-price-num">${price}</span>
            <span class="admin-pkg-price-curr">${currencySuffix}</span>
          </div>
        </div>

        <div class="admin-pkg-metrics-grid">
          <div class="admin-pkg-metric-cell metric-subscribers">
            <div class="metric-icon"><i class="fa-solid fa-user-graduate"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "ط§ظ„ظ…ط´طھط±ظƒظٹظ†" : "Students"}</span>
              <span class="metric-val">${count} <small>${isAr ? "ط·ط§ظ„ط¨" : "st"}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-collected">
            <div class="metric-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "ط§ظ„ظ…ط­طµظ„" : "Collected"}</span>
              <span class="metric-val">${collectedRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-remaining">
            <div class="metric-icon"><i class="fa-solid fa-receipt"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "ط§ظ„ظ…طھط¨ظ‚ظٹ" : "Remaining"}</span>
              <span class="metric-val">${remainingRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-expected">
            <div class="metric-icon"><i class="fa-solid fa-calculator"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…طھظˆظ‚ط¹" : "Expected Total"}</span>
              <span class="metric-val">${expectedRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>
        </div>

        <div class="admin-pkg-progress-wrap">
          <div class="admin-pkg-progress-header">
            <span>${isAr ? "ظ†ط³ط¨ط© ط§ظ„طھط­طµظٹظ„" : "Collection Rate"}</span>
            <b>${collectedPercent}% (${collectedRevenue} ${currencySuffix} ${isAr ? "ظ…ظ†" : "of"} ${expectedRevenue} ${currencySuffix})</b>
          </div>
          <div class="admin-pkg-progress-bar">
            <div class="admin-pkg-progress-fill" style="width:${collectedPercent}%;"></div>
          </div>
        </div>

        <div class="admin-pkg-actions">
          <button class="btn secondary smallBtn btn-pkg-edit" onclick="window.openEditPackageModal('${encodeURIComponent(k)}')">
            <i class="fa-solid fa-pen-to-square"></i> ${isAr ? "طھط¹ط¯ظٹظ„ ظƒط§ظ…ظ„" : "Full Edit"}
          </button>
          <button class="btn danger smallBtn iconOnly btn-pkg-delete" onclick="window.adminDeletePackage('${encodeURIComponent(k)}')" title="${isAr ? "ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط©" : "Delete Package"}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};

window.openAddPackageModal = async function() {
  const isAr = (currentLang === "ar");
  const { value: formValues } = await Swal.fire({
    title: isAr ? 'ط¥ط¶ط§ظپط© ط¨ط§ظ‚ط© ط¬ط¯ظٹط¯ط©' : 'Add New Package',
    customClass: { popup: 'swal-wide-package-modal' },
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:${isAr ? 'right' : 'left'};">
        <!-- 3-Column Top Row -->
        <div class="pkg-edit-grid-3">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©:" : "Package Name:"}</label>
            <input id="swalPkgName" class="pkg-field-input" placeholder="${isAr ? "ظ…ط«ط§ظ„: ط¨ط§ظ‚ط© ط³ط¨طھظ…ط¨ط±" : "e.g. September Package"}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ظ„ظ…ط§ط¯ط© ط§ظ„ط¯ط±ط§ط³ظٹط©:" : "Subject:"}</label>
            <input id="swalPkgSubject" class="pkg-field-input" placeholder="${isAr ? "ظ…ط«ط§ظ„: ط¹ظ„ظˆظ…" : "e.g. Science"}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ظ„ط³ط¹ط± (ط¬.ظ…):" : "Price (EGP):"}</label>
            <input id="swalPkgPrice" type="number" class="pkg-field-input" placeholder="0">
          </div>
        </div>
        
        <!-- Validity System Selector -->
        <div class="pkg-field-group">
          <label class="pkg-field-label">${isAr ? "ظ†ط¸ط§ظ… ط§ظ„طµظ„ط§ط­ظٹط© ظˆطھظ†ط¨ظٹظ‡ط§طھ ط§ظ„ط§ظ†طھظ‡ط§ط،:" : "Validity System & Expiry Alerts:"}</label>
          <select id="swalPkgExpiryType" class="pkg-field-input" onchange="
            const isT = (this.value === 'time');
            document.getElementById('swalTimeBox').style.display = isT ? 'block' : 'none';
            document.getElementById('swalSessBox').style.display = (this.value === 'sessions') ? 'block' : 'none';
          ">
            <option value="time">${isAr ? "ط¨ط§ظ„ظ…ط¯ط© ط§ظ„ط²ظ…ظ†ظٹط© (ظ…ظ† طھط§ط±ظٹط® ط¥ظ„ظ‰ طھط§ط±ظٹط®)" : "By Duration (From Date to Date)"}</option>
            <option value="sessions">${isAr ? "ط¨ط¹ط¯ط¯ ط§ظ„ط­طµطµ (ظ…ط«ط§ظ„: 8 ط­طµطµ)" : "By Session Count (e.g. 8 Sessions)"}</option>
          </select>
        </div>
        
        <!-- Duration Box -->
        <div id="swalTimeBox" style="display:block; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isAr ? "ط§ظ„ظ…ط¯ط© ط§ظ„ط²ظ…ظ†ظٹط© ظ„ظ„ط¨ط§ظ‚ط©:" : "Package Duration:"}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط©:" : "Start Date:"}</label>
              <input type="date" id="swalPkgStartDate" class="pkg-field-input">
            </div>
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "طھط§ط±ظٹط® ط§ظ„ظ†ظ‡ط§ظٹط©:" : "End Date:"}</label>
              <input type="date" id="swalPkgEndDate" class="pkg-field-input">
            </div>
          </div>
          <div class="pkg-duration-info-box" id="swalAddDurationBox">
            <i class="fa-solid fa-clock"></i>
            <span id="swalAddDurationText">${isAr ? "ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆط§ظ„ظ†ظ‡ط§ظٹط©" : "Please select start and end dates"}</span>
          </div>
        </div>

        <!-- Sessions Box -->
        <div id="swalSessBox" style="display:none; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط¹ط¯ط¯ ط§ظ„ط­طµطµ ط§ظ„ظ…ط³ظ…ظˆط­ط© ظ„ظ„ظ…ط´طھط±ظƒ:" : "Allowed Sessions for Subscriber:"}</label>
            <input type="number" id="swalPkgSessions" class="pkg-field-input" value="8">
          </div>
        </div>
      </div>
    `,
    didOpen: () => {
      const sInp = document.getElementById('swalPkgStartDate');
      const eInp = document.getElementById('swalPkgEndDate');
      const dText = document.getElementById('swalAddDurationText');
      const updateDurationLive = () => {
        if (!sInp || !eInp || !dText) return;
        const res = formatPackageDuration(sInp.value, eInp.value, isAr);
        dText.textContent = res ? res.text : (isAr ? "ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆط§ظ„ظ†ظ‡ط§ظٹط©" : "Please select start and end dates");
      };
      if (sInp) sInp.addEventListener('input', updateDurationLive);
      if (eInp) eInp.addEventListener('input', updateDurationLive);
    },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isAr ? 'ط­ظپط¸ ط§ظ„ط¨ط§ظ‚ط©' : 'Save Package',
    confirmButtonColor: '#2563eb',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel',
    preConfirm: () => {
      const name = document.getElementById('swalPkgName').value.trim();
      const subject = document.getElementById('swalPkgSubject').value.trim();
      const price = Number(document.getElementById('swalPkgPrice').value) || 0;
      const expiryType = document.getElementById('swalPkgExpiryType').value;
      const startDate = document.getElementById('swalPkgStartDate').value;
      const endDate = document.getElementById('swalPkgEndDate').value;
      const sessions = Number(document.getElementById('swalPkgSessions').value) || 0;

      if (!name) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©' : 'Please enter package name');
        return false;
      }
      if (!subject) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ط§ط¯ط© ط§ظ„ط¯ط±ط§ط³ظٹط©' : 'Please enter subject');
        return false;
      }
      if (expiryType === 'time' && (!startDate || !endDate)) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆطھط§ط±ظٹط® ط§ظ„ظ†ظ‡ط§ظٹط©' : 'Please select start and end dates');
        return false;
      }
      return { name, subject, price, expiryType, startDate, endDate, sessions };
    }
  });

  if (formValues) {
    const { name, subject, price, expiryType, startDate, endDate, sessions } = formValues;
    try {
      if (!supabase) return;
      await supabase.from('packages').upsert({
        name,
        price,
        has_installments: false,
        installment_price: 0
      }, { onConflict: 'name' });

      // Also sync to settings.config.group_fees
      const { data: setRow } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
      const cfg = (setRow && setRow.config) ? setRow.config : {};
      if (!cfg.group_fees) cfg.group_fees = {};
      cfg.group_fees[name] = {
        name,
        subject,
        price,
        expiryType,
        startDate,
        endDate,
        sessionLimit: sessions,
        hasInstallments: false,
        installmentPrice: 0,
        updatedAt: nowDateStr()
      };
      await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);

      packages[name] = { name, subject, price, expiryType, startDate, endDate, sessionLimit: sessions, hasInstallments: false, installmentPrice: 0 };
      groupFees[name] = price;
      if (permChannel) {
        try { permChannel.postMessage({ type: 'PACKAGES_UPDATED' }); } catch(e) {}
      }
      showToast(isAr ? "طھظ…طھ ط¥ط¶ط§ظپط© ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­" : "Package added successfully", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "ظپط´ظ„ ط¥ط¶ط§ظپط© ط§ظ„ط¨ط§ظ‚ط©" : "Failed to add package", "err");
    }
  }
};

window.openEditPackageModal = async function(encodedName) {
  const name = decodeURIComponent(encodedName);
  const p = packages[name] || {};
  const details = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(name) : (p || {});
  const isAr = (currentLang === "ar");

  const curSubject = details.subject || p.subject || name || '';
  const curPrice = details.price || p.price || 0;
  const curExpiry = details.expiryType || 'time';
  const curStart = details.startDate || '';
  const curEnd = details.endDate || '';
  const curSessions = details.sessionLimit || 8;

  const initialDurObj = formatPackageDuration(curStart, curEnd, isAr);
  const initialDurText = initialDurObj ? initialDurObj.text : (isAr ? "ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆط§ظ„ظ†ظ‡ط§ظٹط©" : "Please select start and end dates");

  const { value: formValues } = await Swal.fire({
    title: (isAr ? 'طھط¹ط¯ظٹظ„ ط§ظ„ط¨ط§ظ‚ط©: ' : 'Edit Package: ') + name,
    customClass: { popup: 'swal-wide-package-modal' },
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:${isAr ? 'right' : 'left'};">
        <!-- 3-Column Top Row -->
        <div class="pkg-edit-grid-3">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط© (طھط؛ظٹظٹط± ط§ظ„ط§ط³ظ… ظٹط­ط¯ظ‘ط« ط§ظ„ط·ظ„ط§ط¨):" : "Package Name:"}</label>
            <input id="swalEditPkgName" class="pkg-field-input" value="${name}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ظ„ظ…ط§ط¯ط© ط§ظ„ط¯ط±ط§ط³ظٹط©:" : "Subject:"}</label>
            <input id="swalEditPkgSubject" class="pkg-field-input" value="${curSubject}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط§ظ„ط³ط¹ط± (ط¬.ظ…):" : "Price (EGP):"}</label>
            <input id="swalEditPkgPrice" type="number" class="pkg-field-input" value="${curPrice}">
          </div>
        </div>
        
        <!-- Validity System Selector -->
        <div class="pkg-field-group">
          <label class="pkg-field-label">${isAr ? "ظ†ط¸ط§ظ… ط§ظ„طµظ„ط§ط­ظٹط© ظˆطھظ†ط¨ظٹظ‡ط§طھ ط§ظ„ط§ظ†طھظ‡ط§ط،:" : "Validity System & Expiry Alerts:"}</label>
          <select id="swalEditPkgExpiryType" class="pkg-field-input" onchange="
            const isT = (this.value === 'time');
            document.getElementById('swalEditTimeBox').style.display = isT ? 'block' : 'none';
            document.getElementById('swalEditSessBox').style.display = (this.value === 'sessions') ? 'block' : 'none';
          ">
            <option value="time" ${curExpiry==='time'?'selected':''}>${isAr ? "ط¨ط§ظ„ظ…ط¯ط© ط§ظ„ط²ظ…ظ†ظٹط© (ظ…ظ† طھط§ط±ظٹط® ط¥ظ„ظ‰ طھط§ط±ظٹط®)" : "By Duration (From Date to Date)"}</option>
            <option value="sessions" ${curExpiry==='sessions'?'selected':''}>${isAr ? "ط¨ط¹ط¯ط¯ ط§ظ„ط­طµطµ (ظ…ط«ط§ظ„: 8 ط­طµطµ)" : "By Session Count (e.g. 8 Sessions)"}</option>
          </select>
        </div>
        
        <!-- Duration Box -->
        <div id="swalEditTimeBox" style="display:${curExpiry==='time'?'block':'none'}; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isAr ? "ط§ظ„ظ…ط¯ط© ط§ظ„ط²ظ…ظ†ظٹط© ظ„ظ„ط¨ط§ظ‚ط©:" : "Package Duration:"}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط©:" : "Start Date:"}</label>
              <input type="date" id="swalEditPkgStartDate" class="pkg-field-input" value="${curStart}">
            </div>
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "طھط§ط±ظٹط® ط§ظ„ظ†ظ‡ط§ظٹط©:" : "End Date:"}</label>
              <input type="date" id="swalEditPkgEndDate" class="pkg-field-input" value="${curEnd}">
            </div>
          </div>
          <div class="pkg-duration-info-box" id="swalEditDurationBox">
            <i class="fa-solid fa-clock"></i>
            <span id="swalEditDurationText">${initialDurText}</span>
          </div>
        </div>

        <!-- Sessions Box -->
        <div id="swalEditSessBox" style="display:${curExpiry==='sessions'?'block':'none'}; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "ط¹ط¯ط¯ ط§ظ„ط­طµطµ ط§ظ„ظ…ط³ظ…ظˆط­ط© ظ„ظ„ظ…ط´طھط±ظƒ:" : "Allowed Sessions for Subscriber:"}</label>
            <input type="number" id="swalEditPkgSessions" class="pkg-field-input" value="${curSessions}">
          </div>
        </div>
      </div>
    `,
    didOpen: () => {
      const sInp = document.getElementById('swalEditPkgStartDate');
      const eInp = document.getElementById('swalEditPkgEndDate');
      const dText = document.getElementById('swalEditDurationText');
      const updateDurationLive = () => {
        if (!sInp || !eInp || !dText) return;
        const res = formatPackageDuration(sInp.value, eInp.value, isAr);
        dText.textContent = res ? res.text : (isAr ? "ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆط§ظ„ظ†ظ‡ط§ظٹط©" : "Please select start and end dates");
      };
      if (sInp) sInp.addEventListener('input', updateDurationLive);
      if (eInp) eInp.addEventListener('input', updateDurationLive);
    },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isAr ? 'ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ' : 'Save Changes',
    confirmButtonColor: '#2563eb',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel',
    preConfirm: () => {
      const newName = document.getElementById('swalEditPkgName').value.trim();
      const newSubject = document.getElementById('swalEditPkgSubject').value.trim();
      const newPrice = Number(document.getElementById('swalEditPkgPrice').value) || 0;
      const newExpiryType = document.getElementById('swalEditPkgExpiryType').value;
      const newStartDate = document.getElementById('swalEditPkgStartDate').value;
      const newEndDate = document.getElementById('swalEditPkgEndDate').value;
      const newSessions = Number(document.getElementById('swalEditPkgSessions').value) || 0;

      if (!newName) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©' : 'Please enter package name');
        return false;
      }
      if (!newSubject) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ط§ط¯ط© ط§ظ„ط¯ط±ط§ط³ظٹط©' : 'Please enter subject');
        return false;
      }
      if (newExpiryType === 'time' && (!newStartDate || !newEndDate)) {
        Swal.showValidationMessage(isAr ? 'ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ طھط§ط±ظٹط® ط§ظ„ط¨ط¯ط§ظٹط© ظˆطھط§ط±ظٹط® ط§ظ„ظ†ظ‡ط§ظٹط©' : 'Please select start and end dates');
        return false;
      }
      return { newName, newSubject, newPrice, newExpiryType, newStartDate, newEndDate, newSessions };
    }
  });

  if (formValues) {
    const { newName, newSubject, newPrice, newExpiryType, newStartDate, newEndDate, newSessions } = formValues;
    try {
      if (!supabase) return;

      // 1. If renamed, handle clean rename across packages, students, and settings
      if (newName !== name) {
        await supabase.from('packages').delete().eq('name', name);
        delete packages[name];
        delete groupFees[name];

        // Update enrolled students locally and in Supabase
        const studentsToUpdate = [];
        Object.values(students || {}).forEach(st => {
          if (st && Array.isArray(st.packages) && st.packages.includes(name)) {
            st.packages = st.packages.map(pName => pName === name ? newName : pName);
            studentsToUpdate.push(st);
          }
        });

        for (const st of studentsToUpdate) {
          try {
            await supabase.from('students').update({ packages: st.packages }).eq('id', st.id);
          } catch(err) {
            console.warn('Failed to update student packages in cloud:', err);
          }
        }
      }

      // 2. Upsert new package details in packages table
      await supabase.from('packages').upsert({
        name: newName,
        price: newPrice,
        has_installments: false,
        installment_price: 0
      }, { onConflict: 'name' });

      // 3. Update settings.config.group_fees
      const { data: setRow } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
      const cfg = (setRow && setRow.config) ? setRow.config : {};
      if (!cfg.group_fees) cfg.group_fees = {};
      if (newName !== name) {
        delete cfg.group_fees[name];
        if (cfg.student_packages) {
          Object.keys(cfg.student_packages).forEach(stId => {
            if (Array.isArray(cfg.student_packages[stId])) {
              cfg.student_packages[stId] = cfg.student_packages[stId].map(p => p === name ? newName : p);
            }
          });
        }
      }
      cfg.group_fees[newName] = {
        name: newName,
        subject: newSubject,
        price: newPrice,
        expiryType: newExpiryType,
        startDate: newStartDate,
        endDate: newEndDate,
        sessionLimit: newSessions,
        hasInstallments: false,
        installmentPrice: 0,
        updatedAt: nowDateStr()
      };
      await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);

      // 4. Update local state
      packages[newName] = {
        name: newName,
        subject: newSubject,
        price: newPrice,
        expiryType: newExpiryType,
        startDate: newStartDate,
        endDate: newEndDate,
        sessionLimit: newSessions,
        hasInstallments: false,
        installmentPrice: 0
      };
      groupFees[newName] = newPrice;

      if (permChannel) {
        try { permChannel.postMessage({ type: 'PACKAGES_UPDATED' }); } catch(e) {}
      }

      showToast(isAr ? "طھظ… طھط­ط¯ظٹط« ط§ظ„ط¨ط§ظ‚ط© ط¨ظ†ط¬ط§ط­ ظˆط­ظپط¸ظ‡ط§ ط³ط­ط§ط¨ظٹط§ظ‹" : "Package updated and synced successfully", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "ظپط´ظ„ طھط­ط¯ظٹط« ط§ظ„ط¨ط§ظ‚ط©" : "Failed to update package", "err");
    }
  }
};

window.adminDeletePackage = async function(encodedName) {
  const name = decodeURIComponent(encodedName);
  const isAr = (currentLang === "ar");
  const enrolledCount = Object.values(students || {}).filter(st => st && Array.isArray(st.packages) && st.packages.includes(name)).length;

  let warningMsg = isAr 
    ? `ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ طھظ…ط§ظ…ط§ظ‹ ظ…ظ† ط­ط°ظپ ط¨ط§ظ‚ط© "${name}" ظ…ظ† ط§ظ„ظ†ط¸ط§ظ… ظ†ظ‡ط§ط¦ظٹط§ظ‹طں` 
    : `Are you sure you want to permanently delete package "${name}" from the system?`;
  if (enrolledCount > 0) {
    warningMsg += isAr 
      ? `\n\nطھظ†ط¨ظٹظ‡: ظٹظˆط¬ط¯ (${enrolledCount}) ط·ط§ظ„ط¨ ظ…ط³ط¬ظ„ظٹظ† ظپظٹ ظ‡ط°ظ‡ ط§ظ„ط¨ط§ظ‚ط©طŒ ط³ظٹطھظ… ظپظƒ ط§ط±طھط¨ط§ط·ظ‡ظ… ط¨ظ‡ط§ طھظ„ظ‚ط§ط¦ظٹط§ظ‹.`
      : `\n\nNotice: (${enrolledCount}) students are currently enrolled in this package. They will be unlinked automatically.`;
  }

  const { isConfirmed } = await Swal.fire({
    title: isAr ? 'طھط£ظƒظٹط¯ ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط©' : 'Confirm Package Deletion',
    text: warningMsg,
    icon: enrolledCount > 0 ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ ط§ط­ط°ظپ ظ†ظ‡ط§ط¦ظٹط§ظ‹' : 'Yes, Delete Permanently',
    confirmButtonColor: '#ef4444',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
  });

  if (isConfirmed) {
    try {
      if (!supabase) return;

      // 1. Delete from Supabase packages table
      await supabase.from('packages').delete().eq('name', name);

      // 2. Remove from settings.config.group_fees and student_packages
      const { data: setRow } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
      const cfg = (setRow && setRow.config) ? setRow.config : {};
      if (cfg.group_fees) {
        delete cfg.group_fees[name];
      }
      if (cfg.student_packages) {
        Object.keys(cfg.student_packages).forEach(stId => {
          if (Array.isArray(cfg.student_packages[stId])) {
            cfg.student_packages[stId] = cfg.student_packages[stId].filter(p => p !== name);
          }
        });
      }
      await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);

      // 3. Unlink from local students
      Object.values(students || {}).forEach(st => {
        if (st && Array.isArray(st.packages) && st.packages.includes(name)) {
          st.packages = st.packages.filter(pName => pName !== name);
        }
      });

      delete packages[name];
      delete groupFees[name];

      if (permChannel) {
        try { permChannel.postMessage({ type: 'PACKAGES_UPDATED' }); } catch(e) {}
      }

      showToast(isAr ? "طھظ… ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط© ظ†ظ‡ط§ط¦ظٹط§ظ‹ ظ…ظ† ط§ظ„ط³ط­ط§ط¨ط© ظˆط§ظ„ظ†ط¸ط§ظ…" : "Package permanently deleted from cloud and system", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "ظپط´ظ„ ط­ط°ظپ ط§ظ„ط¨ط§ظ‚ط©" : "Failed to delete package", "err");
    }
  }
};

window.openRecordExpenseModal = async function(defaultType = 'expense') {
  const isAr = (currentLang === "ar");
  const isWithdrawal = (defaultType === 'withdrawal');

  const { value: formValues } = await Swal.fire({
    customClass: {
      popup: 'swal-expense-modal',
      confirmButton: 'swal-btn-confirm',
      cancelButton: 'swal-btn-cancel'
    },
    buttonsStyling: false,
    width: '740px',
    showCloseButton: true,
    html: `
      <div class="swal-expense-wrapper" style="direction: ${isAr ? 'rtl' : 'ltr'}; text-align: ${isAr ? 'right' : 'left'};">
        <!-- Header -->
        <div class="swal-expense-header">
          <div class="swal-expense-icon ${isWithdrawal ? 'is-withdrawal' : 'is-expense'}" id="swalHeaderIcon">
            <i class="fa-solid ${isWithdrawal ? 'fa-hand-holding-dollar' : 'fa-receipt'}"></i>
          </div>
          <div style="flex: 1;">
            <h3 class="swal-expense-title" id="swalHeaderTitle">
              ${isWithdrawal ? (isAr ? 'طھط³ط¬ظٹظ„ ظ…ط³ط­ظˆط¨ط§طھ ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط±' : 'Record Owner Withdrawal') : (isAr ? 'طھط³ط¬ظٹظ„ ظ…طµط±ظˆظپ طھط´ط؛ظٹظ„ظٹ ظ„ظ„ط³ظ†طھط±' : 'Record Center Expense')}
            </h3>
            <p class="swal-expense-subtitle" id="swalHeaderSubtitle">
              ${isWithdrawal ? (isAr ? 'طھظˆط«ظٹظ‚ ط§ظ„ط³ط­ظˆط¨ط§طھ ظˆط§ظ„ط£ط±ط¨ط§ط­ ط§ظ„ط®ط§طµط© ظپظˆط±ظٹط§ظ‹ ظ…ظ† ط§ظ„ط®ط²ط§ط¦ظ†' : 'Document center withdrawals directly from vaults') : (isAr ? 'طھظˆط«ظٹظ‚ ظپظˆط§طھظٹط± ظˆظ…طµط±ظˆظپط§طھ ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ظ…ظٹط¯ط§ظ†ظٹط© ظˆط®طµظ…ظ‡ط§ ظ…ظ† ط§ظ„ط®ط²ط§ط¦ظ†' : 'Track daily operational expenses and update vault balances')}
            </p>
          </div>
        </div>

        <!-- Horizontal Type Switcher (Pill Cards) -->
        <div class="swal-type-grid">
          <div class="swal-type-card is-exp ${!isWithdrawal ? 'active-expense' : ''}" id="cardTypeExpense">
            <input type="radio" name="swalTxType" value="expense" ${!isWithdrawal ? 'checked' : ''}>
            <div class="card-icon">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <div class="card-texts">
              <span class="card-label">${isAr ? 'ظ…طµط±ظˆظپ ط³ظ†طھط±' : 'Center Expense'}</span>
              <span class="card-desc">${isAr ? 'ظپظˆط§طھظٹط±طŒ ط¥ظٹط¬ط§ط±طŒ طµظٹط§ظ†ط©طŒ ط·ط¨ط§ط¹ط© ظ…ط°ظƒط±ط§طھ' : 'Bills, rent, printing, maintenance'}</span>
            </div>
            <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
          </div>

          <div class="swal-type-card is-wth ${isWithdrawal ? 'active-withdrawal' : ''}" id="cardTypeWithdrawal">
            <input type="radio" name="swalTxType" value="withdrawal" ${isWithdrawal ? 'checked' : ''}>
            <div class="card-icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <div class="card-texts">
              <span class="card-label">${isAr ? 'ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³طھط±' : 'Owner Withdrawal'}</span>
              <span class="card-desc">${isAr ? 'ط£ط±ط¨ط§ط­ ط´ط®طµظٹط© ظˆط³ط­ظˆط¨ط§طھ ط®ط§طµط©' : 'Personal profits & drawings'}</span>
            </div>
            <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
          </div>
        </div>

        <!-- 2-Column Fields Grid -->
        <div class="swal-fields-grid">
          <!-- Col 1: Amount -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalAmtInp">
              <i class="fa-solid fa-coins" style="color: var(--primary);"></i>
              <span>${isAr ? 'ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط·ظ„ظˆط¨' : 'Amount'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="number" id="swalAmtInp" class="swal-custom-input" placeholder="0" min="1" step="any">
              <span class="swal-input-badge">${isAr ? 'ط¬.ظ…' : 'EGP'}</span>
            </div>
          </div>

          <!-- Col 2: Date -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalDateInp">
              <i class="fa-regular fa-calendar" style="color: var(--primary);"></i>
              <span>${isAr ? 'طھط§ط±ظٹط® ط§ظ„ط¹ظ…ظ„ظٹط©' : 'Transaction Date'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="date" id="swalDateInp" class="swal-custom-input" value="${nowDateStr()}">
            </div>
          </div>

          <!-- Col 1 (Row 2): Reason / Purpose -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalReasonInp">
              <i class="fa-solid fa-file-pen" style="color: var(--primary);"></i>
              <span>${isAr ? 'ط§ظ„ط¨ظٹط§ظ† / ط³ط¨ط¨ ط§ظ„طµط±ظپ ط£ظˆ ط§ظ„ط³ط­ط¨' : 'Reason / Purpose'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="text" id="swalReasonInp" class="swal-custom-input" placeholder="${isWithdrawal ? (isAr ? 'ظ…ط«ط§ظ„: ط³ط­ط¨ ط£ط±ط¨ط§ط­ ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط±' : 'e.g. Owner profit withdrawal') : (isAr ? 'ظ…ط«ط§ظ„: ظپظˆط§طھظٹط± ظƒظ‡ط±ط¨ط§ط، / ط·ط¨ط§ط¹ط© ظ…ط°ظƒط±ط§طھ' : 'e.g. Electricity bill, paper printing')}">
            </div>
          </div>

          <!-- Col 2 (Row 2): Vault Selection -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalMethodInp">
              <i class="fa-solid fa-vault" style="color: var(--primary);"></i>
              <span>${isAr ? 'ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…ط³ط­ظˆط¨ ظ…ظ†ظ‡ط§' : 'Source Vault'}</span>
            </label>
            <div class="swal-input-wrapper">
              <select id="swalMethodInp" class="swal-custom-select">
                <option value="cash">${isAr ? 'ط¯ط±ط¬ ط§ظ„ظƒط§ط´ (ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ†ظ‚ط¯ظٹط©)' : 'Cash Drawer (Vault)'}</option>
                <option value="wallet">${isAr ? 'ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´ (ط§ظ„ظ…ط­ط§ظپط¸ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹط©)' : 'Vodafone Cash (E-Wallet)'}</option>
                <option value="instapay">${isAr ? 'ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ (InstaPay)' : 'InstaPay Account'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: `<i class="fa-solid fa-check"></i> ${isAr ? "ط­ظپط¸ ظˆطھظˆط«ظٹظ‚ ط§ظ„ط­ط±ظƒط©" : "Save Transaction"}`,
    cancelButtonText: `<i class="fa-solid fa-xmark"></i> ${isAr ? "ط¥ظ„ط؛ط§ط،" : "Cancel"}`,
    focusConfirm: false,
    didOpen: (popup) => {
      const cardExp = popup.querySelector('#cardTypeExpense');
      const cardWth = popup.querySelector('#cardTypeWithdrawal');
      const radExp = cardExp?.querySelector('input');
      const radWth = cardWth?.querySelector('input');
      const reasonInp = popup.querySelector('#swalReasonInp');
      const headerIcon = popup.querySelector('#swalHeaderIcon');
      const headerTitle = popup.querySelector('#swalHeaderTitle');
      const headerSubtitle = popup.querySelector('#swalHeaderSubtitle');

      function setType(type) {
        if (type === 'expense') {
          if (radExp) radExp.checked = true;
          if (radWth) radWth.checked = false;
          cardExp?.classList.add('active-expense');
          cardWth?.classList.remove('active-withdrawal');
          if (headerIcon) {
            headerIcon.className = 'swal-expense-icon is-expense';
            headerIcon.innerHTML = '<i class="fa-solid fa-receipt"></i>';
          }
          if (headerTitle) headerTitle.textContent = isAr ? 'طھط³ط¬ظٹظ„ ظ…طµط±ظˆظپ طھط´ط؛ظٹظ„ظٹ ظ„ظ„ط³ظ†طھط±' : 'Record Center Expense';
          if (headerSubtitle) headerSubtitle.textContent = isAr ? 'طھظˆط«ظٹظ‚ ظپظˆط§طھظٹط± ظˆظ…طµط±ظˆظپط§طھ ط§ظ„طھط´ط؛ظٹظ„ ط§ظ„ظ…ظٹط¯ط§ظ†ظٹط© ظˆط®طµظ…ظ‡ط§ ظ…ظ† ط§ظ„ط®ط²ط§ط¦ظ†' : 'Track daily operational expenses and update vault balances';
          if (reasonInp) reasonInp.placeholder = isAr ? 'ظ…ط«ط§ظ„: ظپظˆط§طھظٹط± ظƒظ‡ط±ط¨ط§ط، / ط·ط¨ط§ط¹ط© ظ…ط°ظƒط±ط§طھ' : 'e.g. Electricity bill, paper printing';
        } else {
          if (radWth) radWth.checked = true;
          if (radExp) radExp.checked = false;
          cardWth?.classList.add('active-withdrawal');
          cardExp?.classList.remove('active-expense');
          if (headerIcon) {
            headerIcon.className = 'swal-expense-icon is-withdrawal';
            headerIcon.innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i>';
          }
          if (headerTitle) headerTitle.textContent = isAr ? 'طھط³ط¬ظٹظ„ ظ…ط³ط­ظˆط¨ط§طھ ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط±' : 'Record Owner Withdrawal';
          if (headerSubtitle) headerSubtitle.textContent = isAr ? 'طھظˆط«ظٹظ‚ ط§ظ„ط³ط­ظˆط¨ط§طھ ظˆط§ظ„ط£ط±ط¨ط§ط­ ط§ظ„ط®ط§طµط© ظپظˆط±ظٹط§ظ‹ ظ…ظ† ط§ظ„ط®ط²ط§ط¦ظ†' : 'Document center withdrawals directly from vaults';
          if (reasonInp) reasonInp.placeholder = isAr ? 'ظ…ط«ط§ظ„: ط³ط­ط¨ ط£ط±ط¨ط§ط­ ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط±' : 'e.g. Owner profit withdrawal';
        }
      }

      cardExp?.addEventListener('click', () => setType('expense'));
      cardWth?.addEventListener('click', () => setType('withdrawal'));

      const amtInp = popup.querySelector('#swalAmtInp');
      if (amtInp) {
        setTimeout(() => amtInp.focus(), 150);
      }
    },
    preConfirm: () => {
      const type = document.querySelector('input[name="swalTxType"]:checked')?.value || 'expense';
      const amount = Number(document.getElementById('swalAmtInp')?.value || 0);
      const reason = document.getElementById('swalReasonInp')?.value.trim();
      const method = document.getElementById('swalMethodInp')?.value || 'cash';
      const date = document.getElementById('swalDateInp')?.value || nowDateStr();

      if (!amount || amount <= 0) {
        Swal.showValidationMessage(isAr ? "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط¨ظ„ط؛ طµط­ظٹط­ ط£ظƒط¨ط± ظ…ظ† طµظپط±" : "Please enter a valid amount");
        return false;
      }
      if (!reason) {
        Swal.showValidationMessage(isAr ? "ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ط³ط¨ط¨ ط£ظˆ ط¨ظٹط§ظ† ط§ظ„ط¹ظ…ظ„ظٹط©" : "Please enter the reason/purpose");
        return false;
      }
      return { type, amount, reason, method, date };
    }
  });

  if (formValues) {
    await window.saveTransactionRecord(formValues);
  }
};

window.saveTransactionRecord = async function({ type, amount, reason, method, date }) {
  const isAr = (currentLang === "ar");
  const newTx = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: type || 'expense',
    amount: Number(amount) || 0,
    reason: reason || '',
    method: method || 'cash',
    date: date || nowDateStr(),
    timestamp: Date.now()
  };

  if (!Array.isArray(expensesByDate)) expensesByDate = [];
  expensesByDate.push(newTx);

  const expObj = {};
  expensesByDate.forEach(e => {
    if (!e) return;
    const k = e.date || date;
    if (!expObj[k]) expObj[k] = [];
    expObj[k].push({
      id: e.id || `tx_${e.timestamp || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      amount: Number(e.amount) || 0,
      reason: e.reason || '',
      method: e.method || 'cash',
      type: e.type || (e.isWithdrawal ? 'withdrawal' : 'expense'),
      recipient: e.recipient || '',
      date: k,
      timestamp: e.timestamp || Date.now()
    });
  });

  try {
    await saveCenterConfig({ expenses_by_date: expObj });
    showToast(isAr ? "طھظ… ط­ظپط¸ ظˆطھظˆط«ظٹظ‚ ط§ظ„ط­ط±ظƒط© ط¨ظ†ط¬ط§ط­" : "Transaction saved successfully", "success");
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    if (typeof window.loadDailyReport === 'function') window.loadDailyReport(date);
  } catch(e) {
    console.error("saveTransactionRecord Error:", e);
    showToast(isAr ? "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط­ظپط¸" : "Error saving transaction", "err");
  }
};

window.deleteTermTransaction = async function(rawId) {
  // âڑ ï¸ڈ DISABLED: Expense/Withdrawal deletion is permanently locked for accountability.
  console.warn('[SECURITY] deleteTermTransaction is disabled â€” financial records cannot be deleted.');
  return;
  const isAr = (currentLang === "ar");
  const result = await Swal.fire({
    title: isAr ? "طھط£ظƒظٹط¯ ط­ط°ظپ ط§ظ„ط­ط±ظƒط©" : "Confirm Deletion",
    text: isAr ? "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ظ‡ ط§ظ„ظ…ط¹ط§ظ…ظ„ط©طں ط³ظٹطھظ… ط§ط³طھط±ط¬ط§ط¹ ط§ظ„ط±طµظٹط¯ ظˆطھط­ط¯ظٹط« ط§ظ„ط®ط²ط§ط¦ظ† ظپظˆط±ظٹط§ظ‹." : "Are you sure you want to delete this transaction? Vault balances will update immediately.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: isAr ? "ظ†ط¹ظ…طŒ ط­ط°ظپ ط§ظ„ط¢ظ†" : "Yes, delete",
    cancelButtonText: isAr ? "ط¥ظ„ط؛ط§ط،" : "Cancel",
    confirmButtonColor: "#ef4444"
  });

  if (!result.isConfirmed) return;

  if (Array.isArray(expensesByDate)) {
    const idx = expensesByDate.findIndex(e => (e.id === rawId || String(e.timestamp) === rawId));
    if (idx !== -1) {
      expensesByDate.splice(idx, 1);
    }
  }

  const expObj = {};
  expensesByDate.forEach(e => {
    if (!e) return;
    const k = e.date || nowDateStr();
    if (!expObj[k]) expObj[k] = [];
    expObj[k].push({
      id: e.id || `tx_${e.timestamp || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      amount: Number(e.amount) || 0,
      reason: e.reason || '',
      method: e.method || 'cash',
      type: e.type || (e.isWithdrawal ? 'withdrawal' : 'expense'),
      recipient: e.recipient || '',
      date: k,
      timestamp: e.timestamp || Date.now()
    });
  });

  try {
    await saveCenterConfig({ expenses_by_date: expObj });
    showToast(isAr ? "طھظ… ط­ط°ظپ ط§ظ„ط­ط±ظƒط© ظˆطھط­ط¯ظٹط« ط§ظ„ط®ط²ط§ط¦ظ†" : "Transaction deleted and vaults updated", "success");
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    const dInput = document.getElementById("adminDailyDateInput");
    if (typeof window.loadDailyReport === 'function') window.loadDailyReport(dInput ? dInput.value : nowDateStr());
  } catch(e) {
    console.error("deleteTermTransaction Error:", e);
    showToast(isAr ? "ظپط´ظ„ ط­ط°ظپ ط§ظ„ط­ط±ظƒط©" : "Failed to delete transaction", "err");
  }
};

// ========================================================
// 9. SYLLABUS MAP
// ========================================================
window.renderAdminSyllabus = function() {
  const container = document.getElementById("adminSyllabusTimelineContainer");
  if (!container) return;

  const isAr = (currentLang === "ar");
  if (syllabusList.length === 0) {
    container.innerHTML = `<div style="color:var(--text-secondary); text-align:center; padding:20px;">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط¯ط±ظˆط³ ظ…ط³ط¬ظ„ط© ظپظٹ ط®ط·ط© ط§ظ„ظ…ظ†ظ‡ط¬ ط­طھظ‰ ط§ظ„ط¢ظ†." : "No lessons registered in the syllabus roadmap yet."}</div>`;
    return;
  }

  let html = "";
  syllabusList.forEach((s, idx) => {
    let statusBadge = isAr ? "ظ„ظ… ظٹط¨ط¯ط£" : "Not Started";
    let badgeColor = "var(--text-secondary)";
    if (s.status === "completed") { statusBadge = isAr ? "طھظ… ط§ظ„ط§ظ†طھظ‡ط§ط،" : "Completed"; badgeColor = "var(--success)"; }
    else if (s.status === "in_progress") { statusBadge = isAr ? "ط¬ط§ط±ظٹ ط§ظ„ط´ط±ط­" : "In Progress"; badgeColor = "var(--warning)"; }

    html += `
      <div class="syllabus-item-card ${s.status}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1.05em;">${s.title || s.name}</div>
          <span style="font-size:0.82em; color:${badgeColor}; font-weight:700;">${statusBadge}</span>
          ${s.notes ? `<p style="font-size:0.82em; color:var(--text-secondary); margin-top:4px;">${isAr ? 'ظ…ظ„ط§ط­ط¸ط§طھ:' : 'Notes:'} ${s.notes}</p>` : ''}
        </div>
        <button class="btn danger smallBtn" onclick="window.deleteSyllabusLesson(${idx})" title="${isAr ? 'ط­ط°ظپ ط§ظ„ط¯ط±ط³' : 'Delete Lesson'}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });
  container.innerHTML = html;
};

window.saveSyllabusLesson = async function() {
  const title = document.getElementById("syllabusLessonName")?.value.trim();
  const status = document.getElementById("syllabusLessonStatus")?.value || "not_started";
  const notes = document.getElementById("syllabusLessonNotes")?.value.trim() || "";

  if (!title) return showToast("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¯ط±ط³ / ط§ظ„ظپطµظ„", "err");

  const newLesson = { title, name: title, status, notes, updated_at: new Date().toISOString() };
  syllabusList.push(newLesson);

  try {
    await saveCenterConfig({ syllabus: syllabusList, syllabus_data: syllabusList });
    if (permChannel) {
      try { permChannel.postMessage({ type: 'SYLLABUS_UPDATED' }); } catch(e) {}
    }
    showToast("طھظ…طھ ط¥ط¶ط§ظپط© ط§ظ„ط¯ط±ط³ ظ„ط®ط±ظٹط·ط© ط§ظ„ظ…ظ†ظ‡ط¬", "success");
    document.getElementById("syllabusLessonName").value = "";
    document.getElementById("syllabusLessonNotes").value = "";
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

window.deleteSyllabusLesson = async function(idx) {
  syllabusList.splice(idx, 1);
  try {
    await saveCenterConfig({ syllabus: syllabusList, syllabus_data: syllabusList });
    if (permChannel) {
      try { permChannel.postMessage({ type: 'SYLLABUS_UPDATED' }); } catch(e) {}
    }
    showToast("طھظ… ط­ط°ظپ ط§ظ„ط¯ط±ط³ ظ…ظ† ط§ظ„ظ…ظ†ظ‡ط¬", "info");
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

// ========================================================
// 11. ADVANCED SETTINGS & BACKUP
// ========================================================
window.exportAllDataToExcel = async function() {
  const isAr = (currentLang === "ar");
  if (typeof XLSX === 'undefined') {
    showToast(isAr ? "ظ…ظƒطھط¨ط© Excel ط؛ظٹط± ظ…طھظˆظپط±ط©" : "Excel library not loaded", "err");
    return;
  }

  showToast(isAr ? "ط¬ط§ط±ظٹ طھط¬ظ…ظٹط¹ ظˆظ‚ط±ط§ط،ط© ظƒط§ظپط© ط¨ظٹط§ظ†ط§طھ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† ط§ظ„ط³ظٹط±ظپط±..." : "Exporting full database from server...", "info");

  try {
    // 1. Fetch fresh, complete data directly from Supabase in parallel
    let stData = [], pkgData = [], bklData = [], asstData = [], sRow = {};
    if (supabase) {
      const [stRes, pkgRes, bklRes, asstRes, setRes] = await Promise.all([
        supabase.from('students').select('*').order('id', { ascending: true }),
        supabase.from('packages').select('*'),
        supabase.from('booklets').select('*'),
        supabase.from('assistants').select('*'),
        supabase.from('settings').select('*').eq('id', 1).maybeSingle()
      ]);
      stData = (stRes && stRes.data) || [];
      pkgData = (pkgRes && pkgRes.data) || [];
      bklData = (bklRes && bklRes.data) || [];
      asstData = (asstRes && asstRes.data) || [];
      sRow = (setRes && setRes.data) || {};
    }

    // Fallback or merge with in-memory state if needed
    if (stData.length === 0 && typeof students === 'object') {
      stData = Object.values(students);
    }
    if (pkgData.length === 0 && typeof packages === 'object') {
      pkgData = Object.values(packages);
    }
    if (bklData.length === 0 && typeof booklets === 'object') {
      bklData = Object.values(booklets);
    }

    const cfg = sRow.config || {};
    const wb = XLSX.utils.book_new();

    // ==========================================
    // SHEET 1: ط§ظ„ط·ظ„ط§ط¨ (Students)
    // ==========================================
    const studentsSheet = [
      [
        "ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨",
        "ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨",
        "ط§ظ„طµظپ / ط§ظ„ظ…ط¬ظ…ظˆط¹ط©",
        "ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ",
        "ظ‡ط§طھظپ ظˆظ„ظٹ ط§ظ„ط£ظ…ط±",
        "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹",
        "ظ‚ظٹظ…ط© ط§ظ„ط®طµظ…",
        "ظ†ط¸ط§ظ… ط§ظ„ط¯ظپط¹",
        "ط§ظ„ط¨ط§ظ‚ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط©",
        "ط§ظ„ط±طھط¨ط©",
        "ط§ظ„ط­ط§ظ„ط©",
        "طھظˆط§ط±ظٹط® ط§ظ„ط­ط¶ظˆط±",
        "ظ…ظ„ط§ط­ط¸ط§طھ",
        "طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،"
      ]
    ];
    stData.forEach(s => {
      const pList = Array.isArray(s.packages) ? s.packages.join(' | ') : (s.packages || '');
      const attList = Array.isArray(s.attendance_dates) ? s.attendance_dates.join(' , ') : (s.attendance_dates || '');
      const stRank = (cfg.student_ranks && cfg.student_ranks[s.id]) || s.rank || 'normal';
      studentsSheet.push([
        s.id || '',
        s.name || '',
        s.class_name || s.className || '',
        s.phone || '',
        s.parent_phone || s.parentPhone || '',
        Number(s.paid) || 0,
        Number(s.discount) || 0,
        s.payment_plan || s.paymentPlan || 'cash',
        pList,
        stRank,
        s.status || 'active',
        attList,
        s.notes || '',
        s.created_at || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(studentsSheet), "ط§ظ„ط·ظ„ط§ط¨");

    // ==========================================
    // SHEET 2: ط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط§ط´طھط±ط§ظƒط§طھ (Packages)
    // ==========================================
    const packagesSheet = [
      [
        "ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©",
        "ط§ظ„ظ…ط§ط¯ط©",
        "ط§ظ„ط³ط¹ط± ط§ظ„ط£ط³ط§ط³ظٹ",
        "ط³ط¹ط± ط§ظ„ظ‚ط³ط·",
        "ظٹظ‚ط¨ظ„ ط£ظ‚ط³ط§ط·",
        "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط­طµطµ",
        "طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،"
      ]
    ];
    pkgData.forEach(p => {
      packagesSheet.push([
        p.name || '',
        p.subject || '',
        Number(p.price) || 0,
        Number(p.installment_price || p.installmentPrice || p.price) || 0,
        (p.has_installments || p.hasInstallments) ? 'ظ†ط¹ظ…' : 'ظ„ط§',
        Number(p.session_limit || p.sessionLimit) || 8,
        p.created_at || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(packagesSheet), "ط§ظ„ط¨ط§ظ‚ط§طھ");

    // ==========================================
    // SHEET 3: ط§ظ„ظ…ط°ظƒط±ط§طھ ظˆط§ظ„ظ…ط®ط²ظ† (Booklets)
    // ==========================================
    const bookletsSheet = [
      [
        "ظƒظˆط¯ ط§ظ„ظ…ط°ظƒط±ط©",
        "ط§ط³ظ… ط§ظ„ظ…ط°ظƒط±ط©",
        "ط§ظ„طµظپ ط§ظ„ط¯ط±ط§ط³ظٹ",
        "ط³ط¹ط± ط§ظ„ط¨ظٹط¹",
        "طھظƒظ„ظپط© ط§ظ„ط·ط¨ط§ط¹ط©",
        "ط§ظ„ظƒظ…ظٹط© ط§ظ„ظ…طھط§ط­ط© ط¨ط§ظ„ظ…ط®ط²ظ†",
        "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط¨ط§ط¹"
      ]
    ];
    bklData.forEach(b => {
      bookletsSheet.push([
        b.id || '',
        b.title || b.name || '',
        b.grade || b.className || '',
        Number(b.price) || 0,
        Number(b.cost) || 0,
        Number(b.stock) || 0,
        Number(b.sold) || 0
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bookletsSheet), "ط§ظ„ظ…ط°ظƒط±ط§طھ");

    // ==========================================
    // SHEET 4: ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ† ظˆط§ظ„طµظ„ط§ط­ظٹط§طھ (Assistants)
    // ==========================================
    const assistantsSheet = [
      [
        "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…",
        "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±",
        "ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ",
        "ط§ظ„طµظ„ط§ط­ظٹط§طھ (JSON)",
        "طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،"
      ]
    ];
    asstData.forEach(a => {
      assistantsSheet.push([
        a.username || '',
        a.password || '',
        a.email || '',
        typeof a.permissions === 'object' ? JSON.stringify(a.permissions) : (a.permissions || '{}'),
        a.created_at || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assistantsSheet), "ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†");

    // ==========================================
    // SHEET 5: طھط­ظˆظٹظ„ط§طھ ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ط­ظٹط© (Vault Transfers)
    // ==========================================
    const vTransfers = Array.isArray(cfg.vault_transfers) ? cfg.vault_transfers : (vaultTransfers || []);
    const transfersSheet = [
      [
        "ظ…ط¹ط±ظپ ط§ظ„طھط­ظˆظٹظ„",
        "ط§ظ„طھط§ط±ظٹط®",
        "ط§ظ„طھظˆظ‚ظٹطھ",
        "ظ…ظ† ط®ط²ظٹظ†ط©",
        "ط¥ظ„ظ‰ ط®ط²ظٹظ†ط©",
        "ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¬ظ†ظٹظ‡",
        "ط§ظ„ط¨ظٹط§ظ† / ظ…ظ„ط§ط­ط¸ط§طھ",
        "ط§ظ„ظ…ط³ط¤ظˆظ„"
      ]
    ];
    const vNames = { cash: 'ط¯ط±ط¬ ط§ظ„ظƒط§ط´', instapay: 'ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ', wallet: 'ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´' };
    vTransfers.forEach(t => {
      transfersSheet.push([
        t.id || '',
        t.date || '',
        t.timestamp || '',
        vNames[t.from_vault] || t.from_vault || '',
        vNames[t.to_vault] || t.to_vault || '',
        Number(t.amount) || 0,
        t.note || '',
        t.created_by || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(transfersSheet), "طھط­ظˆظٹظ„ط§طھ ط§ظ„ط®ط²ط§ط¦ظ†");

    // ==========================================
    // SHEET 6: ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ (Expenses & Withdrawals)
    // ==========================================
    let expList = [];
    if (Array.isArray(cfg.expenses_by_date)) {
      expList = cfg.expenses_by_date;
    } else if (typeof cfg.expenses_by_date === 'object' && cfg.expenses_by_date) {
      for (const dKey in cfg.expenses_by_date) {
        const arr = cfg.expenses_by_date[dKey];
        if (Array.isArray(arr)) arr.forEach(item => { if (item) expList.push({ ...item, date: item.date || dKey }); });
      }
    } else if (Array.isArray(expensesByDate)) {
      expList = expensesByDate;
    }

    const expensesSheet = [
      [
        "ظ…ط¹ط±ظپ ط§ظ„ظ…ط¹ط§ظ…ظ„ط©",
        "ط§ظ„طھط§ط±ظٹط®",
        "ط¨ظ†ط¯ ط§ظ„ظ…طµط±ظˆظپ / ط§ظ„ط³ط¨ط¨",
        "ظ†ظˆط¹ ط§ظ„ظ…ط¹ط§ظ…ظ„ط©",
        "ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…طµط±ظˆظپ ظ…ظ†ظ‡ط§",
        "ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¬ظ†ظٹظ‡",
        "ط§ظ„طھظپط§طµظٹظ„",
        "ط§ظ„ظ…ط³ط¤ظˆظ„ / ط§ظ„ظ…ط³طھظ„ظ…"
      ]
    ];
    expList.forEach(e => {
      expensesSheet.push([
        e.id || '',
        e.date || '',
        e.category || e.reason || e.text || '',
        e.type === 'withdrawal' ? 'ظ…ط­ط³ظˆط¨ ظ„ظ„ظ…ط³طھط± (ظ…ط³ط­ظˆط¨ط§طھ)' : 'ظ…طµط±ظˆظپط§طھ ط³ظ†طھط± طھط´ط؛ظٹظ„ظٹط©',
        vNames[e.vault] || e.vault || 'ط¯ط±ط¬ ط§ظ„ظƒط§ط´',
        Number(e.amount) || 0,
        e.note || '',
        e.created_by || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expensesSheet), "ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ");

    // ==========================================
    // SHEET 7: ط³ط¬ظ„ ط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظٹظˆظ…ظٹط§طھ (Attendance & Daily)
    // ==========================================
    const allDates = new Set([
      ...Object.keys(cfg.revenue_by_date || revenueByDate || {}),
      ...Object.keys(cfg.att_by_date || attByDate || {}),
      ...Object.keys(cfg.daily_approval_map || dailyApprovalMap || {})
    ]);
    const dailySheet = [
      [
        "ط§ظ„طھط§ط±ظٹط®",
        "ط¥ط¬ظ…ط§ظ„ظٹ ط¥ظٹط±ط§ط¯ ط§ظ„ظٹظˆظ…ظٹط© (ط¬)",
        "ط¹ط¯ط¯ ط§ظ„ط­ط¶ظˆط± ط§ظ„ظٹظˆظ…ظٹ",
        "ط­ط§ظ„ط© ط§ظ„ط´ظٹظپطھ ظˆط§ظ„ط§ط¹طھظ…ط§ط¯",
        "طھط§ط±ظٹط® ط¢ط®ط± ط§ط¹طھظ…ط§ط¯"
      ]
    ];
    Array.from(allDates).sort().reverse().forEach(d => {
      const rev = Number((cfg.revenue_by_date || revenueByDate || {})[d]) || 0;
      const attCount = Array.isArray((cfg.att_by_date || attByDate || {})[d]) ? (cfg.att_by_date || attByDate)[d].length : 0;
      const appInfo = (cfg.daily_approval_map || dailyApprovalMap || {})[d];
      const statusStr = appInfo ? (appInfo.status === 'approved' ? 'ظ…ط¹طھظ…ط¯ ظˆظ…ط؛ظ„ظ‚' : 'ظ…ط¹ظ„ظ‚') : 'ظ…ظپطھظˆط­';
      dailySheet.push([
        d,
        rev,
        attCount,
        statusStr,
        appInfo && appInfo.updated_at ? appInfo.updated_at : ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dailySheet), "ط§ظ„ظٹظˆظ…ظٹط§طھ ظˆط§ظ„ط§ط¹طھظ…ط§ط¯ط§طھ");

    // ==========================================
    // SHEET 8: ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ… ظˆط§ظ„ظ†ط³ط® (System Config)
    // ==========================================
    const settingsSheet = [
      ["ظ…ظپطھط§ط­ ط§ظ„ط¥ط¹ط¯ط§ط¯", "ط§ظ„ظ‚ظٹظ…ط©", "ط§ظ„ظˆطµظپ"],
      ["shift_system_enabled", cfg.shift_system_enabled !== false ? "ظ…ظپط¹ظ„ (ON)" : "ظ…ط¹ط·ظ„ (OFF)", "ط­ط§ظ„ط© ظ…ظٹط²ط© ظ†ط¸ط§ظ… ط§ظ„ط´ظٹظپطھط§طھ ظˆط§ظ„ط§ط¹طھظ…ط§ط¯ ط§ظ„ظٹظˆظ…ظٹ"],
      ["daily_shift_status", sRow.daily_shift_status || 'open', "ط§ظ„ط­ط§ظ„ط© ط§ظ„ط¹ط§ظ…ط© ظ„ظ„ط´ظٹظپطھ ط§ظ„ظٹظˆظ…ظٹ"],
      ["backup_date", nowDateStr(), "طھط§ط±ظٹط® طھطµط¯ظٹط± ظ‡ط°ظ‡ ط§ظ„ظ†ط³ط®ط© ط§ظ„ط§ط­طھظٹط§ط·ظٹط©"],
      ["total_students", stData.length, "ط¥ط¬ظ…ط§ظ„ظٹ ط¹ط¯ط¯ ط§ظ„ط·ظ„ط§ط¨ ط§ظ„ظ…ط³ط¬ظ„ظٹظ† ط¨ط§ظ„ظ†ط³ط®ط©"],
      ["total_packages", pkgData.length, "ط¥ط¬ظ…ط§ظ„ظٹ ط¹ط¯ط¯ ط§ظ„ط¨ط§ظ‚ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط©"],
      ["total_transfers", vTransfers.length, "ط¥ط¬ظ…ط§ظ„ظٹ طھط­ظˆظٹظ„ط§طھ ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ظ…ط³ط¬ظ„ط©"],
      ["total_expenses", expList.length, "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط©"]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsSheet), "ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ…");

    // Download File
    const fileName = `Studify_Full_Database_Backup_${nowDateStr()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    showToast(isAr ? `طھظ… طھطµط¯ظٹط± ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظƒط§ظ…ظ„ط© ط¨ظ†ط¬ط§ط­ (${stData.length} ط·ط§ظ„ط¨طŒ ${pkgData.length} ط¨ط§ظ‚ط©طŒ ${vTransfers.length} طھط­ظˆظٹظ„)` : "Full database exported successfully", "success");
  } catch(e) {
    console.error("exportAllDataToExcel error:", e);
    showToast(isAr ? "ظپط´ظ„ طھطµط¯ظٹط± ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظƒط§ظ…ظ„ط©: " + e.message : "Export failed", "err");
  }
};

window.importDataFromExcel = async function(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    return showToast("ظ…ظƒطھط¨ط© Excel ط؛ظٹط± ظ…طھظˆظپط±ط©", "err");
  }

  const isAr = (currentLang === "ar");
  const confirmRes = await Swal.fire({
    title: isAr ? 'ط§ط³طھظٹط±ط§ط¯ ظˆط§ط³طھط±ط¬ط§ط¹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† Excel' : 'Import Full Database from Excel',
    html: isAr 
      ? `<div style="text-align: right; line-height: 1.8;">
           <p style="font-weight: 700; margin-bottom: 8px;">ظ‡ظ„ طھط±ظٹط¯ ظپط­طµ ظˆط§ط³طھظٹط±ط§ط¯ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† ظ‡ط°ط§ ط§ظ„ظ…ظ„ظپطں</p>
           <p style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 6px;">ط³ظٹظ‚ظˆظ… ط§ظ„ظ†ط¸ط§ظ… ط¨ظ‚ط±ط§ط،ط© ظƒط§ظپط© ط§ظ„ط´ظٹطھط§طھ ط§ظ„ظ…ظˆط¬ظˆط¯ط© ط¨ط§ظ„ظ…ظ„ظپ:</p>
           <ul style="color: var(--text-secondary); font-size: 0.88em; padding-right: 20px; margin: 0;">
             <li>طھط­ط¯ظٹط« ظˆط¥ط¶ط§ظپط© ط§ظ„ط·ظ„ط§ط¨ ظˆط¨ظٹط§ظ†ط§طھظ‡ظ… ط§ظ„ظ…ط§ظ„ظٹط©</li>
             <li>طھط­ط¯ظٹط« ط¨ط§ظ‚ط§طھ ظˆط§ط´طھط±ط§ظƒط§طھ ط§ظ„ط³ظ†طھط±</li>
             <li>ط§ط³طھط±ط¬ط§ط¹ طھط­ظˆظٹظ„ط§طھ ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ط­ظٹط©</li>
             <li>ط§ط³طھط±ط¬ط§ط¹ ط³ط¬ظ„ ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ</li>
             <li>ط§ط³طھط±ط¬ط§ط¹ ط­ط³ط§ط¨ط§طھ ظˆطµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†</li>
           </ul>
         </div>`
      : '<p>Merge and restore database tables from this workbook? Existing records will be updated and new ones added.</p>',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ ظپط­طµ ظˆط§ط³طھظٹط±ط§ط¯ ط§ظ„ط¨ظٹط§ظ†ط§طھ' : 'Yes, Import Data',
    confirmButtonColor: '#2563EB',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
  });

  if (!confirmRes.isConfirmed) {
    event.target.value = '';
    return;
  }

  try {
    showToast(isAr ? "ط¬ط§ط±ظٹ ظ‚ط±ط§ط،ط© ظˆطھط­ظ„ظٹظ„ ظ…ظ„ظپ Excel..." : "Reading Excel file...", "info");
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });

    let importedStudents = 0;
    let importedPackages = 0;
    let importedAssistants = 0;
    let importedTransfers = 0;
    let importedExpenses = 0;

    // Helper: Find sheet by keywords
    const findSheet = (keywords) => {
      return wb.SheetNames.find(name => {
        const lower = name.toLowerCase();
        return keywords.some(kw => lower.includes(kw.toLowerCase()));
      });
    };

    // 1. IMPORT STUDENTS
    const stSheetName = findSheet(['ط·ظ„ط§ط¨', 'student', 'Sheet1']);
    if (stSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[stSheetName]);
      const studentRowsToUpsert = [];

      rows.forEach(r => {
        const id = String(r['ظƒظˆط¯ ط§ظ„ط·ط§ظ„ط¨'] || r['ظƒظˆط¯'] || r['id'] || r['ID'] || r['Code'] || '').trim();
        const name = String(r['ط§ط³ظ… ط§ظ„ط·ط§ظ„ط¨'] || r['ط§ظ„ط§ط³ظ…'] || r['name'] || r['Name'] || '').trim();
        if (!id && !name) return;

        const studentId = id || String(Date.now() + Math.floor(Math.random() * 1000));
        const phone = String(r['ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ'] || r['ط§ظ„ظ…ظˆط¨ط§ظٹظ„'] || r['ط§ظ„ظ‡ط§طھظپ'] || r['phone'] || r['Phone'] || '').trim();
        const parentPhone = String(r['ظ‡ط§طھظپ ظˆظ„ظٹ ط§ظ„ط£ظ…ط±'] || r['ظˆظ„ظٹ ط§ظ„ط£ظ…ط±'] || r['parentPhone'] || r['parent_phone'] || '').trim();
        const className = String(r['ط§ظ„طµظپ / ط§ظ„ظ…ط¬ظ…ظˆط¹ط©'] || r['ط§ظ„ظ…ط¬ظ…ظˆط¹ط©'] || r['ط§ظ„طµظپ'] || r['className'] || r['class_name'] || '').trim();
        const paid = Number(r['ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹'] || r['ط§ظ„ظ…ط¯ظپظˆط¹'] || r['paid'] || 0) || 0;
        const discount = Number(r['ظ‚ظٹظ…ط© ط§ظ„ط®طµظ…'] || r['ط§ظ„ط®طµظ…'] || r['discount'] || 0) || 0;
        const paymentPlan = String(r['ظ†ط¸ط§ظ… ط§ظ„ط¯ظپط¹'] || r['payment_plan'] || r['paymentPlan'] || 'cash').trim();
        const status = String(r['ط§ظ„ط­ط§ظ„ط©'] || r['status'] || 'active').trim();
        const notes = String(r['ظ…ظ„ط§ط­ط¸ط§طھ'] || r['notes'] || '').trim();

        // Packages parsing
        const rawPkgs = r['ط§ظ„ط¨ط§ظ‚ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط©'] || r['ط§ظ„ط¨ط§ظ‚ط§طھ'] || r['packages'] || '';
        let pkgs = [];
        if (typeof rawPkgs === 'string' && rawPkgs.trim()) {
          pkgs = rawPkgs.split(/[|,]/).map(p => p.trim()).filter(Boolean);
        } else if (Array.isArray(rawPkgs)) {
          pkgs = rawPkgs;
        }

        const existing = (typeof students === 'object' && students[studentId]) || {};
        const updated = {
          ...existing,
          id: studentId,
          name: name || existing.name || '',
          phone: phone || existing.phone || '',
          parentPhone: parentPhone || existing.parentPhone || '',
          className: className || existing.className || '',
          paid: paid !== 0 ? paid : (existing.paid || 0),
          discount: discount !== 0 ? discount : (existing.discount || 0),
          paymentPlan: paymentPlan || existing.paymentPlan || 'cash',
          packages: pkgs.length > 0 ? pkgs : (existing.packages || []),
          status: status === 'ظ…ط­ط°ظˆظپ' || status === 'deleted' ? 'deleted' : 'active',
          notes: notes || existing.notes || '',
          lastModified: Date.now()
        };

        if (typeof students === 'object') students[studentId] = updated;

        studentRowsToUpsert.push({
          id: studentId,
          name: updated.name,
          phone: updated.phone,
          parent_phone: updated.parentPhone,
          class_name: updated.className,
          paid: updated.paid,
          discount: updated.discount,
          payment_plan: updated.paymentPlan,
          packages: updated.packages,
          status: updated.status,
          notes: updated.notes,
          last_modified: updated.lastModified
        });
        importedStudents++;
      });

      if (supabase && studentRowsToUpsert.length > 0) {
        for (let i = 0; i < studentRowsToUpsert.length; i += 50) {
          const chunk = studentRowsToUpsert.slice(i, i + 50);
          await supabase.from('students').upsert(chunk, { onConflict: 'id' });
        }
      }
    }

    // 2. IMPORT PACKAGES
    const pkgSheetName = findSheet(['ط¨ط§ظ‚ط§طھ', 'package']);
    if (pkgSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[pkgSheetName]);
      const pkgRowsToUpsert = [];
      rows.forEach(r => {
        const name = String(r['ط§ط³ظ… ط§ظ„ط¨ط§ظ‚ط©'] || r['ط§ظ„ط§ط³ظ…'] || r['name'] || '').trim();
        if (!name) return;
        const subject = String(r['ط§ظ„ظ…ط§ط¯ط©'] || r['subject'] || name).trim();
        const price = Number(r['ط§ظ„ط³ط¹ط± ط§ظ„ط£ط³ط§ط³ظٹ'] || r['ط§ظ„ط³ط¹ط±'] || r['price'] || 0) || 0;
        const instPrice = Number(r['ط³ط¹ط± ط§ظ„ظ‚ط³ط·'] || r['installment_price'] || price) || price;
        const hasInst = String(r['ظٹظ‚ط¨ظ„ ط£ظ‚ط³ط§ط·'] || r['has_installments'] || '').includes('ظ†ط¹ظ…') || r['has_installments'] === true;
        const sessionLimit = Number(r['ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط­طµطµ'] || r['session_limit'] || 8) || 8;

        pkgRowsToUpsert.push({
          name,
          subject,
          price,
          installment_price: instPrice,
          has_installments: hasInst,
          session_limit: sessionLimit,
          created_at: new Date().toISOString()
        });
        importedPackages++;
      });

      if (supabase && pkgRowsToUpsert.length > 0) {
        await supabase.from('packages').upsert(pkgRowsToUpsert, { onConflict: 'name' });
      }
    }

    // 3. IMPORT ASSISTANTS
    const asstSheetName = findSheet(['ظ…ط³ط§ط¹ط¯ظٹظ†', 'assistant']);
    if (asstSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[asstSheetName]);
      const asstRowsToUpsert = [];
      rows.forEach(r => {
        const username = String(r['ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…'] || r['username'] || '').trim();
        if (!username) return;
        const password = String(r['ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±'] || r['password'] || '123456').trim();
        const email = String(r['ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ'] || r['email'] || `${username}@studify.com`).trim();
        let permissions = {};
        try {
          const rawPerm = r['ط§ظ„طµظ„ط§ط­ظٹط§طھ (JSON)'] || r['ط§ظ„طµظ„ط§ط­ظٹط§طھ'] || r['permissions'];
          if (typeof rawPerm === 'string' && rawPerm.startsWith('{')) permissions = JSON.parse(rawPerm);
        } catch(e) {}

        asstRowsToUpsert.push({
          username,
          password,
          email,
          permissions,
          created_at: new Date().toISOString()
        });
        importedAssistants++;
      });

      if (supabase && asstRowsToUpsert.length > 0) {
        await supabase.from('assistants').upsert(asstRowsToUpsert, { onConflict: 'username' });
      }
    }

    // 4. IMPORT TRANSFERS & EXPENSES INTO SETTINGS CONFIG
    const transSheetName = findSheet(['طھط­ظˆظٹظ„ط§طھ', 'transfer']);
    const expSheetName = findSheet(['ظ…طµط±ظˆظپط§طھ', 'ظ…ط³ط­ظˆط¨ط§طھ', 'expense']);
    
    if (transSheetName || expSheetName) {
      if (supabase) {
        const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = curSettings?.config || {};
        let cfgModified = false;

        // Transfers
        if (transSheetName) {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[transSheetName]);
          const existingTransfers = Array.isArray(cfg.vault_transfers) ? cfg.vault_transfers : [];
          const existingIds = new Set(existingTransfers.map(t => t.id));

          rows.forEach(r => {
            const id = String(r['ظ…ط¹ط±ظپ ط§ظ„طھط­ظˆظٹظ„'] || r['id'] || `vt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`).trim();
            if (existingIds.has(id)) return;

            const fromVRaw = String(r['ظ…ظ† ط®ط²ظٹظ†ط©'] || r['from_vault'] || '').toLowerCase();
            const toVRaw = String(r['ط¥ظ„ظ‰ ط®ط²ظٹظ†ط©'] || r['to_vault'] || '').toLowerCase();
            const fromV = fromVRaw.includes('ط¥ظ†ط³طھط§') || fromVRaw.includes('insta') ? 'instapay' : (fromVRaw.includes('ظپظˆط¯ط§ظپظˆظ†') || fromVRaw.includes('wallet') ? 'wallet' : 'cash');
            const toV = toVRaw.includes('ط¥ظ†ط³طھط§') || toVRaw.includes('insta') ? 'instapay' : (toVRaw.includes('ظپظˆط¯ط§ظپظˆظ†') || toVRaw.includes('wallet') ? 'wallet' : 'cash');
            const amount = Number(r['ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¬ظ†ظٹظ‡'] || r['ط§ظ„ظ…ط¨ظ„ط؛'] || r['amount'] || 0) || 0;
            if (amount <= 0) return;

            existingTransfers.push({
              id,
              date: String(r['ط§ظ„طھط§ط±ظٹط®'] || r['date'] || nowDateStr()),
              timestamp: String(r['ط§ظ„طھظˆظ‚ظٹطھ'] || r['timestamp'] || ''),
              from_vault: fromV,
              to_vault: toV,
              amount,
              note: String(r['ط§ظ„ط¨ظٹط§ظ† / ظ…ظ„ط§ط­ط¸ط§طھ'] || r['ط§ظ„ط¨ظٹط§ظ†'] || r['note'] || ''),
              created_by: String(r['ط§ظ„ظ…ط³ط¤ظˆظ„'] || r['created_by'] || 'Admin')
            });
            existingIds.add(id);
            importedTransfers++;
          });

          cfg.vault_transfers = existingTransfers;
          vaultTransfers = existingTransfers;
          cfgModified = true;
        }

        // Expenses
        if (expSheetName) {
          const rows = XLSX.utils.sheet_to_json(wb.Sheets[expSheetName]);
          let existingExpenses = [];
          if (Array.isArray(cfg.expenses_by_date)) {
            existingExpenses = cfg.expenses_by_date;
          } else if (typeof cfg.expenses_by_date === 'object' && cfg.expenses_by_date) {
            for (const dk in cfg.expenses_by_date) {
              const arr = cfg.expenses_by_date[dk];
              if (Array.isArray(arr)) arr.forEach(item => { if (item) existingExpenses.push({ ...item, date: item.date || dk }); });
            }
          }
          const existingIds = new Set(existingExpenses.map(e => e.id));

          rows.forEach(r => {
            const id = String(r['ظ…ط¹ط±ظپ ط§ظ„ظ…ط¹ط§ظ…ظ„ط©'] || r['id'] || `tx_${Date.now()}_${Math.random().toString(36).slice(2,6)}`).trim();
            if (existingIds.has(id)) return;

            const vRaw = String(r['ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…طµط±ظˆظپ ظ…ظ†ظ‡ط§'] || r['vault'] || '').toLowerCase();
            const vault = vRaw.includes('ط¥ظ†ط³طھط§') || vRaw.includes('insta') ? 'instapay' : (vRaw.includes('ظپظˆط¯ط§ظپظˆظ†') || vRaw.includes('wallet') ? 'wallet' : 'cash');
            const typeRaw = String(r['ظ†ظˆط¹ ط§ظ„ظ…ط¹ط§ظ…ظ„ط©'] || r['type'] || '').toLowerCase();
            const type = typeRaw.includes('ظ…ط³طھط±') || typeRaw.includes('ظ…ط³ط­ظˆط¨ط§طھ') || typeRaw.includes('withdrawal') ? 'withdrawal' : 'expense';
            const amount = Number(r['ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¬ظ†ظٹظ‡'] || r['ط§ظ„ظ…ط¨ظ„ط؛'] || r['amount'] || 0) || 0;
            if (amount <= 0) return;

            existingExpenses.push({
              id,
              date: String(r['ط§ظ„طھط§ط±ظٹط®'] || r['date'] || nowDateStr()),
              category: String(r['ط¨ظ†ط¯ ط§ظ„ظ…طµط±ظˆظپ / ط§ظ„ط³ط¨ط¨'] || r['category'] || r['reason'] || ''),
              type,
              vault,
              amount,
              note: String(r['ط§ظ„طھظپط§طµظٹظ„'] || r['note'] || ''),
              created_by: String(r['ط§ظ„ظ…ط³ط¤ظˆظ„ / ط§ظ„ظ…ط³طھظ„ظ…'] || r['created_by'] || 'Admin')
            });
            existingIds.add(id);
            importedExpenses++;
          });

          cfg.expenses_by_date = existingExpenses;
          expensesByDate = existingExpenses;
          cfgModified = true;
        }

        if (cfgModified) {
          cfg.last_modified = Date.now();
          await supabase.from('settings').update({ config: cfg, updated_at: new Date().toISOString() }).eq('id', 1);
        }
      }
    }

    // Refresh UI & in-memory caches
    if (typeof loadAllAdminData === 'function') await loadAllAdminData();
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    if (typeof window.loadDailyReport === 'function') window.loadDailyReport(nowDateStr());
    if (typeof window.fetchAssistants === 'function') window.fetchAssistants();

    // Show summary modal
    await Swal.fire({
      title: isAr ? 'طھظ… ط§ط³طھظٹط±ط§ط¯ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¨ظ†ط¬ط§ط­' : 'Database Imported Successfully',
      html: isAr 
        ? `<div style="text-align: right; line-height: 1.8;">
             <p style="color: var(--success); font-weight: 700; font-size: 1.1em; margin-bottom: 12px;"><i class="fa-solid fa-circle-check"></i> ط§ظƒطھظ…ظ„طھ ط¹ظ…ظ„ظٹط© ط§ظ„ط§ط³طھظٹط±ط§ط¯ ظˆط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ظٹط±ظپط±:</p>
             <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95em;">
               <li style="padding: 4px 0;"><i class="fa-solid fa-user-graduate" style="color:var(--primary); width:20px;"></i> ط§ظ„ط·ظ„ط§ط¨: <b>${importedStudents}</b> ط·ط§ظ„ط¨</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-box-open" style="color:#10b981; width:20px;"></i> ط§ظ„ط¨ط§ظ‚ط§طھ: <b>${importedPackages}</b> ط¨ط§ظ‚ط©</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-users-gear" style="color:#6366f1; width:20px;"></i> ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†: <b>${importedAssistants}</b> ظ…ط³ط§ط¹ط¯</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-money-bill-transfer" style="color:#8b5cf6; width:20px;"></i> طھط­ظˆظٹظ„ط§طھ ط§ظ„ط®ط²ط§ط¦ظ†: <b>${importedTransfers}</b> طھط­ظˆظٹظ„</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-receipt" style="color:#f59e0b; width:20px;"></i> ط§ظ„ظ…طµط±ظˆظپط§طھ ظˆط§ظ„ظ…ط³ط­ظˆط¨ط§طھ: <b>${importedExpenses}</b> ظ…ط¹ط§ظ…ظ„ط©</li>
             </ul>
           </div>`
        : `<p>Successfully imported: ${importedStudents} students, ${importedPackages} packages, ${importedTransfers} transfers, ${importedExpenses} expenses.</p>`,
      icon: 'success',
      confirmButtonText: isAr ? 'طھظ…' : 'OK',
      confirmButtonColor: '#10B981'
    });

  } catch(err) {
    console.error("Excel import error:", err);
    showToast(isAr ? "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ط³طھظٹط±ط§ط¯ ط§ظ„ظ…ظ„ظپ: " + err.message : "Import failed", "err");
  } finally {
    event.target.value = '';
  }
};

window.resetTermData = async function() {
  const isAr = (currentLang === "ar");
  const res = await Swal.fire({
    title: isAr ? 'طھط£ظƒظٹط¯ طھطµظپظٹط± ط§ظ„طھط±ظ…' : 'Confirm Term Reset',
    text: isAr ? 'ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† طھطµظپظٹط± ط­ط¶ظˆط± ظˆظ…طµط§ط±ظٹظپ ظˆط¥ظٹط±ط§ط¯ط§طھ ط§ظ„طھط±ظ… ط¨ط§ظ„ظƒط§ظ…ظ„ ظ„ط¬ظ…ظٹط¹ ط§ظ„ط·ظ„ط§ط¨طں ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹ ط¹ظ† ظ‡ط°ظ‡ ط§ظ„ط®ط·ظˆط© ط¥ظ„ط§ ط¨ظ†ط³ط®ط© ط§ط­طھظٹط§ط·ظٹط©.' : 'Are you sure you want to reset attendance, fees, and revenue for the whole term? This action cannot be undone without a backup.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: isAr ? 'ظ†ط¹ظ…طŒ طµظپط± ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط±ظ…' : 'Yes, Reset Term',
    confirmButtonColor: '#EF4444',
    cancelButtonText: isAr ? 'ط¥ظ„ط؛ط§ط،' : 'Cancel'
  });

  if (!res.isConfirmed) return;

  try {
    for (const k in students) {
      students[k].paid = 0;
      students[k].attendanceDates = [];
    }
    attByDate = {};
    revenueByDate = {};
    expensesByDate = [];

    if (supabase) {
      await saveCenterConfig({
        attendance_by_date: {},
        revenue_by_date: {},
        expenses_by_date: []
      });
      await supabase.from('students').update({ paid: 0, attendance_dates: [] }).not('id', 'is', null);
    }

    showToast("طھظ… طھطµظپظٹط± ط­ط¶ظˆط± ظˆظ…طµط§ط±ظٹظپ ط§ظ„طھط±ظ… ط¨ط§ظ„ظƒط§ظ…ظ„ ط¨ظ†ط¬ط§ط­", "success");
    const today = nowDateStr();
    window.loadDailyReport(today);
    window.renderTermTable();
  } catch(e) {
    console.error(e);
    showToast("ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھطµظپظٹط±: " + e.message, "err");
  }
};

window.factoryResetSystem = async function() {
  const res = await Swal.fire({
    title: 'ط¥ط¹ط§ط¯ط© طھظ‡ظٹط¦ط© ط§ظ„ظ†ط¸ط§ظ… ظˆط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹',
    text: 'طھط­ط°ظٹط± ط´ط¯ظٹط¯ ط§ظ„ط®ط·ظˆط±ط©: ط³ظٹطھظ… ظ…ط³ط­ ظƒط§ظپط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط§ط¨ ظˆط§ظ„ط¨ط§ظ‚ط§طھ ظˆط§ظ„ط­ط¶ظˆط± ظˆط§ظ„ظ…طµط±ظˆظپط§طھ ط¨ط§ظ„ظƒط§ظ…ظ„. ط§ظƒطھط¨ "ظ…ط³ط­" ظ„ظ„طھط£ظƒظٹط¯:',
    input: 'text',
    inputPlaceholder: 'ط§ظƒطھط¨ ظƒظ„ظ…ط©: ظ…ط³ط­',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'طھط£ظƒظٹط¯ ط§ظ„ط­ط°ظپ ط§ظ„ط´ط§ظ…ظ„',
    confirmButtonColor: '#991B1B',
    cancelButtonText: 'ط¥ظ„ط؛ط§ط،',
    preConfirm: (val) => {
      if (val !== 'ظ…ط³ط­') {
        Swal.showValidationMessage('ظٹط¬ط¨ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© "ظ…ط³ط­" ظ„طھط£ظƒظٹط¯ ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹');
      }
      return val === 'ظ…ط³ط­';
    }
  });

  if (!res.isConfirmed) return;

  try {
    if (supabase) {
      await Promise.all([
        supabase.from('students').delete().neq('id', '0'),
        supabase.from('packages').delete().neq('id', '0'),
        supabase.from('booklets').delete().neq('id', '0'),
        supabase.from('assistants').delete().neq('id', '0'),
        supabase.from('decision_requests').delete().neq('id', '0'),
        supabase.from('settings').update({
          daily_shift_status: 'closed',
          config: {
            attendance_by_date: {},
            revenue_by_date: {},
            expenses_by_date: [],
            syllabus: [],
            daily_approval_map: {}
          },
          updated_at: new Date().toISOString()
        }).eq('id', 1)
      ]);
    }

    localStorage.clear();
    if (window.localforage) await localforage.clear();

    await Swal.fire({
      title: 'طھظ… ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹',
      text: 'طھظ… ظ…ط³ط­ ظƒط§ظپط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¨ظ†ط¬ط§ط­ ظˆط¥ط¹ط§ط¯ط© طھط´ط؛ظٹظ„ ط§ظ„ظ†ط¸ط§ظ….',
      icon: 'success'
    });

    location.href = 'admin.html';
  } catch(e) {
    console.error(e);
    showToast("ظپط´ظ„ ط¶ط¨ط· ط§ظ„ظ…طµظ†ط¹: " + e.message, "err");
  }
};

// ========================================================
// 12. INITIALIZATION
// ========================================================
document.addEventListener("DOMContentLoaded", async () => {
  // Theme check (supporting both ca_theme and studify_admin_theme)
  const savedTheme = localStorage.getItem("ca_theme") || localStorage.getItem("studify_admin_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const icon = document.getElementById("adminThemeIcon");
  if (icon) icon.className = savedTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";

  initAdminParticles();

  const isAuth = await checkAdminAuth();
  if (isAuth) {
    await loadAllAdminData();
  }
});


/* --- PARTICLES BACKGROUND FOR ADMIN LOGIN --- */
function initAdminParticles() {
  const canvas = document.getElementById('adminParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  const loginWrapper = document.getElementById('adminLoginWrapper');
  if (loginWrapper) {
    loginWrapper.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    loginWrapper.addEventListener('mouseout', () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });
  }

  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    let numberOfParticles = (width * height) / 9000;
    if (numberOfParticles > 90) numberOfParticles = 90;

    for (let i = 0; i < numberOfParticles; i++) {
      const size = (Math.random() * 2) + 1;
      const x = Math.random() * (width - size * 4) + size * 2;
      const y = Math.random() * (height - size * 4) + size * 2;
      const directionX = (Math.random() * 1) - 0.5;
      const directionY = (Math.random() * 1) - 0.5;
      particles.push({
        x, y, baseX: x, baseY: y,
        directionX, directionY, size,
        density: (Math.random() * 20) + 1
      });
    }
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        let force = (mouse.radius - distance) / mouse.radius;
        p.x -= (dx / distance) * force * p.density;
        p.y -= (dy / distance) * force * p.density;
      } else {
        if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 20;
        if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 20;
      }

      p.x += p.directionX * 0.5;
      p.y += p.directionY * 0.5;
      p.baseX += p.directionX * 0.5;
      p.baseY += p.directionY * 0.5;

      if (p.baseX > width) { p.baseX = width; p.directionX = -Math.abs(p.directionX); }
      if (p.baseX < 0) { p.baseX = 0; p.directionX = Math.abs(p.directionX); }
      if (p.baseY > height) { p.baseY = height; p.directionY = -Math.abs(p.directionY); }
      if (p.baseY < 0) { p.baseY = 0; p.directionY = Math.abs(p.directionY); }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.fill();
    }
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dist = ((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2);
        if (dist < (width / 7) * (height / 7)) {
          let opacity = 1 - (dist / 20000);
          ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { init(); });
  init();
  loop();
}



// ==========================================
// THEME SWITCH WITH SMOOTH LOADER
// ==========================================
window.switchThemeWithAnimation = function(targetTheme) {
  const overlay = document.getElementById("adminThemeSwitchOverlay");
  const textEl = document.getElementById("adminThemeSwitchText");
  const iconBox = document.getElementById("adminThemeSwitchIconBox");

  if (overlay && iconBox && textEl) {
    textEl.innerText = "ط¬ط§ط±ظٹ طھط¨ط¯ظٹظ„ ط§ظ„ظ…ط¸ظ‡ط±...";
    iconBox.innerHTML = targetTheme === "dark"
      ? '<i class="fa-solid fa-moon" style="font-size: 38px; color: #f59e0b;"></i>'
      : '<i class="fa-solid fa-sun" style="font-size: 38px; color: #f59e0b;"></i>';
    overlay.classList.add("active");

    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("ca_theme", targetTheme);
      localStorage.setItem("studify_admin_theme", targetTheme);
      const icon = document.getElementById("adminThemeIcon");
      if (icon) icon.className = targetTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";

      setTimeout(() => {
        overlay.classList.remove("active");
      }, 350);
    }, 550);
  } else {
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("ca_theme", targetTheme);
    localStorage.setItem("studify_admin_theme", targetTheme);
    const icon = document.getElementById("adminThemeIcon");
    if (icon) icon.className = targetTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
};

window.toggleAdminMobileSidebar = function(open) {
  const sb = document.querySelector(".admin-sidebar");
  const overlay = document.getElementById("adminSidebarOverlay");
  if (!sb) return;
  const isOpen = (open !== undefined) ? open : !sb.classList.contains("open");
  if (isOpen) {
    sb.classList.add("open");
    if (overlay) overlay.classList.add("active");
  } else {
    sb.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }
};

// ================= NOTIFICATIONS SYSTEM =================
window.createNotification = async function(message, type = 'info') {
  if (!supabase) return;
  try {
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: type === 'warning' ? 'طھظ†ط¨ظٹظ‡ ط¥ط¯ط§ط±ظٹ' : 'ط¥ط´ط¹ط§ط± ط¥ط¯ط§ط±ظٹ',
      message: message,
      status: 'unread'
    }]);
  } catch (err) {
    // Graceful fallback
  }
};

window.cleanupNotifications = async function() {
  if (!supabase) return;
  try {
    // Delete read notifications older than 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('communications')
      .delete()
      .eq('type', 'assistant_message')
      .eq('status', 'read')
      .lte('created_at', threeDaysAgo);

    // Delete older notifications older than 10 days
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('communications')
      .delete()
      .eq('type', 'assistant_message')
      .lte('created_at', tenDaysAgo);
  } catch (err) {
    // Graceful fallback
  }
};

// Run cleanup once on admin dashboard load
setTimeout(() => {
  if (typeof cleanupNotifications === 'function') cleanupNotifications();
}, 5000);

// Admin Profile Modal Popup on Avatar Click
window.showAdminUserMenu = function() {
  const email = localStorage.getItem("ca_admin_username") || "ahmedqutb11232@gmail.com";
  let displayAdmin = email;
  if (email.includes("@")) {
    const part = email.split("@")[0].toLowerCase();
    if (part.includes("ahmed") || part.includes("qutb")) {
      displayAdmin = "Ahmed Qutb";
    } else {
      displayAdmin = email.split("@")[0];
    }
  }

  if (window.Swal) {
    Swal.fire({
      title: '<i class="fa-solid fa-circle-user" style="color:var(--primary); font-size: 2.2em;"></i>',
      html: `
        <div style="text-align: center; margin-top: 10px;">
          <h3 style="margin-bottom: 6px; font-weight: 800; color: var(--text-primary); font-size: 1.25em;">${displayAdmin}</h3>
          <p style="font-size: 0.88em; color: var(--text-secondary); margin-bottom: 14px; direction: ltr;">${email}</p>
          <span style="display: inline-block; padding: 5px 16px; background: rgba(37,99,235,0.12); color: var(--primary); border-radius: 20px; font-size: 0.84em; font-weight: 700; margin-bottom: 6px;">ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ… (Administrator)</span>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: 'ط¥ط؛ظ„ط§ظ‚',
      confirmButtonColor: '#64748b'
    });
  }
};


// ========================================================
// SUBSCRIPTION ENGINE
// ========================================================
const PLAN_NAMES_MAP = {
  monthly:     '\u0627\u0644\u062e\u0637\u0629 \u0627\u0644\u0645\u0631\u0646\u0629 (\u0634\u0647\u0631 \u0648\u0627\u062d\u062f)',
  quarterly:   '\u0627\u0644\u062e\u0637\u0629 \u0627\u0644\u0645\u0631\u064a\u062d\u0629 (3 \u0634\u0647\u0648\u0631)',
  semi_annual: '\u0627\u0644\u062e\u0637\u0629 \u0627\u0644\u0630\u0647\u0628\u064a\u0629 (6 \u0634\u0647\u0648\u0631)'
};

export async function loadSubscriptionData() {
  if (!supabase) return;
  try {
    // 1. Primary storage: settings table (config.subscription)
    const { data: setRow } = await supabase
      .from('settings')
      .select('config')
      .eq('id', 1)
      .maybeSingle();

    let data = setRow?.config?.subscription;

    // 2. Fallback storage: dedicated subscriptions table if available
    if (!data) {
      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      data = subRow;
    }

    if (!data) {
      SUBSCRIPTION.isActive         = true;
      SUBSCRIPTION.planKey          = 'semi_annual';
      SUBSCRIPTION.planName         = PLAN_NAMES_MAP['semi_annual'];
      SUBSCRIPTION.startDate        = new Date().toISOString().split('T')[0];
      SUBSCRIPTION.endDate          = new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];
      SUBSCRIPTION.maxStudents      = 1000;
      SUBSCRIPTION.maxAssistants    = 5;
      SUBSCRIPTION.marketingEnabled = true;
      SUBSCRIPTION.daysLeft         = 180;
      SUBSCRIPTION.totalDays        = 180;
      SUBSCRIPTION.loaded           = true;
      window.SUBSCRIPTION           = SUBSCRIPTION;
      updateSubscriptionSidebarPill();
      return;
    }

    // Fetch real assistant count
    let asstCount = 0;
    try {
      const { count } = await supabase.from('assistants').select('*', { count: 'exact', head: true });
      asstCount = count || 0;
    } catch(err) {
      asstCount = 0;
    }
    SUBSCRIPTION.currentAssistants = asstCount;

    const today     = new Date(); today.setHours(0,0,0,0);
    const endDate   = new Date(data.plan_end_date);  endDate.setHours(0,0,0,0);
    const startDate = new Date(data.plan_start_date); startDate.setHours(0,0,0,0);
    const msPerDay  = 86400000;
    const daysLeft  = Math.ceil((endDate - today) / msPerDay);
    const totalDays = Math.max(1, Math.ceil((endDate - startDate) / msPerDay));

    SUBSCRIPTION.isActive         = (daysLeft > 0) && (data.is_active !== false);
    SUBSCRIPTION.planKey          = data.plan_key || 'monthly';
    SUBSCRIPTION.planName         = PLAN_NAMES_MAP[data.plan_key] || data.plan_name || data.plan_key;
    SUBSCRIPTION.startDate        = data.plan_start_date;
    SUBSCRIPTION.endDate          = data.plan_end_date;
    SUBSCRIPTION.maxStudents      = data.max_students || (data.plan_key === 'semi_annual' ? 1000 : (data.plan_key === 'quarterly' ? 750 : 600));
    SUBSCRIPTION.maxAssistants    = data.max_assistants || (data.plan_key === 'semi_annual' ? 5 : (data.plan_key === 'quarterly' ? 4 : 2));
    SUBSCRIPTION.marketingEnabled = (data.plan_key === 'semi_annual') || !!data.marketing_enabled;
    SUBSCRIPTION.daysLeft         = Math.max(0, daysLeft);
    SUBSCRIPTION.totalDays        = totalDays;
    SUBSCRIPTION.loaded           = true;
    window.SUBSCRIPTION           = SUBSCRIPTION;

    updateSubscriptionSidebarPill();
    enforceSubscriptionLock();

  } catch(e) {
    console.error('[Subscription] Load error:', e);
    SUBSCRIPTION.isActive = true;
    SUBSCRIPTION.loaded   = true;
    window.SUBSCRIPTION   = SUBSCRIPTION;
    updateSubscriptionSidebarPill();
  }
}
window.loadSubscriptionData = loadSubscriptionData;

function enforceSubscriptionLock() {
  const lockEl = document.getElementById('subscriptionLockScreen');
  if (!lockEl) return;

  if (!SUBSCRIPTION.isActive) {
    lockEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const infoEl = document.getElementById('lockPlanInfo');
    if (infoEl) {
      infoEl.innerHTML = `
        <div style="background:rgba(255,255,255,0.06);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);margin-top:14px;text-align:right;">
          <div style="font-size:0.95em;color:#EF4444;font-weight:800;margin-bottom:6px;display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-clock-rotate-left"></i> ط§ط³طھظ‡ظ„ط§ظƒ ظ…ط¯ط© ط§ظ„ط§ط´طھط±ط§ظƒ: 100% (0 ظٹظˆظ… ظ…طھط¨ظ‚ظٹ)
          </div>
          <div style="font-size:0.85em;color:#94A3B8;line-height:1.6;">
            طھط§ط±ظٹط® ط§ظ„ط§ظ†طھظ‡ط§ط،: <b style="color:#F1F5F9;">${SUBSCRIPTION.endDate || 'â€”'}</b> | ط§ظ„ط¨ط§ظ‚ط©: <b style="color:#F1F5F9;">${SUBSCRIPTION.planName}</b>
          </div>
        </div>`;
    }
    const dash = document.getElementById('adminDashboardLayout');
    if (dash) dash.style.display = 'none';

    // Persistent notice for expired subscription
    if (!window._subLockAlertShown) {
      window._subLockAlertShown = true;
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'ط§ظ†طھظ‡ط§ط، طµظ„ط§ط­ظٹط© ط§ط´طھط±ط§ظƒ ط§ظ„ظ†ط¸ط§ظ…',
          html: `<p style="color:var(--text-secondary);margin-bottom:12px">ط§ظ†طھظ‡طھ ظپطھط±ط© طµظ„ط§ط­ظٹط© ط§ظ„ط§ط´طھط±ط§ظƒ ط§ظ„ط®ط§طµط© ط¨ظ†ط¸ط§ظ… ط§ظ„ط³ظ†طھط± ط¨ط§ظ„ظƒط§ظ…ظ„.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">طھظ… طھط¹ظ„ظٹظ‚ ظƒط§ظپط© ط§ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„طھط´ط؛ظٹظ„ظٹط© ظˆط¥ظٹظ‚ط§ظپ ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط¨ظٹط§ظ†ط§طھ ظ…ط¤ظ‚طھط§ظ‹ ط­طھظ‰ ظٹطھظ… ط³ط¯ط§ط¯ ظˆطھط¬ط¯ظٹط¯ ط§ظ„ط¨ط§ظ‚ط©.</p>`,
          confirmButtonText: 'طھظˆط§طµظ„ ظ„ظ„طھط¬ط¯ظٹط¯ ط§ظ„ظپظˆط±ظٹ',
          confirmButtonColor: '#2563EB',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          window.contactForRenewal(SUBSCRIPTION.planKey);
        });
      }
    }
  } else {
    lockEl.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
window.enforceSubscriptionLock = enforceSubscriptionLock;

function updateSubscriptionSidebarPill() {
  const pill = document.getElementById('subscriptionStatusPill');
  if (!pill) return;
  const isAr = (currentLang === "ar");
  pill.className = 'sub-status-pill';
  if (!SUBSCRIPTION.loaded) { pill.textContent = ''; return; }
  if (!SUBSCRIPTION.isActive) {
    pill.classList.add('expired'); pill.textContent = isAr ? 'ظ…ظ†طھظ‡ظٹ' : 'Expired';
  } else if (SUBSCRIPTION.daysLeft <= 10) {
    pill.classList.add('warning'); pill.textContent = isAr ? (SUBSCRIPTION.daysLeft + ' ظٹظˆظ…') : (SUBSCRIPTION.daysLeft + ' Days');
  } else {
    pill.classList.add('active'); pill.textContent = isAr ? 'ظ†ط´ط·' : 'Active';
  }
}

export function checkStudentLimit() {
  if (!SUBSCRIPTION.loaded) return true;
  const sessCount = (typeof window.getAdminUniqueSessionStudentsCount === 'function') ? window.getAdminUniqueSessionStudentsCount() : 0;
  const count = Object.keys(students).length + sessCount;
  if (count >= SUBSCRIPTION.maxStudents) {
    Swal.fire({
      icon: 'warning',
      title: 'طھظ… ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط·ظ„ط§ط¨',
      html: `<p style="color:var(--text-secondary);margin-bottom:12px">ط¨ط§ظ‚طھظƒ ط§ظ„ط­ط§ظ„ظٹط© طھط³ظ…ط­ ط¨ط­ط¯ ط£ظ‚طµظ‰ <b>${SUBSCRIPTION.maxStudents} ط·ط§ظ„ط¨</b>.<br>ظ„ط¯ظٹظƒ ط­ط§ظ„ظٹط§ظ‹ <b>${count} ط·ط§ظ„ط¨</b> ظ…ط³ط¬ظ„ (ط¨ظ…ط§ ظپظٹظ‡ظ… ط·ظ„ط§ط¨ ط§ظ„ط­طµط©).</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> ظٹط±ط¬ظ‰ طھط±ظ‚ظٹط© ط¨ط§ظ‚ط© ط§ظ„ط§ط´طھط±ط§ظƒ ظ„ط¥ط¶ط§ظپط© ط§ظ„ظ…ط²ظٹط¯ ظ…ظ† ط§ظ„ط·ظ„ط§ط¨.</p>`,
      confirmButtonText: 'ط¹ط±ط¶ ط®ط·ط· ط§ظ„ط§ط´طھط±ط§ظƒ',
      confirmButtonColor: '#2563EB',
      showCancelButton: true, cancelButtonText: 'ط¥ط؛ظ„ط§ظ‚'
    }).then(r => { if (r.isConfirmed) window.switchAdminTab('subscription'); });
    return false;
  }
  return true;
}
window.checkStudentLimit = checkStudentLimit;

export async function checkAssistantLimit() {
  if (!SUBSCRIPTION.loaded) return true;
  try {
    const { count } = await supabase.from('assistants').select('*', { count: 'exact', head: true });
    const cur = count || 0;
    if (cur >= SUBSCRIPTION.maxAssistants) {
      Swal.fire({
        icon: 'warning',
        title: 'طھظ… ط§ظ„ظˆطµظˆظ„ ظ„ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ظ…ط³ط§ط¹ط¯ظٹظ†',
        html: `<p style="color:var(--text-secondary);margin-bottom:12px">ط¨ط§ظ‚طھظƒ ط§ظ„ط­ط§ظ„ظٹط© طھط³ظ…ط­ ط¨ط­ط¯ ط£ظ‚طµظ‰ <b>${SUBSCRIPTION.maxAssistants} ظ…ط³ط§ط¹ط¯</b>.<br>ظ„ط¯ظٹظƒ ط­ط§ظ„ظٹط§ظ‹ <b>${cur} ظ…ط³ط§ط¹ط¯</b> ظ…ط³ط¬ظ„.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> ظٹط±ط¬ظ‰ طھط±ظ‚ظٹط© ط¨ط§ظ‚ط© ط§ظ„ط§ط´طھط±ط§ظƒ ظ„ط¥ط¶ط§ظپط© ط§ظ„ظ…ط²ظٹط¯ ظ…ظ† ط­ط³ط§ط¨ط§طھ ط§ظ„ظ…ط³ط§ط¹ط¯ظٹظ†.</p>`,
        confirmButtonText: 'ط¹ط±ط¶ ط®ط·ط· ط§ظ„ط§ط´طھط±ط§ظƒ',
        confirmButtonColor: '#2563EB',
        showCancelButton: true, cancelButtonText: 'ط¥ط؛ظ„ط§ظ‚'
      }).then(r => { if (r.isConfirmed) window.switchAdminTab('subscription'); });
      return false;
    }
    return true;
  } catch(e) { console.error('[checkAssistantLimit]', e); return true; }
}
window.checkAssistantLimit = checkAssistantLimit;

window.renderSubscriptionView = function() {
  const card = document.getElementById('subCurrentPlanCard');
  if (!card) return;
  const isAr = (currentLang === "ar");

  if (!SUBSCRIPTION.loaded) {
    card.innerHTML = `<div class="sub-plan-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط§ط´طھط±ط§ظƒ..." : "Loading subscription details..."}</div>`;
    setTimeout(() => { if (SUBSCRIPTION.loaded) window.renderSubscriptionView(); }, 1500);
    return;
  }

  const { isActive, daysLeft, totalDays, planName, startDate, endDate,
          maxStudents, maxAssistants, currentAssistants, planKey } = SUBSCRIPTION;
  const progress = Math.max(0, Math.min(100, Math.round((daysLeft / totalDays) * 100)));
  const statusClass = isActive ? (daysLeft <= 10 ? 'warning' : 'active') : 'expired';
  const statusIcon  = isActive ? (daysLeft <= 10 ? 'fa-clock' : 'fa-circle-check') : 'fa-circle-xmark';
  const statusText  = isActive ? (daysLeft <= 10 ? (isAr ? `ظٹظ†طھظ‡ظٹ ط®ظ„ط§ظ„ ${daysLeft} ظٹظˆظ…` : `Expires in ${daysLeft} Days`) : (isAr ? 'ظ†ط´ط·' : 'Active')) : (isAr ? 'ظ…ظ†طھظ‡ظٹ' : 'Expired');
  const progressClass = progress <= 15 ? 'danger' : progress <= 30 ? 'warning' : '';
  const sessCount = (typeof window.getAdminUniqueSessionStudentsCount === 'function') ? window.getAdminUniqueSessionStudentsCount() : 0;
  const studentCount  = Object.keys(students).length + sessCount;
  const asstCountDisplay = typeof currentAssistants === 'number' ? currentAssistants : 0;

  // Localized plan display name
  const localizedPlanName = isAr ? planName : (
    planKey === 'semi_annual' ? 'Golden Plan (Full Term)' :
    planKey === 'quarterly' ? 'Comfort Plan (3 Months)' :
    planKey === 'monthly' ? 'Flexible Plan (1 Month)' : planName
  );

  const dateFromLbl = isAr ? "ظ…ظ†" : "From";
  const dateToLbl = isAr ? "ط­طھظ‰" : "Until";
  const studentLbl = isAr ? "ط·ط§ظ„ط¨" : "Students";
  const assistantLbl = isAr ? "ظ…ط³ط§ط¹ط¯" : "Assistants";
  const progressTitle = isAr ? "ط§ط³طھظ‡ظ„ط§ظƒ ظ…ط¯ط© ط§ظ„ط§ط´طھط±ط§ظƒ" : "Subscription Duration Used";
  const progressSub = isAr ? `${daysLeft} ظٹظˆظ… ظ…طھط¨ظ‚ظٹ ظ…ظ† ${totalDays}` : `${daysLeft} days remaining of ${totalDays}`;
  const countdownLbl = isAr ? "ظٹظˆظ… ظ…طھط¨ظ‚ظٹ" : "Days Left";

  card.innerHTML = `
    <div class="sub-current-inner">
      <div class="sub-current-info">
        <div class="sub-current-badge ${statusClass}">
          <i class="fa-solid ${statusIcon}"></i> ${statusText}
        </div>
        <div class="sub-current-plan-name">${localizedPlanName}</div>
        <div class="sub-current-date-row">
          <i class="fa-solid fa-calendar-check" style="color:var(--primary)"></i>
          ${dateFromLbl} <b>${startDate || 'â€”'}</b> &nbsp;${dateToLbl}&nbsp; <b>${endDate || 'â€”'}</b>
        </div>
        <div class="sub-current-limits">
          <div class="sub-limit-chip">
            <i class="fa-solid fa-users"></i>
            <span class="sub-limit-chip-val">${studentCount} / ${maxStudents}</span>
            <span class="sub-limit-chip-lbl">${studentLbl}</span>
          </div>
          <div class="sub-limit-chip">
            <i class="fa-solid fa-user-shield"></i>
            <span class="sub-limit-chip-val">${asstCountDisplay} / ${maxAssistants}</span>
            <span class="sub-limit-chip-lbl">${assistantLbl}</span>
          </div>
        </div>
        <div class="sub-progress-wrap">
          <div class="sub-progress-lbl">
            <span>${progressTitle}</span>
            <span>${progressSub}</span>
          </div>
          <div class="sub-progress-bar">
            <div class="sub-progress-fill ${progressClass}" style="width:${progress}%"></div>
          </div>
        </div>
      </div>
      <div class="sub-countdown">
        <div class="sub-countdown-days">${daysLeft}</div>
        <div class="sub-countdown-lbl">${countdownLbl}</div>
      </div>
    </div>`;

  // Highlight active plan card
  const planIdMap = { monthly:'subPlanMonthly', quarterly:'subPlanQuarterly', semi_annual:'subPlanSemiAnnual' };
  ['subPlanMonthly','subPlanQuarterly','subPlanSemiAnnual'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('current-plan');
    const btn = el.querySelector('.sub-plan-btn');
    if (btn) btn.classList.remove('current-plan-badge');
  });
  const activePlanEl = planKey ? document.getElementById(planIdMap[planKey]) : null;
  if (activePlanEl && isActive) {
    activePlanEl.classList.add('current-plan');
    const btn = activePlanEl.querySelector('.sub-plan-btn');
    if (btn) {
      btn.className = 'sub-plan-btn current-plan-badge';
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? "ط¨ط§ظ‚طھظƒ ط§ظ„ط­ط§ظ„ظٹط©" : "Your Current Plan"}`;
      btn.onclick = null;
    }
  }
};

window.contactForRenewal = function(planKey) {
  const isAr = (currentLang === "ar");
  const names = {
    monthly:     isAr ? 'ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظ†ط© (1,999 ط¬/ط´ظ‡ط±)' : 'Flexible Plan (1,999 EGP/month)',
    quarterly:   isAr ? 'ط§ظ„ط®ط·ط© ط§ظ„ظ…ط±ظٹط­ط© (5,399 ط¬/3 ط´ظ‡ظˆط± ط¨ط¯ظ„ط§ظ‹ ظ…ظ† 6,000 ط¬)' : 'Comfort Plan (5,399 EGP/3 months instead of 6,000 EGP)',
    semi_annual: isAr ? 'ط§ظ„ط®ط·ط© ط§ظ„ط°ظ‡ط¨ظٹط© (7,999 ط¬/طھط±ظ… ظƒط§ظ…ظ„ ط¨ط¯ظ„ط§ظ‹ ظ…ظ† 10,000 ط¬)' : 'Golden Plan (7,999 EGP/full term instead of 10,000 EGP)'
  };
  const title = isAr ? 'طھط¬ط¯ظٹط¯ / طھط±ظ‚ظٹط© ط§ظ„ط§ط´طھط±ط§ظƒ' : 'Renew / Upgrade Subscription';
  const desc = isAr 
    ? `ظ„طھظپط¹ظٹظ„ <b>${names[planKey] || planKey}</b>طŒ<br>طھظˆط§طµظ„ ظ…ط¹ ظپط±ظٹظ‚ ط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ ظˆط³ظٹطھظ… ط§ظ„طھظپط¹ظٹظ„ ظپظˆط±ط§ظ‹.`
    : `To activate <b>${names[planKey] || planKey}</b>,<br>contact our technical support team for immediate activation.`;
  const waText = isAr ? 'طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ ط¹ط¨ط± ط§ظ„ظˆط§طھط³ط§ط¨' : 'Contact Technical Support via WhatsApp';
  const okText = isAr ? 'ط­ط³ظ†ط§ظ‹' : 'OK';

  Swal.fire({
    icon: 'info',
    title: title,
    html: `<p style="color:var(--text-secondary);margin-bottom:14px">${desc}</p>
      <div style="background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.3);color:#25D366;padding:12px 18px;border-radius:10px;font-weight:700;font-size:.95em;display:flex;align-items:center;gap:10px;justify-content:center;">
        <i class="fa-brands fa-whatsapp" style="font-size:1.3em"></i> ${waText}
      </div>`,
    confirmButtonText: okText,
    confirmButtonColor: '#2563EB'
  });
};


// ========================================================
// REVENUE BREAKDOWN MODAL LOGIC
// ========================================================
window.openRevenueBreakdownModal = function() {
  const modal = document.getElementById("revenueBreakdownModal");
  if (!modal) return;
  window.setRevQuickDate('all');
  modal.classList.remove("hidden");
};

window.closeRevenueBreakdownModal = function() {
  const modal = document.getElementById("revenueBreakdownModal");
  if (modal) modal.classList.add("hidden");
};


// =============================================================================
// INTER-VAULT TRANSFERS & FINANCIAL MODALS ENGINE
// =============================================================================

// --- 1. VAULT TRANSFERS (ط§ظ„طھط­ظˆظٹظ„ ط§ظ„ظ…ط§ظ„ظٹ ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ†) ---
window.openVaultTransferModal = function() {
  const modal = document.getElementById("vaultTransferModal");
  if (!modal) return;

  if (document.getElementById("transAmount")) document.getElementById("transAmount").value = "";
  if (document.getElementById("transNote")) document.getElementById("transNote").value = "";

  window.updateTransferPreview();
  modal.classList.remove("hidden");
};

window.closeVaultTransferModal = function() {
  const modal = document.getElementById("vaultTransferModal");
  if (modal) modal.classList.add("hidden");
};

window.updateTransferPreview = function() {
  const fromSel = document.getElementById("transFromVault");
  const toSel = document.getElementById("transToVault");
  const amtInp = document.getElementById("transAmount");

  if (!fromSel || !toSel) return;
  const fromV = fromSel.value;
  const toV = toSel.value;
  const amt = Number(amtInp ? amtInp.value : 0) || 0;

  const b = window.vaultLiveBalances || { cash: 0, wallet: 0, instapay: 0 };
  const currFromBal = Number(b[fromV]) || 0;
  const currToBal = Number(b[toV]) || 0;

  if (document.getElementById("transFromAvailBal")) {
    document.getElementById("transFromAvailBal").textContent = currFromBal.toLocaleString() + " ط¬";
  }
  if (document.getElementById("transToCurrBal")) {
    if (currToBal < 0) {
      document.getElementById("transToCurrBal").innerHTML = `<span style="color:#ef4444; direction:ltr; unicode-bidi:embed;">-${Math.abs(currToBal).toLocaleString()} ط¬</span> <span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-size:0.7em; font-weight:700;">ط¹ط¬ط²</span>`;
    } else {
      document.getElementById("transToCurrBal").textContent = currToBal.toLocaleString() + " ط¬";
    }
  }

  // Dynamic Cover Deficit button badge
  const btnDeficit = document.getElementById("btnCoverDeficit");
  if (btnDeficit) {
    const isAr = (currentLang === "ar");
    if (currToBal < 0) {
      const deficitAmt = Math.abs(currToBal);
      btnDeficit.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${isAr ? 'طھط؛ط·ظٹط© ط§ظ„ط¹ط¬ط² (' + deficitAmt.toLocaleString() + ' ط¬)' : 'Cover Deficit (' + deficitAmt.toLocaleString() + ')'}`;
      btnDeficit.style.background = "rgba(37, 99, 235, 0.15)";
      btnDeficit.style.color = "var(--primary)";
      btnDeficit.style.borderColor = "var(--primary)";
      btnDeficit.style.fontWeight = "800";
    } else {
      btnDeficit.innerHTML = isAr ? 'طھط؛ط·ظٹط© ط§ظ„ط¹ط¬ط²' : 'Cover Deficit';
      btnDeficit.style.background = "var(--bg-inset)";
      btnDeficit.style.color = "var(--text-secondary)";
      btnDeficit.style.borderColor = "var(--border)";
      btnDeficit.style.fontWeight = "600";
    }
  }

  const afterFrom = currFromBal - amt;
  const afterTo = currToBal + amt;

  const fromAfterEl = document.getElementById("transFromAfterBal");
  const toAfterEl = document.getElementById("transToAfterBal");

  if (fromAfterEl) {
    fromAfterEl.textContent = afterFrom.toLocaleString() + " ط¬";
    fromAfterEl.style.color = afterFrom < 0 ? "var(--danger)" : "var(--text-primary)";
  }
  if (toAfterEl) {
    toAfterEl.textContent = afterTo.toLocaleString() + " ط¬";
    toAfterEl.style.color = afterTo < 0 ? "var(--danger)" : "var(--success)";
  }
};

window.setTransferAmount = function(val) {
  const fromSel = document.getElementById("transFromVault");
  const toSel = document.getElementById("transToVault");
  const amtInp = document.getElementById("transAmount");
  if (!amtInp) return;

  if (val === 'all') {
    const fromV = fromSel ? fromSel.value : 'cash';
    const b = window.vaultLiveBalances || { cash: 0, wallet: 0, instapay: 0 };
    const avail = Math.max(0, Number(b[fromV]) || 0);
    amtInp.value = avail;
  } else if (val === 'cover_deficit') {
    const toV = toSel ? toSel.value : 'instapay';
    const b = window.vaultLiveBalances || { cash: 0, wallet: 0, instapay: 0 };
    const targetBal = Number(b[toV]) || 0;
    if (targetBal < 0) {
      // There is an actual deficit -> cover it exactly
      amtInp.value = Math.abs(targetBal);
    } else {
      // NO deficit -> keep it 0 as user requested!
      amtInp.value = 0;
      if (typeof window.showNotification === 'function') {
        window.showNotification(currentLang === 'ar' ? "ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…ط­ط¯ط¯ط© ظ„ظٹط³ ط¨ظ‡ط§ ط¹ط¬ط² ط­ط§ظ„ظٹط§ظ‹" : "Selected vault has no deficit", "info");
      }
    }
  } else {
    const cur = Number(amtInp.value) || 0;
    amtInp.value = cur + Number(val);
  }
  window.updateTransferPreview();
};

window.submitVaultTransfer = async function() {
  const isAr = (currentLang === "ar");
  const fromSel = document.getElementById("transFromVault");
  const toSel = document.getElementById("transToVault");
  const amtInp = document.getElementById("transAmount");
  const noteInp = document.getElementById("transNote");

  const fromV = fromSel ? fromSel.value : 'cash';
  const toV = toSel ? toSel.value : 'instapay';
  const amt = Number(amtInp ? amtInp.value : 0);
  const note = noteInp ? noteInp.value.trim() : '';

  if (fromV === toV) {
    showToast(isAr ? "ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط­ظˆظٹظ„ ظ„ظ†ظپط³ ط§ظ„ط®ط²ظٹظ†ط©" : "Cannot transfer to the same vault", "warning");
    return;
  }

  if (amt <= 0) {
    showToast(isAr ? "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط¨ظ„ط؛ طھط­ظˆظٹظ„ طµط­ظٹط­ ط£ظƒط¨ط± ظ…ظ† طµظپط±" : "Please enter a valid transfer amount", "warning");
    return;
  }

  const vNames = {
    cash: isAr ? "ط¯ط±ط¬ ط§ظ„ظƒط§ط´" : "Cash Drawer",
    instapay: isAr ? "ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ" : "InstaPay",
    wallet: isAr ? "ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´" : "Vodafone Cash"
  };

  const newTransfer = {
    id: 'vt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    date: nowDateStr(),
    timestamp: new Date().toLocaleTimeString(),
    from_vault: fromV,
    to_vault: toV,
    amount: amt,
    note: note || (isAr ? `طھط­ظˆظٹظ„ ظ…ظ† ${vNames[fromV]} ط¥ظ„ظ‰ ${vNames[toV]}` : `Transfer from ${vNames[fromV]} to ${vNames[toV]}`),
    created_by: isAr ? "ط§ظ„ط¥ط¯ط§ط±ط©" : "Admin"
  };

  if (!Array.isArray(vaultTransfers)) vaultTransfers = [];
  vaultTransfers.push(newTransfer);

  try {
    await saveCenterConfig({ vault_transfers: vaultTransfers });
    showToast(isAr ? `طھظ… طھط­ظˆظٹظ„ ${amt} ط¬ ط¨ظ†ط¬ط§ط­ ظ…ظ† ${vNames[fromV]} ط¥ظ„ظ‰ ${vNames[toV]}` : `Transferred ${amt} EGP successfully`, "success");
    window.closeVaultTransferModal();
    if (typeof window.renderTermTable === "function") window.renderTermTable();
  } catch(e) {
    console.error("submitVaultTransfer error:", e);
    showToast(isAr ? "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط­ظپط¸ ط§ظ„طھط­ظˆظٹظ„" : "Error saving transfer", "err");
  }
};

window.openVaultTransfersHistoryModal = function() {
  const modal = document.getElementById("vaultTransfersHistoryModal");
  const tbody = document.getElementById("vaultTransfersHistoryTbody");
  if (!modal || !tbody) return;

  const isAr = (currentLang === "ar");
  const vNames = {
    cash: isAr ? "ط¯ط±ط¬ ط§ظ„ظƒط§ط´" : "Cash Drawer",
    instapay: isAr ? "ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ" : "InstaPay",
    wallet: isAr ? "ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´" : "Vodafone Cash"
  };

  const list = Array.isArray(vaultTransfers) ? [...vaultTransfers].reverse() : [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ طھط­ظˆظٹظ„ ط³ط§ط¨ظ‚ط© ط¨ظٹظ† ط§ظ„ط®ط²ط§ط¦ظ†" : "No transfer history found"}</td></tr>`;
  } else {
    tbody.innerHTML = list.map((t, idx) => {
      return `
        <tr>
          <td style="font-weight:600;">${t.date} <span style="font-size:0.85em; color:var(--text-secondary);">${t.timestamp || ""}</span></td>
          <td><span class="badge" style="background:rgba(239,68,68,0.1); color:#ef4444; font-weight:700;">${vNames[t.from_vault] || t.from_vault}</span></td>
          <td><span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; font-weight:700;">${vNames[t.to_vault] || t.to_vault}</span></td>
          <td style="font-weight:800; color:var(--primary); font-size:1.05em;">${t.amount} ط¬</td>
          <td style="color:var(--text-secondary); font-weight:600;">${t.note || "â€”"}</td>
        </tr>
      `;
    }).join("");
  }

  modal.classList.remove("hidden");
};

window.closeVaultTransfersHistoryModal = function() {
  const modal = document.getElementById("vaultTransfersHistoryModal");
  if (modal) modal.classList.add("hidden");
};

window.deleteVaultTransfer = async function(id) {
  const isAr = (currentLang === "ar");
  const res = await Swal.fire({
    title: isAr ? "طھط£ظƒظٹط¯ ط¥ظ„ط؛ط§ط، ط§ظ„طھط­ظˆظٹظ„" : "Confirm Revert",
    text: isAr ? "ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ط­ط±ظƒط© ط§ظ„طھط­ظˆظٹظ„ ظˆط§ط³طھط±ط¬ط§ط¹ ط§ظ„ط£ط±طµط¯ط© ط¥ظ„ظ‰ ظˆط¶ط¹ظ‡ط§ ط§ظ„ط³ط§ط¨ظ‚طں" : "Revert this transfer and restore vault balances?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: isAr ? "ظ†ط¹ظ…طŒ ط¥ظ„ط؛ط§ط، ط§ظ„طھط­ظˆظٹظ„" : "Yes, Revert",
    cancelButtonText: isAr ? "طھط±ط§ط¬ط¹" : "Cancel",
    confirmButtonColor: "#ef4444"
  });

  if (!res.isConfirmed) return;

  const idx = vaultTransfers.findIndex(t => t.id === id);
  if (idx !== -1) {
    vaultTransfers.splice(idx, 1);
    try {
      await saveCenterConfig({ vault_transfers: vaultTransfers });
      showToast(isAr ? "طھظ… ط­ط°ظپ ط­ط±ظƒط© ط§ظ„طھط­ظˆظٹظ„ ظˆط§ط³طھط±ط¬ط§ط¹ ط§ظ„ط£ط±طµط¯ط© ط¨ظ†ط¬ط§ط­" : "Transfer reverted", "success");
      window.openVaultTransfersHistoryModal();
      if (typeof window.renderTermTable === "function") window.renderTermTable();
    } catch(e) {
      console.error("deleteVaultTransfer error:", e);
      showToast(isAr ? "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط­ط°ظپ" : "Error deleting transfer", "err");
    }
  }
};


// --- 2. EXPENSES DETAILS MODAL WITH DATE FILTER ---
window.openExpensesDetailsModal = function() {
  const modal = document.getElementById("expensesDetailsModal");
  if (!modal) return;
  window.setExpQuickDate('all');
  modal.classList.remove("hidden");
};

window.closeExpensesDetailsModal = function() {
  const modal = document.getElementById("expensesDetailsModal");
  if (modal) modal.classList.add("hidden");
};

window.setExpQuickDate = function(mode) {
  const sInp = document.getElementById("expFilterStartDate");
  const eInp = document.getElementById("expFilterEndDate");
  const btnAll = document.getElementById("expQuickAll");
  const btnToday = document.getElementById("expQuickToday");

  if (mode === 'today') {
    if (sInp) sInp.value = nowDateStr();
    if (eInp) eInp.value = nowDateStr();
    if (btnToday) btnToday.classList.add("active");
    if (btnAll) btnAll.classList.remove("active");
  } else {
    if (sInp) sInp.value = "";
    if (eInp) eInp.value = "";
    if (btnAll) btnAll.classList.add("active");
    if (btnToday) btnToday.classList.remove("active");
  }
  window.filterExpensesModal();
};

window.filterExpensesModal = function() {
  const isAr = (currentLang === "ar");
  const sDate = document.getElementById("expFilterStartDate")?.value || "";
  const eDate = document.getElementById("expFilterEndDate")?.value || "";
  const tbody = document.getElementById("expensesDetailsTbody");

  const list = Array.isArray(expensesByDate) ? expensesByDate : [];
  const expItems = list.filter(e => {
    if (!e || e.type === 'withdrawal' || e.isWithdrawal) return false;
    const d = e.date || "";
    if (sDate && d < sDate) return false;
    if (eDate && d > eDate) return false;
    return true;
  }).reverse();

  let total = 0, cash = 0, instapay = 0, wallet = 0;
  expItems.forEach(e => {
    const a = Number(e.amount) || 0;
    total += a;
    const m = e.method || 'cash';
    if (m === 'cash') cash += a;
    else if (m === 'instapay') instapay += a;
    else if (m === 'wallet') wallet += a;
    else cash += a;
  });

  if (document.getElementById("expModalTotal")) document.getElementById("expModalTotal").textContent = total.toLocaleString() + " ط¬";
  if (document.getElementById("expModalCash")) document.getElementById("expModalCash").textContent = cash.toLocaleString() + " ط¬";
  if (document.getElementById("expModalInstapay")) document.getElementById("expModalInstapay").textContent = instapay.toLocaleString() + " ط¬";
  if (document.getElementById("expModalWallet")) document.getElementById("expModalWallet").textContent = wallet.toLocaleString() + " ط¬";

  const mBadges = {
    cash: { text: isAr ? "ظƒط§ط´ (ط¯ط±ط¬)" : "Cash", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
    instapay: { text: isAr ? "ط¥ظ†ط³طھط§ط¨ط§ظٹ" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
    wallet: { text: isAr ? "ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
  };

  if (!tbody) return;
  if (expItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ظ…طµط±ظˆظپط§طھ طھط´ط؛ظٹظ„ظٹط© ظ…ط³ط¬ظ„ط© ظپظٹ ظ‡ط°ظ‡ ط§ظ„ظپطھط±ط©" : "No expenses found for this period"}</td></tr>`;
  } else {
    tbody.innerHTML = expItems.map(e => {
      const mb = mBadges[e.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${e.date || "â€”"}</td>
          <td style="font-weight:800; color:#ef4444; font-size:1.05em;">${e.amount} ط¬</td>
          <td style="font-weight:600;">${e.reason || "ظ…طµط±ظˆظپ ط³ظ†طھط±"}</td>
          <td><span class="badge" style="background:${mb.bg}; color:${mb.color}; font-weight:700;">${mb.text}</span></td>
        </tr>
      `;
    }).join("");
  }
};


// --- 3. WITHDRAWALS DETAILS MODAL WITH DATE FILTER ---
window.openWithdrawalsDetailsModal = function() {
  const modal = document.getElementById("withdrawalsDetailsModal");
  if (!modal) return;
  window.setWdQuickDate('all');
  modal.classList.remove("hidden");
};

window.closeWithdrawalsDetailsModal = function() {
  const modal = document.getElementById("withdrawalsDetailsModal");
  if (modal) modal.classList.add("hidden");
};

window.setWdQuickDate = function(mode) {
  const sInp = document.getElementById("wdFilterStartDate");
  const eInp = document.getElementById("wdFilterEndDate");
  const btnAll = document.getElementById("wdQuickAll");
  const btnToday = document.getElementById("wdQuickToday");

  if (mode === 'today') {
    if (sInp) sInp.value = nowDateStr();
    if (eInp) eInp.value = nowDateStr();
    if (btnToday) btnToday.classList.add("active");
    if (btnAll) btnAll.classList.remove("active");
  } else {
    if (sInp) sInp.value = "";
    if (eInp) eInp.value = "";
    if (btnAll) btnAll.classList.add("active");
    if (btnToday) btnToday.classList.remove("active");
  }
  window.filterWithdrawalsModal();
};

window.filterWithdrawalsModal = function() {
  const isAr = (currentLang === "ar");
  const sDate = document.getElementById("wdFilterStartDate")?.value || "";
  const eDate = document.getElementById("wdFilterEndDate")?.value || "";
  const tbody = document.getElementById("withdrawalsDetailsTbody");

  const list = Array.isArray(expensesByDate) ? expensesByDate : [];
  const wdItems = list.filter(e => {
    if (!e || (e.type !== 'withdrawal' && !e.isWithdrawal)) return false;
    const d = e.date || "";
    if (sDate && d < sDate) return false;
    if (eDate && d > eDate) return false;
    return true;
  }).reverse();

  let total = 0, cash = 0, instapay = 0, wallet = 0;
  wdItems.forEach(e => {
    const a = Number(e.amount) || 0;
    total += a;
    const m = e.method || 'cash';
    if (m === 'cash') cash += a;
    else if (m === 'instapay') instapay += a;
    else if (m === 'wallet') wallet += a;
    else cash += a;
  });

  if (document.getElementById("wdModalTotal")) document.getElementById("wdModalTotal").textContent = total.toLocaleString() + " ط¬";
  if (document.getElementById("wdModalCash")) document.getElementById("wdModalCash").textContent = cash.toLocaleString() + " ط¬";
  if (document.getElementById("wdModalInstapay")) document.getElementById("wdModalInstapay").textContent = instapay.toLocaleString() + " ط¬";
  if (document.getElementById("wdModalWallet")) document.getElementById("wdModalWallet").textContent = wallet.toLocaleString() + " ط¬";

  const mBadges = {
    cash: { text: isAr ? "ط¯ط±ط¬ ط§ظ„ظƒط§ط´" : "Cash Drawer", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
    instapay: { text: isAr ? "ط­ط³ط§ط¨ ط¥ظ†ط³طھط§ط¨ط§ظٹ" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
    wallet: { text: isAr ? "ظ…ط­ظپط¸ط© ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
  };

  if (!tbody) return;
  if (wdItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ظ…ط³ط­ظˆط¨ط§طھ ظ…ط³ط¬ظ„ط© ظپظٹ ظ‡ط°ظ‡ ط§ظ„ظپطھط±ط©" : "No withdrawals found for this period"}</td></tr>`;
  } else {
    tbody.innerHTML = wdItems.map(e => {
      const mb = mBadges[e.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${e.date || "â€”"}</td>
          <td style="font-weight:800; color:#f59e0b; font-size:1.05em;">${e.amount} ط¬</td>
          <td style="font-weight:600;">${e.reason || (isAr ? "ظ…ط³ط­ظˆط¨ط§طھ ط´ط®طµظٹط©" : "Withdrawal")} ${e.recipient ? `(${e.recipient})` : ""}</td>
          <td><span class="badge" style="background:${mb.bg}; color:${mb.color}; font-weight:700;">${mb.text}</span></td>
        </tr>
      `;
    }).join("");
  }
};


// --- 4. DISCOUNTS & EXEMPTIONS DETAILS MODAL WITH PAGINATION ---
window.discModalCurrentPage = 1;
const DISC_MODAL_PAGE_SIZE = 5;

window.openDiscountsDetailsModal = function() {
  const modal = document.getElementById("discountsDetailsModal");
  if (!modal) return;
  window.discModalCurrentPage = 1;
  if (document.getElementById("discSearchInp")) document.getElementById("discSearchInp").value = "";
  window.renderDiscountsModalTable();
  modal.classList.remove("hidden");
};

window.closeDiscountsDetailsModal = function() {
  const modal = document.getElementById("discountsDetailsModal");
  if (modal) modal.classList.add("hidden");
};

window.discModalPrevPage = function() {
  if (window.discModalCurrentPage > 1) {
    window.discModalCurrentPage--;
    window.renderDiscountsModalTable();
  }
};

window.discModalNextPage = function() {
  const q = document.getElementById("discSearchInp")?.value.toLowerCase().trim() || "";
  const discStudents = Object.values(students || {}).filter(s => {
    if (!s || !s.name) return false;
    if (Number(s.discount) <= 0) return false;
    if (q && !s.name.toLowerCase().includes(q) && !String(s.id).includes(q)) return false;
    return true;
  });
  const totalPages = Math.ceil(discStudents.length / DISC_MODAL_PAGE_SIZE) || 1;
  if (window.discModalCurrentPage < totalPages) {
    window.discModalCurrentPage++;
    window.renderDiscountsModalTable();
  }
};

window.renderDiscountsModalTable = function() {
  const isAr = (currentLang === "ar");
  const tbody = document.getElementById("discountsDetailsTbody");
  const q = document.getElementById("discSearchInp")?.value.toLowerCase().trim() || "";

  const discStudents = Object.values(students || {}).filter(s => {
    if (!s || !s.name) return false;
    if (Number(s.discount) <= 0) return false;
    if (q && !s.name.toLowerCase().includes(q) && !String(s.id).includes(q)) return false;
    return true;
  });

  const totalDisc = Object.values(students || {}).reduce((sum, s) => sum + (Number(s?.discount) || 0), 0);
  const totalCount = Object.values(students || {}).filter(s => Number(s?.discount) > 0).length;

  if (document.getElementById("discModalTotalAmt")) document.getElementById("discModalTotalAmt").textContent = totalDisc.toLocaleString() + " ط¬";
  if (document.getElementById("discModalCount")) document.getElementById("discModalCount").textContent = totalCount + (isAr ? " ط·ط§ظ„ط¨" : " Students");

  // Pagination calculation
  const totalPages = Math.ceil(discStudents.length / DISC_MODAL_PAGE_SIZE) || 1;
  if (window.discModalCurrentPage > totalPages) window.discModalCurrentPage = totalPages;
  if (window.discModalCurrentPage < 1) window.discModalCurrentPage = 1;

  const startIdx = (window.discModalCurrentPage - 1) * DISC_MODAL_PAGE_SIZE;
  const pageItems = discStudents.slice(startIdx, startIdx + DISC_MODAL_PAGE_SIZE);

  // Update pagination UI
  const prevBtn = document.getElementById("discPrevBtn");
  const nextBtn = document.getElementById("discNextBtn");
  const curPageEl = document.getElementById("discCurrentPageNum");
  const totalPagesEl = document.getElementById("discTotalPagesNum");
  const showingCountEl = document.getElementById("discShowingCount");
  const totalCountEl = document.getElementById("discTotalCount");

  if (prevBtn) prevBtn.disabled = (window.discModalCurrentPage <= 1);
  if (nextBtn) nextBtn.disabled = (window.discModalCurrentPage >= totalPages);
  if (curPageEl) curPageEl.textContent = window.discModalCurrentPage;
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (showingCountEl) showingCountEl.textContent = pageItems.length;
  if (totalCountEl) totalCountEl.textContent = discStudents.length;

  if (!tbody) return;
  if (discStudents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ ظٹظˆط¬ط¯ ط·ظ„ط§ط¨ ط­ط§طµظ„ظٹظ† ط¹ظ„ظ‰ ط®طµظˆظ…ط§طھ طھط·ط§ط¨ظ‚ ط§ظ„ط¨ط­ط«" : "No discounted students found"}</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map(s => {
      const cls = (s.className && s.className !== 'ط¹ط§ظ…' && s.className !== 'Without Package') ? s.className : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package");
      const paid = Number(s.paid) || 0;
      const disc = Number(s.discount) || 0;
      const debt = Math.max(0, (Number(s.totalReq) || 0) - paid - disc);

      return `
        <tr>
          <td style="font-weight:700; color:var(--text-secondary);">#${s.id}</td>
          <td style="font-weight:800;">${s.name}</td>
          <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${cls}</span></td>
          <td style="font-weight:800; color:#06b6d4; font-size:1.05em;">${disc} ط¬</td>
          <td style="font-weight:700; color:#10b981;">${paid} ط¬</td>
          <td style="font-weight:700; color:${debt > 0 ? '#ef4444' : '#10b981'};">${debt > 0 ? debt + ' ط¬' : (isAr ? 'ط®ط§ظ„طµ' : 'Paid')}</td>
          <td>
            <a href="../assistant/index.html?openId=${s.id}" target="_blank" class="btn secondary smallBtn" style="padding:4px 10px; font-size:0.8em; text-decoration:none;">
              <i class="fa-solid fa-folder-open"></i> ${isAr ? "ط§ظ„ظ…ظ„ظپ" : "Profile"}
            </a>
          </td>
        </tr>
      `;
    }).join("");
  }
};

// --- 5. REVENUE BREAKDOWN MODAL WITH DATE RANGE FILTER ---
window.setRevQuickDate = function(mode) {
  const sInp = document.getElementById("revFilterStartDate");
  const eInp = document.getElementById("revFilterEndDate");
  const btnAll = document.getElementById("revQuickAll");
  const btnToday = document.getElementById("revQuickToday");

  if (mode === 'today') {
    if (sInp) sInp.value = nowDateStr();
    if (eInp) eInp.value = nowDateStr();
    if (btnToday) btnToday.classList.add("active");
    if (btnAll) btnAll.classList.remove("active");
  } else {
    if (sInp) sInp.value = "";
    if (eInp) eInp.value = "";
    if (btnAll) btnAll.classList.add("active");
    if (btnToday) btnToday.classList.remove("active");
  }
  window.filterRevenueModal();
};

window.filterRevenueModal = function() {
  const isAr = (currentLang === "ar");
  const sDate = document.getElementById("revFilterStartDate")?.value || "";
  const eDate = document.getElementById("revFilterEndDate")?.value || "";
  const tbody = document.getElementById("revenueFilteredTbody");
  const curr = isAr ? " ط¬" : " EGP";

  let regCash = 0, regInstapay = 0, regWallet = 0;
  let sessCash = 0, sessInstapay = 0, sessWallet = 0;
  let bklCash = 0, bklInstapay = 0, bklWallet = 0;
  const inFlowItems = [];

  // A. Regular Students Inflow
  Object.values(students || {}).forEach(st => {
    if (!st || !st.name) return;
    if (st.payments && Array.isArray(st.payments)) {
      st.payments.forEach(p => {
        const d = p.date || "";
        if (sDate && d < sDate) return;
        if (eDate && d > eDate) return;
        const amt = Number(p.amount) || 0;
        const m = p.method || 'cash';
        if (m === 'cash') regCash += amt;
        else if (m === 'instapay') regInstapay += amt;
        else if (m === 'wallet') regWallet += amt;
        else regCash += amt;

        inFlowItems.push({
          date: d || nowDateStr(),
          source: st.name + ` (#${st.id})`,
          channel: isAr ? "ط§ط´طھط±ط§ظƒ ط¨ط§ظ‚ط©" : "Package Subscription",
          amount: amt,
          method: m
        });
      });
    } else if (Number(st.paid) > 0 && !sDate && !eDate) {
      const amt = Number(st.paid);
      const m = st.paymentPlan || 'cash';
      if (m === 'cash') regCash += amt;
      else if (m === 'instapay') regInstapay += amt;
      else if (m === 'wallet') regWallet += amt;
      else regCash += amt;
    }
  });

  // B. Session Students Inflow
  for (const d in sessionStudentsByDate) {
    if (sDate && d < sDate) continue;
    if (eDate && d > eDate) continue;
    const sList = sessionStudentsByDate[d] || [];
    sList.forEach(it => {
      const amt = Number(it.amount) || 0;
      const m = it.method || 'cash';
      if (m === 'cash') sessCash += amt;
      else if (m === 'instapay') sessInstapay += amt;
      else if (m === 'wallet') sessWallet += amt;
      else sessCash += amt;

      inFlowItems.push({
        date: d,
        source: it.name + (it.className ? ` (${it.className})` : ""),
        channel: isAr ? "ط·ط§ظ„ط¨ ط­طµط© ظپظˆط±ظٹط©" : "Session Student",
        amount: amt,
        method: m
      });
    });
  }

  // C. Booklet Sales
  if (!sDate && !eDate) {
    Object.values(booklets || {}).forEach(b => {
      const soldQty = Number(b.sold) || 0;
      const price = Number(b.price) || 0;
      const bRev = soldQty * price;
      if (bRev > 0) {
        bklCash += bRev;
        inFlowItems.push({
          date: nowDateStr(),
          source: (isAr ? "ظ…ط¨ظٹط¹ط§طھ ظ…ط°ظƒط±ط©: " : "Booklet: ") + (b.name || ""),
          channel: isAr ? "ظ…ط°ظƒط±ط§طھ ظˆظ…ط®ط²ظ†" : "Booklet Inventory",
          amount: bRev,
          method: 'cash'
        });
      }
    });
  }

  const regTotal = regCash + regInstapay + regWallet;
  const sessTotal = sessCash + sessInstapay + sessWallet;
  const bklTotal = bklCash + bklInstapay + bklWallet;
  const gTotal = regTotal + sessTotal + bklTotal;

  // Update UI Elements
  if (document.getElementById("revModalGrandTotal")) document.getElementById("revModalGrandTotal").textContent = gTotal.toLocaleString() + curr;

  const regPct = gTotal > 0 ? Math.round((regTotal / gTotal) * 100) : 0;
  const sessPct = gTotal > 0 ? Math.round((sessTotal / gTotal) * 100) : 0;
  const bklPct = gTotal > 0 ? Math.max(0, 100 - regPct - sessPct) : 0;

  if (document.getElementById("revBarRegPct")) document.getElementById("revBarRegPct").textContent = regPct + "%";
  if (document.getElementById("revBarSessPct")) document.getElementById("revBarSessPct").textContent = sessPct + "%";
  if (document.getElementById("revBarBklPct")) document.getElementById("revBarBklPct").textContent = bklPct + "%";

  if (document.getElementById("revBarReg")) document.getElementById("revBarReg").style.width = regPct + "%";
  if (document.getElementById("revBarSess")) document.getElementById("revBarSess").style.width = sessPct + "%";
  if (document.getElementById("revBarBkl")) document.getElementById("revBarBkl").style.width = bklPct + "%";

  // Channel Cards
  if (document.getElementById("revCardRegTotal")) document.getElementById("revCardRegTotal").textContent = regTotal.toLocaleString() + curr;
  if (document.getElementById("revCardRegCash")) document.getElementById("revCardRegCash").textContent = regCash.toLocaleString() + curr;
  if (document.getElementById("revCardRegInstapay")) document.getElementById("revCardRegInstapay").textContent = regInstapay.toLocaleString() + curr;
  if (document.getElementById("revCardRegWallet")) document.getElementById("revCardRegWallet").textContent = regWallet.toLocaleString() + curr;

  if (document.getElementById("revCardSessTotal")) document.getElementById("revCardSessTotal").textContent = sessTotal.toLocaleString() + curr;
  if (document.getElementById("revCardSessCash")) document.getElementById("revCardSessCash").textContent = sessCash.toLocaleString() + curr;
  if (document.getElementById("revCardSessInstapay")) document.getElementById("revCardSessInstapay").textContent = sessInstapay.toLocaleString() + curr;
  if (document.getElementById("revCardSessWallet")) document.getElementById("revCardSessWallet").textContent = sessWallet.toLocaleString() + curr;

  if (document.getElementById("revCardBklTotal")) document.getElementById("revCardBklTotal").textContent = bklTotal.toLocaleString() + curr;
  if (document.getElementById("revCardBklCash")) document.getElementById("revCardBklCash").textContent = bklCash.toLocaleString() + curr;
  if (document.getElementById("revCardBklInstapay")) document.getElementById("revCardBklInstapay").textContent = bklInstapay.toLocaleString() + curr;
  if (document.getElementById("revCardBklWallet")) document.getElementById("revCardBklWallet").textContent = bklWallet.toLocaleString() + curr;

  // Horizontal Totals
  if (document.getElementById("revTotalMethodCash")) document.getElementById("revTotalMethodCash").textContent = (regCash + sessCash + bklCash).toLocaleString() + curr;
  if (document.getElementById("revTotalMethodInstapay")) document.getElementById("revTotalMethodInstapay").textContent = (regInstapay + sessInstapay + bklInstapay).toLocaleString() + curr;
  if (document.getElementById("revTotalMethodWallet")) document.getElementById("revTotalMethodWallet").textContent = (regWallet + sessWallet + bklWallet).toLocaleString() + curr;

  if (document.getElementById("revFilterCountBadge")) {
    document.getElementById("revFilterCountBadge").textContent = inFlowItems.length + (isAr ? " ط­ط±ظƒط©" : " items");
  }

  // Render Table
  if (!tbody) return;
  if (inFlowItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط­ط±ظƒط§طھ ط¥ظٹط±ط§ط¯ ظپظٹ ظ‡ط°ظ‡ ط§ظ„ظپطھط±ط©" : "No revenue records found"}</td></tr>`;
  } else {
    const mBadges = {
      cash: { text: isAr ? "ظƒط§ط´ (ط¯ط±ط¬)" : "Cash", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
      instapay: { text: isAr ? "ط¥ظ†ط³طھط§ط¨ط§ظٹ" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
      wallet: { text: isAr ? "ظپظˆط¯ط§ظپظˆظ† ظƒط§ط´" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
    };

    tbody.innerHTML = inFlowItems.reverse().map(it => {
      const mb = mBadges[it.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${it.date}</td>
          <td style="font-weight:700;">${it.source}</td>
          <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${it.channel}</span></td>
          <td style="font-weight:800; color:#10b981; font-size:1.05em;">+${it.amount} ط¬</td>
          <td><span class="badge" style="background:${mb.bg}; color:${mb.color}; font-weight:700;">${mb.text}</span></td>
        </tr>
      `;
    }).join("");
  }
};


// ========================================================
// 5. HELPER: Calculate Student Financial Status
// ========================================================
window.getStudentFinancialStatus = function(st) {
  if (!st) return { req: 0, paid: 0, discount: 0, debt: 0 };
  let req = 0;
  const normName = str => String(str || '').replace(/^ط¨ط§ظ‚ط©\s+/, '').trim().toLowerCase();

  const getPriceForPkg = (candidate) => {
    if (!candidate) return 0;
    const clean = normName(candidate);
    if (packages && packages[candidate]) return Number(packages[candidate].price) || 0;
    if (groupFees && groupFees[candidate]) {
      return typeof groupFees[candidate] === 'object' ? (Number(groupFees[candidate].price) || 0) : (Number(groupFees[candidate]) || 0);
    }
    for (const pk in (packages || {})) {
      if (normName(pk) === clean) return Number(packages[pk].price) || 0;
    }
    for (const gk in (groupFees || {})) {
      if (normName(gk) === clean) {
        return typeof groupFees[gk] === 'object' ? (Number(groupFees[gk].price) || 0) : (Number(groupFees[gk]) || 0);
      }
    }
    return 0;
  };

  const cls = st.className;
  const stPkgs = (Array.isArray(st.packages) && st.packages.length > 0) 
    ? st.packages.filter(p => p && p !== 'ط¹ط§ظ…' && p !== 'Without Package' && p !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && p !== 'Without Package') 
    : (cls && cls !== 'ط¹ط§ظ…' && cls !== 'Without Package' && cls !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©' && cls !== 'Without Package' ? [cls] : []);
  const checked = new Set();
  stPkgs.forEach(pName => {
    const clean = normName(pName);
    if (!clean || checked.has(clean)) return;
    checked.add(clean);
    req += getPriceForPkg(pName);
  });
  
  const paid = Number(st.paid) || 0;
  const discount = Number(st.discount) || 0;
  const debt = Math.max(0, req - paid - discount);

  return { req, paid, discount, debt };
};


// ========================================================
// 6. DEBTS DETAILS MODAL (طھظپط§طµظٹظ„ ط§ظ„ظ…طھط¨ظ‚ظٹ ظˆط§ظ„ط¯ظٹظˆظ† ط¹ظ„ظ‰ ط§ظ„ط·ظ„ط§ط¨)
// ========================================================
window.debtsModalCurrentPage = 1;
const DEBTS_MODAL_PAGE_SIZE = 25;

window.openDebtsDetailsModal = function() {
  const modal = document.getElementById("debtsDetailsModal");
  if (!modal) return;
  window.debtsModalCurrentPage = 1;
  const searchInp = document.getElementById("debtsSearchInp");
  if (searchInp) searchInp.value = "";
  window.renderDebtsModalTable();
  modal.classList.remove("hidden");
};

window.closeDebtsDetailsModal = function() {
  const modal = document.getElementById("debtsDetailsModal");
  if (modal) modal.classList.add("hidden");
};

window.debtsModalPrevPage = function() {
  if (window.debtsModalCurrentPage > 1) {
    window.debtsModalCurrentPage--;
    window.renderDebtsModalTable();
  }
};

window.debtsModalNextPage = function() {
  window.debtsModalCurrentPage++;
  window.renderDebtsModalTable();
};

window.renderDebtsModalTable = function() {
  const isAr = (currentLang === "ar");
  const tbody = document.getElementById("debtsDetailsTbody");
  const q = (document.getElementById("debtsSearchInp")?.value || "").toLowerCase().trim();

  const allStudents = Object.values(students || {});
  const debtors = [];
  let totalDebtAmount = 0;

  allStudents.forEach(st => {
    if (!st || !st.name) return;
    const fin = window.getStudentFinancialStatus(st);
    if (fin.debt > 0) {
      totalDebtAmount += fin.debt;
      if (q && !st.name.toLowerCase().includes(q) && !String(st.id).includes(q)) return;
      debtors.push({
        id: st.id,
        name: st.name,
        className: (st.className && st.className !== 'ط¹ط§ظ…' && st.className !== 'Without Package') ? st.className : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package"),
        phone: st.phone || "â€”",
        parentPhone: st.parentPhone || "â€”",
        req: fin.req,
        paid: fin.paid,
        debt: fin.debt
      });
    }
  });

  // Sort highest debt first
  debtors.sort((a, b) => b.debt - a.debt);

  // Update KPI counters
  if (document.getElementById("debtsModalTotal")) {
    document.getElementById("debtsModalTotal").textContent = totalDebtAmount.toLocaleString() + " ط¬";
  }
  if (document.getElementById("debtsModalCount")) {
    document.getElementById("debtsModalCount").textContent = debtors.length + (isAr ? " ط·ط§ظ„ط¨" : " Students");
  }

  // Pagination calculation
  const totalPages = Math.ceil(debtors.length / DEBTS_MODAL_PAGE_SIZE) || 1;
  if (window.debtsModalCurrentPage > totalPages) window.debtsModalCurrentPage = totalPages;
  if (window.debtsModalCurrentPage < 1) window.debtsModalCurrentPage = 1;

  const startIdx = (window.debtsModalCurrentPage - 1) * DEBTS_MODAL_PAGE_SIZE;
  const pageItems = debtors.slice(startIdx, startIdx + DEBTS_MODAL_PAGE_SIZE);

  // Update pagination UI controls
  const prevBtn = document.getElementById("debtsPrevBtn");
  const nextBtn = document.getElementById("debtsNextBtn");
  const curPageEl = document.getElementById("debtsCurrentPageNum");
  const totalPagesEl = document.getElementById("debtsTotalPagesNum");
  const showingCountEl = document.getElementById("debtsShowingCount");
  const totalCountEl = document.getElementById("debtsTotalCount");

  if (prevBtn) prevBtn.disabled = (window.debtsModalCurrentPage <= 1);
  if (nextBtn) nextBtn.disabled = (window.debtsModalCurrentPage >= totalPages);
  if (curPageEl) curPageEl.textContent = window.debtsModalCurrentPage;
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (showingCountEl) showingCountEl.textContent = pageItems.length;
  if (totalCountEl) totalCountEl.textContent = debtors.length;

  if (!tbody) return;
  if (debtors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-secondary); font-weight:600;">${isAr ? "ظ„ط§ طھظˆط¬ط¯ ط¯ظٹظˆظ† ظ…ط³ط¬ظ„ط© ظ…ط·ط§ط¨ظ‚ط© ظ„ظ„ط¨ط­ط«" : "No debt records found"}</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(st => {
    return `
      <tr>
        <td style="font-weight:700; color:var(--text-secondary);">#${st.id}</td>
        <td style="font-weight:800; color:var(--text-primary);">${st.name}</td>
        <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${st.className}</span></td>
        <td style="font-weight:700;">${st.req} ط¬</td>
        <td style="font-weight:700; color:#10b981;">${st.paid} ط¬</td>
        <td style="font-weight:900; color:#ef4444; font-size:1.05em;">${st.debt} ط¬</td>
        <td>
          <a href="../assistant/index.html?openId=${st.id}" target="_blank" class="btn secondary smallBtn" style="padding:4px 10px; font-size:0.8em; text-decoration:none;" title="${isAr ? 'ظپطھط­ ظ…ظ„ظپ ط§ظ„ط·ط§ظ„ط¨' : 'Open Profile'}">
            <i class="fa-solid fa-folder-open"></i>
          </a>
        </td>
      </tr>
    `;
  }).join("");
};


// ========================================================
// 7. VAULTS BREAKDOWN MODAL (طھظپط§طµظٹظ„ طµط§ظپظٹ ط±طµظٹط¯ ط§ظ„ط®ط²ط§ط¦ظ† ط§ظ„ظ…طھط§ط­)
// ========================================================
window.openVaultsBreakdownModal = function() {
  const modal = document.getElementById("vaultsBreakdownModal");
  if (!modal) return;

  const isAr = (currentLang === "ar");
  const b = window.vaultLiveBalances || {};
  const cashIn = Number(b.cashIn) || 0;
  const cashOut = Number(b.cashOut) || 0;
  const cashBal = Number(b.cash) || 0;

  const instapayIn = Number(b.instapayIn) || 0;
  const instapayOut = Number(b.instapayOut) || 0;
  const instapayBal = Number(b.instapay) || 0;

  const walletIn = Number(b.walletIn) || 0;
  const walletOut = Number(b.walletOut) || 0;
  const walletBal = Number(b.wallet) || 0;

  const grandNet = cashBal + instapayBal + walletBal;

  // Grand Total Liquidity
  const grandEl = document.getElementById("vaultsModalGrandTotal");
  if (grandEl) grandEl.textContent = grandNet.toLocaleString() + " ط¬";

  // Cash Drawer
  if (document.getElementById("vaultsModalCashIn")) document.getElementById("vaultsModalCashIn").textContent = cashIn.toLocaleString() + " ط¬";
  if (document.getElementById("vaultsModalCashOut")) document.getElementById("vaultsModalCashOut").textContent = cashOut.toLocaleString() + " ط¬";
  const cashBalEl = document.getElementById("vaultsModalCashBal");
  if (cashBalEl) {
    cashBalEl.textContent = cashBal.toLocaleString() + " ط¬";
    cashBalEl.style.color = cashBal < 0 ? "#ef4444" : "#10b981";
  }

  // InstaPay
  if (document.getElementById("vaultsModalInstapayIn")) document.getElementById("vaultsModalInstapayIn").textContent = instapayIn.toLocaleString() + " ط¬";
  if (document.getElementById("vaultsModalInstapayOut")) document.getElementById("vaultsModalInstapayOut").textContent = instapayOut.toLocaleString() + " ط¬";
  const instapayBalEl = document.getElementById("vaultsModalInstapayBal");
  if (instapayBalEl) {
    if (instapayBal < 0) {
      instapayBalEl.innerHTML = `<span style="color:#ef4444; direction:ltr; unicode-bidi:embed;">-${Math.abs(instapayBal).toLocaleString()} ط¬</span> <span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-size:0.65em; font-weight:700; margin-inline-start:4px;">${isAr ? 'ط¹ط¬ط² ظ…ط¤ظ‚طھ' : 'Deficit'}</span>`;
    } else {
      instapayBalEl.textContent = instapayBal.toLocaleString() + " ط¬";
      instapayBalEl.style.color = "#7c3aed";
    }
  }

  // Vodafone Cash Wallet
  if (document.getElementById("vaultsModalWalletIn")) document.getElementById("vaultsModalWalletIn").textContent = walletIn.toLocaleString() + " ط¬";
  if (document.getElementById("vaultsModalWalletOut")) document.getElementById("vaultsModalWalletOut").textContent = walletOut.toLocaleString() + " ط¬";
  const walletBalEl = document.getElementById("vaultsModalWalletBal");
  if (walletBalEl) {
    walletBalEl.textContent = walletBal.toLocaleString() + " ط¬";
    walletBalEl.style.color = walletBal < 0 ? "#ef4444" : "#ef4444";
  }

  modal.classList.remove("hidden");
};

window.closeVaultsBreakdownModal = function() {
  const modal = document.getElementById("vaultsBreakdownModal");
  if (modal) modal.classList.add("hidden");
};


// ========================================================
// 8. REGISTERED STUDENTS LIST MODAL (ظ‚ط§ط¦ظ…ط© ظˆط¨ظٹط§ظ†ط§طھ ط§ظ„ط·ظ„ط§ط¨)
// ========================================================
window.studentsModalCurrentPage = 1;
const STUDENTS_MODAL_PAGE_SIZE = 30; // 30 students per page as requested

window.openStudentsListModal = function() {
  const modal = document.getElementById("studentsListModal");
  if (!modal) return;
  window.studentsModalCurrentPage = 1;
  const searchInp = document.getElementById("studentsSearchInp");
  if (searchInp) searchInp.value = "";

  // Populate classes filter dropdown
  const filterSel = document.getElementById("studentsClassFilter");
  if (filterSel) {
    const isAr = (currentLang === "ar");
    const classSet = new Set();
    Object.values(students || {}).forEach(s => {
      if (s && s.className && s.className !== 'ط¹ط§ظ…' && s.className !== 'Without Package') {
        classSet.add(s.className);
      }
    });
    filterSel.innerHTML = `<option value="">${isAr ? 'ط¬ظ…ظٹط¹ ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ ظˆط§ظ„طµظپظˆظپ' : 'All Classes'}</option>` + 
      [...classSet].sort().map(c => `<option value="${c}">${c}</option>`).join("");
  }

  window.renderStudentsListModal();
  modal.classList.remove("hidden");
};

window.closeStudentsListModal = function() {
  const modal = document.getElementById("studentsListModal");
  if (modal) modal.classList.add("hidden");
};

window.studentsModalPrevPage = function() {
  if (window.studentsModalCurrentPage > 1) {
    window.studentsModalCurrentPage--;
    window.renderStudentsListModal();
  }
};

window.studentsModalNextPage = function() {
  window.studentsModalCurrentPage++;
  window.renderStudentsListModal();
};

window.renderStudentsListModal = function() {
  const isAr = (currentLang === "ar");
  const tbody = document.getElementById("studentsListModalTbody");
  const q = (document.getElementById("studentsSearchInp")?.value || "").toLowerCase().trim();
  const clsFilter = document.getElementById("studentsClassFilter")?.value || "";

  const allStudents = Object.values(students || {}).filter(s => s && s.name);
  const totalRegCount = allStudents.length;
  let pkgCount = 0;
  let singleCount = (typeof window.getAdminUniqueSessionStudentsCount === 'function') ? window.getAdminUniqueSessionStudentsCount() : 0;

  const filtered = [];
  allStudents.forEach(st => {
    const cls = (st.className && st.className !== 'ط¹ط§ظ…' && st.className !== 'Without Package') ? st.className : (isAr ? "ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©" : "Without Package");
    if (st.className && st.className !== 'ط¹ط§ظ…' && st.className !== 'Without Package' && st.className !== 'ط¨ط¯ظˆظ† ط¨ط§ظ‚ط©') {
      pkgCount++;
    }

    if (clsFilter && st.className !== clsFilter) return;
    if (q) {
      const matchName = (st.name || '').toLowerCase().includes(q);
      const matchId = String(st.id || '').includes(q);
      const matchPhone = String(st.phone || '').includes(q);
      const matchParent = String(st.parentPhone || '').includes(q);
      if (!matchName && !matchId && !matchPhone && !matchParent) return;
    }

    const fin = window.getStudentFinancialStatus(st);
    filtered.push({
      id: st.id,
      name: st.name,
      className: cls,
      phone: st.phone || "â€”",
      parentPhone: st.parentPhone || "â€”",
      debt: fin.debt
    });
  });

  // Sort by ID
  filtered.sort((a, b) => Number(a.id) - Number(b.id));

  // Update KPI counters
  if (document.getElementById("studentsModalTotal")) document.getElementById("studentsModalTotal").textContent = totalRegCount;
  if (document.getElementById("studentsModalPackages")) document.getElementById("studentsModalPackages").textContent = pkgCount;
  if (document.getElementById("studentsModalSingle")) document.getElementById("studentsModalSingle").textContent = singleCount;

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / STUDENTS_MODAL_PAGE_SIZE) || 1;
  if (window.studentsModalCurrentPage > totalPages) window.studentsModalCurrentPage = totalPages;
  if (window.studentsModalCurrentPage < 1) window.studentsModalCurrentPage = 1;

  const startIdx = (window.studentsModalCurrentPage - 1) * STUDENTS_MODAL_PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + STUDENTS_MODAL_PAGE_SIZE);

  // Update pagination UI controls
  const prevBtn = document.getElementById("studentsPrevBtn");
  const nextBtn = document.getElementById("studentsNextBtn");
  const curPageEl = document.getElementById("studentsCurrentPageNum");
  const totalPagesEl = document.getElementById("studentsTotalPagesNum");
  const showingCountEl = document.getElementById("studentsShowingCount");
  const totalCountEl = document.getElementById("studentsTotalCount");

  if (prevBtn) prevBtn.disabled = (window.studentsModalCurrentPage <= 1);
  if (nextBtn) nextBtn.disabled = (window.studentsModalCurrentPage >= totalPages);
  if (curPageEl) curPageEl.textContent = window.studentsModalCurrentPage;
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (showingCountEl) showingCountEl.textContent = pageItems.length;
  if (totalCountEl) totalCountEl.textContent = filtered.length;

  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-secondary); font-weight:600;">${isAr ? "ظ„ط§ ظٹظˆط¬ط¯ ط·ظ„ط§ط¨ ظٹط·ط§ط¨ظ‚ظˆظ† ط®ظٹط§ط±ط§طھ ط§ظ„ط¨ط­ط«" : "No matching students found"}</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(st => {
    const statusBadge = st.debt > 0
      ? `<span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-weight:700;">${isAr ? 'ظ…طھط¨ظ‚ظٹ ' + st.debt + ' ط¬' : 'Debt ' + st.debt + ' EGP'}</span>`
      : `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">${isAr ? 'ط®ط§ظ„طµ' : 'Paid'}</span>`;

    return `
      <tr>
        <td style="font-weight:700; color:var(--text-secondary);">#${st.id}</td>
        <td style="font-weight:800; color:var(--text-primary);">${st.name}</td>
        <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${st.className}</span></td>
        <td style="font-weight:600;">${st.phone}</td>
        <td style="font-weight:600; color:var(--text-secondary);">${st.parentPhone}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join("");
};

