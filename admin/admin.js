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
  "asst_hint_letters_only": { ar: "اكتب الاسم فقط بحروف إنجليزية صغيرة بدون مسافات.", en: "Enter name with lowercase English letters & numbers only." },
  "asst_email_preview_prefix": { ar: "البريد المعتمد للدخول:", en: "Official Login Email:" },
  "asst_lbl_password_simple": { ar: "كلمة المرور", en: "Password" },
  "asst_pass_ph": { ar: "أدخل كلمة مرور قوية للمساعد", en: "Enter a strong password for assistant" },
  "asst_eye_title": { ar: "إظهار / إخفاء كلمة المرور", en: "Show / Hide password" },
  "modal_btn_cancel": { ar: "إلغاء", en: "Cancel" },
  "modal_btn_create_asst": { ar: "إنشاء الحساب", en: "Create Account" },
  "trans_switching_theme": { ar: "جاري تبديل المظهر..", en: "Switching theme..." },
  "btn_login_admin": { ar: "دخول مدير النظام", en: "Login as Administrator" },
  "prompt_switch_to_asst": { ar: "هل أنت مساعد؟", en: "Are you an assistant?" },
  "action_switch_to_asst": { ar: "الانتقال لبوابة المساعد والعمليات", en: "Go to Assistant Portal & Operations" },

  "dec_val_ph": { ar: "مثال: 100", en: "e.g. 100" },
  "dec_reason_ph": { ar: "مثال: قرار مدير - ظرف خاص / تفوق دراسي", en: "e.g. Manager Decision - Special case / Academic excellence" },
  "dec_no_pending": { ar: "لا توجد طلبات معلقة حالياً", en: "No pending requests at this time" },
  "stat_term_total_discounts": { ar: "إجمالي الخصومات والإعفاءات (ج)", en: "Total Discounts & Exemptions (EGP)" },
  "pkg_loading": { ar: "جاري تحميل الباقات..", en: "Loading packages..." },
  "syll_loading": { ar: "جاري تحميل المنهج..", en: "Loading syllabus..." },
  "asst_lbl_username": { ar: "اسم المستخدم (حساب الدخول)", en: "Username (Login Account)" },
  "asst_lbl_password": { ar: "كلمة المرور الأولية للمساعد", en: "Initial Password" },
  "asst_lbl_display_name": { ar: "الاسم الظاهر للمساعد (الاسم الكامل)", en: "Display Name (Full Name)" },
  "trans_switching": { ar: "جاري الانتقال..", en: "Switching..." },

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
  "nav_packages": { ar: "إدارة الباقات", en: "Packages Management" },
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
  "asst_page_title": { ar: "إدارة المساعدين والتحكم في الصلاحيات", en: "Assistants & Permissions Management" },
  "asst_page_desc": { ar: "تحكم بشكل مباشر في الميزات المتاحة لكل مساعد. أي تعديل يتم تطبيقه فورياً ولحظياً في صفحة المساعد المفتوحة.", en: "Directly manage features and permissions for each assistant. Changes apply instantly in real-time." },
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
  "modal_btn_create_asst": { ar: "إنشاء الحساب وتفعيل الصلاحيات", en: "Create Account & Grant Permissions" },

  // Daily Report & Status Banner
  "stat_attended_today": { ar: "طلاب حضروا اليوم", en: "Attended Today" },
  "stat_shift_revenue": { ar: "إيراد الوردية (ج)", en: "Shift Revenue (EGP)" },
  "stat_absent_today": { ar: "غياب اليوم", en: "Absent Today" },
  "stat_expenses_today": { ar: "مصروفات اليوم (ج)", en: "Today's Expenses (EGP)" },
  "daily_breakdown_title": { ar: "تفاصيل الحضور والمجموعات ليوم:", en: "Attendance & Groups Details for:" },
  "daily_reject_lbl": { ar: "سبب التعليق أو الرفض (يظهر للمساعدين):", en: "Suspension or Rejection Reason (Visible to Assistants):" },
  "daily_reject_ph": { ar: "اكتب سبب الرفض أو التعليمات هنا..", en: "Type rejection reason or instructions here.." },
  "daily_confirm_reject_btn": { ar: "تأكيد الرفض", en: "Confirm Rejection" },

  // Term Financial Report
  "stat_term_total_students": { ar: "إجمالي الطلاب المسجلين", en: "Total Registered Students" },
  "stat_term_total_rev": { ar: "إجمالي الإيرادات المحصلة (ج)", en: "Total Collected Revenue (EGP)" },
  "lbl_breakdown_btn": { ar: "عرض التفاصيل", en: "View Details" },
  "btn_vault_transfer": { ar: "تحويل بين الخزائن", en: "Transfer Between Vaults" },
  "btn_vault_transfers_history": { ar: "سجل التحويلات", en: "Transfers History" },
  "vault_trans_modal_title": { ar: "تحويل أموال بين الخزائن الحية", en: "Inter-Vault Fund Transfer" },
  "vault_trans_modal_subtitle": { ar: "مناقلة نقدية وبنكية لضبط السيولة الفعلية دون المساس بإجمالي المقبوضات", en: "Transfer cash and electronic balances without affecting gross receipts" },
  "lbl_from_vault": { ar: "من خزينة (المصدر) *", en: "From Vault (Source) *" },
  "lbl_to_vault": { ar: "إلى خزينة (الهدف) *", en: "To Vault (Destination) *" },
  "lbl_trans_amount": { ar: "المبلغ المراد تحويله (جنيه) *", en: "Amount to Transfer (EGP) *" },
  "lbl_trans_note": { ar: "البيان / سبب التحويل (اختياري)", en: "Statement / Transfer Reason (Optional)" },
  "btn_confirm_trans": { ar: "تأكيد وتنفيذ التحويل", en: "Confirm & Execute Transfer" },
  "vault_hist_modal_title": { ar: "سجل حركات التحويل بين الخزائن", en: "Inter-Vault Transfers Log" },
  "vault_hist_modal_subtitle": { ar: "توثيق كامل لكافة المناقلات المالية المنفذة بين الكاش وإنستاباي والمحافظ", en: "Complete log of fund transfers between cash, instapay, and wallets" },
  "exp_modal_title": { ar: "تفاصيل المصروفات التشغيلية", en: "Operating Expenses Details" },
  "exp_modal_subtitle": { ar: "مراجعة كاملة للمصروفات مع فلترة مخصصة بالتاريخ والفترة", en: "Review expenses with date range filtering" },
  "wd_modal_title": { ar: "تفاصيل مسحوبات المستر / الشخصية", en: "Teacher / Personal Withdrawals Details" },
  "wd_modal_subtitle": { ar: "متابعة دقيقة للأرباح والمسحوبات الخاصة مع فلترة التاريخ لكل فترة", en: "Track owner profits and withdrawals with date range filtering" },
  "disc_modal_title": { ar: "تفاصيل الخصومات والإعفاءات المالية", en: "Financial Discounts & Exemptions" },
  "disc_modal_subtitle": { ar: "بيان شامل بالطلاب الممنوحين خصومات وإعفاءات مادية مع أرصدتهم الحالية", en: "Comprehensive list of discounted students and current debt" },
  "disc_total_amount_lbl": { ar: "إجمالي مبالغ الخصومات الممنوحة", en: "Total Granted Discounts" },
  "disc_students_count_lbl": { ar: "عدد الطلاب المستفيدين من الخصم", en: "Count of Discounted Students" },
  "btn_all_term": { ar: "كل الترم", en: "All Term" },
  "btn_today": { ar: "اليوم", en: "Today" },
  "btn_apply_filter": { ar: "تطبيق", en: "Apply" },
  "rev_modal_title": { ar: "تفاصيل وتوزيع الإيرادات المحصلة", en: "Collected Revenue Breakdown" },
  "rev_modal_subtitle": { ar: "تحليل مالي تفصيلي لمصادر الدخل وتوزيع التدفقات النقدية والبنكية", en: "Detailed financial analysis of income sources and cash flow distribution" },
  "rev_grand_total_lbl": { ar: "إجمالي الإيرادات الكلية المحصلة", en: "Grand Total Collected Revenue" },
  "rev_src_regular": { ar: "طلاب منتظمين", en: "Regular Students" },
  "rev_src_session": { ar: "طلاب حصة", en: "Session Students" },
  "rev_src_booklets": { ar: "مذكرات ومخزن", en: "Booklets & Supplies" },
  "rev_card_regular_title": { ar: "اشتراكات الطلاب المنتظمين", en: "Regular Students Subscriptions" },
  "rev_card_session_title": { ar: "حضور طلاب الحصة الفورية", en: "Immediate Session Attendance" },
  "rev_card_booklets_title": { ar: "مبيعات المذكرات والمخزن", en: "Booklets & Inventory Sales" },
  "rev_sec_treasury_title": { ar: "إجمالي المقبوضات حسب وسيلة الدفع (شامل كافة المصادر)", en: "Total Collections by Payment Method (All Sources Combined)" },
  "treasury_cash_total": { ar: "إجمالي الكاش (الدرج)", en: "Total Cash (Drawer)" },
  "treasury_instapay_total": { ar: "إجمالي إنستاباي", en: "Total InstaPay" },
  "treasury_wallet_total": { ar: "إجمالي فودافون كاش", en: "Total Vodafone Cash" },
  "stat_term_total_exp": { ar: "إجمالي المصروفات التشغيلية (ج)", en: "Total Operating Expenses (EGP)" },
  "stat_term_total_withdrawals": { ar: "مسحوبات المستر / الشخصية (ج)", en: "Teacher / Owner Withdrawals (EGP)" },
  "stat_term_net_vault": { ar: "صافي رصيد الخزائن المتاح (ج)", en: "Net Available Vaults Balance (EGP)" },
  "stat_term_total_debt": { ar: "إجمالي المتبقي والديون (ج)", en: "Total Outstanding & Debt (EGP)" },
  "term_vaults_title": { ar: "أرصدة الخزائن الحية وحركة التدفق المالي", en: "Live Vault Balances & Cash Flow" },
  "term_vaults_sync_subtitle": { ar: "تحديث فوري وتزامني لكافة وسائل الدفع", en: "Real-time sync for all payment methods" },
  "vault_cash_drawer": { ar: "درج الكاش (الخزينة النقدية)", en: "Cash Drawer (Vault)" },
  "vault_cash_sub": { ar: "المقبوضات والمصروفات الورقية", en: "Paper cash receipts & expenses" },
  "pill_cash": { ar: "كاش", en: "Cash" },
  "lbl_cash_in": { ar: "المقبوض نقداً:", en: "Cash Received:" },
  "lbl_cash_out": { ar: "المنصرف / المسحوب:", en: "Disbursed / Withdrawn:" },
  "lbl_cash_balance": { ar: "الرصيد الفعلي الحالي بالدرج:", en: "Current Actual Drawer Balance:" },
  "vault_wallet_account": { ar: "محفظة فودافون كاش", en: "Vodafone Cash (E-Wallet)" },
  "vault_wallet_sub": { ar: "المحافظ الإلكترونية الذكية", en: "Smart electronic wallets" },
  "pill_wallet": { ar: "محفظة", en: "Wallet" },
  "lbl_wallet_in": { ar: "المقبوض بالمحفظة:", en: "Wallet Received:" },
  "lbl_wallet_out": { ar: "المنصرف / المسحوب:", en: "Disbursed / Withdrawn:" },
  "lbl_wallet_balance": { ar: "الرصيد الفعلي الحالي بالمحفظة:", en: "Current Actual Wallet Balance:" },
  "vault_instapay_account": { ar: "حساب إنستاباي (InstaPay)", en: "InstaPay Account" },
  "vault_instapay_sub": { ar: "التحويلات البنكية اللحظية", en: "Instant electronic bank transfers" },
  "pill_instapay": { ar: "InstaPay", en: "InstaPay" },
  "lbl_instapay_in": { ar: "المقبوض بإنستاباي:", en: "InstaPay Received:" },
  "lbl_instapay_out": { ar: "المنصرف / المسحوب:", en: "Disbursed / Withdrawn:" },
  "lbl_instapay_balance": { ar: "الرصيد الفعلي الحالي بإنستاباي:", en: "Current Actual InstaPay Balance:" },
  "term_tx_title": { ar: "سجل المصروفات ومسحوبات المستر", en: "Expenses & Withdrawals Log" },
  "tx_filter_all": { ar: "الكل", en: "All" },
  "tx_filter_expense": { ar: "مصروفات سنتر", en: "Center Expenses" },
  "tx_filter_withdrawal": { ar: "مسحوبات المستر", en: "Owner Withdrawals" },
  "btn_record_center_exp": { ar: "تسجيل مصروف سنتر", en: "Record Center Expense" },
  "btn_record_withdrawal": { ar: "تسجيل مسحوبات المستر", en: "Record Owner Withdrawal" },
  "th_date": { ar: "التاريخ", en: "Date" },
  "th_type": { ar: "النوع", en: "Type" },
  "th_reason": { ar: "البيان / السبب", en: "Description / Purpose" },
  "th_vault": { ar: "الخزينة المستخدمة", en: "Used Vault" },
  "th_amount": { ar: "المبلغ", en: "Amount" },
  "th_action": { ar: "الإجراء", en: "Action" },
  "tx_empty": { ar: "لا توجد حركات مسجلة حتى الآن", en: "No recorded transactions yet" },
  "term_detailed_statement": { ar: "كشف حساب الطلاب التفصيلي", en: "Detailed Students Financial Statement" },
  "term_search_ph": { ar: "بحث باسم الطالب..", en: "Search by student name.." },
  "term_all_classes": { ar: "جميع المجموعات", en: "All Groups" },
  "th_student_name": { ar: "اسم الطالب", en: "Student Name" },
  "th_group": { ar: "المجموعة", en: "Group" },
  "th_required": { ar: "المطلوب", en: "Required" },
  "th_paid": { ar: "المدفوع", en: "Paid" },
  "th_remaining": { ar: "المتبقي", en: "Remaining" },
  "th_att_count": { ar: "مرات الحضور", en: "Attendances" },

  // Assistants View
  "asst_mgmt_title": { ar: "إدارة المساعدين والتحكم في الصلاحيات", en: "Assistants & Permissions Management" },
  "asst_mgmt_desc": { ar: "تحكم بشكل مباشر في الميزات المتاحة لكل مساعد. أي تعديل يتم تطبيقه فورياً ولحظياً في صفحة المساعد المفتوحة.", en: "Directly manage features available to each assistant. Any changes apply instantly to the active assistant page." },
  "btn_add_asst": { ar: "إضافة مساعد جديد", en: "Add New Assistant" },

  // Decision Requests
  "dec_direct_title": { ar: "إصدار وتطبيق قرار مباشر لطالب (خصم / إعفاء / تعديل مصاريف)", en: "Issue Direct Student Decision (Discount / Exemption / Custom Fee)" },
  "dec_student_lbl": { ar: "رقم الطالب (ID) أو الاسم", en: "Student ID or Name" },
  "dec_student_ph": { ar: "ادخل كود الطالب أو ابحث بالاسم...", en: "Enter student code or search name..." },
  "dec_type_lbl": { ar: "نوع القرار", en: "Decision Type" },
  "dec_opt_discount": { ar: "خصم مالي محدد (جنيه)", en: "Specific Financial Discount (EGP)" },
  "dec_opt_exemption": { ar: "إعفاء كامل من المصاريف", en: "Full Fee Exemption" },
  "dec_opt_custom_fee": { ar: "تحديد إجمالي المصاريف المطلوبة", en: "Set Total Required Fee" },
  "dec_btn_check": { ar: "فحص الطالب", en: "Check Student" },
  "dec_lbl_req": { ar: "المطلوب الأصلي", en: "Original Required" },
  "dec_lbl_disc": { ar: "الخصم الحالي", en: "Current Discount" },
  "dec_lbl_paid": { ar: "المدفوع حتى الآن", en: "Paid So Far" },
  "dec_lbl_rem": { ar: "المتبقي بعد السداد", en: "Remaining After Payment" },
  "dec_disc_val_lbl": { ar: "قيمة الخصم المطلوبة (جنيه)", en: "Required Discount Value (EGP)" },
  "dec_reason_lbl": { ar: "سبب القرار / ملاحظات المدير (تظهر في السجلات)", en: "Decision Reason / Manager Notes" },
  "dec_apply_btn": { ar: "تطبيق القرار فوراً", en: "Apply Decision Immediately" },
  "dec_inbox_title": { ar: "صندوق طلبات القرارات المعلقة من المساعدين", en: "Pending Assistant Decision Requests Inbox" },
  "dec_btn_refresh": { ar: "تحديث", en: "Refresh" },

  // Packages & Expenses
  "pkg_title": { ar: "إدارة باقات المجموعات والأسعار", en: "Group Packages & Pricing Management" },
  "pkg_add_btn": { ar: "إضافة باقة جديدة", en: "Add New Package" },
  "exp_title": { ar: "تسجيل ومتابعة المصروفات", en: "Record & Monitor Expenses" },
  "exp_reason_lbl": { ar: "بند المصروف / السبب", en: "Expense Item / Reason" },
  "exp_reason_ph": { ar: "مثال: فواتير كهرباء / طباعة ورق", en: "e.g. Electricity bills / Paper printing" },
  "exp_amount_lbl": { ar: "المبلغ (ج)", en: "Amount (EGP)" },
  "exp_date_lbl": { ar: "التاريخ", en: "Date" },
  "exp_record_btn": { ar: "تسجيل المصروف", en: "Record Expense" },

  // Syllabus
  "syl_title": { ar: "إضافة وتحديث خطة سير المنهج الدراسي", en: "Add & Update Syllabus Roadmap Plan" },
  "syl_lesson_lbl": { ar: "اسم الفصل / الدرس", en: "Chapter / Lesson Name" },
  "syl_lesson_ph": { ar: "مثال: Chapter 2 - Electric Flux", en: "e.g. Chapter 2 - Electric Flux" },
  "syl_status_lbl": { ar: "حالة الشرح", en: "Teaching Status" },
  "syl_opt_not_started": { ar: "لم يبدأ بعد", en: "Not Started" },
  "syl_opt_in_progress": { ar: "جاري الشرح", en: "In Progress" },
  "syl_opt_completed": { ar: "تم الانتهاء", en: "Completed" },
  "syl_notes_lbl": { ar: "ملاحظات الحصة الأخيرة (تظهر للمساعدين)", en: "Latest Session Notes (Visible to Assistants)" },
  "syl_notes_ph": { ar: "مثال: تم إنهاء المسائل والواجب صفحة 45", en: "e.g. Completed problems and homework page 45" },
  "syl_save_btn": { ar: "حفظ وإضافة للجدول", en: "Save & Add to Schedule" },
  "syl_timeline_title": { ar: "خريطة الدروس الحالية", en: "Current Lessons Roadmap" },

  // Subscription Plans & Lock Screen
  "lock_title": { ar: "انتهت فترة اشتراكك", en: "Subscription Expired" },
  "lock_desc": { ar: "عفواً، لقد انتهت فترة اشتراكك في نظام Studify.<br>يرجى التواصل مع الدعم الفني لتجديد الاشتراك والاستمرار في استخدام النظام.", en: "Your Studify subscription has expired.<br>Please contact technical support to renew your subscription and continue using the system." },
  "lock_contact_text": { ar: "للتجديد تواصل مع فريق الدعم الفني", en: "Contact Technical Support to Renew" },
  "sub_loading": { ar: "جاري تحميل بيانات الاشتراك...", en: "Loading subscription details..." },
  "sub_title_std": { ar: "خطط الاشتراك المتاحة — Standard", en: "Available Subscription Plans — Standard" },
  "sub_title_upcoming": { ar: "الباقات القادمة قريباً", en: "Upcoming Future Packages" },
  
  // Plan 1: Monthly
  "sub_monthly_name": { ar: "الخطة المرنة", en: "Flexible Plan" },
  "sub_monthly_dur": { ar: "اشتراك شهر واحد", en: "1 Month Subscription" },
  "sub_monthly_badge": { ar: "الباقة الأساسية", en: "Basic Plan" },
  "sub_monthly_curr": { ar: "جنيه / شهر", en: "EGP / Month" },
  "sub_monthly_subtext": { ar: "السعر الأساسي لاشتراك الشهر الواحد", en: "Standard price for 1 month subscription" },
  
  // Plan 2: Quarterly
  "sub_quarterly_name": { ar: "الخطة المريحة", en: "Comfort Plan" },
  "sub_quarterly_dur": { ar: "اشتراك 3 شهور", en: "3 Months Subscription" },
  "sub_quarterly_saving": { ar: "وفّر 600 ج", en: "Save 600 EGP" },
  "sub_quarterly_old_price": { ar: "6,000 ج", en: "6,000 EGP" },
  "sub_quarterly_discount_badge": { ar: "خصم ربع سنوي", en: "Quarterly Discount" },
  "sub_quarterly_curr": { ar: "جنيه / 3 شهور", en: "EGP / 3 Months" },
  "sub_quarterly_subtext": { ar: "يعادل <b>1,799 ج</b> فقط شهرياً", en: "Equates to only <b>1,799 EGP</b> / month" },
  
  // Plan 3: Golden / Semi-Annual
  "sub_golden_ribbon": { ar: "الأكثر طلباً وتوفيراً", en: "Most Popular & Best Value" },
  "sub_golden_name": { ar: "الخطة الذهبية", en: "Golden Plan" },
  "sub_golden_dur": { ar: "اشتراك ترم كامل (5 شهور)", en: "Full Term Subscription (5 Months)" },
  "sub_golden_saving": { ar: "وفّر 2,000 ج (شهر مجاناً)", en: "Save 2,000 EGP (1 Month Free)" },
  "sub_golden_old_price": { ar: "10,000 ج", en: "10,000 EGP" },
  "sub_golden_free_month": { ar: "شهر كامل مجاناً", en: "1 Full Month Free" },
  "sub_golden_curr": { ar: "جنيه / ترم كامل", en: "EGP / Full Term" },
  "sub_golden_subtext": { ar: "يعادل <b>1,599 ج</b> فقط شهرياً (وفر 2,000 ج)", en: "Equates to only <b>1,599 EGP</b> / month (Save 2,000 EGP)" },
  "sub_btn_contact_golden": { ar: "تواصل للاشتراك الذهبي", en: "Contact for Golden Plan" },
  
  // Shared Plan Features
  "sub_feat_full_system": { ar: "النظام التشغيلي والمالي الكامل", en: "Full Operational & Financial System" },
  "sub_feat_full_system_all": { ar: "النظام التشغيلي والمالي بالكامل", en: "Full Operational & Financial System" },
  "sub_feat_max_st_600": { ar: "الحد الأقصى <b>600 طالب فقط</b>", en: "Maximum <b>600 Students only</b>" },
  "sub_feat_max_asst_2": { ar: "الحد الأقصى <b>2 مساعد فقط</b>", en: "Maximum <b>2 Assistants only</b>" },
  "sub_feat_max_st_750": { ar: "الحد الأقصى <b>750 طالب</b>", en: "Maximum <b>750 Students</b>" },
  "sub_feat_max_asst_4": { ar: "الحد الأقصى <b>4 مساعدين</b>", en: "Maximum <b>4 Assistants</b>" },
  "sub_feat_max_st_1000": { ar: "الحد الأقصى <b>1,000 طالب</b>", en: "Maximum <b>1,000 Students</b>" },
  "sub_feat_max_asst_5": { ar: "الحد الأقصى <b>5 مساعدين</b>", en: "Maximum <b>5 Assistants</b>" },
  "sub_feat_peace_mind": { ar: "راحة بال من التجديد المتكرر", en: "Peace of mind from frequent renewals" },
  "sub_feat_term_stability": { ar: "استقرار تام لترم دراسي كامل (5 شهور)", en: "Complete stability for full academic term (5 months)" },
  "sub_feat_support_24h": { ar: "<b>دعم فني متواصل 24 ساعه لحل المشاكل التقنية</b>", en: "<b>24/7 continuous technical support for any issues</b>" },
  "sub_feat_wa_golden": { ar: "<b>حملات التسويق الذكية بالواتساب (ميزة حصرية)</b>", en: "<b>Smart WhatsApp marketing campaigns (Exclusive feature)</b>" },
  "sub_feat_wa_locked": { ar: "حملات التسويق الذكية بالواتساب (مغلقة)", en: "Smart WhatsApp Marketing Campaigns (Locked)" },
  "sub_btn_contact": { ar: "تواصل للاشتراك", en: "Contact to Subscribe" },
  
  // Upcoming Plans
  "sub_pro_name": { ar: "باقة Pro — تطبيق الموبايل الذكي", en: "Pro Package — Smart Mobile App" },
  "sub_pro_subtitle": { ar: "تطبيق موبايل مخصص للطلاب وأولياء الأمور لمتابعة حضور ومواعيد السنتر لحظياً", en: "Dedicated mobile app for students & parents to track center attendance and schedules in real-time" },
  "sub_vip_name": { ar: "باقة VIP — المنصة التعليمية المتكاملة", en: "VIP Package — All-in-One Learning Platform" },
  "sub_vip_subtitle": { ar: "نظام تعليمي وسحابي كامل مع نطاق مخصص وسيرفرات خاصة بالسنتر", en: "Complete cloud learning platform with custom domain and dedicated servers for your center" },
  "sub_badge_coming_soon": { ar: "قريباً<br>Coming Soon", en: "Coming Soon" },
  "sub_pro_f1": { ar: "كارت الطالب الذكي مع كود QR مدمج لتسجيل الحضور الذاتي والسريع", en: "Smart student ID card with QR code for instant self-attendance" },
  "sub_pro_f2": { ar: "إشعارات فورية وتنبيهات لولي الأمر بالغياب والدرجات بعد كل حصة", en: "Instant notifications to parents for absences and grades after every session" },
  "sub_pro_f3": { ar: "لوحة متابعة مستوى الطالب وتفاصيل الواجبات والاختبارات الدورية", en: "Student dashboard with homework details and periodic test analytics" },
  "sub_pro_f4": { ar: "متابعة الأقساط الشهرية وفواتير سداد الكورسات أونلاين بضغطة زر", en: "Track monthly installments and online course invoices with 1-click" },
  "sub_vip_f1": { ar: "منصة وبوابة خاصة باسم ونطاق السنتر المستقل (Custom Domain)", en: "Custom branded web portal with independent center domain (Custom Domain)" },
  "sub_vip_f2": { ar: "مشغل حصص وفيديوهات مشفر ومحمي بالكامل ضد تسجيل وتصوير الشاشة", en: "Encrypted lesson video player fully protected against screen capture and recording" },
  "sub_vip_f3": { ar: "بنك أسئلة ذكي واختبارات إلكترونية بتصحيح فوري وتحليل أداء بالذكاء الاصطناعي", en: "Smart question bank and online tests with automated grading and AI performance insights" },
  "sub_vip_f4": { ar: "استيعاب غير محدود للطلاب والمساعدين مع سيرفر مخصص ودعم VIP", en: "Unlimited capacity for students and assistants with dedicated high-speed server & VIP support" },
  // Mobile bottom nav
  "nav_daily": { ar: "الرئيسية", en: "Home" },
  "nav_term": { ar: "الترم", en: "Term" },
  "nav_assistants": { ar: "السكرتارية", en: "Assistants" },
  "nav_more": { ar: "المزيد", en: "More" },

  // Financial modals and new filters
  "lbl_from_date": { ar: "من تاريخ:", en: "From Date:" },
  "lbl_to_date": { ar: "إلى تاريخ:", en: "To Date:" },
  "opt_cash": { ar: "كاش", en: "Cash" },
  "opt_instapay": { ar: "إنستاباي", en: "InstaPay" },
  "opt_wallet": { ar: "فودافون كاش", en: "Vodafone Cash" },
  "rev_tbl_title": { ar: "سجل التحصيل والتوريد للفترة المحددة", en: "Collection & Supply Log for the Selected Period" },
  "tbl_th_date": { ar: "التاريخ", en: "Date" },
  "tbl_th_source": { ar: "البيان / المصدر", en: "Description / Source" },
  "tbl_th_channel": { ar: "نوع الإيراد", en: "Revenue Type" },
  "tbl_th_amount": { ar: "المبلغ", en: "Amount" },
  "tbl_th_method": { ar: "طريقة الدفع", en: "Payment Method" },
  "lbl_avail_bal": { ar: "الرصيد المتاح:", en: "Available Balance:" },
  "lbl_curr_bal": { ar: "الرصيد الحالي:", en: "Current Balance:" },
  "trans_note_ph": { ar: "ملاحظات التحويل (اختياري)...", en: "Transfer notes (optional)..." },
  "tbl_th_datetime": { ar: "التاريخ والوقت", en: "Date & Time" },
  "tbl_th_from": { ar: "من خزينة", en: "From Vault" },
  "tbl_th_to": { ar: "إلى خزينة", en: "To Vault" },
  "tbl_th_note": { ar: "ملاحظات", en: "Notes" },
  "exp_period_total": { ar: "إجمالي مصروفات الفترة", en: "Total Period Expenses" },
  "tbl_th_reason": { ar: "بند المصروف", en: "Expense Item" },
  "wd_period_total": { ar: "إجمالي المسحوبات", en: "Total Withdrawals" },
  "tbl_th_vault_source": { ar: "مسحوب من", en: "Withdrawn From" },
  "search_student_ph": { ar: "ابحث باسم الطالب أو كود الـ ID...", en: "Search by student name or ID..." },
  "tbl_th_student": { ar: "اسم الطالب", en: "Student Name" },
  "tbl_th_class": { ar: "الصف / المجموعة", en: "Class / Group" },
  "tbl_th_disc_amt": { ar: "قيمة الخصم", en: "Discount Amount" },
  "tbl_th_paid": { ar: "المدفوع", en: "Paid" },
  "tbl_th_debt": { ar: "المتبقي", en: "Remaining" },
  "tbl_th_action": { ar: "الإجراء", en: "Action" },
  "btn_prev": { ar: "السابق", en: "Previous" },
  "btn_next": { ar: "التالي", en: "Next" },
  "debts_modal_title": { ar: "الديون والمدفوعات المتأخرة", en: "Debts & Overdue Payments" },
  "debts_modal_subtitle": { ar: "كشف حساب للطلاب أصحاب المديونيات غير المسددة", en: "Statement of account for students with outstanding debts" },
  "debts_modal_total_lbl": { ar: "إجمالي الديون المتأخرة", en: "Total Overdue Debts" },
  "debts_modal_count_lbl": { ar: "عدد الطلاب المتعثرين", en: "Count of Students with Debts" },
  "tbl_th_required": { ar: "المطلوب سداده", en: "Required Amount" },
  "vaults_breakdown_title": { ar: "تفاصيل الخزائن والأرصدة", en: "Vaults & Balances Details" },
  "vaults_breakdown_subtitle": { ar: "مراقبة السيولة النقدية في الخزائن والمحافظ المختلفة", en: "Monitor cash liquidity in different vaults and wallets" },
  "lbl_grand_liquidity": { ar: "إجمالي السيولة (جميع الخزائن)", en: "Total Liquidity (All Vaults)" },
  "btn_transfer_vaults": { ar: "تحويل بين الخزائن", en: "Transfer Between Vaults" },
  "students_modal_title": { ar: "قائمة وبيانات الطلاب المسجلين", en: "List and Data of Registered Students" },
  "students_modal_subtitle": { ar: "استعراض شامل لبيانات واشتراكات الطلاب مع ترقيم الصفحات والبحث الفوري", en: "Comprehensive view of students data and subscriptions with paging and instant search" },
  "lbl_total_registered": { ar: "إجمالي الطلاب المسجلين:", en: "Total Registered Students:" },
  "lbl_pkg_students": { ar: "طلاب باقات / عام:", en: "Package / General Students:" },
  "lbl_session_students": { ar: "طلاب حصص فردية:", en: "Single Session Students:" },
  "students_search_ph": { ar: "بحث بالاسم أو الكود أو رقم الهاتف...", en: "Search by name, ID or phone..." },
  "opt_all_classes": { ar: "جميع المجموعات والصفوف", en: "All Groups and Classes" },
  "tbl_th_id": { ar: "#ID", en: "#ID" },
  "tbl_th_st_phone": { ar: "هاتف الطالب", en: "Student Phone" },
  "tbl_th_parent_phone": { ar: "هاتف ولي الأمر", en: "Parent Phone" },
  "tbl_th_pay_status": { ar: "حالة السداد", en: "Payment Status" },
  "rev_dist_ratio": { ar: "نسب التوزيع حسب القنوات:", en: "Distribution Ratio by Channels:" },
  "exp_cash": { ar: "المنصرف كاش:", en: "Cash Spent:" },
  "exp_insta": { ar: "المنصرف إنستاباي:", en: "InstaPay Spent:" },
  "exp_voda": { ar: "المنصرف فودافون:", en: "Vodafone Spent:" },
  "exp_cash_vault": { ar: "إجمالي كاش (الخزينة):", en: "Total Cash (Vault):" },
  "exp_main_vault": { ar: "خزينة الكاش الرئيسي", en: "Main Cash Vault" }

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
    packages:     { title: isAr ? "إدارة الباقات" : "Packages Management", icon: "fa-boxes-stacked" },
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
    textEl.innerText = targetLang === "en" ? "Switching to English..." : "جاري التبديل إلى العربية...";
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
    label: { ar: "إظهار الإيراد اليومي", en: "Show Daily Revenue" }, 
    desc: { ar: "يعرض رقم إيراد الوردية الحالي في الشريط العلوي للمساعد", en: "Displays current shift revenue in assistant topbar" }, 
    icon: "fa-wallet", 
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


// =============================================================================
// GLOBAL NOTIFICATION & INTERCEPTOR ENGINE (FULL ARABIC & ENGLISH LOCALIZATION)
// =============================================================================
const GLOBAL_NOTIF_DICT = {
  "يرجى إدخال اسم المستخدم وكلمة المرور": "Please enter username and password",
  "أدخل اسم المستخدم وكلمة المرور": "Please enter username and password",
  "أدخل البريد الإلكتروني وكلمة المرور": "Please enter email and password",
  "أدخل كلمة المرور": "Please enter password",
  "بيانات الدخول غير صحيحة، يرجى التأكد من الحساب وكلمة المرور": "Invalid credentials. Please verify your username and password.",
  "خطأ في بيانات الدخول: الرجاء التأكد من الحساب وكلمة المرور": "Login error: Please check your username and password.",
  "حساب المساعد غير موجود أو كلمة المرور خاطئة.": "Assistant account not found or password incorrect.",
  "تم تسجيل الدخول بنجاح. مرحباً بك.": "Logged in successfully. Welcome!",
  "تم تسجيل الدخول بنجاح. جاري التوجيه إلى لوحة الإدارة...": "Logged in successfully. Redirecting to admin portal...",
  "تم تسجيل الخروج بنجاح": "Logged out successfully",
  "تم تسجيل الخروج": "Logged out",
  "حدث خطأ أثناء تسجيل الدخول": "An error occurred during login",
  "يرجى إدخال كلمة المرور": "Please enter password",
  "كلمة المرور غير صحيحة": "Incorrect password",
  "يرجى كتابة كلمة المرور للمتابعة": "Please enter password to proceed",
  "يرجى إدخال كلمة مرور المدير": "Please enter manager password",
  "كلمة مرور المدير غير صحيحة!": "Incorrect manager password!",
  "كلمة المرور غير صحيحة!": "Incorrect password!",
  "يجب تسجيل الدخول كمدير أولاً": "Must login as manager first",
  "تم فتح الشيفت بنجاح": "Shift opened successfully",
  "تم إغلاق الشيفت بنجاح": "Shift closed successfully",
  "يرجى كتابة سبب تعليق أو رفض اليومية": "Please specify the reason for suspending or rejecting the daily shift",
  "تم حفظ قرار اعتماد اليومية": "Daily shift approval saved",
  "تم رفض اليومية": "Daily shift rejected",
  "تنبيه: اليومية معلقة حالياً": "Warning: Daily shift is currently suspended",
  "تم فتح شيفت جديد": "New shift opened",
  "تم تعليق اليومية": "Daily shift suspended",
  "تم اعتماد اليومية بنجاح": "Daily shift approved successfully",
  "تم تأكيد استلام النقدية وإغلاق اليومية": "Cash receipt confirmed and daily shift closed",
  "تم فتح الشيفت واليومية بنجاح من قِبل المدير.": "Shift and daily register opened successfully by manager.",
  "اليومية معتمدة والنظام مفتوح للعمل": "Daily register approved and system open for work",
  "اليومية معلقة وفي انتظار اعتماد المدير": "Daily register suspended awaiting manager approval",
  "هذه الميزة مقفولة من قِبَل المدير": "This feature is locked by the manager",
  "عفواً، قسم الباقات والأسعار مقفل من المدير": "Sorry, Packages & Pricing is locked by manager",
  "عفواً، قسم الباقات والأسعار مقفل من قِبَل المدير": "Sorry, Packages & Pricing is locked by manager",
  "عفواً، قسم المنهج مقفل من المدير": "Sorry, Syllabus is locked by manager",
  "عفواً، قسم التقارير مقفل من المدير": "Sorry, Reports section is locked by manager",
  "عفواً، قسم أدوات التسويق مقفل من المدير": "Sorry, Marketing Tools section is locked by manager",
  "عفواً، قسم طلاب الحصة مقفل من المدير": "Sorry, Session Students section is locked by manager",
  "عفواً، قسم مخزون المذكرات مقفل من المدير": "Sorry, Booklets Inventory is locked by manager",
  "عفواً، قسم الإعدادات مقفل من المدير": "Sorry, Settings section is locked by manager",
  "عفواً، إضافة طالب جديد مقفلة من المدير": "Sorry, adding new students is locked by manager",
  "عفواً، تعديل الباقات والأسعار مقفل من المدير": "Sorry, editing packages is locked by manager",
  "عفواً، خصم/إعفاء الطلاب مقفل من المدير": "Sorry, student discount/exemption is locked by manager",
  "إرسال طلبات القرارات مقفل من قِبل المدير": "Sending decision requests is locked by manager",
  "فشل تحديث الصلاحية في السحابة": "Failed to update permission in cloud",
  "تم تحديث الصلاحيات من قِبل المدير فورياً": "Permissions updated by manager instantly",
  "تم تحديث صلاحية المساعد بنجاح": "Assistant permission updated successfully",
  "فشل تحديث الصلاحية": "Failed to update permission",
  "تم تسجيل الحضور بنجاح": "Attendance recorded successfully",
  "يرجى تحديد مادة الحضور من القائمة بالأعلى أولاً": "Please select attendance subject from the top menu first",
  "الطالب غير مسجل": "Student not registered",
  "الطالب غير موجود": "Student not found",
  "تم تسجيل الغياب بنجاح": "Absence recorded successfully",
  "الطالب مسجل حضور بالفعل اليوم": "Student is already marked present today",
  "تم إلغاء تسجيل الحضور": "Attendance cancelled",
  "تم إلغاء تسجيل الحضور والمبلغ بنجاح": "Attendance and payment cancelled successfully",
  "تم إلغاء تسجيل الحضور والمبلغ": "Attendance and payment cancelled",
  "تم تسجيل حضور الطالب بنجاح": "Student attendance recorded successfully",
  "تم تسجيل حضور الحصة وتحصيل المبلغ بنجاح": "Session attendance recorded and payment collected successfully",
  "تم إعطاء إنذار": "Warning issued",
  "تم تسجيل الإنذار بنجاح": "Warning recorded successfully",
  "تم إلغاء الإنذار": "Warning cancelled",
  "إلغاء الحضور المالي": "Cancel Financial Attendance",
  "هل أنت متأكد من حذف وإلغاء حضور هذا الطالب المالي لليوم؟": "Are you sure you want to cancel and delete this student's financial attendance for today?",
  "نعم، إلغاء الحضور": "Yes, cancel attendance",
  "تم حفظ الطالب بنجاح": "Student saved successfully",
  "تم تحديث بيانات الطالب بنجاح": "Student updated successfully",
  "تم حذف الطالب بنجاح": "Student deleted successfully",
  "تم استرجاع الطالب بنجاح": "Student restored successfully",
  "تم الاسترجاع": "Restored successfully",
  "هذا الكود محجوز ومسجل به بيانات بالفعل": "This ID is already registered",
  "يرجى إدخال اسم الطالب": "Please enter student name",
  "يرجى إدخال كود الطالب": "Please enter student ID",
  "كود الطالب غير صحيح": "Invalid student ID",
  "يرجى إدخال رقم الطالب أولاً": "Please enter student phone number first",
  "يرجى إدخال رقم ولي الأمر أولاً": "Please enter parent phone number first",
  "يرجى ملء كافة البيانات": "Please fill in all required fields",
  "يرجى إدخال رقم أو اسم الطالب": "Please enter student name or phone number",
  "لم يتم العثور على طالب بهذا الرقم أو الاسم": "No student found with this name or number",
  "يرجى اختيار طالب أولاً": "Please select a student first",
  "يرجى اختيار طالب أولاً من البحث": "Please select a student from search first",
  "يرجى اختيار أو فتح ملف طالب أولاً": "Please select or open a student file first",
  "يرجى اختيار أو فتح ملف طالب أولاً لطباعة الإقرار": "Please select or open a student file first to print acknowledgment",
  "تم التحديث لـ عادي": "Updated to Standard member",
  "تم الترقية لـ VIP": "Upgraded to VIP member",
  "تم تحديث حالة العضوية": "Membership status updated",
  "تم حفظ التقييم بنجاح": "Student evaluation saved successfully",
  "تم تحديث باقات الطالب بنجاح": "Student packages updated successfully",
  "نشطة": "Active",
  "تمت الموافقة وتطبيق الخصم": "Discount approved and applied",
  "تمت الموافقة وتطبيق الخصم بنجاح": "Discount approved and applied successfully",
  "تمت الموافقة على طلب الخصم": "Discount request approved",
  "تمت الموافقة على طلبك": "Your request was approved",
  "فشل تنفيذ الطلب": "Failed to execute request",
  "تم رفض الطلب": "Request rejected",
  "تم رفض طلبك": "Your request was rejected",
  "فشل في الرفض": "Failed to reject request",
  "فشل معالجة الرفض": "Failed to process rejection",
  "حدث خطأ أثناء اعتماد القرار": "Error occurred while approving decision",
  "يرجى كتابة قيمة الخصم المقترحة بالجنيه": "Please enter proposed discount amount in EGP",
  "يرجى إدخال قيمة خصم صحيحة": "Please enter a valid discount amount",
  "يرجى كتابة سبب طلب القرار ليعتمده المدير": "Please enter reason for decision request",
  "تم إرسال طلب القرار للمدير بنجاح، وستصلك الموافقة فور اعتمادها من الإدارة": "Decision request sent to manager successfully",
  "لا توجد طلبات معلقة": "No pending requests",
  "تم اعتماد وتطبيق القرار بنجاح": "Decision approved and applied successfully",
  "قرار خصم مباشر من الإدارة": "Direct discount decision from management",
  "حملات التسويق متاحة حصرياً في الخطة الذهبية - يرجى ترقية باقة الاشتراك للوصول إلى هذه الميزة": "Marketing campaigns are exclusive to Golden Plan. Please upgrade your subscription.",
  "تم الوصول للحد الأقصى للطلاب": "Maximum student limit reached",
  "تم تجاوز الحد الأقصى للمساعدين المسموح به": "Maximum assistants limit reached for your plan",
  "تم الوصول للحد الأقصى للمساعدين": "Maximum assistants limit reached",
  "تم قفل النظام: انتهت فترة الاشتراك": "System locked: Subscription has expired",
  "انتهاء صلاحية اشتراك النظام": "System Subscription Expired",
  "تواصل للتجديد الفوري": "Contact for Instant Renewal",
  "عرض خطط الاشتراك": "View Subscription Plans",
  "تم تسجيل الدفعة بنجاح": "Payment recorded successfully",
  "تم حفظ التعديلات بنجاح": "Changes saved successfully",
  "يرجى إدخال مبلغ صحيح": "Please enter a valid amount",
  "يرجى إدخال اسم الطالب والمبلغ بشكل صحيح": "Please enter student name and amount correctly",
  "يرجى اختيار الباقة المراد الدفع لها": "Please select the package to pay for",
  "تم تصحيح الدفعة بنجاح": "Payment corrected successfully",
  "تم حذف الدفعة بنجاح": "Payment deleted successfully",
  "تم إضافة الرصيد بنجاح": "Balance added successfully",
  "تم خصم المبلغ بنجاح": "Amount deducted successfully",
  "تم حفظ وتحديث الباقة بنجاح": "Package saved & updated successfully",
  "تم تحديث الباقة بنجاح": "Package updated successfully",
  "تم حفظ الباقة بنجاح": "Package saved successfully",
  "تم حذف الباقة نهائياً من السحابة والنظام": "Package permanently deleted from cloud & system",
  "تم حذف الباقة بنجاح": "Package deleted successfully",
  "يرجى إدخال اسم وسعر الباقة بشكل صحيح": "Please enter a valid package name and price",
  "يرجى إدخال اسم الباقة": "Please enter package name",
  "سعر الباقة يجب أن يكون رقماً": "Package price must be a number",
  "تم تسجيل المصروف بنجاح": "Expense recorded successfully",
  "تم حذف المصروف بنجاح": "Expense deleted successfully",
  "يرجى كتابة بند وقيمة المصروف": "Please enter expense item and amount",
  "يرجى إدخال بند ومبلغ المصروف": "Please enter expense item and amount",
  "تم حفظ وتحديث المنهج بنجاح": "Syllabus saved & updated successfully",
  "تم حفظ الدرس بنجاح": "Lesson saved successfully",
  "تمت إضافة الدرس لخريطة المنهج": "Lesson added to syllabus map",
  "تم تحديث حالة الدرس بنجاح": "Lesson status updated successfully",
  "تم حذف الدرس من المنهج بنجاح": "Lesson deleted from syllabus successfully",
  "تم حذف الدرس من المنهج": "Lesson deleted from syllabus",
  "يرجى إدخال عنوان الدرس": "Please enter lesson title",
  "يرجى إدخال اسم الدرس / الفصل": "Please enter lesson / chapter name",
  "تم بيع المذكرة بنجاح": "Booklet sold successfully",
  "تم استرجاع المذكرة للمخزون": "Booklet returned to inventory",
  "تم تحديث كمية المخزون بنجاح": "Inventory quantity updated successfully",
  "تم تحديث العدد الكلي بنجاح": "Total count updated successfully",
  "تم حفظ بيانات المذكرة بنجاح": "Booklet saved successfully",
  "تم حذف المذكرة بنجاح": "Booklet deleted successfully",
  "تم حذف المذكرة من قائمة المخزون": "Booklet deleted from inventory list",
  "الكمية المتاحة في المخزون لا تكفي": "Insufficient stock quantity available",
  "المخزون فارغ حالياً": "Inventory is currently out of stock",
  "يرجى إدخال اسم المذكرة أو الورق": "Please enter booklet or paper name",
  "يرجى إدخال عدد النسخ المستلمة": "Please enter received copies count",
  "تم استلام وإضافة المذكرة للمخزون بنجاح": "Booklet received and added to inventory successfully",
  "انتهى مخزون هذه المذكرة، يرجى تعديل العدد الكلي إذا قمت بطباعة نسخ إضافية.": "Stock depleted for this booklet. Please update total count if extra copies are printed.",
  "لم يتم بيع أي نسخة من هذه المذكرة لإرجاعها": "No copies of this booklet have been sold to return",
  "تعديل رصيد المذكرة": "Edit Booklet Stock",
  "حفظ التعديل": "Save Changes",
  "حفظ التعديل <i class=\"fa-solid fa-check\"></i>": "Save Changes <i class=\"fa-solid fa-check\"></i>",
  "حذف مذكرة من الجرد": "Delete Booklet from Inventory",
  "نعم، حذف المذكرة": "Yes, delete booklet",
  "تم تصفية الأرقام المستهدفة بنجاح": "Target numbers filtered successfully",
  "قائمة الأرقام فارغة، قم بتصفية داتا الطلاب أولاً.": "Numbers list is empty, filter students data first.",
  "فشل النسخ المباشر، يرجى تكرار المحاولة": "Direct copy failed, please try again",
  "بدء تشغيل البث التلقائي الآمن، يرجى السماح بالنوافذ المنبثقة (Pop-ups)": "Starting safe auto broadcast, please allow pop-ups",
  "تم إيقاف البث مؤقتاً": "Broadcast paused",
  "تم استئناف البث التلقائي ▶": "Auto broadcast resumed ▶",
  "تم إرسال الإعلان لجميع المساعدين": "Announcement broadcasted to all assistants",
  "تم حذف الإعلان بنجاح": "Announcement deleted successfully",
  "يرجى كتابة نص الإعلان": "Please write the announcement text",
  "تم تحديد كافة الرسائل كمقروءة": "All messages marked as read",
  "لا توجد رسائل مقروءة لمسحها": "No read messages to clear",
  "تم مسح الرسائل المقروءة بنجاح": "Read messages cleared successfully",
  "فشل مسح الرسائل المقروءة": "Failed to clear read messages",
  "تم حفظ الإعدادات بنجاح": "Settings saved successfully",
  "تم ترقية قاعدة البيانات المحلية بنجاح": "Local database successfully upgraded",
  "حدث خطأ أثناء حفظ البيانات.": "An error occurred while saving data.",
  "فشل الاتصال بقاعدة البيانات. تأكد من الإنترنت.": "Failed to connect to database. Please check your internet.",
  "فشل الاتصال بقاعدة البيانات السحابية": "Failed to connect to cloud database",
  "فشل الاتصال بالسحابة": "Cloud connection failed",
  "فشل الاتصال": "Connection failed",
  "تحذير: فشل مزامنة بعض البيانات من السحابة": "Warning: Some cloud data failed to sync",
  "تنبيه: حدث بطء في مزامنة السحابة، جاري الإعادة تلقائياً": "Notice: Cloud sync delayed, retrying automatically",
  "عاد الاتصال بالإنترنت جاري المزامنة مع السحابة...": "Internet restored. Syncing with cloud...",
  "تمت المزامنة مع السحابة بنجاح": "Cloud sync completed successfully",
  "تم عمل نسخة احتياطية بنجاح": "Backup created successfully",
  "تم تصدير نسخة احتياطية شاملة": "Comprehensive backup exported successfully",
  "تم استعادة النسخة الاحتياطية بنجاح": "Backup restored successfully",
  "تم تصفير حضور ومصاريف الترم بالكامل بنجاح": "Term attendance and expenses reset successfully",
  "الملف فارغ أو لا يحتوي على بيانات صالحة": "The file is empty or contains no valid data",
  "مكتبة الإكسيل غير موجودة، تأكد من وجود ملف xlsx.full.min.js في فولدر assets": "Excel library missing. Please check xlsx.full.min.js in assets folder",
  "مكتبة الإكسيل غير موجودة": "Excel library not found",
  "مكتبة Excel غير متوفرة": "Excel library not available",
  "تم تصدير نسخة Excel بنجاح.": "Excel file exported successfully.",
  "فشل تصدير البيانات إلى Excel": "Failed to export data to Excel",
  "جاري المزامنة والرفع إلى السحابة...": "Syncing and uploading to cloud...",
  "تمت المزامنة وتحديث الصلاحيات بنجاح": "Sync and permissions update completed successfully",
  "تمت المزامنة ورفع البيانات إلى السحابة بنجاح": "Sync and data upload to cloud completed successfully",
  "خطأ في المزامنة، تحقق من الاتصال": "Sync error, check connection",
  "عميل Supabase غير مهيأ": "Supabase client not initialized",
  "جاري رفع جميع البيانات المحلية إلى Supabase...": "Uploading all local data to Supabase...",
  "تم رفع جميع البيانات بنجاح إلى Supabase.": "All data successfully uploaded to Supabase.",
  "إعادة تهيئة النظام وضبط المصنع": "Reset System to Factory Settings",
  "تحذير شديد الخطورة: سيتم مسح كافة بيانات الطلاب والباقات والحضور والمصروفات بالكامل. اكتب \"مسح\" للتأكيد:": "Extreme danger: All student data, packages, attendance, and expenses will be completely wiped. Type \"مسح\" to confirm:",
  "تأكيد الحذف الشامل": "Confirm Complete Wipe",
  "تم ضبط المصنع": "Factory Reset Complete",
  "تم مسح كافة البيانات بنجاح وإعادة تشغيل النظام.": "All data successfully erased and system restarted.",
  "تم إنشاء حساب المساعد بنجاح": "Assistant account created successfully",
  "جاري إنشاء حساب المساعد... الرجاء الانتظار": "Creating assistant account... Please wait",
  "تم إضافة المساعد بنجاح.": "Assistant added successfully.",
  "تم إضافة المساعد بنجاح": "Assistant added successfully",
  "تم تحديث كلمة مرور المساعد بنجاح": "Assistant password updated successfully",
  "تم تحديث كلمة المرور بنجاح": "Password updated successfully",
  "فشل تحديث كلمة المرور": "Failed to update password",
  "تم حذف المساعد": "Assistant deleted",
  "تم حذف المساعد بنجاح": "Assistant deleted successfully",
  "تم حذف حساب المساعد بنجاح": "Assistant account deleted successfully",
  "فشل في حذف المساعد.": "Failed to delete assistant.",
  "فشل حذف المساعد": "Failed to delete assistant",
  "اسم المستخدم يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام فقط بدون مسافات": "Username must contain lowercase English letters & numbers only without spaces",
  "اسم المستخدم يجب أن يكون بحروف إنجليزية فقط وبدون مسافات": "Username must be English letters only without spaces",
  "يجب أن تكون مديراً لإضافة مساعدين.": "You must be a manager to add assistants.",
  "فشل إضافة المساعد": "Failed to add assistant",
  "تم نسخ كلمة المرور الحالية إلى الحافظة": "Current password copied to clipboard",
  "تم نسخ كلمة المرور": "Password copied to clipboard",
  "يرجى كتابة كلمة المرور الجديدة": "Please enter the new password",
  "كلمة المرور يجب أن تتكون من 6 خانات على الأقل": "Password must be at least 6 characters",
  "تغيير كلمة المرور": "Change Password",
  "حفظ كلمة المرور": "Save Password",
  "تغيير كلمة المرور الخاصة بك": "Change Your Password",
  "الرجاء إدخال كلمة المرور الجديدة": "Please enter the new password",
  "تغيير": "Change",
  "جاري تغيير كلمة المرور...": "Changing password...",
  "تم تغيير كلمة المرور بنجاح.": "Password changed successfully.",
  "جاري جلب بيانات المساعد...": "Fetching assistant data...",
  "تأكيد": "Confirm",
  "تأكيد الحذف": "Confirm Delete",
  "تأكيد الاستيراد": "Confirm Import",
  "نعم، استبدل": "Yes, replace",
  "تأكيد الخصم": "Confirm Discount",
  "تأكيد التصفير": "Confirm Reset",
  "نعم، صفر": "Yes, reset",
  "تأكيد ضبط المصنع": "Confirm Factory Reset",
  "نعم، امسح كل شيء": "Yes, erase everything",
  "تحذير شديد": "Severe Warning",
  "نعم، استرجع البيانات": "Yes, restore data",
  "نعم، احذف": "Yes, delete",
  "إلغاء": "Cancel",
  "تراجع": "Cancel",
  "حفظ": "Save",
  "إغلاق": "Close",
  "تم": "Done",
  "خطأ": "Error",
  "تحذير": "Warning",
  "نجاح": "Success",
  "هل أنت متأكد؟": "Are you sure?",
  "هل أنت متأكد من الحذف؟": "Are you sure you want to delete?",
  "لا يمكن التراجع عن هذه الخطوة!": "This action cannot be undone!",
  "تنبيه": "Notice",
  "تنبيه عام": "General Notice",
  "هل أنت متأكد من تصفير الترم؟": "Are you sure you want to reset the term?",
  "سيتم مسح سجل الحضور والمصروفات بالكامل!": "All attendance records and expenses will be wiped!",
  "نعم، صفر الترم": "Yes, reset term",
  "التقرير اليومي": "Daily Report",
  "تقرير الترم": "Term Report",
  "إدارة المساعدين": "Assistant Management",
  "صلاحيات المساعد": "Assistant Permissions",
  "طلبات القرارات": "Decision Requests",
  "إدارة الباقات والمصاريف": "Packages & Expenses Management",
  "الإعدادات المتقدمة": "Advanced Settings",
  "<i class='fa-solid fa-money-bill-wave'></i> الصلاحيات المالية": "<i class='fa-solid fa-money-bill-wave'></i> Financial Permissions",
  "<i class='fa-solid fa-server'></i> إدارة البيانات والنظام": "<i class='fa-solid fa-server'></i> Data & System Management",
  "<i class='fa-regular fa-file-lines'></i> صلاحيات الصفحات والأدوات": "<i class='fa-regular fa-file-lines'></i> Pages & Tools Permissions"
};

const DYNAMIC_NOTIF_RULES = [
  {
    pattern: /^تم الوصول للحد الأقصى للطلاب( \((.*?)\))?/i,
    replace: (m, p1, p2) => p2 ? `Maximum student limit reached (${p2})` : `Maximum student limit reached`
  },
  {
    pattern: /^الطالب غير مسجل:(.*)/i,
    replace: (m, p1) => `Student not registered: ${p1}`
  },
  {
    pattern: /^باقتكم الحالية تسمح بحد أقصى (.*?) طالب/i,
    replace: (m, p1) => `Your current plan allows a maximum of ${p1} students. Please contact management to upgrade.`
  },
  {
    pattern: /^تم تطبيق الخصم على (.*)$/i,
    replace: (m, p1) => `Discount applied to ${p1}`
  },
  {
    pattern: /^تم تطبيق القرار بنجاح للطالب:(.*)$/i,
    replace: (m, p1) => `Decision applied successfully for student:${p1}`
  },
  {
    pattern: /^تم استيراد (.*?) طالب بنجاح/i,
    replace: (m, p1) => `Successfully imported ${p1} students`
  },
  {
    pattern: /^تم بيع نسخة من (.*) وإضافة (.*?) ج للخزينة كاش$/i,
    replace: (m, p1, p2) => `Sold 1 copy of ${p1}, added ${p2} EGP cash to treasury`
  },
  {
    pattern: /^تم إرجاع نسخة من (.*) بنجاح$/i,
    replace: (m, p1) => `1 copy of ${p1} returned successfully`
  },
  {
    pattern: /^تم نسخ (.*?) رقم موبايل بنجاح/i,
    replace: (m, p1) => `Copied ${p1} mobile numbers successfully`
  },
  {
    pattern: /^تم فتح شيفت يوم \((.*?)\) بنجاح/i,
    replace: (m, p1) => `Shift for day (${p1}) opened successfully and assistant operations resumed.`
  },
  {
    pattern: /^تم إغلاق شيفت يوم \((.*?)\) وتجميد العمليات/i,
    replace: (m, p1) => `Shift for day (${p1}) closed and assistant operations frozen immediately.`
  },
  {
    pattern: /^تم تعليق يومية \((.*?)\) وإرسال الملاحظة/i,
    replace: (m, p1) => `Daily register (${p1}) suspended and notice sent to assistants`
  },
  {
    pattern: /^أدخل كلمة المرور الجديدة للمساعد \((.*)\):$/i,
    replace: (m, p1) => `Enter new password for assistant (${p1}):`
  },
  {
    pattern: /^أدخل العدد الكلي المستلم لمذكرة \((.*)\):$/i,
    replace: (m, p1) => `Enter total received count for booklet (${p1}):`
  },
  {
    pattern: /^هل أنت متأكد من حذف مذكرة \((.*)\) من قائمة الجرد؟$/i,
    replace: (m, p1) => `Are you sure you want to delete booklet (${p1}) from inventory?`
  },
  {
    pattern: /^تم (تفعيل|تعطيل|تحديث) صلاحية «(.*?)» للمساعد ([^\s.]+)(\.)?( بنجاح)?/i,
    replace: (m, p1, p2, p3) => {
      const act = p1 === 'تفعيل' ? 'enabled' : (p1 === 'تعطيل' ? 'disabled' : 'updated');
      const permMap = {
        'إظهار الإيراد اليومي': 'Show Daily Revenue',
        'عرض الإيرادات والخزينة': 'Show Revenue & Treasury',
        'الاعتماد اليومي للإيرادات': 'Daily Approval of Revenue',
        'إضافة وتعديل بيانات الطلاب': 'Add & Edit Student Data',
        'طلب خصم أو إعفاء': 'Request Discount or Exemption',
        'إدارة الباقات والاشتراكات': 'Manage Packages & Subscriptions',
        'إعدادات النظام والنسخ الاحتياطي': 'System Settings & Backup',
        'خريطة المنهج الدراسي': 'Syllabus Map',
        'التقارير والحسابات المالية': 'Financial Reports & Accounts',
        'حملات التسويق بالواتساب': 'WhatsApp Marketing Campaigns',
        'طلاب الحصة والغياب السريع': 'Session Students & Quick Attendance',
        'إدارة ومبيعات المذكرات': 'Booklets Inventory & Sales',
        'حذف الطلاب': 'Delete Students'
      };
      const pName = permMap[p2] || p2;
      return `Successfully ${act} permission "${pName}" for assistant ${p3}`;
    }
  },
  {
    pattern: /^حدث خطأ أثناء تطبيق القرار:(.*)/i,
    replace: (m, p1) => `Error occurred while applying decision: ${p1}`
  },
  {
    pattern: /^حدث خطأ أثناء الرفع:(.*)/i,
    replace: (m, p1) => `Error occurred during upload: ${p1}`
  },
  {
    pattern: /^فشل إرسال الطلب:(.*)/i,
    replace: (m, p1) => `Failed to send request: ${p1}`
  },
  {
    pattern: /^حدث خطأ أثناء قراءة ملف Excel:(.*)/i,
    replace: (m, p1) => `Error reading Excel file: ${p1}`
  },
  {
    pattern: /^حدث خطأ أثناء التصفير:(.*)/i,
    replace: (m, p1) => `Error resetting data: ${p1}`
  },
  {
    pattern: /^فشل ضبط المصنع:(.*)/i,
    replace: (m, p1) => `Factory reset failed: ${p1}`
  },
  {
    pattern: /^الباقة منتهية/i,
    replace: () => `Package expired`
  },
  {
    pattern: /^على وشك الانتهاء/i,
    replace: () => `About to expire`
  },
  {
    pattern: /^تم تسجيل حضور الطالب (.+) بنجاح/i,
    replace: (m, p1) => `Attendance recorded for ${p1} successfully.`
  },
  {
    pattern: /انتهت فترة صلاحية اشتراك المركز بالكامل/i,
    replace: () => `<p style="color:var(--text-secondary);margin-bottom:12px">Center subscription has expired completely.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">Operations are suspended until renewed by management.</p>`
  },
  {
    pattern: /انتهت فترة صلاحية الاشتراك الخاصة بنظام السنتر بالكامل/i,
    replace: () => `<p style="color:var(--text-secondary);margin-bottom:12px">Center subscription has expired completely.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">All operations are suspended until renewed by management.</p>`
  },
  {
    pattern: /باقتك الحالية تسمح بحد أقصى <b>(.*?) طالب<\/b>/is,
    replace: (m, p1) => `<p style="color:var(--text-secondary);margin-bottom:12px">Your current plan allows a maximum of <b>${p1} students</b>.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> Please upgrade your plan to add more students.</p>`
  },
  {
    pattern: /باقتك الحالية تسمح بحد أقصى <b>(.*?) مساعد<\/b>/is,
    replace: (m, p1) => `<p style="color:var(--text-secondary);margin-bottom:12px">Your current plan allows a maximum of <b>${p1} assistants</b>.</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> Please upgrade your plan to add more assistant accounts.</p>`
  },
  {
    pattern: /كلمة المرور الحالية للمساعد <b>(.*?)<\/b> هي:/i,
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
    if (txt) txt.textContent = isAr ? "جاري الانتقال.." : "Switching Portal...";
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
  const isAr = (currentLang === "ar");
  const btn = document.getElementById("adminLogoutBtn");
  if (btn) {
    btn.classList.add("logging-out");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${isAr ? "جاري تسجيل الخروج..." : "Logging out..."}</span>`;
  }

  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
    const txt = overlay.querySelector(".transition-text");
    if (txt) txt.textContent = isAr ? "جاري تسجيل الخروج..." : "Logging out...";
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
        if (cName === 'عام' || cName === 'General' || cName === 'بدون باقة' || cName === 'No Package') cName = '';
        let pList = (Array.isArray(s.packages) && s.packages.length > 0) 
          ? s.packages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'بدون باقة' && p !== 'No Package') 
          : (stPkgsMap[s.id] || (cName ? [cName] : []));
        if (typeof pList === 'string') pList = [pList];
        if (!Array.isArray(pList)) pList = [];
        pList = pList.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'بدون باقة' && p !== 'No Package');

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
    showToast("تحذير: فشل مزامنة بعض البيانات من السحابة", "warning");
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
    dailyReport:  { view: "viewDailyReport",  btn: "navBtnDailyReport",  title: isAr ? "التقرير اليومي" : "Daily Report", icon: "fa-calendar-day" },
    termReport:   { view: "viewTermReport",   btn: "navBtnTermReport",   title: isAr ? "تقرير الترم المالي" : "Term Financial Report", icon: "fa-chart-line" },
    assistants:   { view: "viewAssistants",   btn: "navBtnAssistants",   title: isAr ? "إدارة المساعدين والصلاحيات" : "Assistants & Permissions", icon: "fa-user-shield" },
    decisions:    { view: "viewDecisions",    btn: "navBtnDecisions",    title: isAr ? "صندوق طلبات القرارات" : "Decision Requests Inbox", icon: "fa-bell" },
    packages:     { view: "viewPackages",     btn: "navBtnPackages",     title: isAr ? "إدارة الباقات" : "Packages Management", icon: "fa-boxes-stacked" },
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
    // ── STATE 1: FEATURE DISABLED (OFF) ──
    // In this state, the feature itself is off. Assistants operate without daily shift lockout.
    // As per user request: When OFF, NEVER show "تمت المراجعة والقراءة" or action buttons!
    widget.className = "approval-card feature-disabled";
    widget.innerHTML = `
      <div class="approval-card-header">
        <div class="approval-header-left">
          <div class="approval-card-title">
            <span class="approval-status-icon icon-disabled"><i class="fa-solid fa-power-off"></i></span>
            <span class="approval-title-text">${isAr ? 'نظام الشيفت اليومي والاعتماد' : 'Daily Shift & Approval System'}</span>
            <span class="approval-badge-pill disabled">
              <i class="fa-solid fa-ban"></i> ${isAr ? 'معطل بالكامل (OFF)' : 'Disabled (OFF)'}
            </span>
          </div>
        </div>
        <div class="approval-header-switch">
          <div class="switch-control-group">
            <span class="switch-control-label">${isAr ? 'مفتاح الميزة:' : 'Feature:'}</span>
            <button type="button" class="master-power-switch state-off" onclick="window.toggleShiftSystemFeature(true)" title="${isAr ? 'تفعيل نظام الشيفتات' : 'Enable Shift System'}" aria-label="تفعيل نظام الشيفتات">
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
            ? 'ميزة إغلاق واعتماد الشيفت اليومي معطلة حالياً. العمليات متاحة للمساعدين بشكل دائم ومستمر دون الحاجة لاعتماد يومي أو إغلاق يدوي للشيفت.'
            : 'The daily shift system is currently disabled. Assistants have uninterrupted access to operations without daily shift requirements.'}
        </p>
      </div>
    `;
    return;
  }

  // ── STATE 2: FEATURE ENABLED (ON) ──
  const titleText = isAr ? `حالة تشغيل الشيفت اليومي (${d})` : `Daily Shift Status (${d})`;
  const badgeHtml = isApproved 
    ? (isAr ? '<i class="fa-solid fa-circle-play"></i> مفتوح للعمل (نشط)' : '<i class="fa-solid fa-circle-play"></i> Active (ON)')
    : (isAr ? '<i class="fa-solid fa-lock"></i> مغلق ومجمد (بانتظار الاعتماد)' : '<i class="fa-solid fa-lock"></i> Locked & Suspended (OFF)');

  const descText = isApproved
    ? (isAr 
        ? 'الشيفت مفتوح ونشط حالياً. يمكن للمساعدين تسجيل الحضور والتحصيل والعمليات بشكل طبيعي. عند انتهاء اليوم، انقر على زر إغلاق الشيفت لتجميد العمليات ومراجعة الحسابات.'
        : 'The shift is currently active and assistants can log attendance and collections. Click Close Shift to freeze operations and audit accounts.')
    : (isAr
        ? 'الشيفت مغلق ومجمد حالياً لدى المساعدين. تم تجميد كافة العمليات لحين مراجعة واعتماد اليومية. انقر على "اعتماد اليومية وفتح الشيفت" للبدء.'
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
          <span class="switch-control-label active">${isAr ? 'الميزة مفعلة:' : 'Feature:'}</span>
          <button type="button" class="master-power-switch state-on" onclick="window.toggleShiftSystemFeature(false)" title="${isAr ? 'تعطيل ميزة نظام الشيفتات' : 'Disable Shift System'}" aria-label="تعطيل ميزة نظام الشيفتات">
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
          <i class="fa-solid fa-signature"></i> <span>${isAr ? 'تم اعتماد اليومية وفتح الشيفت بواسطة:' : 'Approved & opened by:'} ${info.approved_by}</span>
        </div>
      ` : ''}
    </div>

    <div class="approval-card-footer">
      ${!isApproved ? `
        <button type="button" class="btn-shift-action btn-shift-open" onclick="window.approveDailyReportAndOpenShift('${d}')">
          <i class="fa-solid fa-check-double"></i>
          <span>${isAr ? 'تمت المراجعة والقراءة — اعتماد وفتح الشيفت (ON)' : 'Reviewed & Approved — Open Shift (ON)'}</span>
        </button>
      ` : `
        <button type="button" class="btn-shift-action btn-shift-close" onclick="window.toggleDailyApproval('${d}', false)">
          <i class="fa-solid fa-lock"></i>
          <span>${isAr ? 'إغلاق وتجميد الشيفت (Turn OFF)' : 'Close & Freeze Shift (Turn OFF)'}</span>
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
      title: isAr ? 'تعطيل ميزة نظام الشيفتات' : 'Disable Shift System',
      text: isAr ? 'عند تعطيل الميزة، سيعمل النظام لدى المساعدين بشكل دائم ومستمر دون أي حجب أو قفل يومي. هل تريد الاستمرار؟' : 'Disabling this will allow assistants to operate continuously without daily lockouts. Proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isAr ? 'نعم، تعطيل الميزة (OFF)' : 'Yes, Disable (OFF)',
      confirmButtonColor: '#EF4444',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
    });
    if (!res.isConfirmed) return;
  }

  window.shiftSystemEnabled = enable;
  localStorage.setItem('studify_shift_system_enabled', enable ? 'true' : 'false');
  window.renderDailyApprovalWidget(d);

  showToast(
    enable 
      ? (isAr ? 'تم تفعيل ميزة نظام الشيفت واليومية بنجاح.' : 'Shift system enabled.') 
      : (isAr ? 'تم تعطيل نظام الشيفتات — العمليات متاحة للمساعدين دائماً.' : 'Shift system disabled.'),
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
    title: isAr ? 'اعتماد اليومية وفتح الشيفت' : 'Approve Report & Open Shift',
    html: isAr
      ? `<div style="text-align: start; font-size: 0.95em; line-height: 1.6;">
          <p style="margin-bottom: 12px;">هل قمت بمراجعة إحصائيات يومية <b>(${d})</b> وتريد اعتمادها وفتح الشيفت للعمل لدى المساعدين فوراً؟</p>
          <div style="background: var(--bg-inset, #f8fafc); border: 1px solid var(--border, #e2e8f0); border-radius: 10px; padding: 12px; display: flex; justify-content: space-around; text-align: center;">
            <div>
              <div style="font-size: 0.8em; color: var(--text-secondary);">حضور اليوم</div>
              <strong style="color: var(--success); font-size: 1.2em;">${totalAtt} طالب</strong>
            </div>
            <div style="border-inline-start: 1px solid var(--border, #e2e8f0);"></div>
            <div>
              <div style="font-size: 0.8em; color: var(--text-secondary);">إيراد اليومية</div>
              <strong style="color: var(--primary); font-size: 1.2em;">${revAmount.toLocaleString()} ج</strong>
            </div>
          </div>
        </div>`
      : `<p>Confirm review of daily report for <b>(${d})</b> and open shift operations for assistants?</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'نعم، تم الاطلاع والاعتماد (فتح الشيفت ON)' : 'Yes, Approve & Open (ON)',
    confirmButtonColor: '#10B981',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
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
    showToast(`تم فتح شيفت يوم (${d}) بنجاح وبدء عمليات المساعدين فوراً.`, "success");

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
      title: isAr ? 'إغلاق وتجميد الشيفت (Turn OFF)' : 'Close & Freeze Shift (Turn OFF)',
      text: isAr ? `هل أنت متأكد من إغلاق شيفت يوم (${d}) وتجميد كافة العمليات لدى المساعدين لحين مراجعة اليومية؟` : `Are you sure you want to close shift for day (${d}) and freeze assistant operations?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isAr ? 'نعم، إغلاق الشيفت (OFF)' : 'Yes, Close Shift (OFF)',
      confirmButtonColor: '#EF4444',
      cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
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
    showToast(`تم إغلاق شيفت يوم (${d}) وتجميد العمليات لدى المساعدين فورياً.`, "warning");

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
  if (!note) return showToast("يرجى كتابة سبب تعليق أو رفض اليومية", "err");
  
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
  const currencySuffix = isAr ? " ج" : " EGP";

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
      body.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 24px;">${isAr ? `لا توجد بيانات مسجلة لهذا التاريخ (${d})` : `No data recorded for this date (${d})`}</div>`;
    } else {
      let groups = {};
      ids.forEach(id => {
        const st = (students && students[id]) ? students[id] : null;
        const cls = (st && st.className && st.className !== 'عام' && st.className !== 'General') ? st.className.trim() : (isAr ? "بدون باقة" : "No Package");
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
        const grpKey = rawCls.includes("حصة") || rawCls.includes("Session") ? rawCls : `${rawCls} (${defaultSessLabel})`;
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
              <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 2px;">${isAr ? 'إيراد تقديري:' : 'Estimated Revenue:'} ${groups[g].revenue} ${currencySuffix}</div>
            </div>
            <span style="background: var(--gradient-subtle); color: var(--primary); font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 0.9em;">
              ${groups[g].count} ${isAr ? 'طالب' : 'Students'}
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
      let expHtml = `<h4 style="color: var(--danger); font-size: 0.95em; margin-bottom: 10px; font-weight: 700;"><i class="fa-solid fa-receipt"></i> ${isAr ? 'مصروفات اليوم:' : "Today's Expenses:"}</h4>`;
      expHtml += '<div style="display: flex; flex-direction: column; gap: 8px;">';
      expArr.forEach(e => {
        expHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; background: var(--bg-danger-subtle); border: 1px solid rgba(239,68,68,0.2); padding: 8px 14px; border-radius: 8px; font-size: 0.88em;">
            <span>${e.reason || (isAr ? "مصروف" : "Expense")}</span>
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
  const currencySuffix = isAr ? " ج" : " EGP";
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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-secondary);">${isAr ? "لا توجد حركات مسجلة" : "No recorded transactions"}</td></tr>`;
    return;
  }

  const methodLabels = {
    cash: { ar: "درج الكاش", en: "Cash Drawer", icon: "fa-money-bill-wave", color: "#10b981" },
    wallet: { ar: "فودافون كاش", en: "Vodafone Cash", icon: "fa-wallet", color: "#ef4444" },
    instapay: { ar: "إنستاباي", en: "InstaPay", icon: "fa-mobile-screen-button", color: "#0284c7" }
  };

  let html = "";
  filtered.forEach((item, idx) => {
    const isWd = (item.type === 'withdrawal' || item.isWithdrawal);
    const mInfo = methodLabels[item.method || 'cash'] || methodLabels.cash;
    const typeBadge = isWd 
      ? `<span class="badge-withdrawal"><i class="fa-solid fa-hand-holding-dollar"></i> ${isAr ? "مسحوبات المستر" : "Owner Withdrawal"}</span>`
      : `<span class="badge-expense"><i class="fa-solid fa-receipt"></i> ${isAr ? "مصروف سنتر" : "Center Expense"}</span>`;
    
    const methodBadge = `<span class="badge-treasury" style="color:${mInfo.color};"><i class="fa-solid ${mInfo.icon}"></i> ${isAr ? mInfo.ar : mInfo.en}</span>`;
    const amtColor = isWd ? "#f59e0b" : "#ef4444";
    const rawId = item.id || String(item.timestamp || idx);

    html += `
      <tr>
        <td style="font-weight:700; white-space:nowrap;">${item.date || '—'}</td>
        <td>${typeBadge}</td>
        <td style="font-weight:700; color:var(--text-primary);">${item.reason || '—'}</td>
        <td>${methodBadge}</td>
        <td style="font-weight:900; color:${amtColor}; white-space:nowrap;">${Number(item.amount || 0).toLocaleString()} ${currencySuffix}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
};

window.renderTermTable = function() {
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ج" : " EGP";
  const search = (document.getElementById("termSearchInput")?.value || "").toLowerCase().trim();
  const clsFilter = document.getElementById("termClassFilter")?.value || "";
  const tbody = document.getElementById("termReportTableBody");
  const clsSel = document.getElementById("termClassFilter");

  // Populate classes
  if (clsSel) {
    const existing = [...clsSel.options].map(o => o.value);
    const sessClasses = (typeof window.getAdminUniqueSessionStudents === 'function') ? window.getAdminUniqueSessionStudents().map(s => s.className || "") : [];
    const classes = [...new Set([...Object.values(students).map(s => (s.className && s.className !== 'عام' && s.className !== 'General') ? s.className : (isAr ? "بدون باقة" : "No Package")), ...sessClasses])];
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
    const cls = (st.className && st.className !== 'عام' && st.className !== 'General') ? st.className.trim() : (isAr ? "بدون باقة" : "No Package");
    if (clsFilter && cls !== clsFilter) return;

    matchCount++;
    let req = 0;
    const pkgKeys = Object.keys(packages || {});
    const normName = str => String(str || '').replace(/^باقة\s+/, '').trim().toLowerCase();

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
      ? st.packages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'بدون باقة' && p !== 'No Package') 
      : (cls && cls !== 'عام' && cls !== 'General' && cls !== 'بدون باقة' && cls !== 'No Package' ? [cls] : []);
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
      ? `<span style="display:inline-block; font-size:0.75em; background:rgba(245,158,11,0.15); color:#F59E0B; padding:1px 5px; border-radius:4px; margin-inline-start:4px;">(${isAr ? 'خصم ' + discount + ' ج' : 'Disc. ' + discount + ' EGP'})</span>`
      : '';
    const statusText = debt > 0 
      ? (debt + currencySuffix) 
      : `<span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.85em; padding:3px 8px; border-radius:6px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${isAr ? "خالص" : "Paid"}</span>`;
    const profileBtnText = isAr ? "ملف الطالب" : "Profile";

    rowsHtml += `
      <tr>
        <td style="font-weight: 700;">${st.name} <span style="font-size:0.8em; color:var(--text-secondary);">(#${st.id})</span></td>
        <td><span style="background:var(--gradient-subtle); color:var(--primary); font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${cls}</span></td>
        <td>${req > 0 ? (req + currencySuffix) : "—"}</td>
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
      if (search && !sSt.name.toLowerCase().includes(search) && !(isAr ? "طالب حصة" : "session").toLowerCase().includes(search)) return;
      if (clsFilter && sCls !== clsFilter) return;

      matchCount++;

      rowsHtml += `
        <tr style="background: rgba(59, 130, 246, 0.02);">
          <td style="font-weight: 700;">
            ${sSt.name} 
            <span class="badge" style="background:rgba(59,130,246,0.12); color:#2563eb; border:1px solid rgba(59,130,246,0.3); font-weight:700; font-size:0.75em; padding:2px 6px; border-radius:4px; margin-inline-start:4px; display:inline-flex; align-items:center; gap:3px;">
              <i class="fa-solid fa-user-clock"></i> ${isAr ? "طالب حصة" : "Session"}
            </span>
          </td>
          <td><span style="background:rgba(59,130,246,0.1); color:#2563eb; font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${sCls}</span></td>
          <td>${sSt.totalPaid > 0 ? (sSt.totalPaid + currencySuffix) : "—"}</td>
          <td style="color:var(--success); font-weight:700;">
            ${sSt.totalPaid + currencySuffix}
          </td>
          <td style="color:var(--success); font-weight:700;">
            <span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.85em; padding:3px 8px; border-radius:6px; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ${isAr ? "خالص" : "Paid"}</span>
          </td>
          <td style="font-weight:700;">${sSt.attCount}</td>
          <td>
            <span class="badge" style="background:var(--bg-inset); color:var(--text-secondary); border:1px solid var(--border); padding:4px 8px; border-radius:6px; font-size:0.82em;">
              <i class="fa-solid fa-clock-rotate-left"></i> ${sSt.date || "—"}
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
    tbody.innerHTML = rowsHtml || `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-secondary);">${isAr ? "لا توجد نتائج مطابقة" : "No matching records found"}</td></tr>`;
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
  const isAr = (currentLang === "ar");
  const res = await Swal.fire({
    title: isAr ? 'تأكيد حذف المساعد' : 'Confirm Delete Assistant',
    text: isAr ? `هل أنت متأكد من حذف حساب المساعد (${username}) نهائياً؟` : `Are you sure you want to permanently delete assistant (${username})?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: isAr ? 'نعم، احذف' : 'Yes, Delete',
    confirmButtonColor: '#EF4444',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
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
    showToast("يرجى إدخال رقم أو اسم الطالب للبحث", "warn");
    if (feedback) {
      feedback.classList.remove("hidden");
      feedback.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; color:#f59e0b; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:12px 16px; font-weight:600;">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>يرجى إدخال كود الطالب (ID) أو كتابة اسمه أولاً للقيام بالفحص.</span>
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
            <span>لم يتم العثور على أي طالب مسجل بالمعرف أو الاسم ( <b>${val}</b> ). يرجى التأكد من الرقم أو كتابة اسم الطالب بشكل صحيح.</span>
          </div>
          <button type="button" class="btn secondary smallBtn" onclick="document.getElementById('directDecisionStudentInput').focus();" style="padding:4px 10px; font-size:0.82em;">
            إعادة المحاولة
          </button>
        </div>`;
    }
    showToast("لم يتم العثور على طالب بهذا الرقم أو الاسم", "err");
  } else {
    if (feedback) { feedback.classList.add("hidden"); feedback.innerHTML = ""; }
    showToast(`تم العثور على الطالب: ${window.selectedDirectDecisionStudent.name || window.selectedDirectDecisionStudent.id}`, "success");
  }
};

window.displayDirectDecisionStudent = function(st) {
  window.selectedDirectDecisionStudent = st;
  const card = document.getElementById("directDecisionStudentCard");
  if (!card) return;

  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ج" : " EGP";
  document.getElementById("ddsIdBadge").textContent = "ID: " + st.id;
  document.getElementById("ddsName").textContent = st.name || (isAr ? "طالب بدون اسم" : "Unnamed Student");
  document.getElementById("ddsClass").textContent = st.className || (isAr ? "غير محدد" : "Unspecified");

  // Populate Target Package Selector (Strictly student packages only, no 'all' global option!)
  const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
  const pkgSelect = document.getElementById("directDecisionTargetPackage");
  if (pkgSelect) {
    let optHtml = `<option value="">-- ${isAr ? 'اختر الباقة المستهدفة بالقرار' : 'Select Targeted Package'} --</option>`;
    stPkgs.forEach(pName => {
      let pPrice = 0;
      if (packages && packages[pName]) pPrice = packages[pName].price || 0;
      else if (groupFees && groupFees[pName]) pPrice = groupFees[pName].price || groupFees[pName] || 0;
      optHtml += `<option value="${pName}">${pName} (${pPrice > 0 ? pPrice + currencySuffix : (isAr ? 'سعر مخصص' : 'Custom')})</option>`;
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
  const currencySuffix = isAr ? " ج" : " EGP";

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
  const normName = str => String(str || '').replace(/^باقة\s+/, '').trim().toLowerCase();
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
    showToast("يرجى فحص واختيار طالب أولاً", "err");
    return;
  }

  const targetPkg = document.getElementById("directDecisionTargetPackage")?.value;
  if (!targetPkg) {
    showToast("يرجى اختيار الباقة المستهدفة بالقرار", "warn");
    return;
  }

  const type = document.getElementById("directDecisionType")?.value || "discount";
  const val = Number(document.getElementById("directDecisionValueInput")?.value) || 0;
  const reason = document.getElementById("directDecisionReasonInput")?.value.trim() || "قرار مباشر من المدير";

  // Price of targeted package
  let pkgPrice = 0;
  if (packages && packages[targetPkg]) pkgPrice = packages[targetPkg].price || 0;
  else if (groupFees && groupFees[targetPkg]) pkgPrice = groupFees[targetPkg].price || groupFees[targetPkg] || 0;

  let newPkgDiscount = 0;
  let summaryText = "";

  if (type === "exemption") {
    newPkgDiscount = pkgPrice;
    summaryText = `إعفاء كامل من مصاريف باقة [${targetPkg}] (المطلوب: ${pkgPrice} ج)`;
  } else if (type === "custom_fee") {
    newPkgDiscount = Math.max(0, pkgPrice - val);
    summaryText = `تحديد مصاريف باقة [${targetPkg}] بقيمة ${val} ج (خصم: ${newPkgDiscount} ج)`;
  } else {
    if (val <= 0) {
      showToast("يرجى إدخال قيمة خصم صحيحة أكبر من الصفر", "warn");
      return;
    }
    newPkgDiscount = Math.min(pkgPrice, val);
    summaryText = `خصم مالي بقيمة ${val} ج على باقة [${targetPkg}]`;
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
      sender_name: 'مدير المركز (قرار مباشر)',
      message: `[الباقة: ${targetPkg}] ${reason}`,
      status: 'approved',
      created_at: new Date().toISOString()
    }]);

    // 5. Send unread message to assistant with student_id
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: 'قرار خصم مباشر من الإدارة',
      student_id: String(st.id),
      message: `أصدر المدير قراراً للطالب ${st.name || st.id} (${summaryText}). السبب: ${reason}`,
      status: 'unread'
    }]);

    showToast(`تم تطبيق القرار بنجاح للطالب: ${st.name || st.id} على باقة [${targetPkg}]`, "success");

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
    showToast("حدث خطأ أثناء تطبيق القرار: " + err.message, "err");
  }
};

window.fetchDecisions = async function() {
  const listEl = document.getElementById("adminDecisionsList");
  if (!listEl || !supabase) return;
  const isAr = (currentLang === "ar");
  const currencySuffix = isAr ? " ج" : " EGP";
  listEl.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "جاري جلب الطلبات..." : "Loading decision requests..."}</div>`;

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
      listEl.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا توجد طلبات قرارات معلقة حالياً. كل شيء مستقر." : "No pending decision requests currently. All clear."}</div>`;
      return;
    }

    let html = "";
    reqs.forEach(r => {
      const date = new Date(r.created_at).toLocaleString(isAr ? "ar-EG" : "en-US");
      const isExempt = (r.title === "exemption" || r.sub_type === "exemption");
      const subType = isExempt ? "exemption" : "discount";
      const typeLabel = isExempt ? (isAr ? "إعفاء كامل (100%)" : "Full Exemption (100%)") : (isAr ? `خصم بقيمة ${r.amount} ج` : `Discount of ${r.amount} EGP`);
      const studentCodeTitle = isAr ? `طالب كود: ${r.student_id || '—'}` : `Student ID: ${r.student_id || '—'}`;
      const requestedByLabel = isAr ? "طلب بواسطة:" : "Requested by:";
      const senderTitle = r.sender_name || (isAr ? "مساعد" : "Assistant");
      const reasonLabel = isAr ? "السبب:" : "Reason:";
      const amountText = isExempt ? (isAr ? "إعفاء" : "Exemption") : (r.amount + currencySuffix);
      const approveText = isAr ? "موافقة" : "Approve";
      const rejectText = isAr ? "رفض" : "Reject";

      // Targeted package badge
      let targetPkgName = r.target_pkg || "";
      if (!targetPkgName && r.message && r.message.startsWith("[الباقة:")) {
        const match = r.message.match(/\[الباقة:\s*(.*?)\]/);
        if (match) targetPkgName = match[1];
      }
      const pkgBadgeHtml = targetPkgName 
        ? `<span class="badge" style="background:rgba(37,99,235,0.12); color:var(--primary); font-size:0.82em; font-weight:700; padding:2px 8px; border-radius:6px; margin-inline-start:6px;"><i class="fa-solid fa-boxes-packing"></i> ${targetPkgName === 'all' ? (isAr ? 'كافة الباقات' : 'All Packages') : targetPkgName}</span>`
        : '';

      html += `
        <div class="decision-card">
          <div class="decision-card-info">
            <div class="decision-student-name">${studentCodeTitle} ${pkgBadgeHtml}</div>
            <div class="decision-meta">${typeLabel} • ${requestedByLabel} <b>${senderTitle}</b> • ${date}</div>
            <div class="decision-meta" style="margin-top: 4px; color: var(--text-primary);">${reasonLabel} ${r.message || '—'}</div>
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
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center;">${isAr ? "فشل جلب الطلبات: " : "Failed to load requests: "}${err.message}</div>`;
  }
};

window.approveDecision = async function(reqId, studentId, subType, amount, targetPkg) {
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
      title: 'تمت الموافقة على طلب القرار',
      message: `وافق المدير على طلب الطالب (${studentId})${pkgText} بقيمة ${subType === "exemption" ? "إعفاء كامل" : amount + " ج"}`,
      status: 'unread'
    }]);

    showToast("تمت الموافقة وتطبيق القرار بنجاح", "success");
    window.renderTermTable();
    window.fetchDecisions();
  } catch(err) {
    console.error(err);
    showToast("فشل اعتماد القرار: " + err.message, "err");
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
    if (months > 0) breakdown.push(`${months} ${months === 1 ? 'شهر' : (months === 2 ? 'شهران' : (months <= 10 ? 'أشهر' : 'شهراً'))}`);
    if (remDays > 0) breakdown.push(`${remDays} ${remDays === 1 ? 'يوم' : (remDays === 2 ? 'يومان' : (remDays <= 10 ? 'أيام' : 'يوماً'))}`);
    const summary = breakdown.length > 0 ? breakdown.join(' و ') : `${days} يوم`;
    return {
      days,
      text: `${days} يوماً (${summary})`,
      short: `${days} يوم`
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
  const currencySuffix = isAr ? " ج" : " EGP";

  const keys = Object.keys(packages || {});
  if (keys.length === 0) {
    container.innerHTML = `<div style="color:var(--text-secondary); padding:20px; text-align:center;">${isAr ? "لا توجد باقات مضافة بعد." : "No packages added yet."}</div>`;
    return;
  }

  let html = "";
  keys.forEach(k => {
    const p = packages[k] || {};
    const details = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(k) : p;
    const subj = details.subject || p.subject || k;
    const price = Number(details.price || p.price || 0);

    // Enrolled students with robust normalization & single-package fallback
    const normName = str => String(str || '').replace(/^باقة\s+/, '').trim().toLowerCase();
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
        <span class="admin-pkg-validity-badge" title="${isAr ? 'المدة الزمنية للباقة' : 'Package Duration'}">
          <i class="fa-regular fa-calendar-days"></i> ${details.startDate} ${isAr ? "إلى" : "to"} ${details.endDate}
        </span>
        ${durShort ? `<span class="admin-pkg-duration-pill"><i class="fa-solid fa-clock"></i> ${durShort}</span>` : ''}
      `;
    } else if (details.expiryType === 'sessions' && details.sessionLimit > 0) {
      validityBadgeHtml = `
        <span class="admin-pkg-validity-badge" style="color:#ec4899;">
          <i class="fa-solid fa-ticket"></i> ${details.sessionLimit} ${isAr ? "حصص مسموحة" : "Allowed Sessions"}
        </span>
      `;
    } else {
      validityBadgeHtml = `
        <span class="admin-pkg-validity-badge">
          <i class="fa-solid fa-infinity"></i> ${isAr ? "مفتوحة بدون انتهاء" : "Unlimited Validity"}
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
              <span class="metric-lbl">${isAr ? "المشتركين" : "Students"}</span>
              <span class="metric-val">${count} <small>${isAr ? "طالب" : "st"}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-collected">
            <div class="metric-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "المحصل" : "Collected"}</span>
              <span class="metric-val">${collectedRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-remaining">
            <div class="metric-icon"><i class="fa-solid fa-receipt"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "المتبقي" : "Remaining"}</span>
              <span class="metric-val">${remainingRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>

          <div class="admin-pkg-metric-cell metric-expected">
            <div class="metric-icon"><i class="fa-solid fa-calculator"></i></div>
            <div class="metric-content">
              <span class="metric-lbl">${isAr ? "الإجمالي المتوقع" : "Expected Total"}</span>
              <span class="metric-val">${expectedRevenue} <small>${currencySuffix}</small></span>
            </div>
          </div>
        </div>

        <div class="admin-pkg-progress-wrap">
          <div class="admin-pkg-progress-header">
            <span>${isAr ? "نسبة التحصيل" : "Collection Rate"}</span>
            <b>${collectedPercent}% (${collectedRevenue} ${currencySuffix} ${isAr ? "من" : "of"} ${expectedRevenue} ${currencySuffix})</b>
          </div>
          <div class="admin-pkg-progress-bar">
            <div class="admin-pkg-progress-fill" style="width:${collectedPercent}%;"></div>
          </div>
        </div>

        <div class="admin-pkg-actions">
          <button class="btn secondary smallBtn btn-pkg-edit" onclick="window.openEditPackageModal('${encodeURIComponent(k)}')">
            <i class="fa-solid fa-pen-to-square"></i> ${isAr ? "تعديل كامل" : "Full Edit"}
          </button>
          <button class="btn danger smallBtn iconOnly btn-pkg-delete" onclick="window.adminDeletePackage('${encodeURIComponent(k)}')" title="${isAr ? "حذف الباقة" : "Delete Package"}">
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
    title: isAr ? 'إضافة باقة جديدة' : 'Add New Package',
    customClass: { popup: 'swal-wide-package-modal' },
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:${isAr ? 'right' : 'left'};">
        <!-- 3-Column Top Row -->
        <div class="pkg-edit-grid-3">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "اسم الباقة:" : "Package Name:"}</label>
            <input id="swalPkgName" class="pkg-field-input" placeholder="${isAr ? "مثال: باقة سبتمبر" : "e.g. September Package"}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "المادة الدراسية:" : "Subject:"}</label>
            <input id="swalPkgSubject" class="pkg-field-input" placeholder="${isAr ? "مثال: علوم" : "e.g. Science"}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "السعر (ج.م):" : "Price (EGP):"}</label>
            <input id="swalPkgPrice" type="number" class="pkg-field-input" placeholder="0">
          </div>
        </div>
        
        <!-- Validity System Selector -->
        <div class="pkg-field-group">
          <label class="pkg-field-label">${isAr ? "نظام الصلاحية وتنبيهات الانتهاء:" : "Validity System & Expiry Alerts:"}</label>
          <select id="swalPkgExpiryType" class="pkg-field-input" onchange="
            const isT = (this.value === 'time');
            document.getElementById('swalTimeBox').style.display = isT ? 'block' : 'none';
            document.getElementById('swalSessBox').style.display = (this.value === 'sessions') ? 'block' : 'none';
          ">
            <option value="time">${isAr ? "بالمدة الزمنية (من تاريخ إلى تاريخ)" : "By Duration (From Date to Date)"}</option>
            <option value="sessions">${isAr ? "بعدد الحصص (مثال: 8 حصص)" : "By Session Count (e.g. 8 Sessions)"}</option>
          </select>
        </div>
        
        <!-- Duration Box -->
        <div id="swalTimeBox" style="display:block; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isAr ? "المدة الزمنية للباقة:" : "Package Duration:"}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "تاريخ البداية:" : "Start Date:"}</label>
              <input type="date" id="swalPkgStartDate" class="pkg-field-input">
            </div>
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "تاريخ النهاية:" : "End Date:"}</label>
              <input type="date" id="swalPkgEndDate" class="pkg-field-input">
            </div>
          </div>
          <div class="pkg-duration-info-box" id="swalAddDurationBox">
            <i class="fa-solid fa-clock"></i>
            <span id="swalAddDurationText">${isAr ? "يرجى تحديد تاريخ البداية والنهاية" : "Please select start and end dates"}</span>
          </div>
        </div>

        <!-- Sessions Box -->
        <div id="swalSessBox" style="display:none; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "عدد الحصص المسموحة للمشترك:" : "Allowed Sessions for Subscriber:"}</label>
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
        dText.textContent = res ? res.text : (isAr ? "يرجى تحديد تاريخ البداية والنهاية" : "Please select start and end dates");
      };
      if (sInp) sInp.addEventListener('input', updateDurationLive);
      if (eInp) eInp.addEventListener('input', updateDurationLive);
    },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isAr ? 'حفظ الباقة' : 'Save Package',
    confirmButtonColor: '#2563eb',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
    preConfirm: () => {
      const name = document.getElementById('swalPkgName').value.trim();
      const subject = document.getElementById('swalPkgSubject').value.trim();
      const price = Number(document.getElementById('swalPkgPrice').value) || 0;
      const expiryType = document.getElementById('swalPkgExpiryType').value;
      const startDate = document.getElementById('swalPkgStartDate').value;
      const endDate = document.getElementById('swalPkgEndDate').value;
      const sessions = Number(document.getElementById('swalPkgSessions').value) || 0;

      if (!name) {
        Swal.showValidationMessage(isAr ? 'يرجى إدخال اسم الباقة' : 'Please enter package name');
        return false;
      }
      if (!subject) {
        Swal.showValidationMessage(isAr ? 'يرجى إدخال المادة الدراسية' : 'Please enter subject');
        return false;
      }
      if (expiryType === 'time' && (!startDate || !endDate)) {
        Swal.showValidationMessage(isAr ? 'يرجى تحديد تاريخ البداية وتاريخ النهاية' : 'Please select start and end dates');
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
      showToast(isAr ? "تمت إضافة الباقة بنجاح" : "Package added successfully", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "فشل إضافة الباقة" : "Failed to add package", "err");
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
  const initialDurText = initialDurObj ? initialDurObj.text : (isAr ? "يرجى تحديد تاريخ البداية والنهاية" : "Please select start and end dates");

  const { value: formValues } = await Swal.fire({
    title: (isAr ? 'تعديل الباقة: ' : 'Edit Package: ') + name,
    customClass: { popup: 'swal-wide-package-modal' },
    html: `
      <div style="display:flex; flex-direction:column; gap:14px; text-align:${isAr ? 'right' : 'left'};">
        <!-- 3-Column Top Row -->
        <div class="pkg-edit-grid-3">
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "اسم الباقة (تغيير الاسم يحدّث الطلاب):" : "Package Name:"}</label>
            <input id="swalEditPkgName" class="pkg-field-input" value="${name}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "المادة الدراسية:" : "Subject:"}</label>
            <input id="swalEditPkgSubject" class="pkg-field-input" value="${curSubject}">
          </div>
          
          <div class="pkg-field-group">
            <label class="pkg-field-label">${isAr ? "السعر (ج.م):" : "Price (EGP):"}</label>
            <input id="swalEditPkgPrice" type="number" class="pkg-field-input" value="${curPrice}">
          </div>
        </div>
        
        <!-- Validity System Selector -->
        <div class="pkg-field-group">
          <label class="pkg-field-label">${isAr ? "نظام الصلاحية وتنبيهات الانتهاء:" : "Validity System & Expiry Alerts:"}</label>
          <select id="swalEditPkgExpiryType" class="pkg-field-input" onchange="
            const isT = (this.value === 'time');
            document.getElementById('swalEditTimeBox').style.display = isT ? 'block' : 'none';
            document.getElementById('swalEditSessBox').style.display = (this.value === 'sessions') ? 'block' : 'none';
          ">
            <option value="time" ${curExpiry==='time'?'selected':''}>${isAr ? "بالمدة الزمنية (من تاريخ إلى تاريخ)" : "By Duration (From Date to Date)"}</option>
            <option value="sessions" ${curExpiry==='sessions'?'selected':''}>${isAr ? "بعدد الحصص (مثال: 8 حصص)" : "By Session Count (e.g. 8 Sessions)"}</option>
          </select>
        </div>
        
        <!-- Duration Box -->
        <div id="swalEditTimeBox" style="display:${curExpiry==='time'?'block':'none'}; background:var(--bg-inset); padding:12px; border-radius:12px; border:1px solid var(--border);">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            ${isAr ? "المدة الزمنية للباقة:" : "Package Duration:"}
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "تاريخ البداية:" : "Start Date:"}</label>
              <input type="date" id="swalEditPkgStartDate" class="pkg-field-input" value="${curStart}">
            </div>
            <div class="pkg-field-group">
              <label class="pkg-field-label" style="font-size:0.78rem;">${isAr ? "تاريخ النهاية:" : "End Date:"}</label>
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
            <label class="pkg-field-label">${isAr ? "عدد الحصص المسموحة للمشترك:" : "Allowed Sessions for Subscriber:"}</label>
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
        dText.textContent = res ? res.text : (isAr ? "يرجى تحديد تاريخ البداية والنهاية" : "Please select start and end dates");
      };
      if (sInp) sInp.addEventListener('input', updateDurationLive);
      if (eInp) eInp.addEventListener('input', updateDurationLive);
    },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isAr ? 'حفظ التعديلات' : 'Save Changes',
    confirmButtonColor: '#2563eb',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel',
    preConfirm: () => {
      const newName = document.getElementById('swalEditPkgName').value.trim();
      const newSubject = document.getElementById('swalEditPkgSubject').value.trim();
      const newPrice = Number(document.getElementById('swalEditPkgPrice').value) || 0;
      const newExpiryType = document.getElementById('swalEditPkgExpiryType').value;
      const newStartDate = document.getElementById('swalEditPkgStartDate').value;
      const newEndDate = document.getElementById('swalEditPkgEndDate').value;
      const newSessions = Number(document.getElementById('swalEditPkgSessions').value) || 0;

      if (!newName) {
        Swal.showValidationMessage(isAr ? 'يرجى إدخال اسم الباقة' : 'Please enter package name');
        return false;
      }
      if (!newSubject) {
        Swal.showValidationMessage(isAr ? 'يرجى إدخال المادة الدراسية' : 'Please enter subject');
        return false;
      }
      if (newExpiryType === 'time' && (!newStartDate || !newEndDate)) {
        Swal.showValidationMessage(isAr ? 'يرجى تحديد تاريخ البداية وتاريخ النهاية' : 'Please select start and end dates');
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

      showToast(isAr ? "تم تحديث الباقة بنجاح وحفظها سحابياً" : "Package updated and synced successfully", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "فشل تحديث الباقة" : "Failed to update package", "err");
    }
  }
};

window.adminDeletePackage = async function(encodedName) {
  const name = decodeURIComponent(encodedName);
  const isAr = (currentLang === "ar");
  const enrolledCount = Object.values(students || {}).filter(st => st && Array.isArray(st.packages) && st.packages.includes(name)).length;

  let warningMsg = isAr 
    ? `هل أنت متأكد تماماً من حذف باقة "${name}" من النظام نهائياً؟` 
    : `Are you sure you want to permanently delete package "${name}" from the system?`;
  if (enrolledCount > 0) {
    warningMsg += isAr 
      ? `\n\nتنبيه: يوجد (${enrolledCount}) طالب مسجلين في هذه الباقة، سيتم فك ارتباطهم بها تلقائياً.`
      : `\n\nNotice: (${enrolledCount}) students are currently enrolled in this package. They will be unlinked automatically.`;
  }

  const { isConfirmed } = await Swal.fire({
    title: isAr ? 'تأكيد حذف الباقة' : 'Confirm Package Deletion',
    text: warningMsg,
    icon: enrolledCount > 0 ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'نعم، احذف نهائياً' : 'Yes, Delete Permanently',
    confirmButtonColor: '#ef4444',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
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

      showToast(isAr ? "تم حذف الباقة نهائياً من السحابة والنظام" : "Package permanently deleted from cloud and system", "success");
      window.renderAdminPackages();
      if (typeof window.renderTermTable === 'function') window.renderTermTable();
    } catch(e) {
      console.error(e);
      showToast(isAr ? "فشل حذف الباقة" : "Failed to delete package", "err");
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
              ${isWithdrawal ? (isAr ? 'تسجيل مسحوبات شخصية للمستر' : 'Record Owner Withdrawal') : (isAr ? 'تسجيل مصروف تشغيلي للسنتر' : 'Record Center Expense')}
            </h3>
            <p class="swal-expense-subtitle" id="swalHeaderSubtitle">
              ${isWithdrawal ? (isAr ? 'توثيق السحوبات والأرباح الخاصة فورياً من الخزائن' : 'Document center withdrawals directly from vaults') : (isAr ? 'توثيق فواتير ومصروفات التشغيل الميدانية وخصمها من الخزائن' : 'Track daily operational expenses and update vault balances')}
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
              <span class="card-label">${isAr ? 'مصروف سنتر' : 'Center Expense'}</span>
              <span class="card-desc">${isAr ? 'فواتير، إيجار، صيانة، طباعة مذكرات' : 'Bills, rent, printing, maintenance'}</span>
            </div>
            <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
          </div>

          <div class="swal-type-card is-wth ${isWithdrawal ? 'active-withdrawal' : ''}" id="cardTypeWithdrawal">
            <input type="radio" name="swalTxType" value="withdrawal" ${isWithdrawal ? 'checked' : ''}>
            <div class="card-icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <div class="card-texts">
              <span class="card-label">${isAr ? 'مسحوبات المستر' : 'Owner Withdrawal'}</span>
              <span class="card-desc">${isAr ? 'أرباح شخصية وسحوبات خاصة' : 'Personal profits & drawings'}</span>
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
              <span>${isAr ? 'المبلغ المطلوب' : 'Amount'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="number" id="swalAmtInp" class="swal-custom-input" placeholder="0" min="1" step="any">
              <span class="swal-input-badge">${isAr ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>

          <!-- Col 2: Date -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalDateInp">
              <i class="fa-regular fa-calendar" style="color: var(--primary);"></i>
              <span>${isAr ? 'تاريخ العملية' : 'Transaction Date'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="date" id="swalDateInp" class="swal-custom-input" value="${nowDateStr()}">
            </div>
          </div>

          <!-- Col 1 (Row 2): Reason / Purpose -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalReasonInp">
              <i class="fa-solid fa-file-pen" style="color: var(--primary);"></i>
              <span>${isAr ? 'البيان / سبب الصرف أو السحب' : 'Reason / Purpose'}</span>
            </label>
            <div class="swal-input-wrapper">
              <input type="text" id="swalReasonInp" class="swal-custom-input" placeholder="${isWithdrawal ? (isAr ? 'مثال: سحب أرباح شخصية للمستر' : 'e.g. Owner profit withdrawal') : (isAr ? 'مثال: فواتير كهرباء / طباعة مذكرات' : 'e.g. Electricity bill, paper printing')}">
            </div>
          </div>

          <!-- Col 2 (Row 2): Vault Selection -->
          <div class="swal-field-group">
            <label class="swal-field-label" for="swalMethodInp">
              <i class="fa-solid fa-vault" style="color: var(--primary);"></i>
              <span>${isAr ? 'الخزينة المسحوب منها' : 'Source Vault'}</span>
            </label>
            <div class="swal-input-wrapper">
              <select id="swalMethodInp" class="swal-custom-select">
                <option value="cash">${isAr ? 'درج الكاش (الخزينة النقدية)' : 'Cash Drawer (Vault)'}</option>
                <option value="wallet">${isAr ? 'محفظة فودافون كاش (المحافظ الإلكترونية)' : 'Vodafone Cash (E-Wallet)'}</option>
                <option value="instapay">${isAr ? 'حساب إنستاباي (InstaPay)' : 'InstaPay Account'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: `<i class="fa-solid fa-check"></i> ${isAr ? "حفظ وتوثيق الحركة" : "Save Transaction"}`,
    cancelButtonText: `<i class="fa-solid fa-xmark"></i> ${isAr ? "إلغاء" : "Cancel"}`,
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
          if (headerTitle) headerTitle.textContent = isAr ? 'تسجيل مصروف تشغيلي للسنتر' : 'Record Center Expense';
          if (headerSubtitle) headerSubtitle.textContent = isAr ? 'توثيق فواتير ومصروفات التشغيل الميدانية وخصمها من الخزائن' : 'Track daily operational expenses and update vault balances';
          if (reasonInp) reasonInp.placeholder = isAr ? 'مثال: فواتير كهرباء / طباعة مذكرات' : 'e.g. Electricity bill, paper printing';
        } else {
          if (radWth) radWth.checked = true;
          if (radExp) radExp.checked = false;
          cardWth?.classList.add('active-withdrawal');
          cardExp?.classList.remove('active-expense');
          if (headerIcon) {
            headerIcon.className = 'swal-expense-icon is-withdrawal';
            headerIcon.innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i>';
          }
          if (headerTitle) headerTitle.textContent = isAr ? 'تسجيل مسحوبات شخصية للمستر' : 'Record Owner Withdrawal';
          if (headerSubtitle) headerSubtitle.textContent = isAr ? 'توثيق السحوبات والأرباح الخاصة فورياً من الخزائن' : 'Document center withdrawals directly from vaults';
          if (reasonInp) reasonInp.placeholder = isAr ? 'مثال: سحب أرباح شخصية للمستر' : 'e.g. Owner profit withdrawal';
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
        Swal.showValidationMessage(isAr ? "يرجى إدخال مبلغ صحيح أكبر من صفر" : "Please enter a valid amount");
        return false;
      }
      if (!reason) {
        Swal.showValidationMessage(isAr ? "يرجى كتابة سبب أو بيان العملية" : "Please enter the reason/purpose");
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
    showToast(isAr ? "تم حفظ وتوثيق الحركة بنجاح" : "Transaction saved successfully", "success");
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    if (typeof window.loadDailyReport === 'function') window.loadDailyReport(date);
  } catch(e) {
    console.error("saveTransactionRecord Error:", e);
    showToast(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving transaction", "err");
  }
};

window.deleteTermTransaction = async function(rawId) {
  // ⚠️ DISABLED: Expense/Withdrawal deletion is permanently locked for accountability.
  console.warn('[SECURITY] deleteTermTransaction is disabled — financial records cannot be deleted.');
  return;
  const isAr = (currentLang === "ar");
  const result = await Swal.fire({
    title: isAr ? "تأكيد حذف الحركة" : "Confirm Deletion",
    text: isAr ? "هل أنت متأكد من حذف هذه المعاملة؟ سيتم استرجاع الرصيد وتحديث الخزائن فورياً." : "Are you sure you want to delete this transaction? Vault balances will update immediately.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: isAr ? "نعم، حذف الآن" : "Yes, delete",
    cancelButtonText: isAr ? "إلغاء" : "Cancel",
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
    showToast(isAr ? "تم حذف الحركة وتحديث الخزائن" : "Transaction deleted and vaults updated", "success");
    if (typeof window.renderTermTable === 'function') window.renderTermTable();
    const dInput = document.getElementById("adminDailyDateInput");
    if (typeof window.loadDailyReport === 'function') window.loadDailyReport(dInput ? dInput.value : nowDateStr());
  } catch(e) {
    console.error("deleteTermTransaction Error:", e);
    showToast(isAr ? "فشل حذف الحركة" : "Failed to delete transaction", "err");
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
    container.innerHTML = `<div style="color:var(--text-secondary); text-align:center; padding:20px;">${isAr ? "لا توجد دروس مسجلة في خطة المنهج حتى الآن." : "No lessons registered in the syllabus roadmap yet."}</div>`;
    return;
  }

  let html = "";
  syllabusList.forEach((s, idx) => {
    let statusBadge = isAr ? "لم يبدأ" : "Not Started";
    let badgeColor = "var(--text-secondary)";
    if (s.status === "completed") { statusBadge = isAr ? "تم الانتهاء" : "Completed"; badgeColor = "var(--success)"; }
    else if (s.status === "in_progress") { statusBadge = isAr ? "جاري الشرح" : "In Progress"; badgeColor = "var(--warning)"; }

    html += `
      <div class="syllabus-item-card ${s.status}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1.05em;">${s.title || s.name}</div>
          <span style="font-size:0.82em; color:${badgeColor}; font-weight:700;">${statusBadge}</span>
          ${s.notes ? `<p style="font-size:0.82em; color:var(--text-secondary); margin-top:4px;">${isAr ? 'ملاحظات:' : 'Notes:'} ${s.notes}</p>` : ''}
        </div>
        <button class="btn danger smallBtn" onclick="window.deleteSyllabusLesson(${idx})" title="${isAr ? 'حذف الدرس' : 'Delete Lesson'}">
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
    if (permChannel) {
      try { permChannel.postMessage({ type: 'SYLLABUS_UPDATED' }); } catch(e) {}
    }
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
    if (permChannel) {
      try { permChannel.postMessage({ type: 'SYLLABUS_UPDATED' }); } catch(e) {}
    }
    showToast("تم حذف الدرس من المنهج", "info");
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

// ========================================================
// 11. ADVANCED SETTINGS & BACKUP
// ========================================================
window.exportAllDataToExcel = async function() {
  const isAr = (currentLang === "ar");
  if (typeof XLSX === 'undefined') {
    showToast(isAr ? "مكتبة Excel غير متوفرة" : "Excel library not loaded", "err");
    return;
  }

  showToast(isAr ? "جاري تجميع وقراءة كافة بيانات قاعدة البيانات من السيرفر..." : "Exporting full database from server...", "info");

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
    // SHEET 1: الطلاب (Students)
    // ==========================================
    const studentsSheet = [
      [
        "كود الطالب",
        "اسم الطالب",
        "الصف / المجموعة",
        "رقم الهاتف",
        "هاتف ولي الأمر",
        "المبلغ المدفوع",
        "قيمة الخصم",
        "نظام الدفع",
        "الباقات المسجلة",
        "الرتبة",
        "الحالة",
        "تواريخ الحضور",
        "ملاحظات",
        "تاريخ الإنشاء"
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(studentsSheet), "الطلاب");

    // ==========================================
    // SHEET 2: الباقات والاشتراكات (Packages)
    // ==========================================
    const packagesSheet = [
      [
        "اسم الباقة",
        "المادة",
        "السعر الأساسي",
        "سعر القسط",
        "يقبل أقساط",
        "الحد الأقصى للحصص",
        "تاريخ الإنشاء"
      ]
    ];
    pkgData.forEach(p => {
      packagesSheet.push([
        p.name || '',
        p.subject || '',
        Number(p.price) || 0,
        Number(p.installment_price || p.installmentPrice || p.price) || 0,
        (p.has_installments || p.hasInstallments) ? 'نعم' : 'لا',
        Number(p.session_limit || p.sessionLimit) || 8,
        p.created_at || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(packagesSheet), "الباقات");

    // ==========================================
    // SHEET 3: المذكرات والمخزن (Booklets)
    // ==========================================
    const bookletsSheet = [
      [
        "كود المذكرة",
        "اسم المذكرة",
        "الصف الدراسي",
        "سعر البيع",
        "تكلفة الطباعة",
        "الكمية المتاحة بالمخزن",
        "إجمالي المباع"
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bookletsSheet), "المذكرات");

    // ==========================================
    // SHEET 4: المساعدين والصلاحيات (Assistants)
    // ==========================================
    const assistantsSheet = [
      [
        "اسم المستخدم",
        "كلمة المرور",
        "البريد الإلكتروني",
        "الصلاحيات (JSON)",
        "تاريخ الإنشاء"
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assistantsSheet), "المساعدين");

    // ==========================================
    // SHEET 5: تحويلات الخزائن الحية (Vault Transfers)
    // ==========================================
    const vTransfers = Array.isArray(cfg.vault_transfers) ? cfg.vault_transfers : (vaultTransfers || []);
    const transfersSheet = [
      [
        "معرف التحويل",
        "التاريخ",
        "التوقيت",
        "من خزينة",
        "إلى خزينة",
        "المبلغ بالجنيه",
        "البيان / ملاحظات",
        "المسؤول"
      ]
    ];
    const vNames = { cash: 'درج الكاش', instapay: 'حساب إنستاباي', wallet: 'محفظة فودافون كاش' };
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(transfersSheet), "تحويلات الخزائن");

    // ==========================================
    // SHEET 6: المصروفات والمسحوبات (Expenses & Withdrawals)
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
        "معرف المعاملة",
        "التاريخ",
        "بند المصروف / السبب",
        "نوع المعاملة",
        "الخزينة المصروف منها",
        "المبلغ بالجنيه",
        "التفاصيل",
        "المسؤول / المستلم"
      ]
    ];
    expList.forEach(e => {
      expensesSheet.push([
        e.id || '',
        e.date || '',
        e.category || e.reason || e.text || '',
        e.type === 'withdrawal' ? 'محسوب للمستر (مسحوبات)' : 'مصروفات سنتر تشغيلية',
        vNames[e.vault] || e.vault || 'درج الكاش',
        Number(e.amount) || 0,
        e.note || '',
        e.created_by || ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expensesSheet), "المصروفات والمسحوبات");

    // ==========================================
    // SHEET 7: سجل الحضور واليوميات (Attendance & Daily)
    // ==========================================
    const allDates = new Set([
      ...Object.keys(cfg.revenue_by_date || revenueByDate || {}),
      ...Object.keys(cfg.att_by_date || attByDate || {}),
      ...Object.keys(cfg.daily_approval_map || dailyApprovalMap || {})
    ]);
    const dailySheet = [
      [
        "التاريخ",
        "إجمالي إيراد اليومية (ج)",
        "عدد الحضور اليومي",
        "حالة الشيفت والاعتماد",
        "تاريخ آخر اعتماد"
      ]
    ];
    Array.from(allDates).sort().reverse().forEach(d => {
      const rev = Number((cfg.revenue_by_date || revenueByDate || {})[d]) || 0;
      const attCount = Array.isArray((cfg.att_by_date || attByDate || {})[d]) ? (cfg.att_by_date || attByDate)[d].length : 0;
      const appInfo = (cfg.daily_approval_map || dailyApprovalMap || {})[d];
      const statusStr = appInfo ? (appInfo.status === 'approved' ? 'معتمد ومغلق' : 'معلق') : 'مفتوح';
      dailySheet.push([
        d,
        rev,
        attCount,
        statusStr,
        appInfo && appInfo.updated_at ? appInfo.updated_at : ''
      ]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dailySheet), "اليوميات والاعتمادات");

    // ==========================================
    // SHEET 8: إعدادات النظام والنسخ (System Config)
    // ==========================================
    const settingsSheet = [
      ["مفتاح الإعداد", "القيمة", "الوصف"],
      ["shift_system_enabled", cfg.shift_system_enabled !== false ? "مفعل (ON)" : "معطل (OFF)", "حالة ميزة نظام الشيفتات والاعتماد اليومي"],
      ["daily_shift_status", sRow.daily_shift_status || 'open', "الحالة العامة للشيفت اليومي"],
      ["backup_date", nowDateStr(), "تاريخ تصدير هذه النسخة الاحتياطية"],
      ["total_students", stData.length, "إجمالي عدد الطلاب المسجلين بالنسخة"],
      ["total_packages", pkgData.length, "إجمالي عدد الباقات المسجلة"],
      ["total_transfers", vTransfers.length, "إجمالي تحويلات الخزائن المسجلة"],
      ["total_expenses", expList.length, "إجمالي المصروفات والمسحوبات المسجلة"]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsSheet), "إعدادات النظام");

    // Download File
    const fileName = `Studify_Full_Database_Backup_${nowDateStr()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    showToast(isAr ? `تم تصدير قاعدة البيانات كاملة بنجاح (${stData.length} طالب، ${pkgData.length} باقة، ${vTransfers.length} تحويل)` : "Full database exported successfully", "success");
  } catch(e) {
    console.error("exportAllDataToExcel error:", e);
    showToast(isAr ? "فشل تصدير قاعدة البيانات الكاملة: " + e.message : "Export failed", "err");
  }
};

window.importDataFromExcel = async function(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    return showToast("مكتبة Excel غير متوفرة", "err");
  }

  const isAr = (currentLang === "ar");
  const confirmRes = await Swal.fire({
    title: isAr ? 'استيراد واسترجاع قاعدة البيانات من Excel' : 'Import Full Database from Excel',
    html: isAr 
      ? `<div style="text-align: right; line-height: 1.8;">
           <p style="font-weight: 700; margin-bottom: 8px;">هل تريد فحص واستيراد البيانات من هذا الملف؟</p>
           <p style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 6px;">سيقوم النظام بقراءة كافة الشيتات الموجودة بالملف:</p>
           <ul style="color: var(--text-secondary); font-size: 0.88em; padding-right: 20px; margin: 0;">
             <li>تحديث وإضافة الطلاب وبياناتهم المالية</li>
             <li>تحديث باقات واشتراكات السنتر</li>
             <li>استرجاع تحويلات الخزائن الحية</li>
             <li>استرجاع سجل المصروفات والمسحوبات</li>
             <li>استرجاع حسابات وصلاحيات المساعدين</li>
           </ul>
         </div>`
      : '<p>Merge and restore database tables from this workbook? Existing records will be updated and new ones added.</p>',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: isAr ? 'نعم، فحص واستيراد البيانات' : 'Yes, Import Data',
    confirmButtonColor: '#2563EB',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
  });

  if (!confirmRes.isConfirmed) {
    event.target.value = '';
    return;
  }

  try {
    showToast(isAr ? "جاري قراءة وتحليل ملف Excel..." : "Reading Excel file...", "info");
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
    const stSheetName = findSheet(['طلاب', 'student', 'Sheet1']);
    if (stSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[stSheetName]);
      const studentRowsToUpsert = [];

      rows.forEach(r => {
        const id = String(r['كود الطالب'] || r['كود'] || r['id'] || r['ID'] || r['Code'] || '').trim();
        const name = String(r['اسم الطالب'] || r['الاسم'] || r['name'] || r['Name'] || '').trim();
        if (!id && !name) return;

        const studentId = id || String(Date.now() + Math.floor(Math.random() * 1000));
        const phone = String(r['رقم الهاتف'] || r['الموبايل'] || r['الهاتف'] || r['phone'] || r['Phone'] || '').trim();
        const parentPhone = String(r['هاتف ولي الأمر'] || r['ولي الأمر'] || r['parentPhone'] || r['parent_phone'] || '').trim();
        const className = String(r['الصف / المجموعة'] || r['المجموعة'] || r['الصف'] || r['className'] || r['class_name'] || '').trim();
        const paid = Number(r['المبلغ المدفوع'] || r['المدفوع'] || r['paid'] || 0) || 0;
        const discount = Number(r['قيمة الخصم'] || r['الخصم'] || r['discount'] || 0) || 0;
        const paymentPlan = String(r['نظام الدفع'] || r['payment_plan'] || r['paymentPlan'] || 'cash').trim();
        const status = String(r['الحالة'] || r['status'] || 'active').trim();
        const notes = String(r['ملاحظات'] || r['notes'] || '').trim();

        // Packages parsing
        const rawPkgs = r['الباقات المسجلة'] || r['الباقات'] || r['packages'] || '';
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
          status: status === 'محذوف' || status === 'deleted' ? 'deleted' : 'active',
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
    const pkgSheetName = findSheet(['باقات', 'package']);
    if (pkgSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[pkgSheetName]);
      const pkgRowsToUpsert = [];
      rows.forEach(r => {
        const name = String(r['اسم الباقة'] || r['الاسم'] || r['name'] || '').trim();
        if (!name) return;
        const subject = String(r['المادة'] || r['subject'] || name).trim();
        const price = Number(r['السعر الأساسي'] || r['السعر'] || r['price'] || 0) || 0;
        const instPrice = Number(r['سعر القسط'] || r['installment_price'] || price) || price;
        const hasInst = String(r['يقبل أقساط'] || r['has_installments'] || '').includes('نعم') || r['has_installments'] === true;
        const sessionLimit = Number(r['الحد الأقصى للحصص'] || r['session_limit'] || 8) || 8;

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
    const asstSheetName = findSheet(['مساعدين', 'assistant']);
    if (asstSheetName) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[asstSheetName]);
      const asstRowsToUpsert = [];
      rows.forEach(r => {
        const username = String(r['اسم المستخدم'] || r['username'] || '').trim();
        if (!username) return;
        const password = String(r['كلمة المرور'] || r['password'] || '123456').trim();
        const email = String(r['البريد الإلكتروني'] || r['email'] || `${username}@studify.com`).trim();
        let permissions = {};
        try {
          const rawPerm = r['الصلاحيات (JSON)'] || r['الصلاحيات'] || r['permissions'];
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
    const transSheetName = findSheet(['تحويلات', 'transfer']);
    const expSheetName = findSheet(['مصروفات', 'مسحوبات', 'expense']);
    
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
            const id = String(r['معرف التحويل'] || r['id'] || `vt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`).trim();
            if (existingIds.has(id)) return;

            const fromVRaw = String(r['من خزينة'] || r['from_vault'] || '').toLowerCase();
            const toVRaw = String(r['إلى خزينة'] || r['to_vault'] || '').toLowerCase();
            const fromV = fromVRaw.includes('إنستا') || fromVRaw.includes('insta') ? 'instapay' : (fromVRaw.includes('فودافون') || fromVRaw.includes('wallet') ? 'wallet' : 'cash');
            const toV = toVRaw.includes('إنستا') || toVRaw.includes('insta') ? 'instapay' : (toVRaw.includes('فودافون') || toVRaw.includes('wallet') ? 'wallet' : 'cash');
            const amount = Number(r['المبلغ بالجنيه'] || r['المبلغ'] || r['amount'] || 0) || 0;
            if (amount <= 0) return;

            existingTransfers.push({
              id,
              date: String(r['التاريخ'] || r['date'] || nowDateStr()),
              timestamp: String(r['التوقيت'] || r['timestamp'] || ''),
              from_vault: fromV,
              to_vault: toV,
              amount,
              note: String(r['البيان / ملاحظات'] || r['البيان'] || r['note'] || ''),
              created_by: String(r['المسؤول'] || r['created_by'] || 'Admin')
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
            const id = String(r['معرف المعاملة'] || r['id'] || `tx_${Date.now()}_${Math.random().toString(36).slice(2,6)}`).trim();
            if (existingIds.has(id)) return;

            const vRaw = String(r['الخزينة المصروف منها'] || r['vault'] || '').toLowerCase();
            const vault = vRaw.includes('إنستا') || vRaw.includes('insta') ? 'instapay' : (vRaw.includes('فودافون') || vRaw.includes('wallet') ? 'wallet' : 'cash');
            const typeRaw = String(r['نوع المعاملة'] || r['type'] || '').toLowerCase();
            const type = typeRaw.includes('مستر') || typeRaw.includes('مسحوبات') || typeRaw.includes('withdrawal') ? 'withdrawal' : 'expense';
            const amount = Number(r['المبلغ بالجنيه'] || r['المبلغ'] || r['amount'] || 0) || 0;
            if (amount <= 0) return;

            existingExpenses.push({
              id,
              date: String(r['التاريخ'] || r['date'] || nowDateStr()),
              category: String(r['بند المصروف / السبب'] || r['category'] || r['reason'] || ''),
              type,
              vault,
              amount,
              note: String(r['التفاصيل'] || r['note'] || ''),
              created_by: String(r['المسؤول / المستلم'] || r['created_by'] || 'Admin')
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
      title: isAr ? 'تم استيراد قاعدة البيانات بنجاح' : 'Database Imported Successfully',
      html: isAr 
        ? `<div style="text-align: right; line-height: 1.8;">
             <p style="color: var(--success); font-weight: 700; font-size: 1.1em; margin-bottom: 12px;"><i class="fa-solid fa-circle-check"></i> اكتملت عملية الاستيراد والمزامنة مع السيرفر:</p>
             <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95em;">
               <li style="padding: 4px 0;"><i class="fa-solid fa-user-graduate" style="color:var(--primary); width:20px;"></i> الطلاب: <b>${importedStudents}</b> طالب</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-box-open" style="color:#10b981; width:20px;"></i> الباقات: <b>${importedPackages}</b> باقة</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-users-gear" style="color:#6366f1; width:20px;"></i> المساعدين: <b>${importedAssistants}</b> مساعد</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-money-bill-transfer" style="color:#8b5cf6; width:20px;"></i> تحويلات الخزائن: <b>${importedTransfers}</b> تحويل</li>
               <li style="padding: 4px 0;"><i class="fa-solid fa-receipt" style="color:#f59e0b; width:20px;"></i> المصروفات والمسحوبات: <b>${importedExpenses}</b> معاملة</li>
             </ul>
           </div>`
        : `<p>Successfully imported: ${importedStudents} students, ${importedPackages} packages, ${importedTransfers} transfers, ${importedExpenses} expenses.</p>`,
      icon: 'success',
      confirmButtonText: isAr ? 'تم' : 'OK',
      confirmButtonColor: '#10B981'
    });

  } catch(err) {
    console.error("Excel import error:", err);
    showToast(isAr ? "حدث خطأ أثناء استيراد الملف: " + err.message : "Import failed", "err");
  } finally {
    event.target.value = '';
  }
};

window.resetTermData = async function() {
  const isAr = (currentLang === "ar");
  const res = await Swal.fire({
    title: isAr ? 'تأكيد تصفير الترم' : 'Confirm Term Reset',
    text: isAr ? 'هل أنت متأكد من تصفير حضور ومصاريف وإيرادات الترم بالكامل لجميع الطلاب؟ لا يمكن التراجع عن هذه الخطوة إلا بنسخة احتياطية.' : 'Are you sure you want to reset attendance, fees, and revenue for the whole term? This action cannot be undone without a backup.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: isAr ? 'نعم، صفر بيانات الترم' : 'Yes, Reset Term',
    confirmButtonColor: '#EF4444',
    cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
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
  const isAr = (currentLang === "ar");
  pill.className = 'sub-status-pill';
  if (!SUBSCRIPTION.loaded) { pill.textContent = ''; return; }
  if (!SUBSCRIPTION.isActive) {
    pill.classList.add('expired'); pill.textContent = isAr ? 'منتهي' : 'Expired';
  } else if (SUBSCRIPTION.daysLeft <= 10) {
    pill.classList.add('warning'); pill.textContent = isAr ? (SUBSCRIPTION.daysLeft + ' يوم') : (SUBSCRIPTION.daysLeft + ' Days');
  } else {
    pill.classList.add('active'); pill.textContent = isAr ? 'نشط' : 'Active';
  }
}

export function checkStudentLimit() {
  if (!SUBSCRIPTION.loaded) return true;
  const sessCount = (typeof window.getAdminUniqueSessionStudentsCount === 'function') ? window.getAdminUniqueSessionStudentsCount() : 0;
  const count = Object.keys(students).length + sessCount;
  if (count >= SUBSCRIPTION.maxStudents) {
    Swal.fire({
      icon: 'warning',
      title: 'تم الوصول للحد الأقصى للطلاب',
      html: `<p style="color:var(--text-secondary);margin-bottom:12px">باقتك الحالية تسمح بحد أقصى <b>${SUBSCRIPTION.maxStudents} طالب</b>.<br>لديك حالياً <b>${count} طالب</b> مسجل (بما فيهم طلاب الحصة).</p><p style="font-size:.88em;color:#F59E0B"><i class="fa-solid fa-crown"></i> يرجى ترقية باقة الاشتراك لإضافة المزيد من الطلاب.</p>`,
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
  const isAr = (currentLang === "ar");

  if (!SUBSCRIPTION.loaded) {
    card.innerHTML = `<div class="sub-plan-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${isAr ? "جاري تحميل بيانات الاشتراك..." : "Loading subscription details..."}</div>`;
    setTimeout(() => { if (SUBSCRIPTION.loaded) window.renderSubscriptionView(); }, 1500);
    return;
  }

  const { isActive, daysLeft, totalDays, planName, startDate, endDate,
          maxStudents, maxAssistants, currentAssistants, planKey } = SUBSCRIPTION;
  const progress = Math.max(0, Math.min(100, Math.round((daysLeft / totalDays) * 100)));
  const statusClass = isActive ? (daysLeft <= 10 ? 'warning' : 'active') : 'expired';
  const statusIcon  = isActive ? (daysLeft <= 10 ? 'fa-clock' : 'fa-circle-check') : 'fa-circle-xmark';
  const statusText  = isActive ? (daysLeft <= 10 ? (isAr ? `ينتهي خلال ${daysLeft} يوم` : `Expires in ${daysLeft} Days`) : (isAr ? 'نشط' : 'Active')) : (isAr ? 'منتهي' : 'Expired');
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

  const dateFromLbl = isAr ? "من" : "From";
  const dateToLbl = isAr ? "حتى" : "Until";
  const studentLbl = isAr ? "طالب" : "Students";
  const assistantLbl = isAr ? "مساعد" : "Assistants";
  const progressTitle = isAr ? "استهلاك مدة الاشتراك" : "Subscription Duration Used";
  const progressSub = isAr ? `${daysLeft} يوم متبقي من ${totalDays}` : `${daysLeft} days remaining of ${totalDays}`;
  const countdownLbl = isAr ? "يوم متبقي" : "Days Left";

  card.innerHTML = `
    <div class="sub-current-inner">
      <div class="sub-current-info">
        <div class="sub-current-badge ${statusClass}">
          <i class="fa-solid ${statusIcon}"></i> ${statusText}
        </div>
        <div class="sub-current-plan-name">${localizedPlanName}</div>
        <div class="sub-current-date-row">
          <i class="fa-solid fa-calendar-check" style="color:var(--primary)"></i>
          ${dateFromLbl} <b>${startDate || '—'}</b> &nbsp;${dateToLbl}&nbsp; <b>${endDate || '—'}</b>
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
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isAr ? "باقتك الحالية" : "Your Current Plan"}`;
      btn.onclick = null;
    }
  }
};

window.contactForRenewal = function(planKey) {
  const isAr = (currentLang === "ar");
  const names = {
    monthly:     isAr ? 'الخطة المرنة (1,999 ج/شهر)' : 'Flexible Plan (1,999 EGP/month)',
    quarterly:   isAr ? 'الخطة المريحة (5,399 ج/3 شهور بدلاً من 6,000 ج)' : 'Comfort Plan (5,399 EGP/3 months instead of 6,000 EGP)',
    semi_annual: isAr ? 'الخطة الذهبية (7,999 ج/ترم كامل بدلاً من 10,000 ج)' : 'Golden Plan (7,999 EGP/full term instead of 10,000 EGP)'
  };
  const title = isAr ? 'تجديد / ترقية الاشتراك' : 'Renew / Upgrade Subscription';
  const desc = isAr 
    ? `لتفعيل <b>${names[planKey] || planKey}</b>،<br>تواصل مع فريق الدعم الفني وسيتم التفعيل فوراً.`
    : `To activate <b>${names[planKey] || planKey}</b>,<br>contact our technical support team for immediate activation.`;
  const waText = isAr ? 'تواصل مع الدعم الفني عبر الواتساب' : 'Contact Technical Support via WhatsApp';
  const okText = isAr ? 'حسناً' : 'OK';

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

// --- 1. VAULT TRANSFERS (التحويل المالي بين الخزائن) ---
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
    document.getElementById("transFromAvailBal").textContent = currFromBal.toLocaleString() + " ج";
  }
  if (document.getElementById("transToCurrBal")) {
    if (currToBal < 0) {
      document.getElementById("transToCurrBal").innerHTML = `<span style="color:#ef4444; direction:ltr; unicode-bidi:embed;">-${Math.abs(currToBal).toLocaleString()} ج</span> <span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-size:0.7em; font-weight:700;">عجز</span>`;
    } else {
      document.getElementById("transToCurrBal").textContent = currToBal.toLocaleString() + " ج";
    }
  }

  // Dynamic Cover Deficit button badge
  const btnDeficit = document.getElementById("btnCoverDeficit");
  if (btnDeficit) {
    const isAr = (currentLang === "ar");
    if (currToBal < 0) {
      const deficitAmt = Math.abs(currToBal);
      btnDeficit.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${isAr ? 'تغطية العجز (' + deficitAmt.toLocaleString() + ' ج)' : 'Cover Deficit (' + deficitAmt.toLocaleString() + ')'}`;
      btnDeficit.style.background = "rgba(37, 99, 235, 0.15)";
      btnDeficit.style.color = "var(--primary)";
      btnDeficit.style.borderColor = "var(--primary)";
      btnDeficit.style.fontWeight = "800";
    } else {
      btnDeficit.innerHTML = isAr ? 'تغطية العجز' : 'Cover Deficit';
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
    fromAfterEl.textContent = afterFrom.toLocaleString() + " ج";
    fromAfterEl.style.color = afterFrom < 0 ? "var(--danger)" : "var(--text-primary)";
  }
  if (toAfterEl) {
    toAfterEl.textContent = afterTo.toLocaleString() + " ج";
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
        window.showNotification(currentLang === 'ar' ? "الخزينة المحددة ليس بها عجز حالياً" : "Selected vault has no deficit", "info");
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
    showToast(isAr ? "لا يمكن التحويل لنفس الخزينة" : "Cannot transfer to the same vault", "warning");
    return;
  }

  if (amt <= 0) {
    showToast(isAr ? "يرجى إدخال مبلغ تحويل صحيح أكبر من صفر" : "Please enter a valid transfer amount", "warning");
    return;
  }

  const vNames = {
    cash: isAr ? "درج الكاش" : "Cash Drawer",
    instapay: isAr ? "حساب إنستاباي" : "InstaPay",
    wallet: isAr ? "محفظة فودافون كاش" : "Vodafone Cash"
  };

  const newTransfer = {
    id: 'vt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    date: nowDateStr(),
    timestamp: new Date().toLocaleTimeString(),
    from_vault: fromV,
    to_vault: toV,
    amount: amt,
    note: note || (isAr ? `تحويل من ${vNames[fromV]} إلى ${vNames[toV]}` : `Transfer from ${vNames[fromV]} to ${vNames[toV]}`),
    created_by: isAr ? "الإدارة" : "Admin"
  };

  if (!Array.isArray(vaultTransfers)) vaultTransfers = [];
  vaultTransfers.push(newTransfer);

  try {
    await saveCenterConfig({ vault_transfers: vaultTransfers });
    showToast(isAr ? `تم تحويل ${amt} ج بنجاح من ${vNames[fromV]} إلى ${vNames[toV]}` : `Transferred ${amt} EGP successfully`, "success");
    window.closeVaultTransferModal();
    if (typeof window.renderTermTable === "function") window.renderTermTable();
  } catch(e) {
    console.error("submitVaultTransfer error:", e);
    showToast(isAr ? "حدث خطأ أثناء حفظ التحويل" : "Error saving transfer", "err");
  }
};

window.openVaultTransfersHistoryModal = function() {
  const modal = document.getElementById("vaultTransfersHistoryModal");
  const tbody = document.getElementById("vaultTransfersHistoryTbody");
  if (!modal || !tbody) return;

  const isAr = (currentLang === "ar");
  const vNames = {
    cash: isAr ? "درج الكاش" : "Cash Drawer",
    instapay: isAr ? "حساب إنستاباي" : "InstaPay",
    wallet: isAr ? "محفظة فودافون كاش" : "Vodafone Cash"
  };

  const list = Array.isArray(vaultTransfers) ? [...vaultTransfers].reverse() : [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا توجد حركات تحويل سابقة بين الخزائن" : "No transfer history found"}</td></tr>`;
  } else {
    tbody.innerHTML = list.map((t, idx) => {
      return `
        <tr>
          <td style="font-weight:600;">${t.date} <span style="font-size:0.85em; color:var(--text-secondary);">${t.timestamp || ""}</span></td>
          <td><span class="badge" style="background:rgba(239,68,68,0.1); color:#ef4444; font-weight:700;">${vNames[t.from_vault] || t.from_vault}</span></td>
          <td><span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; font-weight:700;">${vNames[t.to_vault] || t.to_vault}</span></td>
          <td style="font-weight:800; color:var(--primary); font-size:1.05em;">${t.amount} ج</td>
          <td style="color:var(--text-secondary); font-weight:600;">${t.note || "—"}</td>
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
    title: isAr ? "تأكيد إلغاء التحويل" : "Confirm Revert",
    text: isAr ? "هل أنت متأكد من حذف حركة التحويل واسترجاع الأرصدة إلى وضعها السابق؟" : "Revert this transfer and restore vault balances?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: isAr ? "نعم، إلغاء التحويل" : "Yes, Revert",
    cancelButtonText: isAr ? "تراجع" : "Cancel",
    confirmButtonColor: "#ef4444"
  });

  if (!res.isConfirmed) return;

  const idx = vaultTransfers.findIndex(t => t.id === id);
  if (idx !== -1) {
    vaultTransfers.splice(idx, 1);
    try {
      await saveCenterConfig({ vault_transfers: vaultTransfers });
      showToast(isAr ? "تم حذف حركة التحويل واسترجاع الأرصدة بنجاح" : "Transfer reverted", "success");
      window.openVaultTransfersHistoryModal();
      if (typeof window.renderTermTable === "function") window.renderTermTable();
    } catch(e) {
      console.error("deleteVaultTransfer error:", e);
      showToast(isAr ? "حدث خطأ أثناء الحذف" : "Error deleting transfer", "err");
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

  if (document.getElementById("expModalTotal")) document.getElementById("expModalTotal").textContent = total.toLocaleString() + " ج";
  if (document.getElementById("expModalCash")) document.getElementById("expModalCash").textContent = cash.toLocaleString() + " ج";
  if (document.getElementById("expModalInstapay")) document.getElementById("expModalInstapay").textContent = instapay.toLocaleString() + " ج";
  if (document.getElementById("expModalWallet")) document.getElementById("expModalWallet").textContent = wallet.toLocaleString() + " ج";

  const mBadges = {
    cash: { text: isAr ? "كاش (درج)" : "Cash", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
    instapay: { text: isAr ? "إنستاباي" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
    wallet: { text: isAr ? "فودافون كاش" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
  };

  if (!tbody) return;
  if (expItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا توجد مصروفات تشغيلية مسجلة في هذه الفترة" : "No expenses found for this period"}</td></tr>`;
  } else {
    tbody.innerHTML = expItems.map(e => {
      const mb = mBadges[e.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${e.date || "—"}</td>
          <td style="font-weight:800; color:#ef4444; font-size:1.05em;">${e.amount} ج</td>
          <td style="font-weight:600;">${e.reason || "مصروف سنتر"}</td>
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

  if (document.getElementById("wdModalTotal")) document.getElementById("wdModalTotal").textContent = total.toLocaleString() + " ج";
  if (document.getElementById("wdModalCash")) document.getElementById("wdModalCash").textContent = cash.toLocaleString() + " ج";
  if (document.getElementById("wdModalInstapay")) document.getElementById("wdModalInstapay").textContent = instapay.toLocaleString() + " ج";
  if (document.getElementById("wdModalWallet")) document.getElementById("wdModalWallet").textContent = wallet.toLocaleString() + " ج";

  const mBadges = {
    cash: { text: isAr ? "درج الكاش" : "Cash Drawer", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
    instapay: { text: isAr ? "حساب إنستاباي" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
    wallet: { text: isAr ? "محفظة فودافون كاش" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
  };

  if (!tbody) return;
  if (wdItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا توجد مسحوبات مسجلة في هذه الفترة" : "No withdrawals found for this period"}</td></tr>`;
  } else {
    tbody.innerHTML = wdItems.map(e => {
      const mb = mBadges[e.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${e.date || "—"}</td>
          <td style="font-weight:800; color:#f59e0b; font-size:1.05em;">${e.amount} ج</td>
          <td style="font-weight:600;">${e.reason || (isAr ? "مسحوبات شخصية" : "Withdrawal")} ${e.recipient ? `(${e.recipient})` : ""}</td>
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

  if (document.getElementById("discModalTotalAmt")) document.getElementById("discModalTotalAmt").textContent = totalDisc.toLocaleString() + " ج";
  if (document.getElementById("discModalCount")) document.getElementById("discModalCount").textContent = totalCount + (isAr ? " طالب" : " Students");

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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا يوجد طلاب حاصلين على خصومات تطابق البحث" : "No discounted students found"}</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map(s => {
      const cls = (s.className && s.className !== 'عام' && s.className !== 'General') ? s.className : (isAr ? "بدون باقة" : "No Package");
      const paid = Number(s.paid) || 0;
      const disc = Number(s.discount) || 0;
      const debt = Math.max(0, (Number(s.totalReq) || 0) - paid - disc);

      return `
        <tr>
          <td style="font-weight:700; color:var(--text-secondary);">#${s.id}</td>
          <td style="font-weight:800;">${s.name}</td>
          <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${cls}</span></td>
          <td style="font-weight:800; color:#06b6d4; font-size:1.05em;">${disc} ج</td>
          <td style="font-weight:700; color:#10b981;">${paid} ج</td>
          <td style="font-weight:700; color:${debt > 0 ? '#ef4444' : '#10b981'};">${debt > 0 ? debt + ' ج' : (isAr ? 'خالص' : 'Paid')}</td>
          <td>
            <a href="../assistant/index.html?openId=${s.id}" target="_blank" class="btn secondary smallBtn" style="padding:4px 10px; font-size:0.8em; text-decoration:none;">
              <i class="fa-solid fa-folder-open"></i> ${isAr ? "الملف" : "Profile"}
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
  const curr = isAr ? " ج" : " EGP";

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
          channel: isAr ? "اشتراك باقة" : "Package Subscription",
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
        channel: isAr ? "طالب حصة فورية" : "Session Student",
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
          source: (isAr ? "مبيعات مذكرة: " : "Booklet: ") + (b.name || ""),
          channel: isAr ? "مذكرات ومخزن" : "Booklet Inventory",
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
    document.getElementById("revFilterCountBadge").textContent = inFlowItems.length + (isAr ? " حركة" : " items");
  }

  // Render Table
  if (!tbody) return;
  if (inFlowItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-secondary);">${isAr ? "لا توجد حركات إيراد في هذه الفترة" : "No revenue records found"}</td></tr>`;
  } else {
    const mBadges = {
      cash: { text: isAr ? "كاش (درج)" : "Cash", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
      instapay: { text: isAr ? "إنستاباي" : "InstaPay", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
      wallet: { text: isAr ? "فودافون كاش" : "Vodafone Cash", bg: "rgba(239,68,68,0.12)", color: "#ef4444" }
    };

    tbody.innerHTML = inFlowItems.reverse().map(it => {
      const mb = mBadges[it.method] || mBadges.cash;
      return `
        <tr>
          <td style="font-weight:600;">${it.date}</td>
          <td style="font-weight:700;">${it.source}</td>
          <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${it.channel}</span></td>
          <td style="font-weight:800; color:#10b981; font-size:1.05em;">+${it.amount} ج</td>
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
  const normName = str => String(str || '').replace(/^باقة\s+/, '').trim().toLowerCase();

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
    ? st.packages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'بدون باقة' && p !== 'No Package') 
    : (cls && cls !== 'عام' && cls !== 'General' && cls !== 'بدون باقة' && cls !== 'No Package' ? [cls] : []);
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
// 6. DEBTS DETAILS MODAL (تفاصيل المتبقي والديون على الطلاب)
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
        className: (st.className && st.className !== 'عام' && st.className !== 'General') ? st.className : (isAr ? "بدون باقة" : "No Package"),
        phone: st.phone || "—",
        parentPhone: st.parentPhone || "—",
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
    document.getElementById("debtsModalTotal").textContent = totalDebtAmount.toLocaleString() + " ج";
  }
  if (document.getElementById("debtsModalCount")) {
    document.getElementById("debtsModalCount").textContent = debtors.length + (isAr ? " طالب" : " Students");
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-secondary); font-weight:600;">${isAr ? "لا توجد ديون مسجلة مطابقة للبحث" : "No debt records found"}</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(st => {
    return `
      <tr>
        <td style="font-weight:700; color:var(--text-secondary);">#${st.id}</td>
        <td style="font-weight:800; color:var(--text-primary);">${st.name}</td>
        <td><span class="badge" style="background:var(--bg-inset); color:var(--primary); font-weight:700;">${st.className}</span></td>
        <td style="font-weight:700;">${st.req} ج</td>
        <td style="font-weight:700; color:#10b981;">${st.paid} ج</td>
        <td style="font-weight:900; color:#ef4444; font-size:1.05em;">${st.debt} ج</td>
        <td>
          <a href="../assistant/index.html?openId=${st.id}" target="_blank" class="btn secondary smallBtn" style="padding:4px 10px; font-size:0.8em; text-decoration:none;" title="${isAr ? 'فتح ملف الطالب' : 'Open Profile'}">
            <i class="fa-solid fa-folder-open"></i>
          </a>
        </td>
      </tr>
    `;
  }).join("");
};


// ========================================================
// 7. VAULTS BREAKDOWN MODAL (تفاصيل صافي رصيد الخزائن المتاح)
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
  if (grandEl) grandEl.textContent = grandNet.toLocaleString() + " ج";

  // Cash Drawer
  if (document.getElementById("vaultsModalCashIn")) document.getElementById("vaultsModalCashIn").textContent = cashIn.toLocaleString() + " ج";
  if (document.getElementById("vaultsModalCashOut")) document.getElementById("vaultsModalCashOut").textContent = cashOut.toLocaleString() + " ج";
  const cashBalEl = document.getElementById("vaultsModalCashBal");
  if (cashBalEl) {
    cashBalEl.textContent = cashBal.toLocaleString() + " ج";
    cashBalEl.style.color = cashBal < 0 ? "#ef4444" : "#10b981";
  }

  // InstaPay
  if (document.getElementById("vaultsModalInstapayIn")) document.getElementById("vaultsModalInstapayIn").textContent = instapayIn.toLocaleString() + " ج";
  if (document.getElementById("vaultsModalInstapayOut")) document.getElementById("vaultsModalInstapayOut").textContent = instapayOut.toLocaleString() + " ج";
  const instapayBalEl = document.getElementById("vaultsModalInstapayBal");
  if (instapayBalEl) {
    if (instapayBal < 0) {
      instapayBalEl.innerHTML = `<span style="color:#ef4444; direction:ltr; unicode-bidi:embed;">-${Math.abs(instapayBal).toLocaleString()} ج</span> <span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-size:0.65em; font-weight:700; margin-inline-start:4px;">${isAr ? 'عجز مؤقت' : 'Deficit'}</span>`;
    } else {
      instapayBalEl.textContent = instapayBal.toLocaleString() + " ج";
      instapayBalEl.style.color = "#7c3aed";
    }
  }

  // Vodafone Cash Wallet
  if (document.getElementById("vaultsModalWalletIn")) document.getElementById("vaultsModalWalletIn").textContent = walletIn.toLocaleString() + " ج";
  if (document.getElementById("vaultsModalWalletOut")) document.getElementById("vaultsModalWalletOut").textContent = walletOut.toLocaleString() + " ج";
  const walletBalEl = document.getElementById("vaultsModalWalletBal");
  if (walletBalEl) {
    walletBalEl.textContent = walletBal.toLocaleString() + " ج";
    walletBalEl.style.color = walletBal < 0 ? "#ef4444" : "#ef4444";
  }

  modal.classList.remove("hidden");
};

window.closeVaultsBreakdownModal = function() {
  const modal = document.getElementById("vaultsBreakdownModal");
  if (modal) modal.classList.add("hidden");
};


// ========================================================
// 8. REGISTERED STUDENTS LIST MODAL (قائمة وبيانات الطلاب)
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
      if (s && s.className && s.className !== 'عام' && s.className !== 'Without Package') {
        classSet.add(s.className);
      }
    });
    filterSel.innerHTML = `<option value="">${isAr ? 'جميع المجموعات والصفوف' : 'All Classes'}</option>` + 
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
    const cls = (st.className && st.className !== 'عام' && st.className !== 'General') ? st.className : (isAr ? "بدون باقة" : "No Package");
    if (st.className && st.className !== 'عام' && st.className !== 'General' && st.className !== 'بدون باقة') {
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
      phone: st.phone || "—",
      parentPhone: st.parentPhone || "—",
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
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-secondary); font-weight:600;">${isAr ? "لا يوجد طلاب يطابقون خيارات البحث" : "No matching students found"}</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(st => {
    const statusBadge = st.debt > 0
      ? `<span class="badge" style="background:rgba(239,68,68,0.12); color:#ef4444; font-weight:700;">${isAr ? 'متبقي ' + st.debt + ' ج' : 'Debt ' + st.debt + ' EGP'}</span>`
      : `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">${isAr ? 'خالص' : 'Paid'}</span>`;

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
