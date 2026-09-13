// =========================================================
// STUDIFY ADMIN PORTAL ENGINE (admin.js)
// Standalone Manager Dashboard & High-Performance Control Logic
// =========================================================

const SUPABASE_URL = "https://erwrrvafuxezszgbiswg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyd3JydmFmdXhlenN6Z2Jpc3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTI4NzMsImV4cCI6MjEwMjgyODg3M30.xNbyENlnwes4XPWFoc10tooQTIC49WYo2zurvugkf9g";

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
window.supabaseClient = supabase;

// BroadcastChannel for 0-latency multi-tab sync
const permChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('studify_permissions_sync') : null;

// =============================================================================
// COMPLETE ADMIN LOCALIZATION DICTIONARY & I18N ENGINE
// =============================================================================
let currentLang = localStorage.getItem("ca_lang") || "ar";

const ADMIN_DICT = {
  // Assistants View & Modals
  "asst_mgmt_title": { ar: "إدارة المساعدين والتحكم في الصلاحيات", en: "Assistants & Permissions Management" },
  "asst_mgmt_desc": { ar: "تحكم بشكل مباشر في الميزات المتاحة لكل مساعد. أي تعديل يتم تطبيقه فوراً ولحظياً في صفحة المساعد المفتوحة.", en: "Directly control permissions available for each assistant. Any modifications are applied instantly to the assistant's active session." },
  "btn_add_asst": { ar: "إضافة مساعد جديد", en: "Add New Assistant" },
  "asst_created_at": { ar: "تاريخ الإنشاء:", en: "Created:" },
  "btn_asst_pass": { ar: "كلمة المرور", en: "Password" },
  "btn_asst_delete": { ar: "حذف", en: "Delete" },
  "asst_empty_title": { ar: "لا يوجد مساعدين مسجلين بعد", en: "No assistants registered yet" },
  "asst_empty_desc": { ar: "اضغط على 'إضافة مساعد جديد' لإنشاء أول حساب وتحديد صلاحياته.", en: "Click 'Add New Assistant' to create the first account and configure permissions." },
  "asst_loading": { ar: "جاري جلب المساعدين والصلاحيات...", en: "Loading assistants and permissions..." },

  // Edit Password Modal
  "modal_edit_pass_title": { ar: "تعديل كلمة مرور المساعد:", en: "Update Assistant Password:" },
  "modal_edit_pass_desc": { ar: "معاينة كلمة المرور الحالية وتعيين كلمة مرور جديدة ومحدثة فوراً", en: "View current password and set a new updated password instantly" },
  "modal_current_pass_lbl": { ar: "كلمة المرور الحالية المسجلة:", en: "Current Registered Password:" },
  "modal_current_pass_hint": { ar: "هذه هي كلمة المرور الحالية المستخدمة للدخول.", en: "This is the current password used for logging in." },
  "modal_new_pass_lbl": { ar: "أدخل كلمة المرور الجديدة:", en: "Enter New Password:" },
  "modal_new_pass_ph": { ar: "اكتب كلمة المرور الجديدة هنا", en: "Type the new password here" },
  "modal_new_pass_hint": { ar: "على الأقل 6 خانات (حروف أو أرقام).", en: "At least 6 characters (letters or numbers)." },
  "modal_btn_save_pass": { ar: "تحديث كلمة المرور", en: "Update Password" },

  // Navigation & Sections
  "nav_sec_finance": { ar: "التقارير المالية", en: "Financial Reports" },
  "nav_daily_report": { ar: "التقرير اليومي", en: "Daily Report" },
  "nav_term_report": { ar: "تقرير الترم المالي", en: "Term Financial Report" },
  "nav_sec_management": { ar: "الإدارة والمساعدين", en: "Management & Assistants" },
  "nav_assistants": { ar: "إدارة المساعدين والصلاحيات", en: "Assistants & Permissions" },
  "nav_decisions": { ar: "طلبات القرارات", en: "Decision Requests" },
  "nav_packages": { ar: "الباقات والمصاريف", en: "Packages & Expenses" },
  "nav_syllabus": { ar: "خريطة سير المنهج", en: "Syllabus Roadmap" },
  "nav_sec_system": { ar: "إعدادات النظام", en: "System Settings" },
  "nav_settings": { ar: "الإعدادات المتقدمة والنسخ الاحتياطي", en: "Advanced Settings & Backup" },
  "nav_sec_subscription": { ar: "الاشتراك والباقة", en: "Subscription & Plan" },
  "nav_subscription": { ar: "خطة الاشتراك", en: "Subscription Plan" },
  "nav_logout": { ar: "تسجيل الخروج", en: "Logout" },
  "nav_mobile_menu": { ar: "القائمة", en: "Menu" },

  // Topbar
  "topbar_theme_title": { ar: "تبديل المظهر", en: "Toggle Theme" },
  "topbar_lang_title": { ar: "تبديل اللغة / Switch Language", en: "Switch Language" },
  "topbar_user_title": { ar: "الملف الشخصي والحساب", en: "Profile & Account" },

  // Login Screen
  "login_badge": { ar: "الإدارة العليا والتحكم المركزي", en: "Executive Management & Central Control" },
  "login_title": { ar: "لوحة تحكم الإدارة", en: "Admin Control Panel" },
  "login_desc": { ar: "تسجيل الدخول المخصص لمدير المركز", en: "Dedicated login for Center Director" },
  "login_user_lbl": { ar: "اسم المستخدم أو البريد (المدير)", en: "Username or Email (Manager)" },
  "login_pass_lbl": { ar: "كلمة المرور", en: "Password" },
  "login_submit_btn": { ar: "دخول إلى لوحة الإدارة", en: "Login to Admin Dashboard" },
  "login_to_asst_portal": { ar: "بوابة المساعد والعمليات", en: "Assistant & Operations Portal" },
  "login_asst_desc": { ar: "تسجيل الحضور اليومي والمهام الميدانية", en: "Daily attendance & field operations" },

  // View 1: Daily Report
  "daily_shift_title": { ar: "حالة تشغيل الشيفت واليومية", en: "Shift & Operations Status" },
  "daily_shift_frozen": { ar: "مغلق ومجمد (OFF)", en: "Closed & Frozen (OFF)" },
  "daily_shift_active": { ar: "مفتوح ونشط (LIVE)", en: "Open & Active (LIVE)" },
  "daily_shift_desc_frozen": { ar: "اليومية متوقفة الآن، لا يمكن للمساعدين تسجيل حضور جديد لحين فتح الشيفت.", en: "Daily operations are currently paused. Assistants cannot record new attendance until shift is opened." },
  "daily_shift_desc_active": { ar: "اليومية قيد العمل المباشر وتستقبل عمليات الحضور والإيرادات بلحظتها.", en: "Daily operations are live and receiving real-time attendance and revenue transactions." },
  "daily_btn_activate": { ar: "تفعيل وبدء تشغيل اليومية", en: "Activate & Open Shift" },
  "daily_btn_freeze": { ar: "تجميد وقفل اليومية", en: "Freeze & Close Shift" },
  "stat_today_revenue": { ar: "إجمالي إيراد اليوم", en: "Total Today's Revenue" },
  "stat_today_expenses": { ar: "مصروفات اليوم", en: "Today's Expenses" },
  "stat_net_vault": { ar: "صافي النقدية بالخزينة", en: "Net Cash in Vault" },
  "stat_today_attending": { ar: "إجمالي الطلاب الحاضرين", en: "Total Attending Students" },
  "daily_approval_title": { ar: "اعتماد الحسابات اليومية وتصفير الشيفت", en: "Daily Financial Approval & Shift Closeout" },
  "daily_approval_desc": { ar: "الاعتماد النهائي للمبالغ المحصلة واستلام الخزينة من المساعد المسؤول.", en: "Final approval of collected funds and cash vault handoff from the shift assistant." },
  "daily_btn_approve": { ar: "اعتماد الحساب واستلام الخزينة", en: "Approve Accounts & Receive Vault" },
  "daily_approved_badge": { ar: "معتمد ومستلم", en: "Approved & Received" },
  "daily_tbl_st_title": { ar: "سجل حضور ومدفوعات اليوم التفصيلي", en: "Today's Detailed Attendance & Payments Log" },
  "th_st_id": { ar: "كود الطالب", en: "Student ID" },
  "th_st_name": { ar: "اسم الطالب", en: "Student Name" },
  "th_st_class": { ar: "الصف / المادة", en: "Class / Subject" },
  "th_amount": { ar: "المبلغ المدفوع", en: "Amount Paid" },
  "th_time": { ar: "توقيت التسجيل", en: "Timestamp" },
  "th_actions": { ar: "إجراءات", en: "Actions" },

  // View 2: Term Financial Report
  "term_report_title": { ar: "تقرير الإيرادات والمصروفات للترم المالي", en: "Term Financial Revenue & Expense Report" },
  "filter_from_date": { ar: "من تاريخ:", en: "From Date:" },
  "filter_to_date": { ar: "إلى تاريخ:", en: "To Date:" },
  "filter_class_all": { ar: "جميع المراحل الدراسية", en: "All Academic Grades" },
  "btn_export_excel": { ar: "تصدير Excel", en: "Export Excel" },
  "btn_print_term": { ar: "طباعة التقرير", en: "Print Report" },
  "stat_term_revenue": { ar: "إجمالي إيرادات الترم", en: "Total Term Revenue" },
  "stat_term_expenses": { ar: "إجمالي مصروفات الترم", en: "Total Term Expenses" },
  "stat_term_profit": { ar: "صافي أرباح المركز", en: "Center Net Profit" },
  "search_st_placeholder": { ar: "ابحث بالاسم أو كود الطالب...", en: "Search by student name or ID..." },
  "th_st_phone": { ar: "هاتف الطالب", en: "Student Phone" },
  "th_parent_phone": { ar: "هاتف ولي الأمر", en: "Parent Phone" },
  "th_total_paid": { ar: "إجمالي المدفوع", en: "Total Paid" },
  "th_discount": { ar: "الخصم", en: "Discount" },
  "th_att_count": { ar: "مرات الحضور", en: "Attendances" },
  "th_payment_status": { ar: "حالة السداد", en: "Payment Status" },

  // View 3: Assistants
  "asst_page_title": { ar: "إدارة المساعدين وصلاحيات العمليات", en: "Assistants & Operations Permissions" },
  "asst_page_desc": { ar: "التحكم في حسابات المساعدين، منح أو حجب الصلاحيات الفردية، وتعديل كلمات المرور.", en: "Manage assistant accounts, grant or revoke individual permissions, and reset passwords." },
  "btn_add_new_asst": { ar: "إضافة مساعد جديد", en: "Add New Assistant" },
  "th_username": { ar: "اسم المستخدم", en: "Username" },
  "th_role": { ar: "الدور الوظيفي", en: "Role" },
  "th_status": { ar: "الحالة", en: "Status" },
  "th_permissions": { ar: "الصلاحيات الممنوحة", en: "Granted Permissions" },
  "th_password": { ar: "كلمة المرور", en: "Password" },
  "btn_edit_pass": { ar: "تعديل", en: "Edit" },
  "perm_can_add_student": { ar: "إضافة طالب", en: "Add Student" },
  "perm_can_edit_student": { ar: "تعديل بيانات", en: "Edit Student" },
  "perm_can_delete_student": { ar: "حذف طالب", en: "Delete Student" },
  "perm_show_revenue": { ar: "رؤية الإيراد", en: "View Revenue" },
  "perm_manage_expenses": { ar: "إدارة المصروفات", en: "Manage Expenses" },
  "perm_manage_packages": { ar: "إدارة الباقات", en: "Manage Packages" },
  "perm_manage_booklets": { ar: "جرد المذكرات", en: "Inventory Booklets" },
  "perm_manage_syllabus": { ar: "تحديث المنهج", en: "Update Syllabus" },
  "perm_export_excel": { ar: "تصدير Excel", en: "Export Excel" },
  "perm_manage_groups": { ar: "إدارة المجموعات", en: "Manage Groups" },

  // View 4: Decision Requests
  "decisions_page_title": { ar: "صندوق طلبات القرارات الواردة من المساعدين", en: "Assistant Decision Requests Inbox" },
  "decisions_page_desc": { ar: "مراجعة واعتماد أو رفض طلبات الخصم والإعفاء المالي المقدمة من المساعدين.", en: "Review, approve, or reject discount and fee exemption requests submitted by assistants." },
  "tab_dec_pending": { ar: "الطلبات المعلقة", en: "Pending Requests" },
  "tab_dec_approved": { ar: "الطلبات المقبولة", en: "Approved Requests" },
  "tab_dec_rejected": { ar: "الطلبات المرفوضة", en: "Rejected Requests" },
  "btn_approve_req": { ar: "قبول واعتماد الخصم", en: "Approve & Apply Discount" },
  "btn_reject_req": { ar: "رفض الطلب", en: "Reject Request" },

  // View 5: Packages & Expenses
  "packages_mgmt_title": { ar: "إدارة باقات وأسعار المركز", en: "Center Packages & Pricing Management" },
  "btn_add_new_pkg": { ar: "إضافة باقة جديدة", en: "Add New Package" },
  "expenses_record_title": { ar: "تسجيل وتوثيق مصروفات المركز", en: "Record & Document Center Expenses" },
  "lbl_expense_reason": { ar: "بند المصروف / السبب", en: "Expense Item / Purpose" },
  "lbl_expense_amount": { ar: "المبلغ (ج)", en: "Amount (EGP)" },
  "lbl_expense_date": { ar: "التاريخ", en: "Date" },
  "btn_record_expense": { ar: "تسجيل المصروف", en: "Record Expense" },

  // View 6: Syllabus Roadmap
  "syllabus_mgmt_title": { ar: "إضافة وتحديث خطة سير المنهج الدراسي", en: "Add & Update Syllabus Roadmap Plan" },
  "lbl_syll_name": { ar: "اسم الفصل / الدرس", en: "Chapter / Lesson Name" },
  "lbl_syll_status": { ar: "حالة الشرح", en: "Progress Status" },
  "syll_status_not_started": { ar: "لم يبدأ بعد", en: "Not Started" },
  "syll_status_in_progress": { ar: "جاري الشرح", en: "In Progress" },
  "syll_status_completed": { ar: "تم الانتهاء", en: "Completed" },
  "lbl_syll_notes": { ar: "ملاحظات الحصة الأخيرة (تظهر للمساعدين)", en: "Latest Session Notes (Visible to Assistants)" },
  "btn_save_lesson": { ar: "حفظ وإضافة للجدول", en: "Save & Add to Roadmap" },
  "syllabus_timeline_title": { ar: "خريطة الدروس الحالية", en: "Current Lessons Roadmap" },

  // View 7: Subscriptions
  "sub_title": { ar: "خطط الاشتراك المتاحة — Standard", en: "Available Subscription Plans — Standard" },
  "sub_plan_flexible": { ar: "الخطة المرنة", en: "Flexible Plan" },
  "sub_plan_comfortable": { ar: "الخطة المريحة", en: "Comfortable Plan" },
  "sub_plan_golden": { ar: "الخطة الذهبية (الترم)", en: "Golden Term Plan" },
  "sub_btn_contact": { ar: "تواصل للاشتراك", en: "Contact to Subscribe" },

  // View 8: Settings, Appearance & Danger Zone
  "admin_set_ui_title": { ar: "المظهر وتخصيص اللغة", en: "Appearance & Language Customization" },
  "admin_lbl_theme": { ar: "مظهر النظام (الثيم):", en: "System Theme:" },
  "admin_theme_dark": { ar: "الوضع الليلي الفاخر (Dark Mode)", en: "Luxury Dark Mode" },
  "admin_theme_light": { ar: "الوضع النهاري (Light Mode)", en: "Crisp Light Mode" },
  "backup_card_title": { ar: "النسخ الاحتياطي وتصدير البيانات", en: "Data Backup & Export" },
  "btn_export_full_db": { ar: "تصدير قاعدة البيانات كاملة (Excel)", en: "Export Full Database (Excel)" },
  "btn_import_excel": { ar: "استيراد بيانات من Excel", en: "Import Data from Excel" },
  "danger_zone_title": { ar: "منطقة العمليات الحساسة (Danger Zone)", en: "Sensitive Operations (Danger Zone)" },
  "danger_zone_desc": { ar: "تصفير بيانات الحضور أو إعادة تعيين النظام بالكامل. هذه الخطوة لا يمكن التراجع عنها إلا باسترجاع نسخة احتياطية.", en: "Reset attendance records or perform a complete factory reset. This action is irreversible unless restored from backup." },
  "btn_reset_term": { ar: "تصفير حضور ومصاريف الترم بالكامل", en: "Reset Entire Term Attendance & Expenses" },
  "btn_factory_reset": { ar: "إعادة تهيئة النظام بالكامل (ضبط المصنع)", en: "Factory Reset Entire System" },

  // Modals & General
  "modal_add_asst_title": { ar: "إضافة حساب مساعد جديد", en: "Add New Assistant Account" },
  "modal_add_asst_desc": { ar: "قم بإنشاء حساب آمن لمساعدك لإدارة العمليات الميدانية والصلاحيات", en: "Create a secure account for your assistant to handle field operations and permissions" },
  "modal_asst_user_lbl": { ar: "اسم المستخدم للمساعد", en: "Assistant Username" },
  "modal_asst_user_hint": { ar: "اسم بالإنجليزية فقط بدون مسافات، سيتم استخدامه في تسجيل الدخول", en: "English characters only without spaces, used for signing in" },
  "modal_asst_pass_lbl": { ar: "كلمة المرور المؤقتة", en: "Temporary Password" },
  "modal_asst_pass_hint": { ar: "6 أحرف أو أرقام على الأقل، يمكن للمساعد تغييرها لاحقاً", en: "At least 6 characters, assistant can change it later" },
  "modal_btn_cancel": { ar: "إلغاء", en: "Cancel" },
  "modal_btn_create_asst": { ar: "إنشاء الحساب وتفعيل الصلاحيات", en: "Create Account & Grant Permissions" }
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

  // Update Topbar and Switcher Buttons
  const isAr = currentLang === "ar";
  const topbarLangBadge = document.getElementById("adminTopbarLangCode");
  if (topbarLangBadge) topbarLangBadge.innerText = isAr ? "EN" : "عربي";

  const currentLabel = document.getElementById("adminLangCurrentLabel");
  if (currentLabel) currentLabel.innerText = isAr ? "اللغة الحالية: العربية" : "Current Language: English";

  const subLabel = document.getElementById("adminLangSubLabel");
  if (subLabel) subLabel.innerText = isAr ? "انقر للتبديل إلى English بالكامل" : "Click to switch completely to Arabic";

  const btnText = document.getElementById("adminSettingsLangBtnText");
  if (btnText) btnText.innerText = isAr ? "English" : "العربية";

  // Update current active tab title in Topbar
  const tabConfigs = {
    dailyReport:  { title: isAr ? "التقرير اليومي" : "Daily Report", icon: "fa-calendar-day" },
    termReport:   { title: isAr ? "تقرير الترم المالي" : "Term Financial Report", icon: "fa-chart-line" },
    assistants:   { title: isAr ? "إدارة المساعدين والصلاحيات" : "Assistants & Permissions", icon: "fa-user-shield" },
    decisions:    { title: isAr ? "صندوق طلبات القرارات" : "Decision Requests Inbox", icon: "fa-bell" },
    packages:     { title: isAr ? "إدارة الباقات والمصاريف" : "Packages & Expenses", icon: "fa-box-archive" },
    syllabus:     { title: isAr ? "خريطة سير المنهج" : "Syllabus Roadmap", icon: "fa-book-open" },
    settings:     { title: isAr ? "الإعدادات المتقدمة والنسخ الاحتياطي" : "Advanced Settings & Backup", icon: "fa-sliders" },
    subscription: { title: isAr ? "خطة الاشتراك والباقة" : "Subscription Plan & Status", icon: "fa-crown" }
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

  // Live re-render active view in new language if already loaded
  const asstView = document.getElementById("viewAssistants");
  if (asstView && !asstView.classList.contains("hidden")) {
    window.fetchAssistants();
  }
  const termView = document.getElementById("viewTermReport");
  if (termView && !termView.classList.contains("hidden")) {
    window.renderTermTable();
  }
};

window.toggleAdminLanguage = function() {
  const targetLang = currentLang === "ar" ? "en" : "ar";
  const overlay = document.getElementById("adminLangSwitchOverlay");
  const textEl = document.getElementById("adminLangSwitchText");

  if (overlay && textEl) {
    textEl.innerText = targetLang === "en" ? "Switching to English... " : "جاري التبديل إلى العربية... ";
    overlay.classList.add("active");

    setTimeout(() => {
      currentLang = targetLang;
      localStorage.setItem("ca_lang", currentLang);
      window.applyAdminLanguage();

      setTimeout(() => {
        overlay.classList.remove("active");
      }, 350);
    }, 550);
  } else {
    currentLang = targetLang;
    localStorage.setItem("ca_lang", currentLang);
    window.applyAdminLanguage();
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
    realtimeShiftChannel.subscribe((status) => {
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
let expensesByDate = [];
let booklets = {};
let syllabusList = [];
let currentCenterId = localStorage.getItem("ca_manager_id") || "ahmedqutb11232_gmail_com";
let dailyApprovalMap = JSON.parse(localStorage.getItem('studify_daily_approval_map') || '{}');

// SUBSCRIPTION STATE (always loaded from Supabase, never stored in localStorage)
let SUBSCRIPTION = {
  isActive: false, planKey: null, planName: '—',
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
                paymentPlan: row.payment_plan || row.paymentPlan || existing.paymentPlan || 'cash',
                packages: Array.isArray(row.packages) ? row.packages : (existing.packages || []),
                payments: row.payments || existing.payments || [],
                attendanceDates: row.attendance_dates || existing.attendanceDates || [],
                status: row.status || existing.status || 'active'
              };
            }
          }
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
            if (Array.isArray(cfg.expenses_by_date)) {
              expensesByDate = cfg.expenses_by_date;
            } else if (cfg.expenses_by_date && typeof cfg.expenses_by_date === 'object') {
              const flatList = [];
              for (const dateKey in cfg.expenses_by_date) {
                const items = cfg.expenses_by_date[dateKey];
                if (Array.isArray(items)) {
                  items.forEach(item => {
                    if (item) flatList.push({ date: item.date || dateKey, reason: item.reason || '', amount: Number(item.amount) || 0, timestamp: item.timestamp || Date.now() });
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
          }
        } catch(err) {
          console.warn('[Admin Realtime Settings] Error handling payload:', err);
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
    label: { ar: "إظهار الإيراد اليومي", en: "Show Daily Revenue" }, 
    desc: { ar: "يعرض رقم إيراد الوردية الحالي في الشريط العلوي للمساعد", en: "Displays current shift revenue in assistant topbar" }, 
    icon: "fa-wallet", 
    group: "financial" 
  },
  { 
    key: "require_daily_approval", 
    label: { ar: "تفعيل الاعتماد اليومي", en: "Enable Daily Shift Closeout" }, 
    desc: { ar: "يجعل الإيراد معلقاً ولا يُضاف للإجمالي حتى يعتمده المدير", en: "Keeps revenue pending until approved by manager" }, 
    icon: "fa-shield-halved", 
    group: "financial" 
  },
  { 
    key: "can_request_discount", 
    label: { ar: "طلب خصم / إعفاء", en: "Request Discount / Exemption" }, 
    desc: { ar: "إظهار زر 'خصم' عند الدفع ليتمكن المساعد من طلب إعفاء", en: "Show 'Discount' button during payment to request exemption" }, 
    icon: "fa-tags", 
    group: "financial" 
  },
  
  { 
    key: "can_add_student", 
    label: { ar: "إضافة طالب جديد", en: "Add New Student" }, 
    desc: { ar: "يسمح بفتح كارت 'إضافة طالب جديد' وتسجيل البيانات", en: "Allows opening 'Add New Student' card and recording details" }, 
    icon: "fa-user-plus", 
    group: "data" 
  },
  { 
    key: "can_manage_packages", 
    label: { ar: "إدارة الباقات والأسعار", en: "Manage Packages & Pricing" }, 
    desc: { ar: "إتاحة فتح صفحة إدارة الباقات والأسعار من القائمة الجانبية", en: "Allows opening packages and pricing from sidebar" }, 
    icon: "fa-box-open", 
    group: "data" 
  },
  { 
    key: "can_access_settings", 
    label: { ar: "إعدادات النظام", en: "System Settings" }, 
    desc: { ar: "السماح بفتح لوحة الإعدادات المتقدمة (نسخ احتياطي - تصفير - إلخ)", en: "Allows opening advanced settings (Backup, Reset, etc.)" }, 
    icon: "fa-gears", 
    group: "data" 
  },

  { 
    key: "can_access_syllabus", 
    label: { ar: "المنهج الدراسي", en: "Syllabus Roadmap" }, 
    desc: { ar: "السماح بفتح وعرض خريطة سير المنهج من القائمة الجانبية", en: "Allows viewing and updating syllabus roadmap" }, 
    icon: "fa-book-open", 
    group: "pages" 
  },
  { 
    key: "can_view_reports", 
    label: { ar: "الوصول لصفحة التقارير", en: "Access Reports Page" }, 
    desc: { ar: "السماح للمساعد بفتح قسم الحسابات والتقارير", en: "Allows opening accounts and reports section" }, 
    icon: "fa-chart-pie", 
    group: "pages" 
  },
  { 
    key: "can_access_marketing", 
    label: { ar: "أدوات التسويق", en: "Marketing Tools" }, 
    desc: { ar: "إتاحة فتح صفحة التسويق وإرسال رسائل للطلاب", en: "Allows opening marketing and student messaging" }, 
    icon: "fa-bullhorn", 
    group: "pages" 
  },
  { 
    key: "can_access_session_students", 
    label: { ar: "طلاب الحصة", en: "Session Students" }, 
    desc: { ar: "السماح بعرض قائمة الحضور المخصصة للحصة الحالية", en: "Allows viewing the current session student attendance list" }, 
    icon: "fa-clipboard-user", 
    group: "pages" 
  },
  { 
    key: "can_access_booklets", 
    label: { ar: "مخزون المذكرات", en: "Booklets Inventory" }, 
    desc: { ar: "السماح بفتح جرد المذكرات وإدارة المبيعات", en: "Allows opening booklet inventory and sales" }, 
    icon: "fa-book", 
    group: "pages" 
  }
];

const PERM_GROUPS = [
  { id: "financial", icon: "fa-money-bill-wave", title: { ar: "الصلاحيات المالية", en: "Financial Permissions" } },
  { id: "data", icon: "fa-server", title: { ar: "إدارة البيانات والنظام", en: "Data & System Management" } },
  { id: "pages", icon: "fa-layer-group", title: { ar: "صلاحيات الصفحات والأدوات", en: "Pages & Tools Permissions" } }
];

// Helper: Toast
export function showToast(msg, type = "info") {
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
  const card = document.querySelector('.admin-login-card') || document.querySelector('.login-card');
  if (card) {
    card.classList.add('card-exit-transition');
  }
  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
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
  if (!u || !p) return showToast("يرجى إدخال اسم المستخدم وكلمة المرور", "err");

  const btn = document.getElementById("adminLoginSubmitBtn");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...'; }

  try {
    if (!supabase) throw new Error("فشل الاتصال بخادم السحابة");

    // Check manager_account
    const { data, error } = await supabase
      .from('manager_account')
      .select('*')
      .eq('username', u)
      .eq('password', p);

    if (error || !data || data.length === 0) {
      showToast("بيانات الدخول غير صحيحة، يرجى التأكد من الحساب وكلمة المرور", "err");
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول إلى لوحة الإدارة'; }
      return;
    }

    const row = data[0];
    const managerId = (row.manager_id || row.center_id || String(row.id || u)).replace(/[@.]/g, '_');
    
    // Set dedicated Admin Session keys (never clobbering assistant keys)
    localStorage.setItem("ca_admin_session", "1");
    localStorage.setItem("ca_admin_username", row.name || u);
    localStorage.setItem("ca_manager_id", managerId);
    currentCenterId = managerId;

    showToast("تم تسجيل الدخول بنجاح. مرحباً بك.", "success");
    setTimeout(() => { location.reload(); }, 600);

  } catch(err) {
    console.error("Admin Login Error:", err);
    showToast(err.message || "حدث خطأ أثناء تسجيل الدخول", "err");
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول إلى لوحة الإدارة'; }
  }
};

window.handleAdminLogout = function() {
  const btn = document.getElementById("adminLogoutBtn");
  if (btn) {
    btn.classList.add("logging-out");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري تسجيل الخروج...</span>';
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
    const cfgGroupFees = cfg.group_fees || {};

    // Students (with packages, payments, attendanceDates)
    if (stRes.data) {
      students = {};
      stRes.data.forEach(s => {
        const pList = (Array.isArray(s.packages) && s.packages.length > 0) 
          ? s.packages 
          : (stPkgsMap[s.id] || (s.class_name ? ["باقة " + s.class_name] : []));

        students[String(s.id)] = {
          id: s.id,
          name: s.name || '',
          className: s.class_name || s.className || '',
          phone: s.phone || '',
          parentPhone: s.parent_phone || s.parentPhone || '',
          paid: Number(s.paid) || 0,
          discount: Number(s.discount) || 0,
          paymentPlan: s.payment_plan || s.paymentPlan || 'cash',
          rank: stRanksMap[s.id] || s.rank || 'normal',
          packages: pList,
          payments: s.payments || [],
          attendanceDates: s.attendance_dates || [],
          status: s.status || 'active'
        };
      });
    }

    // Packages (Merged from packages table and settings config)
    packages = {};
    groupFees = {};
    if (pkgRes.data) {
      pkgRes.data.forEach(p => {
        packages[p.name] = {
          name: p.name,
          price: Number(p.price) || 0,
          installmentPrice: Number(p.installment_price) || Number(p.price) || 0,
          hasInstallments: !!p.has_installments
        };
        groupFees[p.name] = Number(p.price) || 0;
      });
    }
    for (const pName in cfgGroupFees) {
      const p = cfgGroupFees[pName];
      if (!packages[pName]) {
        packages[pName] = {
          name: pName,
          price: Number(p.price) || 0,
          installmentPrice: Number(p.price) || 0,
          hasInstallments: false
        };
        groupFees[pName] = Number(p.price) || 0;
      }
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
      dailyApprovalMap = cfg.daily_approval_map || dailyApprovalMap || {};
      
      const today = nowDateStr();
      // If today is not yet explicitly set in the map, inherit from global daily_shift_status
      if (!dailyApprovalMap[today]) {
        dailyApprovalMap[today] = {
          status: s.daily_shift_status === 'open' ? 'approved' : 'pending',
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
                  date: item.date || dateKey,
                  reason: item.reason || '',
                  amount: Number(item.amount) || 0,
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
    showToast("تحذير: فشل مزامنة بعض البيانات من السحابة", "warning");
  } finally {
    const today = nowDateStr();
    const dateInput = document.getElementById("adminDailyDateInput");
    if (dateInput && !dateInput.value) dateInput.value = today;
    window.loadDailyReport(dateInput ? dateInput.value : today);
    window.renderTermTable();
    window.renderAdminPackages();
    window.renderAdminSyllabus();
    fetchDecisionsCount();
    // Load subscription after all data is ready
    if (typeof window.loadSubscriptionData === 'function') window.loadSubscriptionData();
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
    dailyReport:  { view: "viewDailyReport",  btn: "navBtnDailyReport",  title: isAr ? "التقرير اليومي" : "Daily Report", icon: "fa-calendar-day" },
    termReport:   { view: "viewTermReport",   btn: "navBtnTermReport",   title: isAr ? "تقرير الترم المالي" : "Term Financial Report", icon: "fa-chart-line" },
    assistants:   { view: "viewAssistants",   btn: "navBtnAssistants",   title: isAr ? "إدارة المساعدين والصلاحيات" : "Assistants & Permissions", icon: "fa-user-shield" },
    decisions:    { view: "viewDecisions",    btn: "navBtnDecisions",    title: isAr ? "صندوق طلبات القرارات" : "Decision Requests Inbox", icon: "fa-bell" },
    packages:     { view: "viewPackages",     btn: "navBtnPackages",     title: isAr ? "إدارة الباقات والمصاريف" : "Packages & Expenses", icon: "fa-box-archive" },
    syllabus:     { view: "viewSyllabus",     btn: "navBtnSyllabus",     title: isAr ? "خريطة سير المنهج" : "Syllabus Roadmap", icon: "fa-book-open" },
    settings:     { view: "viewSettings",     btn: "navBtnSettings",     title: isAr ? "الإعدادات المتقدمة والنسخ الاحتياطي" : "Advanced Settings & Backup", icon: "fa-sliders" },
    subscription: { view: "viewSubscription", btn: "navBtnSubscription", title: isAr ? "خطة الاشتراك والباقة" : "Subscription Plan & Status", icon: "fa-crown" }
  };

  const c = tabConfigs[tabKey] || tabConfigs.dailyReport;
  const viewEl = document.getElementById(c.view);
  const btnEl = document.getElementById(c.btn);
  const titleEl = document.getElementById("adminPageTitle");
  const iconEl = document.getElementById("adminPageIcon");

  if (viewEl) viewEl.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
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
window.renderDailyApprovalWidget = function(dateStr) {
  const d = dateStr || nowDateStr();
  const widget = document.getElementById("dailyApprovalWidget");
  if (!widget) return;

  const info = dailyApprovalMap[d];
  const isApproved = info && (info.status === 'approved' || info === 'approved' || info === true);

  widget.className = `approval-card ${isApproved ? 'approved' : 'pending'}`;
  widget.innerHTML = `
    <div class="approval-card-info">
      <div class="approval-card-title">
        <i class="fa-solid ${isApproved ? 'fa-circle-check' : 'fa-lock'}" style="color: ${isApproved ? 'var(--success)' : 'var(--danger)'}; font-size: 1.25em;"></i>
        <span>حالة تشغيل الشيفت اليومي (${d})</span>
        <span class="approval-badge-pill ${isApproved ? 'approved' : 'pending'}">
          ${isApproved ? '<i class="fa-solid fa-check"></i> مفتوح للعمل (ON)' : '<i class="fa-solid fa-lock"></i> مغلق ومعلق (OFF)'}
        </span>
      </div>
      <p class="approval-card-desc">
        ${isApproved 
          ? 'الشيفت مفتوح حالياً والمساعدون يسجلون الحضور والمصروفات بشكل طبيعي. عند انتهاء اليوم، قم بإيقاف السويتش لإغلاق الشيفت واعتماد الحسابات.' 
          : 'الشيفت مغلق حالياً، وكافة العمليات مجمدة لدى المساعدين لحين فتح الشيفت. انقر على السويتش لتحويله إلى (ON) لفتح الشيفت والبدء.'}
      </p>
    </div>
    <div class="approval-card-actions">
      <div class="approval-toggle-wrapper">
        <div class="approval-toggle-status">
          <span class="toggle-status-badge ${isApproved ? 'badge-on' : 'badge-off'}">
            <span class="toggle-pulse-dot"></span>
            <span>${isApproved ? 'مفتوح (ON)' : 'مغلق (OFF)'}</span>
          </span>
          <span class="toggle-sub-hint">${isApproved ? 'انقر لإغلاق الشيفت' : 'انقر لفتح الشيفت'}</span>
        </div>
        <button type="button" class="master-power-switch ${isApproved ? 'state-on' : 'state-off'}" onclick="window.toggleDailyApproval('${d}', ${!isApproved})" title="${isApproved ? 'إغلاق الشيفت (Turn OFF)' : 'فتح الشيفت (Turn ON)'}" aria-label="سويتش تشغيل الشيفت">
          <span class="switch-rail">
            <span class="rail-text-on">ON</span>
            <span class="rail-text-off">OFF</span>
            <span class="switch-knob">
              <i class="fa-solid ${isApproved ? 'fa-lock-open' : 'fa-lock'}"></i>
            </span>
          </span>
        </button>
      </div>
    </div>
  `;
};

window.toggleDailyApproval = async function(dateStr, toActive) {
  const d = dateStr || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);

  if (toActive) {
    const res = await Swal.fire({
      title: 'فتح الشيفت اليومي (Turn ON)',
      text: `هل تريد تفعيل وفتح شيفت يوم (${d}) فوراً لجميع المساعدين لبدء تسجيل الحضور والعمليات؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، فتح الشيفت (ON)',
      confirmButtonColor: '#10B981',
      cancelButtonText: 'إلغاء'
    });
    if (!res.isConfirmed) return;

    // 1. Update state & local storage immediately
    dailyApprovalMap[d] = { status: 'approved', approved_at: new Date().toISOString() };
    localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));
    
    // 2. Optimistic instant UI update (0ms)
    window.renderDailyApprovalWidget(d);
    showToast(`تم فتح شيفت يوم (${d}) بنجاح وبدء عمليات المساعدين.`, "success");

    try {
      // 3. Multi-tab broadcast (same device / browser profile)
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_CHANGE', date: d, isApproved: true });
      }

      // 4. Supabase Realtime Broadcast (all online assistant devices globally in < 150ms)
      if (realtimeShiftChannel) {
        realtimeShiftChannel.send({
          type: 'broadcast',
          event: 'DAILY_SHIFT_CHANGE',
          payload: { date: d, isApproved: true, managerId: currentCenterId, updatedAt: new Date().toISOString() }
        });
      }

      // 5. Database persistence in settings (id: 1)
      if (supabase) {
        const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = curSettings?.config || {};
        cfg.daily_approval_map = dailyApprovalMap;
        cfg.last_shift_update = Date.now();

        await supabase.from('settings').update({
          daily_shift_status: 'open',
          daily_approved_by: localStorage.getItem("ca_admin_username") || "Ahmed Qutb",
          config: cfg,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      }
    } catch(e) {
      console.error("Shift save error:", e);
      showToast("تنبيه: حدث بطء في مزامنة السحابة، جاري الإعادة تلقائياً", "warning");
    }
  } else {
    const res = await Swal.fire({
      title: 'إغلاق وتجميد الشيفت (Turn OFF)',
      text: `هل أنت متأكد من إغلاق شيفت يوم (${d}) واعتماد اليومية وتجميد عمليات المساعدين؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، إغلاق الشيفت (OFF)',
      confirmButtonColor: '#EF4444',
      cancelButtonText: 'إلغاء'
    });
    if (!res.isConfirmed) return;

    // 1. Update state & local storage immediately
    dailyApprovalMap[d] = { status: 'pending', locked_at: new Date().toISOString() };
    localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));
    
    // 2. Optimistic instant UI update (0ms)
    window.renderDailyApprovalWidget(d);
    showToast(`تم إغلاق شيفت يوم (${d}) وتجميد العمليات لدى المساعدين فورياً.`, "warning");

    try {
      // 3. Multi-tab broadcast (same device / browser profile)
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_CHANGE', date: d, isApproved: false });
      }

      // 4. Supabase Realtime Broadcast (all online assistant devices globally in < 150ms)
      if (realtimeShiftChannel) {
        realtimeShiftChannel.send({
          type: 'broadcast',
          event: 'DAILY_SHIFT_CHANGE',
          payload: { date: d, isApproved: false, managerId: currentCenterId, updatedAt: new Date().toISOString() }
        });
      }

      // 5. Database persistence in settings (id: 1)
      if (supabase) {
        const { data: curSettings } = await supabase.from('settings').select('config').eq('id', 1).maybeSingle();
        const cfg = curSettings?.config || {};
        cfg.daily_approval_map = dailyApprovalMap;
        cfg.last_shift_update = Date.now();

        await supabase.from('settings').update({
          daily_shift_status: 'closed',
          daily_approved_by: localStorage.getItem("ca_admin_username") || "المدير العام",
          config: cfg,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      }
    } catch(e) {
      console.error("Shift save error:", e);
      showToast("تنبيه: حدث بطء في مزامنة السحابة، جاري الإعادة تلقائياً", "warning");
    }
  }
};

window.confirmRejectDailyShift = async function() {
  const note = (document.getElementById("dailyRejectReasonInput")?.value || "").trim();
  const d = document.getElementById("adminDailyDateInput")?.value || (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
  if (!note) return showToast("يرجى كتابة سبب تعليق أو رفض اليومية", "err");
  
  dailyApprovalMap[d] = {
    status: 'pending',
    reason: note,
    locked_at: new Date().toISOString()
  };
  localStorage.setItem('studify_daily_approval_map', JSON.stringify(dailyApprovalMap));
  window.renderDailyApprovalWidget(d);
  document.getElementById("rejectNoteBox")?.classList.add("hidden");
  showToast(`تم تعليق يومية (${d}) وإرسال الملاحظة للمساعدين`, "warning");

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
};

// 4. DAILY REPORT & APPROVAL
// ========================================================
window.loadDailyReport = function(dateStr) {
  const d = dateStr || nowDateStr();
  window.renderDailyApprovalWidget(d);
  const ids = attByDate[d] || [];
  const sessList = sessionStudentsByDate[d] || [];
  const rev = revenueByDate[d] || 0;
  let expArr = [];
  if (Array.isArray(expensesByDate)) {
    expArr = expensesByDate.filter(e => e && e.date === d);
  } else if (expensesByDate && typeof expensesByDate === 'object') {
    expArr = Array.isArray(expensesByDate[d]) ? expensesByDate[d] : [];
  }
  const totalSt = Object.keys(students).length;
  let totalExp = 0;
  expArr.forEach(e => totalExp += (Number(e && e.amount) || 0));

  // Update Stat Cards (Regular students + Session students)
  const statAttend = document.getElementById("statDailyAttend");
  const statRev = document.getElementById("statDailyRevenue");
  const statAbsent = document.getElementById("statDailyAbsent");
  const statExp = document.getElementById("statDailyExpenses");

  const totalAttended = ids.length + sessList.length;
  if (statAttend) statAttend.textContent = totalAttended;
  if (statRev) statRev.textContent = rev.toLocaleString() + " ج";
  if (statAbsent) statAbsent.textContent = Math.max(0, totalSt - ids.length);
  if (statExp) statExp.textContent = totalExp.toLocaleString() + " ج";

  // Render Groups Breakdown
  const body = document.getElementById("dailyGroupsBreakdown");
  if (body) {
    if (ids.length === 0 && sessList.length === 0 && expArr.length === 0) {
      body.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 24px;">لا توجد بيانات مسجلة لهذا التاريخ (${d})</div>`;
    } else {
      let groups = {};
      ids.forEach(id => {
        const st = students[id];
        const cls = (st && st.className) ? st.className.trim() : "عام";
        if (!groups[cls]) groups[cls] = { count: 0, revenue: 0 };
        groups[cls].count++;
        if (st && st.paid !== undefined) {
          const p = packages[cls];
          let req = p ? p.price : 0;
          if (req > 0) groups[cls].revenue += req;
        }
      });

      // Add session students to groups breakdown
      sessList.forEach(sSt => {
        const rawCls = (sSt && sSt.className) ? sSt.className.trim() : "حصة فردية";
        const grpKey = rawCls.includes("حصة") ? rawCls : `${rawCls} (حصة)`;
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
              <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">إيراد تقديري: ${groups[g].revenue} ج</div>
            </div>
            <span style="background: var(--gradient-subtle); color: var(--primary); font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 0.9em;">
              ${groups[g].count} طالب
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
      let expHtml = '<h4 style="color: var(--danger); font-size: 0.95em; margin-bottom: 10px; font-weight: 700;"><i class="fa-solid fa-receipt"></i> مصروفات اليوم:</h4>';
      expHtml += '<div style="display: flex; flex-direction: column; gap: 8px;">';
      expArr.forEach(e => {
        expHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; background: var(--bg-danger-subtle); border: 1px solid rgba(239,68,68,0.2); padding: 8px 14px; border-radius: 8px; font-size: 0.88em;">
            <span>${e.reason || "مصروف"}</span>
            <b style="color: var(--danger); font-size: 1.05em;">${e.amount} ج</b>
          </div>
        `;
      });
      expHtml += '</div>';
      expBody.innerHTML = expHtml;
    } else {
      expBody.innerHTML = '';
    }
  }
};



// ========================================================
// 5. TERM FINANCIAL REPORT
// ========================================================
window.renderTermTable = function() {
  const search = (document.getElementById("termSearchInput")?.value || "").toLowerCase().trim();
  const clsFilter = document.getElementById("termClassFilter")?.value || "";
  const tbody = document.getElementById("termReportTableBody");
  const clsSel = document.getElementById("termClassFilter");

  // Populate classes
  if (clsSel) {
    const existing = [...clsSel.options].map(o => o.value);
    const classes = [...new Set(Object.values(students).map(s => s.className || "عام"))];
    classes.forEach(c => {
      if (!existing.includes(c)) {
        const opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        clsSel.appendChild(opt);
      }
    });
  }

  let totalRev = 0, totalDebt = 0, matchCount = 0;
  let rowsHtml = "";

  Object.values(students).forEach(st => {
    if (!st || !st.name) return;
    if (search && !st.name.toLowerCase().includes(search) && !String(st.id).includes(search)) return;
    const cls = (st.className || "عام").trim();
    if (clsFilter && cls !== clsFilter) return;

    matchCount++;
    let req = 0;
    const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (cls ? ["باقة " + cls, cls] : []);
    stPkgs.forEach(pName => {
      if (packages[pName]) req += (packages[pName].price || 0);
      else if (groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
    });
    if (req === 0 && cls) {
      const alt = "باقة " + cls;
      if (packages[alt]) req += (packages[alt].price || 0);
      else if (groupFees[alt]) req += (groupFees[alt].price || groupFees[alt] || 0);
    }
    
    const paid = Number(st.paid) || 0;
    const discount = Number(st.discount) || 0;
    const debt = Math.max(0, req - paid - discount);
    
    // Attendance count
    const attCount = (st.attendanceDates && st.attendanceDates.length > 0) 
      ? st.attendanceDates.length 
      : Object.values(attByDate).reduce((acc, list) => acc + (list.includes(String(st.id)) ? 1 : 0), 0);

    totalRev += paid;
    totalDebt += debt;

    rowsHtml += `
      <tr>
        <td style="font-weight: 700;">${st.name} <span style="font-size:0.8em; color:var(--text-secondary);">(#${st.id})</span></td>
        <td><span style="background:var(--gradient-subtle); color:var(--primary); font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${cls}</span></td>
        <td>${req > 0 ? req + " ج" : "—"}</td>
        <td style="color:var(--success); font-weight:700;">
          ${paid > 0 ? paid + " ج" : "0 ج"}
          ${discount > 0 ? `<span style="display:inline-block; font-size:0.75em; background:rgba(245,158,11,0.15); color:#F59E0B; padding:1px 5px; border-radius:4px; margin-inline-start:4px;">(خصم ${discount} ج)</span>` : ''}
        </td>
        <td style="color:${debt > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:700;">${debt > 0 ? debt + " ج" : "خالص"}</td>
        <td style="font-weight:700;">${attCount}</td>
        <td>
          <a href="../assistant/index.html" style="text-decoration:none;" class="btn secondary smallBtn">
            <i class="fa-solid fa-folder-open"></i> ملف الطالب
          </a>
        </td>
      </tr>
    `;
  });

  const statTermSt = document.getElementById("statTermStudents");
  const statTermRev = document.getElementById("statTermRevenue");
  const statTermDbt = document.getElementById("statTermDebt");

  if (statTermSt) statTermSt.textContent = matchCount;
  if (statTermRev) statTermRev.textContent = totalRev.toLocaleString() + " ج";
  if (statTermDbt) statTermDbt.textContent = totalDebt.toLocaleString() + " ج";

  if (tbody) {
    tbody.innerHTML = rowsHtml || `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-secondary);">لا توجد نتائج مطابقة</td></tr>`;
  }
};

// ========================================================
// 6. ASSISTANTS MANAGEMENT & INSTANT PERMISSIONS
// ========================================================
window.fetchAssistants = async function() {
  const listEl = document.getElementById("adminAssistantsList");
  if (!listEl) return;
  if (!supabase) return;

  const isAr = (currentLang === "ar");
  listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "جاري جلب المساعدين والصلاحيات..." : "Loading assistants & permissions..."}</div>`;

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
          <p style="font-size: 1.1em; font-weight: 700;">${isAr ? "لا يوجد مساعدين مسجلين بعد" : "No assistants registered yet"}</p>
          <p style="font-size: 0.85em; margin-top: 4px;">${isAr ? 'اضغط على "إضافة مساعد جديد" لإنشاء أول حساب وتحديد صلاحياته.' : 'Click "Add New Assistant" to create the first account and configure permissions.'}</p>
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
      const createdAt = asst.created_at ? new Date(asst.created_at).toLocaleDateString(dateLocale) : "—";
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
                <span>${isAr ? "تاريخ الإنشاء:" : "Created:"} ${createdAt}</span>
              </div>
            </div>
            <div class="asst-actions">
              <button class="btn secondary smallBtn" onclick="window.openEditAssistantPasswordModal('${uName}', '${pass}')">
                <i class="fa-solid fa-key"></i> ${isAr ? "كلمة المرور" : "Password"}
              </button>
              <button class="btn danger smallBtn" onclick="window.deleteAssistant('${uName}')">
                <i class="fa-solid fa-trash"></i> ${isAr ? "حذف" : "Delete"}
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
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center; padding:20px;">${currentLang === 'ar' ? 'فشل تحميل المساعدين:' : 'Failed to load assistants:'} ${err.message}</div>`;
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

    const statusText = isAllowed ? 'تفعيل' : 'تعطيل';
    const permName = getPermissionTitle(permKey);
    const msgText = `تم ${statusText} صلاحية «${permName}» للمساعد ${username}.`;
    if (typeof window.createNotification === 'function') {
      window.createNotification(msgText, isAllowed ? 'info' : 'warning');
    }

    showToast(`تم ${statusText} صلاحية «${permName}» للمساعد ${username} بنجاح`, "success");

  } catch(err) {
    console.error("Toggle Permission Error:", err);
    showToast("فشل تحديث الصلاحية في السحابة", "err");
  }
};

window.openAddAssistantModal = function() {
  const m = document.getElementById("addAssistantModal");
  if (m) {
    m.classList.remove("hidden");
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

  if (!u || !p) return showToast("يرجى إدخال اسم المستخدم وكلمة المرور", "err");
  if (!/^[a-z0-9_]+$/.test(u)) return showToast("اسم المستخدم يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام فقط بدون مسافات", "err");

  // Check assistant plan limit before adding
  if (typeof window.checkAssistantLimit === 'function') {
    const canAdd = await window.checkAssistantLimit();
    if (!canAdd) return;
  }

  try {
    if (!supabase) return showToast("فشل الاتصال بالسحابة", "err");

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإنشاء...';
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
      if (error.code === '23505') throw new Error("اسم المستخدم محجوز مسبقاً، يرجى اختيار اسم آخر.");
      throw error;
    }

    showToast("تم إنشاء حساب المساعد بنجاح", "success");
    if (uInp) uInp.value = "";
    if (pInp) pInp.value = "";
    window.closeAddAssistantModal();
    window.fetchAssistants();

  } catch(err) {
    console.error("Submit New Assistant Error:", err);
    showToast(err.message || "فشل إضافة المساعد", "err");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> إنشاء الحساب';
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
    currPassInp.value = passVal || "••••••";
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

  if (modal) modal.classList.remove("hidden");
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
    showToast(currentLang === 'ar' ? "تم نسخ كلمة المرور الحالية إلى الحافظة" : "Current password copied to clipboard", "success");
  }).catch(() => {
    inp.select();
    document.execCommand('copy');
    showToast(currentLang === 'ar' ? "تم نسخ كلمة المرور" : "Password copied", "success");
  });
};

window.submitEditAssistantPassword = async function() {
  const username = activeEditingAssistant;
  if (!username) return;

  const newPassInp = document.getElementById("editAsstNewPasswordInput");
  const newPass = newPassInp ? newPassInp.value.trim() : "";

  if (!newPass) {
    showToast(currentLang === 'ar' ? "يرجى كتابة كلمة المرور الجديدة" : "Please enter the new password", "warn");
    return;
  }
  if (newPass.length < 6) {
    showToast(currentLang === 'ar' ? "كلمة المرور يجب أن تتكون من 6 خانات على الأقل" : "Password must be at least 6 characters", "warn");
    return;
  }

  const btn = document.getElementById("submitEditPasswordBtn");
  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (currentLang === 'ar' ? "جاري الحفظ..." : "Saving...");
    }

    if (!supabase) throw new Error("No supabase connection");

    const { error } = await supabase
      .from('assistants')
      .update({ password: newPass })
      .eq('username', username);

    if (error) throw error;

    showToast(currentLang === 'ar' ? `تم تحديث كلمة مرور المساعد (${username}) بنجاح` : `Password for (${username}) updated successfully`, "success");
    window.closeEditAssistantPasswordModal();
    window.fetchAssistants();

  } catch(err) {
    console.error("Update Password Error:", err);
    showToast(currentLang === 'ar' ? "فشل تحديث كلمة المرور: " + err.message : "Failed to update password: " + err.message, "err");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (currentLang === 'ar' ? "تحديث كلمة المرور" : "Update Password");
    }
  }
};

window.changeAssistantPassword = function(username) {
  window.openEditAssistantPasswordModal(username);
};

window.deleteAssistant = async function(username) {
  const res = await Swal.fire({
    title: 'تأكيد حذف المساعد',
    text: `هل أنت متأكد من حذف حساب المساعد (${username}) نهائياً؟`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    confirmButtonColor: '#EF4444',
    cancelButtonText: 'إلغاء'
  });

  if (res.isConfirmed) {
    try {
      if (!supabase) return;
      await supabase.from('assistants').delete().eq('username', username);
      showToast("تم حذف المساعد بنجاح", "success");
      window.fetchAssistants();
    } catch(err) {
      console.error(err);
      showToast("فشل حذف المساعد", "err");
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
  if (!q) {
    if (card) card.classList.add("hidden");
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
    window.displayDirectDecisionStudent(found);
  } else {
    if (card) card.classList.add("hidden");
    window.selectedDirectDecisionStudent = null;
  }
};

window.searchDirectDecisionStudent = function() {
  const inp = document.getElementById("directDecisionStudentInput");
  const val = inp ? inp.value.trim() : '';
  if (!val) {
    showToast("يرجى إدخال رقم أو اسم الطالب", "warn");
    return;
  }
  window.handleDirectDecisionStudentSearch(val);
  if (!window.selectedDirectDecisionStudent) {
    showToast("لم يتم العثور على طالب بهذا الرقم أو الاسم", "err");
  }
};

window.displayDirectDecisionStudent = function(st) {
  window.selectedDirectDecisionStudent = st;
  const card = document.getElementById("directDecisionStudentCard");
  if (!card) return;

  let req = 0;
  const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? ["باقة " + st.className, st.className] : []);
  stPkgs.forEach(pName => {
    if (packages && packages[pName]) req += (packages[pName].price || 0);
    else if (groupFees && groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
  });
  if (req === 0 && st.paid) req = Number(st.paid);

  const curDisc = Number(st.discount) || 0;
  const curPaid = Number(st.paid) || 0;
  const remaining = Math.max(0, req - curDisc - curPaid);

  document.getElementById("ddsIdBadge").textContent = "ID: " + st.id;
  document.getElementById("ddsName").textContent = st.name || "طالب بدون اسم";
  document.getElementById("ddsClass").textContent = st.className || "غير محدد";
  document.getElementById("ddsRequired").textContent = req + " ج";
  document.getElementById("ddsCurrentDiscount").textContent = curDisc + " ج";
  document.getElementById("ddsPaid").textContent = curPaid + " ج";
  document.getElementById("ddsRemaining").textContent = remaining + " ج";

  const valInp = document.getElementById("directDecisionValueInput");
  if (valInp) valInp.value = curDisc || "";

  card.classList.remove("hidden");
};

window.handleDirectDecisionTypeChange = function(type) {
  const wrap = document.getElementById("directDecisionValueWrap");
  const lbl = document.getElementById("directDecisionValueLbl");
  const inp = document.getElementById("directDecisionValueInput");
  if (!wrap || !lbl || !inp) return;

  if (type === "exemption") {
    wrap.style.opacity = "0.4";
    wrap.style.pointerEvents = "none";
    lbl.textContent = "إعفاء كامل (100%)";
    inp.value = "";
  } else if (type === "custom_fee") {
    wrap.style.opacity = "1";
    wrap.style.pointerEvents = "";
    lbl.textContent = "المصاريف الإجمالية المطلوبة (جنيه)";
    inp.placeholder = "مثال: 250";
  } else {
    wrap.style.opacity = "1";
    wrap.style.pointerEvents = "";
    lbl.textContent = "قيمة الخصم المطلوبة (جنيه)";
    inp.placeholder = "مثال: 100";
  }
};

window.applyDirectDecision = async function() {
  const st = window.selectedDirectDecisionStudent;
  if (!st || !supabase) {
    showToast("يرجى اختيار طالب أولاً", "err");
    return;
  }

  const type = document.getElementById("directDecisionType")?.value || "discount";
  const val = Number(document.getElementById("directDecisionValueInput")?.value) || 0;
  const reason = document.getElementById("directDecisionReasonInput")?.value.trim() || "قرار مباشر من المدير";

  let req = 0;
  const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? ["باقة " + st.className, st.className] : []);
  stPkgs.forEach(pName => {
    if (packages && packages[pName]) req += (packages[pName].price || 0);
    else if (groupFees && groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
  });
  if (req === 0 && st.paid) req = Number(st.paid);

  let newDiscount = Number(st.discount) || 0;
  let summaryText = "";

  if (type === "exemption") {
    newDiscount = req;
    summaryText = `إعفاء كامل من المصاريف (المطلوب: ${req} ج)`;
  } else if (type === "custom_fee") {
    newDiscount = Math.max(0, req - val);
    summaryText = `تحديد مصاريف جديدة بقيمة ${val} ج (خصم: ${newDiscount} ج)`;
  } else {
    if (val <= 0) {
      showToast("يرجى إدخال قيمة خصم صحيحة", "warn");
      return;
    }
    newDiscount = Math.min(req, val);
    summaryText = `خصم مالي بقيمة ${val} ج`;
  }

  try {
    st.discount = newDiscount;
    st.lastModified = Date.now();

    await supabase.from('students').upsert({
      id: st.id,
      discount: st.discount,
      last_modified: st.lastModified
    }, { onConflict: 'id' });

    const decId = "dec_" + Date.now();
    await supabase.from('communications').insert([{
      id: decId,
      type: 'manager_request',
      title: type,
      student_id: String(st.id),
      amount: type === "exemption" ? req : val,
      sender_name: 'مدير المركز (قرار مباشر)',
      message: reason,
      status: 'approved',
      created_at: new Date().toISOString()
    }]);

    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: 'قرار خصم مباشر من الإدارة',
      message: `أصدر المدير قراراً للطالب ${st.name || st.id} (${summaryText}). السبب: ${reason}`,
      status: 'unread'
    }]);

    showToast(`تم تطبيق القرار بنجاح للطالب: ${st.name || st.id}`, "success");

    const card = document.getElementById("directDecisionStudentCard");
    if (card) card.classList.add("hidden");
    const searchInp = document.getElementById("directDecisionStudentInput");
    if (searchInp) searchInp.value = "";
    window.selectedDirectDecisionStudent = null;

    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    if (typeof window.fetchDecisions === 'function') window.fetchDecisions();

  } catch(err) {
    console.error(err);
    showToast("حدث خطأ أثناء تطبيق القرار: " + err.message, "err");
  }
};

window.fetchDecisions = async function() {
  const listEl = document.getElementById("adminDecisionsList");
  if (!listEl || !supabase) return;
  listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> جاري جلب الطلبات...</div>';

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
      listEl.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-secondary);">لا توجد طلبات قرارات معلقة حالياً. كل شيء مستقر.</div>';
      return;
    }

    let html = "";
    reqs.forEach(r => {
      const date = new Date(r.created_at).toLocaleString("ar-EG");
      const isExempt = (r.title === "exemption" || r.sub_type === "exemption");
      const subType = isExempt ? "exemption" : "discount";
      const typeLabel = isExempt ? "إعفاء كامل" : `خصم بقيمة ${r.amount} ج`;

      html += `
        <div class="decision-card">
          <div class="decision-card-info">
            <div class="decision-student-name">طالب كود: ${r.student_id || '—'}</div>
            <div class="decision-meta">${typeLabel} • طلب بواسطة: <b>${r.sender_name || 'مساعد'}</b> • ${date}</div>
            <div class="decision-meta" style="margin-top: 4px; color: var(--text-primary);">السبب: ${r.message || '—'}</div>
          </div>
          <div class="decision-amount">${isExempt ? "إعفاء" : r.amount + " ج"}</div>
          <div class="decision-actions">
            <button class="btn success smallBtn" onclick="window.approveDecision('${r.id}', '${r.student_id}', '${subType}', ${r.amount || 0})">
              <i class="fa-solid fa-check"></i> موافقة
            </button>
            <button class="btn danger smallBtn" onclick="window.rejectDecision('${r.id}', '${r.student_id}')">
              <i class="fa-solid fa-xmark"></i> رفض
            </button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

  } catch(err) {
    console.error(err);
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center;">فشل جلب الطلبات: ${err.message}</div>`;
  }
};

window.approveDecision = async function(reqId, studentId, subType, amount) {
  try {
    if (!supabase) return;
    
    // 1. Update Student record if exists
    const st = students[String(studentId)];
    if (st) {
      let req = 0;
      const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? ["باقة " + st.className, st.className] : []);
      stPkgs.forEach(pName => {
        if (packages[pName]) req += (packages[pName].price || 0);
        else if (groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
      });

      if (subType === "exemption") {
        st.discount = req;
      } else {
        st.discount = Math.min(req, (Number(st.discount) || 0) + Number(amount));
      }
      st.lastModified = Date.now();
      await supabase.from('students').upsert({
        id: st.id,
        discount: st.discount,
        last_modified: st.lastModified
      }, { onConflict: 'id' });
    }

    // 2. Mark request approved
    await supabase.from('communications').update({ status: 'approved' }).eq('id', reqId);

    // 3. Notify assistant
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: ' تمت الموافقة على طلب الخصم',
      message: `وافق المدير على طلب الطالب (${studentId}) بقيمة ${subType === "exemption" ? "إعفاء كامل" : amount + " ج"}`,
      status: 'unread'
    }]);

    showToast("تمت الموافقة وتطبيق الخصم بنجاح", "success");
    window.renderTermTable();
    window.fetchDecisions();

  } catch(err) {
    console.error(err);
    showToast("حدث خطأ أثناء اعتماد القرار", "err");
  }
};

window.rejectDecision = async function(reqId, studentId) {
  try {
    if (!supabase) return;
    await supabase.from('communications').update({ status: 'rejected' }).eq('id', reqId);
    showToast("تم رفض الطلب", "info");
    window.fetchDecisions();
  } catch(err) {
    console.error(err);
    showToast("فشل معالجة الرفض", "err");
  }
};

// ========================================================
// 8. PACKAGES & EXPENSES
// ========================================================
window.renderAdminPackages = function() {
  const container = document.getElementById("adminPackagesListContainer");
  if (!container) return;

  if (Object.keys(packages).length === 0) {
    container.innerHTML = '<div style="color:var(--text-secondary); padding:10px;">لا توجد باقات مضافة بعد.</div>';
    return;
  }

  let html = "";
  Object.values(packages).forEach(p => {
    html += `
      <div style="background:var(--bg-inset); border:1px solid var(--border); border-radius:10px; padding:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:1.05em; font-weight:700; color:var(--primary);">${p.name}</h4>
          <span style="font-size:0.85em; color:var(--text-secondary);">السعر: <b>${p.price} ج</b></span>
        </div>
        <button class="btn secondary smallBtn" onclick="window.editPackagePrice('${p.name}', ${p.price})">
          <i class="fa-solid fa-pen-to-square"></i> تعديل
        </button>
      </div>
    `;
  });
  container.innerHTML = html;
};

window.openAddPackageModal = async function() {
  const { value: formValues } = await Swal.fire({
    title: 'إضافة باقة جديدة',
    html:
      '<input id="swalPkgName" class="swal2-input" placeholder="اسم الباقة / المجموعة">' +
      '<input id="swalPkgPrice" type="number" class="swal2-input" placeholder="السعر الإجمالي (ج)">',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'إضافة',
    cancelButtonText: 'إلغاء',
    preConfirm: () => {
      return [
        document.getElementById('swalPkgName').value.trim(),
        document.getElementById('swalPkgPrice').value.trim()
      ];
    }
  });

  if (formValues && formValues[0] && formValues[1]) {
    const name = formValues[0];
    const price = Number(formValues[1]);
    try {
      if (!supabase) return;
      await supabase.from('packages').upsert({ name, price, installment_price: price });
      packages[name] = { name, price, installmentPrice: price };
      groupFees[name] = price;
      showToast("تمت إضافة الباقة بنجاح", "success");
      window.renderAdminPackages();
    } catch(e) { console.error(e); }
  }
};

window.editPackagePrice = async function(name, currentPrice) {
  const { value: newPrice } = await Swal.fire({
    title: `تعديل سعر: ${name}`,
    input: 'number',
    inputValue: currentPrice,
    inputLabel: 'السعر الجديد (ج)',
    showCancelButton: true,
    confirmButtonText: 'حفظ السعر',
    cancelButtonText: 'إلغاء'
  });

  if (newPrice) {
    try {
      if (!supabase) return;
      await supabase.from('packages').update({ price: Number(newPrice) }).eq('name', name);
      packages[name].price = Number(newPrice);
      groupFees[name] = Number(newPrice);
      showToast("تم تحديث السعر بنجاح", "success");
      window.renderAdminPackages();
    } catch(e) { console.error(e); }
  }
};

window.recordNewExpense = async function() {
  const reason = document.getElementById("expenseReasonInput")?.value.trim();
  const amount = Number(document.getElementById("expenseAmountInput")?.value || 0);
  const date = document.getElementById("expenseDateInput")?.value || nowDateStr();

  if (!reason || amount <= 0) return showToast("يرجى إدخال بند ومبلغ المصروف", "err");

  const newExp = { reason, amount, date, timestamp: Date.now() };
  if (!Array.isArray(expensesByDate)) expensesByDate = [];
  expensesByDate.push(newExp);

  const expObj = {};
  expensesByDate.forEach(e => {
    if (!e) return;
    const k = e.date || date;
    if (!expObj[k]) expObj[k] = [];
    expObj[k].push({ amount: Number(e.amount) || 0, reason: e.reason || '', method: e.method || 'cash', date: k, timestamp: e.timestamp || Date.now() });
  });

  try {
    await saveCenterConfig({ expenses_by_date: expObj });
    showToast("تم تسجيل المصروف بنجاح", "success");
    document.getElementById("expenseReasonInput").value = "";
    document.getElementById("expenseAmountInput").value = "";
    window.loadDailyReport(date);
  } catch(e) { console.error(e); }
};

// ========================================================
// 9. SYLLABUS MAP
// ========================================================
window.renderAdminSyllabus = function() {
  const container = document.getElementById("adminSyllabusTimelineContainer");
  if (!container) return;

  if (syllabusList.length === 0) {
    container.innerHTML = '<div style="color:var(--text-secondary); text-align:center; padding:20px;">لا توجد دروس مسجلة في خطة المنهج حتى الآن.</div>';
    return;
  }

  let html = "";
  syllabusList.forEach((s, idx) => {
    let statusBadge = "لم يبدأ";
    let badgeColor = "var(--text-secondary)";
    if (s.status === "completed") { statusBadge = "تم الانتهاء "; badgeColor = "var(--success)"; }
    else if (s.status === "in_progress") { statusBadge = "جاري الشرح "; badgeColor = "var(--warning)"; }

    html += `
      <div class="syllabus-item-card ${s.status}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1.05em;">${s.title || s.name}</div>
          <span style="font-size:0.82em; color:${badgeColor}; font-weight:700;">${statusBadge}</span>
          ${s.notes ? `<p style="font-size:0.82em; color:var(--text-secondary); margin-top:4px;">ملاحظات: ${s.notes}</p>` : ''}
        </div>
        <button class="btn danger smallBtn" onclick="window.deleteSyllabusLesson(${idx})">
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

  if (!title) return showToast("يرجى إدخال اسم الدرس / الفصل", "err");

  const newLesson = { title, name: title, status, notes, updated_at: new Date().toISOString() };
  syllabusList.push(newLesson);

  try {
    await saveCenterConfig({ syllabus: syllabusList, syllabus_data: syllabusList });
    showToast("تمت إضافة الدرس لخريطة المنهج", "success");
    document.getElementById("syllabusLessonName").value = "";
    document.getElementById("syllabusLessonNotes").value = "";
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

window.deleteSyllabusLesson = async function(idx) {
  syllabusList.splice(idx, 1);
  try {
    await saveCenterConfig({ syllabus: syllabusList, syllabus_data: syllabusList });
    showToast("تم حذف الدرس من المنهج", "info");
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

// ========================================================
// 11. ADVANCED SETTINGS & BACKUP
// ========================================================
window.exportAllDataToExcel = function() {
  try {
    const wb = XLSX.utils.book_new();

    // Students sheet
    const stData = [["كود الطالب", "اسم الطالب", "المجموعة", "رقم الهاتف", "هاتف ولي الأمر", "المبلغ المدفوع", "الحالة"]];
    Object.values(students).forEach(s => {
      stData.push([s.id, s.name, s.className, s.phone, s.parentPhone, s.paid || 0, s.status || 'نشط']);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(stData), "الطلاب");

    // Packages sheet
    const pkgData = [["اسم الباقة", "السعر الأساسي", "سعر القسط"]];
    Object.values(packages).forEach(p => {
      pkgData.push([p.name, p.price, p.installmentPrice || p.price]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pkgData), "الباقات");

    XLSX.writeFile(wb, `Studify_Backup_${nowDateStr()}.xlsx`);
    showToast("تم تصدير نسخة Excel بنجاح.", "success");
  } catch(e) {
    console.error(e);
    showToast("فشل تصدير البيانات إلى Excel", "err");
  }
};

window.importDataFromExcel = async function(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    return showToast("مكتبة Excel غير متوفرة", "err");
  }

  const confirmRes = await Swal.fire({
    title: 'استيراد بيانات الطلاب من Excel',
    text: 'هل تريد دمج واستيراد بيانات الطلاب من هذا الملف؟ سيتم تحديث الطلاب الحاليين وإضافة الجدد.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'نعم، استيراد',
    confirmButtonColor: '#2563EB',
    cancelButtonText: 'إلغاء'
  });

  if (!confirmRes.isConfirmed) {
    event.target.value = '';
    return;
  }

  try {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    const sheetName = wb.SheetNames.find(n => n.includes('طلاب') || n.toLowerCase().includes('student')) || wb.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);

    if (!rows || rows.length === 0) {
      showToast("الملف فارغ أو لا يحتوي على بيانات صالحة", "warning");
      event.target.value = '';
      return;
    }

    let importedCount = 0;
    const studentRowsToUpsert = [];

    rows.forEach(r => {
      const id = String(r['كود الطالب'] || r['كود'] || r['id'] || r['ID'] || r['Code'] || '').trim();
      const name = String(r['اسم الطالب'] || r['الاسم'] || r['name'] || r['Name'] || '').trim();
      if (!id && !name) return;

      const studentId = id || String(Date.now() + Math.floor(Math.random() * 1000));
      const phone = String(r['رقم الهاتف'] || r['الموبايل'] || r['الهاتف'] || r['phone'] || r['Phone'] || '').trim();
      const parentPhone = String(r['هاتف ولي الأمر'] || r['ولي الأمر'] || r['parentPhone'] || r['Parent Phone'] || '').trim();
      const className = String(r['المجموعة'] || r['الصف'] || r['className'] || r['Class'] || '').trim();
      const paid = Number(r['المبلغ المدفوع'] || r['المدفوع'] || r['paid'] || r['Paid'] || 0) || 0;
      const status = String(r['الحالة'] || r['status'] || 'active').trim();

      const existing = students[studentId] || {};
      const updated = {
        ...existing,
        id: studentId,
        name: name || existing.name || '',
        phone: phone || existing.phone || '',
        parentPhone: parentPhone || existing.parentPhone || '',
        className: className || existing.className || '',
        paid: paid !== 0 ? paid : (existing.paid || 0),
        status: status === 'محذوف' || status === 'deleted' ? 'deleted' : 'active',
        lastModified: Date.now()
      };

      students[studentId] = updated;
      studentRowsToUpsert.push({
        id: studentId,
        name: updated.name,
        phone: updated.phone,
        parent_phone: updated.parentPhone,
        class_name: updated.className,
        paid: updated.paid,
        status: updated.status,
        last_modified: updated.lastModified
      });
      importedCount++;
    });

    if (supabase && studentRowsToUpsert.length > 0) {
      await supabase.from('students').upsert(studentRowsToUpsert, { onConflict: 'id' });
    }

    if (window.localforage) {
      try {
        await window.localforage.setItem('ca_students_v6', JSON.stringify(students));
      } catch(e) {}
    }

    showToast(`تم استيراد ${importedCount} طالب بنجاح`, "success");
    window.renderTermTable();
    window.loadDailyReport(nowDateStr());
  } catch(err) {
    console.error("Excel import error:", err);
    showToast("حدث خطأ أثناء قراءة ملف Excel: " + err.message, "err");
  } finally {
    event.target.value = '';
  }
};

window.resetTermData = async function() {
  const res = await Swal.fire({
    title: 'تأكيد تصفير الترم',
    text: 'هل أنت متأكد من تصفير حضور ومصاريف وإيرادات الترم بالكامل لجميع الطلاب؟ لا يمكن التراجع عن هذه الخطوة إلا بنسخة احتياطية.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، صفر بيانات الترم',
    confirmButtonColor: '#EF4444',
    cancelButtonText: 'إلغاء'
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

    showToast("تم تصفير حضور ومصاريف الترم بالكامل بنجاح", "success");
    const today = nowDateStr();
    window.loadDailyReport(today);
    window.renderTermTable();
  } catch(e) {
    console.error(e);
    showToast("حدث خطأ أثناء التصفير: " + e.message, "err");
  }
};

window.factoryResetSystem = async function() {
  const res = await Swal.fire({
    title: 'إعادة تهيئة النظام وضبط المصنع',
    text: 'تحذير شديد الخطورة: سيتم مسح كافة بيانات الطلاب والباقات والحضور والمصروفات بالكامل. اكتب "مسح" للتأكيد:',
    input: 'text',
    inputPlaceholder: 'اكتب كلمة: مسح',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'تأكيد الحذف الشامل',
    confirmButtonColor: '#991B1B',
    cancelButtonText: 'إلغاء',
    preConfirm: (val) => {
      if (val !== 'مسح') {
        Swal.showValidationMessage('يجب كتابة كلمة "مسح" لتأكيد ضبط المصنع');
      }
      return val === 'مسح';
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
      title: 'تم ضبط المصنع',
      text: 'تم مسح كافة البيانات بنجاح وإعادة تشغيل النظام.',
      icon: 'success'
    });

    location.href = 'admin.html';
  } catch(e) {
    console.error(e);
    showToast("فشل ضبط المصنع: " + e.message, "err");
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
    textEl.innerText = "جاري تبديل المظهر...";
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
      title: type === 'warning' ? 'تنبيه إداري' : 'إشعار إداري',
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
          <span style="display: inline-block; padding: 5px 16px; background: rgba(37,99,235,0.12); color: var(--primary); border-radius: 20px; font-size: 0.84em; font-weight: 700; margin-bottom: 6px;">مدير النظام (Administrator)</span>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: 'إغلاق',
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
            <i class="fa-solid fa-clock-rotate-left"></i> استهلاك مدة الاشتراك: 100% (0 يوم متبقي)
          </div>
          <div style="font-size:0.85em;color:#94A3B8;line-height:1.6;">
            تاريخ الانتهاء: <b style="color:#F1F5F9;">${SUBSCRIPTION.endDate || '—'}</b> | الباقة: <b style="color:#F1F5F9;">${SUBSCRIPTION.planName}</b>
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
          title: 'انتهاء صلاحية اشتراك النظام',
          html: `<p style="color:var(--text-secondary);margin-bottom:12px">انتهت فترة صلاحية الاشتراك الخاصة بنظام السنتر بالكامل.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">تم تعليق كافة العمليات التشغيلية وإيقاف الوصول للبيانات مؤقتاً حتى يتم سداد وتجديد الباقة.</p>`,
          confirmButtonText: 'تواصل للتجديد الفوري',
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
  pill.className = 'sub-status-pill';
  if (!SUBSCRIPTION.loaded) { pill.textContent = ''; return; }
  if (!SUBSCRIPTION.isActive) {
    pill.classList.add('expired'); pill.textContent = 'منتهي';
  } else if (SUBSCRIPTION.daysLeft <= 10) {
    pill.classList.add('warning'); pill.textContent = SUBSCRIPTION.daysLeft + ' يوم';
  } else {
    pill.classList.add('active'); pill.textContent = 'نشط';
  }
}

export function checkStudentLimit() {
  if (!SUBSCRIPTION.loaded) return true;
  const count = Object.keys(students).length;
  if (count >= SUBSCRIPTION.maxStudents) {
    Swal.fire({
      icon: 'warning',
      title: 'تم الوصول للحد الأقصى للطلاب',
      html: `<p style="color:var(--text-secondary);margin-bottom:12px">باقتك الحالية تسمح بحد أقصى <b>${SUBSCRIPTION.maxStudents} طالب</b>.<br>لديك حالياً <b>${count} طالب</b> مسجل.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> يرجى ترقية باقة الاشتراك لإضافة المزيد من الطلاب.</p>`,
      confirmButtonText: 'عرض خطط الاشتراك',
      confirmButtonColor: '#2563EB',
      showCancelButton: true, cancelButtonText: 'إغلاق'
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
        title: 'تم الوصول للحد الأقصى للمساعدين',
        html: `<p style="color:var(--text-secondary);margin-bottom:12px">باقتك الحالية تسمح بحد أقصى <b>${SUBSCRIPTION.maxAssistants} مساعد</b>.<br>لديك حالياً <b>${cur} مساعد</b> مسجل.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> يرجى ترقية باقة الاشتراك لإضافة المزيد من حسابات المساعدين.</p>`,
        confirmButtonText: 'عرض خطط الاشتراك',
        confirmButtonColor: '#2563EB',
        showCancelButton: true, cancelButtonText: 'إغلاق'
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

  if (!SUBSCRIPTION.loaded) {
    card.innerHTML = '<div class="sub-plan-loading"><i class="fa-solid fa-spinner fa-spin"></i> جاري تحميل بيانات الاشتراك...</div>';
    setTimeout(() => { if (SUBSCRIPTION.loaded) window.renderSubscriptionView(); }, 1500);
    return;
  }

  const { isActive, daysLeft, totalDays, planName, startDate, endDate,
          maxStudents, maxAssistants, currentAssistants, planKey } = SUBSCRIPTION;
  const progress = Math.max(0, Math.min(100, Math.round((daysLeft / totalDays) * 100)));
  const statusClass = isActive ? (daysLeft <= 10 ? 'warning' : 'active') : 'expired';
  const statusIcon  = isActive ? (daysLeft <= 10 ? 'fa-clock' : 'fa-circle-check') : 'fa-circle-xmark';
  const statusText  = isActive ? (daysLeft <= 10 ? `ينتهي خلال ${daysLeft} يوم` : 'نشط') : 'منتهي';
  const progressClass = progress <= 15 ? 'danger' : progress <= 30 ? 'warning' : '';
  const studentCount  = Object.keys(students).length;
  const asstCountDisplay = typeof currentAssistants === 'number' ? currentAssistants : 0;

  card.innerHTML = `
    <div class="sub-current-inner">
      <div class="sub-current-info">
        <div class="sub-current-badge ${statusClass}">
          <i class="fa-solid ${statusIcon}"></i> ${statusText}
        </div>
        <div class="sub-current-plan-name">${planName}</div>
        <div class="sub-current-date-row">
          <i class="fa-solid fa-calendar-check" style="color:var(--primary)"></i>
          من <b>${startDate || '—'}</b> &nbsp;حتى&nbsp; <b>${endDate || '—'}</b>
        </div>
        <div class="sub-current-limits">
          <div class="sub-limit-chip">
            <i class="fa-solid fa-users"></i>
            <span class="sub-limit-chip-val">${studentCount} / ${maxStudents}</span>
            <span class="sub-limit-chip-lbl">طالب</span>
          </div>
          <div class="sub-limit-chip">
            <i class="fa-solid fa-user-shield"></i>
            <span class="sub-limit-chip-val">${asstCountDisplay} / ${maxAssistants}</span>
            <span class="sub-limit-chip-lbl">مساعد</span>
          </div>
        </div>
        <div class="sub-progress-wrap">
          <div class="sub-progress-lbl">
            <span>استهلاك مدة الاشتراك</span>
            <span>${daysLeft} يوم متبقي من ${totalDays}</span>
          </div>
          <div class="sub-progress-bar">
            <div class="sub-progress-fill ${progressClass}" style="width:${progress}%"></div>
          </div>
        </div>
      </div>
      <div class="sub-countdown">
        <div class="sub-countdown-days">${daysLeft}</div>
        <div class="sub-countdown-lbl">يوم متبقي</div>
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
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> باقتك الحالية';
      btn.onclick = null;
    }
  }
};

window.contactForRenewal = function(planKey) {
  const names = {
    monthly:     'الخطة المرنة (1,999 ج/شهر)',
    quarterly:   'الخطة المريحة (5,399 ج/3 شهور بدلاً من 6,000 ج)',
    semi_annual: 'الخطة الذهبية (7,999 ج/ترم كامل بدلاً من 10,000 ج)'
  };
  Swal.fire({
    icon: 'info',
    title: 'تجديد / ترقية الاشتراك',
    html: `<p style="color:var(--text-secondary);margin-bottom:14px">لتفعيل <b>${names[planKey] || planKey}</b>،<br>تواصل مع فريق الدعم الفني وسيتم التفعيل فوراً.</p>
      <div style="background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.3);color:#25D366;padding:12px 18px;border-radius:10px;font-weight:700;font-size:.95em;display:flex;align-items:center;gap:10px;justify-content:center;">
        <i class="fa-brands fa-whatsapp" style="font-size:1.3em"></i> تواصل مع الدعم الفني عبر الواتساب
      </div>`,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#2563EB'
  });
};
