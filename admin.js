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

// State
let students = {};
let packages = {};
let groupFees = {};
let attByDate = {};
let revenueByDate = {};
let expensesByDate = [];
let booklets = {};
let syllabusList = [];
let currentCenterId = localStorage.getItem("ca_manager_id") || "ahmedqutb11232_gmail_com";

// Permissions Definitions (All 11 permissions, grouped cleanly)
export const PERMISSIONS_DEFS = [
  { key: "show_revenue", label: "إظهار الإيراد اليومي", desc: "يعرض رقم إيراد الوردية الحالي في الشريط العلوي للمساعد", icon: "fa-wallet", group: "financial" },
  { key: "require_daily_approval", label: "تفعيل الاعتماد اليومي", desc: "يجعل الإيراد معلقاً ولا يُضاف للإجمالي حتى يعتمده المدير", icon: "fa-shield-halved", group: "financial" },
  { key: "can_request_discount", label: "طلب خصم / إعفاء", desc: "إظهار زر 'خصم' عند الدفع ليتمكن المساعد من طلب إعفاء", icon: "fa-tags", group: "financial" },
  
  { key: "can_add_student", label: "إضافة طالب جديد", desc: "يسمح بفتح كارت 'إضافة طالب جديد' وتسجيل البيانات", icon: "fa-user-plus", group: "data" },
  { key: "can_manage_packages", label: "إدارة الباقات والأسعار", desc: "إتاحة فتح صفحة إدارة الباقات والأسعار من القائمة الجانبية", icon: "fa-box-open", group: "data" },
  { key: "can_access_settings", label: "إعدادات النظام", desc: "السماح بفتح لوحة الإعدادات المتقدمة (نسخ احتياطي - تصفير - إلخ)", icon: "fa-gears", group: "data" },

  { key: "can_access_syllabus", label: "المنهج الدراسي", desc: "السماح بفتح وعرض خريطة سير المنهج من القائمة الجانبية", icon: "fa-book-open", group: "pages" },
  { key: "can_view_reports", label: "الوصول لصفحة التقارير", desc: "السماح للمساعد بفتح قسم الحسابات والتقارير", icon: "fa-chart-pie", group: "pages" },
  { key: "can_access_marketing", label: "أدوات التسويق", desc: "إتاحة فتح صفحة التسويق وإرسال رسائل للطلاب", icon: "fa-bullhorn", group: "pages" },
  { key: "can_access_session_students", label: "طلاب الحصة", desc: "السماح بعرض قائمة الحضور المخصصة للحصة الحالية", icon: "fa-clipboard-user", group: "pages" },
  { key: "can_access_booklets", label: "مخزون المذكرات", desc: "السماح بفتح جرد المذكرات وإدارة المبيعات", icon: "fa-book", group: "pages" }
];

const PERM_GROUPS = [
  { id: "financial", title: "<i class='fa-solid fa-money-bill-wave'></i> الصلاحيات المالية" },
  { id: "data", title: "<i class='fa-solid fa-server'></i> إدارة البيانات والنظام" },
  { id: "pages", title: "<i class='fa-solid fa-layer-group'></i> صلاحيات الصفحات والأدوات" }
];

// Helper: Toast
export function showToast(msg, type = "info") {
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  else if (type === "err") icon = "fa-circle-exclamation";
  else if (type === "warning") icon = "fa-triangle-exclamation";
  t.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.remove(); }, 3500);
}

// Helper: Date format
function nowDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

  const adminName = localStorage.getItem("ca_admin_username") || "المدير العام";
  const nameEl = document.getElementById("adminTopName");
  if (nameEl) nameEl.textContent = adminName;

  const today = nowDateStr();
  const dateInput = document.getElementById("adminDailyDateInput");
  if (dateInput && !dateInput.value) dateInput.value = today;
  if (typeof window.renderDailyApprovalWidget === 'function') {
    window.renderDailyApprovalWidget(today);
  }

  return true;
}

window.navigateWithTransition = function(url) {
  const card = document.querySelector('.admin-login-card');
  if (card) {
    card.classList.add('card-exit-transition');
  }
  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
  setTimeout(() => {
    window.location.href = url;
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

    showToast("تم تسجيل الدخول بنجاح! مرحباً بك.", "success");
    setTimeout(() => { location.reload(); }, 600);

  } catch(err) {
    console.error("Admin Login Error:", err);
    showToast(err.message || "حدث خطأ أثناء تسجيل الدخول", "err");
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول إلى لوحة الإدارة'; }
  }
};

window.handleAdminLogout = function() {
  Swal.fire({
    title: 'تسجيل الخروج من لوحة الإدارة',
    text: 'هل أنت متأكد من تسجيل الخروج؟',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'نعم، تسجيل الخروج',
    cancelButtonText: 'إلغاء'
  }).then((res) => {
    if (res.isConfirmed) {
      localStorage.removeItem("ca_admin_session");
      localStorage.removeItem("ca_admin_username");
      location.reload();
    }
  });
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
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("studify_admin_theme", next);
  localStorage.setItem("ca_theme", next);
  const icon = document.getElementById("adminThemeIcon");
  if (icon) icon.className = next === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
};

// ========================================================
// 2. DATA ENGINE: LOAD FROM SUPABASE & LOCAL CACHE
// ========================================================
async function loadAllAdminData() {
  if (!supabase) return;
  try {
    const mid = currentCenterId;

    const [stRes, pkgRes, bklRes, ctrRes] = await Promise.all([
      supabase.from('students').select('*').not('id', 'is', null),
      supabase.from('packages').select('*'),
      supabase.from('booklets').select('*').not('id', 'is', null),
      supabase.from('centers').select('*').eq('id', mid).maybeSingle()
    ]);

    // Students
    if (stRes.data) {
      students = {};
      stRes.data.forEach(s => {
        students[String(s.id)] = {
          id: s.id,
          name: s.name || '',
          className: s.class_name || s.className || '',
          phone: s.phone || '',
          parentPhone: s.parent_phone || s.parentPhone || '',
          paid: s.paid || 0,
          paymentPlan: s.payment_plan || s.paymentPlan || 'term',
          packages: s.packages || [],
          status: s.status || 'active'
        };
      });
    }

    // Packages
    if (pkgRes.data) {
      packages = {};
      groupFees = {};
      pkgRes.data.forEach(p => {
        packages[p.name] = {
          name: p.name,
          price: p.price,
          installmentPrice: p.installment_price || p.price,
          hasInstallments: !!p.has_installments
        };
        groupFees[p.name] = p.price;
      });
    }

    // Booklets
    if (bklRes.data) {
      booklets = {};
      bklRes.data.forEach(b => { booklets[b.id] = b; });
    }

    // Center Data (attendance, revenue, expenses, syllabus)
    if (ctrRes.data) {
      const c = ctrRes.data;
      attByDate = c.attendance_by_date || {};
      revenueByDate = c.revenue_by_date || {};
      expensesByDate = c.expenses_by_date || [];
      syllabusList = c.syllabus || [];
      dailyApprovalMap = c.daily_approval_status || {};
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
  }
}

// ========================================================
// 3. TAB NAVIGATION
// ========================================================
window.switchAdminTab = function(tabKey) {
  // Update Nav Items
  document.querySelectorAll(".admin-nav-item").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-view").forEach(v => v.classList.add("hidden"));

  const tabConfigs = {
    dailyReport: { view: "viewDailyReport", btn: "navBtnDailyReport", title: "التقرير اليومي والمراجعة", icon: "fa-calendar-day" },
    termReport: { view: "viewTermReport", btn: "navBtnTermReport", title: "تقرير الترم المالي وكشف الحسابات", icon: "fa-chart-line" },
    assistants: { view: "viewAssistants", btn: "navBtnAssistants", title: "إدارة المساعدين والتحكم بالصلاحيات", icon: "fa-user-shield" },
    decisions: { view: "viewDecisions", btn: "navBtnDecisions", title: "صندوق طلبات القرارات", icon: "fa-bell" },
    packages: { view: "viewPackages", btn: "navBtnPackages", title: "إدارة الباقات والمصاريف", icon: "fa-box-archive" },
    syllabus: { view: "viewSyllabus", btn: "navBtnSyllabus", title: "خريطة سير المنهج الدراسي", icon: "fa-book-open" },
    settings: { view: "viewSettings", btn: "navBtnSettings", title: "الإعدادات المتقدمة والنسخ الاحتياطي", icon: "fa-sliders" }
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

  // Tab specific refreshes
  if (tabKey === "assistants") window.fetchAssistants();
  if (tabKey === "decisions") window.fetchDecisions();
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
        <i class="fa-solid ${isApproved ? 'fa-circle-check' : 'fa-clock'}" style="color: ${isApproved ? 'var(--success)' : 'var(--warning)'}; font-size: 1.25em;"></i>
        <span>حالة اعتماد يومية (${d})</span>
        <span class="approval-badge-pill ${isApproved ? 'approved' : 'pending'}">
          ${isApproved ? '<i class="fa-solid fa-check"></i> معتمدة ومفعلة' : '<i class="fa-solid fa-hourglass-half"></i> قيد المراجعة / معلقة'}
        </span>
      </div>
      <p class="approval-card-desc">
        ${isApproved 
          ? 'النظام مفعل بالكامل لدى المساعدين ويمكنهم تسجيل الحضور والعمليات. يمكنك إيقاف اليومية في أي وقت لتعليق عمل المساعدين.' 
          : 'العمليات متوقفة ومقيدة لدى المساعدين حتى تقوم بمراجعة الحضور واعتماد اليومية.'}
      </p>
    </div>
    <div class="approval-card-actions">
      <button class="btn-toggle-shift ${isApproved ? 'active' : 'inactive'}" onclick="window.toggleDailyApproval('${d}', ${!isApproved})">
        <i class="fa-solid ${isApproved ? 'fa-lock' : 'fa-lock-open'}"></i>
        <span>${isApproved ? 'إيقاف اليومية / تعليق المساعدين' : 'اعتماد اليومية وفتح النظام'}</span>
      </button>
    </div>
  `;
};

window.toggleDailyApproval = async function(dateStr, toActive) {
  const d = dateStr || nowDateStr();

  if (toActive) {
    const res = await Swal.fire({
      title: 'اعتماد اليومية',
      text: `هل تريد اعتماد يومية (${d}) وتفعيل النظام بالكامل للمساعدين؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، اعتمد اليومية',
      confirmButtonColor: '#10B981',
      cancelButtonText: 'إلغاء'
    });
    if (!res.isConfirmed) return;

    dailyApprovalMap[d] = { status: 'approved', approved_at: new Date().toISOString() };
    try {
      if (supabase) {
        await supabase.from('centers').upsert({
          id: currentCenterId,
          daily_approval_status: dailyApprovalMap
        });
      }
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_APPROVED', date: d });
      }
      showToast(`تم اعتماد يومية (${d}) وتفعيل النظام للمساعدين بنجاح!`, "success");
      window.renderDailyApprovalWidget(d);
    } catch(e) {
      console.error(e);
      showToast("فشل حفظ الاعتماد في السحابة", "err");
    }
  } else {
    const res = await Swal.fire({
      title: 'إيقاف / تعليق اليومية',
      text: `هل أنت متأكد من إيقاف اعتماد يومية (${d})؟ سيتوقف عمل المساعدين فوراً.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، أوقف اليومية',
      confirmButtonColor: '#EF4444',
      cancelButtonText: 'إلغاء'
    });
    if (!res.isConfirmed) return;

    dailyApprovalMap[d] = { status: 'pending', locked_at: new Date().toISOString() };
    try {
      if (supabase) {
        await supabase.from('centers').upsert({
          id: currentCenterId,
          daily_approval_status: dailyApprovalMap
        });
      }
      if (permChannel) {
        permChannel.postMessage({ type: 'DAILY_SHIFT_LOCKED', date: d });
      }
      showToast(`تم إيقاف يومية (${d}) وتعليق العمليات لدى المساعدين.`, "warning");
      window.renderDailyApprovalWidget(d);
    } catch(e) {
      console.error(e);
      showToast("فشل حفظ الحالة في السحابة", "err");
    }
  }
};

// 4. DAILY REPORT & APPROVAL
// ========================================================
window.loadDailyReport = function(dateStr) {
  const d = dateStr || nowDateStr();
  window.renderDailyApprovalWidget(d);
  const ids = attByDate[d] || [];
  const rev = revenueByDate[d] || 0;
  const expArr = expensesByDate.filter(e => e.date === d);
  const totalSt = Object.keys(students).length;
  let totalExp = 0; expArr.forEach(e => totalExp += (e.amount || 0));

  // Update Stat Cards
  const statAttend = document.getElementById("statDailyAttend");
  const statRev = document.getElementById("statDailyRevenue");
  const statAbsent = document.getElementById("statDailyAbsent");
  const statExp = document.getElementById("statDailyExpenses");

  if (statAttend) statAttend.textContent = ids.length;
  if (statRev) statRev.textContent = rev.toLocaleString() + " ج";
  if (statAbsent) statAbsent.textContent = Math.max(0, totalSt - ids.length);
  if (statExp) statExp.textContent = totalExp.toLocaleString() + " ج";

  // Render Groups Breakdown
  const body = document.getElementById("dailyGroupsBreakdown");
  if (body) {
    if (ids.length === 0 && expArr.length === 0) {
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
    const pkg = packages[cls];
    let req = pkg ? (pkg.price || 0) : 0;
    const paid = st.paid || 0;
    const debt = Math.max(0, req - paid);
    
    // Attendance count
    const attCount = Object.values(attByDate).reduce((acc, list) => acc + (list.includes(String(st.id)) ? 1 : 0), 0);

    totalRev += paid;
    totalDebt += debt;

    rowsHtml += `
      <tr>
        <td style="font-weight: 700;">${st.name} <span style="font-size:0.8em; color:var(--text-secondary);">(#${st.id})</span></td>
        <td><span style="background:var(--gradient-subtle); color:var(--primary); font-weight:700; padding:3px 8px; border-radius:6px; font-size:0.85em;">${cls}</span></td>
        <td>${req > 0 ? req + " ج" : "—"}</td>
        <td style="color:var(--success); font-weight:700;">${paid > 0 ? paid + " ج" : "0 ج"}</td>
        <td style="color:${debt > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:700;">${debt > 0 ? debt + " ج" : "خالص"}</td>
        <td style="font-weight:700;">${attCount}</td>
        <td>
          <a href="index.html" style="text-decoration:none;" class="btn secondary smallBtn">
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

  listEl.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> جاري جلب المساعدين والصلاحيات...</div>';

  try {
    const { data: assistants, error } = await supabase
      .from('assistants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!assistants || assistants.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border);">
          <i class="fa-solid fa-users-slash" style="font-size: 2.5em; margin-bottom: 12px; opacity: 0.5;"></i>
          <p style="font-size: 1.1em; font-weight: 700;">لا يوجد مساعدين مسجلين بعد</p>
          <p style="font-size: 0.85em; margin-top: 4px;">اضغط على "إضافة مساعد جديد" لإنشاء أول حساب وتحديد صلاحياته.</p>
        </div>
      `;
      return;
    }

    let html = "";
    assistants.forEach(asst => {
      const uName = asst.username;
      const initial = (uName[0] || "A").toUpperCase();
      const createdAt = asst.created_at ? new Date(asst.created_at).toLocaleDateString("ar-EG") : "—";
      const asstPerms = asst.permissions || {};

      // Render Permission Groups
      let groupsHtml = "";
      PERM_GROUPS.forEach(grp => {
        const itemsInGroup = PERMISSIONS_DEFS.filter(p => p.group === grp.id);
        groupsHtml += `
          <div class="perm-group-box">
            <div class="perm-group-title">${grp.title}</div>
            <div class="perm-items-grid">
        `;

        itemsInGroup.forEach(p => {
          const isChecked = asstPerms[p.key] !== false; // default true if not set
          groupsHtml += `
            <div class="perm-item-premium">
              <i class="fa-solid ${p.icon} perm-icon"></i>
              <div class="perm-text">
                <span class="perm-text-title">${p.label}</span>
                <span class="perm-text-desc">${p.desc}</span>
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
                <span>تاريخ الإنشاء: ${createdAt}</span>
              </div>
            </div>
            <div class="asst-actions">
              <button class="btn secondary smallBtn" onclick="window.changeAssistantPassword('${uName}')">
                <i class="fa-solid fa-key"></i> كلمة المرور
              </button>
              <button class="btn danger smallBtn" onclick="window.deleteAssistant('${uName}')">
                <i class="fa-solid fa-trash"></i> حذف
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
    listEl.innerHTML = `<div style="color:var(--danger); text-align:center; padding:20px;">فشل تحميل المساعدين: ${err.message}</div>`;
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

    // 4. Update local cache if this username is also active locally
    localStorage.setItem(`ca_asst_permissions_${username}`, JSON.stringify(perms));

    showToast(`تم تحديث صلاحية (${permKey}) للمساعد ${username} بنجاح`, "success");

  } catch(err) {
    console.error("Toggle Permission Error:", err);
    showToast("فشل تحديث الصلاحية في السحابة", "err");
  }
};

window.openAddAssistantModal = function() {
  const m = document.getElementById("addAssistantModal");
  if (m) m.classList.remove("hidden");
};

window.closeAddAssistantModal = function() {
  const m = document.getElementById("addAssistantModal");
  if (m) m.classList.add("hidden");
};

window.submitNewAssistant = async function() {
  const u = document.getElementById("newAsstUsernameInput").value.trim().toLowerCase();
  const p = document.getElementById("newAsstPasswordInput").value.trim();

  if (!u || !p) return showToast("يرجى إدخال اسم المستخدم وكلمة المرور", "err");
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return showToast("اسم المستخدم يجب أن يكون بالإنجليزية وبدون مسافات", "err");

  try {
    if (!supabase) return;
    
    // Default all permissions to true initially
    const initialPerms = {};
    PERMISSIONS_DEFS.forEach(def => { initialPerms[def.key] = true; });

    const { error } = await supabase.from('assistants').insert([{
      username: u,
      email: `${u}@studify.com`,
      password: p,
      permissions: initialPerms,
      manager_id: currentCenterId
    }]);

    if (error) {
      if (error.code === '23505') throw new Error("اسم المستخدم محجوز مسبقاً، اختر اسماً آخر.");
      throw error;
    }

    showToast("تم إنشاء حساب المساعد بنجاح!", "success");
    document.getElementById("newAsstUsernameInput").value = "";
    document.getElementById("newAsstPasswordInput").value = "";
    window.closeAddAssistantModal();
    window.fetchAssistants();

  } catch(err) {
    console.error(err);
    showToast(err.message || "فشل إضافة المساعد", "err");
  }
};

window.changeAssistantPassword = async function(username) {
  const res = await Swal.fire({
    title: `تعديل كلمة المرور: ${username}`,
    input: 'password',
    inputLabel: 'أدخل كلمة المرور الجديدة',
    inputPlaceholder: 'New Password',
    showCancelButton: true,
    confirmButtonText: 'تحديث كلمة المرور',
    cancelButtonText: 'إلغاء'
  });

  if (res.isConfirmed && res.value) {
    try {
      if (!supabase) return;
      await supabase.from('assistants').update({ password: res.value.trim() }).eq('username', username);
      showToast("تم تحديث كلمة مرور المساعد بنجاح", "success");
    } catch(err) {
      console.error(err);
      showToast("فشل تحديث كلمة المرور", "err");
    }
  }
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
    if (badge) {
      if (count && count > 0) {
        badge.textContent = count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  } catch(e) { console.error(e); }
}

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
      listEl.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-secondary);">لا توجد طلبات قرارات معلقة حالياً. كل شيء مستقر!</div>';
      return;
    }

    let html = "";
    reqs.forEach(r => {
      const date = new Date(r.created_at).toLocaleString("ar-EG");
      const isExempt = r.sub_type === "exemption";
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
            <button class="btn success smallBtn" onclick="window.approveDecision('${r.id}', '${r.student_id}', '${r.sub_type}', ${r.amount || 0})">
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
      const pkg = packages[st.className];
      let req = pkg ? (pkg.price || 0) : 0;
      if (subType === "exemption") {
        st.paid = req;
      } else {
        const discounted = Math.max(0, req - Number(amount));
        st.paid = Math.max(st.paid || 0, discounted);
      }
      await supabase.from('students').upsert({ id: st.id, paid: st.paid });
    }

    // 2. Mark request approved
    await supabase.from('communications').update({ status: 'approved' }).eq('id', reqId);

    // 3. Notify assistant
    await supabase.from('communications').insert([{
      id: "msg_" + Date.now(),
      type: 'assistant_message',
      title: ' تمت الموافقة على طلب الخصم',
      message: `وافق المدير على طلب الطالب (${studentId})`,
      status: 'unread'
    }]);

    showToast("تمت الموافقة وتطبيق الخصم بنجاح", "success");
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
          <span style="font-size:0.85em; color:var(--text-secondary);">السعر الأساسي: <b>${p.price} ج</b></span>
          ${p.hasInstallments ? `<div style="font-size:0.75em; color:var(--warning);">قسط: ${p.installmentPrice} ج</div>` : ''}
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
  expensesByDate.push(newExp);

  try {
    if (!supabase) return;
    await supabase.from('centers').upsert({
      id: currentCenterId,
      expenses_by_date: expensesByDate
    });

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
    else if (s.status === "in_progress") { statusBadge = "جاري الشرح ⏳"; badgeColor = "var(--warning)"; }

    html += `
      <div class="syllabus-item-card ${s.status}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1.05em;">${s.title}</div>
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

  syllabusList.push({ title, status, notes, updated_at: new Date().toISOString() });

  try {
    if (!supabase) return;
    await supabase.from('centers').upsert({ id: currentCenterId, syllabus: syllabusList });
    showToast("تمت إضافة الدرس لخريطة المنهج", "success");
    document.getElementById("syllabusLessonName").value = "";
    document.getElementById("syllabusLessonNotes").value = "";
    window.renderAdminSyllabus();
  } catch(e) { console.error(e); }
};

window.deleteSyllabusLesson = async function(idx) {
  syllabusList.splice(idx, 1);
  try {
    if (!supabase) return;
    await supabase.from('centers').upsert({ id: currentCenterId, syllabus: syllabusList });
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
    showToast("تم تصدير نسخة Excel بنجاح!", "success");
  } catch(e) {
    console.error(e);
    showToast("فشل تصدير البيانات إلى Excel", "err");
  }
};

window.resetTermData = async function() {
  const res = await Swal.fire({
    title: 'تأكيد تصفير الترم',
    text: 'هل أنت متأكد من تصفير حضور ومصاريف وإيرادات الترم بالكامل لجميع الطلاب؟ لا يمكن التراجع عن هذه الخطوة إلا بنسخة احتياطية!',
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
      await supabase.from('centers').upsert({
        id: currentCenterId,
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
        supabase.from('centers').upsert({
          id: currentCenterId,
          attendance_by_date: {},
          revenue_by_date: {},
          expenses_by_date: [],
          syllabus: [],
          daily_approval_status: {}
        })
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

