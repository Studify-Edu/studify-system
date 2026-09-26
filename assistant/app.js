
window.addEventListener('error', function(event) {
  if (!document.body) return;
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; background:#d32f2f; color:white; padding:12px; z-index:999999; font-weight:bold; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,0.5); direction:ltr; font-family:monospace; font-size:14px;';
  errDiv.innerHTML = 'Error: ' + event.message + ' <br><span style="font-size:12px;opacity:0.8;">At ' + event.filename + ':' + event.lineno + '</span>';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Dismiss';
  closeBtn.style.cssText = 'margin-left:15px; background:white; color:#d32f2f; border:none; padding:4px 10px; cursor:pointer; font-weight:bold; border-radius:4px;';
  closeBtn.onclick = () => errDiv.remove();
  
  errDiv.appendChild(closeBtn);
  document.body.appendChild(errDiv);
});

/* =============================================================================
 Center System V-PRO MAX (THE ULTIMATE SHIELD EDITION - PREMIUM UX)
 -----------------------------------------------------------------------------
 - 100% Full Translation Dictionary (Arabic / English)
 - Smart Consecutive Attendance (Group-based Streak)
 - Advanced Financial Module (Expenses, Daily/Monthly Net Profit)
 - Dynamic Group Fee Management (Package Builder)
 - Syllabus Map Module (Course Timeline & Tracker)
 - Premium UX: Error Shake, Edge Flash, Hold-To-Delete
 ============================================================================= */

// =============================================================================
// =============================================================================
// =============================================================================
// GLOBAL LANGUAGE & LOCALIZATION STATE
// =============================================================================
const K_LANG = "ca_lang";
let currentLang = localStorage.getItem(K_LANG) || "ar";
window.currentLang = currentLang;
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
  "عذراً، الشيفت واليومية مغلقة حالياً من قِبل المدير العام.": "Sorry, shift and daily register are currently closed by the general manager.",
  "يرجى اختيار الباقة المستهدفة بالقرار": "Please select the target package for the decision",
  "جاري المزامنة مع السحابة وتحديث البيانات...": "Syncing with cloud and updating data...",
  "تمت المزامنة وتحديث كافة البيانات والباقات سحابياً بنجاح": "Successfully synced and updated all data and packages to the cloud",
  "خطأ في المزامنة، تحقق من الاتصال بالإنترنت": "Sync error, check your internet connection",
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
  "تم إنهاء البث التلقائي بنجاح وإلغاء الجلسة": "Automatic broadcast session terminated successfully",
  "تم إيقاف البث مؤقتاً": "Automatic broadcast paused",
  "تم استئناف البث التلقائي": "Automatic broadcast resumed",
  "اكتمل البث التلقائي الذكي لجميع الطلاب بنجاح": "Automatic broadcast completed for all students successfully",
  "بدء تشغيل البث التلقائي الآمن، يرجى السماح بالنوافذ المنبثقة (Pop-ups)": "Starting safe auto-broadcast, please allow pop-ups",
  "قائمة الأرقام فارغة، يرجى اختيار شريحة الطلاب أولاً.": "Target list is empty, please select a student segment first.",
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
    pattern: /^خطأ: (.*)/i,
    replace: (m, p1) => `Error: ${p1}`
  },
  {
    pattern: /^الطالب غير مشترك في باقة تخص مادة \((.*?)\)$/i,
    replace: (m, p1) => `Student is not subscribed to a package for subject (${p1})`
  },
  {
    pattern: /^الطالب لم يسدد ثمن باقة \((.*?)\) بالكامل$/i,
    replace: (m, p1) => `Student has not fully paid for package (${p1})`
  },
  {
    pattern: /^باقة \((.*?)\) لم تبدأ بعد$/i,
    replace: (m, p1) => `Package (${p1}) has not started yet`
  },
  {
    pattern: /^باقة \((.*?)\) منتهية الصلاحية$/i,
    replace: (m, p1) => `Package (${p1}) is expired`
  },
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

let _lastToastMsg = "", _lastToastTime = 0;
window.showToast = function(msg, type = "success") {
  msg = translateNotification(msg);
  const _now = Date.now();
  if (_now - _lastToastTime < 350 && _lastToastMsg === msg) return;
  _lastToastMsg = msg; _lastToastTime = _now;
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    if (document.body) document.body.appendChild(container);
  }
  if (!container || !container.parentNode) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: type === 'err' ? 'error' : (type === 'warning' ? 'warning' : 'info'),
        text: String(msg),
        timer: 3500,
        showConfirmButton: false
      });
    }
    return;
  }
  container.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icons = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    err: '<i class="fa-solid fa-circle-xmark"></i>',
    warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
    info: '<i class="fa-solid fa-circle-info"></i>'
  };
  const duration = type === 'err' ? 4500 : 3500;
  toast.innerHTML = `
    <div class="toast-inner">
      <div class="toast-icon-wrap">${icons[type] || icons.info}</div>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close-btn" onclick="this.closest('.toast').remove()">&times;</button>
    </div>
    <div class="toast-progress-bar" style="animation-duration:${duration}ms;"></div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.35s cubic-bezier(0.4, 0, 1, 1) forwards";
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// Bulletproof Interception of Native Browser Popups
window.alert = function(msg) {
  window.showToast(String(msg), "warning");
};

window.confirm = function(msg) {
  console.warn("[Intercepted Native Confirm]:", msg);
  window.showToast(String(msg), "warning");
  return false;
};

window.prompt = function(msg, def) {
  console.warn("[Intercepted Native Prompt]:", msg);
  return null;
};

// =============================================================================
// SUPABASE CLIENT INITIALIZATION & CLOUD SYNC ENGINE
// =============================================================================
const SUPABASE_URL = "https://erwrrvafuxezszgbiswg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyd3JydmFmdXhlenN6Z2Jpc3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTI4NzMsImV4cCI6MjEwMjgyODg3M30.xNbyENlnwes4XPWFoc10tooQTIC49WYo2zurvugkf9g";

// Supabase client instance
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
window.supabaseClient = supabase;

let isCloudConnected = navigator.onLine;
let hasUnsavedChanges = false;
let wasOffline = false;

function setupConnectionTracker() {
  function checkOnline() {
    isCloudConnected = navigator.onLine;
    if (isCloudConnected) {
      console.log("Supabase Cloud: Online ");
      if (!hasUnsavedChanges) {
        if (typeof updateSyncUI === 'function') updateSyncUI('online', 'متصل ومتزامن ');
      } else {
        if (typeof updateSyncUI === 'function') updateSyncUI('pending', 'متصل - جاري مزامنة التغييرات المعلقة');
        if (typeof saveAll === 'function') saveAll();
      }
      if (wasOffline) {
        if (typeof showToast === 'function') {
          showToast(currentLang === 'ar' ? "عاد الاتصال بالإنترنت جاري المزامنة مع السحابة..." : "Connection Restored Syncing...", "success");
        }
      }
      wasOffline = false;
    } else {
      console.log("Supabase Cloud: Offline ");
      isCloudConnected = false;
      wasOffline = true;
      if (typeof updateSyncUI === 'function') updateSyncUI('offline', 'غير متصل بالسحابة (يعمل محلياً)');
    }
  }

  window.addEventListener('online', checkOnline);
  window.addEventListener('offline', checkOnline);
  checkOnline();

  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges && !isCloudConnected) {
      e.preventDefault();
      e.returnValue = 'تحذير: لا يوجد اتصال بالإنترنت، هناك بيانات لم يتم مزامنتها مع السحابة.';
      return e.returnValue;
    }
  });
}
setupConnectionTracker();


document.addEventListener('DOMContentLoaded', function() {
  // Direct Enter key listeners on Bento inputs
  ["openId", "newId", "quickAttendId", "searchAny"].forEach(inputId => {
    const el = document.getElementById(inputId);
    if (el) {
      el.setAttribute("autocomplete", "off");
      el.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (inputId === "openId") (document.getElementById("openBtn") || document.getElementById("openIdBtn"))?.click();
          else if (inputId === "newId") document.getElementById("addNewBtn")?.click();
          else if (inputId === "quickAttendId") document.getElementById("quickAttendBtn")?.click();
          else if (inputId === "searchAny") {
            const firstItem = document.querySelector("#searchMsg .item");
            if (firstItem) firstItem.click();
            else {
              const numVal = toInt(el.value);
              if (numVal > 0) {
                if (document.getElementById("openId")) document.getElementById("openId").value = numVal;
                document.getElementById("openBtn")?.click();
              }
            }
          }
        }
      });
    }
  });

 console.log("V-PRO MAX Engine: Initializing System...");
 
 // Sync UI with Mute State
 if($("muteSoundsToggle")) $("muteSoundsToggle").checked = window.isMuted;
 if($("soundIcon")) $("soundIcon").innerHTML = window.isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';

 if ($("toggleSoundsBtn")) {
 $("toggleSoundsBtn").addEventListener("click", function() {
 window.isMuted = !window.isMuted;
 localStorage.setItem("ca_muted", window.isMuted ? "1" : "0");
 if($("muteSoundsToggle")) $("muteSoundsToggle").checked = window.isMuted;
 if($("soundIcon")) $("soundIcon").innerHTML = window.isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
 if (typeof AssistantSounds !== "undefined") { AssistantSounds.muteAnnouncement(window.isMuted); } else if (!window.isMuted) { playSound("click"); }
 });
 }

 // ==========================================
 // 1. CONFIGURATION & AUTHENTICATION
 // ==========================================
 // Passwords are now managed in Supabase under users/{manager_id}/settings
 
 const BASE_MIN_ID = 1; 
 const BASE_MAX_ID = 500; 
 const ITEMS_PER_PAGE = 50;

 // مفاتيح التخزين المحلية
 const K_AUTH = "ca_auth_v2";
 const K_ROLE = "ca_role_v1";
 const K_STUDENTS = "ca_students_v6";
 const K_EXTRA_IDS = "ca_extra_ids_v6";
 const K_ATT_BY_DATE = "ca_att_by_date_v6";
 const K_REVENUE = "ca_revenue_v6";
 const K_DELETED = "ca_deleted_v9";
 const K_THEME = "ca_theme_v1";
  // const K_LANG = "ca_lang"; (defined at top)
 const K_LAST_BACKUP = "ca_last_backup";
 const K_BG_IMAGE = "ca_bg_image";
 const K_NOTEBOOK = "ca_notebook_v1";
 const K_GROUP_FEES = "ca_group_fees_v1";
 const K_EXPENSES = "ca_expenses_v1";
 const K_SYLLABUS = "ca_syllabus_v1"; 
 const K_EVAL = "ca_eval_form_v1";
 const K_SESSION_STUDENTS = "ca_session_students_v1";
const K_VAULT_TRANSFERS = "ca_vault_transfers_v1";
 const K_BOOKLETS = "ca_booklets_v1";

 // ==========================================
 // 2.5 SECURE STORAGE LAYER (localForage + CryptoJS)
 // ==========================================
 const ENCRYPTION_KEY = "Studify_S3cur3_K3y_2026!";
 
 // Data keys that are HEAVY and must go to localForage (IndexedDB)
 const HEAVY_DATA_KEYS = [K_STUDENTS, K_ATT_BY_DATE, K_REVENUE, K_GROUP_FEES, 
 K_EXPENSES, K_DELETED, K_SYLLABUS, K_EVAL, 
 K_SESSION_STUDENTS, K_BOOKLETS];

 // Keys that STAY in localStorage (tiny, need synchronous boot access)
 // K_AUTH, K_ROLE, K_LANG, K_THEME, K_BG_IMAGE, K_NOTEBOOK, K_LAST_BACKUP,
 // ca_manager_id, ca_current_username, ca_muted, ca_migrated, etc.

 // Sync state tracking
 let localTimestamps = {}; // { ca_students_v6: 1720180000000, ... }
 let syncInProgress = false;

 // --- Encryption Helpers ---
 function encryptData(data) {
 try {
 const jsonStr = JSON.stringify(data);
 return CryptoJS.AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
 } catch(e) {
 console.error("[Encrypt] Failed:", e);
 return JSON.stringify(data); // Fallback: save unencrypted
 }
 }

 function decryptData(cipherText) {
 try {
 if (!cipherText) return null;
 // If it's not encrypted (legacy data), parse directly
 if (cipherText.startsWith('{') || cipherText.startsWith('[') || cipherText.startsWith('"')) {
 return JSON.parse(cipherText);
 }
 const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
 const decrypted = bytes.toString(CryptoJS.enc.Utf8);
 if (!decrypted) return null;
 return JSON.parse(decrypted);
 } catch(e) {
 console.error("[Decrypt] Failed:", e);
 // Try parsing as plain JSON (migration scenario)
 try { return JSON.parse(cipherText); } catch(e2) { return null; }
 }
 }

 // --- Async Storage Wrappers ---
 async function secureSave(key, data) {
 try {
 const encrypted = encryptData(data);
 await localforage.setItem(key, encrypted);
 // Update local timestamp
 localTimestamps[key] = Date.now();
 await localforage.setItem('_timestamps', localTimestamps);
 } catch(e) {
 console.error("[secureSave] Error for key:", key, e);
 }
 }

 async function secureLoad(key, fallback) {
 try {
 const raw = await localforage.getItem(key);
 if (raw === null || raw === undefined) return fallback;
 const decrypted = decryptData(raw);
 return decrypted !== null ? decrypted : fallback;
 } catch(e) {
 console.error("[secureLoad] Error for key:", key, e);
 return fallback;
 }
 }

 // --- Migration: localStorage → localForage (One-time) ---
 async function initStorageMigration() {
 const migrated = await localforage.getItem('_idb_migrated');
 if (migrated === true) {
 console.log("[Migration] Already migrated to IndexedDB. Skipping.");
 // Load timestamps
 localTimestamps = (await localforage.getItem('_timestamps')) || {};
 return;
 }

 console.log("[Migration] Starting localStorage → IndexedDB migration...");
 let migratedCount = 0;

 for (const key of HEAVY_DATA_KEYS) {
 const raw = localStorage.getItem(key);
 if (raw) {
 try {
 const parsed = JSON.parse(raw);
 await secureSave(key, parsed);
 localStorage.removeItem(key); // Free up the 5MB space
 migratedCount++;
 console.log(`[Migration] Migrated: ${key}`);
 } catch(e) {
 console.error(`[Migration] Failed for ${key}:`, e);
 }
 }
 }

 // Mark migration as complete
 await localforage.setItem('_idb_migrated', true);
 localTimestamps = (await localforage.getItem('_timestamps')) || {};
 console.log(`[Migration] Complete! Migrated ${migratedCount} keys to IndexedDB.`);
 
 if (migratedCount > 0 && typeof showToast === 'function') {
 showToast("تم ترقية قاعدة البيانات المحلية بنجاح ", "success");
 }
 }

 // --- Sync UI Helpers ---
 function updateSyncUI(state, title) {
 // state: 'online' | 'offline' | 'pending' | 'syncing'
 const indicator = document.getElementById("cloudSyncIndicator");
 const dot = document.getElementById("syncStatusDot");
 const badge = document.getElementById("syncPendingBadge");
 
 if (indicator) {
 indicator.classList.remove("hidden");
 indicator.classList.remove("online", "offline", "pending", "syncing");
 indicator.classList.add(state);
 indicator.title = title || "";
 }
 if (dot) {
 dot.classList.remove("online", "offline", "pending");
 dot.classList.add(state === 'syncing' ? 'pending' : state);
 }
 if (badge) {
 if (state === 'pending') {
 badge.classList.remove("hidden");
 } else {
 badge.classList.add("hidden");
 }
 }
 }

 // GLOBAL TENANT STATE
 window.CURRENT_MANAGER_ID = localStorage.getItem("ca_manager_id") || "ahmedqutb11232_gmail_com";
 window.CURRENT_ROLE = localStorage.getItem(K_ROLE) || "";
 if (!localStorage.getItem("ca_manager_id")) {
   localStorage.setItem("ca_manager_id", window.CURRENT_MANAGER_ID);
 }

 // ==========================================
 // 2. GLOBAL SYSTEM STATE
 // ==========================================
 let centerNotebookContent = "";
  let students = {}; 
 let deletedStudents = {}; 
 let extraIds = []; 
 let attByDate = {}; 
 let revenueByDate = {}; 
 let groupFees = {}; 
 let expensesByDate = {};
 let syllabusData = []; 
 let evalData = {};
 let sessionStudentsByDate = {};
let vaultTransfers = [];
 let bookletsStock = {};
 
 let currentId = null;
 let currentUserRole = window.CURRENT_ROLE || "admin";
 let currentPage = 1;
 let currentFilteredList = [];
 let recentScans = [];
 let isRevHidden = false;
 let passSuccessCallback = null;
  // let currentLang defined at top of file

  // Expose core system state accessors to window for global access
  try {
    Object.defineProperty(window, 'students', { get: () => students, set: (v) => { students = v; }, configurable: true });
    Object.defineProperty(window, 'evalData', { get: () => evalData, set: (v) => { evalData = v; }, configurable: true });
    Object.defineProperty(window, 'currentId', { get: () => currentId, set: (v) => { currentId = v; }, configurable: true });
    Object.defineProperty(window, 'currentUserRole', { get: () => currentUserRole, set: (v) => { currentUserRole = v; }, configurable: true });
    Object.defineProperty(window, 'sessionStudentsByDate', { get: () => sessionStudentsByDate, set: (v) => { sessionStudentsByDate = v; }, configurable: true });
  } catch(e) {
    window.students = students;
    window.evalData = evalData;
    window.currentId = currentId;
    window.currentUserRole = currentUserRole;
    window.sessionStudentsByDate = sessionStudentsByDate;
  }

  // Early definition of session students helpers
  window.getAllSessionStudents = function() {
    const list = [];
    const seen = new Set();
    const dates = Object.keys(sessionStudentsByDate || {}).sort().reverse();
    dates.forEach(d => {
      const arr = sessionStudentsByDate[d] || [];
      arr.forEach((it, idx) => {
        const key = (it.name || '').trim().toLowerCase() + '___' + (it.phone || '').trim();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({
            ...it,
            date: d,
            originalIndex: idx
          });
        }
      });
    });
    return list;
  };

  window.getUniqueSessionStudentsCount = function() {
    return window.getAllSessionStudents().length;
  };

  window.getTotalStudentsCombinedCount = function() {
    const regularCount = Object.values(students || {}).filter(s => (s && s.id && (s.name || s.phone || s.className || (Number(s.paid) || 0) > 0))).length;
    const sessionCount = window.getUniqueSessionStudentsCount();
    return regularCount + sessionCount;
  };

 // Global Enter Key Handler for Inputs
 document.addEventListener('keydown', function(e) {
 if (e.key === 'Enter') {
 const target = e.target;
 if (target.id === 'searchAny') {
   e.preventDefault();
   const firstItem = document.querySelector('#searchMsg .item');
   if (firstItem) firstItem.click();
   else {
     const numVal = toInt(target.value);
     if (numVal > 0) {
       if (document.getElementById('openId')) document.getElementById('openId').value = numVal;
       document.getElementById('openBtn')?.click();
     } else {
       document.getElementById('searchBtn')?.click();
     }
   }
 }
 else if (target.id === 'openId') {
   e.preventDefault();
   (document.getElementById('openBtn') || document.getElementById('openIdBtn'))?.click();
 }
 else if (target.id === 'quickAttendId') {
   e.preventDefault();
   document.getElementById('quickAttendBtn')?.click();
 }
 else if (target.id === 'newId') {
   e.preventDefault();
   document.getElementById('addNewBtn')?.click();
 }
 else if (target.id === 'stName' || target.id === 'stPhone') {
   e.preventDefault();
   document.getElementById('saveStudentBtn')?.click();
 }
 else if (target.id === 'newPaymentInput') {
   e.preventDefault();
   document.getElementById('addPaymentBtn')?.click();
 }
 else if (target.id === 'sessStName' || target.id === 'sessStPhone' || target.id === 'sessStAmount') {
   e.preventDefault();
   document.getElementById('saveSessionStBtn')?.click();
 }
 else if (target.id === 'managerUser' || target.id === 'managerPass') {
   e.preventDefault();
   document.getElementById('managerLoginBtn')?.click();
 }
 else if (target.id === 'assistantCenterCode' || target.id === 'assistantUser' || target.id === 'assistantPass') {
   e.preventDefault();
   document.getElementById('assistantLoginBtn')?.click();
 }
 else if (target.id === 'customPassInput') {
   e.preventDefault();
   document.getElementById('customPassConfirm')?.click();
 }
 else if (target.id === 'tableSearchInp') target.blur();
 }
 });

 // Data Migration Function
 async function migrateLocalDataToManager() {
  if (window.CURRENT_ROLE !== 'admin' || !window.CURRENT_MANAGER_ID) return;
  if (localStorage.getItem("ca_migrated") === "true") return;

  try {
    if (typeof window.migrateLocalToSupabase === 'function') {
      await window.migrateLocalToSupabase();
      localStorage.setItem("ca_migrated", "true");
    }
  } catch (e) {
    console.error("Migration failed:", e);
  }
}

 // ==========================================
 // 3. THE COMPREHENSIVE DICTIONARY
 // ==========================================
 const dict = {
  "mkt_badge_system": { ar: "منظومة الاستهداف الرقمي والتسويق الذكي", en: "Digital Targeting & Smart Marketing System" },
  "mkt_badge_safe": { ar: "درع حماية ضد الحظر (Anti-Ban Shield)", en: "Anti-Ban Shield" },
  "asst_exp_tag": { ar: "مصاريف تشغيلية", en: "Operational Expenses" },
  "asst_exp_reason_plc": { ar: "مثال: طباعة ورق / فواتير / مستلزمات", en: "e.g., Printing / Invoices / Supplies" },
  "asst_exp_opt_cash": { ar: "درج الكاش (الخزينة النقدية)", en: "Cash Drawer" },
  "asst_exp_opt_wallet": { ar: "محفظة فودافون كاش", en: "Vodafone Cash Wallet" },
  "asst_exp_opt_insta": { ar: "حساب إنستاباي (InstaPay)", en: "InstaPay Account" },
  "asst_exp_title": { ar: "تسجيل ومتابعة مصروفات السنتر", en: "Record & Track Center Expenses" },
  "asst_exp_reason_lbl": { ar: "بند المصروف / السبب", en: "Expense Item / Reason" },
  "asst_exp_amt_lbl": { ar: "المبلغ (ج)", en: "Amount (EGP)" },
  "asst_exp_method_lbl": { ar: "الخزينة المصروف منها", en: "Payment Method / Treasury" },
  "asst_exp_date_lbl": { ar: "التاريخ", en: "Date" },
  "asst_btn_save_exp": { ar: "تسجيل المصروف", en: "Record Expense" },
  "asst_exp_history_title": { ar: "سجل المصروفات المسجلة", en: "Recorded Expenses History" },
  "th_date": { ar: "التاريخ", en: "Date" },
  "th_expense_item": { ar: "بند المصروف", en: "Expense Item" },
  "th_treasury": { ar: "الخزينة", en: "Treasury" },
  "th_amount": { ar: "المبلغ", en: "Amount" },
  "th_action": { ar: "الإجراء", en: "Action" },
  "no_exp_yet": { ar: "لا توجد مصروفات مسجلة بعد", en: "No expenses recorded yet" },
  "set_status_secured": { ar: "النظام متزامن ومحمي", en: "System Synced & Secured" },
  "note_subtitle": { ar: "ملاحظات ومهام إدارة السنتر المشتركة ومزامنة فورية مع السحابة", en: "Shared center tasks and notes with real-time cloud sync" },
  "nb_status_synced": { ar: "محفوظ بالسحابة", en: "Saved to Cloud" },
  "nb_status_saving": { ar: "جاري الحفظ...", en: "Saving..." },
  "nb_status_ready": { ar: "جاهز", en: "Ready" },
  "nb_tool_datetime": { ar: "تاريخ ووقت", en: "Timestamp" },
  "nb_tool_bullet": { ar: "نقطة", en: "Bullet" },
  "nb_tool_numbered": { ar: "ترقيم", en: "Numbered" },
  "nb_tool_task": { ar: "مهمة", en: "Task" },
  "nb_tool_important": { ar: "هام", en: "Important" },
  "nb_tool_pin": { ar: "تثبيت", en: "Pin" },
  "nb_tool_copy": { ar: "نسخ", en: "Copy" },
  "nb_tool_clear": { ar: "مسح", en: "Clear" },
  "btn_save_notebook": { ar: "حفظ فوري", en: "Save Now" },
  "nb_footer_hint": { 
    ar: '<i class="fa-solid fa-shield-halved" style="color:var(--primary);"></i> يتم الحفظ تلقائياً في السحابة مع إمكانية استخدام اختصار <kbd style="background:var(--bg-inset); padding:2px 6px; border-radius:4px; border:1px solid var(--border);">Ctrl+S</kbd> للحفظ الفوري.', 
    en: '<i class="fa-solid fa-shield-halved" style="color:var(--primary);"></i> Automatically saved to cloud. You can also press <kbd style="background:var(--bg-inset); padding:2px 6px; border-radius:4px; border:1px solid var(--border);">Ctrl+S</kbd> to save immediately.' 
  },
  "nb_last_saved": { ar: "آخر حفظ: —", en: "Last saved: —" },
  "set_ui_desc": { ar: "تغيير ألوان الثيم ولغة الواجهة لراحة عين المستخدم", en: "Customize theme colors and interface language for comfort" },
  "set_theme_desc": { ar: "يتكيف النظام تلقائياً مع ألوان الأجهزة وشاشات الهواتف والكمبيوتر.", en: "The system automatically adapts to light and dark screen preferences." },
  "lbl_system_lang": { ar: '<i class="fa-solid fa-language" style="color:var(--primary);"></i> لغة النظام:', en: '<i class="fa-solid fa-language" style="color:var(--primary);"></i> System Language:' },
  "debt_warning_prefix": { ar: "تنبيه: الطالب عليه مديونية متأخرة قدرها", en: "Notice: Student has an outstanding debt of" },
  "btn_close_profile": { ar: "إغلاق الملف", en: "Close File" },
  "currency_egp": { ar: "جنيه", en: "EGP" },
  "btn_deposit": { ar: "إيداع", en: "Deposit" },
  "filter_this_pkg": { ar: "هذه الباقة", en: "This Package" },
  "filter_all_pay": { ar: "كل الدفعات", en: "All Payments" },
  "st_notes_title": { ar: "ملاحظات الطالب (منفصلة وقابلة للتعديل)", en: "Student Notes (Separated & Editable)" },
  "st_att_history_title": { ar: "سجل حضور الطالب (التواريخ السابقة):", en: "Student Attendance History:" },
  "sess_class_opt": { ar: "حصة فردية", en: "Single Session" },
  "booklets_main_title": { ar: "إدارة مخزون المذكرات والورق", en: "Booklets & Paper Inventory" },
  "booklets_main_desc": { ar: "متابعة حركة طباعة واستلام المذكرات، المباع منها، المخزون المتبقي، وإجمالي العائد المالي بدقة تامة دون هدر.", en: "Track printing, booklet receipts, sales, stock, and total revenue with zero waste." },


  "nav_packages_menu": { ar: "الباقات والأسعار", en: "Packages & Pricing" },
  "nav_installments": { ar: "متابعة الأقساط", en: "Installments Tracker" },
  "packages_title": { ar: "الباقات والأسعار", en: "Packages & Pricing" },
  "packages_desc": { ar: "حدد اسم وسعر وصلاحية الباقات المتاحة للمركز مع قواعد التنبيه التلقائي.", en: "Configure package names, pricing, and automated notification rules." },
  "contract_print_btn": { ar: "طباعة إقرار وتعهد تسجيل الطالب", en: "Print Student Legal Contract" },
  "blank_contract_print_btn": { ar: "طباعة استمارة تقديم فارغة", en: "Print Blank Registration Form" },
  "save_student_data": { ar: "حفظ البيانات", en: "Save Student" },
  "mark_attend_btn": { ar: "حضور", en: "Present" },
  "mark_absent_btn": { ar: "غياب", en: "Absent" },
  "quick_controls_title": { ar: "قائمة التحكم السريعة", en: "Quick Controls" },
  "quick_theme_toggle": { ar: "تبديل المظهر (ليلي / نهاري)", en: "Switch Theme (Dark / Light)" },
  "quick_lang_toggle": { ar: "تبديل اللغة (Language)", en: "Switch Language (اللغة)" },
  "admin_portal_link": { ar: "لوحة الإدارة (Admin)", en: "Admin Dashboard" },
  "mute_sounds_lbl": { ar: "كتم الأصوات", en: "Mute Sounds" },
  "logout_system": { ar: "خروج من النظام", en: "Logout" },
  "psm_title": { ar: "اختيار الباقات", en: "Select Packages" },
  "psm_total_cost": { ar: "إجمالي التكلفة:", en: "Total Cost:" },
  "psm_currency": { ar: "جنيهاً", en: "EGP" },
  "psm_cancel": { ar: "إلغاء", en: "Cancel" },
  "psm_confirm": { ar: "تأكيد وحفظ", en: "Confirm & Save" },
  "set_ui_title": { ar: "المظهر والتخصيص", en: "Theme & Customization" },
  "lbl_theme": { ar: "ثيم البرنامج:", en: "System Theme:" },
  "theme_light": { ar: "الوضع النهاري (Light Mode)", en: "Light Mode" },
  "theme_dark": { ar: "الوضع الليلي (Dark Mode)", en: "Dark Mode" },

 "grp_daily": { ar: "الإدارة اليومية", en: "Daily Operations" },
 "nav_session_st": { ar: "طلاب الحصة", en: "Session Students" },
 "grp_finance": { ar: "الحسابات والتقارير", en: "Finance & Reports" },
 "grp_reports_system": { ar: "التقارير وإعدادات النظام", en: "Reports & System Settings" },
 "grp_tools": { ar: "أدوات وتسويق", en: "Tools & Marketing" },
 "nav_booklets": { ar: "مخزون المذكرات", en: "Booklets Inventory" },
 "nav_marketing": { ar: "حملات التسويق", en: "Marketing Campaigns" },
 "grp_system": { ar: "إعدادات النظام", en: "System Settings" },
 "note_header": { ar: "ملاحظات الطالب (منفصلة وقابلة للتعديل)", en: "Student Notes (Editable)" },
 "txt_no_notes": { ar: "لا توجد ملاحظات مسجلة لهذا الطالب", en: "No notes recorded for this student" },
 "print_receipt_lock": { ar: "إصدار إيصال سداد الباقة (مغلق لحين إكمال الدفع)", en: "Issue Package Receipt (Locked until full payment)" },
 "print_receipt_unlock": { ar: "طباعة إيصال سداد الباقة (مكتمل)", en: "Print Package Receipt (Completed)" },
 "correct_pay_btn": { ar: "إيداع", en: "Deposit" },
 "shift_manager": { ar: "مسئول الشيفت:", en: "Shift Manager:" },
 "modal_shift_title": { ar: "اختيار مسئول الشيفت", en: "Select Shift Manager" },
 "plc_new_manager": { ar: "اسم المسئول الجديد...", en: "New manager name..." },
 "btn_add_manager": { ar: "إضافة", en: "Add" },
 "err_no_manager": { ar: "يرجى اختيار اسم مسئول الشيفت أولاً", en: "Please select a shift manager first" },
 "drive_offline": { ar: "غير متصل", en: "Offline" },
 "drive_online": { ar: "متصل بالسحابة", en: "Cloud Connected" },
 "btn_drive_login": { ar: "ربط بجوجل درايف", en: "Connect Google Drive" },
 "btn_drive_connected": { ar: "متصل بالدرايف", en: "Drive Connected" },
 "btn_drive_restore": { ar: "استرجاع من السحاب", en: "Restore from Cloud" },
 "msg_sync_wait": { ar: "جاري حفظ نسخة احتياطية للسحابة...", en: "Saving backup to cloud..." },
 "msg_sync_done": { ar: "تم الحفظ بنجاح على الدرايف", en: "Saved to Drive successfully" },
 "msg_sync_auto": { ar: "تم تحديث النسخة الاحتياطية تلقائياً", en: "Auto-backup updated on cloud" },
 "lbl_last_sync": { ar: "آخر مزامنة: ", en: "Last Sync: " },
 "fin_month_exp": { ar: "صافي مصروفات الشهر", en: "Monthly Expenses" },
 "nav_syllabus": { ar: "المنهج", en: "Syllabus" },
 "tbl_remain": { ar: "المتبقي", en: "Remaining" },
 "modal_rev_today": { ar: "تفاصيل إيراد اليوم", en: "Today's Revenue Details" },
 "syll_update_title": { ar: "تحديث خريطة المنهج (للمدير)", en: "Update Syllabus (Admin)" },
 "syll_name_lbl": { ar: "اسم الشابتر / الدرس", en: "Chapter / Lesson Name" },
 "syll_status_lbl": { ar: "الحالة", en: "Status" },
 "syll_notes_lbl": { ar: "ملاحظات الحصة الأخيرة (للأسستنت والطلاب)", en: "Latest Session Notes" },
 "syll_map_title": { ar: "خريطة سير المنهج", en: "Syllabus Map" },
 "txt_no_rev": { ar: "لم يتم تسجيل أي إيرادات اليوم.", en: "No revenue recorded today." },
 "login_title": { ar: "دخول لوحة السنتر", en: "Center Login" },
 "login_desc": { ar: "الدخول للمسؤول فقط", en: "Admin Access Only" },
 "login_btn": { ar: "دخول", en: "Login" },
 "brand_name": { ar: "لوحة السنتر V-PRO", en: "V-PRO Dashboard" },
 "stat_students": { ar: "مسجلين:", en: "Enrolled:" },
 "stat_attend": { ar: "حضور:", en: "Attend:" },
 "stat_revenue": { ar: "إيراد:", en: "Revenue:" },
 "btn_logout": { ar: "خروج", en: "Logout" },
 "quick_title": { ar: "سريع (QR)", en: "Quick Record" },
 "btn_record": { ar: "سجل حضور", en: "Record" },
 "lbl_last_scan": { ar: "آخر حضور تم تسجيله", en: "Recent Activity" },
 "wait_scan": { ar: "بانتظار مسح كود...", en: "Waiting for scan..." },
 "search_title": { ar: "بحث شامل", en: "Global Search" },
 "btn_open": { ar: "فتح", en: "Open" },
 "search_plc": { ar: "الاسم / الرقم / الكود...", en: "Name / Phone / ID..." },
 "search_tbl_plc": { ar: "ابحث في الجدول...", en: "Search table..." },
 "add_title": { ar: "+ إضافة طالب جديد", en: "+ New Student" },
 "btn_add_open": { ar: "إضافة وفتح", en: "Add & Open" },
 "st_details": { ar: "بيانات الطالب", en: "Student Information" },
 "badge_new": { ar: "جديد", en: "NEW" },
 "rank_normal": { ar: "عادي", en: "Normal" },
 "rank_warn": { ar: "إنذار", en: "Warning" },
 "lbl_name": { ar: "الاسم", en: "Name" },
 "lbl_class": { ar: "الصف / الباقة", en: "Package / Class" },
 "lbl_phone": { ar: "رقم الموبايل", en: "Phone Number" },
 "lbl_finance": { ar: "نظام المصاريف", en: "Tuition System" },
 "lbl_total_paid": { ar: "إجمالي المدفوع:", en: "Total Paid:" },
 "btn_discount": { ar: "خصم", en: "Discount" },
 "lbl_remaining": { ar: "المتبقي:", en: "Remaining:" },
 "lbl_new_pay": { ar: "دفعة جديدة:", en: "New Payment:" },
 "btn_deposit": { ar: "إيداع", en: "Deposit" },
 "lbl_notes": { ar: "ملاحظات (مؤرخة)", en: "Dated Notes" },
 "note_plc": { ar: "إضافة ملحوظة...", en: "Add a note..." },
 "btn_add_note": { ar: "إضافة", en: "Add Note" },
 "btn_save_st": { ar: "حفظ البيانات", en: "Save Data" },
 "btn_mark_present": { ar: "حضور", en: "Present" },
 "btn_mark_absent": { ar: "غياب", en: "Absent" },
 "lbl_history": { ar: "سجل التواريخ", en: "Attendance History" },
 "adv_search_title": { ar: "قائمة البحث المتقدم", en: "Advanced Search" },
 "flt_all_classes": { ar: "كل المجموعات", en: "All Groups" },
 "flt_all_fin": { ar: "كل الحالات المالية", en: "All Finance" },
 "flt_paid": { ar: "خالص", en: "Paid" },
 "flt_partial": { ar: "سدد جزء (متبقي)", en: "Partial Paid" },
 "flt_unpaid": { ar: "لم يدفع", en: "Unpaid" },
 "flt_all_att": { ar: "كل الحضور", en: "All Attendance" },
 "flt_att_only": { ar: "الحضور فقط", en: "Present Only" },
 "flt_abs_only": { ar: "الغياب فقط", en: "Absent Only" },
 "lbl_selected": { ar: "تم تحديد", en: "Selected" },
 "tbl_name": { ar: "الاسم", en: "Name" },
 "tbl_class": { ar: "الباقة", en: "Package" },
 "tbl_paid": { ar: "المدفوع", en: "Paid" },
 "tbl_today": { ar: "حضور اليوم", en: "Today" },
 "btn_prev": { ar: "السابق", en: "Prev" },
 "btn_next": { ar: "التالي", en: "Next" },
 "fin_summary_title": { ar: "الملخص المالي", en: "Financial Summary" },
 "fin_today_net": { ar: "صافي ربح اليوم", en: "Today's Profit" },
 "fin_month_net": { ar: "صافي ربح الشهر الحالي", en: "Monthly Profit" },
 "exp_title": { ar: "تسجيل مصروفات اليوم", en: "Daily Expenses" },
 "exp_amt_plc": { ar: "المبلغ (مثال: 150)", en: "Amount" },
 "exp_rsn_plc": { ar: "سبب الصرف (مثال: ورق)", en: "Reason" },
 "btn_save_exp": { ar: "خصم وحفظ", en: "Deduct & Save" },
 "report_title": { ar: "تقرير الحضور والماليات", en: "Finance Report" },
 "btn_copy_wa": { ar: "نسخ التقرير للمدير", en: "Copy for Manager" },
 "btn_view": { ar: "عرض", en: "View Report" },
 "badge_date": { ar: "التاريخ:", en: "Date:" },
 "badge_count": { ar: "العدد:", en: "Count:" },
 "badge_rev": { ar: "إيراد:", en: "Revenue:" },
 "badge_exp": { ar: "مصروف:", en: "Expenses:" },
 "chart_title": { ar: "لوحة أرباح الأسبوع", en: "Weekly Chart" },
 "settings_title": { ar: "إعدادات النظام", en: "System Settings" },
 "note_title": { ar: "مفكرة السنتر السريعة", en: "Quick Notebook" },
 "note_plc_main": { ar: "اكتب ملاحظاتك هنا...", en: "Type your notes here..." },
 "set_data_title": { ar: "البيانات والنسخ الاحتياطي", en: "Data Management" },
 "btn_export_ex": { ar: "تصدير البيانات (Excel)", en: "Export to Excel" },
 "btn_import_ex": { ar: "استيراد بيانات (Excel)", en: "Import from Excel" },
 "btn_recycle": { ar: "سلة المحذوفات", en: "Recycle Bin" },
 "set_ui_title": { ar: "المظهر والتخصيص", en: "UI & Theme" },
 "lbl_theme": { ar: "ثيم البرنامج:", en: "App Theme:" },
 "theme_cls": { ar: "كلاسيك", en: "Classic" },
 "theme_dark": { ar: "ليلي", en: "Dark" },
 "theme_glass": { ar: "زجاجي", en: "Glass" },
 "btn_change_bg": { ar: "تغيير الخلفية", en: "Change Background" },
 "btn_change_lang": { ar: "تغيير اللغة (Ar / En)", en: "Switch Language" },
 "set_fin_title": { ar: "إعدادات مالية", en: "Package Pricing" },
 "btn_group_fees": { ar: "إدارة الباقات والمصاريف", en: "Manage Packages" },
 "set_danger_title": { ar: "منطقة الخطر", en: "Danger Zone" },
 "btn_reset_term": { ar: "تصفير الترم", en: "Reset Term Data" },
 "btn_factory_reset": { ar: "مسح النظام بالكامل", en: "Full Reset" },
 "nav_settings": { ar: "الإعدادات", en: "Settings" },
 "nav_revenue": { ar: "الماليات", en: "Finances" },
 "nav_home": { ar: "الرئيسية", en: "Home" },
 "nav_students": { ar: "الطلاب", en: "Students" },
 "pass_req_title": { ar: "مطلوب صلاحية الإدارة", en: "Admin Auth Required" },
 "pass_req_desc": { ar: "يرجى إدخال كلمة مرور الأدمن للمتابعة.", en: "Enter master password to continue." },
 "btn_cancel": { ar: "إلغاء", en: "Cancel" },
 "btn_confirm": { ar: "تأكيد", en: "Confirm" },
 "modal_all_st": { ar: "قائمة الطلاب المسجلين", en: "Registered Students List" },
 "btn_empty_bin": { ar: "إفراغ السلة نهائياً", en: "Empty Bin Permanently" },
 "modal_today_att": { ar: "حضور اليوم مفصل", en: "Detailed Attendance" },
 "btn_close": { ar: "إغلاق", en: "Close Window" },
 "modal_grp_fees": { ar: "إدارة مصاريف الباقات/المجموعات", en: "Manage Package Pricing" },
 "grp_fees_desc": { ar: "أضف الباقات هنا وسيتم عرضها للأسستنت أثناء تسجيل الطالب.", en: "Add packages here to display them to the assistant." },
 "btn_save_changes": { ar: "حفظ التعديلات", en: "Save Changes" },
 "msg_saved": { ar: "تم الحفظ بنجاح", en: "Progress saved" },
 "msg_err_pass": { ar: "كلمة مرور خاطئة", en: "Incorrect Password" },
 "msg_att_ok": { ar: "تم تسجيل الحضور", en: "Attendance Recorded" },
 "msg_att_warn": { ar: "حاضر مسبقاً", en: "Already marked present" },
 "msg_added": { ar: "تم إضافة الطالب بنجاح", en: "Student registered" },
 "msg_deleted": { ar: "تم حذف الطالب", en: "Student deleted" },
 "msg_undo": { ar: "تم التراجع بنجاح", en: "Action Undone" },
 "msg_copied": { ar: "تم نسخ التقرير", en: "Report Copied" },
 "txt_streak": { ar: "حصة متتالية", en: "Classes Streak" },
 "txt_paid_full": { ar: "خالص (مكتمل)", en: "Fully Paid" },
 "txt_free": { ar: "بدون مصاريف", en: "Free" },
 "wa_net": { ar: "صافي الربح", en: "Net Profit" },
 "wa_exp": { ar: "المصروفات", en: "Expenses" },
 "nav_reports": { ar: "التقارير", en: "Reports" },
 "reports_main_title": { ar: "التقارير التحليلية والمالية", en: "Analytical & Financial Reports" },
 "btn_export_colored": { ar: "تصدير التقرير (Excel ملون)", en: "Export Colored Report (Excel)" },
 "term_fin_summary": { ar: "الملخص المالي التحليلي للترم", en: "Term Financial Summary" },
 "term_total_req": { ar: "إجمالي المطلوب (الكامل)", en: "Total Expected (Full)" },
 "term_total_paid": { ar: "إجمالي المحصل (الفعلي)", en: "Total Collected (Actual)" },
 "term_total_remain": { ar: "إجمالي المتبقي (المديونيات)", en: "Total Remaining (Debts)" },
 "debtors_list_title": { ar: "قائمة الطلاب المديونين", en: "Debtors Students List" },
 "debtors_count_lbl": { ar: "عدد المديونين:", en: "Debtors Count:" },
 "debtors_desc": { ar: "جدول ديناميكي يعرض الطلاب الذين عليهم مبالغ متبقية فقط من الباقات.", en: "Dynamic table displaying students with remaining package debts." },
 "tbl_remain_amount": { ar: "المبلغ المتبقي عليه", en: "Remaining Debt" },
 "eval_form_title": { ar: "تقرير التقييم الإداري (Evaluation Form)", en: "Administrative Evaluation Form" },
 "eval_form_desc": { ar: "نموذج مخصص لإدخال وحفظ بيانات التقييم الإداري للسنتر.", en: "Custom form to enter and save center evaluation data." },
 "eval_center_name": { ar: "اسم السنتر:", en: "Center Name:" },
 "eval_manager": { ar: "المسؤول:", en: "Manager:" },
 "eval_packages": { ar: "الباقات:", en: "Packages:" },
 "eval_students_count": { ar: "عدد الطلبة:", en: "Students Count:" },
 "eval_current_courses": { ar: "الكورسات الحالية:", en: "Current Courses:" },
 "eval_collab_opps": { ar: "فرص التعاون:", en: "Collaboration Opportunities:" },
 "eval_notes": { ar: "ملاحظات:", en: "Notes:" },
 "eval_followup_plan": { ar: "خطة المتابعة:", en: "Follow-up Plan:" },
 "eval_needs": { ar: "احتياجات السنتر أو المقترحات التي تم مناقشتها:", en: "Center Needs / Suggested Proposals:" },
 "eval_final_rate": { ar: "التقييم النهائي:", en: "Final Evaluation:" },
 "btn_save_eval": { ar: "حفظ التقييم الإداري", en: "Save Evaluation" },
 "opt_cash": { ar: "كاش", en: "Cash" },
 "opt_instapay": { ar: "إنستاباي", en: "InstaPay" },
 "opt_wallet": { ar: "فودافون كاش", en: "Vodafone Cash" },
 "lbl_pay_history": { ar: "سجل دفعات الطالب المفصل:", en: "Detailed Payments History:" },
 "txt_no_payments": { ar: "لا توجد دفعات مسجلة حتى الآن", en: "No payments recorded yet" },
 "notes_lock_msg": { ar: "يرجى اختيار أو البحث عن طالب أولاً لتفعيل الملاحظات", en: "Please select or search for a student first to enable notes" },
 "btn_delete": { ar: "حذف", en: "Delete" },
 "btn_edit_note": { ar: "تعديل الملحوظة", en: "Edit Note" },
 "btn_del_note": { ar: "مسح الملحوظة", en: "Delete Note" },
 "btn_del_payment": { ar: "حذف الدفعة", en: "Delete Payment" },
 "txt_cash_old": { ar: "كاش (رصيد سابق)", en: "Cash (Prior Balance)" },
 "badge_instapay": { ar: "إنستاباي", en: "InstaPay" },
 "badge_wallet": { ar: "فودافون كاش", en: "Vodafone Cash" },
 "badge_cash": { ar: "كاش", en: "Cash" },
 "prompt_edit_note": { ar: "تعديل نص الملحوظة:", en: "Edit note text:" },
 "confirm_empty_note": { ar: "النص فارغ، هل تريد مسح الملحوظة؟", en: "Text is empty, delete note?" },
 "confirm_del_note": { ar: "متأكد من مسح هذه الملحوظة نهائياً؟", en: "Are you sure you want to delete this note?" },
 "msg_note_edited": { ar: "تم تعديل الملحوظة بنجاح", en: "Note edited successfully" },
 "msg_note_deleted": { ar: "تم مسح الملحوظة", en: "Note deleted" },
 "quick_controls_title": { ar: "قائمة التحكم السريعة", en: "Quick Controls Menu" },
 "quick_switch_role": { ar: "تبديل الصلاحيات (مسؤول)", en: "Switch Privileges (Admin)" },
 "quick_group_fees": { ar: "إدارة الباقات والمصاريف", en: "Group Packages & Fees" },
 "quick_export": { ar: "تصدير التقرير التحليلي", en: "Export Analytics Report" },
 "quick_bin": { ar: "سلة المحذوفات", en: "Recycle Bin" },
 "sess_main_title": { ar: "نظام تسجيل طلاب الحصة الفورية", en: "Immediate Session Students" },
 "sess_main_desc": { ar: "تسجيل الحضور والدفع للطلاب المؤقتين (بدون إصدار كارت أو حجز ID دائم في قاعدة البيانات)", en: "Quick attendance and payment for temporary students (without permanent card/ID in database)" },
 "sess_add_title": { ar: "تسجيل حضور ودفع فوري", en: "Quick Attend & Payment" },
 "sess_name_lbl": { ar: "اسم الطالب *", en: "Student Name *" },
 "sess_name_plc": { ar: "مثال: أحمد محمود عثمان", en: "Ex: Ahmed Mahmoud Osman" },
 "sess_phone_lbl": { ar: "رقم الموبايل (اختياري)", en: "Mobile Number (Optional)" },
 "sess_phone_plc": { ar: "مثال: 01012345678", en: "Ex: 01012345678" },
 "sess_class_lbl": { ar: "المادة / الصف / الباقة", en: "Subject / Class / Package" },
 "sess_class_opt": { ar: "حصة فردية", en: "Single Session" },
 "sess_amount_lbl": { ar: "مبلغ الحصة *", en: "Session Amount *" },
 "sess_amount_plc": { ar: "المبلغ (ج)", en: "Amount (EGP)" },
 "sess_method_lbl": { ar: "طريقة الدفع *", en: "Payment Method *" },
 "sess_save_btn": { ar: "تسجيل الحضور وتحصيل المبلغ", en: "Record Attend & Collect" },
 "sess_list_title": { ar: "سجل طلاب الحصة", en: "Session Students Log" },
 "sess_no_students": { ar: "لا يوجد طلاب مسجلين بالحصة لهذا اليوم", en: "No session students recorded for this day" },
 "booklets_main_title": { ar: "إدارة مخزون المذكرات والورق", en: "Booklets & Inventory Stock" },
 "booklets_main_desc": { ar: "متابعة حركة طباعة واستلام المذكرات، المباع منها، المخزون المتبقي، وإجمالي العائد المالي بدقة تامة دون هدر.", en: "Monitor booklet prints, received copies, sold copies, remaining stock, and total revenue with complete accuracy." },
 "stat_b_types": { ar: "أنواع المذكرات", en: "Booklet Types" },
 "stat_b_recd": { ar: "إجمالي النسخ المستلمة", en: "Total Received Copies" },
 "stat_b_sold": { ar: "النسخ المباعة", en: "Sold Copies" },
 "stat_b_remain": { ar: "المخزون المتبقي بالسنتر", en: "Remaining Center Stock" },
 "stat_b_rev": { ar: "إجمالي عائد المذكرات", en: "Total Booklets Revenue" },
 "booklet_add_title": { ar: "استلام وتسجيل ورق / مذكرة جديدة", en: "Receive & Register New Booklet" },
 "booklet_name_lbl": { ar: "اسم المذكرة / الورق", en: "Booklet / Note Name" },
 "booklet_name_plc": { ar: "مثال: مذكرة مراجعة الباب الأول...", en: "Ex: Chapter 1 Review Booklet..." },
 "booklet_qty_lbl": { ar: "العدد الكلي المستلم (نسخة)", en: "Total Received (Copies)" },
 "booklet_qty_plc": { ar: "مثال: 150", en: "Ex: 150" },
 "booklet_price_lbl": { ar: "سعر بيع النسخة (جنيه)", en: "Selling Price (EGP)" },
 "booklet_price_plc": { ar: "مثال: 50", en: "Ex: 50" },
 "booklet_save_btn": { ar: "تسجيل المذكرة وإضافتها للمخزون", en: "Save Booklet & Add to Stock" },
 "booklet_list_title": { ar: "قائمة جرد المذكرات وحركة البيع الفورية", en: "Booklets Inventory & Instant Sales" },
 "booklet_list_tip": { ar: "اضغط زر البيع عند بيع أي نسخة للتحديث الفوري", en: "Click Sale when selling any copy for instant updates" },
 "booklet_no_items": { ar: "لا توجد مذكرات مسجلة بالمخزون حالياً", en: "No booklets currently registered in stock" },
 "mkt_main_title": { ar: "حملات التسويق وإعادة الاستهداف الذكية", en: "Smart Marketing & Retargeting Campaigns" },
 "mkt_main_desc": { ar: "استهداف ذكي لجميع أرقام وداتا الطلاب المسجلة في السنتر لإطلاق حملات إعلانية لكورسات ومراجعات جديدة بضغطة زر.", en: "Smart targeting of all student data in the center to launch advertising campaigns for new courses with one click." },
 "mkt_setup_title": { ar: "إعداد شريحة الاستهداف الإعلانية", en: "Setup Campaign Targeting Segment" },
 "mkt_target_lbl": { ar: "اختر شريحة الطلاب المستهدفة", en: "Select Target Student Segment" },
 "mkt_opt_all": { ar: "جميع الطلاب الدائمين المسجلين بالسنتر", en: "All Permanent Students in Center" },
 "mkt_opt_groups": { ar: "طلاب باقة / مجموعة محددة", en: "Students of Specific Package/Group" },
 "mkt_opt_session": { ar: "داتا طلاب الحصة الفورية (المؤقتين)", en: "Session Students Data (Temporary)" },
 "mkt_opt_vip": { ar: "الطلاب أصحاب تصنيف VIP", en: "VIP Classified Students" },
 "mkt_opt_debtors": { ar: "الطلاب أصحاب الدفعات المتبقية (المديونين)", en: "Debtors Students (Remaining Balance)" },
 "mkt_select_grp_lbl": { ar: "تحديد الباقة / المجموعة", en: "Select Package / Group" },
 "mkt_opt_select": { ar: "-- اختر الباقة --", en: "-- Select Package --" },
 "mkt_msg_lbl": { ar: "نص الرسالة الإعلانية / التنبيه", en: "Message / Broadcast Body" },
 "mkt_msg_plc": { ar: "اكتب هنا نص الإعلان أو التنبيه...\r\nيمكنك استخدام الوسوم الذكية [اسم_الطالب] و [المبلغ] وسيتم استبدالها تلقائياً لكل طالب.", en: "Write your broadcast text here...\r\nYou can use smart tags [اسم_الطالب] and [المبلغ] for dynamic student replacement." },
 "mkt_vars_tip": { ar: "المتغيرات الذكية المدعومة في الرسالة:", en: "Supported Smart Variables:" },
 "mkt_click_tip": { ar: "(اضغط على الوسم لإضافته للنص)", en: "(Click tag to insert into text)" },
 "mkt_filter_btn": { ar: "تصفية وعرض داتا الأرقام المستهدفة", en: "Filter & View Target Numbers Data" },
 "mkt_broadcast_btn": { ar: "بدء الإرسال التلقائي الذكي (بفاصل زمني لمنع الحظر)", en: "Start Smart Auto Broadcast (Anti-Ban Interval)" },
 "mkt_copy_btn": { ar: "نسخ جميع أرقام الموبايل (لبرامج خارجية)", en: "Copy All Mobile Numbers (For External Apps)" },
 "mkt_broad_prep": { ar: "جاري الاستعداد لبدء البث التلقائي...", en: "Preparing to start auto broadcast..." },
 "mkt_broad_sub": { ar: "سيتم فتح نوافذ المحادثات تباعاً بفاصل زمني آمن لحماية حسابك من الحظر (Anti-Ban).", en: "Chat windows will open sequentially with a safe delay to protect your account from ban." },
 "btn_pause": { ar: "إيقاف مؤقت", en: "Pause" },
 "btn_stop": { ar: "إنهاء البث", en: "Stop Broadcast" },
 "lbl_progress": { ar: "مستوى التقدم:", en: "Progress Level:" },
 "lbl_next_win": { ar: "النافذة التالية خلال:", en: "Next Window in:" },
 "lbl_seconds": { ar: "ثواني", en: "seconds" },
 "mkt_list_title": { ar: "قائمة الأرقام المستهدفة في الحملة", en: "Target Campaign Numbers List" },
 "lbl_student_cnt": { ar: "طالب", en: "student(s)" },
 "mkt_list_tip": { ar: "اضغط زر المراسلة بجانب أي طالب لبدء الإرسال الفوري", en: "Click chat button next to any student for instant messaging" },
 "mkt_no_data": { ar: "اضغط على \"تصفية وعرض داتا الأرقام المستهدفة\" لعرض القائمة", en: "Click 'Filter & View Target Numbers Data' to display list" },
 "vaults_title": { ar: "خزائن ومحافظ السنتر (إجمالي الأرصدة)", en: "Center Vaults & Wallets (Total Balances)" },
 "vault_cash": { ar: "خزينة الكاش", en: "Cash Vault" },
 "vault_today": { ar: "تحصيل اليوم:", en: "Collected Today:" },
 "vault_total": { ar: "إجمالي المحصل:", en: "Total Collected:" },
 "vault_exp": { ar: "المصروفات:", en: "Expenses:" },
 "vault_net": { ar: "الصافي بالخزينة:", en: "Net in Vault:" },
 "vault_instapay": { ar: "خزينة إنستاباي (InstaPay)", en: "InstaPay Vault" },
 "vault_act_total": { ar: "الرصيد الفعلي:", en: "Actual Balance:" },
 "vault_wallet": { ar: "فودافون كاش والمحافظ", en: "Vodafone Cash & Wallets" },
 "btn_print": { ar: "طباعة (A4 / إيصال)", en: "Print (A4 / Receipt)" },
 "btn_photo_mode": { ar: "وضع التصوير بالهاتف", en: "Mobile Photo Mode" },
 "btn_close_rec": { ar: "إغلاق", en: "Close" },
 "photo_mode_tip": { ar: "الشاشة الآن في وضع التصوير الصافي للطالب .. اضغط هنا لإعادة إظهار أزرار الإغلاق والطباعة", en: "Screen is in clean photo mode .. Click here to restore Close & Print buttons" },
 "receipt_paid_full": { ar: "خالص السداد", en: "Paid in Full" },
 "receipt_st_details_title": { ar: "بيانات التسجيل والسداد", en: "Registration & Payment Details" },
 "receipt_lbl_name": { ar: "اسم الطالب:", en: "Student Name:" },
 "receipt_lbl_id": { ar: "كود التعريف (ID):", en: "Definition Code (ID):" },
 "receipt_lbl_class": { ar: "الباقة / المجموعة:", en: "Package / Group:" },
 "receipt_lbl_phone": { ar: "رقم الموبايل:", en: "Mobile Number:" },
 "receipt_lbl_total": { ar: "المبلغ الكلي المدفوع", en: "TOTAL PAID AMOUNT" },
 "receipt_inc_methods": { ar: "شامل طرق الدفع المسجلة بالسنتر", en: "Includes all registered payment methods" },
 "receipt_auth_title": { ar: "اعتماد إلكتروني معتمد", en: "Certified Electronic Approval" },
 "receipt_auth_sub": { ar: "توقيع الموظف / المحاسب المسئول", en: "Authorized Accountant / Employee Signature" },
 "receipt_sec_code": { ar: "رمز التحقق الأمني", en: "Security Verification Code" },

  // Missing Assistant Portal Keys
    "badge_portal_asst": { ar: "بوابة العمليات والمساعدين", en: "Operations & Assistant Portal" },
  "lbl_user_asst": { ar: "اسم المستخدم أو البريد (المساعد)", en: "Username or Email (Assistant)" },
  "plc_user_asst": { ar: "اسم المستخدم أو mohamed@studify.com", en: "Username or mohamed@studify.com" },
  "lbl_pass_asst": { ar: "كلمة المرور", en: "Password" },
  "btn_login_asst": { ar: "دخول إلى بوابة المساعد", en: "Sign In to Assistant Portal" },
  "prompt_switch_to_admin": { ar: "هل أنت مدير النظام؟", en: "Are you a System Admin?" },
  "action_switch_to_admin": { ar: "الانتقال للوحة تحكم الإدارة العليا", en: "Switch to Executive Admin Panel" },
  "trans_switching": { ar: "جاري الانتقال..", en: "Switching..." },
  "trans_switching_theme": { ar: "جاري تبديل المظهر..", en: "Switching Theme..." },
  "trans_switching_lang": { ar: "جاري تغيير اللغة..", en: "Switching Language..." },
  "sess_no_students": { ar: "لا يوجد طلاب مسجلين بالحصة لهذا اليوم", en: "No students registered for this session today" },
  "sess_class_opt": { ar: "حصة فردية", en: "Single Session" },
  "login_title_assistant": { ar: "بوابة العمليات والمساعدين", en: "Operations & Assistant Portal" },
  "login_desc_assistant": { ar: "تسجيل الحضور اليومي والمهام الميدانية", en: "Daily attendance & operational management" },
  "top_subject_lbl": { ar: "المادة:", en: "Subject:" },
  "top_subject_val": { ar: "مادة الحضور", en: "Attendance Subject" },
  "quick_subtitle": { ar: "تسجيل الحضور الفوري بالـ ID أو الباركود", en: "Instant attendance logging via ID or barcode" },
  "lbl_student_id": { ar: "معرّف الطالب (ID)", en: "Student ID" },
  "search_subtitle": { ar: "الوصول السريع لملفات وبيانات الطلاب", en: "Quick lookup for student profiles & records" },
  "lbl_open_id_direct": { ar: "فتح مباشر برقم الـ ID", en: "Direct Open by ID #" },
  "lbl_smart_search": { ar: "بحث ذكي متعدد", en: "Multi-Field Smart Search" },
  "add_subtitle": { ar: "تسجيل طالب جديد وفتح ملفه فوراً", en: "Register new student & open file immediately" },
  "lbl_new_student_id": { ar: "رقم الـ ID للطالب الجديد", en: "New Student ID #" },
  "add_student_hint": { ar: "أدخل رقم الـ ID واضغط إضافة لفتح الملف واستكمال الاسم والباقات.", en: "Enter ID number and click Add & Open to complete details." },
  "btn_print_blank_contract": { ar: "طباعة استمارة تقديم فارغة (للطوابير)", en: "Print Blank Registration Form (For Queues)" },
  "lbl_student_packages": { ar: "الباقات المشترك بها الطالب", en: "Enrolled Student Packages" },
  "btn_request_decision": { ar: "طلب قرار للمدير", en: "Request Manager Decision" },
  "btn_manage_packages": { ar: "إدارة الباقات", en: "Manage Packages" },
  "no_packages_selected": { ar: "لا توجد باقات محددة", en: "Generals assigned" },
  "lbl_parent_phone": { ar: "رقم ولي الأمر", en: "Parent Phone" },
  "lbl_class_group": { ar: "الصف الدراسي / المجموعة", en: "Grade / Group" },
  "lbl_payment_package": { ar: "باقة الدفع:", en: "Payment Package:" },
  "opt_select_package": { ar: "-- اختر الباقة --", en: "-- Select Package --" },
  "lbl_pkg_account": { ar: "حساب الباقة", en: "Package Ledger" },
  "lbl_pkg_price": { ar: "سعر الباقة", en: "Package Price" },
  "lbl_pkg_paid": { ar: "المدفوع", en: "Paid" },
  "lbl_pkg_remaining": { ar: "المتبقي", en: "Remaining" },
  "plc_new_payment_amt": { ar: "المبلغ", en: "Amount" },

  // Installments Keys
  "inst_title": { ar: "لوحة متابعة الأقساط", en: "Installments Dashboard" },
  "inst_all": { ar: "كل الأقساط المفتوحة", en: "All Active Installments" },
  "inst_overdue": { ar: "المتأخرة فقط", en: "Overdue Only" },
  "inst_upcoming": { ar: "المستحقة قريباً (7 أيام)", en: "Due Soon (7 Days)" },
  "inst_th_student": { ar: "الطالب", en: "Student" },
  "inst_th_phone": { ar: "رقم الموبايل", en: "Phone Number" },
  "inst_th_package": { ar: "الباقة", en: "Package" },
  "inst_th_installment": { ar: "اسم القسط", en: "Installment" },
  "inst_th_amount": { ar: "المبلغ", en: "Amount" },
  "inst_th_due_date": { ar: "تاريخ الاستحقاق", en: "Due Date" },
  "inst_th_status": { ar: "الحالة", en: "Status" },
  "inst_th_actions": { ar: "إجراءات", en: "Actions" },

  // Students Table & Filters
  "btn_blank_form_short": { ar: "استمارة فارغة", en: "Blank Form" },
  "btn_blank_form_new_students": { ar: "طباعة استمارة تقديم فارغة للطلاب الجدد", en: "Print Blank Form for New Students" },
  "flt_all": { ar: "الكل", en: "All" },
  "flt_debt": { ar: "عليهم متبقي", en: "With Debt" },
  "flt_paid_full": { ar: "مسدد بالكامل", en: "Fully Paid" },
  "flt_unpaid_full": { ar: "لم يسدد إطلاقاً", en: "Zero Paid (Unpaid)" },
  "flt_present_today": { ar: "حضروا اليوم", en: "Attended Today" },
  "tbl_packages": { ar: "الباقات المشترك بها", en: "Subscribed Packages" },

  // Vaults & Shift Closeout
  "vaults_title": { ar: "أرصدة الخزائن وتقفيل الشيفت", en: "Vaults Balance & Shift Closeout" },
  "vault_cash_drawer": { ar: "درج الكاش", en: "Cash Drawer" },
  "badge_cash": { ar: "كاش", en: "Cash" },
  "vault_instapay_account": { ar: "حساب إنستا باي", en: "InstaPay Account" },
  "vault_wallet_account": { ar: "فودافون كاش / محفظة", en: "Vodafone Cash / Wallet" },
  "badge_wallet": { ar: "محفظة", en: "Wallet" },
  "lbl_today_colon": { ar: "اليوم:", en: "Today:" },
  "lbl_total_all": { ar: "الإجمالي الكلي:", en: "Total All:" },

  // Placeholders
  "plc_student_name": { ar: "اسم الطالب بالكامل", en: "Full student name" },
  "plc_class_group": { ar: "اختر أو اكتب الصف الدراسي أو المجموعة..", en: "Select or type grade / group.." },

  // Notifications & User Dropdown
  "notif_title": { ar: "رسائل وإشعارات", en: "Messages & Notifications" },
  "notif_mark_read": { ar: "تحديد كمقروء", en: "Mark as Read" },
  "notif_clear_read": { ar: "مسح المقروء", en: "Clear Read" },
  "notif_no_messages": { ar: "لا توجد رسائل", en: "No messages" },
  "btn_admin_portal": { ar: "لوحة الإدارة (Admin)", en: "Admin Dashboard" },
  "btn_mute_sounds": { ar: "كتم الأصوات", en: "Mute Sounds" },
  "btn_system_logout": { ar: "خروج من النظام", en: "Logout" },

  // Decision Modal
  "modal_dec_req_title": { ar: "تقديم طلب قرار للمدير (خصم / إعفاء)", en: "Submit Decision Request to Manager" },
  "modal_dec_req_st_lbl": { ar: "رقم الطالب (ID) أو الاسم", en: "Student ID or Name" },
  "modal_dec_req_st_plc": { ar: "ادخل كود الطالب أو ابحث بالاسم...", en: "Enter student ID or search by name..." },
  "modal_dec_req_req_lbl": { ar: "المطلوب", en: "Required" },
  "modal_dec_req_disc_lbl": { ar: "الخصم الحالي", en: "Current Discount" },
  "modal_dec_req_rem_lbl": { ar: "المتبقي", en: "Remaining" },
  "modal_dec_req_type_lbl": { ar: "نوع القرار المطلوب", en: "Requested Decision Type" },
  "modal_dec_req_type_disc": { ar: "خصم مالي محدد (جنيه)", en: "Specific Financial Discount (EGP)" },
  "modal_dec_req_type_exemp": { ar: "إعفاء كامل من المصاريف (100%)", en: "Full Fee Exemption (100%)" },
  "modal_dec_req_amt_lbl": { ar: "قيمة الخصم المقترحة (جنيه)", en: "Proposed Discount Amount (EGP)" },
  "modal_dec_req_rsn_lbl": { ar: "سبب الطلب / ملاحظات للمدير", en: "Request Reason / Notes for Manager" },
  "modal_dec_req_rsn_plc": { ar: "اكتب سبب طلب الخصم أو الإعفاء...", en: "Type reason for request..." },
  "modal_dec_req_cancel": { ar: "إلغاء", en: "Cancel" },
  "modal_dec_req_submit": { ar: "إرسال الطلب للمدير", en: "Submit Request to Manager" },

  // Subject Selection Modal
  "modal_sub_select_title": { ar: "اختر مادة الحضور", en: "Select Attendance Subject" },
  "modal_sub_select_desc": { ar: "حدد المادة الدراسية لتسجيل الحضور ومتابعة الحصص للطلاب", en: "Select subject to log attendance and track sessions" },
  "modal_sub_select_close": { ar: "إغلاق النافذة", en: "Close Window" },

  // Package Selection Modal
  "psm_desc_prefix": { ar: "تحديد الباقات والمجموعات للطالب: ", en: "Assign packages & groups for student: " },
  "psm_total_cost": { ar: "إجمالي الباقات", en: "Total Packages" },
  "psm_total_paid": { ar: "المسدد", en: "Total Paid" },
  "psm_total_remain": { ar: "المتبقي", en: "Total Remaining" },
  "msg_deposit": { ar: "تم تسجيل الدفعة وإيداع المبلغ بنجاح", en: "Payment recorded and deposited successfully" },

  // Hard Lock Screen
  "lock_shift_status": { ar: "حالة الشيفت: مغلق ومجمد", en: "Shift Status: Locked & Frozen" },
  "lock_shift_title": { ar: "اليومية معلقة ومغلقة من قِبل الإدارة", en: "Daily Shift Suspended by Management" },
  "lock_shift_desc": { ar: "تم إيقاف اليومية من قِبل المدير العام. تم تجميد كافة العمليات لحين فتح الشيفت مجدداً.", en: "The daily shift has been closed by the manager. Operations are paused until unlocked." },
  "lock_shift_sync": { ar: "المزامنة حية ولحظية: سيفتح النظام تلقائياً على شاشتك فور تفعيل المدير لليومية بدون الحاجة لإعادة تشغيل التطبيق.", en: "Live real-time sync: The system will automatically unlock once the manager enables the shift." },
  "lock_shift_check_btn": { ar: "التحقق من حالة الشيفت الآن", en: "Check Shift Status Now" },

};

 // ==========================================
 // 4. CORE UTILITY FUNCTIONS & PREMIUM UX
 // ==========================================
 function $(id) { return document.getElementById(id); }
 
 function on(id, event, handler) { 
 const el = $(id); 
 if(el) el.addEventListener(event, handler); 
 }

 function t(key) { return (dict[key] && dict[key][currentLang]) ? dict[key][currentLang] : key; }
 function nowDateStr() { return new Date().toISOString().split('T')[0]; }
  window.nowDateStr = nowDateStr;
 function prettyDate(d) { return d ? d.split("-").reverse().join("-") : "—"; }
 function toInt(v) { if (typeof v === 'object' && v !== null) return toInt(v.price || 0); const n = parseInt(v); return isNaN(n) ? 0 : n; }
  window.toInt = toInt;



 window.getPkgDetails = function(pkgName) {
    if (!pkgName || !groupFees || !groupFees[pkgName]) {
      return { name: pkgName || (currentLang === "ar" ? "عام" : "General"), price: 0, expiryType: "time", durationDays: 0, sessionLimit: 0, startDate: "", endDate: "", subject: "" };
    }
    const val = groupFees[pkgName];
    if (typeof val === "object" && val !== null) {
      return {
        name: pkgName,
        price: toInt(val.price || 0),
        subject: val.subject || "",
        expiryType: val.expiryType || "time",
        startDate: val.startDate || "",
        endDate: val.endDate || "",
        durationDays: toInt(val.durationDays || 0),
        sessionLimit: toInt(val.sessionLimit || 0)
      };
    }
    return {
      name: pkgName,
      price: toInt(val || 0),
      subject: "",
      expiryType: "time",
      durationDays: 0,
      sessionLimit: 0,
      startDate: "",
      endDate: ""
    };
  };

 window.getPkgPrice = function(pkgName) {
   return window.getPkgDetails(pkgName).price;
 };

 window.checkStudentPackageStatus = function(st) {
   if (!st || !st.className || !groupFees || !groupFees[st.className]) {
     return { status: "none", text: "", badgeClass: "", isExpiring: false, isExpired: false };
   }
   const pkg = window.getPkgDetails(st.className);
   if (pkg.expiryType === "none") {
     return { status: "valid", text: "نشطة", badgeClass: "status-badge-success", isExpiring: false, isExpired: false };
   }

   let timeExpired = false;
   let timeWarning = false;
   let daysLeft = null;

   if (pkg.expiryType === "time" || pkg.expiryType === "both") {
     const startDateStr = st.pkgStartDate || st.joinedDate || nowDateStr();
     const startDate = new Date(startDateStr);
     const now = new Date();
     const diffTime = now - startDate;
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
     daysLeft = pkg.durationDays - diffDays;

     if (daysLeft <= 0) {
       timeExpired = true;
     } else if (daysLeft <= 5) {
       timeWarning = true;
     }
   }

   let sessionsExpired = false;
   let sessionsWarning = false;
   let sessionsLeft = null;

   if (pkg.expiryType === "sessions" || pkg.expiryType === "both") {
     const usedSessions = (st.attendanceDates || []).length;
     sessionsLeft = pkg.sessionLimit - usedSessions;
     if (sessionsLeft <= 0) {
       sessionsExpired = true;
     } else if (sessionsLeft <= 2) {
       sessionsWarning = true;
     }
   }

   if (timeExpired || sessionsExpired) {
     let reason = timeExpired ? "انتهت المدة" : "انتهت الحصص";
     return {
       status: "expired",
       text: "الباقة منتهية (" + reason + ")",
       badgeClass: "status-badge-danger",
       isExpiring: false,
       isExpired: true,
       daysLeft,
       sessionsLeft
     };
   }

   if (timeWarning || sessionsWarning) {
     let reason = timeWarning ? `متبقي ${daysLeft} يوم` : `متبقي ${sessionsLeft} حصة`;
     return {
       status: "warning",
       text: "على وشك الانتهاء (" + reason + ")",
       badgeClass: "status-badge-warning",
       isExpiring: true,
       isExpired: false,
       daysLeft,
       sessionsLeft
     };
   }

   return {
     status: "valid",
     text: "نشطة",
     badgeClass: "status-badge-success",
     isExpiring: false,
     isExpired: false,
     daysLeft,
     sessionsLeft
   };
 };

 function getTagColor(str) {
 if (!str) return '#3498db';
 const colors = ['#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];
 let hash = 0;
 for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
 return colors[Math.abs(hash) % colors.length];
 }


 // -- Premium UX Functions --
 function triggerShake(inputId) {
 const el = $(inputId);
 if(el) {
 el.classList.remove("error-shake");
 void el.offsetWidth; // Refresh DOM to restart animation
 el.classList.add("error-shake");
 setTimeout(() => el.classList.remove("error-shake"), 400);
 }
 }

 function triggerEdgeFlash() {
 document.body.classList.add("flash-green");
 setTimeout(() => document.body.classList.remove("flash-green"), 500);
 }

 function showFullscreenFeedback(isSuccess, isAlreadyPresent = false) {
 let box = $("fullscreenFeedback");
 let icon = $("feedbackIcon");
 if(!box || !icon) return;
 box.classList.remove("hidden");
 void box.offsetWidth;
 if (isSuccess) {
 icon.innerHTML = "";
 } else if (isAlreadyPresent) {
 icon.innerHTML = "";
 } else {
 icon.innerHTML = "";
 }
 setTimeout(() => { box.classList.add("hidden"); }, 400);
 }

function showToast(msg, type = "success") {
   return window.showToast(msg, type);
 }

 function showUndoToast(msg, onUndo) {
 let container = $("toastContainer"); if(!container) return;
 const toast = document.createElement("div"); 
 toast.className = `toast toast-warning undo-toast`;
 const undoTxt = currentLang === 'ar' ? 'تراجع ' : 'Undo ';
 toast.innerHTML = `<span><i class="fa-solid fa-circle-info"></i> ${msg}</span> <button class="btn smallBtn" id="tempUndoBtn" style="margin-right:15px; padding:5px 10px;">${undoTxt}</button>`;
 container.appendChild(toast); 
 let isUndone = false;
 toast.querySelector("#tempUndoBtn").onclick = () => { 
 isUndone = true; onUndo(); toast.remove(); 
 };
 setTimeout(() => { 
 if(!isUndone) { 
 toast.style.animation = "slideOut 0.3s forwards"; 
 setTimeout(() => toast.remove(), 300); 
 } 
 }, 5000);
 }

 function fireConfetti() {
 if (!document.getElementById("confetti-styles")) {
 const style = document.createElement("style");
 style.id = "confetti-styles";
 style.innerHTML = `
 .confetti-particle {
 position: fixed;
 top: -20px;
 z-index: 999999;
 pointer-events: none;
 animation: fall linear forwards;
 box-shadow: 0 2px 5px rgba(0,0,0,0.2);
 }
 @keyframes fall {
 0% { transform: translateY(0) rotate(0deg); opacity: 1; }
 100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
 }
 .celebration-popup {
 position: fixed;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 background: linear-gradient(135deg, #1e3a8a, #2563eb);
 color: #ffffff;
 padding: 30px 50px;
 border-radius: 20px;
 box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7), 0 0 30px rgba(251, 191, 36, 0.6);
 border: 3px solid #fbbf24;
 z-index: 9999999;
 text-align: center;
 animation: popInOut 4.2s ease-in-out forwards;
 }
 @keyframes popInOut {
 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
 10% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
 15% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
 85% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
 100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
 }
 `;
 document.head.appendChild(style);
 }

 const popup = document.createElement("div");
 popup.className = "celebration-popup";
 popup.innerHTML = `
 <div style="font-size: 3.8em; margin-bottom: 12px;"></div>
 <h2 style="margin: 0; font-size: 2em; font-weight: 900; color: #fbbf24;">اكتمل سداد الباقة بالكامل</h2>
 <p style="margin: 12px 0 0 0; font-size: 1.2em; opacity: 0.95;">ألف مبروك .. أصبح حساب الطالب خالص السداد 100% </p>
 `;
 document.body.appendChild(popup);
 setTimeout(() => popup.remove(), 4200);

 const colors = ['#2563eb', '#3b82f6', '#fbbf24', '#10b981', '#ffffff', '#f59e0b', '#60a5fa'];
 for(let i = 0; i < 75; i++) {
 const conf = document.createElement("div"); 
 conf.className = "confetti-particle";
 
 const size = Math.floor(Math.random() * 12) + 8;
 conf.style.width = size + "px";
 conf.style.height = (Math.random() > 0.5 ? size : size * 1.5) + "px";
 if(Math.random() > 0.6) conf.style.borderRadius = "50%";
 
 conf.style.left = Math.random() * 100 + "vw"; 
 conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
 conf.style.animationDuration = (Math.random() * 2.5 + 1.5) + "s"; 
 document.body.appendChild(conf);
 setTimeout(() => conf.remove(), 4000);
 }
 }
 window.isMuted = (localStorage.getItem("ca_muted") === "1");

 // Studify Studio Real MP3 Sound Engine: uses window.AssistantSounds and window.playSound from sounds.js.

 function makeEmptyStudent(id) {
 return { id: id, name: "", className: "", phone: "", paid: 0, notes: "", rank: "normal", joinedDate: nowDateStr(), attendanceDates: [] };
 }

 // ==========================================
 // === MOBILE SIDEBAR BACK-BUTTON HISTORY LOGIC ===
 // ==========================================
 function openMobileSidebar() {
 var sidebar = $("sidebarNav");
 var overlay = $("sidebarOverlay");
 if(sidebar && !sidebar.classList.contains("mobile-open")) {
 sidebar.classList.add("mobile-open");
 if(overlay) overlay.classList.add("active");
 history.pushState({ sidebarOpen: true }, "", "#sidebar");
 }
 }

 function closeMobileSidebar(fromPopstate) {
 var sidebar = $("sidebarNav");
 var overlay = $("sidebarOverlay");
 if(sidebar && sidebar.classList.contains("mobile-open")) {
 sidebar.classList.remove("mobile-open");
 if(overlay) overlay.classList.remove("active");
 if(!fromPopstate && history.state && history.state.sidebarOpen) {
 history.back();
 }
 }
 }

 window.addEventListener("popstate", function(e) {
 var sidebar = $("sidebarNav");
 if(sidebar && sidebar.classList.contains("mobile-open")) {
 closeMobileSidebar(true);
 }
 });

 // ==========================================
 // 5. GLOBAL NAVIGATION & TABS
 // ==========================================
 window.switchTab = function(tabId) {
 // Hard Security Guard: Block locked tabs for assistants
 if (currentUserRole !== "admin" && typeof currentPermissions !== "undefined") {
   if (tabId === "Packages" && currentPermissions.can_manage_packages === false) {
     showToast("عفواً، قسم الباقات والأسعار مقفل من المدير", "err");
     return;
   }
   if (tabId === "Syllabus" && currentPermissions.can_access_syllabus === false) {
     showToast("عفواً، قسم المنهج مقفل من المدير", "err");
     return;
   }
   if (tabId === "Reports" && currentPermissions.can_view_reports === false) {
     showToast("عفواً، قسم التقارير مقفل من المدير", "err");
     return;
   }
   if (tabId === "Marketing") {
     if (window.SUBSCRIPTION && window.SUBSCRIPTION.loaded && !window.SUBSCRIPTION.marketingEnabled) {
       showToast("حملات التسويق متاحة حصرياً في الخطة الذهبية - يرجى ترقية باقة الاشتراك للوصول إلى هذه الميزة", "info");
       return;
     }
     if (currentPermissions.can_access_marketing === false) {
       showToast("عفواً، قسم أدوات التسويق مقفل من المدير", "err");
       return;
     }
   }
   if (tabId === "SessionStudents" && currentPermissions.can_access_session_students === false) {
     showToast("عفواً، قسم طلاب الحصة مقفل من المدير", "err");
     return;
   }
   if (tabId === "Booklets" && currentPermissions.can_access_booklets === false) {
     showToast("عفواً، قسم مخزون المذكرات مقفل من المدير", "err");
     return;
   }
   if ((tabId === "Settings" || tabId === "Admin") && currentPermissions.can_access_settings === false) {
     showToast("عفواً، قسم الإعدادات مقفل من المدير", "err");
     return;
   }
 }

 document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
 const target = $("sec" + tabId); 
 if(target) target.classList.remove('hidden');
 document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
 const activeBtn = $("btnTab" + tabId); 
 if(activeBtn) {
   if (typeof AssistantSounds !== "undefined") {
     if (tabId === "Home") {
       AssistantSounds.pageAttendance();
     } else if (tabId === "Students") {
       AssistantSounds.pageStudents();
     } else if (tabId === "Syllabus" || tabId === "Packages") {
       AssistantSounds.pageSyllabus();
     } else {
       AssistantSounds.tabSwitch();
     }
   }
   activeBtn.classList.add('active');
   const activeGroup = activeBtn.closest('.nav-group');
   if (activeGroup) {
     document.querySelectorAll('.nav-group').forEach(g => g.classList.add('collapsed'));
     activeGroup.classList.remove('collapsed');
   }
 }
 if (tabId === "Marketing") {
   if (typeof window.populateMarketingGroups === 'function') window.populateMarketingGroups();
   if (typeof window.filterCampaignTarget === 'function') window.filterCampaignTarget();
 }
 if (tabId === "Settings" || tabId === "Admin") {
   if (typeof window.initCenterNotebook === 'function') window.initCenterNotebook();
 }
 closeMobileSidebar(false);
 };

 window.isStudentRegistered = function(st) {
   if (!st) return false;
   const hasName = Boolean(st.name && st.name.trim() !== "");
   const hasPhone = Boolean(st.phone && st.phone.trim() !== "");
   const hasPaid = Number(st.paid || 0) > 0;
   const hasPayments = Array.isArray(st.payments) && st.payments.length > 0;
   const hasAttendance = Array.isArray(st.attendanceDates) && st.attendanceDates.length > 0;
   const hasClass = Boolean(st.className && st.className.trim() !== "");
   return hasName || hasPhone || hasPaid || hasPayments || hasAttendance || hasClass;
 };
 const isStudentRegistered = window.isStudentRegistered;

 window.showStudentCard = function() {
   const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
   if (card) {
     card.classList.remove("hidden");
   }
 };

 window.hideStudentCard = function() {
   if (typeof AssistantSounds !== "undefined") AssistantSounds.studentClose();
   if (window.isPendingNewStudent && students[window.isPendingNewStudent]) {
     const pendingSt = students[window.isPendingNewStudent];
     if (!window.isStudentRegistered(pendingSt)) {
       if (toInt(window.isPendingNewStudent) > BASE_MAX_ID) {
         delete students[window.isPendingNewStudent];
       } else {
         students[window.isPendingNewStudent] = makeEmptyStudent(toInt(window.isPendingNewStudent));
       }
     }
     window.isPendingNewStudent = null;
   }
   currentId = null;
   window.currentId = null;
   window.justAddedStudentId = null;
   const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
   if (card) {
     card.classList.add("hidden");
   card.classList.remove("rank-card-vip", "rank-card-warn", "rank-card-normal");
   }
   if ($("openId")) $("openId").value = "";
   if ($("searchAny")) $("searchAny").value = "";
   if ($("searchMsg")) $("searchMsg").style.display = "none";
   if ($("notesLockOverlay")) $("notesLockOverlay").style.display = "flex";
   if ($("newBadge")) $("newBadge").classList.add("hidden");
   if ($("studentIdPill")) $("studentIdPill").textContent = "ID: —";
   if ($("todayStatus")) $("todayStatus").textContent = "—";
   if ($("daysCount")) $("daysCount").textContent = "—";
   if ($("stName")) $("stName").value = "";
   if ($("stPhone")) $("stPhone").value = "";
   if ($("stParentPhone")) $("stParentPhone").value = "";
   if ($("stClass")) $("stClass").value = "";
   window.scrollTo({ top: 0, behavior: "smooth" });
 };

 window.extOpen = function(id) {
 if (typeof AssistantSounds !== "undefined") AssistantSounds.studentOpen();
 if(!id || !students[String(id)]) {
 showToast(currentLang === 'ar' ? "الطالب غير مسجل" : "Student not found", "err");
 return;
 }
 
 window.switchTab('Home'); 
 if($("searchAny")) $("searchAny").value = ""; 
 if($("searchMsg")) $("searchMsg").style.display = "none";
 
 window.showStudentCard();
 updateStudentUI(String(id)); 
 
 const card = document.querySelector(".studentCard"); 
 if(card) {
 setTimeout(() => {
 card.scrollIntoView({behavior: "smooth", block: "start"}); 
 }, 100);
 }
 };

 // ==========================================
 // 6. DATA MANAGEMENT (Storage Layer)
 // ==========================================
 async function saveAll() {
  try {
    hasUnsavedChanges = true;
    updateSyncUI('pending', 'جاري الحفظ...');

    // Save to IndexedDB (encrypted, instant 0ms, offline-ready)
    const currentNbVal = $("centerNotebook") ? $("centerNotebook").value : (centerNotebookContent || localStorage.getItem(K_NOTEBOOK) || "");
    localStorage.setItem(K_NOTEBOOK, currentNbVal);
    await Promise.all([
      secureSave(K_STUDENTS, students),
      secureSave(K_ATT_BY_DATE, attByDate),
      secureSave(K_REVENUE, revenueByDate),
      secureSave(K_GROUP_FEES, groupFees),
      secureSave(K_EXPENSES, expensesByDate),
      secureSave(K_DELETED, deletedStudents),
      secureSave(K_SYLLABUS, syllabusData),
      secureSave(K_EVAL, evalData),
      secureSave(K_SESSION_STUDENTS, sessionStudentsByDate),
      secureSave(K_VAULT_TRANSFERS, vaultTransfers),
      secureSave(K_BOOKLETS, bookletsStock),
      secureSave(K_NOTEBOOK, currentNbVal)
    ]);

    updateTopStats(); updateFinanceSummary();
    if (typeof renderCharts === "function") renderCharts();
    if (typeof renderList === "function") renderList(true);
    if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard();
    if (typeof renderManagerTermReport === "function") renderManagerTermReport();
    if (typeof populatePackages === "function") populatePackages();
    if (typeof updateManagerPermissionsUI === "function") updateManagerPermissionsUI();
    if (typeof renderReportsPage === "function") renderReportsPage();

    // Push to Supabase
    if (window.supabaseClient && navigator.onLine) {
      updateSyncUI('syncing', 'جاري المزامنة مع السحابة...');
      const mid = window.CURRENT_MANAGER_ID || "ahmedqutb11232_gmail_com";

      // 1. Prepare Students array (never skip students that have data or were modified)
      const allStudentsList = Object.values(students || {}).concat(Object.values(deletedStudents || {})).filter(s => s && s.id && (s.name || s.phone || s.parentPhone || s.className || (s.packages && s.packages.length > 0) || (s.attendanceDates && s.attendanceDates.length > 0) || s.lastModified));
      const studentRows = allStudentsList.map(st => ({
        id: String(st.id),
        name: st.name || '',
        phone: st.phone || '',
        parent_phone: st.parentPhone || '',
        class_name: st.className || '',
        payment_plan: st.paymentPlan || 'cash',
        paid: toInt(st.paid) || 0,
        discount: toInt(st.discount) || 0,
        notes: st.notes || '',
        status: st.status || (deletedStudents[st.id] ? 'deleted' : 'active'),
        installments: st.installments || [],
        payments: st.payments || [],
        attendance_dates: Array.from(new Set(st.attendanceDates || [])),
        last_modified: st.lastModified || Date.now()
      }));

      // 2. Prepare Packages array
      const packageRows = Object.keys(groupFees || {}).map(pkgName => {
        const p = groupFees[pkgName];
        const isObj = typeof p === 'object' && p !== null;
        return {
          name: pkgName,
          price: toInt(isObj ? p.price : p) || 0,
          has_installments: isObj ? !!p.hasInstallments : false,
          installment_price: toInt(isObj ? p.installmentPrice : 0) || 0
        };
      });

      // 3. Prepare Booklets array
      const bookletRows = Object.keys(bookletsStock || {}).map(bId => {
        const b = bookletsStock[bId];
        return {
          id: String(bId),
          name: b.name || '',
          price: toInt(b.price) || 0,
          stock: parseInt(b.stock) || 0,
          sales: b.sales || []
        };
      });

      // 4. Map student packages to persist in settings.config
      const studentPackagesMap = {};
      Object.values(students || {}).forEach(st => {
        if (st && st.id && Array.isArray(st.packages) && st.packages.length > 0) {
          studentPackagesMap[String(st.id)] = st.packages;
        }
      });

      // 5. Map student ranks (VIP / Warn / Normal) to persist in settings.config
      const studentRanksMap = {};
      Object.values(students || {}).forEach(st => {
        if (st && st.id) {
          studentRanksMap[String(st.id)] = st.rank || 'normal';
        }
      });

      // 6. Map student package discounts to persist in settings.config
      const studentPkgDiscountsMap = {};
      Object.values(students || {}).forEach(st => {
        if (st && st.id && st.packageDiscounts && Object.keys(st.packageDiscounts).length > 0) {
          studentPkgDiscountsMap[String(st.id)] = st.packageDiscounts;
        }
      });

      // Fetch latest settings config to merge safely without overwriting other keys (like daily_approval_map)
      let existingConfig = {};
      try {
        const { data: curSetting } = await window.supabaseClient.from('settings').select('config').eq('id', 1).maybeSingle();
        if (curSetting && curSetting.config) existingConfig = curSetting.config;
      } catch (err) {
        console.warn("Could not fetch current config for merge:", err);
      }

      const mergedConfig = Object.assign({}, existingConfig, {
        settings: { lastModified: Date.now() },
        eval_data: evalData || {},
        revenue_by_date: revenueByDate || {},
        expenses_by_date: expensesByDate || {},
        session_students_by_date: sessionStudentsByDate || {},
        vault_transfers: vaultTransfers || [],
        att_by_date: attByDate || {},
        syllabus: (syllabusData || []).map(s => ({
          title: s.title || s.name || '',
          name: s.name || s.title || '',
          status: s.status || 'not_started',
          notes: s.notes || '',
          date: s.date || s.updated_at || nowDateStr(),
          updated_at: s.updated_at || new Date().toISOString()
        })),
        syllabus_data: (syllabusData || []).map(s => ({
          title: s.title || s.name || '',
          name: s.name || s.title || '',
          status: s.status || 'not_started',
          notes: s.notes || '',
          date: s.date || s.updated_at || nowDateStr(),
          updated_at: s.updated_at || new Date().toISOString()
        })),
        student_packages: Object.assign({}, existingConfig.student_packages || {}, studentPackagesMap),
        student_ranks: Object.assign({}, existingConfig.student_ranks || {}, studentRanksMap),
        student_package_discounts: Object.assign({}, existingConfig.student_package_discounts || {}, studentPkgDiscountsMap),
        group_fees: groupFees || {},
        center_notebook: currentNbVal
      });

      // Execute upserts in parallel
      const promises = [
        window.supabaseClient.from('settings').update({
          config: mergedConfig,
          updated_at: new Date().toISOString()
        }).eq('id', 1)
      ];

      if (studentRows.length > 0) {
        promises.push(window.supabaseClient.from('students').upsert(studentRows, { onConflict: 'id' }));
      }
      if (packageRows.length > 0) {
        promises.push(window.supabaseClient.from('packages').upsert(packageRows, { onConflict: 'name' }));
      }
      if (bookletRows.length > 0) {
        promises.push(window.supabaseClient.from('booklets').upsert(bookletRows, { onConflict: 'id' }));
      }

      const results = await Promise.all(promises);
      for (const res of results) {
        if (res && res.error) {
          console.error("Supabase operation error:", res.error);
          throw res.error;
        }
      }
      hasUnsavedChanges = false;
      updateSyncUI('online', 'متصل ومتزامن ');
    } else {
      updateSyncUI('pending', 'تم الحفظ محلياً');
    }
  } catch(e) {
    console.error("saveAll error:", e);
    showToast("حدث خطأ أثناء حفظ البيانات.", "err");
  }
}

async function saveAttendanceOnly() {
  try {
    hasUnsavedChanges = true;
    updateSyncUI('pending', 'جاري حفظ الحضور...');

    await Promise.all([
      secureSave(K_STUDENTS, students),
      secureSave(K_ATT_BY_DATE, attByDate),
      secureSave(K_SESSION_STUDENTS, sessionStudentsByDate)
    ]);
    updateTopStats();

    if (window.supabaseClient && navigator.onLine) {
      updateSyncUI('syncing', 'جاري المزامنة...');
      const mid = window.CURRENT_MANAGER_ID || "ahmedqutb11232_gmail_com";

      const studentRows = Object.values(students || {}).filter(s => s && s.id && (s.name || s.phone || s.parentPhone || s.className || (s.packages && s.packages.length > 0) || (s.attendanceDates && s.attendanceDates.length > 0) || s.lastModified)).map(st => ({
        id: String(st.id),
        name: st.name || '',
        phone: st.phone || '',
        parent_phone: st.parentPhone || '',
        class_name: st.className || '',
        payment_plan: st.paymentPlan || 'cash',
        paid: toInt(st.paid) || 0,
        discount: toInt(st.discount) || 0,
        notes: st.notes || '',
        status: st.status || 'active',
        installments: st.installments || [],
        payments: st.payments || [],
        attendance_dates: Array.from(new Set(st.attendanceDates || [])),
        last_modified: Date.now()
      }));

      // Fetch latest settings config to merge safely
      let existingConfig = {};
      try {
        const { data: curSetting } = await window.supabaseClient.from('settings').select('config').eq('id', 1).maybeSingle();
        if (curSetting && curSetting.config) existingConfig = curSetting.config;
      } catch (err) {}

      const mergedConfig = Object.assign({}, existingConfig, {
        settings: { lastModified: Date.now() },
        revenue_by_date: revenueByDate || {},
        att_by_date: attByDate || {},
        session_students_by_date: sessionStudentsByDate || {}
      });

      const attendancePromises = [
        window.supabaseClient.from('settings').update({
          config: mergedConfig,
          updated_at: new Date().toISOString()
        }).eq('id', 1)
      ];

      if (studentRows.length > 0) {
        attendancePromises.push(
          window.supabaseClient.from('students').upsert(studentRows, { onConflict: 'id' })
        );
      }

      const attResults = await Promise.all(attendancePromises);
      for (const res of attResults) {
        if (res && res.error) throw res.error;
      }
      hasUnsavedChanges = false;
      updateSyncUI('online', 'متصل ومتزامن ');
    }
  } catch(e) {
    console.error("saveAttendanceOnly error:", e);
    showToast("حدث خطأ أثناء حفظ البيانات.", "err");
  }
}

async function loadAll() {
  try {
    let fromCloud = false;

    // Step 1: Load local data from IndexedDB first (instant, offline-ready)
    students = await secureLoad(K_STUDENTS, {});
    deletedStudents = await secureLoad(K_DELETED, {});
    attByDate = await secureLoad(K_ATT_BY_DATE, {});
    revenueByDate = await secureLoad(K_REVENUE, {});
    expensesByDate = await secureLoad(K_EXPENSES, {});
    groupFees = await secureLoad(K_GROUP_FEES, {});
    syllabusData = await secureLoad(K_SYLLABUS, []);
    evalData = await secureLoad(K_EVAL, {});
    sessionStudentsByDate = await secureLoad(K_SESSION_STUDENTS, {});
    vaultTransfers = await secureLoad(K_VAULT_TRANSFERS, []);
    bookletsStock = await secureLoad(K_BOOKLETS, {});
    centerNotebookContent = await secureLoad(K_NOTEBOOK, localStorage.getItem(K_NOTEBOOK) || "");

    // Normalize any legacy 'عام' / 'General' in local students
    Object.values(students || {}).forEach(s => {
      if (s) {
        if (s.className === 'عام' || s.className === 'General' || s.className === 'عام' || s.className === 'General') s.className = '';
        if (Array.isArray(s.packages)) {
          s.packages = s.packages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'عام' && p !== 'General');
        }
      }
    });
    console.log("[loadAll] Local data loaded from IndexedDB");

    // Step 2: Try to fetch from Supabase and merge
    try {
      if (window.supabaseClient && navigator.onLine) {
        updateSyncUI('syncing', 'جاري جلب البيانات من السحابة...');
        const mid = window.CURRENT_MANAGER_ID || "ahmedqutb11232_gmail_com";

        // Fetch students, packages, booklets, settings data in parallel
        const [stRes, pkgRes, bRes, centerRes] = await Promise.all([
          window.supabaseClient.from('students').select('*').not('id', 'is', null),
          window.supabaseClient.from('packages').select('*'),
          window.supabaseClient.from('booklets').select('*').not('id', 'is', null),
          window.supabaseClient.from('settings').select('*').eq('id', 1).maybeSingle()
        ]);

        const cd = (centerRes && centerRes.data) ? centerRes.data : {};
        const cfg = cd.config || {};
        const studentPackagesMap = cfg.student_packages || {};
        const studentRanksMap = cfg.student_ranks || {};
        const studentPackageDiscountsMap = cfg.student_package_discounts || {};

        // 1. STUDENTS: Synchronize directly with cloud data
        if (!stRes.error && Array.isArray(stRes.data)) {
          const newStudents = {};
          const newDeleted = {};
          for (let i = BASE_MIN_ID; i <= BASE_MAX_ID; i++) {
            newStudents[String(i)] = makeEmptyStudent(i);
          }

          stRes.data.forEach(row => {
            const isCloudEmpty = (!row.name || row.name.trim() === '') && (!row.phone || row.phone.trim() === '');
            if (isCloudEmpty) return;

            let cName = row.class_name || row.className || '';
            if (cName === 'عام' || cName === 'General' || cName === 'عام' || cName === 'General') cName = '';

            let restoredPackages = (studentPackagesMap && studentPackagesMap[row.id]) || row.packages || [];
            if (typeof restoredPackages === 'string') restoredPackages = [restoredPackages];
            if (!Array.isArray(restoredPackages)) restoredPackages = [];
            restoredPackages = restoredPackages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'عام' && p !== 'General');

            const restoredRank = (studentRanksMap && studentRanksMap[row.id]) || row.rank || 'normal';

            const restoredDiscounts = (studentPackageDiscountsMap && studentPackageDiscountsMap[row.id]) || row.packageDiscounts || {};
            const stObj = {
              id: row.id,
              name: row.name || '',
              phone: row.phone || '',
              parentPhone: row.parent_phone || row.parentPhone || '',
              className: cName,
              paymentPlan: row.payment_plan || 'cash',
              paid: Number(row.paid) || 0,
              discount: Number(row.discount) || 0,
              packageDiscounts: restoredDiscounts,
              notes: row.notes || '',
              status: row.status || 'active',
              rank: restoredRank,
              packages: Array.isArray(restoredPackages) ? restoredPackages : [],
              installments: row.installments || [],
              payments: row.payments || [],
              attendanceDates: Array.from(new Set(row.attendance_dates || [])),
              lastModified: row.last_modified || Date.now()
            };

            if (row.status === 'deleted') {
              newDeleted[row.id] = stObj;
            } else {
              newStudents[row.id] = stObj;
            }

            // Reconstruct attByDate from student attendanceDates
            (row.attendance_dates || []).forEach(d => {
              if (!attByDate[d]) attByDate[d] = [];
              if (!attByDate[d].includes(String(row.id))) attByDate[d].push(String(row.id));
            });
          });

          students = newStudents;
          deletedStudents = newDeleted;
          await secureSave(K_STUDENTS, students);
          await secureSave(K_DELETED, deletedStudents);
        }

        // 2. PACKAGES: Cloud packages table is the single source of truth
        if (!pkgRes.error && Array.isArray(pkgRes.data)) {
          const cfgGroupFees = cfg.group_fees || {};
          const loadedGroupFees = {};

          pkgRes.data.forEach(p => {
            const extra = cfgGroupFees[p.name] || {};
            loadedGroupFees[p.name] = {
              name: p.name,
              subject: p.subject || extra.subject || p.name || '',
              price: Number(p.price) || 0,
              hasInstallments: !!p.has_installments,
              installmentPrice: Number(p.installment_price) || 0,
              expiryType: extra.expiryType || 'none',
              startDate: extra.startDate || '',
              endDate: extra.endDate || '',
              sessionLimit: extra.sessionLimit || 0
            };
          });

          Object.keys(cfgGroupFees).forEach(pkgName => {
            if (!loadedGroupFees[pkgName]) {
              const extra = cfgGroupFees[pkgName] || {};
              loadedGroupFees[pkgName] = {
                name: pkgName,
                subject: extra.subject || pkgName || '',
                price: Number(extra.price) || 0,
                hasInstallments: !!extra.hasInstallments,
                installmentPrice: Number(extra.installmentPrice) || 0,
                expiryType: extra.expiryType || 'none',
                startDate: extra.startDate || '',
                endDate: extra.endDate || '',
                sessionLimit: extra.sessionLimit || 0
              };
            }
          });

          groupFees = loadedGroupFees;
          await secureSave(K_GROUP_FEES, groupFees);
        }

        // 3. BOOKLETS: Cloud booklets table is single source of truth
        if (!bRes.error && Array.isArray(bRes.data)) {
          const loadedBooklets = {};
          bRes.data.forEach(b => {
            loadedBooklets[b.id] = {
              id: b.id,
              name: b.name,
              price: Number(b.price) || 0,
              stock: parseInt(b.stock) || 0,
              sales: b.sales || []
            };
          });
          bookletsStock = loadedBooklets;
          await secureSave(K_BOOKLETS, bookletsStock);
        }

        if (!centerRes.error && centerRes.data) {
          const evalSrc = cd.eval_data || cfg.eval_data;
          if (evalSrc) evalData = evalSrc;
          const sylSrc = cd.syllabus_data || cfg.syllabus_data || cfg.syllabus;
          if (sylSrc && Array.isArray(sylSrc)) {
            syllabusData = sylSrc.map(s => {
              const lTitle = s.title || s.name || '';
              return {
                name: lTitle,
                title: lTitle,
                status: s.status || 'not_started',
                notes: s.notes || '',
                date: s.date || s.updated_at || nowDateStr(),
                updated_at: s.updated_at || new Date().toISOString()
              };
            });
          }
          
          const revSrc = cd.revenue_by_date || cfg.revenue_by_date;
          if (revSrc) {
            for (const d in revSrc) {
              if (!revenueByDate[d] || revSrc[d] > revenueByDate[d]) {
                revenueByDate[d] = revSrc[d];
              }
            }
          }
          const expSrc = cd.expenses_by_date || cfg.expenses_by_date;
          if (expSrc && typeof expSrc === 'object') {
            for (const d in expSrc) {
              if (!expensesByDate[d]) {
                expensesByDate[d] = expSrc[d] || [];
              } else if (Array.isArray(expSrc[d])) {
                const localList = expensesByDate[d] || [];
                const localSignatures = new Set(localList.map(e => `${e.amount}_${e.reason}_${e.timestamp || ''}`));
                expSrc[d].forEach(cloudExp => {
                  const sig = `${cloudExp.amount}_${cloudExp.reason}_${cloudExp.timestamp || ''}`;
                  if (!localSignatures.has(sig)) {
                    localList.push(cloudExp);
                    localSignatures.add(sig);
                  }
                });
                expensesByDate[d] = localList;
              }
            }
          }
          const attSrc = cd.att_by_date || cfg.att_by_date || cfg.attendance_by_date;
          if (attSrc) {
            for (const d in attSrc) {
              if (!attByDate[d]) attByDate[d] = [];
              attSrc[d].forEach(id => {
                if (!attByDate[d].includes(String(id))) attByDate[d].push(String(id));
              });
            }
          }

          // Merge session_students_by_date safely from cloud
          const sessionSrc = cd.session_students_by_date || cfg.session_students_by_date;
          if (sessionSrc && typeof sessionSrc === 'object') {
            for (const d in sessionSrc) {
              if (!sessionStudentsByDate[d]) {
                sessionStudentsByDate[d] = sessionSrc[d] || [];
              } else if (Array.isArray(sessionSrc[d])) {
                const localList = sessionStudentsByDate[d] || [];
                const localIds = new Set(localList.map(s => String(s.id || (s.name + '_' + s.phone))));
                sessionSrc[d].forEach(cloudRec => {
                  const cId = String(cloudRec.id || (cloudRec.name + '_' + cloudRec.phone));
                  if (!localIds.has(cId)) {
                    localList.push(cloudRec);
                    localIds.add(cId);
                  }
                });
                sessionStudentsByDate[d] = localList;
              }
            }
          }

          // Merge Smart Center Notebook from cloud
          const nbSrc = cd.center_notebook !== undefined ? cd.center_notebook : cfg.center_notebook;
          if (nbSrc !== undefined && nbSrc !== null) {
            centerNotebookContent = String(nbSrc);
            localStorage.setItem(K_NOTEBOOK, centerNotebookContent);
            await secureSave(K_NOTEBOOK, centerNotebookContent);
          }

          // Evaluate shift lock state immediately on load
          const today = (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
          const approvalMap = cfg.daily_approval_map || {};
          const todayInfo = approvalMap[today];
          let isApproved = false;
          if (todayInfo) {
            isApproved = todayInfo.status === 'approved' || todayInfo === 'approved' || todayInfo === true;
          } else {
            isApproved = cd.daily_shift_status === 'open';
          }
          if (typeof window.applyShiftLockState === 'function') {
            window.applyShiftLockState(today, isApproved, todayInfo?.reason || cd.daily_shift_status);
          }

          if (cfg.subscription && typeof window.applyAssistantSubscription === 'function') {
            window.applyAssistantSubscription(cfg.subscription);
          }
        }

        // Cache the merged data back to IndexedDB
        await Promise.all([
          secureSave(K_STUDENTS, students),
          secureSave(K_ATT_BY_DATE, attByDate),
          secureSave(K_REVENUE, revenueByDate),
          secureSave(K_GROUP_FEES, groupFees),
          secureSave(K_EXPENSES, expensesByDate),
          secureSave(K_DELETED, deletedStudents),
          secureSave(K_SYLLABUS, syllabusData),
          secureSave(K_EVAL, evalData),
          secureSave(K_SESSION_STUDENTS, sessionStudentsByDate),
          secureSave(K_BOOKLETS, bookletsStock)
        ]);

        fromCloud = true;
        hasUnsavedChanges = false;
        updateSyncUI('online', 'متصل ومتزامن ');
        console.log("[loadAll] Data synced with Supabase and cached to IndexedDB ");
      }
    } catch(e) {
      console.error("[loadAll] Supabase load failed, using local data:", e);
      updateSyncUI('offline', 'غير متصل - تعمل من البيانات المحلية');
    }

    if (!fromCloud) {
      if (Object.keys(students).length > 0) {
        console.log("[loadAll] Working with IndexedDB data");
        updateSyncUI('pending', 'تعمل من البيانات المحلية');
      } else {
        updateSyncUI('online', 'جاهز للعمل');
      }
    }

    // Populate eval form fields
 if($("evalCenterName")) $("evalCenterName").value = evalData.centerName || "";
 if($("evalManager")) $("evalManager").value = evalData.manager || "";
 if($("evalPackages")) $("evalPackages").value = evalData.packages || "";
 if($("evalStudentsCount")) $("evalStudentsCount").value = evalData.studentsCount || "";
 if($("evalCurrentCourses")) $("evalCurrentCourses").value = evalData.currentCourses || "";
 if($("evalCollabOpps")) $("evalCollabOpps").value = evalData.collabOpps || "";
 if($("evalNotes")) $("evalNotes").value = evalData.notes || "";
 if($("evalFollowupPlan")) $("evalFollowupPlan").value = evalData.followupPlan || "";
 if($("evalNeeds")) $("evalNeeds").value = evalData.needs || "";
 if($("evalFinalRate")) $("evalFinalRate").value = evalData.finalRate || " ممتاز";

 applyTheme(localStorage.getItem(K_THEME) || "dark");
 

 if($("centerNotebook")) {
   $("centerNotebook").value = centerNotebookContent || localStorage.getItem(K_NOTEBOOK) || "";
   if (typeof window.updateNotebookCounters === 'function') window.updateNotebookCounters();
 }
 
 updateTopStats(); updateFinanceSummary(); renderCharts(); if (typeof window.updateAttendanceUIState === 'function') window.updateAttendanceUIState();
 } catch(e) { console.error("Data Load Error", e); }
 }

 function ensureBase500() {
 let added = false;
 for (let i = BASE_MIN_ID; i <= BASE_MAX_ID; i++) { 
 if(!students[String(i)]) {
 students[String(i)] = makeEmptyStudent(i); 
 added = true;
 }
 }
 if (added) saveAll();
 }

 // ==========================================
 // 7. AUTHENTICATION & SECURITY
 // ==========================================
 async function checkAuth() {
  const sidebar = document.querySelector('.sidebar');
  let isLoggedIn = false;
  
  if (window.supabaseClient) {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
      isLoggedIn = true;
    }
  }

  if(isLoggedIn || localStorage.getItem(K_AUTH) === "1") {
    currentUserRole = localStorage.getItem(K_ROLE) || "assistant";
    
    // Sync Global Variables
    window.CURRENT_ROLE = currentUserRole;
    $("loginBox").classList.add("hidden");
    document.documentElement.classList.remove("login-active");
    document.body.classList.remove("login-active");
    
    if(currentUserRole === 'admin') {
      // Manager has a dedicated standalone portal at ../admin/admin.html
      window.location.replace("../admin/admin.html");
      return;
    } else {
      $("appBox").classList.remove("hidden");
      if ($("manager-dashboard")) $("manager-dashboard").classList.add("hidden");
      if(sidebar) sidebar.style.display = "flex";
      showApp();
    }
  } else {
    $("loginBox").classList.remove("hidden"); 
    $("appBox").classList.add("hidden");
    document.documentElement.classList.add("login-active");
    document.body.classList.add("login-active");
    if ($("manager-dashboard")) $("manager-dashboard").classList.add("hidden");
    if(sidebar) sidebar.style.display = "none";
  }
 }

 window.switchManagerTab = function(tabId) {
 document.querySelectorAll(".manager-view").forEach(v => v.classList.add("hidden"));
 document.querySelectorAll(".manager-nav-item").forEach(btn => btn.classList.remove("active"));

 const tabMap = {
 dailyReport: { view: "managerDailyReportView", btn: "btnManagerDailyReport", title: "التقرير اليومي" },
 termReport: { view: "managerTermReportView", btn: "btnManagerTermReport", title: "تقرير الترم" },
 assistants: { view: "managerAssistantsView", btn: "btnManagerAssistants", title: "إدارة المساعدين" },
 permissions: { view: "managerPermissionsView", btn: "btnManagerPermissions", title: "صلاحيات المساعد" },
 decisions: { view: "managerDecisionsView", btn: "btnManagerDecisions", title: "طلبات القرارات" },
  packages: { view: "managerPackagesView", btn: "btnManagerPackages", title: "إدارة الباقات والمصاريف" },
 settings: { view: "managerSettingsView", btn: "btnManagerSettings", title: "الإعدادات المتقدمة" },
 };

 const tab = tabMap[tabId] || tabMap["dailyReport"];
 if ($(tab.view)) $(tab.view).classList.remove("hidden");
 if ($(tab.btn)) $(tab.btn).classList.add("active");
 if ($("managerPageTitle")) $("managerPageTitle").textContent = tab.title;

 if (tabId === "assistants") fetchManagerAssistants();
 
 if (tabId === "decisions") fetchManagerRequests();
 if (tabId === "dailyReport") renderManagerDailyReport(nowDateStr());
 if (tabId === "termReport") renderManagerTermReport();
  if (tabId === "packages") { if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard(); }
 if (tabId === "settings") {
 const mid = localStorage.getItem("ca_manager_id") || "—";
 if ($("mgrSettingsManagerId")) $("mgrSettingsManagerId").textContent = mid;
 }
 };

 function showApp() {
  applyPermissions();

  // Update locked revenue if applicable
  if (!currentPermissions.can_show_revenue) {
    const revEl = document.getElementById("todayRevenue");
    if (revEl) revEl.textContent = (currentLang === "ar" ? " مقفول" : " Locked");
  }

  // Update default globalSubjectText if no custom subject chosen
  const globSubEl = document.getElementById("globalSubjectText");
  if (globSubEl && (!window.currentGlobalSubject || window.currentGlobalSubject === "مادة الحضور" || window.currentGlobalSubject === "Attendance Subject")) {
    globSubEl.textContent = (currentLang === "ar" ? "مادة الحضور" : "Attendance Subject");
  }

  // Update quickAttendId placeholder
  if (typeof window.updateAttendanceUIState === "function") {
    window.updateAttendanceUIState();
  }

  if (typeof loadPermissions === "function" && currentUserRole !== "admin") loadPermissions();
 if($("reportDate")) $("reportDate").value = nowDateStr();
 
 // Fix for Shift Manager Display Name
 if ($("currentShiftManagerName")) {
 $("currentShiftManagerName").innerText = localStorage.getItem("ca_current_username") || (currentUserRole === "admin" ? "المدير" : "مساعد");
 }
 
 renderReport(nowDateStr());
 updateTopStats();
 populatePackages();
 window.switchTab('Home');
 }

 
// Global click interceptor for locked features
if (!window._lockedFeatureListenerAdded) {
  document.addEventListener('click', function(e) {
    const lockedEl = e.target.closest('.locked-feature');
    if (lockedEl) {
      e.preventDefault();
      e.stopPropagation();
      
      lockedEl.classList.remove('locked-clicked');
      void lockedEl.offsetWidth; // trigger reflow
      lockedEl.classList.add('locked-clicked');
      
      showToast(" هذه الميزة مقفولة من قِبَل المدير", "warning");
      
      setTimeout(() => lockedEl.classList.remove('locked-clicked'), 400);
    }
  }, true); // capture phase
  window._lockedFeatureListenerAdded = true;
}

function applyPermissionsToAssistantUI() {
  const p = currentPermissions || {};
  
  // Reset all locks first
  document.querySelectorAll('.locked-feature').forEach(el => {
    el.classList.remove('locked-feature');
    if(el.id === 'newId') {
      el.disabled = false;
      el.placeholder = 'ID (ex: 601)';
    }
  });

  // 1. Lock adminOnly and manager-nav-item elements by default for assistants
  document.querySelectorAll('.adminOnly, .manager-nav-item').forEach(el => {
    if (!el.classList.contains('tab-section')) {
      el.classList.add('locked-feature');
    }
  });
  
  // 2. Student deletion permission
  const delBtn = document.getElementById('deleteStudentBtn');
  if (delBtn) {
    if (p.can_delete_student === true) {
      delBtn.classList.remove('hidden', 'locked-feature');
    } else {
      delBtn.classList.add('hidden');
    }
  }

  // 3. Unlock logic based on permissions
  
  // Revenue
  const revPill = document.getElementById('openRevenueModalBtn');
  const revToggle = document.getElementById('toggleRevBtn');
  if (p.show_revenue !== false) {
    if (revPill) {
      revPill.style.display = "";
      revPill.classList.remove('locked-feature');
    }
    if (revToggle) {
      revToggle.style.display = "";
      revToggle.classList.remove('locked-feature', 'hidden');
    }
  } else {
    if (revPill) {
      revPill.style.display = "";
      revPill.classList.add('locked-feature');
    }
    if (revToggle) {
      revToggle.style.display = "none";
      revToggle.classList.remove('locked-feature');
    }
    if (document.getElementById('todayRevenue')) document.getElementById('todayRevenue').textContent = (currentLang === "ar" ? " مقفول" : " Locked");
  }

  // Add student
  const addNavBtn = document.getElementById('openAddModalBtn');
  const addNewBtnEl = document.getElementById('addNewBtn');
  const addCard = document.getElementById('addStudentCard') || (addNewBtnEl ? addNewBtnEl.closest('.card') : null);
  const newIdInput = document.getElementById('newId');

  if (p.can_add_student === false) {
    if (addNavBtn) addNavBtn.classList.add('locked-feature');
    if (addCard) addCard.classList.add('locked-feature');
    if (addNewBtnEl) {
      addNewBtnEl.classList.add('locked-feature');
      addNewBtnEl.disabled = true;
    }
    if (newIdInput) {
      newIdInput.disabled = true;
      newIdInput.placeholder = (currentLang === "ar" ? " مقفول من قِبَل المدير" : " Locked by Manager");
    }
  } else {
    if (addNavBtn) addNavBtn.classList.remove('locked-feature');
    if (addCard) addCard.classList.remove('locked-feature');
    if (addNewBtnEl) {
      addNewBtnEl.classList.remove('locked-feature');
      addNewBtnEl.disabled = false;
    }
    if (newIdInput) {
      newIdInput.disabled = false;
      newIdInput.placeholder = 'ID (ex: 601)';
    }
  }

  // Packages
  if (p.can_manage_packages !== false) {
    if(document.getElementById('btnTabPackages')) document.getElementById('btnTabPackages').classList.remove('locked-feature');
    if(document.getElementById('btnManagerPackages')) document.getElementById('btnManagerPackages').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabPackages')) document.getElementById('btnTabPackages').classList.add('locked-feature');
  }

  // Syllabus / المنهج
  const btnSyllabus = document.getElementById('btnTabSyllabus');
  const syllUpdateCard = document.querySelector('#secSyllabus .adminOnly');
  if (p.can_access_syllabus !== false) {
    if (btnSyllabus) btnSyllabus.classList.remove('locked-feature');
    if (syllUpdateCard) syllUpdateCard.classList.remove('locked-feature'); // Unlock the update card as well
  } else {
    if (btnSyllabus) btnSyllabus.classList.add('locked-feature');
    if (syllUpdateCard) syllUpdateCard.classList.add('locked-feature');
  }

  // Reports
  if (p.can_view_reports !== false) {
    if(document.getElementById('btnTabReports')) document.getElementById('btnTabReports').classList.remove('locked-feature');
    
    if(document.getElementById('btnManagerDailyReport')) document.getElementById('btnManagerDailyReport').classList.remove('locked-feature');
    if(document.getElementById('btnManagerTermReport')) document.getElementById('btnManagerTermReport').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabReports')) document.getElementById('btnTabReports').classList.add('locked-feature');
    
  }

  // Marketing (Gated by both subscription plan and manager permission)
  if (p.can_access_marketing !== false && (!window.SUBSCRIPTION || window.SUBSCRIPTION.marketingEnabled !== false)) {
    if(document.getElementById('btnTabMarketing')) document.getElementById('btnTabMarketing').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabMarketing')) document.getElementById('btnTabMarketing').classList.add('locked-feature');
  }

  // Session Students
  if (p.can_access_session_students !== false) {
    if(document.getElementById('btnTabSessionStudents')) document.getElementById('btnTabSessionStudents').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabSessionStudents')) document.getElementById('btnTabSessionStudents').classList.add('locked-feature');
  }

  // Request Discount / Decision
  const discBtn = document.getElementById('correctPayBtn');
  const decReqStudentBtn = document.getElementById('btnRequestDecisionForStudent');
  const decReqPkgBtn = document.getElementById('btnDecisionRequestInPackages');
  if (p.can_request_discount !== false) {
    if (discBtn) {
      discBtn.classList.remove('hidden');
      discBtn.classList.remove('locked-feature');
    }
    if (decReqStudentBtn) {
      decReqStudentBtn.classList.remove('locked-feature', 'btn-decision-locked');
      decReqStudentBtn.title = '';
      const icon = decReqStudentBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-hand-holding-dollar';
    }
    if (decReqPkgBtn) {
      decReqPkgBtn.classList.remove('locked-feature', 'btn-decision-locked');
      decReqPkgBtn.title = '';
      const icon = decReqPkgBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-hand-holding-dollar';
    }
  } else {
    if (discBtn) {
      discBtn.classList.add('hidden');
      discBtn.classList.add('locked-feature');
    }
    if (decReqStudentBtn) {
      decReqStudentBtn.classList.add('locked-feature', 'btn-decision-locked');
      decReqStudentBtn.title = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'Locked: Decision requests disabled by admin' : 'مغلق: طلب القرارات مقفل من قِبل المدير';
      const icon = decReqStudentBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-lock';
    }
    if (decReqPkgBtn) {
      decReqPkgBtn.classList.add('locked-feature', 'btn-decision-locked');
      decReqPkgBtn.title = (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'Locked: Decision requests disabled by admin' : 'مغلق: طلب القرارات مقفل من قِبل المدير';
      const icon = decReqPkgBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-lock';
    }
  }

  // Booklets
  if (p.can_access_booklets !== false) {
    if(document.getElementById('btnTabBooklets')) document.getElementById('btnTabBooklets').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabBooklets')) document.getElementById('btnTabBooklets').classList.add('locked-feature');
  }

  // Settings / Admin Dashboard
  if (p.can_access_settings !== false) {
    if(document.getElementById('btnTabAdmin')) document.getElementById('btnTabAdmin').classList.remove('locked-feature');
    if(document.getElementById('btnManagerSettings')) document.getElementById('btnManagerSettings').classList.remove('locked-feature');
  } else {
    if(document.getElementById('btnTabAdmin')) document.getElementById('btnTabAdmin').classList.add('locked-feature');
  }

  // Permanently hide manager-only tabs from assistants
  if(document.getElementById('btnManagerAssistants')) document.getElementById('btnManagerAssistants').classList.add('hidden');
  if(document.getElementById('btnManagerDecisions')) document.getElementById('btnManagerDecisions').classList.add('hidden');
  // Ensure nav-groups remain visible
  document.querySelectorAll('.nav-group').forEach(group => {
    group.style.display = 'block';
  });

  if (typeof updateTopStats === 'function') updateTopStats();
}
function applyPermissions() {
 const isAdmin = (currentUserRole === "admin");
 if ($("currentUserBadgeText")) {
 $("currentUserBadgeText").innerText = isAdmin ? (currentLang === "ar" ? " مسؤول عام" : " Admin") : (currentLang === "ar" ? " مساعد" : " Assistant");
 }
 
 // Show base UI elements for all roles first
 document.querySelectorAll(".adminOnly, .manager-nav-item").forEach(el => {
 if (!el.classList.contains("tab-section")) {
 el.classList.remove("hidden"); 
 }
 });
 if($("deleteStudentBtn")) $("deleteStudentBtn").classList.remove("hidden");
 if($("correctPayBtn")) $("correctPayBtn").classList.remove("hidden");
 
 // For assistants: apply granular Supabase-based permissions
 if (!isAdmin) {
 applyPermissionsToAssistantUI();
 }
 }

 function askAdminPass(cb) {
 if($("customPassInput")) $("customPassInput").value = "";
 passSuccessCallback = cb;
 if($("customPassModal")) $("customPassModal").classList.remove("hidden");
 setTimeout(() => { if($("customPassInput")) $("customPassInput").focus(); }, 100);
 }

 // ==========================================
 // 8. TOP STATISTICS & LIVE FEED
 // ==========================================
 function updateTopStats() {
 const studentValues = Object.values(students);
 let filledCount = 0;
 for (let i = 0; i < studentValues.length; i++) {
 if (studentValues[i].name || studentValues[i].paid > 0) filledCount++;
 }
 
 const todayStr = nowDateStr();
  const regularToday = (attByDate[todayStr] && Array.isArray(attByDate[todayStr])) ? attByDate[todayStr].length : 0;
  const sessionToday = (sessionStudentsByDate[todayStr] && Array.isArray(sessionStudentsByDate[todayStr])) ? sessionStudentsByDate[todayStr].length : 0;
  const todayCount = regularToday + sessionToday;

  const revenue = revenueByDate[todayStr] || 0;

  if($("totalStudentsCount")) {
    const maxSt = window.SUBSCRIPTION?.maxStudents;
    const combinedCount = (typeof window.getTotalStudentsCombinedCount === "function") ? window.getTotalStudentsCombinedCount() : (filledCount + (typeof window.getUniqueSessionStudentsCount === "function" ? window.getUniqueSessionStudentsCount() : 0));
    $("totalStudentsCount").textContent = maxSt ? `${combinedCount} / ${maxSt}` : combinedCount;
  }
  if($("todayCountTop")) $("todayCountTop").textContent = todayCount;
 
 const revPill = $("openRevenueModalBtn");
 const revToggle = $("toggleRevBtn");
 const canShowRev = (currentUserRole === 'admin' || !currentPermissions || currentPermissions.show_revenue !== false);
 if (!canShowRev) {
   if (revPill) {
     revPill.classList.add('locked-feature');
     revPill.style.display = "";
   }
   if (revToggle) { revToggle.style.display = "none"; revToggle.classList.remove('locked-feature'); }
   if ($("todayRevenue")) $("todayRevenue").textContent = (currentLang === "ar" ? " مقفول" : " Locked");
 } else {
   if (revPill) {
     revPill.classList.remove('locked-feature');
     revPill.style.display = "";
   }
   if (revToggle) {
     revToggle.classList.remove('locked-feature');
     revToggle.style.display = "";
     revToggle.innerHTML = isRevHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
   }
   if ($("todayRevenue")) {
     const isAr = (currentLang === "ar");
   const currencySuffix = isAr ? " ج" : " EGP";
   $("todayRevenue").textContent = isRevHidden ? ("******" + currencySuffix) : (revenue + currencySuffix);
   }
 }

 }

 function updateLiveFeed(st) {
 let sName = st.name || "بدون اسم";
 let sClass = (st.className && st.className !== "عام" && st.className !== "General") ? st.className : (currentLang === "ar" ? "عام" : "General");
 const timeStr = new Date().toLocaleTimeString(currentLang==='ar'?'ar-EG':'en-US', {hour:'2-digit', minute:'2-digit'});
 
 recentScans.unshift({ name: sName, id: st.id, cls: sClass, time: timeStr });
 if(recentScans.length > 5) recentScans.pop();
 
 const feed = $("liveFeedBox");
 if(feed) {
 let html = "";
 for (let i = 0; i < recentScans.length; i++) {
 const s = recentScans[i];
 let gColor = getTagColor(s.cls);
 html += `
 <div class="feed-item">
 <span class="feed-time">${s.time}</span> 
 <b>${s.name}</b> 
 <span class="badge" style="background:${gColor}; border-color:${gColor}; color:#fff;">${s.cls}</span> 
 <span>#${s.id}</span>
 </div>`;
 }
 feed.innerHTML = html;
 }
 }

 // ==========================================
 // 9. STUDENT PROFILE & SMART STREAK
 // ==========================================
 function calculateSmartStreak(st) {
 if(!st.attendanceDates || st.attendanceDates.length === 0) return 0;
 let c = (st.className && st.className !== "عام" && st.className !== "General") ? st.className.trim() : "";
 
 let classDates = new Set();
 for(let dateKey in attByDate) {
 let idsForDate = attByDate[dateKey];
 for(let i = 0; i < idsForDate.length; i++) {
 let s = students[idsForDate[i]];
 if(s && (s.className || "").trim() === c) { classDates.add(dateKey); break; }
 }
 }
 
 let sortedDates = Array.from(classDates).sort((a,b) => new Date(b) - new Date(a));
 let streak = 0;
 let today = nowDateStr();
 
 for(let i = 0; i < sortedDates.length; i++) {
 let d = sortedDates[i];
 if(st.attendanceDates.includes(d)) { streak++; } 
 else { if(d === today) continue; break; }
 }
 return streak;
 }

 function populatePackages() {
 const select = $("stClass");
 if (!select) return;
 
 let currentVal = select.value; 
 const isAr = (currentLang === "ar");
 let html = `<option value="">${isAr ? "-- اختر الباقة / المجموعة --" : "-- Select Package / Group --"}</option>`;
 let sHtml = `<option value="حصة فردية">${isAr ? "حصة فردية" : "Single Session"}</option>`;
 
 let hasGroups = false;
 for (let g in groupFees) {
 html += `<option value="${g}">${g}</option>`;
 sHtml += `<option value="${g}">${g}</option>`;
 hasGroups = true;
 }
 if(!hasGroups) html += `<option value="">${isAr ? "عام" : "General"}</option>`;
 select.innerHTML = html;
 
 if(currentVal && groupFees[currentVal] !== undefined) {
 select.value = currentVal;
 }

 const sessSelect = $("sessStClass");
 if (sessSelect) {
 let sVal = sessSelect.value;
 sessSelect.innerHTML = sHtml;
 if (sVal) sessSelect.value = sVal;
 }
 }

 window.toggleStudentPackage = function(stId, pkgName, isChecked) {
    const st = students[stId];
    if (!st) return;
    if (!st.packages) st.packages = [];
    if (isChecked && !st.packages.includes(pkgName)) {
        st.packages.push(pkgName);
    } else if (!isChecked) {
        st.packages = st.packages.filter(p => p !== pkgName);
    }
    saveAll();
    updateStudentUI(stId);
 }

 
  window.currentPayFilterMode = 'package';

  window.updatePkgFinanceCardUI = function(st, selectedPkg) {
      const cardTitle = $("pkgCardNameTitle");
      const cardStatus = $("pkgCardStatusBadge");
      const cardPrice = $("pkgCardPrice");
      const cardPaid = $("pkgCardPaid");
      const cardRemain = $("pkgCardRemain");
      const progressBar = $("pkgProgressBar");

      if (!st || !selectedPkg || !groupFees || !groupFees[selectedPkg]) {
          if (cardTitle) cardTitle.innerHTML = '<i class="fa-solid fa-receipt"></i> حساب الباقة';
          if (cardStatus) {
              cardStatus.style.background = "#e2e8f0";
              cardStatus.style.color = "#475569";
              cardStatus.textContent = "لا توجد باقة محددة";
          }
          if (cardPrice) cardPrice.textContent = "0 ج";
          if (cardPaid) cardPaid.textContent = "0 ج";
          if (cardRemain) {
              cardRemain.textContent = "0 ج";
              cardRemain.style.color = "var(--text-secondary)";
          }
          if (progressBar) progressBar.style.width = "0%";
          return;
      }

      const pDetails = window.getPkgDetails(selectedPkg);
      const req = toInt(pDetails.price);
      const pkgDisc = toInt((st.packageDiscounts && st.packageDiscounts[selectedPkg]) || 0);
      const netReq = Math.max(0, req - pkgDisc);

      let paid = 0;
      if (st.payments) {
          st.payments.forEach(p => {
              const pPkg = p.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
              if (pPkg === selectedPkg) paid += toInt(p.amount);
          });
      }
      const rem = Math.max(0, netReq - paid);
      const pct = netReq > 0 ? Math.min(100, Math.round((paid / netReq) * 100)) : 100;

      if (cardTitle) {
          let titleHtml = '<i class="fa-solid fa-cube" style="color:var(--primary);"></i> حساب باقة: <b>' + selectedPkg + '</b>';
          if (pkgDisc > 0) {
              titleHtml += ` <span class="badge" style="background:rgba(245,158,11,0.12); color:#d97706; border:1px solid rgba(245,158,11,0.3); font-size:0.75em; padding:2px 7px; border-radius:6px; margin-inline-start:6px;"><i class="fa-solid fa-tag"></i> خصم معتمد: ${pkgDisc} ج</span>`;
          }
          cardTitle.innerHTML = titleHtml;
      }

      if (cardStatus) {
          if (req === 0 || netReq === 0) {
              cardStatus.style.background = "#dcfce7";
              cardStatus.style.color = "#15803d";
              cardStatus.innerHTML = '<i class="fa-solid fa-check"></i> ' + (netReq === 0 && pkgDisc > 0 ? 'معفى بقرار مدير' : 'باقة مجانية');
          } else if (rem === 0) {
              cardStatus.style.background = "#dcfce7";
              cardStatus.style.color = "#15803d";
              cardStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> مسددة بالكامل';
          } else {
              cardStatus.style.background = "#fee2e2";
              cardStatus.style.color = "#b91c1c";
              cardStatus.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> باقي: ' + rem + ' ج';
          }
      }

      if (cardPrice) {
          if (pkgDisc > 0) {
              cardPrice.innerHTML = `<span style="font-size:0.82em; text-decoration:line-through; opacity:0.6; margin-inline-end:5px;">${req} ج</span><b>${netReq} ج</b>`;
          } else {
              cardPrice.textContent = req + " ج";
          }
      }
      if (cardPaid) cardPaid.textContent = paid + " ج";
      if (cardRemain) {
          cardRemain.textContent = rem + " ج";
          cardRemain.style.color = (rem > 0) ? "var(--danger)" : "var(--success)";
      }
      if (progressBar) {
          progressBar.style.width = pct + "%";
          progressBar.style.background = (rem === 0) ? "var(--success)" : "var(--primary)";
      }
  };

  window.updateStudentCardRankTheme = function(r) {
    const card = $("studentDetailsCard") || document.querySelector(".studentCard");
    if (!card) return;
    card.classList.remove("rank-card-vip", "rank-card-warn", "rank-card-normal");
    if (r === "vip") {
      card.classList.add("rank-card-vip");
    } else if (r === "warn") {
      card.classList.add("rank-card-warn");
    } else {
      card.classList.add("rank-card-normal");
    }
  };

  window.updatePaymentMethodTheme = function(method) {
    const box = $("newPaymentBox") || document.querySelector(".payRow");
    const iconEl = $("newPaymentMethodIcon");
    const btnEl = $("addPaymentBtn");
    const methodInp = $("newPaymentMethod");
    const m = method || (methodInp ? methodInp.value : "cash");

    if (box) {
      box.classList.remove("pay-method-cash", "pay-method-instapay", "pay-method-wallet");
      box.classList.add(`pay-method-${m}`);
    }

    if (iconEl) {
      if (m === "instapay") {
        iconEl.innerHTML = '<i class="fa-solid fa-bolt-lightning" style="color:#8b5cf6;"></i>';
      } else if (m === "wallet") {
        iconEl.innerHTML = '<i class="fa-solid fa-mobile-screen-button" style="color:#ef4444;"></i>';
      } else {
        iconEl.innerHTML = '<i class="fa-solid fa-money-bill-wave" style="color:#10b981;"></i>';
      }
    }

    if (btnEl) {
      const isDepositText = (typeof t === "function") ? t("btn_deposit") : "إيداع";
      if (m === "instapay") {
        btnEl.innerHTML = `<i class="fa-solid fa-bolt-lightning"></i> <span>${isDepositText}</span>`;
      } else if (m === "wallet") {
        btnEl.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> <span>${isDepositText}</span>`;
      } else {
        btnEl.innerHTML = `<i class="fa-solid fa-money-bill-1-wave"></i> <span>${isDepositText}</span>`;
      }
    }
  };

  window.renderStudentPaymentsUI = function(st, selectedPkg) {
      const listEl = $("stPaymentsList");
      if (!listEl) return;

      const filterMode = window.currentPayFilterMode || 'package';
      const titleEl = $("stPayHistoryTitle");
      if (titleEl) {
          if (filterMode === 'all') {
              titleEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> سجل كافة دفعات الطالب:';
          } else {
              titleEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> سجل دفعات: <b>' + (selectedPkg || 'الباقة') + '</b>';
          }
      }

      if ($("btnPayFilterPkg")) {
          if (filterMode === 'package') $("btnPayFilterPkg").classList.add("active");
          else $("btnPayFilterPkg").classList.remove("active");
      }
      if ($("btnPayFilterAll")) {
          if (filterMode === 'all') $("btnPayFilterAll").classList.add("active");
          else $("btnPayFilterAll").classList.remove("active");
      }

      const isAdmin = (currentUserRole === "admin");
      let paymentsToShow = [];

      if (st && st.payments && st.payments.length > 0) {
          st.payments.forEach((p, idx) => {
              const pPkg = p.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
              if (filterMode === 'all' || !selectedPkg || pPkg === selectedPkg) {
                  paymentsToShow.push({ ...p, pkgName: pPkg, originalIndex: idx });
              }
          });
      }

      if (paymentsToShow.length === 0) {
          const msg = (filterMode === 'package' && selectedPkg)
              ? 'لم يتم تسجيل أي دفعات لباقة (' + selectedPkg + ') حتى الآن'
              : (st && st.paid > 0 ? 'المدفوع القديم: +' + st.paid + ' ج (كاش)' : 'لا توجد دفعات مسجلة حتى الآن');
          listEl.innerHTML = '<div class="mutedCenter" style="padding:15px; font-size:0.88em; color:var(--text-secondary);">' + msg + '</div>';
          return;
      }

      paymentsToShow.reverse();

      let html = "";
      paymentsToShow.forEach(p => {
          const m = p.method || "cash";
          let mLabel = "كاش";
          let mIcon = "fa-money-bill-wave";
          let badgeStyle = "background:rgba(16,185,129,0.12); color:#10b981; border:1px solid rgba(16,185,129,0.3); font-weight:700;";
          
          if (m === "instapay") {
              mLabel = "إنستاباي";
              mIcon = "fa-bolt-lightning";
              badgeStyle = "background:rgba(139,92,246,0.12); color:#8b5cf6; border:1px solid rgba(139,92,246,0.3); font-weight:700;";
          } else if (m === "wallet") {
              mLabel = "فودافون كاش";
              mIcon = "fa-mobile-screen-button";
              badgeStyle = "background:rgba(239,68,68,0.12); color:#ef4444; border:1px solid rgba(239,68,68,0.3); font-weight:700;";
          }

          const delBtn = isAdmin 
              ? '<button type="button" class="btn danger smallBtn iconOnly" style="padding:4px 7px; font-size:11px; border-radius:6px;" onclick="window.deleteStudentPayment(' + p.originalIndex + ')" title="حذف الدفعة"><i class="fa-solid fa-trash-can"></i></button>' 
              : "";

          const pkgBadge = (filterMode === 'all' && p.pkgName) 
              ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.78em; border:1px solid #bae6fd;"><i class="fa-solid fa-cube"></i> ' + p.pkgName + '</span>' 
              : "";

          html += `
          <div class="payment-record-card" style="display:flex; justify-content:space-between; align-items:center; padding:9px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02); transition:all 0.2s ease;">
              <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-weight:bold; font-size:1.05em; color:var(--success); min-width:65px;">+ ${p.amount} ج</span>
                  <span class="badge" style="${badgeStyle}; font-size:0.8em; display:inline-flex; align-items:center; gap:4px;">
                      <i class="fa-solid ${mIcon}"></i> ${mLabel}
                  </span>
                  ${pkgBadge}
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:0.82em; color:var(--text-secondary); display:flex; align-items:center; gap:4px;">
                      <i class="fa-regular fa-calendar" style="font-size:0.9em;"></i> ${prettyDate(p.date)}
                  </span>
                  ${delBtn}
              </div>
          </div>`;
      });

      listEl.innerHTML = html;
  };

function updateStudentUI(id) {
currentId = id;
window.currentId = id;
if (!id) {
  window.hideStudentCard();
  return;
}
const st = students[id]; 
 if (!st) {
 if ($("notesLockOverlay")) $("notesLockOverlay").style.display = "flex";
 if ($("stNotesListContainer")) $("stNotesListContainer").innerHTML = '<div class="mutedCenter" style="font-size:0.85em;">' + (currentLang === 'ar' ? 'لا توجد ملاحظات مسجلة لهذا الطالب' : 'No notes recorded for this student') + '</div>';
 window.hideStudentCard();
 return; 
 }
 window.showStudentCard();
 
 if ($("notesLockOverlay")) $("notesLockOverlay").style.display = "none";
 if (typeof renderStudentNotes === "function") renderStudentNotes(id);
 
 if($("studentIdPill")) $("studentIdPill").textContent = `ID: ${id}`;
 if($("stName")) $("stName").value = st.name || ""; 
 if($("stPhone")) $("stPhone").value = st.phone || ""; 
 if($("stParentPhone")) $("stParentPhone").value = st.parentPhone || "";
 if($("stClass")) $("stClass").value = st.className || "";

 // Populate class datalist dynamically
 const classListEl = $("stClassList");
 if (classListEl) {
   const classesSet = new Set();
   Object.keys(groupFees || {}).forEach(g => classesSet.add(g));
   Object.values(students || {}).forEach(s => { if (s && s.className) classesSet.add(s.className.trim()); });
   let cOpts = '';
   classesSet.forEach(c => { if (c) cOpts += `<option value="${c}"></option>`; });
   classListEl.innerHTML = cOpts;
 } 
 
  let pkgsHtml = '';
   const allPkgs = Object.keys(groupFees || {});
   let totalReq = 0;
   let totalPaid = 0;
   let totalRemain = 0;
   const pkgStatsMap = {};

   if (!st.packages) st.packages = [];
   
   if (allPkgs.length === 0) {
       pkgsHtml = '<div class="mutedCenter">لا توجد باقات معرفة بالنظام</div>';
   } else {
       allPkgs.forEach(pkgName => {
           const isSubscribed = st.packages.includes(pkgName);
           const pkgDetails = window.getPkgDetails(pkgName);
            const req = toInt(pkgDetails.price);
            const pkgDisc = toInt((st.packageDiscounts && st.packageDiscounts[pkgName]) || 0);
            const netReq = Math.max(0, req - pkgDisc);
            
            let pkgPaid = 0;
            if (st.payments) {
                st.payments.forEach(p => {
                    const pPkg = p.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
                    if (pPkg === pkgName) pkgPaid += toInt(p.amount);
                });
            }
            
            const pkgRemain = Math.max(0, netReq - pkgPaid);
            pkgStatsMap[pkgName] = { req: netReq, originalReq: req, discount: pkgDisc, paid: pkgPaid, remain: pkgRemain, isPaidFull: (pkgPaid >= netReq && netReq > 0) };

            if (isSubscribed) {
                totalReq += netReq;
                totalPaid += pkgPaid;
                totalRemain += pkgRemain;
                const tagStatus = (pkgRemain > 0) ? 'has-debt' : 'paid-full';
                const icon = (pkgRemain > 0) ? '<i class="fa-solid fa-hourglass-half" style="color:var(--danger)"></i>' : '<i class="fa-solid fa-check-circle" style="color:#10b981"></i>';
                const discNote = (pkgDisc > 0) ? `<small style="font-size:0.75em; opacity:0.85; margin-inline-start:4px; color:var(--warning); font-weight:700;">(خصم: ${pkgDisc} ج)</small>` : '';
                pkgsHtml += `<div class="pkg-summary-tag ${tagStatus}">
                    ${icon}
                    <span>${pkgName}</span>${discNote}
                </div>`;
            }
        });
        if (st.packages.length === 0) {
           pkgsHtml = '<div style="color:var(--text-secondary); font-size:0.85em; width:100%; text-align:center;">لا توجد باقات محددة للطالب</div>';
       }
   }
   if ($("stPackagesContainer")) $("stPackagesContainer").innerHTML = pkgsHtml;

   const pkgSelect = $("newPaymentPackage");
   let currentSelectedPkg = pkgSelect ? pkgSelect.value : "";
   if (!currentSelectedPkg || !st.packages.includes(currentSelectedPkg)) {
       currentSelectedPkg = st.packages[0] || "";
   }

   let payPkgOpts = "";
   if (st.packages.length === 0) {
       payPkgOpts = '<option value="">-- لم يتم تحديد باقات للطالب --</option>';
       currentSelectedPkg = "";
   } else {
       st.packages.forEach(pkgName => {
            payPkgOpts += '<option value="' + pkgName + '" ' + (pkgName === currentSelectedPkg ? 'selected' : '') + '>' + pkgName + '</option>';
        });
   }
   if (pkgSelect) {
       pkgSelect.innerHTML = payPkgOpts;
       pkgSelect.value = currentSelectedPkg;
   }

   window.updatePkgFinanceCardUI(st, currentSelectedPkg);

 
 let remain = totalRemain;
 
 const card = document.querySelector(".studentCard");
 if(card) {
 card.classList.remove("status-border-green", "status-border-yellow", "status-border-red");
 if(totalReq > 0) {
 if(totalPaid >= totalReq) card.classList.add("status-border-green");
 else if(totalPaid > 0) card.classList.add("status-border-yellow");
 else card.classList.add("status-border-red");
 }
 }

 let remBox = $("remainingBox");
 if (remBox) {
 if(totalReq === 0) {
 remBox.className = "remain-box remain-green";
 remBox.style.background = "";
 remBox.style.color = "";
 remBox.style.border = "";
 remBox.innerHTML = ` ${t("txt_free")}`;
 } else if(remain <= 0) {
   const surplus = totalPaid - totalReq;
   if (surplus > 0) {
     remBox.className = "remain-box";
     remBox.style.background = "rgba(14, 165, 233, 0.15)";
     remBox.style.color = "#0284c7";
     remBox.style.border = "1px solid #38bdf8";
     remBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> مسدد بالكامل (رصيد دائن: +${surplus} ج)`;
   } else {
     remBox.className = "remain-box remain-green";
     remBox.style.background = "";
     remBox.style.color = "";
     remBox.style.border = "";
     remBox.innerHTML = ` ${t("txt_paid_full")}`;
   }
 } else {
 remBox.className = "remain-box remain-red";
 remBox.style.background = "";
 remBox.style.color = "";
 remBox.style.border = "";
 const isAr = (currentLang === "ar");
 const currencySuffix = isAr ? " ج" : " EGP";
 remBox.innerHTML = (isAr ? `إجمالي المديونيات: <span id="stRemainingAmt">${remain}</span> ج` : `Total Debt: <span id="stRemainingAmt">${remain}</span> EGP`);
 }
 }

 st.debt = remain > 0 ? remain : 0;
 
 const debtWarning = $("debtWarningContainer");
 if (debtWarning) {
 if (st.debt > 0) {
 $("debtAmountDisplay").innerText = st.debt;
 debtWarning.classList.remove("hidden");
 } else {
 debtWarning.classList.add("hidden");
 }
 }

 const rBtn = $("showReceiptBtn");
 if (rBtn) {
 if (totalReq > 0 && remain <= 0) {
 rBtn.disabled = false;
 rBtn.style.cursor = "pointer";
 rBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
 rBtn.style.color = "#ffffff";
 rBtn.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
 if ($("receiptBtnIcon")) $("receiptBtnIcon").textContent = "";
 if ($("receiptBtnText")) $("receiptBtnText").textContent = t("print_receipt_unlock");
 } else {
 rBtn.disabled = true;
 rBtn.style.cursor = "not-allowed";
 rBtn.style.background = "#334155";
 rBtn.style.color = "#94a3b8";
 rBtn.style.boxShadow = "none";
 if ($("receiptBtnIcon")) $("receiptBtnIcon").textContent = "";
 if ($("receiptBtnText")) $("receiptBtnText").textContent = t("print_receipt_lock");
 }
 }

 let r = st.rank || "normal";
 if($("rankNormalBtn")) $("rankNormalBtn").className = "st-rank-btn " + (r === "normal" ? "active-normal" : "");
 if($("rankVipBtn")) $("rankVipBtn").className = "st-rank-btn " + (r === "vip" ? "active-vip" : "");
 if($("rankWarnBtn")) $("rankWarnBtn").className = "st-rank-btn " + (r === "warn" ? "active-warn" : "");
 if (typeof window.updateStudentCardRankTheme === "function") window.updateStudentCardRankTheme(r);
 if (typeof window.updatePaymentMethodTheme === "function") window.updatePaymentMethodTheme();

 const today = nowDateStr();
 const dates = st.attendanceDates || [];
 const isPresent = dates.includes(today);
 
 if($("todayStatus")) {
 $("todayStatus").textContent = isPresent ? t("btn_mark_present") : t("btn_mark_absent");
 $("todayStatus").style.color = isPresent ? "green" : "red";
 }
 if($("stAvatar")) {
 if(isPresent) $("stAvatar").classList.add("present");
 else $("stAvatar").classList.remove("present");
 }

 let streakCount = calculateSmartStreak(st);
 if($("daysCount")) $("daysCount").innerHTML = ` ${streakCount} ${t("txt_streak")}`;
 
 if($("attList")) {
  let datesHtml = "";
  let reverseDates = dates.slice().reverse().slice(0, 30);
  for(let i=0; i<reverseDates.length; i++) {
    datesHtml += '<div class="item" style="display:inline-flex; align-items:center; gap:6px; padding:6px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:6px; font-size:0.85em; font-weight:500;"><i class="fa-regular fa-calendar-check" style="color:var(--success);"></i> ' + prettyDate(reverseDates[i]) + '</div>';
  }
  if (reverseDates.length === 0) {
    datesHtml = '<div class="mutedCenter" style="width:100%; font-size:0.85em; color:var(--text-secondary); padding:10px;">لم يتم تسجيل أي أيام حضور لهذا الطالب بعد</div>';
  }
  $("attList").innerHTML = datesHtml;
}

 window.renderStudentPaymentsUI(st, currentSelectedPkg);
 
 if($("newBadge")) {
   const isJustCreated = (window.justAddedStudentId && String(window.justAddedStudentId) === String(st.id));
   if(isJustCreated && (!st.attendanceDates || st.attendanceDates.length === 0)) {
     $("newBadge").classList.remove("hidden");
   } else {
     $("newBadge").classList.add("hidden");
   }
 }
  if (typeof window.updateAttendanceUIState === 'function') {
    window.updateAttendanceUIState();
  }
}

 function addAttendance(id, d) {
    const selectedSubject = window.currentGlobalSubject || "";
    if (!selectedSubject || !String(selectedSubject).trim()) {
        if (typeof showFullscreenFeedback === 'function') showFullscreenFeedback(false, false);
        if (typeof triggerShake === 'function') triggerShake("openSubjectModalBtn");
        return { ok: false, msg: "يرجى تحديد مادة الحضور من القائمة بالأعلى أولاً" };
    }
    const s = students[String(id)];
    if (!s) {
        if (typeof showFullscreenFeedback === 'function') showFullscreenFeedback(false, false);
        return { ok: false, msg: "الطالب غير مسجل" };
    }
  if(!s.name || s.name.trim() === "") {
      showFullscreenFeedback(false, false);
      return { ok: false, msg: "هذا الطالب ليس له اسم مسجل ولا يمكن تحضيره" };
  }

 
 

 if (selectedSubject) {
     let validPkgName = null;
     let pkgError = `الطالب غير مشترك في باقة تخص مادة (${selectedSubject})`;
     
     if (s.packages && s.packages.length > 0) {
         for (let i = 0; i < s.packages.length; i++) {
             const pName = s.packages[i];
             const pkgDetails = groupFees[pName];
             if (pkgDetails && pkgDetails.subject === selectedSubject) {
                 let pPaid = 0;
                 if (s.payments) {
                     s.payments.forEach(p => { if (p.pkgName === pName) pPaid += toInt(p.amount); });
                 }
                 const pPrice = toInt(pkgDetails.price);
                 if (pPrice > 0 && pPaid < pPrice) {
                     pkgError = `الطالب لم يسدد ثمن باقة (${pName}) بالكامل`;
                     continue;
                 }
                 
                 if (pkgDetails.expiryType === 'time') {
                     const todayDate = new Date().setHours(0,0,0,0);
                     const start = pkgDetails.startDate ? new Date(pkgDetails.startDate).setHours(0,0,0,0) : null;
                     const end = pkgDetails.endDate ? new Date(pkgDetails.endDate).setHours(0,0,0,0) : null;
                     
                     if (start && todayDate < start) {
                         pkgError = `باقة (${pName}) لم تبدأ بعد`;
                         continue;
                     }
                     if (end && todayDate > end) {
                         pkgError = `باقة (${pName}) منتهية الصلاحية`;
                         continue;
                     }
                 }
                 
                 validPkgName = pName;
                 break;
             }
         }
     }
     
     if (!validPkgName) {
         showFullscreenFeedback(false, false);
         return { ok: false, msg: pkgError };
     }
 }
 
 if (!s.attendanceDates) s.attendanceDates = [];
 s.attendanceDates = Array.from(new Set(s.attendanceDates));
 if(!s.attendanceDates.includes(d)) {
 s.attendanceDates.push(d); 
 if(!attByDate[d]) attByDate[d] = []; 
 attByDate[d].push(String(id)); 
 
 saveAttendanceOnly(); 
 updateLiveFeed(s);
 triggerEdgeFlash(); 
 showFullscreenFeedback(true, false);
 return { ok: true, msg: t("msg_att_ok") };
 }
 showFullscreenFeedback(false, true);
 return { ok: false, msg: t("msg_att_warn") };
 }

 function removeAttendance(id, d) {
 const s = students[String(id)]; if(!s) return;
 s.attendanceDates = s.attendanceDates.filter(date => date !== d);
 if(attByDate[d]) attByDate[d] = attByDate[d].filter(x => x !== String(id));
 saveAttendanceOnly();
 }

 // ==========================================
 // 10. FINANCIAL & ANALYTICS MODULE
 // ==========================================
 function updateFinanceSummary() {
 const today = nowDateStr();
 const tRev = revenueByDate[today] || 0;
 let tExp = 0;
 if (expensesByDate[today]) {
 for (let i = 0; i < expensesByDate[today].length; i++) {
 tExp += expensesByDate[today][i].amount;
 }
 }
 
 if($("todayNetProfit")) $("todayNetProfit").textContent = (tRev - tExp);

 const currentMonth = today.slice(0, 7); 
 let mRev = 0, mExp = 0;
 
 for(let d in revenueByDate) { if(d.startsWith(currentMonth)) mRev += revenueByDate[d]; }
 for(let d in expensesByDate) { 
 if(d.startsWith(currentMonth)) { 
 for (let i = 0; i < expensesByDate[d].length; i++) mExp += expensesByDate[d][i].amount; 
 } 
 }
 if($("monthNetProfit")) $("monthNetProfit").textContent = (mRev - mExp);
 if($("monthTotalExp")) $("monthTotalExp").textContent = mExp;

 let cashToday = 0, instapayToday = 0, walletToday = 0;
 let cashTotal = 0, instapayTotal = 0, walletTotal = 0;
 
 const allStuds = Object.values(students);
 for(let i = 0; i < allStuds.length; i++) {
 let s = allStuds[i];
 if (s.payments && s.payments.length > 0) {
 for(let j = 0; j < s.payments.length; j++) {
 let p = s.payments[j];
 let amt = toInt(p.amount);
 let m = p.method || "cash";
 
 if (m === "cash") {
 cashTotal += amt;
 if (p.date === today) cashToday += amt;
 } else if (m === "instapay") {
 instapayTotal += amt;
 if (p.date === today) instapayToday += amt;
 } else if (m === "wallet") {
 walletTotal += amt;
 if (p.date === today) walletToday += amt;
 }
 }
 } else if (s.paid > 0) {
 cashTotal += toInt(s.paid);
 }
 }

 // إدراج أموال طلاب الحصة الفورية في الخزائن الحقيقية
 for (let d in sessionStudentsByDate) {
 let sList = sessionStudentsByDate[d] || [];
 for (let k = 0; k < sList.length; k++) {
 let item = sList[k];
 let amt = toInt(item.amount);
 let m = item.method || "cash";
 if (m === "cash") {
 cashTotal += amt;
 if (d === today) cashToday += amt;
 } else if (m === "instapay") {
 instapayTotal += amt;
 if (d === today) instapayToday += amt;
 } else if (m === "wallet") {
 walletTotal += amt;
 if (d === today) walletToday += amt;
 }
 }
 }

  let expTotal = 0;
  let expCashTotal = 0, expWalletTotal = 0, expInstapayTotal = 0;
  let expCashToday = 0, expWalletToday = 0, expInstapayToday = 0;

  for(let d in expensesByDate) {
    const list = expensesByDate[d] || [];
    for(let k = 0; k < list.length; k++) {
      const it = list[k];
      const amt = toInt(it.amount);
      const m = it.method || "cash";
      expTotal += amt;
      if (m === "cash") {
        expCashTotal += amt;
        if (d === today) expCashToday += amt;
      } else if (m === "wallet") {
        expWalletTotal += amt;
        if (d === today) expWalletToday += amt;
      } else if (m === "instapay") {
        expInstapayTotal += amt;
        if (d === today) expInstapayToday += amt;
      } else {
        expCashTotal += amt;
        if (d === today) expCashToday += amt;
      }
    }
  }

  const isArCurr = (currentLang === "ar");
  const currSuffix = isArCurr ? " ج" : " EGP";

  if($("vaultCashToday")) $("vaultCashToday").textContent = cashToday + currSuffix;
  if($("vaultInstapayToday")) $("vaultInstapayToday").textContent = instapayToday + currSuffix;
  if($("vaultWalletToday")) $("vaultWalletToday").textContent = walletToday + currSuffix;

  // Real Net Balances in Vaults: Inflow - Outflow
  if($("vaultCashAll")) $("vaultCashAll").textContent = Math.max(0, cashTotal - expCashTotal) + currSuffix;
  if($("vaultInstapayAll")) $("vaultInstapayAll").textContent = Math.max(0, instapayTotal - expInstapayTotal) + currSuffix;
  if($("vaultWalletAll")) $("vaultWalletAll").textContent = Math.max(0, walletTotal - expWalletTotal) + currSuffix;

  if($("vaultCashTotal")) $("vaultCashTotal").textContent = cashTotal;
  if($("vaultCashExp")) $("vaultCashExp").textContent = expTotal;
  if($("vaultCashNet")) $("vaultCashNet").textContent = (cashTotal - expTotal);

  if($("vaultInstapayTotal")) $("vaultInstapayTotal").textContent = instapayTotal;
  if($("vaultWalletTotal")) $("vaultWalletTotal").textContent = walletTotal;

  if (typeof renderAssistantExpensesTable === "function") renderAssistantExpensesTable();
  if ($("asstExpenseDateInp") && !$("asstExpenseDateInp").value) $("asstExpenseDateInp").value = nowDateStr();
  }

 function renderCharts() {
 const box = $("weeklyChartBox"); if(!box) return;
 
 let days = []; 
 for(let i=6; i>=0; i--) { 
 let d = new Date(); d.setDate(d.getDate() - i); days.push(d.toISOString().split('T')[0]); 
 }
 
 let maxNet = 0;
 let chartData = [];
 
 for (let i = 0; i < days.length; i++) {
 let d = days[i];
 let rev = revenueByDate[d] || 0;
 let exp = 0;
 if (expensesByDate[d]) {
 for (let j = 0; j < expensesByDate[d].length; j++) exp += expensesByDate[d][j].amount;
 }
 let net = rev - exp;
 if(net > maxNet) maxNet = net;
 chartData.push({ date: d, net: net });
 }
 
 let baseline = maxNet > 0 ? maxNet : 100;
 
 let html = "";
 for (let i = 0; i < chartData.length; i++) {
 let item = chartData[i];
 let h = 5;
 if (item.net > 0) {
 h = Math.max(5, (item.net / baseline) * 100);
 }
 
 let locale = currentLang === 'en' ? 'en-US' : 'ar-EG';
 let dayName = new Date(item.date).toLocaleDateString(locale, {weekday: 'short'});
 let barColor = item.net > 0 ? "var(--success)" : "#ccc";
 
 html += `
 <div class="chart-bar-wrap">
 <span style="font-size:10px; color:#666; margin-bottom:5px; font-weight:bold;">${item.net}</span>
 <div class="chart-bar" style="height:${h}%; background:${barColor};"></div>
 <div class="chart-label">${dayName}</div>
 </div>`;
 }
 box.innerHTML = html;
 }

 // ==========================================
 // 11. TABLE & SEARCH ENGINE
 // ==========================================
 function renderList(keepPage) {
 const filterClassEl = $("filterClass"), filterStatusEl = $("filterStatus"), filterAttendEl = $("filterAttend");
 let fClass = "all", fStatus = "all", fAttend = "all";
 
 if (filterClassEl) fClass = filterClassEl.value;
 if (filterStatusEl) fStatus = filterStatusEl.value;
 if (filterAttendEl) fAttend = filterAttendEl.value;
 
 if (typeof syncQuickFilterPills === "function") syncQuickFilterPills();
 
 if(filterClassEl) { 
  const isAr = (currentLang === "ar");
  const curVal = filterClassEl.value || "all";
  filterClassEl.innerHTML = `<option value="all" data-i18n="flt_all_classes">${isAr ? "كل الصفوف والمجموعات" : "All Grades & Groups"}</option>`;
  const classesSet = new Set();
  Object.values(students).forEach(st => {
      if (st && st.className && st.className.trim()) classesSet.add(st.className.trim());
  });
  classesSet.forEach(c => {
      const opt = document.createElement("option");
      opt.value = "class:" + c;
      opt.innerText = (isAr ? "الصف: " : "Grade: ") + c;
      filterClassEl.appendChild(opt);
  });
  const pkgsSet = new Set(Object.keys(groupFees || {}));
  pkgsSet.forEach(p => {
      const opt = document.createElement("option");
      opt.value = "pkg:" + p;
      opt.innerText = (isAr ? "باقة: " : "Package: ") + p;
      filterClassEl.appendChild(opt);
  });
  if (curVal && [...filterClassEl.options].some(o => o.value === curVal)) {
    filterClassEl.value = curVal;
  }
}

 let filled = [];
 const allStudents = Object.values(students);
 for (let i = 0; i < allStudents.length; i++) {
 if (allStudents[i] && (allStudents[i].name || allStudents[i].paid > 0)) filled.push(allStudents[i]);
 }

 // Include Session Students in the main list
 if (typeof window.getAllSessionStudents === 'function') {
   const sessList = window.getAllSessionStudents();
   sessList.forEach(item => {
     filled.push({
       id: 'حصة',
       realId: 'sess_' + item.id,
       isSessionStudent: true,
       name: item.name,
       phone: item.phone || '',
       parentPhone: '',
       className: item.className || (currentLang === 'ar' ? 'حصة فردية' : 'Single Session'),
       packages: ['حصة'],
       paid: Number(item.amount) || 0,
       discount: 0,
       debt: 0,
       status: 'active',
       attendanceDates: [item.date || nowDateStr()],
       method: item.method,
       sessionRecord: item
     });
   });
 }
 
 const today = nowDateStr(); 
 currentFilteredList = [];
 
 for (let i = 0; i < filled.length; i++) {
 let s = filled[i];
 let isValid = true;
 
 if(fClass !== "all") {
    if (fClass.startsWith("class:")) {
        const targetClass = fClass.replace("class:", "");
        if (s.className !== targetClass) isValid = false;
    } else if (fClass.startsWith("pkg:")) {
        const targetPkg = fClass.replace("pkg:", "");
        if (!s.packages || !s.packages.includes(targetPkg)) isValid = false;
    } else {
        if (s.className !== fClass && (!s.packages || !s.packages.includes(fClass))) isValid = false;
    }
  }
 
 let sClass = s.className ? s.className.trim() : "";
     let totalReq = 0;
     if (s.packages && s.packages.length > 0) {
        s.packages.forEach(pkgName => {
            const pDetails = window.getPkgDetails(pkgName);
            totalReq += toInt(pDetails.price);
        });
     } else if (sClass && groupFees[sClass] !== undefined) {
        totalReq = toInt(groupFees[sClass].price || groupFees[sClass]);
     }

     let totalPaid = s.paid || 0;
     let remainAmt = Math.max(0, totalReq - totalPaid);

     if(fStatus !== "all") {
        if(fStatus === "paid" && (remainAmt > 0 || totalReq === 0)) isValid = false;
        if(fStatus === "partial" && (remainAmt === 0 || totalPaid === 0 || totalReq === 0)) isValid = false;
        if(fStatus === "unpaid" && (totalPaid > 0 || totalReq === 0)) isValid = false;
        if(fStatus === "debt" && (remainAmt === 0 || totalReq === 0)) isValid = false;
     }
 
 let isP = (s.attendanceDates && s.attendanceDates.includes(today));
 if(fAttend === "present" && !isP) isValid = false;
 if(fAttend === "absent" && isP) isValid = false;
 
 if (isValid) currentFilteredList.push(s);
 }

 const searchInp = $("tableSearchInp");
 let q = searchInp ? searchInp.value.toLowerCase() : "";
 
 if(q) {
 let searchedList = [];
 for (let i = 0; i < currentFilteredList.length; i++) {
 let s = currentFilteredList[i];
 if ((s.name && s.name.toLowerCase().includes(q)) || String(s.id).includes(q)) searchedList.push(s);
 }
 currentFilteredList = searchedList;
 }
 
 if (keepPage !== true) {
 currentPage = 1; 
 } else {
 let totalPages = Math.ceil(currentFilteredList.length / ITEMS_PER_PAGE) || 1;
 if (currentPage > totalPages) currentPage = totalPages;
 }
 renderPage();
 }

 
  // Synchronize Quick Filter Pills with Dropdowns (Two-way sync)
  function syncQuickFilterPills() {
    const fStatusEl = $("filterStatus");
    const fAttendEl = $("filterAttend");
    const fStatus = fStatusEl ? fStatusEl.value : "all";
    const fAttend = fAttendEl ? fAttendEl.value : "all";

    document.querySelectorAll(".quick-flt-btn").forEach(b => b.classList.remove("active"));

    if (fAttend === "present" && fStatus === "all") {
      const p = document.querySelector('.quick-flt-btn[data-flt="present"]');
      if (p) p.classList.add("active");
    } else if (fAttend === "all") {
      if (fStatus === "debt") {
        const p = document.querySelector('.quick-flt-btn[data-flt="debt"]');
        if (p) p.classList.add("active");
      } else if (fStatus === "paid") {
        const p = document.querySelector('.quick-flt-btn[data-flt="paid"]');
        if (p) p.classList.add("active");
      } else if (fStatus === "unpaid") {
        const p = document.querySelector('.quick-flt-btn[data-flt="unpaid"]');
        if (p) p.classList.add("active");
      } else if (fStatus === "all") {
        const p = document.querySelector('.quick-flt-btn[data-flt="all"]');
        if (p) p.classList.add("active");
      }
    }
  }
  window.syncQuickFilterPills = syncQuickFilterPills;

  // Setup Quick Filter Buttons
  function setupQuickFilterButtons() {
    document.querySelectorAll(".quick-flt-btn").forEach(btn => {
      btn.onclick = function() {
        const flt = this.getAttribute("data-flt");
        const fStatusEl = $("filterStatus");
        const fAttendEl = $("filterAttend");
        if (flt === "all") {
          if (fStatusEl) fStatusEl.value = "all";
          if (fAttendEl) fAttendEl.value = "all";
        } else if (flt === "debt") {
          if (fStatusEl) fStatusEl.value = "debt";
          if (fAttendEl) fAttendEl.value = "all";
        } else if (flt === "paid") {
          if (fStatusEl) fStatusEl.value = "paid";
          if (fAttendEl) fAttendEl.value = "all";
        } else if (flt === "unpaid") {
          if (fStatusEl) fStatusEl.value = "unpaid";
          if (fAttendEl) fAttendEl.value = "all";
        } else if (flt === "present") {
          if (fStatusEl) fStatusEl.value = "all";
          if (fAttendEl) fAttendEl.value = "present";
        }
        syncQuickFilterPills();
        renderList(false);
      };
    });
  }
  setupQuickFilterButtons();
  window.setupQuickFilterButtons = setupQuickFilterButtons;

  function renderPage() {
 const tb = $("allStudentsTable"); if (!tb) return;
 const tbody = tb.querySelector("tbody"); if (!tbody) return;
 
 tbody.innerHTML = "";
 
 const start = (currentPage - 1) * ITEMS_PER_PAGE;
 const end = start + ITEMS_PER_PAGE;
 const today = nowDateStr();

 for (let i = start; i < end && i < currentFilteredList.length; i++) {
 let s = currentFilteredList[i];
 const tr = document.createElement("tr");
 
 let sClass = s.className ? s.className.trim() : "";
     let totalReq = 0;
     if (s.packages && s.packages.length > 0) {
        s.packages.forEach(pkgName => {
            const pDetails = window.getPkgDetails(pkgName);
            totalReq += toInt(pDetails.price);
        });
     } else if (sClass && groupFees[sClass] !== undefined) {
        totalReq = toInt(groupFees[sClass].price || groupFees[sClass]);
     }

     let totalPaid = s.paid || 0;
     let remainAmt = Math.max(0, totalReq - totalPaid);

     let percent = totalReq > 0 ? Math.min((totalPaid / totalReq) * 100, 100) : (totalPaid > 0 ? 100 : 0);
     let pBarColor = (remainAmt === 0 && totalReq > 0) ? "var(--success)" : "var(--primary)";
     let pBar = totalReq > 0 ? `<div style="width:100%; background:var(--bg-inset); height:5px; border-radius:3px; margin-top:4px; overflow:hidden; border:1px solid var(--border);"><div style="width:${percent}%; height:100%; background:${pBarColor}; border-radius:3px;"></div></div>` : '';

     const isAr = (currentLang === "ar");
     const currencySuffix = isAr ? " ج" : " EGP";
     let isAttended = (s.attendanceDates && s.attendanceDates.includes(today));
     let attendTxt = isAttended 
        ? `<span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.82em; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-check"></i> ${isAr ? "حاضر" : "Present"}</span>` 
        : `<span style="color:var(--text-secondary); font-size:0.85em;">—</span>`;
     let rankIcon = s.rank === 'vip' ? ' ' : (s.rank === 'warn' ? ' ' : '');
     let gColor = getTagColor(sClass || (isAr ? "عام" : "General"));
     let classBadge = sClass 
        ? `<span class="badge" style="background:${gColor}; border-color:${gColor}; color:#fff; font-weight:600; font-size:0.82em;">${sClass}</span>` 
        : `<span style="color:var(--text-secondary); font-size:0.82em;">—</span>`;

     let pkgsBadgeHtml = "";
     if (s.packages && s.packages.length > 0) {
        pkgsBadgeHtml = s.packages.map(pName => {
            return `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-size:0.78em; margin:2px; display:inline-flex; align-items:center; gap:3px;"><i class="fa-solid fa-cube" style="font-size:0.85em;"></i> ${pName}</span>`;
        }).join(" ");
     } else {
        pkgsBadgeHtml = `<span style="color:var(--text-secondary); font-size:0.8em;">${isAr ? "بدون باقات" : "Generals"}</span>`;
     }

     let remainDisplay = "";
     if (totalReq === 0) {
        remainDisplay = `<span style="color:var(--text-secondary); font-size:0.85em;">0${currencySuffix}</span>`;
     } else if (remainAmt === 0) {
        remainDisplay = `<span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.82em; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-circle-check"></i> ${isAr ? "خالص" : "Paid"}</span>`;
     } else {
        remainDisplay = `<span style="color:var(--danger); font-weight:bold; font-size:0.95em;">${remainAmt}${currencySuffix}</span>`;
     }

     tr.innerHTML = `
     <td><input type="checkbox" class="stCheckbox" data-id="${s.id}"></td>
     <td style="font-weight:bold; color:var(--text-secondary); font-size:0.9em;">${s.isSessionStudent ? `<span class="badge" style="background:rgba(59,130,246,0.12); color:#2563eb; border:1px solid rgba(59,130,246,0.3); font-weight:700; font-size:0.8em; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-user-clock"></i> ${isAr ? "طالب حصة" : "Session"}</span>` : s.id}</td>
     <td><b>${s.name}</b>${rankIcon}</td>
     <td>${classBadge}</td>
     <td>${pkgsBadgeHtml}</td>
     <td><span style="font-weight:600; color:var(--text-primary);">${totalPaid}${currencySuffix}</span>${pBar}</td>
     <td>${remainDisplay}</td>
     <td>${attendTxt}</td>`;
 tr.onclick = function(e) { 
 if(e.target.type !== "checkbox") {
   if (s.isSessionStudent) {
     window.openSessionStudentModal(s.sessionRecord);
   } else {
     window.extOpen(s.id);
   }
 }
 };
 tbody.appendChild(tr);
 }
 
 const pageInd = $("pageIndicator");
 if (pageInd) {
 let totalPages = Math.ceil(currentFilteredList.length / ITEMS_PER_PAGE) || 1;
 pageInd.textContent = `${currentPage} / ${totalPages}`;
 }
 
 if ($("prevPageBtn")) $("prevPageBtn").disabled = (currentPage === 1);
 if ($("nextPageBtn")) $("nextPageBtn").disabled = (end >= currentFilteredList.length);
 }

 let simpleCurrentPage = 1;
 const SIMPLE_ITEMS_PER_PAGE = 20;
 let simpleFilteredStuds = [];

 function renderSimpleTable() {
 const tb = $("simpleStudentsTable"); if (!tb) return;
 const tbody = tb.querySelector("tbody"); if(!tbody) return; 
 
 tbody.innerHTML = "";
 
 simpleFilteredStuds = [];
  const allStuds = Object.values(students);
  for (let i = 0; i < allStuds.length; i++) {
    let s = allStuds[i];
    if (s && (s.name || s.phone || s.className || (Number(s.paid) || 0) > 0)) simpleFilteredStuds.push(s);
  }

  // Include all unique session students in Registered Students modal
  if (typeof window.getAllSessionStudents === 'function') {
    const sessList = window.getAllSessionStudents();
    sessList.forEach(item => {
      simpleFilteredStuds.push({
        id: 'حصة',
        isSessionStudent: true,
        name: item.name,
        phone: item.phone || '',
        className: item.className || (currentLang === 'ar' ? 'حصة فردية' : 'Single Session'),
        packages: ['حصة'],
        paid: Number(item.amount) || 0,
        sessionRecord: item
      });
    });
  }

  let totalPages = Math.ceil(simpleFilteredStuds.length / SIMPLE_ITEMS_PER_PAGE) || 1;
  if (simpleCurrentPage > totalPages) simpleCurrentPage = totalPages;

  const start = (simpleCurrentPage - 1) * SIMPLE_ITEMS_PER_PAGE;
  const end = start + SIMPLE_ITEMS_PER_PAGE;

  for (let i = start; i < end && i < simpleFilteredStuds.length; i++) {
    let s = simpleFilteredStuds[i];
    const tr = document.createElement("tr");
    let rankIcon = s.rank === 'vip' ? ' ' : (s.rank === 'warn' ? ' ' : '');
    
    const isAr = (currentLang === 'ar');
    let pkgDisplay = isAr ? 'عام' : 'General';
    if (s.isSessionStudent) {
      pkgDisplay = s.className || (isAr ? 'حصة فردية' : 'Single Session');
    } else if (s.packages && Array.isArray(s.packages) && s.packages.length > 0) {
      const validPkgs = s.packages.filter(p => p && p !== 'عام' && p !== 'General' && p !== 'عام' && p !== 'General');
      if (validPkgs.length > 0) pkgDisplay = validPkgs.join(' + ');
    } else if (s.className && s.className !== 'عام' && s.className !== 'General' && s.className !== 'عام' && s.className !== 'General') {
      pkgDisplay = s.className;
    }

    const badgeStyle = s.isSessionStudent
      ? 'background:rgba(59,130,246,0.12); color:#2563eb; font-weight:700; border:1px solid rgba(59,130,246,0.3);'
      : ((pkgDisplay === 'عام' || pkgDisplay === 'General') 
        ? 'background:rgba(100,116,139,0.1); color:#64748b; font-weight:600; border:1px solid rgba(100,116,139,0.2);' 
        : 'background:#e0f2fe; color:#0369a1; font-weight:bold; border:1px solid #bae6fd;');

    const idCell = s.isSessionStudent 
      ? `<span class="badge" style="background:rgba(59,130,246,0.12); color:#2563eb; border:1px solid rgba(59,130,246,0.3); font-weight:700; font-size:0.8em; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-user-clock"></i> ${isAr ? "طالب حصة" : "Session"}</span>` 
      : s.id;

    tr.innerHTML = `<td>${idCell}</td><td><b>${s.name}</b>${rankIcon}</td><td><span class="badge" style="${badgeStyle}">${pkgDisplay}</span></td>`;
    tr.style.cursor = "pointer";
    
    tr.onclick = function() { 
      if($("allStudentsModal")) $("allStudentsModal").classList.add("hidden"); 
      if (s.isSessionStudent) {
        if (typeof window.openSessionStudentModal === 'function') {
          window.openSessionStudentModal(s.sessionRecord);
        }
      } else {
        window.extOpen(s.id); 
      }
    };
    tbody.appendChild(tr);
  }

 if ($("simplePageIndicator")) {
 $("simplePageIndicator").textContent = `${simpleCurrentPage} / ${totalPages}`;
 }
 if ($("simplePrevPageBtn")) $("simplePrevPageBtn").disabled = (simpleCurrentPage === 1);
 if ($("simpleNextPageBtn")) $("simpleNextPageBtn").disabled = (end >= simpleFilteredStuds.length);
 }

 function handleBulk() {
  const boxes = document.querySelectorAll(".stCheckbox:checked");
  if ($("selectedCount")) $("selectedCount").textContent = boxes.length;
  
  const bulkBar = $("bulkActionBar");
  if (bulkBar) {
    if(boxes.length > 0) {
      bulkBar.classList.remove("hidden");
      if (typeof window.updateAttendanceUIState === 'function') window.updateAttendanceUIState();
    } else {
      bulkBar.classList.add("hidden");
    }
  }
}

 function renderReport(d) {
 const list = $("reportList"); 
 if(!list) return;
 
 let ids = attByDate[d] || [];
 let rev = revenueByDate[d] || 0;
 let expArr = expensesByDate[d] || [];
 let totalExp = 0;
 for (let i = 0; i < expArr.length; i++) totalExp += expArr[i].amount;
 
 if($("reportDateLabel")) $("reportDateLabel").textContent = prettyDate(d);
  const repSessCount = (sessionStudentsByDate[d] && Array.isArray(sessionStudentsByDate[d])) ? sessionStudentsByDate[d].length : 0;
  if($("reportCount")) $("reportCount").textContent = ids.length + repSessCount;
 if($("reportMoney")) $("reportMoney").textContent = rev;
 if($("reportExpense")) $("reportExpense").textContent = totalExp;
 
 let groups = {}; 
 for (let i = 0; i < ids.length; i++) {
 let id = ids[i];
 const st = students[id]; 
 let c = (st && st.className && st.className !== "عام" && st.className !== "General") ? st.className.trim() : (currentLang === "ar" ? "عام" : "General");
 if(!groups[c]) groups[c] = { count: 0 }; 
 groups[c].count++;
 }
 
 let html = "";
 for(let g in groups) {
 let gColor = getTagColor(g);
 html += `
 <div class="group-revenue-card" style="border-right: 5px solid ${gColor};">
 <div class="group-revenue-details">
 <b style="color:${gColor}; font-size:1.1em;"> ${g}</b>
 </div>
 <div class="group-revenue-amount">
 العدد: ${groups[g].count} طالب
 </div>
 </div>`;
 }
 
 if(expArr.length > 0) {
 html += `
 <h4 style="color:var(--danger); margin-top:15px;">${t("wa_exp")}</h4>
 <ul style="font-size:14px; color:#d9534f; list-style: inside; background:#fff; padding:15px; border-radius:8px;">`;
 for (let i = 0; i < expArr.length; i++) {
 html += `<li>${expArr[i].amount} ج - ${expArr[i].reason}</li>`; 
 }
 html += `</ul>`;
 }
 
 let sessArr = sessionStudentsByDate[d] || [];
 if(sessArr.length > 0) {
 html += `
 <h4 style="color:var(--primary); margin-top:15px; display:flex; align-items:center; gap:5px;"><span><i class="fa-solid fa-users"></i></span> طلاب الحصة الفورية (${sessArr.length})</h4>
 <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:5px;">`;
 for (let i = 0; i < sessArr.length; i++) {
 let item = sessArr[i];
 let mBadge = item.method === "instapay" ? " إنستاباي" : (item.method === "wallet" ? " فودافون كاش" : " كاش");
 html += `
 <div class="item flexBetween" style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid var(--border);">
 <div><b>${item.name}</b> <span class="badge" style="background:#eee; color:#333;">${(item.className && item.className !== "عام" && item.className !== "General") ? item.className : (currentLang === "ar" ? "عام" : "General")}</span> <span class="badge" style="background:#e3f2fd; color:#0288d1;">${mBadge}</span></div>
 <div style="color:var(--success); font-weight:bold;">+ ${item.amount} ج</div>
 </div>`;
 }
 html += `</div>`;
 }

 if (html === "") {
 list.innerHTML = `<div class="mutedCenter">${t("wait_scan")}</div>`;
 } else {
 list.innerHTML = html;
 }
 }

 function renderBinList() {
 const bl = $("binList"); if(!bl) return; 
 const ids = Object.keys(deletedStudents);
 if(ids.length === 0) { bl.innerHTML = `<div class="mutedCenter">Empty</div>`; return; }
 
 let html = "";
 for (let i = 0; i < ids.length; i++) {
 let id = ids[i];
 const s = deletedStudents[id]; 
 html += `
 <div class="item flexBetween" style="margin-bottom:8px;">
 <b>${s.name} (${id})</b> 
 <button class="btn success smallBtn" onclick="window.restoreSt('${id}')"><i class="fa-solid fa-rotate-left"></i> استرجاع</button>
 </div>`; 
 }
 bl.innerHTML = html;
 }

 window.restoreSt = function(idStr) {
 const id = String(idStr);
 const st = deletedStudents[id]; 
 if(!st) return;
 
 students[id] = st; delete deletedStudents[id]; saveAll(); renderBinList(); 
 showToast("تم الاسترجاع "); window.extOpen(id); 
 };
// ==========================================
 // 12. SYSTEM THEME & LANGUAGE APPLY
 // ==========================================
 function applyTheme(theme) {
 if (theme !== "dark") theme = "light";
 document.body.className = ""; 
 document.documentElement.setAttribute("data-theme", theme);
 if(theme === "dark") document.body.classList.add("theme-dark");
 localStorage.setItem(K_THEME, theme); 
 if($("themeSelector")) $("themeSelector").value = theme;
    if($("themeSelectorAdmin")) $("themeSelectorAdmin").value = theme;
 // Update topbar theme toggle icon with stunning SVG icons
 var themeBtn = $("topbarThemeToggle");
 if(themeBtn) {
 themeBtn.innerHTML = theme === "dark" 
 ? `<svg class="theme-svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
 : `<svg class="theme-svg-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
 }
 // Update PWA theme-color meta
 var metaTheme = document.querySelector('meta[name="theme-color"]');
 if(metaTheme) metaTheme.content = theme === "dark" ? "#0B1120" : "#F1F5F9";
 }

 function switchThemeWithAnimation(targetTheme) {
 if (typeof AssistantSounds !== "undefined") {
   if (targetTheme === "dark") AssistantSounds.themeNight();
   else AssistantSounds.themeMorning();
 }
 const overlay = $("themeSwitchOverlay");
 const iconBox = $("themeSwitchIconBox");
 const textEl = $("themeSwitchText");
 if(overlay && iconBox && textEl) {
 textEl.innerText = currentLang === "ar" ? "جاري تبديل المظهر... " : "Switching Theme... ";
 iconBox.innerHTML = targetTheme === "dark" 
 ? `<svg class="theme-svg-icon" style="width:50px;height:50px;color:#f59e0b;" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>` 
 : `<svg class="theme-svg-icon" style="width:50px;height:50px;color:#f59e0b;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
 overlay.classList.add("active");
 setTimeout(() => {
 applyTheme(targetTheme);
 setTimeout(() => {
 overlay.classList.remove("active");
 }, 400);
 }, 600);
 } else {
 applyTheme(targetTheme);
 }
 }

 async function hashPass(msg) {
  const msgUint8 = new TextEncoder().encode(msg);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 }


 function applyLanguage() {
 document.documentElement.lang = currentLang;
 document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
 
 document.querySelectorAll("[data-i18n]").forEach(el => {
 const key = el.getAttribute("data-i18n");
 if(dict[key] && dict[key][currentLang]) el.innerHTML = dict[key][currentLang];
 });
 
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
 const key = el.getAttribute("data-i18n-placeholder");
 if(dict[key] && dict[key][currentLang]) el.placeholder = dict[key][currentLang];
 });
 
 if($("changeLangBtn")) {
 const isAr = currentLang === "ar";
	if($("topbarLangCode")) $("topbarLangCode").innerText = isAr ? "EN" : "عربي";
	if($("mobileLangBadge")) $("mobileLangBadge").innerText = isAr ? "EN" : "عربي";
	if($("asstLangBtnText")) $("asstLangBtnText").innerText = isAr ? "English" : "العربية";
	if($("asstLangCurrentLabel")) $("asstLangCurrentLabel").innerText = isAr ? "اللغة الحالية: العربية" : "Current Language: English";
	if($("asstLangSubLabel")) $("asstLangSubLabel").innerText = isAr ? "انقر للتحويل إلى English بالكامل" : "Click to switch completely to Arabic";
	$("changeLangBtn").innerText = isAr ? " تغيير اللغة (Ar / En)" : " Switch Language";
 }
 
 if($("sidebarCollapseBtn")) {
 $("sidebarCollapseBtn").title = currentLang === "ar" ? "طي القائمة" : "Collapse Sidebar";
 }
 
 applyPermissions();
 
 // Sidebar doesn't need flex-direction change for RTL (handled by CSS logical properties)
 
 // السطر الجديد لتحديث كلمات جوجل درايف فوراً مع تغيير اللغة
 if (typeof updateDriveUI === "function") updateDriveUI();
  if (typeof window.updateAttendanceUIState === "function") window.updateAttendanceUIState();
  if (typeof renderBookletsTable === "function") renderBookletsTable();
  if (typeof renderNotifications === "function") renderNotifications();
  if (typeof populateSubjectModalList === "function") populateSubjectModalList();
  if (typeof window.updateNotebookCounters === "function") window.updateNotebookCounters();
  if (typeof window.setNotebookSyncStatus === "function") window.setNotebookSyncStatus('synced');

  const isEn = (currentLang === 'en');
  if ($("sessRevenueCurr")) $("sessRevenueCurr").textContent = isEn ? "EGP" : "ج";
  if ($("todayRevenue")) {
    const revVal = $("todayRevenue").getAttribute("data-val") || $("todayRevenue").textContent.replace(/[^0-9.]/g, '');
    $("todayRevenue").textContent = revVal + (isEn ? " EGP" : " ج");
  }


 // السطور الجديدة لترجمة شاشة إدخال المنهج
 if($("saveSyllabusBtn")) $("saveSyllabusBtn").innerText = currentLang === 'ar' ? "حفظ وتحديث المنهج" : "Save & Update Syllabus";
 if($("syllName")) $("syllName").placeholder = currentLang === 'ar' ? "اسم الشابتر / الدرس..." : "Chapter / Lesson Name...";
 if($("syllNotes")) $("syllNotes").placeholder = currentLang === 'ar' ? "ملاحظات (مثال: خلصنا لحد صفحة ٢٠)..." : "Notes (e.g., Finished until page 20)...";
 
 if($("syllStatus")) {
 for(let i=0; i<$("syllStatus").options.length; i++) {
 let opt = $("syllStatus").options[i];
 if(opt.value === "not_started") opt.text = currentLang === 'ar' ? " لم يبدأ" : " Not Started";
 if(opt.value === "in_progress") opt.text = currentLang === 'ar' ? " جاري الشرح" : " In Progress";
 if(opt.value === "completed") opt.text = currentLang === 'ar' ? " تم الانتهاء" : " Completed";
 }
 }

  // Live re-render active assistant tabs
  const secPkg = document.getElementById("secPackages");
  if (secPkg && !secPkg.classList.contains("hidden")) {
    if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
  }
  const secSt = document.getElementById("secStudents");
  if (secSt && !secSt.classList.contains("hidden")) {
    if (typeof renderList === 'function') renderList(true);
  }
  if (typeof updateTopbarRevenue === 'function') updateTopbarRevenue();
  
  // Remove the anti-FOUC loading class once translation is complete
  document.documentElement.classList.remove("lang-en-loading");
 }
 // ==========================================
 // 13. SYLLABUS MODULE
 // ==========================================
 function renderSyllabus() {
 const tl = $("syllabusTimeline");
 if (!tl) return;
 if (syllabusData.length === 0) {
 let emptyMsg = currentLang === 'ar' ? "لا توجد بيانات في خريطة المنهج حتى الآن. " : "No syllabus data available yet. ";
 tl.innerHTML = `<div class="mutedCenter">${emptyMsg}</div>`;
 return;
 }

 const isAdmin = (currentUserRole === "admin");
 let html = "";
 
 for (let i = 0; i < syllabusData.length; i++) {
 let s = syllabusData[i];
 let statusClass = "status-" + s.status;
 
 // ترجمة حالات الدرس
 let statusIcon = "";
 if (s.status === "completed") statusIcon = currentLang === 'ar' ? " تم الانتهاء" : " Completed";
 else if (s.status === "in_progress") statusIcon = currentLang === 'ar' ? " جاري الشرح" : " In Progress";
 else statusIcon = currentLang === 'ar' ? " لم يبدأ" : " Not Started";
 
 let deleteBtnHtml = isAdmin ? `<button class="btn danger smallBtn iconOnly" onclick="window.deleteSyllabus(${i})"><i class="fa-solid fa-trash-can"></i></button>` : "";
 let dateLbl = currentLang === 'ar' ? "أخر تحديث:" : "Last Update:";

 html += `
 <div class="syll-card ${statusClass}">
 <div class="syll-header">
 <span>${s.name || s.title}</span>
 <div class="row" style="width:auto;">
 <span style="font-size:0.8em; font-weight:normal;">${statusIcon}</span>
 ${deleteBtnHtml}
 </div>
 </div>
 ${s.notes ? `<div class="syll-notes"> ${s.notes}</div>` : ''}
 <div class="syll-date"> ${dateLbl} ${prettyDate(s.date)}</div>
 </div>
 `;
 }
 tl.innerHTML = html;
 }

 window.deleteSyllabus = function(index) {
 let confirmMsg = currentLang === 'ar' ? " متأكد من حذف هذا الدرس من المنهج؟" : " Are you sure you want to delete this lesson?";
 Swal.fire({
 title: 'تأكيد الحذف',
 text: confirmMsg,
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'نعم، احذف' : 'Yes, delete',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((result) => {
 if(result.isConfirmed) {
 syllabusData.splice(index, 1);
 saveAll();
 if ('BroadcastChannel' in window) {
   try {
     const bc = new BroadcastChannel('studify_permissions_sync');
     bc.postMessage({ type: 'SYLLABUS_UPDATED' });
   } catch(e) {}
 }
 renderSyllabus();
 }
 });
 };

 on("saveSyllabusBtn", "click", function() {
 let name = $("syllName").value.trim();
 let status = $("syllStatus").value;
 let notes = $("syllNotes").value.trim();
 
 if(!name) {
 let errMsg = currentLang === 'ar' ? "يرجى كتابة اسم الشابتر / الدرس أولاً" : "Please enter the chapter/lesson name first";
 return showToast(errMsg, "err");
 }

 let existing = syllabusData.find(x => x.name === name);
 if(existing) {
 existing.status = status;
 existing.notes = notes;
 existing.date = nowDateStr();
 } else {
 syllabusData.push({ name: name, title: name, status: status, notes: notes, date: nowDateStr(), updated_at: new Date().toISOString() });
 }
 
 saveAll();
 if ('BroadcastChannel' in window) {
   try {
     const bc = new BroadcastChannel('studify_permissions_sync');
     bc.postMessage({ type: 'SYLLABUS_UPDATED' });
   } catch(e) {}
 }
 renderSyllabus();
 
 let successMsg = currentLang === 'ar' ? "تم تحديث خريطة المنهج" : "Syllabus updated successfully";
 showToast(successMsg, "success");
 
 $("syllName").value = "";
 $("syllStatus").value = "not_started";
 $("syllNotes").value = "";
 });
 // ==========================================
 // 14. BINDINGS & EVENT LISTENERS
 // ==========================================
 // Global functions for the HTML onclick handlers
 window.switchLoginTab = function(tab) {
   if ($("tabManagerLogin")) $("tabManagerLogin").classList.toggle("active", tab === 'manager');
   if ($("tabAssistantLogin")) $("tabAssistantLogin").classList.toggle("active", tab !== 'manager');
   if ($("managerLoginForm")) {
     $("managerLoginForm").classList.toggle("hidden", tab !== 'manager');
     $("managerLoginForm").classList.toggle("active", tab === 'manager');
   }
   if ($("assistantLoginForm")) {
     $("assistantLoginForm").classList.toggle("hidden", tab === 'manager');
     $("assistantLoginForm").classList.toggle("active", tab !== 'manager');
   }
 };

 window.togglePassword = function(inputId) {
 const p = $(inputId);
 if (p) p.type = p.type === "password" ? "text" : "password";
 };

 function sanitizeKey(str) {
 return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
 }

 if($("managerLoginBtn")) {
  on("managerLoginBtn", "click", async function() {
    if ($("loginBox") && $("loginBox").classList.contains("hidden")) return;
    
    const rawU = $("managerUser") ? $("managerUser").value.trim() : "";
    const p = $("managerPass") ? $("managerPass").value.trim() : "";
    if (!rawU || !p) return showToast("أدخل البريد الإلكتروني وكلمة المرور", "err");
    
    
    try {
      if (!window.supabaseClient) return showToast("فشل الاتصال بالسحابة", "err");
      
      const { data, error } = await window.supabaseClient
        .from('manager_account')
        .select('*')
        .eq('username', rawU)
        .eq('password', p);
        
      if (error || !data || data.length === 0) {
        showToast("خطأ في بيانات الدخول: الرجاء التأكد من الحساب وكلمة المرور", "err");
        return triggerShake("managerLoginBtn");
      }

      // CRITICAL FIX: Store manager ID for cloud sync
      const managerRow = data[0];
      const managerId = (managerRow.manager_id || managerRow.center_id || String(managerRow.id || rawU)).replace(/[@.]/g, '_');
      window.CURRENT_MANAGER_ID = managerId;
      localStorage.setItem('ca_manager_id', managerId);

      localStorage.setItem(K_AUTH, "1");
      localStorage.setItem(K_ROLE, "admin");
      localStorage.setItem("ca_current_username", "المدير");
      window.CURRENT_ROLE = "admin";

      // Dedicated Admin Session
      localStorage.setItem("ca_admin_session", "1");
      localStorage.setItem("ca_admin_username", managerRow.name || managerRow.username || rawU || "المدير");
      
      showToast("تم تسجيل الدخول بنجاح. جاري التوجيه إلى لوحة الإدارة...", "success");
      setTimeout(() => {
        window.location.replace("../admin/admin.html");
      }, 500);
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بقاعدة البيانات. تأكد من الإنترنت.", "err");
    }
  });
}

window.navigateWithTransition = function(url) {
  const card = document.querySelector('.login-card') || document.getElementById('loginBox');
  if (card) {
    card.classList.add('card-exit-transition');
  }
  const overlay = document.getElementById('pageTransitionOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
  setTimeout(() => {
    window.location.replace(url);
  }, 280);
};

if($("assistantLoginBtn")) {
  on("assistantLoginBtn", "click", async function() {
    if ($("loginBox") && $("loginBox").classList.contains("hidden")) return;
    
    let rawU = $("assistantUser") ? $("assistantUser").value.trim().toLowerCase() : "";
    const p = $("assistantPass") ? $("assistantPass").value.trim() : "";
    if (!rawU || !p) return showToast("أدخل اسم المستخدم وكلمة المرور", "err");

    // If shift is closed, show warning and stylish lock modal with direct link to admin!
    if (window.IS_SHIFT_APPROVED === false) {
      const overlay = document.getElementById("assistantHardLockOverlay");
      const titleEl = document.getElementById("assistantHardLockTitle");
      const msgEl = document.getElementById("assistantHardLockMsg");
      const dismissTextEl = document.getElementById("hardLockDismissText");

      if (titleEl) titleEl.textContent = "الشيفت معلق ومغلق من قِبل الإدارة";
      if (msgEl) {
        msgEl.textContent = window.SHIFT_LOCK_REASON || "تم إيقاف الشيفت اليومي من قِبل المدير العام. تم تجميد كافة العمليات لحين فتح الشيفت مجدداً.";
      }
      if (dismissTextEl) dismissTextEl.textContent = "العودة لشاشة الدخول";
      if (overlay) overlay.classList.remove("hidden");

      if (typeof showToast === 'function') {
        showToast("عذراً، الشيفت واليومية مغلقة حالياً من قِبل المدير العام.", "warn");
      }
      return triggerShake("assistantLoginBtn");
    }

    try {
      if (!window.supabaseClient) return showToast("فشل الاتصال بالسحابة", "err");

      const cleanU = rawU.replace(/@studify\.com$/i, '').trim();
      const fullEmail = `${cleanU}@studify.com`;

      const { data, error } = await window.supabaseClient
        .from('assistants')
        .select('*')
        .or(`email.eq.${fullEmail},username.eq.${cleanU}`)
        .eq('password', p);

      if (error || !data || data.length === 0) {
        showToast("حساب المساعد غير موجود أو كلمة المرور خاطئة.", "err");
        return triggerShake("assistantLoginBtn");
      }

      // CRITICAL FIX: Fetch and store the manager_id that owns this assistant
      // so that saveAll() can sync data to the correct center in Supabase.
      const asstRow = data[0];
      const fetchedManagerId = asstRow.manager_id || localStorage.getItem("ca_manager_id") || "ahmedqutb11232_gmail_com";
      window.CURRENT_MANAGER_ID = fetchedManagerId;
      localStorage.setItem("ca_manager_id", fetchedManagerId);

      const displayUsername = (asstRow.username || cleanU).replace(/@studify\.com$/i, '');

      localStorage.setItem(K_AUTH, "1");
      localStorage.setItem(K_ROLE, "assistant");
      localStorage.setItem("ca_current_username", displayUsername);
      localStorage.setItem("ca_asst_email", asstRow.email || fullEmail);
      window.CURRENT_ROLE = "assistant";
      
      if ($("currentShiftManagerName")) {
        $("currentShiftManagerName").innerText = displayUsername;
      }
      
      // Load settings to get permissions
      await loadAll();
      await loadPermissions();
      checkAuth();
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بقاعدة البيانات. تأكد من الإنترنت.", "err");
    }
  });
}
window.logout = async function() {
  const isAr = (currentLang === "ar");
  const btn = $("logoutBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${isAr ? "جاري تسجيل الخروج..." : "Logging out..."}</span>`;
  }
  const overlay = $("pageTransitionOverlay");
  if (overlay) {
    const txt = overlay.querySelector(".transition-text");
    if (txt) txt.textContent = isAr ? "جاري تسجيل الخروج..." : "Logging out...";
    overlay.classList.add("active");
  }

  if (window.supabaseClient) {
    try { await window.supabaseClient.auth.signOut(); } catch(e) {}
  }
  // Clear IndexedDB (localForage)
  try { await localforage.clear(); } catch(e) { console.error("localForage clear error:", e); }
  
  // Clear auth keys from localStorage
  localStorage.removeItem(K_AUTH);
  localStorage.removeItem(K_ROLE);
  localStorage.removeItem("ca_current_username");
  
  setTimeout(() => {
    location.reload();
  }, 250);
};

 if($("logoutBtn")) on("logoutBtn", "click", window.logout);
 if($("managerLogoutBtn")) on("managerLogoutBtn", "click", window.logout);

 // User Profile Widget Listeners
 on("userProfileToggleBtn", "click", function(e) {
 if(e) e.stopPropagation();
 if($("userProfileDropdown")) $("userProfileDropdown").classList.toggle("hidden");
 });
 document.addEventListener("click", function(e) {
 if($("userProfileDropdown") && !$("userProfileDropdown").classList.contains("hidden")) {
 if(!$("userProfileDropdown").contains(e.target) && e.target.id !== "userProfileToggleBtn" && !e.target.closest("#userProfileToggleBtn")) {
 $("userProfileDropdown").classList.add("hidden");
 }
 }
 if($("notificationsDropdown") && !$("notificationsDropdown").classList.contains("hidden")) {
 if(!$("notificationsDropdown").contains(e.target) && e.target.id !== "notificationsToggleBtn" && !e.target.closest("#notificationsToggleBtn")) {
 $("notificationsDropdown").classList.add("hidden");
 }
 }
 });

 // Notifications toggle & mark read handled centrally in setupNotificationsUI

 on("quickActivityLogBtn", "click", function() {
 if($("userProfileDropdown")) $("userProfileDropdown").classList.add("hidden");
 if($("activityLogModal")) $("activityLogModal").classList.remove("hidden");
 });
 on("quickSwitchRoleBtn", "click", function() {
 if($("userProfileDropdown")) $("userProfileDropdown").classList.add("hidden");
 if(currentUserRole === "admin") {
 showToast(currentLang === 'ar' ? "أنت مسجل كمسؤول عام بالفعل " : "Already logged in as Admin ", "success");
 } else {
 askAdminPass(function() {
 currentUserRole = "admin"; localStorage.setItem(K_ROLE, "admin"); applyPermissions();
 showToast(currentLang === 'ar' ? "تم التبديل لصلاحيات المسؤول " : "Switched to Admin privileges ", "success");
 });
 }
 });
 on("quickGroupFeesBtn", "click", function() {
 if (currentUserRole !== "admin" && (!currentPermissions || !currentPermissions.can_manage_packages)) {
 showToast("عفواً، تعديل الباقات والأسعار مقفل من المدير ", "err");
 return;
 }
 if($("userProfileDropdown")) $("userProfileDropdown").classList.add("hidden");
 window.switchTab('Packages');
 renderGroupFeesModal();
 });
 on("quickExportBtn", "click", function() {
 if($("userProfileDropdown")) $("userProfileDropdown").classList.add("hidden");
 if(typeof exportColoredReport === "function") exportColoredReport();
 });
 on("quickBinBtn", "click", function() {
 if($("userProfileDropdown")) $("userProfileDropdown").classList.add("hidden");
 renderBinList(); if($("recycleBinModal")) $("recycleBinModal").classList.remove("hidden");
 });


 on("customPassConfirm", "click", async function() {
  const p = $("customPassInput") ? $("customPassInput").value.trim() : "";
  if (!p) return showToast("أدخل كلمة المرور", "err");
  try {
    if (window.supabaseClient && window.CURRENT_MANAGER_ID) {
      const hashedP = await hashPass(p);
      const { data: center } = await window.supabaseClient.from('centers').select('password').eq('id', window.CURRENT_MANAGER_ID).single();
      if (center && (center.password === hashedP || center.password === p)) {
        if($("customPassModal")) $("customPassModal").classList.add("hidden"); 
        if(passSuccessCallback) passSuccessCallback(); 
        return;
      }
    }
    showToast(t("msg_err_pass") || "كلمة المرور غير صحيحة", "err");
    triggerShake("customPassInput");
  } catch (err) {
    showToast("فشل الاتصال", "err");
  }
  });

  on("customPassCancel", "click", function() { if($("customPassModal")) $("customPassModal").classList.add("hidden"); });

 on("toggleRevBtn", "click", function(e) {
 if(e) e.stopPropagation();
 isRevHidden = !isRevHidden;
 updateTopStats();
 });
// quickAttendId Enter handled by global keydown to prevent double-firing
 let _quickAttendLock = false;
on("quickAttendBtn", "click", function() {
  if (_quickAttendLock) return;
  _quickAttendLock = true;
  setTimeout(() => { _quickAttendLock = false; }, 600);
 // 1. Check subject selection first
 if (!window.currentGlobalSubject || !String(window.currentGlobalSubject).trim()) {
    showToast(currentLang === 'en' ? "Please select attendance subject from the top menu first" : "يرجى تحديد مادة الحضور من القائمة بالأعلى أولاً", "warning");
    if (typeof triggerShake === 'function') triggerShake("openSubjectModalBtn");
    if (typeof showFullscreenFeedback === 'function') showFullscreenFeedback(false, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (typeof window.openSubjectSelectionModal === 'function') window.openSubjectSelectionModal();
    }, 250);
    return;
  }

 // 2. Check student ID
 const idInp = $("quickAttendId");
 if (!idInp) return;
 const id = toInt(idInp.value); 
 if (!id || !students[String(id)]) { 
   showToast("الطالب غير مسجل", "err"); 
   triggerShake("quickAttendId");
   showFullscreenFeedback(false, false);
   return; 
 }
 
 // 3. addAttendance handles student name, package, payments
 const res = addAttendance(id, nowDateStr());
 if (res.ok) { if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceSuccess(); else playSound("pop"); } else { if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceWarning(); else playSound("error"); }
 showToast(res.msg, res.ok ? "success" : "warning");
 updateStudentUI(id); updateTopStats(); 
 idInp.value = ""; idInp.focus();
 const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
 if(card) {
   setTimeout(() => {
     card.scrollIntoView({behavior: "smooth", block: "start"});
   }, 120);
 }
 });

 on("openBtn", "click", function() {
   const openVal = $("openId") ? toInt($("openId").value) : 0;
   if (!openVal) {
     triggerShake("openId");
     return;
   }
   const existing = students[String(openVal)];
   if (window.isStudentRegistered(existing)) {
     window.extOpen(openVal);
     if ($("openId")) $("openId").value = "";
   } else {
     // الطالب غير مسجل ولا توجد له بيانات - نفتح استمارة تسجيل جديدة بهذا الرقم مباشرة دون حفظ فارغ
     const maxSt = window.SUBSCRIPTION?.maxStudents;
      if (maxSt) {
        const curCount = (typeof window.getTotalStudentsCombinedCount === "function") ? window.getTotalStudentsCombinedCount() : (Object.values(students || {}).filter(s => window.isStudentRegistered(s)).length + (typeof window.getUniqueSessionStudentsCount === "function" ? window.getUniqueSessionStudentsCount() : 0));
        if (curCount >= maxSt) {
         showToast(`تم الوصول للحد الأقصى للطلاب (${maxSt})`, "err");
         return;
       }
     }
     if (!students[String(openVal)]) {
       students[String(openVal)] = makeEmptyStudent(openVal);
     }
     window.justAddedStudentId = String(openVal);
     window.isPendingNewStudent = String(openVal);
     showToast(currentLang === "ar" ? `هذا الـ ID (#${openVal}) غير مسجل، تم فتح استمارة تسجيل طالب جديد` : `ID #${openVal} is not registered. Opened new student form.`, "info");
     window.showStudentCard();
     updateStudentUI(String(openVal));
     if ($("openId")) $("openId").value = "";
     if ($("newId")) $("newId").value = "";
     const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
     if (card) {
       setTimeout(() => {
         card.scrollIntoView({ behavior: "smooth", block: "start" });
         if ($("stName")) $("stName").focus();
       }, 120);
     }
   }
 });

 on("searchAny", "input", function(e) {
 const q = e.target.value.toLowerCase();
 const searchMsg = $("searchMsg");
 if(!searchMsg) return;
 if(!q) { searchMsg.style.display = "none"; return; }
 
 let found = [];
 const allStuds = Object.values(students);
 for (let i = 0; i < allStuds.length; i++) {
 let s = allStuds[i];
 if ((s.name && s.name.toLowerCase().includes(q)) || String(s.id).includes(q) || (s.phone && s.phone.includes(q))) {
 found.push(s);
 }
 if (found.length >= 5) break;
 }
 
 searchMsg.style.display = "block";
 let html = "";
 for (let i = 0; i < found.length; i++) {
 let s = found[i];
 html += `<div class="item" onclick="window.extOpen('${s.id}')"><b>${s.name}</b> (#${s.id})</div>`;
 }
 searchMsg.innerHTML = html;
 });

 on("addNewBtn", "click", function() {
   if (currentUserRole !== "admin" && (!currentPermissions || !currentPermissions.can_add_student)) {
     showToast("عفواً، إضافة طالب جديد مقفلة من المدير ", "err");
     return;
   }
   const maxSt = window.SUBSCRIPTION?.maxStudents;
    if (maxSt) {
      const curCount = (typeof window.getTotalStudentsCombinedCount === "function") ? window.getTotalStudentsCombinedCount() : (Object.values(students || {}).filter(s => window.isStudentRegistered(s)).length + (typeof window.getUniqueSessionStudentsCount === "function" ? window.getUniqueSessionStudentsCount() : 0));
      if (curCount >= maxSt) {
       if (typeof Swal !== "undefined") {
         Swal.fire({
           icon: "warning",
           title: "تم الوصول للحد الأقصى للطلاب",
           text: `باقتكم الحالية تسمح بحد أقصى ${maxSt} طالب. يرجى من الإدارة ترقية الاشتراك لإضافة المزيد من الطلاب.`,
           confirmButtonText: "إغلاق",
           confirmButtonColor: "#2563EB"
         });
       } else {
         showToast(`تم الوصول للحد الأقصى للطلاب (${maxSt})`, "err");
       }
       return;
     }
   }
   const id = $("newId") ? toInt($("newId").value) : 0;
   if (!id) {
     triggerShake("newId");
     return;
   }
   let existing = students[String(id)];
   if (window.isStudentRegistered(existing)) {
     triggerShake("newId");
     showToast(" هذا الكود محجوز ومسجل به بيانات بالفعل", "err");
     if (typeof AssistantSounds !== "undefined") AssistantSounds.error(); else playSound("error");
     window.extOpen(id);
     if ($("newId")) $("newId").value = "";
     return;
   }
   if (!students[String(id)]) {
     students[String(id)] = makeEmptyStudent(id);
   }
   window.justAddedStudentId = String(id);
   window.isPendingNewStudent = String(id);
   showToast(currentLang === "ar" ? `تم فتح استمارة طالب جديد برقم #${id}، يرجى كتابة البيانات والضغط على حفظ` : `Opened new student profile #${id}`, "info");
   if (typeof AssistantSounds !== "undefined") AssistantSounds.newStudentForm();
   window.showStudentCard();
   updateStudentUI(String(id));
   if ($("newId")) $("newId").value = "";
   const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
   if (card) {
     setTimeout(() => {
       card.scrollIntoView({ behavior: "smooth", block: "start" });
       if ($("stName")) $("stName").focus();
     }, 120);
   }
 });

 on("saveStudentBtn", "click", function() {
   if (!currentId) return;
   const s = students[currentId]; if (!s) return;
   const nameVal = $("stName") ? $("stName").value.trim() : "";
   if (!nameVal) {
     triggerShake("stName");
     showToast(currentLang === "ar" ? "يرجى كتابة اسم الطالب أولاً لحفظ البيانات" : "Please enter student name first", "warning");
     if ($("stName")) $("stName").focus();
     return;
   }
   s.name = nameVal;
   if ($("stClass")) s.className = $("stClass").value.trim();
   if ($("stPhone")) s.phone = $("stPhone").value.trim();
   if ($("stParentPhone")) s.parentPhone = $("stParentPhone").value.trim();
   s.lastModified = Date.now();
   const curNum = toInt(currentId);
   if (curNum > BASE_MAX_ID && !extraIds.includes(curNum)) extraIds.push(curNum);
   window.isPendingNewStudent = null;
   window.justAddedStudentId = null;
   if ($("newBadge")) $("newBadge").classList.add("hidden");
 if (typeof AssistantSounds !== "undefined") AssistantSounds.studentSave(); else playSound("click");
 saveAll(); showToast(t("msg_saved")); updateStudentUI(currentId);
 
 let sClass = s.className ? s.className.trim() : "";
 
    let req = 0;
    if (sClass && groupFees[sClass] !== undefined) {
       const pkg = groupFees[sClass];
       if (s.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg); // handle old format where pkg is just a number
       }
    }

 if (req > 0 && s.paid >= req) {
 fireConfetti();
 }
 });

 on("showReceiptBtn", "click", function() {
 if(!currentId) return;
 const st = students[currentId]; if (!st) return;

 if ($("receiptCenterName")) $("receiptCenterName").textContent = evalData.centerName || "إدارة السنتر";
 
 // Official collector name (Logged-in assistant or Manager)
 const asstName = localStorage.getItem("ca_current_username") || (evalData.manager ? evalData.manager : "المدير المسئول");
 if ($("receiptCollectorName")) $("receiptCollectorName").textContent = `المستلم المسؤول: أ/ ${asstName}`;
 
 if ($("receiptDate")) $("receiptDate").textContent = `التاريخ: ${nowDateStr()}`;
 if ($("receiptAuthDate")) $("receiptAuthDate").textContent = `اعتماد رقمي موثق • ${nowDateStr()}`;
 
 if ($("receiptStudentName")) $("receiptStudentName").textContent = st.name || "طالب بدون اسم";
 if ($("receiptStudentID")) $("receiptStudentID").textContent = `#${st.id}`;
 if ($("receiptStudentClass")) {
   const pkgsStr = (st.packages && st.packages.length > 0) ? st.packages.filter(p => p && p !== "عام" && p !== "General").join(" + ") : ((st.className && st.className !== "عام" && st.className !== "General") ? st.className : (currentLang === "ar" ? "عام" : "General"));
   $("receiptStudentClass").textContent = pkgsStr;
 }
 
 // Fix phone double-zero bug
 let cleanPhone = "غير مسجل";
 if (st.phone) {
   const pStr = String(st.phone).trim();
   cleanPhone = pStr.startsWith("0") ? pStr : ("0" + pStr);
 }
 if ($("receiptStudentPhone")) $("receiptStudentPhone").textContent = cleanPhone;

 const recTbody = $("receiptPackagesTbody");
 if (recTbody) {
   let rRows = "";
   const enrolledPkgs = (st.packages && st.packages.length > 0) ? st.packages.filter(p => p && p !== "عام" && p !== "General") : [(st.className && st.className !== "عام" && st.className !== "General" ? st.className : (currentLang === "ar" ? "عام" : "General"))];
   enrolledPkgs.forEach(pName => {
     const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pName) : null;
     const reqPrice = pDet && pDet.price ? toInt(pDet.price) : 0;
     let pPaid = 0;
     if (st.payments) {
       st.payments.forEach(pay => {
         const matchedPkg = pay.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
         if (matchedPkg === pName) pPaid += toInt(pay.amount);
       });
     }
     let pkgDisc = 0;
     if (st.packageDiscounts && st.packageDiscounts[pName]) {
       pkgDisc = toInt(st.packageDiscounts[pName]);
     }
     const netRequired = Math.max(0, reqPrice - pkgDisc);
     const isFull = (netRequired > 0 && pPaid >= netRequired) || (reqPrice > 0 && pPaid >= reqPrice);
     const badgeHtml = isFull 
       ? '<span class="badge" style="background:rgba(16,185,129,0.12); color:#10b981; font-size:0.85em; font-weight:800; padding:4px 10px; border-radius:6px;">مسددة بالكامل </span>'
       : `<span class="badge" style="background:rgba(239,68,68,0.1); color:#ef4444; font-size:0.85em; font-weight:800; padding:4px 10px; border-radius:6px;">متبقي: ${Math.max(0, netRequired - pPaid)} ج</span>`;
     rRows += `
       <tr style="border-bottom: 1px solid var(--border);">
         <td style="padding: 10px 8px; font-weight: bold; color: var(--text); font-size:1em;">
           ${pName}
           ${pkgDisc > 0 ? `<div style="font-size:0.75em; color:var(--warning); font-weight:700;">(خصم معتمد: ${pkgDisc} ج)</div>` : ''}
         </td>
         <td style="padding: 10px 8px; text-align: center;">${reqPrice} ج</td>
         <td style="padding: 10px 8px; text-align: center; color: var(--success); font-weight: bold;">${pPaid} ج</td>
         <td style="padding: 10px 8px; text-align: center;">${badgeHtml}</td>
       </tr>`;
   });
   recTbody.innerHTML = rRows;
 }
 
 if ($("receiptTotalPaid")) $("receiptTotalPaid").textContent = `${st.paid || 0} ج`;
 
 let methodsStr = "طرق الدفع: ";
 let mMap = {};
 if (st.payments && st.payments.length > 0) {
   for(let i=0; i<st.payments.length; i++) {
     let m = st.payments[i].method || "cash";
     mMap[m] = (mMap[m] || 0) + toInt(st.payments[i].amount);
   }
   let arr = [];
   if(mMap["cash"]) arr.push(`كاش (${mMap["cash"]} ج)`);
   if(mMap["instapay"]) arr.push(`إنستاباي (${mMap["instapay"]} ج)`);
   if(mMap["wallet"]) arr.push(`محافظ/فودافون كاش (${mMap["wallet"]} ج)`);
   methodsStr += arr.join(" + ");
 } else {
   methodsStr += "كاش";
 }
 if ($("receiptPaymentMethods")) $("receiptPaymentMethods").textContent = methodsStr;
 
 if ($("receiptModal")) $("receiptModal").classList.remove("hidden");
 });

 window.togglePhotoView = function() {};

 on("rankNormalBtn", "click", function() {
 if(!currentId) return;
 students[currentId].rank = "normal";
 if (typeof AssistantSounds !== "undefined") AssistantSounds.rankNormal();
 if (typeof window.updateStudentCardRankTheme === "function") window.updateStudentCardRankTheme("normal");
 saveAll(); updateStudentUI(currentId); showToast("تم التحديث لـ عادي ");
 });

 on("rankVipBtn", "click", function() {
 if(!currentId) return;
 students[currentId].rank = "vip";
 if (typeof AssistantSounds !== "undefined") AssistantSounds.rankVIP();
 if (typeof window.updateStudentCardRankTheme === "function") window.updateStudentCardRankTheme("vip");
 saveAll(); updateStudentUI(currentId); showToast("تم الترقية لـ VIP ");
 });

 on("rankWarnBtn", "click", function() {
 if(!currentId) return;
 students[currentId].rank = "warn";
 if (typeof AssistantSounds !== "undefined") AssistantSounds.rankWarn();
 if (typeof window.updateStudentCardRankTheme === "function") window.updateStudentCardRankTheme("warn");
 saveAll(); updateStudentUI(currentId); showToast("تم إعطاء إنذار ", "warning");
 });
 
 on("markTodayBtn", "click", function() { 
  const selectedSubject = window.currentGlobalSubject || "";
  if (!selectedSubject || !String(selectedSubject).trim()) {
    showToast(currentLang === 'en' ? "Please select attendance subject from the top menu first" : "يرجى تحديد مادة الحضور من القائمة بالأعلى أولاً", "warning");
    if (typeof triggerShake === 'function') triggerShake("openSubjectModalBtn");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (typeof window.openSubjectSelectionModal === 'function') window.openSubjectSelectionModal();
    }, 250);
    return;
  }
  if(currentId) {
    const res = addAttendance(currentId, nowDateStr());
    if (res && !res.ok) {
      showToast(res.msg, "warning");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceWarning();
      return;
    }
    if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceSuccess();
    showToast(t("msg_att_ok"), "success");
    updateStudentUI(currentId);
    renderReport(nowDateStr());
  }
});

 on("unmarkTodayBtn", "click", function() { 
 if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceRemove();
 if(currentId) { removeAttendance(currentId, nowDateStr()); updateStudentUI(currentId); renderReport(nowDateStr()); }
 });

 // payDebtBtn removed per user request

 
  // Listeners for Package-Specific Payments Filter and Select
  const newPayPkgEl = document.getElementById("newPaymentPackage");
  if (newPayPkgEl) {
      newPayPkgEl.addEventListener("change", function() {
          if (!currentId || !students[currentId]) return;
          const st = students[currentId];
          window.updatePkgFinanceCardUI(st, this.value);
          window.renderStudentPaymentsUI(st, this.value);
      });
  }
  const btnPkgFilter = document.getElementById("btnPayFilterPkg");
  if (btnPkgFilter) {
      btnPkgFilter.addEventListener("click", function() {
          window.currentPayFilterMode = 'package';
          if (!currentId || !students[currentId]) return;
          const st = students[currentId];
          const selPkg = document.getElementById("newPaymentPackage") ? document.getElementById("newPaymentPackage").value : "";
          window.renderStudentPaymentsUI(st, selPkg);
      });
  }
  const btnAllFilter = document.getElementById("btnPayFilterAll");
  if (btnAllFilter) {
      btnAllFilter.addEventListener("click", function() {
          window.currentPayFilterMode = 'all';
          if (!currentId || !students[currentId]) return;
          const st = students[currentId];
          const selPkg = document.getElementById("newPaymentPackage") ? document.getElementById("newPaymentPackage").value : "";
          window.renderStudentPaymentsUI(st, selPkg);
      });
  }

  const payMethodSelect = document.getElementById("newPaymentMethod");
  if (payMethodSelect) {
      payMethodSelect.addEventListener("change", function() {
          if (typeof window.updatePaymentMethodTheme === "function") {
              window.updatePaymentMethodTheme(this.value);
          }
      });
  }

  on("addPaymentBtn", "click", function() {
  if(!currentId) return;
  const payInp = $("newPaymentInput"); if (!payInp) return;
  const v = toInt(payInp.value); if(!v) return;
  
  const methodInp = $("newPaymentMethod");
  const method = methodInp ? methodInp.value : "cash";
  let methodName = "كاش";
  if (method === "instapay") methodName = "إنستاباي";
  if (method === "wallet") methodName = "فودافون كاش";
  
  const pkgSelector = $("newPaymentPackage");
  const pkgName = pkgSelector ? pkgSelector.value : "";
  
  if (!pkgName) {
      showToast("يرجى اختيار الباقة المراد الدفع لها", "err");
      triggerShake("newPaymentPackage");
      return;
  }

  const st = students[currentId];
  if ($("stName")) st.name = $("stName").value; 
  if ($("stPhone")) st.phone = $("stPhone").value;
  
  st.paid = (st.paid || 0) + v;
  if (!st.payments) st.payments = [];
  st.payments.push({ date: nowDateStr(), amount: v, method: method, pkgName: pkgName });
  const today = nowDateStr();
  if (!revenueByDate[today]) revenueByDate[today] = 0;
  revenueByDate[today] += v;
  
  const pDetails = window.getPkgDetails(pkgName);
  const req = toInt(pDetails.price);
  let pkgPaid = 0;
  st.payments.forEach(p => {
      const pPkg = p.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
      if (pPkg === pkgName) pkgPaid += toInt(p.amount);
  });
  const pkgRemain = Math.max(0, req - pkgPaid);

  saveAll();
  updateStudentUI(currentId);
  if (payInp) payInp.value = "";
  
  if(req > 0 && pkgPaid >= req) {
    fireConfetti();
    if (typeof AssistantSounds !== "undefined") AssistantSounds.debtCleared();
    else playSound("money");
  } else {
    if (typeof AssistantSounds !== "undefined") {
      if (method === "instapay" || method === "wallet") {
        AssistantSounds.digitalPayment();
      } else {
        AssistantSounds.cashPayment();
      }
    } else playSound("money");
  }
  showToast(t("msg_deposit"));
  
  if(st.phone) {
      const activeCollector = localStorage.getItem("ca_current_username") || currentManager || ((typeof currentUserRole !== 'undefined' && currentUserRole === "admin") ? "المدير العام" : "المساعد المسؤول");
      const dNow = new Date();
      const dateFormatted = dNow.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const timeFormatted = dNow.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

      let pkgStatusLine = (pkgRemain === 0) 
          ? "حالة الباقة: تم سداد قيمة باقة (" + pkgName + ") بالكامل" 
          : " المتبقي لباقة (" + pkgName + "): " + pkgRemain + " ج.";

      // Build itemized breakdown of all enrolled packages
      let packagesBreakdown = "";
      if (st.packages && st.packages.length > 0) {
          packagesBreakdown = "\r\nكشف حساب باقات واشتراكات الطالب:\r\n";
          st.packages.forEach(pName => {
              const pDetail = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pName) : (groupFees[pName] || { price: 0 });
              const pReq = toInt(pDetail.price);
              let pSum = 0;
              (st.payments || []).forEach(pm => {
                  const pmPkg = pm.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
                  if (pmPkg === pName) pSum += toInt(pm.amount);
              });
              const pRem = Math.max(0, pReq - pSum);
              if (pRem === 0) {
                  packagesBreakdown += "• " + pName + " (المطلوب: " + pReq + " ج | مدفوع: " + pSum + " ج) — مسددة بالكامل\r\n";
              } else {
                  packagesBreakdown += "• " + pName + " (المطلوب: " + pReq + " ج | مدفوع: " + pSum + " ج) — المتبقي: " + pRem + " ج \r\n";
              }
          });
      }

      let msg = "مرحباً " + (st.name || "الطالب") + "\r\n"
              + "━━━━━━━━━━━━━━━━━━━\r\n"
              + "تم استلام دفعة جديدة بنجاح\r\n\r\n"
              + "تفاصيل الدفعة المستلمة:\r\n"
              + "• المبلغ المستلم: " + v + " ج (" + methodName + ")\r\n"
              + "• الباقة المحددة: " + pkgName + "\r\n"
              + "• " + pkgStatusLine + "\r\n"
              + "• تاريخ ووقت السداد: " + dateFormatted + " | " + timeFormatted + "\r\n"
              + "• المستلم المسؤول: أ/ " + activeCollector + " \r\n"
              + packagesBreakdown
              + "━━━━━━━━━━━━━━━━━━━\r\n"
              + "نظام ستوديفاي التعليمي — Studify Edu System";

      setTimeout(function() { 
          window.open("https://wa.me/20" + st.phone + "?text=" + encodeURIComponent(msg), '_blank'); 
      }, 1000);
  }
  payInp.value = "";
});

 window.deleteStudentPayment = function(index) {
 if(!currentId) return;
 let st = students[currentId];
 if(!st || !st.payments || !st.payments[index]) return;
 
 let msg = currentLang === 'ar' ? " متأكد من حذف هذه الدفعة نهائياً؟" : " Are you sure you want to delete this payment?";
 Swal.fire({
 title: 'تأكيد الحذف',
 text: msg,
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'نعم، احذف' : 'Yes, delete',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((result) => {
 if (result.isConfirmed) {
 let p = st.payments[index];
 st.paid = Math.max(0, st.paid - p.amount);
 
 if (revenueByDate[p.date]) {
 revenueByDate[p.date] = Math.max(0, revenueByDate[p.date] - p.amount);
 }
 
 st.payments.splice(index, 1);
 
 saveAll(); 
 updateStudentUI(currentId); 
 renderReport(nowDateStr()); 
 renderCharts();
 if (typeof showToast === "function") showToast(currentLang === 'ar' ? "تم حذف الدفعة وتعديل الحساب " : "Payment deleted ", "warning");
 }
 });
 };

 on("correctPayBtn", "click", function() {
 if (currentUserRole !== "admin" && (!currentPermissions || !currentPermissions.can_request_discount)) {
 showToast("عفواً، خصم/إعفاء الطلاب مقفل من المدير ", "err");
 return;
 }
 if(!currentId) return; 
 Swal.fire({
 title: currentLang === 'ar' ? 'قيمة الخصم' : 'Deduct amount',
 input: 'number',
 inputAttributes: { min: 1 },
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'خصم' : 'Deduct',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((result) => {
 if (result.isConfirmed && result.value) {
 const v = toInt(result.value);
 if(!v) return;
 let st = students[currentId];
 st.paid = Math.max(0, st.paid - v);
 const today = nowDateStr();
 revenueByDate[today] = Math.max(0, (revenueByDate[today] || 0) - v);
 
 if(st.payments && st.payments.length > 0) {
 let remToDeduct = v;
 for(let j = st.payments.length - 1; j >= 0; j--) {
 if(st.payments[j].date === today) {
 if(st.payments[j].amount <= remToDeduct) {
 remToDeduct -= st.payments[j].amount;
 st.payments.splice(j, 1);
 } else {
 st.payments[j].amount -= remToDeduct;
 remToDeduct = 0;
 break;
 }
 }
 }
 }
 
 saveAll(); showToast(t("msg_discount"), "warning"); updateStudentUI(currentId); renderReport(nowDateStr()); renderCharts();
 }
 });
 });

 window.renderStudentNotes = function(id) {
 const container = $("stNotesListContainer"); if (!container) return;
 const st = students[id]; if (!st) return;
 
 let notesStr = st.notes ? st.notes.trim() : "";
 if (!notesStr) {
 container.innerHTML = `<div class="mutedCenter" style="font-size:0.85em;">${t("txt_no_notes")}</div>`;
 return;
 }
 
 let lines = notesStr.split("\r\n").filter(l => l.trim() !== "");
 if (lines.length === 0) {
 container.innerHTML = `<div class="mutedCenter" style="font-size:0.85em;">${t("txt_no_notes")}</div>`;
 return;
 }
 
 let html = "";
 for (let i = 0; i < lines.length; i++) {
 let line = lines[i];
 let datePart = "";
 let textPart = line;
 
 let match = line.match(/^\[([^\]]+)\]\s*:\s*(.*)$/);
 if (match) {
 datePart = match[1];
 textPart = match[2];
 }
 
 html += `
 <div class="note-card" style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
 <div style="flex:1; line-height:1.4;">
 ${datePart ? `<span class="badge" style="background:#334155; color:#f8fafc; font-size:0.75em; margin-bottom:4px; display:inline-block;"> ${datePart}</span><br>` : ""}
 <span style="color:var(--text); font-size:0.9em;">${textPart}</span>
 </div>
 <div class="row" style="width:auto; gap:6px;">
 <button class="btn warning smallBtn iconOnly edit-note-btn" data-index="${i}" title="${t('btn_edit_note')}"><i class="fa-solid fa-pen-to-square"></i></button>
 <button class="btn danger smallBtn iconOnly delete-note-btn" data-index="${i}" title="${t('btn_del_note')}"><i class="fa-solid fa-trash-can"></i></button>
 </div>
 </div>`;
 }
 
 container.innerHTML = html;
 
 container.querySelectorAll(".edit-note-btn").forEach(btn => {
 btn.onclick = function() {
 let idx = toInt(this.getAttribute("data-index"));
 let allLines = (students[currentId].notes || "").split("\r\n").filter(l => l.trim() !== "");
 let currentLine = allLines[idx];
 
 let existingDate = "";
 let editableText = currentLine;
 let match = currentLine.match(/^\[([^\]]+)\]\s*:\s*(.*)$/);
 if (match) {
 existingDate = match[1];
 editableText = match[2];
 }
 
 Swal.fire({
 title: t("prompt_edit_note"),
 input: 'textarea',
 inputValue: editableText,
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'حفظ' : 'Save',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((res) => {
 if (res.isConfirmed && res.value !== null) {
 let newText = res.value;
 if (newText.trim() === "") {
 Swal.fire({
 title: 'تأكيد الحذف',
 text: t("confirm_empty_note"),
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'نعم، احذف' : 'Yes, delete',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((delRes) => {
 if (delRes.isConfirmed) {
 allLines.splice(idx, 1);
 students[currentId].notes = allLines.join("\r\n");
 saveAll();
 renderStudentNotes(currentId);
 if(typeof showToast === "function") showToast(t("msg_note_deleted"), "warning");
 }
 });
 } else {
 allLines[idx] = existingDate ? `[${existingDate}] : ${newText.trim()}` : newText.trim();
 students[currentId].notes = allLines.join("\r\n");
 saveAll();
 renderStudentNotes(currentId);
 if (typeof showToast === "function") showToast(t("msg_note_edited"), "success");
 }
 }
 });
 };
 });
 
 container.querySelectorAll(".delete-note-btn").forEach(btn => {
 btn.onclick = function() {
 let idx = toInt(this.getAttribute("data-index"));
 Swal.fire({
 title: 'تأكيد الحذف',
 text: t("confirm_del_note"),
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: currentLang === 'ar' ? 'نعم، احذف' : 'Yes, delete',
 cancelButtonText: currentLang === 'ar' ? 'إلغاء' : 'Cancel'
 }).then((result) => {
 if (result.isConfirmed) {
 let allLines = (students[currentId].notes || "").split("\r\n").filter(l => l.trim() !== "");
 allLines.splice(idx, 1);
 students[currentId].notes = allLines.join("\r\n");
 saveAll();
 renderStudentNotes(currentId);
 if(typeof showToast === "function") showToast(t("msg_note_deleted"), "warning");
 }
 });
 };
 });
 };

 on("addNoteBtn", "click", function() {
 if(!currentId) return; 
 const noteInp = $("newNoteInp"); if (!noteInp) return;
 const txt = noteInp.value.trim(); if(!txt) return;
 
 const now = new Date(); const stamp = `[${now.toISOString().split('T')[0]}]`;
 let oldNotes = students[currentId].notes ? students[currentId].notes : "";
 students[currentId].notes = `${stamp} : ${txt}\r\n${oldNotes}`;
 
 saveAll(); renderStudentNotes(currentId); showToast(t("msg_saved"));
 noteInp.value = "";
 });

 on("waBtn", "click", function() { 
 if (typeof AssistantSounds !== "undefined") AssistantSounds.messageSend();
 const phInp = $("stPhone");
 if (phInp && phInp.value) {
   let ph = phInp.value.trim().replace(/\D/g, '');
   if (ph.startsWith('0')) ph = ph.substring(1);
   window.open(`https://wa.me/20${ph}`, '_blank'); 
 } else {
   showToast("يرجى إدخال رقم الطالب أولاً", "err");
 }
 });

 on("waParentBtn", "click", function() { 
 if (typeof AssistantSounds !== "undefined") AssistantSounds.messageSend();
 const phInp = $("stParentPhone");
 if (phInp && phInp.value) {
   let ph = phInp.value.trim().replace(/\D/g, '');
   if (ph.startsWith('0')) ph = ph.substring(1);
   window.open(`https://wa.me/20${ph}`, '_blank'); 
 } else {
   showToast("يرجى إدخال رقم ولي الأمر أولاً", "err");
 }
 });

 
  on("stClass", "change", function() {
    const cls = this.value;
    const pkg = groupFees[cls];
    if (pkg && pkg.hasInstallments) {
      if($("stPaymentPlanContainer")) $("stPaymentPlanContainer").style.display = "block";
    } else {
      if($("stPaymentPlanContainer")) {
        $("stPaymentPlanContainer").style.display = "none";
        if($("stPaymentPlan")) $("stPaymentPlan").value = "cash";
      }
    }
  });

  // Operational Expense recording for Assistant
  on("asstSaveExpenseBtn", "click", function() {
    if (!$("asstExpenseAmtInp") || !$("asstExpenseReasonInp")) return;
    const a = toInt($("asstExpenseAmtInp").value);
    const r = $("asstExpenseReasonInp").value.trim();
    const m = $("asstExpenseMethodInp") ? $("asstExpenseMethodInp").value : "cash";
    const d = $("asstExpenseDateInp") && $("asstExpenseDateInp").value ? $("asstExpenseDateInp").value : nowDateStr();
    const isAr = (currentLang === "ar");

    if (!a || a <= 0) { showToast(isAr ? "يرجى إدخال مبلغ صحيح للمصروف" : "Please enter a valid amount", "err"); return; }
    if (!r) { showToast(isAr ? "يرجى إدخال بند أو سبب المصروف" : "Please enter expense reason", "err"); return; }

    if (!expensesByDate[d]) expensesByDate[d] = [];
    expensesByDate[d].push({
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      amount: a,
      reason: r,
      method: m,
      type: "expense",
      date: d,
      timestamp: Date.now()
    });

    saveAll();
    $("asstExpenseAmtInp").value = "";
    $("asstExpenseReasonInp").value = "";
    showToast(isAr ? "تم تسجيل المصروف بنجاح وتحديث الخزائن" : "Expense recorded successfully", "success");
    if (typeof renderAssistantExpensesTable === "function") renderAssistantExpensesTable();
    if (typeof renderReport === "function") renderReport(d);
  });

  window.renderAssistantExpensesTable = function() {
    const tbody = $("asstExpensesTableBody");
    if (!tbody) return;
    const isAr = (currentLang === "ar");
    const currencySuffix = isAr ? " ج" : " EGP";

    const allExp = [];
    for (const d in expensesByDate) {
      const list = expensesByDate[d] || [];
      list.forEach((item, idx) => {
        if (item) allExp.push({ ...item, _date: d, _idx: idx });
      });
    }

    allExp.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (allExp.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; color:var(--text-secondary);">${isAr ? "لا توجد مصروفات مسجلة بعد" : "No expenses recorded yet"}</td></tr>`;
      return;
    }

    const methodMap = {
      cash: { ar: "درج الكاش", en: "Cash Drawer", icon: "fa-money-bill-wave", color: "#10b981" },
      wallet: { ar: "فودافون كاش", en: "Vodafone Cash", icon: "fa-wallet", color: "#ef4444" },
      instapay: { ar: "إنستاباي", en: "InstaPay", icon: "fa-mobile-screen-button", color: "#0284c7" }
    };

    let html = "";
    allExp.forEach(it => {
      const mInfo = methodMap[it.method || "cash"] || methodMap.cash;
      const isWd = (it.type === "withdrawal" || it.isWithdrawal);
      const reasonLabel = isWd ? `<span style="color:#f59e0b; font-weight:700;">[مسحوبات]</span> ${it.reason}` : it.reason;

      html += `
        <tr>
          <td style="font-weight:700; white-space:nowrap;">${it._date || "—"}</td>
          <td style="font-weight:700;">${reasonLabel || "—"}</td>
          <td><span class="badge" style="color:${mInfo.color}; background:var(--bg-inset);"><i class="fa-solid ${mInfo.icon}"></i> ${isAr ? mInfo.ar : mInfo.en}</span></td>
          <td style="font-weight:900; color:#ef4444; white-space:nowrap;">${Number(it.amount || 0).toLocaleString()} ${currencySuffix}</td>
          <td>
            <button class="btn danger smallBtn iconOnly" onclick="window.deleteAssistantExpense('${it._date}', ${it._idx})" title="${isAr ? "حذف المصروف" : "Delete"}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  };

  window.deleteAssistantExpense = async function(d, idx) {
    const isAr = (currentLang === "ar");
    if (!expensesByDate[d] || !expensesByDate[d][idx]) return;

    const conf = await Swal.fire({
      title: isAr ? "تأكيد حذف المصروف" : "Confirm Deletion",
      text: isAr ? "هل أنت متأكد من حذف هذا المصروف؟ سيتم استرجاع المبلغ للخزينة فورياً." : "Delete this expense?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isAr ? "نعم، حذف" : "Yes, delete",
      cancelButtonText: isAr ? "إلغاء" : "Cancel",
      confirmButtonColor: "#ef4444"
    });

    if (conf.isConfirmed) {
      expensesByDate[d].splice(idx, 1);
      if (expensesByDate[d].length === 0) delete expensesByDate[d];
      saveAll();
      showToast(isAr ? "تم حذف المصروف وتحديث الخزينة" : "Expense deleted", "success");
      if (typeof renderAssistantExpensesTable === "function") renderAssistantExpensesTable();
      if (typeof renderReport === "function") renderReport(d);
    }
  };

 window.renderManagerPackagesCard = function() {

   const container = $("managerPackagesOverviewList");
   if (!container) return;

   const keys = Object.keys(groupFees || {});
   if (keys.length === 0) {
     const isArPk = (currentLang === 'ar');
   container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:15px; color:var(--text-secondary); font-size:12px;">${isArPk ? 'لا توجد باقات مسجلة بعد. اضغط على التعديل والإضافة للبدء.' : 'Generals registered yet. Click edit & add to get started.'}</div>`;
     return;
   }

   let h = "";
   keys.forEach(k => {
     const details = window.getPkgDetails(k);
     let ruleBadge = "";
      if (details.expiryType === 'time' && details.startDate && details.endDate) {
        ruleBadge = `<span class="badge" style="background:#fef3c7; color:#92400e; font-size:11px;"><i class="fa-solid fa-calendar-days"></i> ${details.startDate} إلي ${details.endDate}</span>`;
      } else if (details.expiryType === 'sessions' && details.sessionLimit > 0) {
        ruleBadge = `<span class="badge" style="background:#fce7f3; color:#9d174d; font-size:11px;"><i class="fa-solid fa-ticket"></i> ${details.sessionLimit} حصص</span>`;
      }

     h += `
     <div style="display:flex; flex-direction:column; gap:6px; padding:10px 12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
       <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
         <strong style="font-size:13px; color:var(--text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${k}</strong>
         <span style="font-weight:bold; color:var(--success); font-size:12px;">${details.price} ج</span>
       </div>
       <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
         ${ruleBadge}
       </div>
     </div>`;
   });
   container.innerHTML = h;
 };

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
        text: `المدة الزمنية للباقة: ${days} يوماً (${summary})`,
        short: `${days} يوم`
      };
    } else {
      let breakdown = [];
      if (months > 0) breakdown.push(`${months} month${months > 1 ? 's' : ''}`);
      if (remDays > 0) breakdown.push(`${remDays} day${remDays > 1 ? 's' : ''}`);
      const summary = breakdown.length > 0 ? breakdown.join(' and ') : `${days} days`;
      return {
        days,
        text: `Package Duration: ${days} days (${summary})`,
        short: `${days} d`
      };
    }
  }
  window.formatPackageDuration = formatPackageDuration;

 window.renderGroupFeesModal = function() {
    const isAr = (currentLang === "ar");
    const currencySuffix = isAr ? " ج" : " EGP";
    const counts = {};
    Object.values(students || {}).forEach(st => {
      if(!st) return;
      const pList = (Array.isArray(st.packages) && st.packages.length > 0) ? st.packages.filter(p => p && p !== "عام" && p !== "General") : (st.className && st.className !== "عام" && st.className !== "General" ? [st.className] : []);
      pList.forEach(pName => {
        counts[pName] = (counts[pName] || 0) + 1;
      });
      if (st.className && !pList.includes(st.className)) {
        counts[st.className] = (counts[st.className] || 0) + 1;
        const altName = (isAr ? "باقة " : "Package ") + st.className;
        counts[altName] = (counts[altName] || 0) + 1;
      }
    });

    const isEditing = !!window._editingPkgName;
    const editTarget = isEditing ? (groupFees[window._editingPkgName] || {}) : null;

    const builderTitle = isEditing 
      ? (isAr ? `تعديل الباقة: ${window._editingPkgName}` : `Edit Package: ${window._editingPkgName}`)
      : (isAr ? "إضافة / تعديل باقة جديدة" : "Add / Edit Package");
    const pkgNamePlc = isAr ? "اسم الباقة (مثال: باقة سبتمبر)" : "Package Name (e.g. September Package)";
    const pkgSubjectPlc = isAr ? "المادة (مثال: فيزياء)" : "Subject (e.g. Physics)";
    const pkgPricePlc = isAr ? "السعر (ج.م)" : "Price (EGP)";
    const expirySystemLbl = isAr ? "نظام الصلاحية وتنبيهات الانتهاء:" : "Validity System & Expiry Alerts:";
    const optTimeText = isAr ? "بالمدة الزمنية (من تاريخ إلى تاريخ)" : "By Duration (From Date to Date)";
    const optSessionsText = isAr ? "بعدد الحصص (مثال: 8 حصص)" : "By Session Count (e.g. 8 Sessions)";
    const pkgDurationLbl = isAr ? "المدة الزمنية للباقة:" : "Package Duration:";
    const startDateLbl = isAr ? "تاريخ البداية:" : "Start Date:";
    const endDateLbl = isAr ? "تاريخ النهاية:" : "End Date:";
    const sessionsAllowedLbl = isAr ? "عدد الحصص المسموحة للمشترك:" : "Allowed Sessions for Subscriber:";
    const sessionsPlc = isAr ? "عدد الحصص (مثال: 8)" : "Session Count (e.g. 8)";
    const saveBtnText = isEditing 
      ? (isAr ? "حفظ التعديلات على الباقة" : "Save Package Changes")
      : (isAr ? "حفظ وتحديث الباقة في النظام" : "Save & Update Package");
    const existingPkgsTitle = isAr ? "الباقات الحالية المُعرفة بالنظام" : "Currently Defined Packages";
    const noPkgsText = isAr ? "لا توجد باقات معرفة بعد. أضف باقة جديدة أعلاه." : "Generals defined yet. Add a new package above.";
    const enrolledLabel = isAr ? "المشتركين:" : "Enrolled:";
    const studentsWord = isAr ? "طالب" : "Students";
    const editBtnTitle = isAr ? "تعديل الباقة" : "Edit Package";
    const deleteBtnTitle = isAr ? "حذف الباقة" : "Delete Package";
    const sessionsSuffix = isAr ? " حصص" : " Sessions";
    const toWord = isAr ? " إلي " : " to ";

    const curName = isEditing ? window._editingPkgName : "";
    const curSubj = isEditing ? (editTarget.subject || "") : "";
    const curPrice = isEditing ? (editTarget.price || "") : "";
    const curExp = isEditing ? (editTarget.expiryType || "time") : "time";
    const curStart = isEditing ? (editTarget.startDate || "") : "";
    const curEnd = isEditing ? (editTarget.endDate || "") : "";
    const curSess = isEditing ? (editTarget.sessionLimit || 8) : 8;

    let cancelBtnHtml = isEditing 
      ? `<button type="button" class="btn secondary" id="cancelEditPkgBtn" style="padding:11px 20px; font-weight:bold;"><i class="fa-solid fa-xmark"></i> ${isAr ? "إلغاء التعديل" : "Cancel Edit"}</button>`
      : '';

    let h = `
    <div id="pkgBuilderFormCard" class="pkg-builder-card" style="background:var(--bg-inset); border:1.5px solid ${isEditing ? 'var(--primary)' : 'var(--border)'}; border-radius:12px; padding:16px; margin-bottom:20px; transition:border-color 0.2s ease;">
      <h4 style="color:var(--primary); margin:0 0 12px 0; font-weight:bold; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-square-plus'}"></i> ${builderTitle}
      </h4>
      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
         <input type="text" id="newPkgName" class="inp" placeholder="${pkgNamePlc}" value="${curName}" style="flex:2; min-width:140px;">
         <input type="text" id="newPkgSubject" class="inp" placeholder="${pkgSubjectPlc}" value="${curSubj}" style="flex:2; min-width:140px;">
         <input type="number" id="newPkgPrice" class="inp" placeholder="${pkgPricePlc}" value="${curPrice}" style="flex:1; min-width:90px;">
       </div>
      
      <div style="margin-bottom:12px;">
        <label style="font-size:0.85em; font-weight:bold; color:var(--text-secondary); display:block; margin-bottom:6px;">${expirySystemLbl}</label>
        <select id="newPkgExpiryType" class="inp" style="margin-bottom:8px;">
          <option value="time" ${curExp==='time'?'selected':''}>${optTimeText}</option>
          <option value="sessions" ${curExp==='sessions'?'selected':''}>${optSessionsText}</option>
        </select>
      </div>

      <div id="pkgTimeOpts" style="display:${curExp==='time'?'block':'none'}; margin-bottom:12px; background:var(--bg-surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
        <label style="font-size:0.85em; font-weight:bold; color:var(--text-secondary); display:block; margin-bottom:6px;">${pkgDurationLbl}</label>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <div style="flex:1; min-width:140px;">
            <label style="font-size:0.8em; color:var(--text-secondary); display:block; margin-bottom:4px;">${startDateLbl}</label>
            <input type="date" id="newPkgStartDate" class="inp" style="width:100%;" value="${curStart}">
          </div>
          <div style="flex:1; min-width:140px;">
            <label style="font-size:0.8em; color:var(--text-secondary); display:block; margin-bottom:4px;">${endDateLbl}</label>
            <input type="date" id="newPkgEndDate" class="inp" style="width:100%;" value="${curEnd}">
          </div>
        </div>
        <div id="pkgDurationDisplay" style="margin-top:10px; padding:8px 12px; background:rgba(37,99,235,0.08); border:1px solid rgba(37,99,235,0.2); border-radius:8px; font-weight:700; color:var(--primary); font-size:0.88em; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-clock"></i> <span id="pkgDurationDisplayText"></span>
        </div>
      </div>

      <div id="pkgSessionsOpts" style="display:${curExp==='sessions'?'block':'none'}; margin-bottom:12px; background:var(--bg-surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
        <label style="font-size:0.85em; font-weight:bold; color:var(--text-secondary); display:block; margin-bottom:6px;">${sessionsAllowedLbl}</label>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <input type="number" id="newPkgSessions" class="inp" placeholder="${sessionsPlc}" value="${curSess}" style="flex:1; min-width:120px;">
          <button type="button" class="btn secondary smallBtn" onclick="if(document.getElementById('newPkgSessions')) document.getElementById('newPkgSessions').value=8;">${isAr ? "8 حصص" : "8 Sessions"}</button>
          <button type="button" class="btn secondary smallBtn" onclick="if(document.getElementById('newPkgSessions')) document.getElementById('newPkgSessions').value=12;">${isAr ? "12 حصة" : "12 Sessions"}</button>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn primary ${isEditing ? '' : 'w100'}" id="addNewPkgBtn" style="padding:11px; font-weight:bold; font-size:1em; flex:1;">
          <i class="fa-solid ${isEditing ? 'fa-check-circle' : 'fa-plus-circle'}"></i> ${saveBtnText}
        </button>
        ${cancelBtnHtml}
      </div>
    </div>

    <h4 style="color:var(--text-primary); margin:0 0 10px 0; font-size:0.95em; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
      <span><i class="fa-solid fa-list-check"></i> ${existingPkgsTitle}</span>
    </h4>
    `;

    const keys = Object.keys(groupFees || {});
    if (keys.length === 0) {
      h += `<div style="text-align:center; color:var(--text-secondary); padding:20px; font-size:0.9em;">${noPkgsText}</div>`;
    } else {
       h += `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:16px;">`;
       keys.forEach(g => {
        const details = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(g) : (groupFees[g] || {});
        const subj = details.subject || g;
        const price = Number(details.price || 0);

        // Enrolled students
        const enrolledStudents = Object.values(students || {}).filter(st => {
          if (!st) return false;
          if (Array.isArray(st.packages) && st.packages.includes(g)) return true;
          if ((!st.packages || st.packages.length === 0) && (st.className === g || ("باقة " + st.className) === g)) return true;
          return false;
        });
        const count = enrolledStudents.length;

        // Financial analytics
        const expectedRevenue = count * price;
        let collectedRevenue = 0;

        enrolledStudents.forEach(st => {
          let totalReq = 0;
          const stPkgs = (Array.isArray(st.packages) && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
          stPkgs.forEach(pkgName => {
            const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pkgName) : (groupFees[pkgName] || {});
            totalReq += Number(pDet.price || pDet || 0);
          });
          if (totalReq === 0) totalReq = price;

          const studentPaid = Number(st.paid) || 0;
          const pkgShare = totalReq > 0 ? Math.min(price, Math.round((price / totalReq) * studentPaid)) : Math.min(price, studentPaid);
          collectedRevenue += pkgShare;
        });

        const remainingRevenue = Math.max(0, expectedRevenue - collectedRevenue);
        const collectedPercent = expectedRevenue > 0 ? Math.min(100, Math.round((collectedRevenue / expectedRevenue) * 100)) : 0;

        // Duration & Validity Badges
        let validityBadgeHtml = "";
        if (details.expiryType === 'time' && details.startDate && details.endDate) {
          const durObj = formatPackageDuration(details.startDate, details.endDate, isAr);
          const durShort = durObj ? durObj.short : '';
          validityBadgeHtml = `
            <span class="admin-pkg-validity-badge" title="${isAr ? 'المدة الزمنية للباقة' : 'Package Duration'}">
              <i class="fa-regular fa-calendar-days"></i> ${details.startDate} ${toWord} ${details.endDate}
            </span>
            ${durShort ? `<span class="admin-pkg-duration-pill"><i class="fa-solid fa-clock"></i> ${durShort}</span>` : ''}
          `;
        } else if (details.expiryType === 'sessions' && details.sessionLimit > 0) {
          validityBadgeHtml = `
            <span class="admin-pkg-validity-badge" style="color:#ec4899;">
              <i class="fa-solid fa-ticket"></i> ${details.sessionLimit} ${sessionsSuffix}
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

        h += `
        <div class="admin-pkg-card">
          <div class="admin-pkg-card-top">
            <div style="flex:1; min-width:0;">
              <div class="admin-pkg-title-wrap">
                <h4 class="admin-pkg-name">${g}</h4>
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
            <button class="btn secondary smallBtn btn-pkg-edit edit-pkg-btn" data-group="${g}">
              <i class="fa-solid fa-pen-to-square"></i> ${isAr ? "تعديل كامل" : "Full Edit"}
            </button>
            <button class="btn danger smallBtn iconOnly btn-pkg-delete delete-pkg-btn" data-group="${g}" title="${deleteBtnTitle}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>`;
       });
       h += `</div>`;
     }

    if ($("groupFeesList")) $("groupFeesList").innerHTML = h;

    if ($("cancelEditPkgBtn")) {
      $("cancelEditPkgBtn").onclick = function() {
        window._editingPkgName = null;
        renderGroupFeesModal();
      };
    }

    if ($("newPkgExpiryType")) {
      const handleExpiryTypeChange = () => {
        const val = $("newPkgExpiryType").value;
        if ($("pkgTimeOpts")) $("pkgTimeOpts").style.display = (val === 'time') ? 'block' : 'none';
        if ($("pkgSessionsOpts")) $("pkgSessionsOpts").style.display = (val === 'sessions') ? 'block' : 'none';
      };
      $("newPkgExpiryType").onchange = handleExpiryTypeChange;
      handleExpiryTypeChange();
    }

    const updateAsstDurationLive = () => {
      const sInp = $("newPkgStartDate");
      const eInp = $("newPkgEndDate");
      const dBox = $("pkgDurationDisplayText");
      if (!sInp || !eInp || !dBox) return;
      const res = formatPackageDuration(sInp.value, eInp.value, isAr);
      dBox.textContent = res ? res.text : (isAr ? "يرجى تحديد تاريخ البداية والنهاية لحساب المدة" : "Please select start and end dates");
    };

    if ($("newPkgStartDate")) $("newPkgStartDate").addEventListener('input', updateAsstDurationLive);
    if ($("newPkgEndDate")) $("newPkgEndDate").addEventListener('input', updateAsstDurationLive);
    updateAsstDurationLive();

    if ($("addNewPkgBtn")) {
     $("addNewPkgBtn").onclick = async function() {
       const oldName = window._editingPkgName;
       const n = $("newPkgName").value.trim();
       const subject = $("newPkgSubject").value.trim();
       const p = toInt($("newPkgPrice").value);
       const expType = $("newPkgExpiryType") ? $("newPkgExpiryType").value : "time";
       const startDate = $("newPkgStartDate") ? $("newPkgStartDate").value : "";
       const endDate = $("newPkgEndDate") ? $("newPkgEndDate").value : "";
       const sessions = $("newPkgSessions") ? toInt($("newPkgSessions").value) : 0;

       if (!n) {
         if (typeof showToast === "function") showToast(isAr ? "يرجى كتابة اسم الباقة" : "Please enter package name", "err");
         return;
       }
       if (!subject) {
         if (typeof showToast === "function") showToast(isAr ? "يرجى كتابة المادة" : "Please enter subject", "err");
         return;
       }
       if (expType === 'time' && (!startDate || !endDate)) {
         if (typeof showToast === "function") showToast(isAr ? "يرجى تحديد تاريخ البداية والنهاية" : "Please specify start and end dates", "err");
         return;
       }

       // If editing and name changed, clean old package from Supabase and update enrolled students
       if (oldName && oldName !== n) {
         if (window.supabaseClient) {
           try { await window.supabaseClient.from('packages').delete().eq('name', oldName); } catch(e) {}
         }
         delete groupFees[oldName];
         Object.values(students || {}).forEach(st => {
           if (st && Array.isArray(st.packages) && st.packages.includes(oldName)) {
             st.packages = st.packages.map(pName => pName === oldName ? n : pName);
           }
         });
       }

       groupFees[n] = {
         name: n,
         subject: subject,
         price: p,
         expiryType: expType,
         startDate: startDate,
         endDate: endDate,
         sessionLimit: sessions,
         hasInstallments: false,
         installmentPrice: 0,
         updatedAt: nowDateStr()
       };

       window._editingPkgName = null;
       await saveAll();
       if ('BroadcastChannel' in window) {
         try {
           const bc = new BroadcastChannel('studify_permissions_sync');
           bc.postMessage({ type: 'PACKAGES_UPDATED' });
         } catch(e) {}
       }
       renderGroupFeesModal();
       populatePackages();
       if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard();
       if (typeof showToast === "function") showToast(isAr ? (oldName ? "تم تحديث الباقة بنجاح" : "تم حفظ الباقة بنجاح") : (oldName ? "Package updated successfully" : "Package saved successfully"));
     };
    }

    // Attach Edit button handler
    document.querySelectorAll(".edit-pkg-btn").forEach(btn => {
      btn.onclick = function() {
        const g = this.getAttribute("data-group");
        window._editingPkgName = g;
        renderGroupFeesModal();
        const card = document.getElementById("pkgBuilderFormCard");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });

    // Attach Delete button handler with cloud deletion
    document.querySelectorAll(".delete-pkg-btn").forEach(btn => {
     btn.onclick = function() {
       const g = this.getAttribute("data-group");
       const enrolled = Object.values(students || {}).filter(st => st && st.packages && st.packages.includes(g));
       let textWarning = isAr ? `هل أنت متأكد من حذف باقة "${g}" نهائياً من السيستم؟` : `Are you sure you want to permanently delete package "${g}"?`;
       if (enrolled.length > 0) {
         textWarning = isAr 
           ? `تنبيه: هناك (${enrolled.length}) طالب مسجلين حالياً في هذه الباقة.
حذف الباقة سيقوم بإزالتها تلقائياً من باقات هؤلاء الطلاب لمنع بقاء باقات يتيمة بدون أسعار. هل تريد المتابعة؟`
           : `Warning: There are (${enrolled.length}) students currently enrolled in this package.
Deleting it will automatically unlink it from these students. Do you want to proceed?`;
       }
       Swal.fire({
         title: isAr ? 'تأكيد حذف الباقة' : 'Confirm Package Deletion',
         text: textWarning,
         icon: enrolled.length > 0 ? 'warning' : 'question',
         showCancelButton: true,
         confirmButtonText: isAr ? 'نعم، احذف نهائياً' : 'Yes, Delete Permanently',
         confirmButtonColor: '#ef4444',
         cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
       }).then(async (res) => {
         if (res.isConfirmed) {
           if (enrolled.length > 0) {
             enrolled.forEach(st => {
               st.packages = (st.packages || []).filter(p => p !== g);
             });
           }

           // Explicitly delete from Supabase packages table so it never resurrects!
           if (window.supabaseClient) {
             try {
               await window.supabaseClient.from('packages').delete().eq('name', g);
             } catch(err) {
               console.error("Supabase package delete error:", err);
             }
           }

           delete groupFees[g];
           if (window._editingPkgName === g) window._editingPkgName = null;

           await saveAll();
           if ('BroadcastChannel' in window) {
             try {
               const bc = new BroadcastChannel('studify_permissions_sync');
               bc.postMessage({ type: 'PACKAGES_UPDATED' });
             } catch(e) {}
           }
           renderGroupFeesModal();
           populatePackages();
           if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard();
           if (typeof showToast === "function") showToast(isAr ? "تم حذف الباقة نهائياً من السحابة والنظام" : "Package permanently deleted from cloud & system");
         }
       });
     };
   });
 };


  on("openGroupFeesBtn", "click", function() {
    const gList = document.getElementById("groupFeesList");
    if (!gList) return;
    
    Swal.fire({
      title: 'إدارة الباقات والمصاريف',
      html: '<div id="swalGroupFeesContainer" style="max-height: 70vh; overflow-y: auto; overflow-x: hidden; padding-right: 5px;"></div>',
      width: '850px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
         document.getElementById('swalGroupFeesContainer').appendChild(gList);
         if (typeof renderGroupFeesModal === "function") renderGroupFeesModal();
      },
      willClose: () => {
         const sec = document.getElementById("secPackages");
         const cb = sec ? sec.querySelector('.content-body') : null;
         if (cb) cb.appendChild(gList);
         if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard();
         if (typeof populatePackages === "function") populatePackages();
      }
    });
  });

 on("changeLangBtn", "click", function() { 
 if (typeof AssistantSounds !== "undefined") AssistantSounds.langSwitch();
 const targetLang = (currentLang === "ar" ? "en" : "ar");
 const overlay = $("langSwitchOverlay");
 const textEl = $("langSwitchText");
 if(overlay && textEl) {
 textEl.innerText = targetLang === "en" ? "Switching to English... " : "جاري التبديل للعربية... ";
 overlay.classList.add("active");
 setTimeout(() => {
 currentLang = targetLang;
 localStorage.setItem(K_LANG, currentLang); 
 applyLanguage();
 if(typeof currentId !== 'undefined' && currentId) {
 if(typeof updateStudentUI === 'function') updateStudentUI(currentId);
 }
 setTimeout(() => {
 overlay.classList.remove("active");
 }, 400);
 }, 600);
 } else {
 currentLang = targetLang;
 localStorage.setItem(K_LANG, currentLang); 
 applyLanguage();
 if(typeof currentId !== 'undefined' && currentId) {
 if(typeof updateStudentUI === 'function') updateStudentUI(currentId);
 }
 }
 });

 on("themeSelector", "change", function(e) { switchThemeWithAnimation(e.target.value); });
 on("themeSelectorAdmin", "change", function(e) { switchThemeWithAnimation(e.target.value); });


 on("reportBtn", "click", function() {
 if ($("reportDate")) renderReport($("reportDate").value);
 });

 on("copyReportBtn", "click", function() {
 let d = nowDateStr();
 if(!currentManager) { showToast(t("err_no_manager"), "err"); return; }
 if ($("reportDate") && $("reportDate").value) d = $("reportDate").value;
 
 let ids = attByDate[d] || [];
 let rev = revenueByDate[d] || 0;
 let expArr = expensesByDate[d] || [];
 
 let totalExp = 0;
 for (let i = 0; i < expArr.length; i++) totalExp += expArr[i].amount;

 let txt = ` *${t("report_title")}: ${prettyDate(d)}*\r\n\r\n`;
 
 let groups = {};
 for (let i = 0; i < ids.length; i++) {
 let id = ids[i];
 const st = students[id];
 let c = (st && st.className && st.className !== "عام" && st.className !== "General") ? st.className.trim() : (currentLang === "ar" ? "عام" : "General");
 if(!groups[c]) groups[c] = 0; 
 groups[c]++; 
 }
 
 for(let g in groups) { txt += ` ${g}: ${groups[g]} طالب\r\n`; }
 
 txt += `\r\n إجمالي الحضور اليوم: ${ids.length}`;
 txt += `\r\n ${t("badge_rev")} ${rev} ج`;
 
 if(expArr.length > 0) {
 txt += `\r\n\r\n *${t("wa_exp")}:*`;
 for (let i = 0; i < expArr.length; i++) {
 let ex = expArr[i];
 txt += `\r\n- ${ex.amount} ج (${ex.reason})`; 
 }
 txt += `\r\n\r\n *${t("wa_net")}: ${rev - totalExp} ج*`;
 }
 
 let shiftStr = currentLang === 'ar' ? `إعداد الشيفت: أ/ ${currentManager}` : `Shift Prepared by: ${currentManager}`;
 txt = `${shiftStr}\r\n\r\n` + txt;
 navigator.clipboard.writeText(txt).then(function() { showToast(t("msg_copied")); });
 });

 // ==========================================
 // 16. EXCEL LOGIC (تصدير واستيراد - النسخة الاحترافية متعددة الصفحات)
 // ==========================================
 on("exportExcelBtn", "click", function() {
 if (typeof XLSX === "undefined") { return showToast(" مكتبة الإكسيل غير موجودة، تأكد من وجود ملف xlsx.full.min.js في فولدر assets", "err"); }
 
 const wb = XLSX.utils.book_new();

 // --- الشيت الأول: بيانات الطلاب ---
 let filled = [];
 const allStuds = Object.values(students);
 for (let i = 0; i < allStuds.length; i++) { if (allStuds[i].name) filled.push(allStuds[i]); }
 filled.sort(function(a, b) { return a.id - b.id; });
 
 const stData = [["كود الطالب", "اسم الطالب", "الباقة / المجموعة", "رقم الموبايل", "إجمالي المدفوع", "التصنيف", "سجل الحضور", "الملاحظات"]];
 for (let i = 0; i < filled.length; i++) {
 let s = filled[i];
 let history = s.attendanceDates ? s.attendanceDates.join(" | ") : "";
 let rankAr = s.rank === 'vip' ? 'VIP ' : (s.rank === 'warn' ? 'إنذار ' : 'عادي ');
 let cleanNotes = s.notes ? s.notes.replace(/\r\n/g, " - ") : ""; 
 
 const pName = (s.packages && s.packages.length > 0) ? s.packages.filter(p => p && p !== "عام" && p !== "General").join(" + ") : ((s.className && s.className !== "عام" && s.className !== "General") ? s.className : "عام"); stData.push([s.id, s.name, pName, s.phone, s.paid, rankAr, history, cleanNotes]);
 }
 XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(stData), "بيانات الطلاب");

 // --- الشيت الثاني: خريطة المنهج ---
 const syllData = [["اسم الدرس / الشابتر", "الحالة", "ملاحظات الحصة", "تاريخ التحديث"]];
 for(let i=0; i < syllabusData.length; i++) {
 let s = syllabusData[i];
 let statusAr = s.status === "completed" ? "تم الانتهاء" : (s.status === "in_progress" ? "جاري الشرح" : "لم يبدأ");
 syllData.push([s.name, statusAr, s.notes || "", s.date]);
 }
 XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(syllData), "خريطة المنهج");

 // --- الشيت الثالث: الماليات والمصروفات ---
 const finData = [["التاريخ", "النوع", "المبلغ", "البيان / السبب"]];
 
 let allDates = new Set([...Object.keys(revenueByDate), ...Object.keys(expensesByDate)]);
 let sortedDates = Array.from(allDates).sort((a,b) => new Date(a) - new Date(b)); 
 
 for(let i=0; i<sortedDates.length; i++) {
 let d = sortedDates[i];
 if(revenueByDate[d]) {
 finData.push([prettyDate(d), "إيرادات ", revenueByDate[d], "إيراد مدفوعات الطلاب"]);
 }
 if(expensesByDate[d] && expensesByDate[d].length > 0) {
 for(let j=0; j<expensesByDate[d].length; j++) {
 finData.push([prettyDate(d), "مصروفات ", expensesByDate[d][j].amount, expensesByDate[d][j].reason]);
 }
 }
 }
 XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(finData), "الماليات");

 XLSX.writeFile(wb, `VPRO_Backup_${nowDateStr()}.xlsx`);
 localStorage.setItem(K_LAST_BACKUP, nowDateStr()); 
 
 if($("btnTabAdmin")) $("btnTabAdmin").classList.remove("needs-backup");
 showToast("تم تصدير نسخة احتياطية شاملة ");
 });

 on("importExcelBtnFake", "click", function() { if ($("importExcelInput")) $("importExcelInput").click(); });
 
on("importExcelInput", "change", async function(e) {
 const f = e.target.files[0]; if(!f) return; 
 const wb = XLSX.read(await f.arrayBuffer(), {type:"array"});
 
 let warnMsg = currentLang==='ar' ? 'تحذير: سيتم مسح البيانات الحالية واستبدالها' : 'Warning: Overwrite current data?';
 const confirmRes = await Swal.fire({
 title: 'تأكيد الاستيراد',
 text: warnMsg,
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: 'نعم، استبدل',
 cancelButtonText: 'إلغاء',
 customClass: {
 popup: 'glass-modal',
 confirmButton: 'btn btn-danger',
 cancelButton: 'btn btn-secondary'
 }
 });
 if(!confirmRes.isConfirmed) return;
 
 // تصفير كل حاجة قبل ما نستقبل الداتا الجديدة
 students = {}; attByDate = {}; revenueByDate = {}; expensesByDate = {}; syllabusData = [];
 for (let i = BASE_MIN_ID; i <= BASE_MAX_ID; i++) { students[String(i)] = makeEmptyStudent(i); }
 
 // 1. استيراد بيانات الطلاب (الصفحة الأولى)
 if(wb.SheetNames.includes("بيانات الطلاب") || wb.SheetNames[0]) {
 const sheetName = wb.SheetNames.includes("بيانات الطلاب") ? "بيانات الطلاب" : wb.SheetNames[0];
 const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
 for (let i = 0; i < rows.length; i++) {
 let row = rows[i];
 const id = toInt(row["كود الطالب"] || row["ID"] || row["كود"]);
 if(id) {
 let st = makeEmptyStudent(id);
 st.name = row["اسم الطالب"] || row["Name"] || row["الاسم"] || ""; 
 st.className = row["الباقة / المجموعة"] || row["Class"] || row["المجموعة"] || "";
 st.phone = String(row["رقم الموبايل"] || row["Phone"] || ""); 
 st.paid = toInt(row["إجمالي المدفوع"] || row["Paid"] || row["المدفوع"]);
 
 let rankAr = row["التصنيف"] || row["Rank"] || "";
 st.rank = rankAr.includes("VIP") ? "vip" : (rankAr.includes("إنذار") ? "warn" : "normal");
 
 let n = row["الملاحظات"] || "";
 st.notes = n ? n.replace(/ - /g, "\r\n") : "";
 
 let h = row["سجل الحضور"] || row["History"] || "";
 if(h) {
 st.attendanceDates = h.split(/\||,/).map(function(d) { return d.trim(); }).filter(d => d);
 for (let j = 0; j < st.attendanceDates.length; j++) {
 let d = st.attendanceDates[j];
 if(!attByDate[d]) attByDate[d] = []; 
 attByDate[d].push(String(id)); 
 }
 }
 students[String(id)] = st;
 }
 }
 }

 // 2. استيراد الماليات (الصفحة التانية)
 if(wb.SheetNames.includes("الماليات")) {
 const finRows = XLSX.utils.sheet_to_json(wb.Sheets["الماليات"]);
 for(let i=0; i<finRows.length; i++) {
 let row = finRows[i];
 let pDate = row["التاريخ"]; 
 if(pDate) {
 let d = pDate.split("-").reverse().join("-"); // تحويل التاريخ لشكله الأصلي
 let type = row["النوع"] || "";
 let amt = toInt(row["المبلغ"]);
 let reason = row["البيان / السبب"] || "";

 if(type.includes("إيرادات")) {
 revenueByDate[d] = (revenueByDate[d] || 0) + amt;
 } else if (type.includes("مصروفات")) {
 if(!expensesByDate[d]) expensesByDate[d] = [];
 expensesByDate[d].push({ amount: amt, reason: reason });
 }
 }
 }
 }

 // 3. استيراد المنهج (الصفحة التالتة)
 if (wb.SheetNames.includes("خريطة المنهج")) {
 const syllRows = XLSX.utils.sheet_to_json(wb.Sheets["خريطة المنهج"]);
 for(let i=0; i<syllRows.length; i++) {
 let row = syllRows[i];
 let name = row["اسم الدرس / الشابتر"];
 if(name) {
 let statusAr = row["الحالة"] || "";
 let status = "not_started";
 if(statusAr.includes("جاري")) status = "in_progress";
 if(statusAr.includes("تم")) status = "completed";
 
 syllabusData.push({
 name: name,
 status: status,
 notes: row["ملاحظات الحصة"] || "",
 date: row["تاريخ التحديث"] || nowDateStr()
 });
 }
 }
 }

 saveAll(); showToast(t("msg_saved")); 
 setTimeout(function() { location.reload(); }, 1000);
 });

 // ==========================================
 // ==========================================
  // 17. PERMANENT HOLD-TO-DELETE FROM SUPABASE & LOCAL
  // ==========================================
  let deleteTimer = null;
  const delBtn = $("deleteStudentBtn");

  function startDeleteHold(e) {
    if (!currentId) return;
    const targetId = currentId;
    const st = students[targetId];
    if (!st || (!st.name && !st.phone)) {
      showToast(currentLang === 'ar' ? "هذا الحقل فارغ بالفعل" : "This student slot is already empty", "warning");
      return;
    }

    if (delBtn) delBtn.classList.add("holding");

    deleteTimer = setTimeout(() => {
      if (delBtn) delBtn.classList.remove("holding");

      const isAr = (currentLang === 'ar');
      const studentName = st.name || ("#" + targetId);

      Swal.fire({
        title: isAr ? ("حذف الطالب نهائياً (" + studentName + ")") : ("Delete Student (" + studentName + ")"),
        html: `
          <div style="text-align: ${isAr ? 'right' : 'left'}; font-size: 0.95em; line-height: 1.6;">
            <p style="color: #ef4444; font-weight: 700; margin-bottom: 8px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
              ${isAr ? "تحذير أمني: هذا إجراء نهائي لا يمكن التراجع عنه!" : "Security Warning: This action is permanent and cannot be undone!"}
            </p>
            <p style="color: var(--text-secondary); margin-bottom: 12px;">
              ${isAr ? "سيتم مسح كافة بيانات الطالب، سجلات الحضور، المدفوعات والاشتراكات نهائياً من قاعدة البيانات السحابية (Supabase) والجهاز المحلي." : "All student data, attendance logs, payments, and subscriptions will be permanently erased from Supabase and local device."}
            </p>
            ${st.paid > 0 ? `
              <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 10px; border-radius: 8px; margin-top: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; color: #f59e0b;">
                  <input type="checkbox" id="swalDeductTodayRevenue" checked style="width: 18px; height: 18px; accent-color: #f59e0b;">
                  <span>${isAr ? ("خصم المدفوعات المسجلة (" + st.paid + " ج) من إيراد اليوم؟") : ("Deduct registered payments (" + st.paid + " EGP) from today's revenue?")}</span>
                </label>
              </div>
            ` : ''}
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: isAr ? 'نعم، حذف نهائي من السحابة' : 'Yes, Delete Permanently',
        cancelButtonText: isAr ? 'إلغاء' : 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const deductEl = document.getElementById('swalDeductTodayRevenue');
          const shouldDeduct = deductEl ? deductEl.checked : false;

          showToast(isAr ? "جاري حذف الطالب من السحابة..." : "Deleting student from cloud...", "info");

          // 1. Delete from Supabase cloud table
          if (window.supabaseClient) {
            try {
              await window.supabaseClient.from('students').delete().eq('id', String(targetId));
            } catch (err) {
              console.warn("[deleteStudent] Supabase delete warning:", err);
            }
          }

          // 2. Adjust today's revenue if requested
          if (shouldDeduct && st.paid > 0) {
            const today = nowDateStr();
            revenueByDate[today] = Math.max(0, (revenueByDate[today] || 0) - Number(st.paid));
          }

          // 3. Clear from local state
          delete deletedStudents[targetId];
          if (targetId > BASE_MAX_ID) {
            delete students[targetId];
            extraIds = extraIds.filter(id => id !== targetId);
          } else {
            students[targetId] = makeEmptyStudent(targetId);
          }

          // 4. Save and sync
          await saveAll();
          updateStudentUI(null);
          window.switchTab('Home');
          if (typeof AssistantSounds !== "undefined") AssistantSounds.deleteSwoosh();
          showToast(isAr ? "تم حذف الطالب وسجلاته بالكامل من السحابة بنجاح" : "Student permanently deleted from cloud successfully", "success");
        }
      });
    }, 1200);
  }

  function cancelDeleteHold() {
    if (deleteTimer) clearTimeout(deleteTimer);
    if (delBtn) delBtn.classList.remove("holding");
  }

  if (delBtn) {
    delBtn.addEventListener("mousedown", startDeleteHold);
    delBtn.addEventListener("mouseup", cancelDeleteHold);
    delBtn.addEventListener("mouseleave", cancelDeleteHold);
    delBtn.addEventListener("touchstart", startDeleteHold, { passive: true });
    delBtn.addEventListener("touchend", cancelDeleteHold);
    delBtn.addEventListener("touchcancel", cancelDeleteHold);
  }

  on("openAllStudentsBtn", "click", function() { if (typeof AssistantSounds !== "undefined") AssistantSounds.modalOpen(); renderSimpleTable(); if ($("allStudentsModal")) $("allStudentsModal").classList.remove("hidden"); });
  on("closeModalBtn", "click", function() { if (typeof AssistantSounds !== "undefined") AssistantSounds.modalClose(); if ($("allStudentsModal")) $("allStudentsModal").classList.add("hidden"); });
  on("simplePrevPageBtn", "click", function() { if(simpleCurrentPage > 1) { simpleCurrentPage--; renderSimpleTable(); } });
  on("simpleNextPageBtn", "click", function() { simpleCurrentPage++; renderSimpleTable(); });

  on("todayCountTopCard", "click", function() {
  if (typeof AssistantSounds !== "undefined") AssistantSounds.cardClick();
  const today = nowDateStr(); 
 const ids = attByDate[today] || [];
 const sessList = sessionStudentsByDate[today] || [];
 if(ids.length === 0 && sessList.length === 0) { 
   let warnMsg = currentLang==='ar' ? "لا يوجد حضور اليوم" : "No attendance today";
   showToast(warnMsg, "warning"); return; 
 }
 
 let groups = {};
 for (let i = 0; i < ids.length; i++) {
   let id = ids[i]; const st = students[id]; 
   if(st) { 
     let c = (st.className && st.className !== "عام" && st.className !== "General") ? st.className.trim() : ""; 
     if(!groups[c]) groups[c] = []; 
     groups[c].push(st); 
   } 
 }
 
 let html = "";
 for(let g in groups) { 
   let gColor = getTagColor(g);
   let gTitle = g || (currentLang === 'ar' ? 'بدون مجموعة' : 'No Group');
   let groupHtml = `<div style="background:var(--bg-surface, #f8f9fa); border:1px solid var(--border); border-radius:10px; padding:15px; margin-bottom:15px; border-right: 5px solid ${gColor};">`;
   groupHtml += `<h4 style="color:${gColor}; margin-top:0; margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:5px;"> ${gTitle} (${groups[g].length})</h4>`;
   groupHtml += `<div style="display:flex; flex-wrap:wrap; gap:8px;">`;
   
   for (let j = 0; j < groups[g].length; j++) {
     let s = groups[g][j];
     let sName = s.name || 'بدون اسم';
     groupHtml += `<div class="badge" style="background:var(--bg-surface); color:var(--text-primary); border:1px solid ${gColor}; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:13px;" onclick="document.getElementById('todayModal').classList.add('hidden'); window.extOpen('${s.id}')">#${s.id} - ${sName}</div>`;
   }
   groupHtml += `</div></div>`;
   html += groupHtml;
 }

 // Include Session Students who attended today
 if (sessList.length > 0) {
   let sessColor = "#2563eb";
   let sessTitle = currentLang === 'ar' ? `طلاب الحصة (${sessList.length})` : `Session Students (${sessList.length})`;
   let sessHtml = `<div style="background:var(--bg-surface, #f8f9fa); border:1px solid var(--border); border-radius:10px; padding:15px; margin-bottom:15px; border-right: 5px solid ${sessColor};">`;
   sessHtml += `<h4 style="color:${sessColor}; margin-top:0; margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:5px; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-user-clock"></i> ${sessTitle}</h4>`;
   sessHtml += `<div style="display:flex; flex-wrap:wrap; gap:8px;">`;
   
   for (let k = 0; k < sessList.length; k++) {
     let sRec = sessList[k];
     let sName = sRec.name || (currentLang === 'ar' ? 'طالب حصة' : 'Session Student');
     let clsInfo = sRec.className ? ` (${sRec.className})` : '';
     let sJson = JSON.stringify(sRec).replace(/"/g, '&quot;');
     sessHtml += `<div class="badge" style="background:rgba(59,130,246,0.08); color:#2563eb; border:1px solid rgba(59,130,246,0.3); padding:8px 12px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:700; display:inline-flex; align-items:center; gap:6px;" onclick="document.getElementById('todayModal').classList.add('hidden'); if(typeof window.openSessionStudentModal==='function') window.openSessionStudentModal(${sJson});"><i class="fa-solid fa-user-clock"></i> ${sName}${clsInfo} - ${sRec.amount || 0} ج</div>`;
   }
   sessHtml += `</div></div>`;
   html += sessHtml;
 }
 
 if ($("todayModalBody")) $("todayModalBody").innerHTML = html; 
 if ($("todayModal")) $("todayModal").classList.remove("hidden");
 });
 
 on("closeTodayModal", "click", function() { if ($("todayModal")) $("todayModal").classList.add("hidden"); });

 on("resetTermBtn", "click", function() {
 askAdminPass(function() {
 let msg = currentLang==='ar' ? "تصفير فلوس وغياب الترم بالكامل للجميع؟" : "Reset all fees and attendance?";
 Swal.fire({
 title: 'تأكيد التصفير',
 text: msg,
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: 'نعم، صفر',
 cancelButtonText: 'إلغاء'
 }).then((res) => {
 if(res.isConfirmed) {
 for(let k in students) { students[k].paid = 0; students[k].attendanceDates = []; }
 attByDate = {}; revenueByDate = {}; expensesByDate = {}; saveAll(); location.reload();
 }
 });
 });
 });

 on("resetBtn", "click", function() {
 askAdminPass(function() {
 let msg = currentLang==='ar' ? "مسح شامل وإعادة ضبط المصنع للسيستم بالكامل؟" : "Factory Reset the whole system?";
 Swal.fire({
 title: 'تأكيد ضبط المصنع',
 text: msg,
 icon: 'error',
 showCancelButton: true,
 confirmButtonText: 'نعم، امسح كل شيء',
 cancelButtonText: 'إلغاء'
 }).then((res) => {
 if(res.isConfirmed) { localStorage.clear(); location.reload(); }
 });
 });
 });

 // Filters and Bulk actions
 if($("filterClass")) $("filterClass").addEventListener("change", renderList);
 if($("filterStatus")) $("filterStatus").addEventListener("change", renderList);
 if($("filterAttend")) $("filterAttend").addEventListener("change", renderList);
 if($("tableSearchInp")) $("tableSearchInp").addEventListener("input", renderList);
 
 on("prevPageBtn", "click", function() { if(currentPage > 1) { currentPage--; renderPage(); } });
 on("nextPageBtn", "click", function() { currentPage++; renderPage(); });

 document.addEventListener("change", function(e) {
 if(e.target.classList.contains("stCheckbox")) { handleBulk(); }
 if(e.target.id === "selectAllCheckbox") { 
 const boxes = document.querySelectorAll(".stCheckbox");
 for (let i = 0; i < boxes.length; i++) { boxes[i].checked = e.target.checked; }
 handleBulk(); 
 }
 });

 on("bulkAttendBtn", "click", function() { 
  const selectedSubject = window.currentGlobalSubject || "";
  if (!selectedSubject || !String(selectedSubject).trim()) {
    showToast(currentLang === 'en' ? "Please select attendance subject from the top menu first" : "يرجى تحديد مادة الحضور من القائمة بالأعلى أولاً", "warning");
    if (typeof triggerShake === 'function') triggerShake("openSubjectModalBtn");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (typeof window.openSubjectSelectionModal === 'function') window.openSubjectSelectionModal();
    }, 250);
    return;
  }
  let count = 0;
  let lastError = "";
  const checkedBoxes = document.querySelectorAll(".stCheckbox:checked");
  for (let i = 0; i < checkedBoxes.length; i++) {
    let res = addAttendance(checkedBoxes[i].getAttribute("data-id"), nowDateStr());
    if (res && res.ok) count++;
    else if (res && res.msg) lastError = res.msg;
  }
  if (count > 0) {
    showToast(t("msg_att_ok"), "success");
  } else if (lastError) {
    showToast(lastError, "warning");
  }
  renderList(true);
  handleBulk(); 
});

 on("bulkAbsentBtn", "click", function() { 
 const checkedBoxes = document.querySelectorAll(".stCheckbox:checked");
 for (let i = 0; i < checkedBoxes.length; i++) { removeAttendance(checkedBoxes[i].getAttribute("data-id"), nowDateStr()); }
 showToast(t("msg_att_warn"), "warning"); renderList(true); handleBulk();
 });

 // ==========================================
 // 17.5. GOOGLE DRIVE CLOUD SYNC (SMART SYNC)
 // ==========================================
 const CLIENT_ID = '783299132334-7sk1ffet8bdmj86f179gbttjt5fqosao.apps.googleusercontent.com';
 const SCOPES = 'https://www.googleapis.com/auth/drive.file';
 const BACKUP_FILE_NAME = 'vpro_backup.json';
 let tokenClient;
 let accessToken = localStorage.getItem("drive_token");

function updateDriveUI() {
 const btn = $("driveLoginBtn"); const syncBtn = $("syncNowBtn");
 const statusTxt = $("driveStatusText"); const lastSyncTxt = $("lastSyncText");
 
 // 1. التحقق من وجود إنترنت حقيقي في الجهاز
 if (!navigator.onLine) {
 if(statusTxt) { 
 statusTxt.innerHTML = currentLang === 'ar' ? " لا يوجد اتصال بالإنترنت" : " No Internet Connection"; 
 statusTxt.style.color = "var(--danger)"; 
 statusTxt.classList.remove("pulse-active"); // وقف النبض
 }
 if(btn) { btn.innerHTML = currentLang === 'ar' ? "بانتظار عودة الإنترنت..." : "Waiting for network..."; btn.style.background = "#666"; }
 if(syncBtn) syncBtn.classList.add("hidden");
 return; // وقف الدالة هنا لحد ما النت يرجع
 }

 // 2. لو فيه نت، هل هو رابط بالدرايف؟
 if(accessToken) {
 if(btn) { btn.innerHTML = t("btn_drive_connected"); btn.style.background = "#2ea44f"; }
 if(syncBtn) syncBtn.classList.remove("hidden");
 if(statusTxt) { 
 statusTxt.innerHTML = t("drive_online"); 
 statusTxt.style.color = "var(--success)"; 
 statusTxt.classList.add("pulse-active"); // شغل النبض (اللمبة تنور وتطفي)
 }
 } else {
 // فيه نت بس لسه مربوطش
 if(statusTxt) { 
 statusTxt.innerHTML = t("drive_offline"); 
 statusTxt.style.color = "#666"; 
 statusTxt.classList.remove("pulse-active");
 }
 if(btn) { btn.innerHTML = t("btn_drive_login"); btn.style.background = "#4285F4"; }
 }

 let lastTime = localStorage.getItem("last_cloud_sync_time");
 if(lastTime && lastSyncTxt) {
 lastSyncTxt.innerHTML = t("lbl_last_sync") + lastTime;
 }
 }
 updateDriveUI();

 // أوامر عشان السيستم يراقب النت لايف (لو فصل أو اشتغل يغير اللمبة فوراً)
 window.addEventListener('online', updateDriveUI);
 window.addEventListener('offline', updateDriveUI);

 on("driveLoginBtn", "click", function() {
 if (typeof google === 'undefined') {
 return showToast(currentLang === 'ar' ? "جاري تحميل مكتبات جوجل، جرب مرة تانية كمان ثانية..." : "Loading Google libraries...", "warning");
 }
 if (!tokenClient) {
 tokenClient = google.accounts.oauth2.initTokenClient({
 client_id: CLIENT_ID,
 scope: SCOPES,
 callback: (response) => {
 if (response.access_token) {
 accessToken = response.access_token;
 localStorage.setItem("drive_token", accessToken);
 updateDriveUI(); showToast(t("btn_drive_connected"), "success");
 }
 },
 });
 }
 tokenClient.requestAccessToken({ prompt: 'consent' });
 });

 // دالة الرفع المدمجة (يدوي أو تلقائي)
 async function backupToDrive(isManual = false) {
 if (!accessToken) return;
 
 if (isManual) showToast(t("msg_sync_wait"), "warning");

 let backupData = {};
 // 1. Settings from localStorage
 for (let i = 0; i < localStorage.length; i++) {
 let key = localStorage.key(i);
 if (key.startsWith("ca_")) backupData[key] = localStorage.getItem(key);
 }
 
 // 2. Add heavy data from memory (since they are in IndexedDB, not localStorage)
 backupData[K_STUDENTS] = JSON.stringify(students || {});
 backupData[K_ATT_BY_DATE] = JSON.stringify(attByDate || {});
 backupData[K_REVENUE] = JSON.stringify(revenueByDate || {});
 backupData[K_GROUP_FEES] = JSON.stringify(groupFees || {});
 backupData[K_EXPENSES] = JSON.stringify(expensesByDate || {});
 backupData[K_DELETED] = JSON.stringify(deletedStudents || {});
 backupData[K_SYLLABUS] = JSON.stringify(syllabusData || []);
 backupData[K_EVAL] = JSON.stringify(evalData || {});
 backupData[K_SESSION_STUDENTS] = JSON.stringify(sessionStudentsByDate || {});
 backupData[K_BOOKLETS] = JSON.stringify(bookletsStock || {});
 backupData[K_EXTRA_IDS] = JSON.stringify(extraIds || []);

 const fileContent = JSON.stringify(backupData);
 const metadata = { name: BACKUP_FILE_NAME, mimeType: 'application/json' };

 try {
 const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILE_NAME}' and trashed=false`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
 const data = await response.json();
 let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
 let method = 'POST';

 // منع التكرار: التحديث إذا كان موجوداً
 if (data.files && data.files.length > 0) {
 url = `https://www.googleapis.com/upload/drive/v3/files/${data.files[0].id}?uploadType=multipart`; method = 'PATCH';
 }

 const boundary = 'foo_bar_baz';
 const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${fileContent}\r\n--${boundary}--`;

 await fetch(url, { method: method, headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` }, body: body });
 
 // تسجيل وقت المزامنة الناجحة
 let now = new Date();
 let timeString = now.toLocaleDateString('ar-EG') + " " + now.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
 localStorage.setItem("last_cloud_sync_time", timeString);
 localStorage.setItem("last_cloud_sync_date", nowDateStr()); // لضمان عدم التكرار في نفس اليوم
 updateDriveUI();

 if (isManual) {
 showToast(t("msg_sync_done"), "success");
 } else {
 showToast(t("msg_sync_auto"), "success");
 }
 } catch (err) { 
 console.error("Sync Error", err); 
 if (isManual) showToast(currentLang === 'ar' ? "فشل الرفع، تأكد من الاتصال بالنت" : "Upload failed, check connection", "err");
 }
 }

 // ربط زرار السهم بالرفع اليدوي
 on("syncNowBtn", "click", function() {
 backupToDrive(true);
 });

 on("restoreDriveBtn", "click", async function() {
 if (!accessToken) return showToast(currentLang === 'ar' ? "يرجى الربط بالدرايف أولاً " : "Please connect to Drive first ", "err");
 const confirmRes = await Swal.fire({
 title: 'تحذير شديد',
 text: currentLang === 'ar' ? " تحذير شديد: سيتم مسح كل البيانات الحالية واستبدالها بنسخة السحابة، متأكد؟" : " WARNING: Current data will be replaced by cloud backup. Sure?",
 icon: 'error',
 showCancelButton: true,
 confirmButtonText: 'نعم، استرجع البيانات',
 cancelButtonText: 'إلغاء'
 });
 if (!confirmRes.isConfirmed) return;

 try {
 const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILE_NAME}'&fields=files(id)`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
 const data = await response.json();

 if (data.files && data.files.length > 0) {
 const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${data.files[0].id}?alt=media`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
 const backupData = await fileRes.json();
 
 // Helper to fallback to older backup keys (e.g. v5)
 const safeGet = (keys) => {
 for(let k of keys) { if (backupData[k] !== undefined) return backupData[k]; }
 return undefined;
 };
 
 const restoreMap = {
 [K_STUDENTS]: safeGet([K_STUDENTS, "ca_students_v5", "ca_students_v4"]),
 [K_EXTRA_IDS]: safeGet([K_EXTRA_IDS, "ca_extra_ids_v5"]),
 [K_ATT_BY_DATE]: safeGet([K_ATT_BY_DATE, "ca_att_by_date_v5"]),
 [K_REVENUE]: safeGet([K_REVENUE, "ca_revenue_v5"]),
 [K_DELETED]: safeGet([K_DELETED, "ca_deleted_v8", "ca_deleted_v7"]),
 [K_NOTEBOOK]: backupData[K_NOTEBOOK],
 [K_GROUP_FEES]: backupData[K_GROUP_FEES],
 [K_EXPENSES]: backupData[K_EXPENSES],
 [K_SYLLABUS]: backupData[K_SYLLABUS],
 [K_EVAL]: backupData[K_EVAL],
 [K_SESSION_STUDENTS]: backupData[K_SESSION_STUDENTS],
 [K_BOOKLETS]: backupData[K_BOOKLETS]
 };

 // Save data correctly (to IndexedDB for heavy data, localStorage for lightweight)
 for (const [key, value] of Object.entries(restoreMap)) {
 if (value !== undefined) {
 if (HEAVY_DATA_KEYS.includes(key)) {
 try {
 await secureSave(key, JSON.parse(value));
 } catch (e) { console.error("Restore parse err", key); }
 } else {
 localStorage.setItem(key, value);
 }
 }
 }

 // Push to Supabase if manager is logged in
 if (window.CURRENT_MANAGER_ID) {
   if (typeof saveAll === 'function') await saveAll();
 }
 
 showToast(currentLang === 'ar' ? "تم استرجاع البيانات بنجاح، سيتم إعادة التحميل..." : "Data restored successfully. Restarting...");
 setTimeout(() => location.reload(), 1500);
 } else { showToast(currentLang === 'ar' ? "لم يتم العثور على نسخة احتياطية في الدرايف" : "No backup found in Drive", "err"); }
 } catch (err) { console.error(err); showToast(currentLang === 'ar' ? "فشل الاسترجاع، تأكد من الاتصال بالنت" : "Restore failed, check connection", "err"); }
 });
// ==========================================
 // 17.8. ASSISTANT MANAGEMENT (SAAS)
 // ==========================================
 let currentManager = localStorage.getItem("ca_current_username") || "المدير";

 if($("currentShiftManagerName")) $("currentShiftManagerName").innerText = currentManager;

 if ($("addNewAsstBtn")) {
  on("addNewAsstBtn", "click", async function() {
    const rawAsstU = $("newAsstUsername") ? $("newAsstUsername").value.trim() : "";
    const asstP = $("newAsstPassword") ? $("newAsstPassword").value.trim() : "";
    
    if (!rawAsstU || !asstP) {
      return showToast("أدخل اسم المستخدم وكلمة المرور", "err");
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(rawAsstU)) {
      return showToast("اسم المستخدم يجب أن يكون بحروف إنجليزية فقط وبدون مسافات", "err");
    }
    
    const role = localStorage.getItem("ca_role") || window.CURRENT_ROLE;
    if (role !== "admin") return showToast("يجب أن تكون مديراً لإضافة مساعدين.", "err");
    
    try {
      showToast("جاري إنشاء حساب المساعد... الرجاء الانتظار", "info");
      
      const { error: dbErr } = await window.supabaseClient.from('assistants').insert([{
        username: rawAsstU.toLowerCase(),
        email: rawAsstU.toLowerCase() + '@studify.com',
        password: asstP,
        permissions: {}
      }]);

      if (dbErr) {
          if (dbErr.code === '23505') { // Unique constraint violation
              throw new Error("اسم المستخدم محجوز مسبقاً. جرب اسماً آخر.");
          }
          throw dbErr;
      }

      showToast("تم إضافة المساعد بنجاح.", "success");
      
      if ($("newAsstUsername")) $("newAsstUsername").value = "";
      if ($("newAsstPassword")) $("newAsstPassword").value = "";
      if(typeof window.closeAddAsstModal === "function") window.closeAddAsstModal();
      
      fetchManagerAssistants();
    } catch (err) {
      console.error(err);
      showToast(err.message || "فشل الاتصال بقاعدة البيانات. تأكد من الإنترنت.", "err");
    }
  });
}

async function fetchManagerAssistants() {
  const listEl = $("managerAssistantsList");
  if (!listEl) return;
  
  if (!window.supabaseClient) return;
  
  listEl.innerHTML = `<div class="mutedCenter">جاري التحميل...</div>`;
  
  try {
    const { data: assistants, error } = await window.supabaseClient
      .from('assistants')
      .select('*')
      .not('id', 'is', null)
      .order('created_at', { ascending: false });

    if (!error && assistants && assistants.length > 0) {
      const managerUsername = localStorage.getItem("ca_current_username") || "admin";
      
      let html = '<div class="assistant-grid">';
      let asstCount = 0;
      
      assistants.forEach(asst => {
        const uName = asst.username;
        // Removed filter so all assistants show up properly
        
        asstCount++;
        const initial = (uName[0] || "?").toUpperCase();
        const createdAt = asst.created_at
          ? new Date(asst.created_at).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" })
          : "—";
          
        // Generate Premium Permissions HTML
        const asstPerms = asst.permissions || {};
        let permsHtml = `<div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">`;

        // Grouping definitions
        const permGroups = [
          {
            title: "<i class='fa-solid fa-money-bill-wave'></i> الصلاحيات المالية",
            keys: ["show_revenue", "can_request_discount"]
          },
          {
            title: "<i class='fa-solid fa-server'></i> إدارة البيانات والنظام",
            keys: ["can_add_student", "can_manage_packages", "can_access_settings"]
          },
          {
            title: "<i class='fa-regular fa-file-lines'></i> صلاحيات الصفحات والأدوات",
            keys: ["can_view_reports", "can_access_marketing", "can_access_session_students", "can_access_booklets"]
          }
        ];

        permGroups.forEach(group => {
          permsHtml += `
          <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.03);">
            <h4 style="color: var(--primary); font-size: 0.95rem; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 8px;">${group.title}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
          `;
          
          group.keys.forEach(k => {
            const p = PERMISSIONS_DEFS.find(def => def.key === k);
            if (!p) return;
            
            const isChecked = asstPerms[p.key] === true;
            let icon = "fa-check"; // fallback
            if (p.key.includes("student") || p.key.includes("add_")) icon = "fa-user-plus";
            else if (p.key.includes("revenue") || p.key.includes("finance")) icon = "fa-wallet";
            else if (p.key.includes("report")) icon = "fa-chart-pie";
            else if (p.key.includes("discount")) icon = "fa-tags";
            else if (p.key.includes("market") || p.key.includes("sms")) icon = "fa-bullhorn";
            else if (p.key.includes("attendance")) icon = "fa-clock";
            else if (p.key.includes("setting")) icon = "fa-cogs";
            else if (p.key.includes("booklet")) icon = "fa-book-open";
            permsHtml += `
            <div class="perm-item-premium" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 14px; border-radius: 10px; display: flex; align-items: flex-start; justify-content: space-between; transition: 0.2s ease;">
              <div style="display:flex; align-items:flex-start; gap:12px; flex: 1;">
                <i class="fa-solid ${icon}" style="color: var(--primary); font-size:1.1rem; width:22px; text-align:center; margin-top: 3px;"></i> 
                <div style="display:flex; flex-direction: column; gap: 6px; margin-left: 5px;">
                  <span style="font-size:0.95rem; font-weight:600; color: #fff;">${p.label}</span>
                  ${p.desc ? `<span style="font-size:0.75rem; color: var(--text-muted); line-height: 1.4;">${p.desc}</span>` : ''}
                </div>
              </div>
              <label class="ios-toggle" style="margin-right: 15px; margin-top: 2px; flex-shrink: 0;">
                <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.toggleAssistantPermission('${uName}', '${p.key}', this.checked)">
                <span class="ios-slider"></span>
              </label>
            </div>`;
          });

          permsHtml += `</div></div>`;
        });
        
        permsHtml += `</div>`;
        

        html += `
        <div class="assistant-premium-card">
          <div class="asst-card-header">
            <div class="asst-avatar-premium">${initial}</div>
            <div class="asst-info-premium">
              <h3>${uName}</h3>
              <div class="asst-badge-secure">
                <i class="fa-solid fa-lock"></i> كلمة المرور محمية
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                أضيف في: ${createdAt}
              </div>
            </div>
          </div>
          
          <div class="asst-card-actions">
            <button class="btn secondary" onclick="document.getElementById('perms-${uName}').classList.toggle('hidden')" style="background:rgba(255,255,255,0.05); color:var(--text-main);">
              <i class="fa-solid fa-sliders"></i> الصلاحيات
            </button>
            <button class="btn" style="background:var(--primary); color:#fff;" onclick="window.changeAssistantPassword('${asst.id}', '${uName}')">
              <i class="fa-solid fa-key"></i> الباسورد
            </button>
            <button class="btn danger" onclick="window.deleteAssistant('${uName}')">
              <i class="fa-solid fa-trash"></i> حذف
            </button>
          </div>
          
          <div id="perms-${uName}" class="premium-permissions-panel hidden">
             ${permsHtml}
          </div>
        </div>`;
      });
      html += '</div>';
      
      if(asstCount === 0) {
        listEl.innerHTML = `<div class="mutedCenter">لا يوجد مساعدين مسجلين بعد.</div>`;
      } else {
        listEl.innerHTML = html;
      }
    } else {
      listEl.innerHTML = `<div class="mutedCenter">لا يوجد مساعدين مسجلين بعد.</div>`;
    }
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `<div class="mutedCenter">حدث خطأ في تحميل المساعدين.</div>`;
  }
}

window.toggleAssistantPermission = async function(username, key, val) {
  if (!window.supabaseClient) return;
  try {
    // 1. Fetch current permissions for this assistant
    const { data: asst } = await window.supabaseClient.from('assistants').select('permissions').eq('username', username).single();
    const currentPerms = asst ? (asst.permissions || {}) : {};
    
    // 2. Update it
    currentPerms[key] = val;
    await window.supabaseClient.from('assistants').update({ permissions: currentPerms }).eq('username', username);
    
    showToast("تم تحديث صلاحية المساعد بنجاح", "success");
  } catch (err) {
    console.error(err);
    showToast("فشل تحديث الصلاحية", "err");
  }
};


window.editAssistantPassword = async function(key) {
  let newPass = "";
  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      title: "تغيير كلمة المرور",
      text: `أدخل كلمة المرور الجديدة للمساعد (${key}):`,
      input: "password",
      inputPlaceholder: "كلمة المرور الجديدة",
      showCancelButton: true,
      confirmButtonText: "حفظ كلمة المرور",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#2563eb",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "يرجى كتابة كلمة مرور صالحة";
        }
      }
    });
    if (!res.isConfirmed || !res.value) return;
    newPass = res.value.trim();
  } else {
    return;
  }
  const managerId = localStorage.getItem("ca_manager_id");
  if (!managerId || !window.supabaseClient) return;
  try {
    const hashedPass = await hashPass(newPass);
    const { error } = await window.supabaseClient
      .from('assistants')
      .update({ password: hashedPass })
      .not('id', 'is', null)
      .eq('username', key);
    if (error) throw error;
    showToast("تم تحديث كلمة المرور بنجاح", "success");
    fetchManagerAssistants();
  } catch (err) {
    console.error(err);
    showToast("فشل تحديث كلمة المرور", "err");
  }
};

window.deleteAssistant = async function(asstKey) {
  const res = await Swal.fire({
    title: 'تأكيد الحذف',
    text: currentLang === 'ar' ? `هل أنت متأكد من حذف المساعد ${asstKey} نهائياً؟` : `Delete assistant?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء'
  });
  if (!res.isConfirmed) return;
  
  const managerId = localStorage.getItem("ca_manager_id");
  if (!managerId || !window.supabaseClient) return;
  try {
    const { error } = await window.supabaseClient
      .from('assistants')
      .delete()
      .not('id', 'is', null)
      .eq('username', asstKey);
    if (error) throw error;
    showToast("تم حذف المساعد ", "success");
    fetchManagerAssistants();
  } catch (err) {
    console.error(err);
    showToast("فشل في حذف المساعد.", "err");
  }
};
// (switchManagerTab defined earlier - section 5)

 // ==========================================
 // 17.9. MANAGER: DAILY REPORT
 // ==========================================
 function renderManagerDailyReport(d) {
 if ($("mgrDailyDate")) $("mgrDailyDate").value = d;
 const ids = attByDate[d] || [];
 const rev = revenueByDate[d] || 0;
 const expArr = expensesByDate[d] || [];
 const validStudents = Object.values(students || {}).filter(s => s && s.name && s.name.trim() !== "");
 const totalSt = validStudents.length;
 let totalExp = 0; expArr.forEach(e => totalExp += (e.amount || 0));

 if ($("mgrDailyAttendCount")) $("mgrDailyAttendCount").textContent = ids.length;
 if ($("mgrDailyRevenue")) $("mgrDailyRevenue").textContent = rev;
 if ($("mgrDailyAbsent")) $("mgrDailyAbsent").textContent = Math.max(0, totalSt - ids.length);
 if ($("mgrDailyExpenses")) $("mgrDailyExpenses").textContent = totalExp;

 const body = $("mgrDailyReportBody");
 if (!body) return;
 if (ids.length === 0 && expArr.length === 0) {
 body.innerHTML = `<div class="mutedCenter">لا يوجد بيانات لهذا اليوم</div>`;
 return;
 }
 // Group by class
 let groups = {};
 ids.forEach(id => {
 const st = students[id];
 const cls = (st && st.className && st.className !== "عام" && st.className !== "General") ? st.className.trim() : (currentLang === "ar" ? "عام" : "General");
 if (!groups[cls]) groups[cls] = { count: 0, revenue: 0 };
 groups[cls].count++;
 if (st && st.paid !== undefined) {
 
    let req = 0;
    if (cls && groupFees[cls] !== undefined) {
       const pkg = groupFees[cls];
       if (st && st.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg);
       }
    }

 if (req > 0) groups[cls].revenue += req;
 }
 });
 let html = "";
 for (let g in groups) {
 const gColor = getTagColor(g);
 html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-inline-start:4px solid ${gColor};background:var(--bg-inset);border-radius:8px;margin-bottom:8px;">
 <span style="font-weight:700;color:${gColor};">${g}</span>
 <span style="font-weight:600;">${groups[g].count} طالب</span>
 </div>`;
 }
 if (expArr.length > 0) {
 html += `<div style="margin-top:14px;"><h4 style="color:var(--danger);margin-bottom:8px;">المصروفات</h4>`;
 expArr.forEach(e => {
 html += `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-danger-subtle);border-radius:6px;margin-bottom:6px;font-size:0.9em;">
 <span>${e.reason || "غير محدد"}</span>
 <span style="color:var(--danger);font-weight:700;">${e.amount} ج</span>
 </div>`;
 });
 html += `</div>`;
 }
 body.innerHTML = html;
 }

 if ($("mgrDailyDate")) {
 $("mgrDailyDate").addEventListener("change", e => renderManagerDailyReport(e.target.value));
 }

 // ==========================================
 // 17.10. MANAGER: TERM REPORT
 // ==========================================
 function renderManagerTermReport() {
 const search = ($("mgrTermSearch") ? $("mgrTermSearch").value.toLowerCase() : "");
 const clsFilter= ($("mgrTermClass") ? $("mgrTermClass").value : "");
 const tbody = $("mgrTermTableBody");
 const clsSel = $("mgrTermClass");

 // populate class filter
 if (clsSel) {
 const existing = [...clsSel.options].map(o => o.value);
 const classes = [...new Set(Object.values(students).filter(s => s && s.className && s.className !== "عام" && s.className !== "General").map(s => s.className))];
 classes.forEach(c => {
 if (!existing.includes(c)) {
 const opt = document.createElement("option");
 opt.value = c; opt.textContent = c;
 clsSel.appendChild(opt);
 }
 });
 }

 let rows = [], totalRev = 0, totalDebt = 0;
 Object.values(students).forEach(st => {
 if (!st || !st.name) return;
 if (search && !st.name.toLowerCase().includes(search)) return;
 const cls = ((st.className && st.className !== "عام" && st.className !== "General") ? st.className : (currentLang === "ar" ? "عام" : "General")).trim();
 if (clsFilter && cls !== clsFilter) return;
 
    let req = 0;
    if (cls && groupFees[cls] !== undefined) {
       const pkg = groupFees[cls];
       if (st && st.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg);
       }
    }

 const paid = st.paid || 0;
 const debt = req > 0 ? Math.max(0, req - paid) : 0;
 const attCount = Object.values(attByDate).reduce((n, ids) => n + (ids.includes(String(st.id)) ? 1 : 0), 0);
 totalRev += paid;
 totalDebt += debt;
 rows.push({ st, cls, req, paid, debt, attCount });
 });

 if ($("mgrTermTotalStudents")) $("mgrTermTotalStudents").textContent = rows.length;
 if ($("mgrTermTotalRevenue")) $("mgrTermTotalRevenue").textContent = totalRev;
 if ($("mgrTermTotalDebt")) $("mgrTermTotalDebt").textContent = totalDebt;

 if (!tbody) return;
 if (rows.length === 0) {
 tbody.innerHTML = `<tr><td colspan="7" class="mutedCenter" style="padding:20px;">لا يوجد طلاب</td></tr>`;
 return;
 }
 const gColor = c => getTagColor ? getTagColor(c) : "#888";
 tbody.innerHTML = rows.map(r => `
 <tr style="border-bottom:1px solid var(--border); transition:background 0.2s;" onmouseover="this.style.background='var(--bg-inset)'" onmouseout="this.style.background=''"">
 <td style="padding:10px 16px;font-weight:600;">${r.st.name}</td>
 <td style="padding:10px 16px;"><span style="background:${gColor(r.cls)}22;color:${gColor(r.cls)};padding:3px 8px;border-radius:5px;font-size:0.82em;font-weight:700;">${r.cls}</span></td>
 <td style="padding:10px 16px;">${r.req > 0 ? r.req + " ج" : "—"}</td>
 <td style="padding:10px 16px;color:var(--success);font-weight:700;">${r.paid > 0 ? r.paid + " ج" : "—"}</td>
 <td style="padding:10px 16px;color:${r.debt > 0 ? 'var(--danger)' : 'var(--success)'};font-weight:700;">${r.debt > 0 ? r.debt + " ج" : ""}</td>
 <td style="padding:10px 16px;">${r.attCount}</td>
 <td style="padding:10px 16px;">
 <button class="btn primary smallBtn" onclick="window.extOpen('${r.st.id}')"><i class="fa-solid fa-folder-open"></i> فتح</button>
 </td>
 </tr>`).join("");
 }

 if ($("mgrTermSearch")) $("mgrTermSearch").addEventListener("input", renderManagerTermReport);
 if ($("mgrTermClass")) $("mgrTermClass").addEventListener("change", renderManagerTermReport);

 // ==========================================
 // 17.11. MANAGER: PERMISSIONS SYSTEM
 // ==========================================
 const PERMISSIONS_DEFS = [
  { key: "show_revenue", label: "إظهار الإيراد اليومي", desc: "يعرض رقم إيراد الوردية الحالي في الشريط العلوي للمساعد" },
  { key: "can_add_student", label: "إضافة طالب جديد", desc: "يسمح بفتح كارت 'إضافة طالب جديد' وتسجيل البيانات" },
  { key: "can_manage_packages", label: "إدارة الباقات والأسعار", desc: "إتاحة فتح صفحة إدارة الباقات والأسعار من القائمة الجانبية" },
  { key: "can_access_syllabus", label: "المنهج الدراسي", desc: "السماح بفتح وعرض خريطة سير المنهج من القائمة الجانبية" },
  { key: "can_view_reports", label: "الوصول لصفحة التقارير", desc: "السماح للمساعد بفتح قسم الحسابات والتقارير" },
  { key: "can_access_marketing", label: "أدوات التسويق", desc: "إتاحة فتح صفحة التسويق وإرسال رسائل للطلاب" },
  { key: "can_access_session_students", label: "طلاب الحصة", desc: "السماح بعرض قائمة الحضور المخصصة للحصة الحالية" },
  { key: "can_request_discount", label: "طلب خصم / إعفاء", desc: "إظهار زر 'خصم' عند الدفع ليتمكن المساعد من طلب إعفاء" },
  { key: "can_access_booklets", label: "مخزون المذكرات", desc: "السماح بفتح جرد المذكرات وإدارة المبيعات" },
  { key: "can_access_settings", label: "إعدادات النظام", desc: "السماح بفتح لوحة الإعدادات المتقدمة (نسخ احتياطي - تصفير - إلخ)" }
];

// Default permissions initialized from local cache immediately
let currentPermissions = {};
PERMISSIONS_DEFS.forEach(p => currentPermissions[p.key] = true);
try {
  const cached = localStorage.getItem("ca_asst_permissions");
  if (cached) {
    const parsed = JSON.parse(cached);
    PERMISSIONS_DEFS.forEach(p => {
      if (parsed[p.key] !== undefined) currentPermissions[p.key] = parsed[p.key];
    });
  }
} catch(e) {}

// Instant Real-time sync with Admin via BroadcastChannel (< 5ms response across tabs)
if ('BroadcastChannel' in window) {
  const permChannel = new BroadcastChannel('studify_permissions_sync');
  permChannel.onmessage = (e) => {
    const msg = e.data;
    if (!msg) return;
    const currentU = localStorage.getItem("ca_current_username") || "";
    if (msg.type === 'PERMISSIONS_UPDATED') {
      if (!msg.username || msg.username.toLowerCase() === currentU.toLowerCase()) {
        currentPermissions = msg.permissions || {};
        localStorage.setItem("ca_asst_permissions", JSON.stringify(currentPermissions));
        if (typeof applyPermissionsToAssistantUI === 'function') {
          applyPermissionsToAssistantUI();
        }
        if (typeof showToast === 'function') {
          showToast("تم تحديث الصلاحيات من قِبل المدير فورياً", "info");
        }
      }
    } else if (msg.type === 'DAILY_SHIFT_CHANGE' || msg.type === 'DAILY_SHIFT_APPROVED' || msg.type === 'DAILY_SHIFT_REJECTED') {
      if (msg.shift_system_enabled === false) {
        if (typeof window.applyShiftLockState === 'function') {
          window.applyShiftLockState(msg.date, true, '');
        }
      } else {
        const isApproved = msg.type === 'DAILY_SHIFT_APPROVED' || msg.isApproved === true;
        if (typeof window.applyShiftLockState === 'function') {
          window.applyShiftLockState(msg.date, isApproved, msg.reason);
        }
      }
    } else if (msg.type === 'PACKAGES_UPDATED') {
      (async () => {
        try {
          await loadAll();
          if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
          if (typeof populatePackages === 'function') populatePackages();
          if (typeof renderTable === 'function') renderTable();
          if (typeof renderManagerPackagesCard === 'function') renderManagerPackagesCard();
        } catch(e) {}
      })();
    } else if (msg.type === 'SYLLABUS_UPDATED') {
      (async () => {
        try {
          await loadAll();
          if (typeof renderSyllabus === 'function') renderSyllabus();
        } catch(e) {}
      })();
    } else if (msg.type === 'DECISION_APPROVED' || msg.type === 'STUDENT_DISCOUNT_UPDATED') {
      (async () => {
        try {
          await loadAll();
          if (typeof renderTable === 'function') renderTable();
          if (typeof renderList === 'function') renderList(false);
          if (typeof updateStats === 'function') updateStats();
          if (typeof updateTopStats === 'function') updateTopStats();
          if (typeof currentId !== 'undefined' && currentId && (String(currentId) === String(msg.student_id) || !msg.student_id) && typeof updateStudentUI === 'function') {
            updateStudentUI(currentId);
          }
        } catch(e) {}
      })();
    }
  };
}

// Supabase Real-time sync across different devices (Mobile & PC)
document.addEventListener("DOMContentLoaded", () => {
  if (window.supabaseClient) {
    window.supabaseClient.channel('custom-all-channel-sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'assistants' }, payload => {
        const currentU = localStorage.getItem("ca_current_username") || "";
        if (payload.new && payload.new.username && payload.new.username.toLowerCase() === currentU.toLowerCase()) {
          currentPermissions = payload.new.permissions || {};
          localStorage.setItem("ca_asst_permissions", JSON.stringify(currentPermissions));
          if (typeof applyPermissionsToAssistantUI === 'function') {
            applyPermissionsToAssistantUI();
          }
          if (typeof showToast === 'function') {
            showToast("تم تحديث الصلاحيات من قِبل المدير فورياً", "info");
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
        if (payload.new && payload.new.config && payload.new.config.student_ranks) {
          const ranks = payload.new.config.student_ranks;
          let changed = false;
          Object.keys(ranks).forEach(stId => {
            if (students[stId] && students[stId].rank !== ranks[stId]) {
              students[stId].rank = ranks[stId];
              changed = true;
            }
          });
          if (changed) {
            if (typeof currentId !== 'undefined' && currentId && students[currentId] && typeof updateStudentUI === 'function') {
              updateStudentUI(currentId);
            }
            if (typeof renderList === 'function') renderList(false);
            secureSave(K_STUDENTS, students);
          }
        }
        if (payload.new && payload.new.config) {
          const cfg = payload.new.config;
          if (cfg.student_package_discounts) {
            const spd = cfg.student_package_discounts;
            let changedSpd = false;
            Object.keys(spd).forEach(stId => {
              if (students[stId]) {
                students[stId].packageDiscounts = spd[stId];
                changedSpd = true;
              }
            });
            if (changedSpd) {
              secureSave(K_STUDENTS, students);
              if (typeof currentId !== 'undefined' && currentId && students[currentId] && typeof updateStudentUI === 'function') {
                updateStudentUI(currentId);
              }
              if (typeof renderTable === 'function') renderTable();
            }
          }
          if (cfg.group_fees) {
            groupFees = Object.assign({}, groupFees, cfg.group_fees);
            secureSave(K_GROUP_FEES, groupFees);
            if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
            if (typeof populatePackages === 'function') populatePackages();
            if (typeof renderTable === 'function') renderTable();
          }
          if (cfg.syllabus_data || cfg.syllabus) {
            const sylSrc = cfg.syllabus_data || cfg.syllabus;
            if (Array.isArray(sylSrc)) {
              syllabusData = sylSrc.map(s => ({
                name: s.name || s.title || '',
                title: s.title || s.name || '',
                status: s.status || 'not_started',
                notes: s.notes || '',
                date: s.date || s.updated_at || nowDateStr(),
                updated_at: s.updated_at || new Date().toISOString()
              }));
              secureSave(K_SYLLABUS, syllabusData);
              if (typeof renderSyllabus === 'function') renderSyllabus();
            }
          }
        }
        if (typeof window.checkDailyShiftHeartbeat === 'function') {
          window.checkDailyShiftHeartbeat(false);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, async (payload) => {
        try {
          if (payload.eventType === 'DELETE' && payload.old && payload.old.name) {
            delete groupFees[payload.old.name];
            await secureSave(K_GROUP_FEES, groupFees);
          } else if (payload.new && payload.new.name) {
            const p = payload.new;
            const existing = groupFees[p.name] || {};
            groupFees[p.name] = {
              name: p.name,
              subject: existing.subject || p.name,
              price: Number(p.price) || 0,
              hasInstallments: !!p.has_installments,
              installmentPrice: Number(p.installment_price) || 0,
              expiryType: existing.expiryType || 'none',
              startDate: existing.startDate || '',
              endDate: existing.endDate || '',
              sessionLimit: existing.sessionLimit || 0
            };
            await secureSave(K_GROUP_FEES, groupFees);
          }
          if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
          if (typeof populatePackages === 'function') populatePackages();
          if (typeof renderTable === 'function') renderTable();
        } catch(e) {
          console.warn('[Realtime Package Sync Error]:', e);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_revenue_shifts' }, payload => {
        if (typeof window.checkDailyShiftHeartbeat === 'function') {
          window.checkDailyShiftHeartbeat(false);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, payload => {
        try {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new;
            if (!row || !row.id) return;
            const existing = students[row.id];
            if (existing && existing.lastModified && row.last_modified && existing.lastModified > row.last_modified) {
              return;
            }
            const stObj = {
              id: row.id,
              name: row.name || (existing ? existing.name : ''),
              phone: row.phone || (existing ? existing.phone : ''),
              parentPhone: row.parent_phone || row.parentPhone || (existing ? existing.parentPhone : ''),
              className: row.class_name || row.className || (existing ? existing.className : ''),
              paymentPlan: row.payment_plan || (existing ? existing.paymentPlan : 'cash'),
              paid: Number(row.paid) || (existing ? existing.paid : 0),
              discount: Number(row.discount) || (existing ? existing.discount : 0),
              notes: row.notes || (existing ? existing.notes : ''),
              status: row.status || (existing ? existing.status : 'active'),
              packages: Array.isArray(row.packages) ? row.packages : (existing ? existing.packages : []),
              packageDiscounts: (existing ? existing.packageDiscounts : {}),
              installments: row.installments || (existing ? existing.installments : []),
              payments: row.payments || (existing ? existing.payments : []),
              attendanceDates: Array.from(new Set(row.attendance_dates || (existing ? existing.attendanceDates : []))),
              lastModified: row.last_modified || Date.now()
            };
            if (row.status === 'deleted') {
              deletedStudents[row.id] = stObj;
              delete students[row.id];
            } else {
              students[row.id] = stObj;
            }
            if (typeof renderList === 'function') renderList(false);
            if (typeof updateTopStats === 'function') updateTopStats();
            if (typeof currentId !== 'undefined' && currentId && String(currentId) === String(row.id) && typeof updateStudentUI === 'function') {
              updateStudentUI(currentId);
            }
            secureSave(K_STUDENTS, students);
          } else if (payload.eventType === 'DELETE') {
            const oldId = payload.old && payload.old.id;
            if (oldId && students[oldId]) {
              delete students[oldId];
              if (typeof renderList === 'function') renderList(false);
              if (typeof updateTopStats === 'function') updateTopStats();
              secureSave(K_STUDENTS, students);
            }
          }
        } catch(err) {
          console.warn('[Realtime Student Sync Error]:', err);
        }
      })
      .subscribe();
  }
});

 async function loadPermissions() {
  if (!window.supabaseClient) return;
  
  if (window.CURRENT_ROLE === "admin") {
      // Admin has all permissions automatically
      PERMISSIONS_DEFS.forEach(p => currentPermissions[p.key] = true);
      return;
  }
  
  const currentUsername = localStorage.getItem("ca_current_username") || localStorage.getItem("ca_asst_email") || "";
  if (!currentUsername) return;
  
  try {
    const cleanU = currentUsername.trim();
    const { data: asst } = await window.supabaseClient
      .from('assistants')
      .select('permissions')
      .or(`username.ilike.${cleanU},email.ilike.${cleanU}`)
      .maybeSingle();

    if (asst && asst.permissions) {
      const saved = asst.permissions;
      PERMISSIONS_DEFS.forEach(p => {
        if (saved[p.key] !== undefined) currentPermissions[p.key] = saved[p.key];
      });
      localStorage.setItem("ca_asst_permissions", JSON.stringify(currentPermissions));
      if (typeof applyPermissionsToAssistantUI === 'function') {
        applyPermissionsToAssistantUI();
      }
    }
  } catch(e) { console.error("Load permissions error:", e); }
}

 // ==========================================
 // 17.12. MANAGER: DECISION REQUESTS INBOX
 // ==========================================
 async function fetchManagerRequests() {
  const listEl = $("managerRequestsList");
  if (!listEl) return;
  if (!window.supabaseClient) return;
  listEl.innerHTML = '<div class="mutedCenter">جاري التحميل...</div>';
  try {
    const { data: reqs, error } = await window.supabaseClient
      .from('communications')
      .select('*')
      .not('id', 'is', null)
      .eq('type', 'manager_request')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    const badge = $("managerDecisionsBadge");
    if (!error && reqs && reqs.length > 0) {
      if (badge) { badge.textContent = reqs.length; badge.classList.remove("hidden"); }
      let html = "";
      reqs.forEach(r => {
        const date = new Date(r.created_at).toLocaleString("ar-EG");
        const isExempt = (r.title === "exemption" || r.sub_type === "exemption");
        const typeLabel = isExempt ? "إعفاء كامل" : 'خصم ' + r.amount + ' ج';
        html += '<div class="decision-card">' +
          '<div class="decision-card-info">' +
            '<div class="decision-student-name">' + (r.student_id || '') + '</div>' +
            '<div class="decision-meta">' + typeLabel + ' • طلب من: ' + (r.sender_name || "مساعد") + ' • ' + date + '</div>' +
            '<div class="decision-meta" style="margin-top:4px;">السبب: ' + (r.message || "—") + '</div>' +
          '</div>' +
          '<div class="decision-amount">' + ((r.title === "exemption" || r.sub_type === "exemption") ? "إعفاء" : r.amount + " ج") + '</div>' +
          '<div class="decision-actions">' +
            '<button class="btn success smallBtn" onclick="window.approveRequest(\'' + r.id + '\')"><i class="fa-solid fa-check"></i> قبول</button>' +
            '<button class="btn danger smallBtn" onclick="window.rejectRequest(\'' + r.id + '\')"><i class="fa-solid fa-xmark"></i> رفض</button>' +
          '</div>' +
        '</div>';
      });
      listEl.innerHTML = html;
    } else {
      if (badge) badge.classList.add("hidden");
      listEl.innerHTML = '<div class="mutedCenter">لا توجد طلبات معلقة</div>';
    }
  } catch(e) {
    console.error(e);
    listEl.innerHTML = '<div class="mutedCenter">فشل جلب الطلبات</div>';
  }
 }

 window.approveRequest = async function(reqId) {
  if (!window.supabaseClient) return;
  try {
    const { data: r, error } = await window.supabaseClient
      .from('communications')
      .select('*')
      .eq('id', reqId)
      .single();

    if (error || !r) return;

    // Apply the discount/exemption locally and save
    const stId = String(r.student_id);
    if (students[stId]) {
      const cls = (students[stId].className || "").trim();
      let req = 0;
      if (cls && groupFees[cls] !== undefined) {
        const pkg = groupFees[cls];
        req = toInt(pkg.price || pkg) || 0;
      }
      if (r.sub_type === "exemption") {
        students[stId].paid = req;
      } else if (r.sub_type === "discount") {
        const discounted = Math.max(0, req - toInt(r.amount));
        students[stId].paid = Math.max(students[stId].paid || 0, discounted > 0 ? req - toInt(r.amount) : 0);
      }
      saveAll();
    }

    // Mark request approved
    await window.supabaseClient.from('communications').update({ status: 'approved' }).eq('id', reqId);

    // Send assistant message
    const msgId = "msg_" + Date.now();
    await window.supabaseClient.from('communications').insert({
      id: msgId,
      type: 'assistant_message',
      title: " تمت الموافقة على طلبك",
      message: 'وافق المدير على ' + ((r.title === "exemption" || r.sub_type === "exemption") ? "إعفاء" : "خصم " + r.amount + " ج") + ' للطالب ' + (r.student_id || '') + '. السبب: ' + (r.message || "—"),
      status: 'unread'
    });

    showToast("تمت الموافقة وتطبيق الخصم ", "success");
    fetchManagerRequests();
  } catch(e) {
    console.error(e);
    showToast("فشل تنفيذ الطلب", "err");
  }
 };

 window.rejectRequest = async function(reqId) {
  if (!window.supabaseClient) return;
  try {
    const { data: r } = await window.supabaseClient.from('communications').select('*').eq('id', reqId).single();
    await window.supabaseClient.from('communications').update({ status: 'rejected' }).eq('id', reqId);

    if (r) {
      const msgId = "msg_" + Date.now();
      await window.supabaseClient.from('communications').insert({
        id: msgId,
        type: 'assistant_message',
        title: " تم رفض طلبك",
        message: 'رفض المدير طلب ' + ((r.title === "exemption" || r.sub_type === "exemption") ? "الإعفاء" : "الخصم " + r.amount + " ج") + ' للطالب ' + (r.student_id || '') + '.',
        status: 'unread'
      });
    }

    showToast("تم رفض الطلب", "warning");
    fetchManagerRequests();
  } catch(e) {
    console.error(e);
    showToast("فشل في الرفض", "err");
  }
 };

 // Direct discount by manager
 if ($("mgrApplyDirectDiscountBtn")) {
  on("mgrApplyDirectDiscountBtn", "click", async function() {
    const stId = $("mgrDirectStudentId") ? $("mgrDirectStudentId").value.trim() : "";
    const amount = $("mgrDirectAmount") ? toInt($("mgrDirectAmount").value) : 0;
    const reason = $("mgrDirectReason") ? $("mgrDirectReason").value.trim() : "";
    if (!stId || !students[stId]) return showToast("الطالب غير موجود", "err");
    const cls = (students[stId].className || "").trim();
    
    let req = 0;
    if (cls && groupFees[cls] !== undefined) {
      const pkg = groupFees[cls];
      if (students[stId] && students[stId].paymentPlan === "installments" && pkg.hasInstallments) {
        req = toInt(pkg.installmentPrice) || 0;
      } else {
        req = toInt(pkg.price || pkg);
      }
    }

    if (amount > 0 && req > 0) {
      students[stId].paid = Math.max(students[stId].paid || 0, req - amount);
    } else if (amount === 0 && req > 0) {
      students[stId].paid = req;
    }
    saveAll();
    if ($("mgrDirectStudentId")) $("mgrDirectStudentId").value = "";
    if ($("mgrDirectAmount")) $("mgrDirectAmount").value = "";
    if ($("mgrDirectReason")) $("mgrDirectReason").value = "";
    showToast(`تم تطبيق الخصم على ${students[stId].name} `, "success");
  });
 }

 // ==========================================
 // 17.13. ASSISTANT: SEND DECISION / DISCOUNT REQUEST
  // ==========================================
  window.selectedDiscReqStudent = null;

  window.openDecisionRequestModal = function(studentId) {
    if (typeof currentPermissions !== 'undefined' && currentPermissions.can_request_discount === false) {
      showToast("إرسال طلبات القرارات مقفل من قِبل المدير", "warning");
      return;
    }

    const modal = document.getElementById("discountRequestModal");
    if (!modal) return;

    // Reset inputs
    const sInp = document.getElementById("discReqStudentInput");
    const idInp = document.getElementById("discReqStudentId");
    const amtInp = document.getElementById("discReqAmount");
    const rsnInp = document.getElementById("discReqReason");
    const typeSel = document.getElementById("discReqType");

    if (amtInp) amtInp.value = "";
    if (rsnInp) rsnInp.value = "";
    if (typeSel) typeSel.value = "discount";
    window.handleDiscReqTypeChange("discount");

    const notFoundEl = document.getElementById("discReqNotFoundAlert");
    if (notFoundEl) notFoundEl.classList.add("hidden");
    const pkgSelect = document.getElementById("discReqTargetPackage");
    if (pkgSelect) pkgSelect.innerHTML = '<option value="">-- اختر الباقة المراد تطبيق الخصم عليها --</option>';

    let st = null;
    if (studentId && typeof students !== 'undefined') {
      st = students[String(studentId)];
    }

    if (st) {
      if (idInp) idInp.value = st.id;
      if (sInp) sInp.value = String(st.id) + " - " + (st.name || '');
      window.displayDiscReqStudent(st);
    } else {
      if (idInp) idInp.value = "";
      if (sInp) {
        sInp.value = "";
        setTimeout(() => sInp.focus(), 150);
      }
      window.selectedDiscReqStudent = null;
      const details = document.getElementById("discReqStudentDetails");
      if (details) details.classList.add("hidden");
    }

    modal.classList.remove("hidden");
  };

  // Backward compatibility alias
  window.openDiscountRequestModal = window.openDecisionRequestModal;

  window.handleDiscReqSearch = function(val) {
    const q = String(val || '').trim().toLowerCase();
    const details = document.getElementById("discReqStudentDetails");
    const idInp = document.getElementById("discReqStudentId");
    const notFoundEl = document.getElementById("discReqNotFoundAlert");
    const pkgSelect = document.getElementById("discReqTargetPackage");

    if (!q) {
      if (details) details.classList.add("hidden");
      if (notFoundEl) notFoundEl.classList.add("hidden");
      if (idInp) idInp.value = "";
      if (pkgSelect) pkgSelect.innerHTML = '<option value="">-- اختر الباقة المراد تطبيق الخصم عليها --</option>';
      window.selectedDiscReqStudent = null;
      return;
    }

    let found = null;
    if (typeof students !== 'undefined') {
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
    }

    if (found) {
      if (notFoundEl) notFoundEl.classList.add("hidden");
      if (idInp) idInp.value = found.id;
      window.displayDiscReqStudent(found);
    } else {
      if (details) details.classList.add("hidden");
      if (notFoundEl) notFoundEl.classList.remove("hidden");
      if (idInp) idInp.value = "";
      if (pkgSelect) pkgSelect.innerHTML = '<option value="">-- اختر الباقة المراد تطبيق الخصم عليها --</option>';
      window.selectedDiscReqStudent = null;
    }
  };

  window.displayDiscReqStudent = function(st) {
    window.selectedDiscReqStudent = st;
    const details = document.getElementById("discReqStudentDetails");
    if (!details) return;

    let req = 0;
    const stPkgs = (st.packages && st.packages.length > 0) ? st.packages : (st.className ? [st.className] : []);
    stPkgs.forEach(pName => {
      const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pName) : null;
      if (pDet && pDet.price) req += toInt(pDet.price);
      else if (typeof packages !== 'undefined' && packages && packages[pName]) req += (packages[pName].price || 0);
      else if (typeof groupFees !== 'undefined' && groupFees && groupFees[pName]) req += (groupFees[pName].price || groupFees[pName] || 0);
    });
    if (req === 0 && st.paid) req = Number(st.paid);

    const curDisc = Number(st.discount) || 0;
    const curPaid = Number(st.paid) || 0;
    const remaining = Math.max(0, req - curDisc - curPaid);

    const idEl = document.getElementById("discReqStIdBadge");
    const nameEl = document.getElementById("discReqStNameBadge");
    const classEl = document.getElementById("discReqStClassBadge");
    const reqEl = document.getElementById("discReqStRequired");
    const discEl = document.getElementById("discReqStCurrentDisc");
    const remEl = document.getElementById("discReqStRemaining");
    const pkgsListEl = document.getElementById("discReqPkgsList");

    if (idEl) idEl.textContent = `ID: #${st.id}`;
    if (nameEl) nameEl.textContent = st.name || 'طالب بدون اسم';
    if (classEl) classEl.textContent = st.className || 'غير محدد';
    if (reqEl) reqEl.textContent = req + " ج";
    if (discEl) discEl.textContent = curDisc + " ج";
    if (remEl) remEl.textContent = remaining + " ج";

    if (pkgsListEl) {
      if (stPkgs.length > 0) {
        pkgsListEl.innerHTML = `<span style="font-weight:700; color:var(--text-primary); margin-inline-end:6px;">الباقات:</span>` + 
          stPkgs.map(p => `<span style="background:var(--bg-inset); padding:2px 8px; border-radius:6px; border:1px solid var(--border); margin-inline-end:4px; font-weight:700;">${p}</span>`).join("");
      } else {
        pkgsListEl.innerHTML = `<span>لا توجد باقات محددة للطالب</span>`;
      }
    }

    // Populate target package selector
    const pkgSelect = document.getElementById("discReqTargetPackage");
    if (pkgSelect) {
      let optHtml = '<option value="">-- اختر الباقة المراد تطبيق الخصم عليها --</option>';
      stPkgs.forEach(pName => {
        const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pName) : null;
        const pPrice = pDet && pDet.price ? toInt(pDet.price) : 0;
        optHtml += `<option value="${pName}">${pName} (${pPrice > 0 ? pPrice + ' ج' : 'سعر مخصص'})</option>`;
      });
      optHtml += '<option value="all">كافة الباقات والاشتراكات المقررة (خصم إجمالي)</option>';
      pkgSelect.innerHTML = optHtml;
      if (stPkgs.length === 1) {
        pkgSelect.value = stPkgs[0];
      }
    }

    details.classList.remove("hidden");
  };

  window.handleDiscReqPkgChange = function(pkgVal) {
    // Optional hook when assistant switches targeted package
  };

  window.handleDiscReqTypeChange = function(type) {
    const wrap = document.getElementById("discReqAmountWrap");
    const amtInp = document.getElementById("discReqAmount");
    if (!wrap) return;

    if (type === "exemption") {
      wrap.style.display = "none";
      if (amtInp) amtInp.value = "";
    } else {
      wrap.style.display = "block";
    }
  };

  window.submitDecisionRequest = async function() {
    const idInp = document.getElementById("discReqStudentId");
    let stId = idInp ? idInp.value.trim() : "";
    let st = window.selectedDiscReqStudent || (stId && typeof students !== 'undefined' ? students[String(stId)] : null);

    if (!st) {
      showToast("يرجى اختيار طالب أولاً من البحث", "warn");
      return;
    }

    const targetPkg = document.getElementById("discReqTargetPackage") ? document.getElementById("discReqTargetPackage").value : "";
    if (!targetPkg) {
      showToast("يرجى اختيار الباقة المستهدفة بالقرار", "warn");
      return;
    }

    const type = document.getElementById("discReqType") ? document.getElementById("discReqType").value : "discount";
    const amount = type === "exemption" ? 0 : (Number(document.getElementById("discReqAmount") ? document.getElementById("discReqAmount").value : 0) || 0);
    const reason = document.getElementById("discReqReason") ? document.getElementById("discReqReason").value.trim() : "";

    if (type === "discount" && amount <= 0) {
      showToast("يرجى كتابة قيمة الخصم المقترحة بالجنيه", "warn");
      return;
    }

    if (!reason) {
      showToast("يرجى كتابة سبب طلب القرار ليعتمده المدير", "warn");
      return;
    }

    if (!window.supabaseClient) {
      showToast("فشل الاتصال بقاعدة البيانات السحابية", "err");
      return;
    }

    const submitBtn = document.getElementById("submitDiscountRequestBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    }

    const reqId = "req_" + Date.now();
    const assistantName = localStorage.getItem("ca_current_username") || "مساعد";
    const pkgLabel = targetPkg === "all" ? "كافة الباقات" : targetPkg;
    const fullMessage = `[الباقة: ${pkgLabel}] ${reason}`;

    try {
      const { error } = await window.supabaseClient.from('communications').insert([{
        id: reqId,
        type: 'manager_request',
        title: type,
        student_id: String(st.id),
        target_pkg: targetPkg,
        amount: amount,
        message: fullMessage,
        sender_name: assistantName,
        status: "pending",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      if ('BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('studify_permissions_sync');
          bc.postMessage({ type: 'NEW_DECISION_REQUEST', student_id: st.id, sender: assistantName, target_pkg: targetPkg });
        } catch(e) {}
      }

      const modal = document.getElementById("discountRequestModal");
      if (modal) modal.classList.add("hidden");

      showToast("تم إرسال طلب القرار للمدير بنجاح، وستصلك الموافقة فور اعتمادها من الإدارة", "success");

    } catch(err) {
      console.error(err);
      showToast("فشل إرسال الطلب: " + err.message, "err");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الطلب للمدير';
      }
    }
  };

  // 17.14. ASSISTANT MESSAGES INBOX
 // ==========================================
 let assistantMessages = [];
 let lastReadMsgTime = toInt(localStorage.getItem("ca_last_read_msg") || "0");

 function fetchAssistantMessages() {
  if (!window.supabaseClient || window.CURRENT_ROLE === "admin") return;
  window.supabaseClient
    .from('communications')
    .select('*')
    .not('id', 'is', null)
    .eq('type', 'assistant_message')
    .order('created_at', { ascending: false })
    .limit(20)
    .then(({ data }) => {
      assistantMessages = (data || []).map(m => ({
        id: m.id,
        title: m.title,
        body: m.message,
        timestamp: new Date(m.created_at).getTime(),
        read: m.status === 'read'
      }));
      updateAssistantMsgBadge();
    }).catch(e => console.error(e));
 }

 function updateAssistantMsgBadge() {
  if (typeof renderNotifications === 'function') {
    renderNotifications();
  }
 }

 function renderAssistantNotifDropdown() {
  const listEl = $("notificationsList");
  if (!listEl) return;
  if (window.CURRENT_ROLE === "admin") return;

  const dropdown = $("notificationsDropdown");
  if (dropdown && !dropdown.querySelector(".msg-tabs")) {
    const tabsDiv = document.createElement("div");
    tabsDiv.className = "msg-tabs";
    tabsDiv.innerHTML = `
    <button class="msg-tab-btn active" id="msgTabMessages" onclick="window.switchMsgTab('messages')"><i class="fa-solid fa-envelope"></i> الرسائل</button>
    `;
    dropdown.insertBefore(tabsDiv, listEl);
  }
  renderAssistantMessages();
 }

 window.switchMsgTab = function(tab) {
  document.querySelectorAll(".msg-tab-btn").forEach(b => b.classList.remove("active"));
  if (tab === "messages") {
    if ($("msgTabMessages")) $("msgTabMessages").classList.add("active");
    renderAssistantMessages();
  }};

 function renderAssistantMessages() {
  const listEl = $("notificationsList");
  if (!listEl) return;
  if (assistantMessages.length === 0) {
    listEl.innerHTML = `<div style="text-align:center;color:#888;padding:10px;"><i class="fa-solid fa-comment-slash" style="font-size:24px;margin-bottom:8px;"></i><br>لا توجد رسائل</div>`;
    return;
  }
  listEl.innerHTML = assistantMessages.slice(0, 20).map(m => {
    const isUnread = !m.read;
    const date = new Date(m.timestamp).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const color = (m.title && m.title.includes("رفض")) ? "var(--danger)" : "var(--success)";
    return `<div style="padding:10px;border-radius:8px;background:${isUnread ? 'rgba(37,99,235,0.08)' : 'transparent'};border-inline-start:3px solid ${isUnread ? color : 'var(--border)'};font-size:0.88em;cursor:pointer;" onclick="window.markMsgRead('${m.id}')">
    <div style="font-weight:700;margin-bottom:3px;color:${color};">${m.title}</div>
    <div style="color:var(--text-primary);opacity:0.85;margin-bottom:4px;">${m.body}</div>
    <div style="font-size:0.78em;color:#888;">${date}</div>
    </div>`;
  }).join("");
  lastReadMsgTime = Date.now();
  localStorage.setItem("ca_last_read_msg", lastReadMsgTime.toString());
  updateAssistantMsgBadge();
 }

 window.markMsgRead = async function(msgId) {
  if (!window.supabaseClient) return;
  try { await window.supabaseClient.from('communications').update({ status: 'read' }).eq('id', msgId); }
  catch(e) { console.error(e); }
 };

 // Notifications toggle handled centrally in setupNotificationsUI

 if (window.CURRENT_ROLE !== "admin") fetchAssistantMessages();

 // showAddAsstModal button
 if ($("showAddAsstModalBtn")) {
 on("showAddAsstModalBtn", "click", function() {
 const panel = $("addAsstFormPanel");
 if (panel) panel.classList.toggle("hidden");
 });
 }

 // ==========================================
 // AUTO-FETCH: Decisions badge on dashboard load
 // ==========================================
 if (window.CURRENT_ROLE === "admin" && window.supabaseClient) {
   const mid = localStorage.getItem("ca_manager_id");
   if (mid && typeof fetchManagerRequests === "function") {
     fetchManagerRequests();
   }
 }

 // ==========================================
 // 18. INITIALIZATION (START ENGINE)
 // ==========================================
 function checkDailyBackup() {
   // Excel backup reminder removed per user request
 }

 function checkQR() {
 const urlParams = new URLSearchParams(window.location.search);
 const openId = toInt(urlParams.get("openId"));
 if (openId) {
   const runOpen = (retries = 10) => {
     if (students && students[String(openId)]) {
       window.extOpen(openId);
       window.history.replaceState(null, null, window.location.pathname);
     } else if (retries > 0) {
       setTimeout(() => runOpen(retries - 1), 250);
     }
   };
   runOpen();
   return;
 }
 const qrId = toInt(urlParams.get("id"));
 if (qrId && students[String(qrId)]) { 
 addAttendance(qrId, nowDateStr()); 
 window.extOpen(qrId); 
 window.history.replaceState(null, null, window.location.pathname); 
 }
 }

 window.renderReportsPage = function() {
 let totalExpected = 0;
 let totalPaid = 0;
 let totalRemaining = 0;
 let debtors = [];

 const allStuds = Object.values(students);
 for (let i = 0; i < allStuds.length; i++) {
 let s = allStuds[i];
 if (s.name || s.paid > 0) {
 let sClass = s.className ? s.className.trim() : "";
 
    let req = 0;
    if (sClass && groupFees[sClass] !== undefined) {
       const pkg = groupFees[sClass];
       if (s.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg); // handle old format where pkg is just a number
       }
    }

 let p = s.paid || 0;
 let remain = req > 0 ? (req - p) : 0;
 if (remain < 0) remain = 0;

 totalExpected += req;
 totalPaid += p;
 totalRemaining += remain;

 if (remain > 0) {
 debtors.push({ id: s.id, name: s.name || "بدون اسم", className: (sClass && sClass !== "عام" && sClass !== "General") ? sClass : (currentLang === "ar" ? "عام" : "General"), remain: remain });
 }
 }
 }

 if ($("totalExpectedTerm")) $("totalExpectedTerm").textContent = totalExpected;
 if ($("totalPaidTerm")) $("totalPaidTerm").textContent = totalPaid;
 if ($("totalRemainingTerm")) $("totalRemainingTerm").textContent = totalRemaining;

  

  if ($("debtorsCount")) $("debtorsCount").textContent = debtors.length;

 const tb = $("debtsTable");
 if (tb) {
 const tbody = tb.querySelector("tbody");
 if (tbody) {
 tbody.innerHTML = "";
 for (let i = 0; i < debtors.length; i++) {
 let d = debtors[i];
 let gColor = getTagColor(d.className);
 const tr = document.createElement("tr");
 tr.innerHTML = `
 <td>${d.id}</td>
 <td><b>${d.name}</b></td>
 <td><span class="badge" style="background:${gColor}; border-color:${gColor}; color:#fff;">${d.className}</span></td>
 <td style="color:var(--danger); font-weight:bold;">${d.remain} ج</td>
 `;
 tr.style.cursor = "pointer";
 tr.onclick = function() { window.extOpen(d.id); };
 tbody.appendChild(tr);
 }
 if (debtors.length === 0) {
 tbody.innerHTML = `<tr><td colspan="4" class="mutedCenter">${currentLang === 'ar' ? " لا يوجد طلاب مديونين، الجميع خالص." : " No debtors found."}</td></tr>`;
 }
 }
 }
 };

 on("saveEvalBtn", "click", function() {
 evalData = {
 centerName: $("evalCenterName") ? $("evalCenterName").value.trim() : "",
 manager: $("evalManager") ? $("evalManager").value.trim() : "",
 packages: $("evalPackages") ? $("evalPackages").value.trim() : "",
 studentsCount: $("evalStudentsCount") ? $("evalStudentsCount").value.trim() : "",
 currentCourses: $("evalCurrentCourses") ? $("evalCurrentCourses").value.trim() : "",
 collabOpps: $("evalCollabOpps") ? $("evalCollabOpps").value.trim() : "",
 notes: $("evalNotes") ? $("evalNotes").value.trim() : "",
 followupPlan: $("evalFollowupPlan") ? $("evalFollowupPlan").value.trim() : "",
 needs: $("evalNeeds") ? $("evalNeeds").value.trim() : "",
 finalRate: $("evalFinalRate") ? $("evalFinalRate").value : " ممتاز"
 };
 saveAll();
 showToast(t("msg_saved"), "success");
 });

 function exportColoredReport() {
 if (typeof XLSX === "undefined") {
 return showToast(" مكتبة الإكسيل غير موجودة", "err");
 }
 const wb = XLSX.utils.book_new();

 // --- الشيت الأول: الملخص المالي التحليلي ---
 let totalExpected = 0;
 let totalPaid = 0;
 let totalRemaining = 0;
 let debtors = [];

 const allStuds = Object.values(students);
 for (let i = 0; i < allStuds.length; i++) {
 let s = allStuds[i];
 if (s.name || s.paid > 0) {
 let sClass = s.className ? s.className.trim() : "";
 
    let req = 0;
    if (sClass && groupFees[sClass] !== undefined) {
       const pkg = groupFees[sClass];
       if (s.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg); // handle old format where pkg is just a number
       }
    }

 let p = s.paid || 0;
 let remain = req > 0 ? (req - p) : 0;
 if (remain < 0) remain = 0;

 totalExpected += req;
 totalPaid += p;
 totalRemaining += remain;

 if (remain > 0) {
 debtors.push({ id: s.id, name: s.name || "بدون اسم", className: (sClass && sClass !== "عام" && sClass !== "General") ? sClass : (currentLang === "ar" ? "عام" : "General"), remain: remain });
 }
 }
 }

 const finSummaryRows = [
 ["البند", "المبلغ (جنيه)"],
 ["إجمالي المطلوب (الكامل)", totalExpected],
 ["إجمالي المحصل (الفعلي)", totalPaid],
 ["إجمالي المتبقي (المديونيات)", totalRemaining]
 ];
 const wsSummary = XLSX.utils.aoa_to_sheet(finSummaryRows);
 wsSummary["!cols"] = [{ wch: 30 }, { wch: 20 }];
 
 // تنسيق الألوان للملخص المالي (متوافق مع xlsx-js-style)
 if (wsSummary["A1"]) wsSummary["A1"].s = { fill: { fgColor: { rgb: "2B3648" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center" } };
 if (wsSummary["B1"]) wsSummary["B1"].s = { fill: { fgColor: { rgb: "2B3648" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center" } };
 
 if (wsSummary["A2"]) wsSummary["A2"].s = { font: { bold: true }, alignment: { horizontal: "right" } };
 if (wsSummary["B2"]) wsSummary["B2"].s = { font: { bold: true, color: { rgb: "2F6BFF" } }, alignment: { horizontal: "center" } };

 if (wsSummary["A3"]) wsSummary["A3"].s = { font: { bold: true }, alignment: { horizontal: "right" } };
 if (wsSummary["B3"]) wsSummary["B3"].s = { fill: { fgColor: { rgb: "D4EDDA" } }, font: { bold: true, color: { rgb: "155724" } }, alignment: { horizontal: "center" } };

 if (wsSummary["A4"]) wsSummary["A4"].s = { font: { bold: true }, alignment: { horizontal: "right" } };
 if (wsSummary["B4"]) wsSummary["B4"].s = { fill: { fgColor: { rgb: "F8D7DA" } }, font: { bold: true, color: { rgb: "721C24" } }, alignment: { horizontal: "center" } };

 XLSX.utils.book_append_sheet(wb, wsSummary, "الملخص المالي");

 // --- الشيت الثاني: قائمة الطلاب المديونين ---
 const debtRows = [["كود الطالب", "اسم الطالب", "الباقة", "المبلغ المتبقي عليه"]];
 for (let i = 0; i < debtors.length; i++) {
 debtRows.push([debtors[i].id, debtors[i].name, debtors[i].className, debtors[i].remain]);
 }
 const wsDebts = XLSX.utils.aoa_to_sheet(debtRows);
 wsDebts["!cols"] = [{ wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 25 }];
 
 // تنسيق عناوين قائمة المديونيات
 const debtHeaders = ["A1", "B1", "C1", "D1"];
 for (let h = 0; h < debtHeaders.length; h++) {
 if (wsDebts[debtHeaders[h]]) wsDebts[debtHeaders[h]].s = { fill: { fgColor: { rgb: "721C24" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center" } };
 }
 for (let r = 2; r <= debtRows.length; r++) {
 if (wsDebts["A" + r]) wsDebts["A" + r].s = { alignment: { horizontal: "center" } };
 if (wsDebts["B" + r]) wsDebts["B" + r].s = { font: { bold: true }, alignment: { horizontal: "right" } };
 if (wsDebts["C" + r]) wsDebts["C" + r].s = { alignment: { horizontal: "center" } };
 if (wsDebts["D" + r]) wsDebts["D" + r].s = { fill: { fgColor: { rgb: "F8D7DA" } }, font: { bold: true, color: { rgb: "721C24" } }, alignment: { horizontal: "center" } };
 }
 XLSX.utils.book_append_sheet(wb, wsDebts, "قائمة المديونيات");

 // --- الشيت الثالث: تقرير التقييم الإداري ---
 const evalRows = [
 ["عنصر التقييم", "البيان / التفاصيل"],
 ["اسم السنتر", evalData.centerName || ""],
 ["المسؤول", evalData.manager || ""],
 ["الباقات", evalData.packages || ""],
 ["عدد الطلبة", evalData.studentsCount || ""],
 ["الكورسات الحالية", evalData.currentCourses || ""],
 ["فرص التعاون", evalData.collabOpps || ""],
 ["ملاحظات", evalData.notes || ""],
 ["خطة المتابعة", evalData.followupPlan || ""],
 ["احتياجات السنتر أو المقترحات", evalData.needs || ""],
 ["التقييم النهائي", evalData.finalRate || ""]
 ];
 const wsEval = XLSX.utils.aoa_to_sheet(evalRows);
 wsEval["!cols"] = [{ wch: 30 }, { wch: 50 }];
 
 if (wsEval["A1"]) wsEval["A1"].s = { fill: { fgColor: { rgb: "1F2937" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center" } };
 if (wsEval["B1"]) wsEval["B1"].s = { fill: { fgColor: { rgb: "1F2937" } }, font: { color: { rgb: "FFFFFF" }, bold: true }, alignment: { horizontal: "center" } };
 
 for (let r = 2; r <= evalRows.length; r++) {
 if (wsEval["A" + r]) wsEval["A" + r].s = { font: { bold: true }, alignment: { horizontal: "right" } };
 if (wsEval["B" + r]) wsEval["B" + r].s = { alignment: { horizontal: "right", wrapText: true } };
 }
 XLSX.utils.book_append_sheet(wb, wsEval, "التقييم الإداري");

 XLSX.writeFile(wb, `تقرير_السنتر_التحليلي_${nowDateStr()}.xlsx`);
 showToast(currentLang === 'ar' ? "تم تصدير التقرير الملون بنجاح " : "Colored Report Exported ", "success");
 }

 on("exportReportExcelBtn", "click", exportColoredReport);
 on("exportReportExcelBtnBottom", "click", exportColoredReport);

 // Tabs Listeners
 on("btnTabHome", "click", function() { window.switchTab('Home'); });
 on("btnTabStudents", "click", function() { window.switchTab('Students'); renderList(true); });
 on("btnTabSessionStudents", "click", function() { window.switchTab('SessionStudents'); if (typeof setupSessionPaymentPills === "function") setupSessionPaymentPills(); renderSessionStudentsList(nowDateStr()); if($("sessFilterDate")) $("sessFilterDate").value = nowDateStr(); });
 on("btnTabRevenue", "click", function() { window.switchTab('Revenue'); renderCharts(); updateFinanceSummary(); });
 on("btnTabReports", "click", function() { window.switchTab('Reports'); renderReportsPage(); });
 on("btnTabPackages", "click", function() {
    if (currentUserRole !== "admin" && (!currentPermissions || !currentPermissions.can_manage_packages)) {
      showToast("عفواً، تعديل الباقات والأسعار مقفل من المدير ", "err");
      return;
    }
    window.switchTab('Packages');
    renderGroupFeesModal();
  });
  on("btnTabAdmin", "click", function() { window.switchTab('Admin'); if (typeof renderManagerPackagesCard === "function") renderManagerPackagesCard(); });
 on("btnTabSyllabus", "click", function() { window.switchTab('Syllabus'); renderSyllabus(); });
 on("btnTabBooklets", "click", function() { window.switchTab('Booklets'); renderBookletsStock(); });
 on("btnTabMarketing", "click", function() {
   if (typeof AssistantSounds !== "undefined") AssistantSounds.marketingPulse();
   window.switchTab('Marketing');
   populateMarketingGroups();
   filterCampaignTarget();
 });

 
// ========================================================
// SESSION STUDENTS (طلاب الحصة) ADVANCED ENGINE
// ========================================================
window.getAllSessionStudents = function() {
  const list = [];
  const seen = new Set();
  const dates = Object.keys(sessionStudentsByDate || {}).sort().reverse();
  dates.forEach(d => {
    const arr = sessionStudentsByDate[d] || [];
    arr.forEach((it, idx) => {
      const key = (it.name || '').trim().toLowerCase() + '___' + (it.phone || '').trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          ...it,
          date: d,
          originalIndex: idx
        });
      }
    });
  });
  return list;
};

window.getUniqueSessionStudentsCount = function() {
  return window.getAllSessionStudents().length;
};

window.getTotalStudentsCombinedCount = function() {
  const regularCount = Object.values(students || {}).filter(s => (s && s.id && (s.name || (Number(s.paid) || 0) > 0))).length;
  const sessionCount = window.getUniqueSessionStudentsCount();
  return regularCount + sessionCount;
};

function setupSessionPaymentPills() {
  const pills = document.querySelectorAll('.sess-pay-pill');
  const hiddenSelect = document.getElementById('sessStMethod');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.onclick = function(e) {
      e.preventDefault();
      const m = this.getAttribute('data-method');
      if (hiddenSelect) hiddenSelect.value = m;

      pills.forEach(p => {
        p.classList.remove('active');
        p.style.border = '1.5px solid var(--border)';
        p.style.background = 'var(--bg-surface)';
        p.style.color = 'var(--text-secondary)';
        p.style.boxShadow = 'none';
      });

      this.classList.add('active');
      if (m === 'cash') {
        this.style.border = '2px solid #10b981';
        this.style.background = 'rgba(16,185,129,0.14)';
        this.style.color = '#10b981';
        this.style.boxShadow = '0 2px 8px rgba(16,185,129,0.2)';
      } else if (m === 'instapay') {
        this.style.border = '2px solid #7c3aed';
        this.style.background = 'rgba(124, 58, 237, 0.14)';
        this.style.color = '#7c3aed';
        this.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.2)';
      } else if (m === 'wallet') {
        this.style.border = '2px solid #ef4444';
        this.style.background = 'rgba(239,68,68,0.14)';
        this.style.color = '#ef4444';
        this.style.boxShadow = '0 2px 8px rgba(239,68,68,0.2)';
      }
    };
  });
}

// Modal for viewing session student details
window.openSessionStudentModal = function(item) {
  if (!item) return;
  const modal = document.getElementById('sessionStudentDetailsModal');
  if (!modal) return;

  const isAr = (currentLang === 'ar');
  const currSuffix = isAr ? ' ج' : ' EGP';

  if (document.getElementById('modalSessStName')) document.getElementById('modalSessStName').textContent = item.name || '—';
  if (document.getElementById('modalSessStPhone')) document.getElementById('modalSessStPhone').textContent = item.phone || (isAr ? 'غير مسجل' : 'Not registered');
  if (document.getElementById('modalSessStClass')) document.getElementById('modalSessStClass').textContent = item.className || (isAr ? 'حصة فردية' : 'Single Session');
  if (document.getElementById('modalSessStAmount')) document.getElementById('modalSessStAmount').textContent = (item.amount || 0) + currSuffix;

  // Method Badge
  const methodBadge = document.getElementById('modalSessStMethodBadge');
  if (methodBadge) {
    const m = item.method || 'cash';
    if (m === 'instapay') {
      methodBadge.textContent = isAr ? 'إنستاباي' : 'InstaPay';
      methodBadge.style.background = 'rgba(124,58,237,0.15)';
      methodBadge.style.color = '#7c3aed';
      methodBadge.style.borderColor = 'rgba(124,58,237,0.3)';
    } else if (m === 'wallet') {
      methodBadge.textContent = isAr ? 'فودافون كاش' : 'Vodafone Cash';
      methodBadge.style.background = 'rgba(239,68,68,0.15)';
      methodBadge.style.color = '#ef4444';
      methodBadge.style.borderColor = 'rgba(239,68,68,0.3)';
    } else {
      methodBadge.textContent = isAr ? 'كاش (نقدي)' : 'Cash';
      methodBadge.style.background = 'rgba(16,185,129,0.15)';
      methodBadge.style.color = '#10b981';
      methodBadge.style.borderColor = 'rgba(16,185,129,0.3)';
    }
  }

  if (document.getElementById('modalSessStTime')) {
    document.getElementById('modalSessStTime').textContent = (item.date || '') + ' ' + (item.timestamp || '');
  }

  // WhatsApp Button
  const waBtn = document.getElementById('modalSessStWaBtn');
  if (waBtn) {
    if (item.phone) {
      waBtn.style.display = 'inline-flex';
      waBtn.onclick = () => window.open(`https://wa.me/20${item.phone}`, '_blank');
    } else {
      waBtn.style.display = 'none';
    }
  }

  // Upgrade Button: Pre-fill into new student form
  const upgradeBtn = document.getElementById('modalSessUpgradeBtn');
  if (upgradeBtn) {
    upgradeBtn.onclick = function() {
      modal.classList.add('hidden');
      if (typeof window.switchTab === 'function') window.switchTab('Students');
      setTimeout(() => {
        const addNewBtn = document.getElementById('addNewBtn');
        if (addNewBtn) addNewBtn.click();
        setTimeout(() => {
          if (document.getElementById('stName')) document.getElementById('stName').value = item.name || '';
          if (document.getElementById('stPhone')) document.getElementById('stPhone').value = item.phone || '';
          if (document.getElementById('stClass') && item.className && item.className !== 'حصة فردية') {
            document.getElementById('stClass').value = item.className;
          }
          if (typeof showToast === 'function') {
            showToast(isAr ? 'تم تجهيز استمارة تسجيل الطالب، يرجى إسناد كود الكارت ID وحفظ البيانات' : 'Student form ready. Please assign card ID and save.', 'info');
          }
        }, 150);
      }, 100);
    };
  }

  modal.classList.remove('hidden');
};

// === SESSION STUDENTS FUNCTIONS ===
 window.renderSessionStudentsList = function(d) {
 const slist = $("sessStudentsList"); if(!slist) return;
 let arr = sessionStudentsByDate[d] || [];
 let count = arr.length;
 let totalRev = 0;
 let h = "";
 for(let i=0; i<arr.length; i++) {
 let item = arr[i];
 totalRev += toInt(item.amount);
 let mBadge = item.method === "instapay" ? " إنستاباي" : (item.method === "wallet" ? " فودافون كاش/محفظة" : " كاش");
 let badgeBg = item.method === "instapay" ? "#e3f2fd" : (item.method === "wallet" ? "#e8f5e9" : "#eef2f5");
 let badgeColor = item.method === "instapay" ? "#0288d1" : (item.method === "wallet" ? "#2e7d32" : "#333");

 h += `
 <div class="item flexBetween" style="margin-bottom:10px; padding:12px; background:var(--bg-surface); border:1px solid var(--border); border-radius:8px;">
 <div>
 <b>${item.name}</b> <span class="badge" style="background:#eee; color:#333;">${(item.className && item.className !== "عام" && item.className !== "General") ? item.className : (currentLang === "ar" ? "عام" : "General")}</span>
 <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-size:0.8em; margin-inline-start:5px;">${mBadge}</span>
 <div style="font-size:0.8em; color:var(--text-secondary); margin-top:4px;"> ${item.timestamp || ""} ${item.phone ? `| ${item.phone}` : ""}</div>
 </div>
 <div class="row" style="width:auto; gap:10px;">
 const isAr = (currentLang === "ar");
 const currencySuffix = isAr ? " ج" : " EGP";
 <span style="color:var(--success); font-weight:bold; font-size:1.1em;">+ ${item.amount} ${currencySuffix}</span>
 ${item.phone ? `<button class="btn success smallBtn iconOnly" title="مراسلة واتساب" onclick="window.open('https://wa.me/20${item.phone}', '_blank')"><i class="fa-brands fa-whatsapp"></i></button>` : ""}
 <button class="btn danger smallBtn iconOnly delete-sess-btn" data-date="${d}" data-index="${i}" title="حذف وإلغاء الدفعة"><i class="fa-solid fa-trash-can"></i></button>
 </div>
 </div>`;
 }

 const isArSess = (currentLang === "ar");
 if(count === 0) h = `<div class="mutedCenter" data-i18n="sess_no_students">${isArSess ? "لا يوجد طلاب مسجلين بالحصة لهذا اليوم" : "No students registered for this session today"}</div>`;
 slist.innerHTML = h;

 if($("sessCountBadge")) $("sessCountBadge").textContent = count;
 if($("sessRevenueBadge")) $("sessRevenueBadge").textContent = totalRev;
 if($("sessRevenueCurr")) $("sessRevenueCurr").textContent = (currentLang === "ar" ? "ج" : "EGP");

 document.querySelectorAll(".delete-sess-btn").forEach(btn => {
 btn.onclick = function() {
   let dt = this.getAttribute("data-date");
   let idx = toInt(this.getAttribute("data-index"));
   if (typeof Swal !== 'undefined') {
     Swal.fire({
       title: "إلغاء الحضور المالي",
       text: "هل أنت متأكد من حذف وإلغاء حضور هذا الطالب المالي لليوم؟",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#ef4444",
       cancelButtonColor: "#64748b",
       confirmButtonText: "نعم، إلغاء الحضور",
       cancelButtonText: "تراجع"
     }).then(res => {
       if (res.isConfirmed) {
         let delItem = sessionStudentsByDate[dt][idx];
         revenueByDate[dt] = Math.max(0, (revenueByDate[dt] || 0) - toInt(delItem.amount));
         sessionStudentsByDate[dt].splice(idx, 1);
         saveAll();
         renderSessionStudentsList(dt);
         showToast("تم إلغاء تسجيل الحضور والمبلغ بنجاح", "success");
       }
     });
   } else {
     let delItem = sessionStudentsByDate[dt][idx];
     revenueByDate[dt] = Math.max(0, (revenueByDate[dt] || 0) - toInt(delItem.amount));
     sessionStudentsByDate[dt].splice(idx, 1);
     saveAll();
     renderSessionStudentsList(dt);
     showToast("تم إلغاء تسجيل الحضور والمبلغ", "success");
   }
 };
 });
 };

 on("saveSessionStudentBtn", "click", async function() {
 let name = $("sessStName") ? $("sessStName").value.trim() : "";
 let phone = $("sessStPhone") ? $("sessStPhone").value.trim() : "";
 let className = $("sessStClass") ? $("sessStClass").value : "حصة فردية";
 let amount = $("sessStAmount") ? toInt($("sessStAmount").value) : 0;
 let method = $("sessStMethod") ? $("sessStMethod").value : "cash";

 if(!name || amount <= 0) {
   showToast("يرجى إدخال اسم الطالب والمبلغ بشكل صحيح", "warning");
   return;
 }

 // Check subscription limit: session students count towards max_students
 const maxSt = window.SUBSCRIPTION?.maxStudents;
 if (maxSt) {
   const curCombined = (typeof window.getTotalStudentsCombinedCount === "function") ? window.getTotalStudentsCombinedCount() : 0;
   if (curCombined >= maxSt) {
     if (typeof Swal !== "undefined") {
       Swal.fire({
         icon: "warning",
         title: "تم الوصول للحد الأقصى للطلاب",
         text: `باقتكم الحالية تسمح بحد أقصى ${maxSt} طالب (بما فيهم طلاب الحصة). يرجى ترقية الاشتراك من لوحة الإدارة.`,
         confirmButtonText: "حسناً",
         confirmButtonColor: "#2563eb"
       });
     } else {
       showToast(`تم الوصول للحد الأقصى للطلاب (${maxSt})`, "err");
     }
     return;
   }
 }

 const today = nowDateStr();
 if(!sessionStudentsByDate[today]) sessionStudentsByDate[today] = [];

 let record = {
   id: Date.now(),
   name: name,
   phone: phone,
   className: className,
   amount: amount,
   method: method,
   timestamp: new Date().toLocaleTimeString()
 };

 sessionStudentsByDate[today].push(record);
 revenueByDate[today] = (revenueByDate[today] || 0) + amount;

 // Insert into Supabase session_students table
 if (window.supabaseClient) {
   try {
     window.supabaseClient.from('session_students').insert([{
       date: today,
       student_name: name,
       phone: phone,
       class_name: className,
       paid: amount
     }]).then(({ error }) => {
       if (error) console.warn('[Supabase session_students insert error]:', error);
     });
   } catch(e) {
     console.warn('[session_students cloud insert]:', e);
   }
 }

 await saveAll();
 renderSessionStudentsList(today);
 if (typeof updateTopStats === "function") updateTopStats();
 if (typeof renderList === "function") renderList(false);
 showToast("تم تسجيل حضور الحصة وتحصيل المبلغ بنجاح", "success");
 if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncSuccess(); else playSound("pop");

 if($("sessStName")) $("sessStName").value = "";
 if($("sessStPhone")) $("sessStPhone").value = "";
 if($("sessStAmount")) $("sessStAmount").value = "";

 if(phone) {
   let centerMgr = evalData.manager || "إدارة السنتر";
   let mName = method === "instapay" ? "إنستاباي" : (method === "wallet" ? "فودافون كاش" : "كاش");
   let msg = `مرحباً ${name}،\r\nتم تسجيل حضورك بنجاح لحصة اليوم (${className})\r\nالمبلغ المدفوع: ${amount} ج (${mName}).\r\n\r\nمع تحيات: أ/ ${centerMgr}`;
   window.open(`https://wa.me/20${phone}?text=${encodeURIComponent(msg)}`, '_blank');
 }
 });

 on("sessFilterDate", "change", function(e) {
 renderSessionStudentsList(e.target.value);
 });

 on("openRevenueModalBtn", "click", function(e) {
 if(isRevHidden) return;
 if (typeof AssistantSounds !== "undefined") AssistantSounds.revenueOpen(); 
 const today = nowDateStr();
 let html = "";
 let count = 0;
 
 const allStuds = Object.values(students);
 for(let i=0; i<allStuds.length; i++) {
 let s = allStuds[i];
 if(s.payments && s.payments.length > 0) {
 for(let j=0; j<s.payments.length; j++) {
 if(s.payments[j].date === today) {
 let sClass = (s.className && s.className !== "عام" && s.className !== "General") ? s.className.trim() : (currentLang === "ar" ? "عام" : "General");
 
    let req = 0;
    if (sClass && groupFees[sClass] !== undefined) {
       const pkg = groupFees[sClass];
       if (s.paymentPlan === "installments" && pkg.hasInstallments) {
           req = toInt(pkg.installmentPrice) || 0;
       } else {
           req = toInt(pkg.price || pkg); // handle old format where pkg is just a number
       }
    }

 let remain = req > 0 ? (req - s.paid) : 0;
 if(remain < 0) remain = 0;
 
 let m = s.payments[j].method || "cash";
 let mBadge = " كاش";
 let badgeBg = "#eef2f5"; let badgeColor = "#333";
 if (m === "instapay") { mBadge = " إنستاباي"; badgeBg = "#e3f2fd"; badgeColor = "#0288d1"; }
 if (m === "wallet") { mBadge = " فودافون كاش/محفظة"; badgeBg = "#e8f5e9"; badgeColor = "#2e7d32"; }

 html += `
 <div class="item flexBetween" style="margin-bottom:8px; cursor:pointer;" onclick="document.getElementById('revenueModal').classList.add('hidden'); window.extOpen('${s.id}')">
 <div>
 <b>${s.name}</b> (#${s.id}) <span class="badge" style="background:#eee; color:#333;">${sClass}</span>
 <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-size:0.8em; margin-inline-start:5px;">${mBadge}</span>
 </div>
 <div style="text-align:left;">
 <span style="color:var(--success); font-weight:bold;">+ ${s.payments[j].amount} ج</span><br>
 <span style="font-size:11px; color:#666;">المتبقي: ${remain} ج</span>
 </div>
 </div>`;
 count++;
 }
 }
 }
 }

 let sArr = sessionStudentsByDate[today] || [];
 for(let i=0; i<sArr.length; i++) {
 let item = sArr[i];
 let mBadge = item.method === "instapay" ? " إنستاباي" : (item.method === "wallet" ? " فودافون كاش/محفظة" : " كاش");
 let badgeBg = item.method === "instapay" ? "#e3f2fd" : (item.method === "wallet" ? "#e8f5e9" : "#eef2f5");
 let badgeColor = item.method === "instapay" ? "#0288d1" : (item.method === "wallet" ? "#2e7d32" : "#333");

 html += `
 <div class="item flexBetween" style="margin-bottom:8px; cursor:pointer;" onclick="document.getElementById('revenueModal').classList.add('hidden'); window.switchTab('SessionStudents'); if($('sessFilterDate')) $('sessFilterDate').value='${today}'; renderSessionStudentsList('${today}');">
 <div>
 <b>${item.name}</b> <span class="badge" style="background:#fff3e0; color:#e65100;">طالب حصة </span> <span class="badge" style="background:#eee; color:#333;">${(item.className && item.className !== "عام" && item.className !== "General") ? item.className : (currentLang === "ar" ? "عام" : "General")}</span>
 <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-size:0.8em; margin-inline-start:5px;">${mBadge}</span>
 </div>
 <div style="text-align:left;">
 <span style="color:var(--success); font-weight:bold;">+ ${item.amount} ج</span><br>
 <span style="font-size:11px; color:#666;">دفع فوري</span>
 </div>
 </div>`;
 count++;
 }
 
 if(count === 0) html = `<div class="mutedCenter">${t("txt_no_rev")}</div>`;
 
 
  

  if($("revenueModalBody")) $("revenueModalBody").innerHTML = html;
 if($("revenueModal")) $("revenueModal").classList.remove("hidden");
 });

 // === GLOBAL BARCODE SCANNER LISTENER ===
 let barcodeBuffer = "";
 let barcodeTimer = null;
 document.addEventListener("keydown", function(e) {
 const activeEl = document.activeElement;
 if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT")) {
 return;
 }
 if (e.key === "Enter") {
 if (barcodeBuffer.length > 0) {
 let scannedId = toInt(barcodeBuffer);
 barcodeBuffer = "";
 clearTimeout(barcodeTimer);
 if (scannedId && students[String(scannedId)]) {
 window.switchTab('Home');
 let res = addAttendance(scannedId, nowDateStr());
 if (res.ok) { if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncSuccess(); else playSound("pop"); } else { if (typeof AssistantSounds !== "undefined") AssistantSounds.error(); else playSound("error"); }
 showToast(res.msg, res.ok ? "success" : "warning");
 updateStudentUI(scannedId);
 updateTopStats();
 const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
 if(card) {
   setTimeout(() => {
     card.scrollIntoView({behavior: "smooth", block: "start"});
   }, 120);
 }
 } else if (scannedId) {
 showToast("الطالب غير مسجل: " + scannedId, "err");
 showFullscreenFeedback(false, false);
 }
 }
 } else if (!isNaN(e.key) && e.key.trim() !== "") {
 barcodeBuffer += e.key;
 clearTimeout(barcodeTimer);
 barcodeTimer = setTimeout(() => { barcodeBuffer = ""; }, 100);
 }
 });

 // === SIDEBAR & THEME TOGGLE LISTENERS ===
 on("topbarThemeToggle", "click", function() {
 var current = localStorage.getItem(K_THEME) || "dark";
 switchThemeWithAnimation(current === "dark" ? "light" : "dark");
 });

 on("sidebarCollapseBtn", "click", function() {
 var shell = $("appBox");
 if(shell) shell.classList.toggle("sidebar-collapsed");
 });

 on("mobileSidebarToggle", "click", function() {
 var sidebar = $("sidebarNav");
 if(sidebar && sidebar.classList.contains("mobile-open")) {
 closeMobileSidebar(false);
 } else {
 openMobileSidebar();
 }
 });

 on("sidebarOverlay", "click", function() {
 closeMobileSidebar(false);
 });

 // === SIDEBAR ACCORDION LOGIC ===
 window.toggleNavGroup = function(btn) {
 const group = btn.closest('.nav-group');
 if (group) {
 const isCollapsed = group.classList.contains('collapsed');
 document.querySelectorAll('.nav-group').forEach(g => g.classList.add('collapsed'));
 if (isCollapsed) {
 group.classList.remove('collapsed');
 }
 }
 };

 // Auto-expand the accordion group containing the active tab on initial load
 const activeNavItem = document.querySelector('.sidebar-menu .nav-item.active');
 if (activeNavItem) {
 const activeGroup = activeNavItem.closest('.nav-group');
 if (activeGroup) {
 document.querySelectorAll('.nav-group').forEach(g => g.classList.add('collapsed'));
 activeGroup.classList.remove('collapsed');
 }
 }

 // ==========================================
 // === BOOKLETS STOCK MANAGEMENT ===
 // ==========================================
 window.renderBookletsStock = function() {
 const blist = $("bookletsStockList"); if(!blist) return;
 let keys = Object.keys(bookletsStock);
 let totalTypes = keys.length;
 let totalReceived = 0;
 let totalSold = 0;
 let totalRemain = 0;
 let totalRevenue = 0;
 
 let h = "";
 for(let i = 0; i < keys.length; i++) {
 let id = keys[i];
 let b = bookletsStock[id];
 let qty = toInt(b.qty);
 let price = toInt(b.price);
 let sold = toInt(b.sold);
 let remain = qty - sold;
 let rev = sold * price;
 
 totalReceived += qty;
 totalSold += sold;
 totalRemain += remain;
 totalRevenue += rev;
 
 h += `
 <div class="card item-card flexBetween wrap" style="background: var(--bg-inset); border: 1px solid var(--border); padding: 18px; border-radius: 10px; margin-bottom: 12px; gap: 15px;">
 <div style="flex: 1; min-width: 220px;">
 <div style="display:flex; align-items:center; gap:8px;">
 <span style="font-size:1.5em;"></span>
 <h4 style="margin:0; color:var(--text); font-size:1.2em;">${b.name}</h4>
 </div>
 <div style="font-size:0.9em; color:var(--text-secondary); margin-top:8px; display:flex; gap:15px; flex-wrap:wrap;">
 <span>الكمية الكلية: <b>${qty}</b></span>
 <span>سعر النسخة: <b>${price} ج</b></span>
 <span style="color:#10b981;">المباع: <b>${sold}</b></span>
 <span style="color:#f59e0b;">المخزون المتبقي: <b>${remain}</b></span>
 </div>
 </div>
 <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
 <div style="background:var(--bg-surface); padding:8px 15px; border-radius:8px; border:1px solid var(--border); text-align:center;">
 <span style="font-size:0.8em; color:var(--text-secondary); display:block;">عائد المذكرة</span>
 <strong style="color:var(--primary); font-size:1.2em;">${rev} ج</strong>
 </div>
 <button class="btn success" style="padding:10px 18px; font-weight:bold; font-size:1.05em; display:flex; align-items:center; gap:5px;" onclick="sellBookletCopy('${id}')"><i class="fa-solid fa-cart-shopping"></i> 
 بيع نسخة (+1)
 </button>
 <button class="btn warning smallBtn" title="إرجاع نسخة (-1)" onclick="returnBookletCopy('${id}')"><i class="fa-solid fa-rotate-left"></i></button>
 <button class="btn primary smallBtn" title="تعديل العدد الكلي المستلم" onclick="editBookletQty('${id}')"><i class="fa-solid fa-pen-to-square"></i></button>
 <button class="btn danger smallBtn" title="حذف المذكرة" onclick="deleteBooklet('${id}')"><i class="fa-solid fa-trash-can"></i></button>
 </div>
 </div>`;
 }
 
 if (keys.length === 0) {
 const isArBkl = (currentLang === "ar");
  h = `<div class="mutedCenter" style="padding: 30px;">${isArBkl ? "لا توجد مذكرات أو ورق مسجل بالمخزون حالياً .. أضف مذكرة جديدة بالترويسة أعلاه" : "No booklets or sheets currently in stock. Add a new booklet using the form above."}</div>`;
 }
 
 blist.innerHTML = h;
 
 if($("statTotalBookletTypes")) $("statTotalBookletTypes").textContent = totalTypes;
 if($("statTotalCopiesReceived")) $("statTotalCopiesReceived").textContent = totalReceived;
 if($("statTotalCopiesSold")) $("statTotalCopiesSold").textContent = totalSold;
 if($("statTotalCopiesRemain")) $("statTotalCopiesRemain").textContent = totalRemain;
 if($("statTotalBookletsRevenue")) $("statTotalBookletsRevenue").textContent = totalRevenue + " ج";
 };

 on("btnSaveBooklet", "click", function() {
 let name = $("bookletNameInp") ? $("bookletNameInp").value.trim() : "";
 let qty = $("bookletQtyInp") ? toInt($("bookletQtyInp").value) : 0;
 let price = $("bookletPriceInp") ? toInt($("bookletPriceInp").value) : 0;
 
 if (!name) { showToast("يرجى إدخال اسم المذكرة أو الورق", "err"); return; }
 if (qty <= 0) { showToast("يرجى إدخال عدد النسخ المستلمة", "err"); return; }
 
 let id = "b_" + Date.now();
 bookletsStock[id] = { name: name, qty: qty, price: price, sold: 0 };
 saveAll();
 renderBookletsStock();
 
 if($("bookletNameInp")) $("bookletNameInp").value = "";
 if($("bookletQtyInp")) $("bookletQtyInp").value = "";
 if($("bookletPriceInp")) $("bookletPriceInp").value = "";
 showToast("تم استلام وإضافة المذكرة للمخزون بنجاح ", "success");
 if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceScan(); else playSound("beep");
 });

 window.sellBookletCopy = function(id) {
 if (!bookletsStock[id]) return;
 let b = bookletsStock[id];
 if (b.sold >= b.qty) {
 showToast(" انتهى مخزون هذه المذكرة، يرجى تعديل العدد الكلي إذا قمت بطباعة نسخ إضافية.", "err");
 if (typeof AssistantSounds !== "undefined") AssistantSounds.error(); else playSound("error");
 return;
 }
 b.sold += 1;
 
 // تسجيل العائد في إيرادات اليوم التلقائية بالخزينة كاش
 let today = nowDateStr();
 revenueByDate[today] = (revenueByDate[today] || 0) + b.price;
 
 saveAll();
 renderBookletsStock();
 showToast(`تم بيع نسخة من ${b.name} وإضافة ${b.price} ج للخزينة كاش `, "success");
 if (typeof AssistantSounds !== "undefined") AssistantSounds.attendanceScan(); else playSound("beep");
 };

 window.returnBookletCopy = function(id) {
 if (!bookletsStock[id]) return;
 let b = bookletsStock[id];
 if (b.sold <= 0) {
 showToast("لم يتم بيع أي نسخة من هذه المذكرة لإرجاعها", "err");
 return;
 }
 b.sold -= 1;
 saveAll();
 renderBookletsStock();
 showToast(`تم إرجاع نسخة من ${b.name} بنجاح `, "warning");
 };

 window.editBookletQty = function(id) {
   if (!bookletsStock[id]) return;
   let b = bookletsStock[id];
   if (typeof Swal !== 'undefined') {
     Swal.fire({
       title: "تعديل رصيد المذكرة",
       text: `أدخل العدد الكلي المستلم لمذكرة (${b.name}):`,
       input: "number",
       inputValue: b.qty,
       showCancelButton: true,
       confirmButtonText: "حفظ التعديل",
       cancelButtonText: "إلغاء",
       confirmButtonColor: "#2563eb",
       inputValidator: (value) => {
         if (value === "" || isNaN(value) || parseInt(value) < 0) {
           return "يرجى إدخال عدد صحيح موجب";
         }
       }
     }).then(res => {
       if (res.isConfirmed && res.value !== undefined && res.value !== "") {
         let q = toInt(res.value);
         if (q >= 0) {
           b.qty = q;
           saveAll();
           renderBookletsStock();
           showToast("تم تحديث العدد الكلي بنجاح", "success");
         }
       }
     });
   }
 };

 window.deleteBooklet = function(id) {
   if (!bookletsStock[id]) return;
   let b = bookletsStock[id];
   if (typeof Swal !== 'undefined') {
     Swal.fire({
       title: "حذف مذكرة من الجرد",
       text: `هل أنت متأكد من حذف مذكرة (${b.name}) من قائمة الجرد؟`,
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#ef4444",
       cancelButtonColor: "#64748b",
       confirmButtonText: "نعم، حذف المذكرة",
       cancelButtonText: "إلغاء"
     }).then(res => {
       if (res.isConfirmed) {
         delete bookletsStock[id];
         saveAll();
         renderBookletsStock();
         showToast("تم حذف المذكرة من قائمة المخزون", "success");
       }
     });
   } else {
     delete bookletsStock[id];
     saveAll();
     renderBookletsStock();
     showToast("تم حذف المذكرة من قائمة المخزون", "success");
   }
 };

 // ==========================================
  // === SMART CENTER NOTEBOOK CONTROLLER ===
  // ==========================================
  let _notebookSaveDebounce = null;

  window.updateNotebookCounters = function() {
    const nb = $("centerNotebook");
    const counterEl = $("notebookWordCountBadge") || $("notebookWordCharCount");
    if (!nb || !counterEl) return;
    const text = nb.value || "";
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const isAr = (currentLang === "ar");
    counterEl.textContent = isAr ? (`${words} كلمة | ${chars} حرف`) : (`${words} words | ${chars} chars`);
  };

  window.setNotebookSyncStatus = function(state, text) {
    const badge = $("notebookSyncBadge");
    if (!badge) return;
    const isAr = (currentLang === 'ar');
    if (state === 'saving') {
      badge.className = 'badge notebook-sync-badge sync-saving';
      badge.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> <span id="notebookSyncStatusText">' + (text || (isAr ? 'جاري الحفظ...' : 'Saving...')) + '</span>';
    } else if (state === 'synced') {
      badge.className = 'badge notebook-sync-badge sync-online';
      badge.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> <span id="notebookSyncStatusText">' + (text || (isAr ? 'محفوظ بالسحابة' : 'Saved to Cloud')) + '</span>';
    } else {
      badge.className = 'badge notebook-sync-badge';
      badge.innerHTML = '<i class="fa-regular fa-clock"></i> <span id="notebookSyncStatusText">' + (text || (isAr ? 'جاهز' : 'Ready')) + '</span>';
    }
  };

  window.saveNotebookContent = async function(content, showNotification = false) {
    try {
      window.setNotebookSyncStatus('saving');
      centerNotebookContent = content;
      localStorage.setItem(K_NOTEBOOK, content);
      await secureSave(K_NOTEBOOK, content);

      if (window.supabaseClient && navigator.onLine) {
        let existingConfig = {};
        try {
          const { data: cur } = await window.supabaseClient.from('settings').select('config').eq('id', 1).maybeSingle();
          if (cur && cur.config) existingConfig = cur.config;
        } catch (e) {
          console.warn('[saveNotebookContent] fetch config warning:', e);
        }
        existingConfig.center_notebook = content;
        await window.supabaseClient.from('settings').update({
          config: existingConfig,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      }

      window.setNotebookSyncStatus('synced');
      const timeStr = new Date().toLocaleTimeString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      const lastSavedEl = $("notebookLastSavedTime");
      if (lastSavedEl) {
        lastSavedEl.textContent = (currentLang === 'ar' ? 'آخر حفظ سحابي: ' : 'Cloud synced at: ') + timeStr;
      }
      if (showNotification) {
        showToast(currentLang === 'ar' ? "تم حفظ ومزامنة المفكرة بالسحابة بنجاح" : "Notebook saved and synced to cloud successfully", "success");
      }
    } catch (err) {
      console.error("[saveNotebookContent] Error:", err);
      window.setNotebookSyncStatus('idle', currentLang === 'ar' ? "محفوظ محلياً" : "Saved locally");
      if (showNotification) {
        showToast(currentLang === 'ar' ? "تم الحفظ محلياً (غير متصل بالسحابة)" : "Saved locally (offline)", "warning");
      }
    }
  };

  window.initCenterNotebook = function() {
    const nb = $("centerNotebook");
    if (!nb) return;

    nb.value = centerNotebookContent || localStorage.getItem(K_NOTEBOOK) || "";
    window.updateNotebookCounters();
    window.setNotebookSyncStatus('synced');

    nb.addEventListener("input", function() {
      window.updateNotebookCounters();
      window.setNotebookSyncStatus('saving');
      clearTimeout(_notebookSaveDebounce);
      _notebookSaveDebounce = setTimeout(() => {
        window.saveNotebookContent(nb.value, false);
      }, 800);
    });

    nb.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        clearTimeout(_notebookSaveDebounce);
        window.saveNotebookContent(nb.value, true);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        window.updateNotebookCounters();
      }
    });
  };

  window.insertNotebookTimestamp = function() {
    const nb = $("centerNotebook");
    if (!nb) return;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const stamp = "\n[" + dateStr + " " + timeStr + "] ";
    insertTextAtCursor(nb, stamp);
    window.updateNotebookCounters();
    window.saveNotebookContent(nb.value, false);
  };

  window.insertNotebookPrefix = function(prefix) {
    const nb = $("centerNotebook");
    if (!nb) return;
    insertTextAtCursor(nb, prefix);
    window.updateNotebookCounters();
    window.saveNotebookContent(nb.value, false);
  };

  function insertTextAtCursor(el, text) {
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = el.value;
    el.value = val.substring(0, start) + text + val.substring(end);
    el.selectionStart = el.selectionEnd = start + text.length;
    el.focus();
  }

  window.copyNotebookContent = function() {
    const nb = $("centerNotebook");
    if (!nb || !nb.value.trim()) {
      showToast(currentLang === 'ar' ? "المفكرة فارغة" : "Notebook is empty", "warning");
      return;
    }
    navigator.clipboard.writeText(nb.value).then(() => {
      showToast(currentLang === 'ar' ? "تم نسخ محتوى المفكرة إلى الحافظة" : "Notebook copied to clipboard", "success");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.studentSave(); else playSound("beep");
    }).catch(() => {
      showToast(currentLang === 'ar' ? "تعذر النسخ، يرجى المحاولة يدوياً" : "Copy failed", "err");
    });
  };

  window.clearNotebookContent = function() {
    const nb = $("centerNotebook");
    if (!nb || !nb.value.trim()) return;
    const isAr = (currentLang === 'ar');
    Swal.fire({
      title: isAr ? "مسح محتوى المفكرة؟" : "Clear Notebook?",
      text: isAr ? "هل أنت متأكد من مسح جميع الملاحظات المدونة بالمفكرة؟" : "Are you sure you want to erase all notes in the notebook?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: isAr ? "نعم، امسح الكل" : "Yes, clear all",
      cancelButtonText: isAr ? "إلغاء" : "Cancel"
    }).then((res) => {
      if (res.isConfirmed) {
        nb.value = "";
        window.updateNotebookCounters();
        window.saveNotebookContent("", true);
      }
    });
  };

  window.saveNotebookManual = function() {
    const nb = $("centerNotebook");
    const val = nb ? nb.value : "";
    window.saveNotebookContent(val, true);
  };

  // ==========================================
  // === MARKETING CAMPAIGNS MANAGEMENT ===
  // ==========================================
  window.populateMarketingGroups = function() {
    const sel = $("marketingTargetGroupSelect"); if(!sel) return;
    const isAr = (currentLang === "ar");
    let html = '<option value="">' + (isAr ? "-- اختر الباقة / المجموعة --" : "-- Select Package --") + '</option>';
    let keys = Object.keys(groupFees || {});
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const feeObj = groupFees[key];
      const price = typeof feeObj === 'object' && feeObj !== null ? (Number(feeObj.price) || 0) : (Number(feeObj) || 0);
      html += '<option value="' + key + '">' + key + ' (' + price + ' ' + (isAr ? "ج" : "EGP") + ')</option>';
    }
    sel.innerHTML = html;
  };

  on("marketingTargetFilter", "change", function() {
    let val = this.value;
    let gContainer = $("marketingGroupSelectContainer");
    if(gContainer) {
      gContainer.style.display = (val === "groups") ? "block" : "none";
    }
    let msgInp = $("marketingMsgBody");
    if (val === "debtors" && msgInp) {
      if (!msgInp.value || msgInp.value.trim() === "") {
        msgInp.value = currentLang === 'ar' 
          ? "مساء الخير أ/ [اسم_الطالب]،\r\nنتمنى أن تكون بكل خير.\r\nحابة أفكّرك بأن الرصيد المتبقي من رسوم الكورس هو [المبلغ] ج، ونستأذنك في استكماله خلال حضورك في أقرب محاضرة لضمان استمرار الخدمة بسلاسة.\r\nشكراً جزيلاً لتعاونك الدائم معنا."
          : "Good afternoon [اسم_الطالب],\r\nWe hope you are well.\r\nThis is a friendly reminder that your outstanding course balance is [المبلغ] EGP. Please settle this amount during your next lecture.\r\nThank you for your cooperation.";
      }
    }
    filterCampaignTarget();
  });

  on("marketingTargetGroupSelect", "change", function() {
    filterCampaignTarget();
  });

  let _mktMsgInputTimer = null;
  on("marketingMsgBody", "input", function() {
    clearTimeout(_mktMsgInputTimer);
    _mktMsgInputTimer = setTimeout(() => {
      if (typeof window.renderCampaignPage === 'function') {
        window.renderCampaignPage();
      }
    }, 250);
  });

  let currentCampaignList = [];
    let campaignCurrentPage = 1;
  const CAMPAIGN_PAGE_SIZE = 10;

  window.changeCampaignPage = function(delta) {
    const totalPages = Math.ceil(currentCampaignList.length / CAMPAIGN_PAGE_SIZE) || 1;
    const newPage = campaignCurrentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      campaignCurrentPage = newPage;
      renderCampaignPage();
    }
  };

  window.filterCampaignTarget = function() {
    let filter = $("marketingTargetFilter") ? $("marketingTargetFilter").value : "all";
    let grp = $("marketingTargetGroupSelect") ? $("marketingTargetGroupSelect").value : "";
    const isAr = (currentLang === "ar");
    const today = (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
    const todayAttIds = new Set(attByDate[today] || []);
    
    let list = [];
    let sKeys = Object.keys(students || {});
    
    if (filter === "session") {
      let sDates = Object.keys(sessionStudentsByDate || {});
      let seenPhones = {};
      for(let d=0; d<sDates.length; d++) {
        let arr = sessionStudentsByDate[sDates[d]] || [];
        for(let k=0; k<arr.length; k++) {
          let sess = arr[k];
          if (sess.phone && sess.phone.trim() !== "" && !seenPhones[sess.phone.trim()]) {
            seenPhones[sess.phone.trim()] = true;
            list.push({ 
              id: sess.id || ('s_' + k),
              name: sess.name || (isAr ? "طالب حصة" : "Session Student"), 
              phone: sess.phone.trim(), 
              desc: isAr ? ("طالب حصة (" + sDates[d] + ")") : ("Session Student (" + sDates[d] + ")"),
              badgeClass: "badge-session",
              remain: 0 
            });
          }
        }
      }
    } else {
      for(let i=0; i<sKeys.length; i++) {
        let st = students[sKeys[i]];
        if (!st || !st.name) continue;
        if (!st.phone || st.phone.trim() === "") continue;
        
        let p = st.phone.trim();
        let stClassName = st.className ? st.className.trim() : "";
        let hasAttendedToday = todayAttIds.has(String(st.id));
        
        let req = 0;
        if (stClassName && groupFees[stClassName] !== undefined) {
          const pkg = groupFees[stClassName];
          if (st.paymentPlan === "installments" && pkg.hasInstallments) {
            req = toInt(pkg.installmentPrice) || 0;
          } else {
            req = toInt(pkg.price || pkg) || 0;
          }
        } else if (Array.isArray(st.packages) && st.packages.length > 0) {
          st.packages.forEach(pName => {
            if (groupFees[pName]) {
              const pkg = groupFees[pName];
              req += toInt(pkg.price || pkg) || 0;
            }
          });
        }

        let paid = toInt(st.paid) || 0;
        let discount = toInt(st.discount) || 0;
        let remain = Math.max(0, req - paid - discount);
        let descText = stClassName ? (isAr ? ("باقة: " + stClassName) : ("Pkg: " + stClassName)) : (isAr ? "عام" : "General");
        let bClass = "badge-normal";

        if (st.rank === "vip") {
          descText = isAr ? ("VIP (" + (stClassName || "عام") + ")") : ("VIP (" + (stClassName || "General") + ")");
          bClass = "badge-vip";
        } else if (st.rank === "warning") {
          descText = isAr ? ("إنذار (" + (stClassName || "عام") + ")") : ("Warned (" + (stClassName || "General") + ")");
          bClass = "badge-warning";
        }

        let matches = false;
        if (filter === "all") {
          matches = true;
        } else if (filter === "groups") {
          if (grp && (stClassName === grp || (Array.isArray(st.packages) && st.packages.includes(grp)))) {
            matches = true;
            descText = isAr ? ("باقة: " + grp) : ("Pkg: " + grp);
          }
        } else if (filter === "vip") {
          if (st.rank === "vip") matches = true;
        } else if (filter === "warned") {
          if (st.rank === "warning") matches = true;
        } else if (filter === "debtors") {
          if (req > 0 && remain > 0) {
            matches = true;
            descText = isAr ? ("متبقي: " + remain + " ج") : ("Due: " + remain + " EGP");
            bClass = "badge-debt";
          }
        } else if (filter === "paid_full") {
          if (req > 0 && remain === 0) {
            matches = true;
            descText = isAr ? ("سدد بالكامل (" + paid + " ج)") : ("Paid in Full (" + paid + " EGP)");
            bClass = "badge-paid";
          }
        } else if (filter === "present_today") {
          if (hasAttendedToday) {
            matches = true;
            descText = isAr ? ("حضر اليوم (" + (stClassName || "عام") + ")") : ("Attended Today (" + (stClassName || "General") + ")");
            bClass = "badge-present";
          }
        } else if (filter === "absent_today") {
          if (!hasAttendedToday) {
            matches = true;
            descText = isAr ? ("غائب اليوم (" + (stClassName || "عام") + ")") : ("Absent Today (" + (stClassName || "General") + ")");
            bClass = "badge-absent";
          }
        }

        if (matches) {
          list.push({ 
            id: st.id, 
            name: st.name, 
            phone: p, 
            desc: descText, 
            badgeClass: bClass, 
            remain: remain 
          });
        }
      }
    }
    
    currentCampaignList = list;
    campaignCurrentPage = 1;
    renderCampaignPage();
  };

  window.renderCampaignPage = function() {
    const clist = $("campaignNumbersList"); if(!clist) return;
    const isAr = (currentLang === "ar");
    const totalCount = currentCampaignList.length;
    if ($("campaignTargetCount")) $("campaignTargetCount").textContent = totalCount;

    if (totalCount === 0) {
      clist.innerHTML = '<div class="mkt-empty-state"><i class="fa-solid fa-filter-circle-xmark"></i><p>' + (isAr ? "لا توجد أرقام هواتف مسجلة تطابق الشريحة المحددة" : "No phone numbers match the selected criteria") + '</p></div>';
      return;
    }

    const totalPages = Math.ceil(totalCount / CAMPAIGN_PAGE_SIZE) || 1;
    if (campaignCurrentPage > totalPages) campaignCurrentPage = totalPages;
    if (campaignCurrentPage < 1) campaignCurrentPage = 1;

    const startIndex = (campaignCurrentPage - 1) * CAMPAIGN_PAGE_SIZE;
    const endIndex = Math.min(startIndex + CAMPAIGN_PAGE_SIZE, totalCount);
    const pageSlice = currentCampaignList.slice(startIndex, endIndex);

    let msgBody = $("marketingMsgBody") ? $("marketingMsgBody").value.trim() : "";

    let cardsHtml = '<div class="mkt-cards-grid">';
    for(let i = 0; i < pageSlice.length; i++) {
      const item = pageSlice[i];
      let cleanPhone = item.phone.startsWith("0") ? "+2" + item.phone : (item.phone.startsWith("+") ? item.phone : "+20" + item.phone);
      
      let customMsg = msgBody;
      if (customMsg) {
        customMsg = customMsg.replace(/\[اسم_الطالب\]/g, item.name);
        customMsg = customMsg.replace(/\[المبلغ\]/g, item.remain || 0);
      } else {
        customMsg = isAr ? ("مرحباً بك أ/ " + item.name + "،\r\nيرجى التواصل مع إدارة السنتر.") : ("Hello " + item.name + ",\r\nPlease contact the center administration.");
      }

      let waUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(customMsg);

      cardsHtml += `
        <div class="mkt-student-card">
          <div class="mkt-card-main">
            <div class="mkt-student-avatar">
              <i class="fa-solid fa-user-graduate"></i>
            </div>
            <div class="mkt-student-details">
              <div class="mkt-student-name">
                <span>${item.name}</span>
                <span class="mkt-student-id">#${item.id}</span>
              </div>
              <div class="mkt-student-meta">
                <span class="mkt-meta-phone" onclick="navigator.clipboard.writeText('${item.phone}'); showToast('${isAr ? "تم نسخ الرقم" : "Phone copied"}');" title="${isAr ? "اضغط لنسخ الرقم" : "Click to copy"}">
                  <i class="fa-solid fa-phone"></i> ${item.phone}
                  <i class="fa-regular fa-copy mkt-copy-icon"></i>
                </span>
                <span class="mkt-meta-badge ${item.badgeClass}">${item.desc}</span>
              </div>
            </div>
          </div>
          <div class="mkt-card-actions">
            <a href="${waUrl}" target="_blank" class="mkt-wa-btn">
              <i class="fa-brands fa-whatsapp"></i>
              <span>${isAr ? "مراسلة واتساب" : "WhatsApp"}</span>
            </a>
          </div>
        </div>
      `;
    }
    cardsHtml += '</div>';

    // Pagination bar
    const paginationHtml = `
      <div class="mkt-pagination-bar">
        <button type="button" class="mkt-page-btn" onclick="window.changeCampaignPage(-1)" ${campaignCurrentPage <= 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-${isAr ? 'right' : 'left'}"></i> <span>${isAr ? "السابق" : "Previous"}</span>
        </button>
        <div class="mkt-page-info">
          <span>${isAr ? "صفحة" : "Page"} <b>${campaignCurrentPage}</b> ${isAr ? "من" : "of"} <b>${totalPages}</b></span>
          <span class="mkt-page-range">(${startIndex + 1} - ${endIndex} ${isAr ? "من إجمالي" : "of"} ${totalCount})</span>
        </div>
        <button type="button" class="mkt-page-btn" onclick="window.changeCampaignPage(1)" ${campaignCurrentPage >= totalPages ? 'disabled' : ''}>
          <span>${isAr ? "التالي" : "Next"}</span> <i class="fa-solid fa-chevron-${isAr ? 'left' : 'right'}"></i>
        </button>
      </div>
    `;

    clist.innerHTML = cardsHtml + paginationHtml;
  };

  // (btnFilterCampaign and btnCopyCampaignNumbers removed by user request)

  // ==========================================
 // 17.9. SMART ANTI-BAN AUTO BROADCASTER
 // ==========================================
 let broadcastTimer = null;
 let broadcastCurrentIndex = 0;
 let broadcastIntervalSeconds = 10;
 let broadcastCurrentCount = 10;
 let broadcastIsPaused = false;

 function startNextBroadcastWindow() {
 if (broadcastCurrentIndex >= currentCampaignList.length) {
 endBroadcast(true);
 return;
 }

 let item = currentCampaignList[broadcastCurrentIndex];
 let msgBody = $("marketingMsgBody") ? $("marketingMsgBody").value.trim() : "";
 let customMsg = msgBody;
 if (customMsg) {
 customMsg = customMsg.replace(/\[اسم_الطالب\]/g, item.name);
 customMsg = customMsg.replace(/\[المبلغ\]/g, item.remain || 0);
 } else {
 customMsg = `مرحباً بك أ/ ${item.name}،\r\nيرجى التواصل مع إدارة السنتر.`;
 }

 let cleanPhone = item.phone.startsWith("0") ? "+2" + item.phone : "+20" + item.phone;
 let waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMsg)}`;

 // فتح نافذة المحادثة
 window.open(waUrl, '_blank');

 broadcastCurrentIndex++;
 if ($("broadcastProgressText")) $("broadcastProgressText").textContent = `${broadcastCurrentIndex} / ${currentCampaignList.length}`;
  if ($("broadcastCurrentStudentInfo")) {
    $("broadcastCurrentStudentInfo").innerHTML = `<i class="fa-brands fa-whatsapp" style="color:#25d366; margin-inline-end:6px;"></i> جاري مراسلة: <b>${item.name}</b> (${item.phone}) <br><span style="font-size:0.85em; color:#94a3b8; font-weight:normal;">اضغط إرسال (Enter) في نافذة الواتساب المفتوحة.. النافذة التالية ستفتح تلقائياً.</span>`;
  }

 let pct = (broadcastCurrentIndex / currentCampaignList.length) * 100;
 if ($("broadcastProgressBar")) $("broadcastProgressBar").style.width = pct + "%";

 if (broadcastCurrentIndex >= currentCampaignList.length) {
 setTimeout(() => endBroadcast(true), 3000);
 return;
 }

 // بدء العد التنازلي للنافذة التالية
 broadcastCurrentCount = broadcastIntervalSeconds;
 if ($("broadcastTimerText")) $("broadcastTimerText").textContent = broadcastCurrentCount;
 
 broadcastTimer = setInterval(() => {
 if (broadcastIsPaused) return;
 broadcastCurrentCount--;
 if ($("broadcastTimerText")) $("broadcastTimerText").textContent = broadcastCurrentCount;
 if (broadcastCurrentCount <= 0) {
 clearInterval(broadcastTimer);
 startNextBroadcastWindow();
 }
 }, 1000);
 }

  function resetPauseButtonUI() {
    const btnPause = $("btnPauseBroadcast");
    if (btnPause) {
      btnPause.className = "mkt-ctrl-btn mkt-ctrl-pause";
      btnPause.innerHTML = '<i class="fa-solid fa-pause"></i> <span>إيقاف مؤقت</span>';
    }
  }

  function terminateBroadcastSession(silent) {
    if (broadcastTimer) clearInterval(broadcastTimer);
    broadcastTimer = null;
    broadcastIsPaused = false;
    broadcastCurrentIndex = 0;
    broadcastCurrentCount = broadcastIntervalSeconds;

    const ctrlPanel = $("broadcastControllerPanel");
    if (ctrlPanel) {
      ctrlPanel.classList.add("hidden");
    }

    if ($("broadcastProgressText")) $("broadcastProgressText").textContent = "0 / 0";
    if ($("broadcastProgressBar")) $("broadcastProgressBar").style.width = "0%";
    if ($("broadcastTimerText")) $("broadcastTimerText").textContent = broadcastIntervalSeconds;
    if ($("broadcastCurrentStudentInfo")) $("broadcastCurrentStudentInfo").innerHTML = "--";

    resetPauseButtonUI();

    const btnStart = $("btnStartAutoBroadcast");
    if (btnStart) {
      btnStart.disabled = false;
      btnStart.style.opacity = "1";
      btnStart.style.pointerEvents = "auto";
    }

    if (!silent) {
      showToast("تم إنهاء البث التلقائي بنجاح وإلغاء الجلسة", "info");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.tap(); else playSound("tap");
    }
  }

  function endBroadcast(completed) {
    if (broadcastTimer) clearInterval(broadcastTimer);
    broadcastTimer = null;
    broadcastIsPaused = false;
    resetPauseButtonUI();

    if (completed) {
      if ($("broadcastStatusTitle")) $("broadcastStatusTitle").textContent = "اكتمل البث التلقائي بنجاح";
      if ($("broadcastStatusSub")) $("broadcastStatusSub").textContent = "تم فتح جميع المحادثات بنجاح وإرسال الإشعارات بدون التعرض لأي حظر.";
      const pulseIcon = $("broadcastPulseIcon");
      if (pulseIcon) pulseIcon.classList.remove("mkt-pulse-active");
      if ($("broadcastCurrentStudentInfo")) {
        $("broadcastCurrentStudentInfo").innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981; margin-inline-end:6px;"></i> اكتملت عملية الإرسال لجميع الطلاب بنجاح';
      }
      showToast("اكتمل البث التلقائي الذكي لجميع الطلاب بنجاح", "success");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncSuccess(); else playSound("beep");

      // Auto close after 4 seconds
      setTimeout(() => {
        const ctrlPanel = $("broadcastControllerPanel");
        if (ctrlPanel && !broadcastTimer && !broadcastIsPaused) {
          ctrlPanel.classList.add("hidden");
          const btnStart = $("btnStartAutoBroadcast");
          if (btnStart) {
            btnStart.disabled = false;
            btnStart.style.opacity = "1";
            btnStart.style.pointerEvents = "auto";
          }
        }
      }, 4000);
    } else {
      terminateBroadcastSession(false);
    }
  }

  on("btnStartAutoBroadcast", "click", function() {
    if (!currentCampaignList || currentCampaignList.length === 0) {
      showToast("قائمة الأرقام فارغة، يرجى اختيار شريحة الطلاب أولاً.", "err");
      return;
    }
    if (broadcastTimer) clearInterval(broadcastTimer);
    
    broadcastCurrentIndex = 0;
    broadcastIsPaused = false;
    broadcastCurrentCount = broadcastIntervalSeconds;
    
    const ctrlPanel = $("broadcastControllerPanel");
    if (ctrlPanel) {
      ctrlPanel.classList.remove("hidden");
      ctrlPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    if ($("broadcastStatusTitle")) $("broadcastStatusTitle").textContent = "جاري تشغيل البث التلقائي المضاد للحظر (Anti-Ban)...";
    if ($("broadcastStatusSub")) $("broadcastStatusSub").textContent = "يتم فتح نوافذ المحادثات تباعاً بفاصل زمني آمن ومدروس لحماية حسابك من الحظر.";
    const pulseIcon = $("broadcastPulseIcon");
    if (pulseIcon) pulseIcon.classList.add("mkt-pulse-active");
    if ($("broadcastProgressText")) $("broadcastProgressText").textContent = `0 / ${currentCampaignList.length}`;
    if ($("broadcastProgressBar")) $("broadcastProgressBar").style.width = "0%";
    if ($("broadcastTimerText")) $("broadcastTimerText").textContent = broadcastIntervalSeconds;
    
    resetPauseButtonUI();

    showToast("بدء تشغيل البث التلقائي الآمن، يرجى السماح بالنوافذ المنبثقة (Pop-ups)", "success");
    if (typeof AssistantSounds !== "undefined") AssistantSounds.marketingPulse(); else playSound("beep");
    
    // البدء بالنافذة الأولى فوراً
    startNextBroadcastWindow();
  });

  on("btnPauseBroadcast", "click", function() {
    if (!broadcastTimer && !broadcastIsPaused) return;
    broadcastIsPaused = !broadcastIsPaused;
    
    const pulseIcon = $("broadcastPulseIcon");
    if (broadcastIsPaused) {
      this.className = "mkt-ctrl-btn mkt-ctrl-resume";
      this.innerHTML = '<i class="fa-solid fa-play"></i> <span>استئناف البث</span>';
      if ($("broadcastStatusTitle")) $("broadcastStatusTitle").textContent = "البث التلقائي متوقف مؤقتاً...";
      if (pulseIcon) pulseIcon.classList.remove("mkt-pulse-active");
      showToast("تم إيقاف البث مؤقتاً", "warning");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.tap(); else playSound("tap");
    } else {
      this.className = "mkt-ctrl-btn mkt-ctrl-pause";
      this.innerHTML = '<i class="fa-solid fa-pause"></i> <span>إيقاف مؤقت</span>';
      if ($("broadcastStatusTitle")) $("broadcastStatusTitle").textContent = "جاري تشغيل البث التلقائي المضاد للحظر (Anti-Ban)...";
      if (pulseIcon) pulseIcon.classList.add("mkt-pulse-active");
      showToast("تم استئناف البث التلقائي", "success");
      if (typeof AssistantSounds !== "undefined") AssistantSounds.marketingPulse(); else playSound("beep");
    }
  });

  on("btnStopBroadcast", "click", async function() {
    if (typeof Swal !== "undefined") {
      const isAr = (currentLang === "ar");
      const res = await Swal.fire({
        title: isAr ? "إنهاء جلسة البث التلقائي" : "Terminate Broadcast Session",
        text: isAr ? "هل تريد بالفعل إنهاء وإلغاء جلسة البث الحالية فوراً وإعادة ضبط العدادات؟" : "Are you sure you want to stop and cancel the current broadcast session?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: isAr ? "نعم، إنهاء البث الآن" : "Yes, Terminate Now",
        cancelButtonText: isAr ? "تراجع ومتابعة" : "Cancel & Continue",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#475569",
        reverseButtons: true
      });
      if (!res.isConfirmed) return;
    }
    terminateBroadcastSession(false);
  });

 // ==========================================
 // DAILY ADMINISTRATIVE HARD-LOCK SYSTEM
   // ==========================================
  // DAILY ADMINISTRATIVE HARD-LOCK SYSTEM
  // Real-Time Multi-Device Live Sync Engine
  // ==========================================
  // Global helpers for Hard Lock interactions
  window.goToAdminFromLock = function() {
    if (typeof window.navigateWithTransition === 'function') {
      window.navigateWithTransition('../admin/admin.html');
    } else {
      window.location.href = '../admin/admin.html';
    }
  };

  window.dismissOrLogoutFromLock = function() {
    const overlay = document.getElementById("assistantHardLockOverlay");
    const isLoggedIn = (localStorage.getItem(K_AUTH) === "1");
    if (isLoggedIn) {
      if (typeof window.logout === 'function') {
        window.logout();
      } else {
        localStorage.removeItem(K_AUTH);
        localStorage.removeItem(K_ROLE);
        window.location.reload();
      }
    } else {
      if (overlay) overlay.classList.add("hidden");
      document.body.classList.remove("system-hard-locked");
    }
  };

  window.applyShiftLockState = function(dateStr, isApproved, reason) {
    window.IS_SHIFT_APPROVED = (isApproved === true);
    window.SHIFT_LOCK_REASON = reason || "";

    const overlay = document.getElementById("assistantHardLockOverlay");
    const titleEl = document.getElementById("assistantHardLockTitle");
    const msgEl = document.getElementById("assistantHardLockMsg");
    const dismissTextEl = document.getElementById("hardLockDismissText");

    const isLoggedIn = (localStorage.getItem(K_AUTH) === "1");
    const loginBox = document.getElementById("loginBox");
    const isLoginVisible = loginBox && !loginBox.classList.contains("hidden");

    if (dismissTextEl) {
      dismissTextEl.textContent = isLoggedIn ? "تسجيل الخروج / تبديل الحساب" : "العودة لشاشة الدخول";
    }

    if (isApproved === true) {
      document.body.classList.remove("system-hard-locked");
      if (overlay && !overlay.classList.contains("hidden")) {
        overlay.classList.add("hidden");
        if (typeof showToast === 'function') {
          showToast("تم فتح الشيفت واليومية بنجاح من قِبل المدير.", "success");
        }
      }
    } else {
      // Shift is closed!
      // If user is currently on the login screen, NEVER lock them out of the login screen!
      // Keep login screen fully interactive so the admin/teacher can switch to Admin portal or login.
      if (!isLoggedIn || isLoginVisible) {
        document.body.classList.remove("system-hard-locked");
        if (overlay) overlay.classList.add("hidden");
        return;
      }

      // If assistant is logged in inside appBox:
      document.body.classList.add("system-hard-locked");
      if (overlay) {
        if (titleEl) titleEl.textContent = "الشيفت معلق ومغلق من قِبل الإدارة";
        if (msgEl) {
          msgEl.textContent = reason || "تم إيقاف الشيفت اليومي من قِبل المدير العام. تم تجميد كافة العمليات (تسجيل الحضور، التحصيل، التعديل) لحين مراجعة واعتماد اليومية وفتح الشيفت مجدداً.";
        }
        overlay.classList.remove("hidden");
      }
    }
  };

  window.checkDailyShiftHeartbeat = async function(isManual = false) {
    if (!window.supabaseClient) return;
    try {
      const { data, error } = await window.supabaseClient
        .from('settings')
        .select('daily_shift_status, config, updated_at')
        .eq('id', 1)
        .maybeSingle();

      if (error || !data) return;

      const today = (typeof nowDateStr === 'function' ? nowDateStr() : new Date().toISOString().split('T')[0]);
      const cfg = data.config || {};
      if (cfg.shift_system_enabled === false) {
        window.applyShiftLockState(today, true, '');
        return;
      }
      const approvalMap = cfg.daily_approval_map || {};
      const todayInfo = approvalMap[today];

      let isApproved = false;
      if (todayInfo) {
        isApproved = todayInfo.status === 'approved' || todayInfo === 'approved' || todayInfo === true;
      } else {
        isApproved = data.daily_shift_status === 'open';
      }

      const reason = (data.daily_shift_status && data.daily_shift_status !== 'open' && data.daily_shift_status !== 'closed')
        ? data.daily_shift_status
        : (todayInfo?.reason || '');

      window.applyShiftLockState(today, isApproved, reason);

      if (isManual && typeof showToast === 'function') {
        if (isApproved) {
          showToast(" اليومية معتمدة والنظام مفتوح للعمل", "success");
        } else {
          showToast(" اليومية معلقة وفي انتظار اعتماد المدير", "warning");
        }
      }
    } catch(err) {
      console.warn('[Shift Heartbeat] Error:', err);
    }
  };

  function initDailyApprovalSystem() {
    const overlay = document.getElementById("assistantHardLockOverlay");
    if (!overlay) return;

    // 1. Check current status immediately on boot
    window.checkDailyShiftHeartbeat(false);

    // 2. Realtime WebSocket Broadcast subscription (< 150ms cross-device sync)
    if (window.supabaseClient) {
      try {
        const realtimeShiftChannel = window.supabaseClient.channel('studify_realtime_shift_sync');
        realtimeShiftChannel
          .on('broadcast', { event: 'DAILY_SHIFT_CHANGE' }, (payload) => {
            console.log('[Assistant Realtime Shift] Received broadcast:', payload);
            const d = payload.payload;
            if (d && typeof window.applyShiftLockState === 'function') {
              if (d.shift_system_enabled === false) {
                window.applyShiftLockState(d.date, true, '');
              } else {
                window.applyShiftLockState(d.date, d.isApproved, d.reason);
              }
            }
          })
          .subscribe((status) => {
            console.log('[Assistant Realtime Shift] Status:', status);
          });
      } catch (err) {
        console.warn('[Assistant Realtime Shift] Channel error:', err);
      }
    }

    // 3. Heartbeat polling every 8 seconds (re-verifies even if phone slept)
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        window.checkDailyShiftHeartbeat(false);
      }
    }, 8000);

    // 4. Instant verification on tab focus or screen wake
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        window.checkDailyShiftHeartbeat(false);
      }
    });
    window.addEventListener('focus', () => {
      window.checkDailyShiftHeartbeat(false);
    });
  }

 // ==========================================
 function initNoticeBoardSystem() {
  const getMid = () => window.CURRENT_MANAGER_ID || localStorage.getItem("ca_manager_id");
  const btnSendBroadcast = $("btnSendBroadcast");
  const broadcastMsgInput = $("broadcastMessageInput");
  const managerBroadcastHistory = $("managerBroadcastHistory");
  const btnNoticeBoard = $("btnNoticeBoard");
  const noticeBadge = $("noticeBadge");
  const noticeBoardModal = $("noticeBoardModal");
  const closeNoticeBoardBtn = $("closeNoticeBoardBtn");
  const noticeBoardList = $("noticeBoardList");

  let localAnnouncements = [];
  let currentAsstId = localStorage.getItem("ca_auth_v2") || "unknown_assistant";

  if (btnSendBroadcast) {
    btnSendBroadcast.addEventListener("click", async () => {
      const msg = broadcastMsgInput.value.trim();
      if(!msg) return showToast(currentLang==='ar' ? "أدخل نص الإعلان" : "Enter message", "warning");
      if(!window.supabaseClient) return;
      
      const pushId = "ann_" + Date.now();
      try {
        btnSendBroadcast.disabled = true;
        btnSendBroadcast.innerHTML = "جاري الإرسال...";
        
        const { data: curr } = await window.supabaseClient.from('settings').select('announcements').eq('id', 1).maybeSingle();
        const anns = (curr && curr.announcements) ? curr.announcements : [];
        anns.push({
          id: pushId,
          title: "تنبيه عام",
          content: msg,
          author: localStorage.getItem("ca_current_username") || "المدير",
          read_by: {},
          created_at: new Date().toISOString()
        });
        
        await window.supabaseClient.from('settings').update({ announcements: anns }).eq('id', 1);
        
        broadcastMsgInput.value = '';
        showToast(currentLang==='ar' ? "تم إرسال الإعلان لجميع المساعدين" : "Broadcast sent", "success");
        loadAnnouncements();
      } catch(e) {
        console.error(e);
        showToast(currentLang==='ar' ? "فشل الإرسال" : "Failed to send", "err");
      } finally {
        btnSendBroadcast.disabled = false;
        btnSendBroadcast.innerHTML = " نشر الإعلان";
      }
    });
  }

  async function loadAnnouncements() {
    if(!window.supabaseClient) return;
    try {
      const { data } = await window.supabaseClient.from('settings').select('announcements').eq('id', 1).maybeSingle();
      let arr = (data && data.announcements) ? data.announcements : [];
      arr.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      
      localAnnouncements = arr.map(a => ({
        id: a.id,
        message: a.content,
        timestamp: new Date(a.created_at).getTime(),
        readBy: a.read_by || {}
      }));

      const isManager = window.CURRENT_ROLE === 'admin';
      if (isManager && managerBroadcastHistory) {
        renderManagerBroadcastHistory();
      }
      if (!isManager && btnNoticeBoard) {
        btnNoticeBoard.style.display = 'inline-block';
        let unreadCount = localAnnouncements.filter(ann => !(ann.readBy || {})[currentAsstId]).length;
        if (unreadCount > 0) {
          noticeBadge.classList.remove("hidden");
          noticeBadge.textContent = unreadCount > 9 ? "+9" : unreadCount;
        } else {
          noticeBadge.classList.add("hidden");
        }
      }
    } catch(e) {}
  }

  setTimeout(loadAnnouncements, 1500);

  function renderManagerBroadcastHistory() {
    if(!managerBroadcastHistory) return;
    managerBroadcastHistory.innerHTML = '';
    if(localAnnouncements.length === 0) {
      managerBroadcastHistory.innerHTML = '<div style="color:#777;">لا يوجد إعلانات سابقة.</div>';
      return;
    }
    localAnnouncements.forEach(ann => {
      const div = document.createElement("div");
      div.style.cssText = "background:var(--bg-inset); padding:15px; border-radius:10px; border:1px solid var(--border);";
      const d = new Date(ann.timestamp);
      const readsCount = ann.readBy ? Object.keys(ann.readBy).length : 0;
      div.innerHTML = `
        <div style="font-size:0.85em; color:var(--text-secondary); margin-bottom:5px;"> ${d.toLocaleString()}</div>
        <div style="font-weight:bold; margin-bottom:10px; color:var(--text-main);">${ann.message.replace(/\r\n/g, '<br>')}</div>
        <div style="font-size:0.85em; color:var(--primary);"> تمت القراءة بواسطة: ${readsCount} مساعد</div>
      `;
      managerBroadcastHistory.appendChild(div);
    });
  }

  if (btnNoticeBoard) {
    btnNoticeBoard.addEventListener("click", () => {
      renderAssistantNoticeBoard();
      noticeBoardModal.classList.remove("hidden");
    });
  }
  if (closeNoticeBoardBtn) {
    closeNoticeBoardBtn.addEventListener("click", () => {
      noticeBoardModal.classList.add("hidden");
    });
  }

  async function renderAssistantNoticeBoard() {
    if(!noticeBoardList) return;
    noticeBoardList.innerHTML = '';
    if(localAnnouncements.length === 0) {
      noticeBoardList.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">لا توجد إعلانات حالياً.</div>';
      return;
    }
    for(const ann of localAnnouncements) {
      const reads = ann.readBy || {};
      const isRead = !!reads[currentAsstId];
      const div = document.createElement("div");
      div.style.cssText = `background: ${isRead ? 'var(--bg-inset)' : 'var(--bg-surface)'}; padding:15px; border-radius:10px; border:1px solid var(--border); opacity: ${isRead ? '0.7' : '1'}; position: relative;`;
      const d = new Date(ann.timestamp);
      const dotHtml = isRead ? '' : `<div style="position:absolute; top:15px; left:15px; width:10px; height:10px; border-radius:50%; background:var(--danger);"></div>`;
      div.innerHTML = `
        ${dotHtml}
        <div style="font-size:0.85em; color:var(--text-secondary); margin-bottom:8px;"> ${d.toLocaleString()}</div>
        <div style="font-weight:bold; color:var(--text-main); line-height: 1.5; padding-left: ${!isRead ? '20px' : '0'}" >${ann.message.replace(/\r\n/g, '<br>')}</div>
      `;
      noticeBoardList.appendChild(div);

      if (!isRead) {
        try {
          if (window.supabaseClient) {
            const { data: curr } = await window.supabaseClient.from('settings').select('announcements').eq('id', 1).maybeSingle();
            if (curr && curr.announcements) {
              const aIndex = curr.announcements.findIndex(a => a.id === ann.id);
              if (aIndex !== -1) {
                if (!curr.announcements[aIndex].read_by) curr.announcements[aIndex].read_by = {};
                curr.announcements[aIndex].read_by[currentAsstId] = true;
                await window.supabaseClient.from('settings').update({ announcements: curr.announcements }).eq('id', 1);
              }
            }
          }
        } catch(e) {}
      }
    }
  }
 }
 
   // Cloud Sync Click Handler (Top bar cloud icon)
  if ($("cloudSyncIndicator")) {
   $("cloudSyncIndicator").addEventListener("click", async function() {
     if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncStart();
     showToast("جاري المزامنة مع السحابة وتحديث البيانات...", "warning");
     try {
       // 1. Pull freshest state from Supabase
       await loadAll();

       // 2. Re-render all views with freshest cloud data
       if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
       if (typeof populatePackages === 'function') populatePackages();
       if (typeof renderSyllabus === 'function') renderSyllabus();
       if (typeof renderTable === 'function') renderTable();
       if (typeof renderList === 'function') renderList(false);
       if (typeof updateStats === 'function') updateStats();
       if (typeof updateTopStats === 'function') updateTopStats();
       if (typeof renderClassSelects === 'function') renderClassSelects();
       if (typeof renderManagerPackagesCard === 'function') renderManagerPackagesCard();

       // 3. For assistants: reload permissions from Supabase and re-apply UI
       if (currentUserRole !== 'admin') {
         await loadPermissions();
         applyPermissionsToAssistantUI();
       }

       // 4. Safely push local state back
       await saveAll();

       if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncSuccess();
       showToast("تمت المزامنة وتحديث كافة البيانات والباقات سحابياً بنجاح", "success");
     } catch(err) {
       console.error('Cloud sync error:', err);
       if (typeof AssistantSounds !== "undefined") AssistantSounds.cloudSyncError();
       showToast("خطأ في المزامنة، تحقق من الاتصال بالإنترنت", "error");
     }
   });
  }

 // Startup Sequence
 async function initSystem() {
  await initStorageMigration();
  await loadAll(); 
  ensureBase500(); 
  await loadPermissions();
  checkAuth();
  applyPermissions();
  applyLanguage(); 
  setTimeout(checkQR, 500);

  initDailyApprovalSystem();
  initNoticeBoardSystem();
  setupSessionPaymentPills();

  await loadPermissions();
  
  if (typeof fetchAssistantMessages === "function") fetchAssistantMessages();

  if (localStorage.getItem("last_cloud_sync_date") !== nowDateStr()) {
    setTimeout(() => { 
      if (typeof accessToken !== "undefined" && accessToken) backupToDrive(false); 
    }, 8000);
  }
 }

 // ==========================================
 // ONE-CLICK SUPABASE DATA MIGRATION TOOL
 // ==========================================
 window.migrateLocalToSupabase = async function() {
  if (!window.supabaseClient) {
    return showToast("عميل Supabase غير مهيأ", "err");
  }
  const mid = window.CURRENT_MANAGER_ID || localStorage.getItem("ca_manager_id");
  if (!mid) {
    return showToast("يجب تسجيل الدخول كمدير أولاً", "err");
  }

  showToast("جاري رفع جميع البيانات المحلية إلى Supabase...", "info");

  try {
    // 1. Center Record
    await window.supabaseClient.from('centers').upsert({
      id: mid,
      manager_name: localStorage.getItem("ca_current_username") || "المدير",
      eval_data: evalData || {},
      settings: { migratedAt: new Date().toISOString() }
    });

    // 2. Packages
    const pkgRows = Object.keys(groupFees || {}).map(pkgName => {
      const p = groupFees[pkgName];
      const isObj = typeof p === 'object' && p !== null;
      return {
        
        name: pkgName,
        price: toInt(isObj ? p.price : p) || 0,
        has_installments: isObj ? !!p.hasInstallments : false,
        installment_price: toInt(isObj ? p.installmentPrice : 0) || 0
      };
    });
    if (pkgRows.length > 0) {
      await window.supabaseClient.from('packages').upsert(pkgRows, { onConflict: 'name' });
    }

    // 3. Students
    const allSt = Object.values(students || {}).concat(Object.values(deletedStudents || {})).filter(s => s && s.id);
    const stRows = allSt.map(st => ({
      id: String(st.id),
      
      name: st.name || '',
      phone: st.phone || '',
      parent_phone: st.parentPhone || '',
      class_name: st.className || '',
      payment_plan: st.paymentPlan || 'cash',
      paid: toInt(st.paid) || 0,
      discount: toInt(st.discount) || 0,
      notes: st.notes || '',
      status: st.status || (deletedStudents[st.id] ? 'deleted' : 'active'),
      installments: st.installments || [],
      payments: st.payments || [],
      attendance_dates: Array.from(new Set(st.attendanceDates || [])),
      last_modified: st.lastModified || Date.now()
    }));
    if (stRows.length > 0) {
      await window.supabaseClient.from('students').upsert(stRows, { onConflict: 'id' });
    }

    // 4. Booklets
    const bRows = Object.keys(bookletsStock || {}).map(bId => {
      const b = bookletsStock[bId];
      return {
        id: String(bId),
        
        name: b.name || '',
        price: toInt(b.price) || 0,
        stock: parseInt(b.stock) || 0,
        sales: b.sales || []
      };
    });
    if (bRows.length > 0) {
      await window.supabaseClient.from('booklets').upsert(bRows, { onConflict: 'id' });
    }

    showToast(" تم رفع جميع البيانات بنجاح إلى Supabase.", "success");
    console.log("[Migration] Supabase migration complete");
  } catch(e) {
    console.error("[Migration] Error:", e);
    showToast("حدث خطأ أثناء الرفع: " + e.message, "err");
  }
 };

 checkAuth();
 initSystem();

// Installments tab removed per user request

 window.currentGlobalSubject = "";
 
 
window.goToPackagesFromSubjectModal = function() {
    if (currentUserRole !== "admin" && typeof currentPermissions !== "undefined" && !currentPermissions.can_manage_packages) {
        showToast("عفواً، قسم الباقات والأسعار مقفل من قِبَل المدير", "err");
        return;
    }
    const modal = document.getElementById("subjectSelectionModal");
    if (modal) modal.classList.add("hidden");
    window.switchTab('Packages');
    if (typeof renderGroupFeesModal === 'function') renderGroupFeesModal();
};

window.openSubjectSelectionModal = function() {
    if (typeof AssistantSounds !== "undefined") {
        AssistantSounds.menuOpen();
    }
    const modal = document.getElementById("subjectSelectionModal");
    const list = document.getElementById("subjectSelectionList");
    const clearWrap = document.getElementById("subjectSelectionClearWrap");
    if (!modal || !list) return;
    
    // Extract real subjects ONLY from the user's actual database (packages and syllabus)
    let subjects = new Set();
    const feesObj = (typeof groupFees !== 'undefined' && groupFees) ? groupFees : (window.groupFees || {});
    
    Object.keys(feesObj).forEach(pkgName => {
        const pkg = feesObj[pkgName];
        if (pkg && pkg.subject && String(pkg.subject).trim()) {
            subjects.add(String(pkg.subject).trim());
        } else if (pkgName && String(pkgName).trim()) {
            subjects.add(String(pkgName).trim());
        }
    });
    
    if (Array.isArray(syllabusData)) {
        syllabusData.forEach(syll => {
            if (syll && syll.subject && String(syll.subject).trim()) {
                subjects.add(String(syll.subject).trim());
            }
        });
    }
    
    // Sort subjects alphabetically
    const subjectList = Array.from(subjects).sort((a, b) => a.localeCompare(b, 'ar'));
    
    let html = "";
    if (subjectList.length === 0) {
        const isArSub = (currentLang === "ar");
        html = `
        <div class="subject-empty-state">
            <div class="subject-empty-icon"><i class="fa-solid fa-folder-open"></i></div>
            <div class="subject-empty-title">${isArSub ? "لا توجد مواد أو باقات مسجلة حالياً" : "No subjects or packages registered currently"}</div>
            <div class="subject-empty-desc">${isArSub ? "يمكنك إضافة المواد والصفوف الدراسية والأسعار بسهولة من قسم الباقات." : "You can easily add subjects, grades, and prices from the Packages & Pricing section."}</div>
            ${(currentUserRole === 'admin' || (typeof currentPermissions !== 'undefined' && currentPermissions.can_manage_packages)) ? `
            <button class="btn primary" onclick="goToPackagesFromSubjectModal()">
                <i class="fa-solid ${isArSub ? 'fa-arrow-left' : 'fa-arrow-right'}"></i> ${isArSub ? "الانتقال إلى قسم الباقات" : "Go to Packages & Pricing"}
            </button>` : `
            <div style="font-size:0.85em; color:var(--text-secondary); margin-top:8px;">
                <i class="fa-solid fa-lock"></i> ${isArSub ? "يرجى مراجعة إدارة المركز لإضافة باقات ومواد دراسية." : "Please contact center administration to add packages and subjects."}
            </div>`}
        </div>`;
    } else {
        subjectList.forEach(sub => {
            const isSelected = (sub === window.currentGlobalSubject);
            html += `
            <div class="subject-tile-card ${isSelected ? 'selected' : ''}" onclick="selectGlobalSubject('${sub.replace(/'/g, "\\'")}')">
                <div class="subject-tile-content">
                    <div class="subject-tile-icon"><i class="fa-solid fa-book-open"></i></div>
                    <span class="subject-tile-name" title="${sub}">${sub}</span>
                </div>
                <div class="subject-tile-indicator">
                    ${isSelected ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle"></i>'}
                </div>
            </div>`;
        });
    }
    
    list.innerHTML = html;
    
    // Clear/Reset selection button in footer
    if (clearWrap) {
        if (window.currentGlobalSubject) {
            clearWrap.innerHTML = `<button class="subject-clear-btn" onclick="selectGlobalSubject('')">
                <i class="fa-solid fa-rotate-left"></i> إلغاء تحديد المادة
            </button>`;
        } else {
            clearWrap.innerHTML = "";
        }
    }
    
    modal.classList.remove("hidden");
};
 
 window.selectGlobalSubject = function(sub) {
     if (typeof AssistantSounds !== "undefined") {
         if (sub) AssistantSounds.tap();
         else AssistantSounds.touchTick();
     }
     window.currentGlobalSubject = sub;
     const txt = document.getElementById("globalSubjectText");
     if (txt) txt.textContent = sub || "-- مادة الحضور --";
     if (document.getElementById("subjectSelectionModal")) document.getElementById("subjectSelectionModal").classList.add("hidden");
     if (window.updateAttendanceUIState) window.updateAttendanceUIState();
 };
 
 on("openSubjectModalBtn", "click", openSubjectSelectionModal);


  // ==========================================
  // PACKAGE SELECTION MODAL LOGIC (IN SCOPE)
  // ==========================================
  window.tempSelectedPackages = new Set();
  window.tempSelectedStudentId = null;

  window.openPackageSelectionModal = function(studentId) {
      window.tempSelectedStudentId = studentId;
      const st = students[studentId];
      if (!st) return;

      // Reset temp state
      window.tempSelectedPackages.clear();
      if (st.packages) {
          st.packages.forEach(p => window.tempSelectedPackages.add(p));
      }

      if ($('psmStudentName')) $('psmStudentName').textContent = st.name || '';
      renderPackageSelectionGrid();

      const modal = document.getElementById('packageSelectionModal');
      if (modal) {
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
      }
  };

  window.closePackageSelectionModal = function() {
      const modal = document.getElementById('packageSelectionModal');
      if (modal) {
          modal.classList.add('hidden');
          setTimeout(() => modal.style.display = '', 300);
      }
  };

  window.renderPackageSelectionGrid = function() {
      const grid = $('psmGrid');
      if (!grid) return;

      const stId = window.tempSelectedStudentId;
      const st = stId && typeof students !== 'undefined' ? students[stId] : null;

      let html = '';
      let totalCost = 0;
      let totalPaid = 0;
      
      const pkgKeys = Object.keys(groupFees || {});
      pkgKeys.forEach(pkgName => {
          const pkgDetails = groupFees[pkgName] || {};
          const isSelected = window.tempSelectedPackages.has(pkgName);
          const price = toInt(pkgDetails.price);
          
          let paidForPkg = 0;
          if (st && st.payments) {
              st.payments.forEach(pm => {
                  const pmPkg = pm.pkgName || (st.packages && st.packages.length > 0 ? st.packages[0] : "");
                  if (pmPkg === pkgName) paidForPkg += toInt(pm.amount);
              });
          }

          if (isSelected) {
              totalCost += price;
              totalPaid += paidForPkg;
          }

          const pkgRemain = Math.max(0, price - paidForPkg);
          const pct = price > 0 ? Math.min(100, Math.round((paidForPkg / price) * 100)) : (paidForPkg > 0 ? 100 : 0);
          
          let statusBadgeHtml = '';
          if (isSelected) {
              if (pkgRemain === 0 && price > 0) {
                  statusBadgeHtml = `<span class="pkg-status-badge paid"><i class="fa-solid fa-circle-check"></i> مسددة بالكامل</span>`;
              } else if (pkgRemain > 0) {
                  statusBadgeHtml = `<span class="pkg-status-badge remain"><i class="fa-solid fa-hourglass-half"></i> متبقي: ${pkgRemain} ج</span>`;
              } else {
                  statusBadgeHtml = `<span class="pkg-status-badge paid"><i class="fa-solid fa-gift"></i> باقة مجانية</span>`;
              }
          } else {
              statusBadgeHtml = `<span class="pkg-status-badge unsubscribed"><i class="fa-solid fa-circle-minus"></i> غير مشترك</span>`;
          }

          const fillGradient = (pkgRemain === 0 && price > 0) 
              ? 'linear-gradient(90deg, #10b981, #059669)' 
              : 'linear-gradient(90deg, #3b82f6, #06b6d4)';

          html += `
          <div class="pkg-card ${isSelected ? 'selected' : ''}" onclick="togglePackageSelection('${pkgName}')">
              <i class="fa-solid fa-circle-check check-icon"></i>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                  <div class="pkg-card-title">${pkgName}</div>
                  <div class="pkg-card-subject">${pkgDetails.subject || ""}</div>
              </div>
              <div class="pkg-card-pricing">
                  <div class="pkg-card-price">${price} <small>جنيهاً</small></div>
              </div>
              <div class="pkg-financial-row">
                  <span>المدفوع: <strong style="color:var(--text-primary);">${paidForPkg} ج</strong></span>
                  ${statusBadgeHtml}
              </div>
              <div class="pkg-progress-bar-bg" title="نسبة السداد: ${pct}%">
                  <div class="pkg-progress-bar-fill" style="width: ${pct}%; background: ${fillGradient};"></div>
              </div>
          </div>
          `;
      });

      if (pkgKeys.length === 0) {
          html = '<div class="mutedCenter" style="grid-column: 1 / -1; padding: 30px; text-align: center; color: var(--text-secondary);"><i class="fa-solid fa-boxes-packing" style="font-size:2em; opacity:0.4; display:block; margin-bottom:8px;"></i>لا توجد باقات معرفة بالنظام حالياً</div>';
      }

      grid.innerHTML = html;
      if ($('psmTotalCost')) $('psmTotalCost').textContent = totalCost;
      if ($('psmTotalPaid')) $('psmTotalPaid').textContent = totalPaid;
      if ($('psmTotalRemain')) $('psmTotalRemain').textContent = Math.max(0, totalCost - totalPaid);
  };

  window.togglePackageSelection = function(pkgName) {
      let isNowSelected = false;
      if (window.tempSelectedPackages.has(pkgName)) {
          window.tempSelectedPackages.delete(pkgName);
      } else {
          window.tempSelectedPackages.add(pkgName);
          isNowSelected = true;
      }
      if (typeof AssistantSounds !== 'undefined') {
          if (isNowSelected) AssistantSounds.tap();
          else AssistantSounds.touchTick();
      }
      renderPackageSelectionGrid();
  };

  window.savePackageSelection = function() {
      const stId = window.tempSelectedStudentId;
      if (!stId || !students[stId]) return;

      students[stId].packages = Array.from(window.tempSelectedPackages);
      students[stId].lastModified = Date.now();
      
      saveAll();
      updateStudentUI(stId);
      closePackageSelectionModal();
      if(typeof showToast === 'function') showToast("تم تحديث باقات الطالب بنجاح");
  };

  // Event delegation for managePackagesBtn inside main DOMContentLoaded
  document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('#managePackagesBtn');
      if (btn) {
          const activeId = currentId || window.currentId;
          if (activeId) {
              window.openPackageSelectionModal(activeId);
          } else {
              if (typeof showToast === 'function') showToast("يرجى اختيار أو فتح ملف طالب أولاً", "err");
          }
      }
  });

}); // END DOMContentLoaded


window.openAddAsstModal = function() {
  const modal = document.getElementById("addAsstModal");
  if(modal) modal.classList.remove("hidden");
};
window.closeAddAsstModal = function() {
  const modal = document.getElementById("addAsstModal");
  if(modal) modal.classList.add("hidden");
};


window.togglePasswordVisibility = function(inputId, btnEl) {
  const inp = document.getElementById(inputId);
  if(!inp) return;
  if(inp.type === "password") {
    inp.type = "text";
    btnEl.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    btnEl.style.color = "var(--primary)";
  } else {
    inp.type = "password";
    btnEl.innerHTML = '<i class="fa-regular fa-eye"></i>';
    btnEl.style.color = "var(--text-muted)";
  }
};


// ============================================================
//  STUDIFY PREMIUM UI v2.0 — JAVASCRIPT FEATURES
// ============================================================

// ── IDEA #2: COUNT-UP ANIMATION
window.animateCountUp = function(el, target, duration = 1000) {
  if (!el || isNaN(target)) return;
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = Number(target).toLocaleString('ar-EG');
  };
  requestAnimationFrame(update);
};

// Apply count-up to all elements with data-countup attribute
function applyCountUpToStats() {
  document.querySelectorAll('[data-countup]').forEach(el => {
    const raw = parseFloat(el.getAttribute('data-countup') || el.textContent);
    if (!isNaN(raw) && raw > 0) window.animateCountUp(el, raw, 900);
  });
}

// ── IDEA #3: SIDEBAR NAV RIPPLE
document.addEventListener('click', function(e) {
  const navItem = e.target.closest('.nav-item');
  if (!navItem) return;
  const ripple = document.createElement('span');
  ripple.className = 'nav-ripple';
  const rect = navItem.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  navItem.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// ── IDEA #3: SIDEBAR TOOLTIPS — inject data-tooltip on nav items
(function initSidebarTooltips() {
  const tooltipMap = {
    'btnTabHome': 'الرئيسية',
    'btnTabStudents': 'الطلاب',
    'btnTabSessionStudents': 'طلاب الحصة',
    'btnTabPackages': 'الباقات والأسعار',
    'btnTabSyllabus': 'المنهج',
    'btnTabReports': 'التقارير',
    'btnTabInstallments': 'متابعة الأقساط',
    'btnTabBooklets': 'مخزون المذكرات',
    'btnTabMarketing': 'حملات التسويق',
    'btnTabAdmin': 'الإعدادات',
  };
  Object.entries(tooltipMap).forEach(([id, label]) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-tooltip', label);
  });
})();

// ── IDEA #6: TABLE STAGGERED ROW ANIMATIONS
window.applyTableAnimation = function(tableEl) {
  if (!tableEl) return;
  const rows = tableEl.querySelectorAll('tbody tr');
  rows.forEach((row, i) => {
    row.classList.remove('animated-row');
    row.style.animationDelay = '';
    // Force reflow then add animation
    void row.offsetWidth;
    row.style.animationDelay = (i * 45) + 'ms';
    row.classList.add('animated-row');
  });
};

// ── IDEA #10: COMMAND PALETTE (Ctrl+K)
(function initCommandPalette() {
  if (document.getElementById('cmdPalette')) return; // Already initialized

  const commands = [
    { label: 'الرئيسية', icon: 'fa-house', action: () => window.switchTab('Home') },
    { label: 'قائمة الطلاب', icon: 'fa-users', action: () => { window.switchTab('Students'); if(typeof renderList === 'function') renderList(true); } },
    { label: 'طلاب الحصة', icon: 'fa-user-check', action: () => window.switchTab('SessionStudents') },
    { label: 'الباقات والأسعار', icon: 'fa-boxes-packing', action: () => window.switchTab('Packages') },
    { label: 'المنهج الدراسي', icon: 'fa-book-open', action: () => window.switchTab('Syllabus') },
    { label: 'التقارير', icon: 'fa-chart-pie', action: () => { window.switchTab('Reports'); if(typeof renderReportsPage === 'function') renderReportsPage(); } },
    { label: 'مخزون المذكرات', icon: 'fa-book-bookmark', action: () => window.switchTab('Booklets') },
    { label: 'الإعدادات', icon: 'fa-gear', action: () => window.switchTab('Admin') },
    { label: 'حفظ البيانات', icon: 'fa-cloud-arrow-up', action: () => { if(typeof saveAll === 'function') saveAll(); } },
    { label: 'تبديل الثيم', icon: 'fa-moon', action: () => document.getElementById('topbarThemeToggle')?.click() },
    { label: 'تسجيل الخروج', icon: 'fa-right-from-bracket', action: () => document.getElementById('logoutBtn')?.click() },
  ];

  // Build DOM
  const palette = document.createElement('div');
  palette.id = 'cmdPalette';
  palette.innerHTML = `
    <div id="cmdPaletteBox">
      <input id="cmdPaletteInput" placeholder="ابحث عن أي حاجة... (اكتب اسم القسم أو الأمر)" autocomplete="off" spellcheck="false">
      <div id="cmdResults"></div>
      <div class="cmd-hint">
        <span><kbd>↑↓</kbd> للتنقل</span>
        <span><kbd>Enter</kbd> للتنفيذ</span>
        <span><kbd>Esc</kbd> للإغلاق</span>
      </div>
    </div>
  `;
  document.body.appendChild(palette);

  let selectedIdx = 0;

  function renderResults(query) {
    const resultsEl = document.getElementById('cmdResults');
    const filtered = query
      ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.icon.includes(query))
      : commands;
    selectedIdx = 0;
    resultsEl.innerHTML = filtered.length
      ? filtered.map((c, i) => `
          <div class="cmd-result-item${i === 0 ? ' selected' : ''}" data-idx="${i}">
            <div class="cmd-icon"><i class="fa-solid ${c.icon}"></i></div>
            <span>${c.label}</span>
          </div>
        `).join('')
      : '<div style="padding:20px; text-align:center; color:rgba(148,163,184,0.5);">لا توجد نتائج</div>';

    resultsEl.querySelectorAll('.cmd-result-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        filtered[i]?.action();
        closePalette();
      });
      item.addEventListener('mouseenter', () => {
        resultsEl.querySelectorAll('.cmd-result-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedIdx = i;
      });
    });
    return filtered;
  }

  function openPalette() {
    palette.classList.add('active');
    const inp = document.getElementById('cmdPaletteInput');
    inp.value = '';
    renderResults('');
    setTimeout(() => inp.focus(), 50);
  }

  function closePalette() {
    palette.classList.remove('active');
  }

  palette.addEventListener('click', e => {
    if (e.target === palette) closePalette();
  });

  document.getElementById('cmdPaletteInput').addEventListener('input', function() {
    renderResults(this.value);
  });

  document.getElementById('cmdPaletteInput').addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('.cmd-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[selectedIdx]?.click();
    } else if (e.key === 'Escape') {
      closePalette();
    }
    items.forEach((item, i) => item.classList.toggle('selected', i === selectedIdx));
    items[selectedIdx]?.scrollIntoView({ block: 'nearest' });
  });

  // Ctrl+K shortcut
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (palette.classList.contains('active')) closePalette();
      else openPalette();
    }
    if (e.key === 'Escape' && palette.classList.contains('active')) {
      closePalette();
    }
  });

  // Expose for other uses
  window.openCommandPalette = openPalette;
})();

// --- MANAGER PASSWORD RESET ---
const changeMyPasswordBtn = document.getElementById('changeMyPasswordBtn');
if (changeMyPasswordBtn) {
  changeMyPasswordBtn.addEventListener('click', async () => {
    // Hide the dropdown
    const dropdown = document.getElementById('userProfileDropdown');
    if (dropdown) dropdown.classList.add('hidden');

    const { value: newPassword } = await Swal.fire({
      title: 'تغيير كلمة المرور الخاصة بك',
      text: 'الرجاء إدخال كلمة المرور الجديدة',
      input: 'password',
      inputPlaceholder: 'كلمة المرور الجديدة',
      showCancelButton: true,
      confirmButtonText: 'تغيير',
      cancelButtonText: 'إلغاء',
      inputValidator: (value) => {
        if (!value || value.length < 1) {
          return 'يجب إدخال كلمة مرور.';
        }
      }
    });

    if (newPassword) {
      try {
        if (typeof showToast === 'function') showToast('جاري تغيير كلمة المرور...', 'info');
        const { error } = await window.supabaseClient
          .from('manager_account')
          .update({ password: newPassword })
          .eq('id', 1);
        
        if (error) throw error;
        
        if (typeof showToast === 'function') showToast('تم تغيير كلمة المرور بنجاح.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('خطأ', err.message || 'حدث خطأ أثناء تغيير كلمة المرور.', 'error');
      }
    }
  });
}

window.changeAssistantPassword = async function(userId, username) {
  // Fetch current password
  if (typeof showToast === 'function') showToast('جاري جلب بيانات المساعد...', 'info');
  const { data, error: fetchErr } = await window.supabaseClient.from('assistants').select('password').eq('username', username.toLowerCase()).single();
  
  if (fetchErr || !data) {
    return Swal.fire('خطأ', 'فشل في جلب بيانات المساعد.', 'error');
  }
  
  const oldPass = data.password;

  const { value: newPassword } = await Swal.fire({
    title: 'تغيير كلمة المرور',
    html: `
      <div style="text-align: right; margin-bottom: 15px;">كلمة المرور الحالية للمساعد <b>${username}</b> هي:</div>
      <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary); background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 20px;">${oldPass}</div>
      <div style="text-align: right; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;">أدخل كلمة المرور الجديدة أدناه، أو اتركها فارغة للإلغاء:</div>
    `,
    input: 'text',
    inputValue: oldPass,
    inputPlaceholder: 'كلمة المرور الجديدة',
    showCancelButton: true,
    confirmButtonText: 'حفظ التعديل <i class="fa-solid fa-check"></i>',
    cancelButtonText: 'إلغاء',
    inputValidator: (value) => {
      if (!value || value.trim().length < 1) {
        return 'يجب إدخال كلمة مرور.';
      }
    }
  });

  if (newPassword && newPassword !== oldPass) {
    try {
      if (typeof showToast === 'function') showToast('جاري تغيير كلمة المرور...', 'info');
      const { error } = await window.supabaseClient
        .from('assistants')
        .update({ password: newPassword })
        .eq('username', username.toLowerCase());

      if (error) {
         throw error;
      }
      if (typeof showToast === 'function') showToast('تم تغيير كلمة المرور بنجاح.', 'success');
      
      // Optionally refresh to show any changes, though not strictly needed here
      if(typeof fetchManagerAssistants === 'function') fetchManagerAssistants();
      
    } catch (err) {
      console.error(err);
      Swal.fire('خطأ', err.message || 'حدث خطأ أثناء تغيير كلمة المرور.', 'error');
    }
  }
};

/* --- PARTICLES BACKGROUND --- */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    let particles = [];
    const connectionDistance = 150;
    
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Add mouse move listeners to the login wrapper so it captures events properly
    const loginWrapper = document.getElementById('loginBox');
    if (loginWrapper) {
        loginWrapper.addEventListener('mousemove', function(event) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });
        loginWrapper.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        if (numberOfParticles > 100) numberOfParticles = 100;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 1) - 0.5;
            const directionY = (Math.random() * 1) - 0.5;
            const color = '#3b82f6'; // Primary blue tint
            
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 20) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
            ctx.fill();
        }

        update() {
            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }

            this.x += this.directionX * 0.5;
            this.y += this.directionY * 0.5;
            
            // Keep base coordinates moving slowly so the network drifts
            this.baseX += this.directionX * 0.5;
            this.baseY += this.directionY * 0.5;
            
            if(this.baseX > width) { this.baseX = width; this.directionX = -Math.abs(this.directionX); }
            if(this.baseX < 0) { this.baseX = 0; this.directionX = Math.abs(this.directionX); }
            if(this.baseY > height) { this.baseY = height; this.directionY = -Math.abs(this.directionY); }
            if(this.baseY < 0) { this.baseY = 0; this.directionY = Math.abs(this.directionY); }
            
            // Constrain actual X and Y to not drift infinitely
            if (this.x > width + 100) this.x = width + 100;
            if (this.x < -100) this.x = -100;
            if (this.y > height + 100) this.y = height + 100;
            if (this.y < -100) this.y = -100;

            this.draw();
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                    + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(30, 58, 138, ${opacityValue * 0.8})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();
});





window.updateAttendanceUIState = function() {
    const isAr = (currentLang === "ar");
    const hasSelected = !!(window.currentGlobalSubject && String(window.currentGlobalSubject).trim());

    // 1. Quick Attend Button (QR card)
    const qBtn = document.getElementById("quickAttendBtn");
    const qInput = document.getElementById("quickAttendId");
    if (qInput) {
        qInput.placeholder = hasSelected ? (isAr ? "ID (مثال: 101)" : "ID (e.g. 101)") : (isAr ? "اختر مادة أولاً" : "Select Subject First");
    }
    const qText = isAr ? "سجل حضور" : "Record";
    if (qBtn) {
        if (!hasSelected) {
            qBtn.classList.add("btn-attend-pending");
            qBtn.innerHTML = `<i class="fa-solid fa-lock" style="margin-inline-end: 6px;"></i> ${qText}`;
            qBtn.title = isAr ? "اختر مادة الحضور أولاً" : "Select attendance subject first";
        } else {
            qBtn.classList.remove("btn-attend-pending");
            qBtn.innerHTML = qText;
            qBtn.title = "";
            qBtn.style.removeProperty("background");
            qBtn.style.removeProperty("background-image");
            qBtn.style.removeProperty("color");
            qBtn.style.removeProperty("box-shadow");
            qBtn.style.removeProperty("border");
        }
    }

    // 2. Student Card Attend Button
    const stAttendBtn = document.getElementById("markTodayBtn");
    if (stAttendBtn) {
        const attendText = isAr ? "حضور" : "Present";
        if (!hasSelected) {
            stAttendBtn.classList.add("btn-attend-pending");
            stAttendBtn.innerHTML = `<i class="fa-solid fa-lock" style="margin-inline-end: 6px;"></i> ${attendText}`;
            stAttendBtn.title = isAr ? "اختر مادة الحضور أولاً من القائمة العلوية" : "Select attendance subject first from top menu";
        } else {
            stAttendBtn.classList.remove("btn-attend-pending");
            stAttendBtn.innerHTML = `<i class="fa-solid fa-user-check" style="margin-inline-end: 6px;"></i> ${attendText}`;
            stAttendBtn.title = isAr ? "تسجيل حضور الطالب اليوم" : "Mark student present today";
            stAttendBtn.style.removeProperty("background");
            stAttendBtn.style.removeProperty("background-image");
            stAttendBtn.style.removeProperty("color");
            stAttendBtn.style.removeProperty("box-shadow");
            stAttendBtn.style.removeProperty("border");
        }
    }

    // 3. Bulk Attend Button (Students List Table)
    const bulkBtn = document.getElementById("bulkAttendBtn");
    if (bulkBtn) {
        const bulkText = isAr ? "حضور" : "Present";
        if (!hasSelected) {
            bulkBtn.classList.add("btn-attend-pending");
            bulkBtn.innerHTML = `<i class="fa-solid fa-lock" style="margin-inline-end: 4px;"></i> ${bulkText}`;
            bulkBtn.title = isAr ? "اختر مادة الحضور أولاً من القائمة العلوية" : "Select attendance subject first from top menu";
        } else {
            bulkBtn.classList.remove("btn-attend-pending");
            bulkBtn.innerHTML = `<i class="fa-solid fa-user-check" style="margin-inline-end: 4px;"></i> ${bulkText}`;
            bulkBtn.title = isAr ? "تسجيل حضور الطلاب المحددين" : "Mark selected students present";
            bulkBtn.style.removeProperty("background");
            bulkBtn.style.removeProperty("background-image");
            bulkBtn.style.removeProperty("color");
            bulkBtn.style.removeProperty("box-shadow");
            bulkBtn.style.removeProperty("border");
        }
    }
};

if (typeof window.updateAttendanceUIState === 'function') {
    window.updateAttendanceUIState();
}
setTimeout(() => { if(typeof window.updateAttendanceUIState === 'function') window.updateAttendanceUIState(); }, 300);
setTimeout(() => { if(typeof window.updateAttendanceUIState === 'function') window.updateAttendanceUIState(); }, 1200);

// =============================================================================
// CLOUD DATA MONITOR REGISTRY (Mandatory Data Integrity Architecture)
// =============================================================================
window.CLOUD_MONITOR_SECTIONS = [
  {
    id: "subscription",
    label: "بيانات الاشتراك والباقة",
    localCount: () => (window.SUBSCRIPTION && window.SUBSCRIPTION.loaded ? 1 : 0),
    cloudTable: "settings (config.subscription)"
  },
  {
    id: "students",
    label: "الطلاب المسجلين",
    localCount: () => Object.values(students || {}).filter(s => s && s.id && (s.name || s.phone || s.className)).length,
    cloudTable: "students"
  },
  {
    id: "packages",
    label: "باقات الأسعار",
    localCount: () => Object.keys(groupFees || {}).length,
    cloudTable: "packages"
  },
  {
    id: "syllabus",
    label: "مفردات المنهج",
    localCount: () => (Array.isArray(syllabusData) ? syllabusData.length : 0),
    cloudTable: "settings (config.syllabus)"
  },
  {
    id: "booklets",
    label: "المذكرات والمخزن",
    localCount: () => Object.keys(bookletsStock || {}).length,
    cloudTable: "booklets"
  },
  {
    id: "attendance",
    label: "سجلات الحضور",
    localCount: () => Object.keys(attByDate || {}).length,
    cloudTable: "settings (config.att_by_date)"
  },
  {
    id: "session_students",
    label: "طلاب الحصص",
    localCount: () => Object.values(sessionStudentsByDate || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0),
    cloudTable: "settings (config.session_students_by_date)"
  },
  {
    id: "vault_transfers",
    label: "التحويلات بين الخزائن",
    localCount: () => (Array.isArray(vaultTransfers) ? vaultTransfers.length : 0),
    cloudTable: "settings (config.vault_transfers)"
  },
  {
    id: "expenses",
    label: "المصروفات المسجلة",
    localCount: () => Object.values(expensesByDate || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0),
    cloudTable: "settings (config.expenses_by_date)"
  },
  {
    id: "student_ranks",
    label: "تصنيفات الطلاب (VIP / إنذار)",
    localCount: () => Object.values(students || {}).filter(s => s && s.rank && s.rank !== 'normal').length,
    cloudTable: "settings (config.student_ranks)"
  },
  {
    id: "eval_data",
    label: "بيانات تقييم الطلاب",
    localCount: () => (evalData && Object.keys(evalData).length > 0 ? 1 : 0),
    cloudTable: "settings (config.eval_data)"
  },
  {
    id: "center_notebook",
    label: "مفكرة السنتر الذكية",
    localCount: () => {
      const val = ($("centerNotebook") ? $("centerNotebook").value : (localStorage.getItem(K_NOTEBOOK) || "")).trim();
      return val ? 1 : 0;
    },
    cloudTable: "settings (config.center_notebook)"
  }
];



// ================= NOTIFICATIONS SYSTEM =================
let notificationsList = [];

const NOTIF_PERM_TITLES = {
  'can_add_student': 'إضافة وتعديل بيانات الطلاب',
  'show_revenue': 'عرض الإيرادات والخزينة',
  'can_request_discount': 'طلب خصم أو إعفاء',
  'can_manage_packages': 'إدارة الباقات والاشتراكات',
  'can_access_settings': 'إعدادات النظام والنسخ الاحتياطي',
  'can_access_syllabus': 'خريطة المنهج الدراسي',
  'can_view_reports': 'التقارير والحسابات المالية',
  'can_access_marketing': 'حملات التسويق بالواتساب',
  'can_access_session_students': 'طلاب الحصة والغياب السريع',
  'can_access_booklets': 'إدارة ومبيعات المذكرات',
  'can_delete_student': 'حذف الطلاب'
};

function formatNotificationMessage(msg) {
  if (!msg) return '';
  let res = String(msg);
  for (const [key, label] of Object.entries(NOTIF_PERM_TITLES)) {
    res = res.replace(new RegExp('\\(' + key + '\\)', 'g'), '«' + label + '»');
    res = res.replace(new RegExp('\\b' + key + '\\b', 'g'), '«' + label + '»');
  }
  res = res.replace(/إغلاق صلاحية/g, 'تعطيل صلاحية');
  return res;
}

// Automatic cleanup of old notifications from Supabase
async function cleanupOldNotifications() {
  if (!window.supabaseClient) return;
  try {
    // 1. Delete read notifications older than 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    await window.supabaseClient.from('communications')
      .delete()
      .eq('type', 'assistant_message')
      .eq('status', 'read')
      .lte('created_at', threeDaysAgo);

    // 2. Delete all notifications older than 10 days
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    await window.supabaseClient.from('communications')
      .delete()
      .eq('type', 'assistant_message')
      .lte('created_at', tenDaysAgo);
  } catch (err) {
    // Graceful fallback
  }
}

async function fetchNotifications() {
  if (!window.supabaseClient) return;
  try {
    const { data, error } = await window.supabaseClient
      .from('communications')
      .select('*')
      .eq('type', 'assistant_message')
      .order('created_at', { ascending: false })
      .limit(30);
      
    if (!error && data) {
      notificationsList = data.map(m => ({
        id: m.id,
        message: m.message || m.title || '',
        student_id: m.student_id || '',
        target_pkg: m.target_pkg || '',
        type: m.title && m.title.includes('رفض') ? 'warning' : 'info',
        is_read: m.status === 'read',
        created_at: m.created_at || new Date().toISOString()
      }));
      renderNotifications();
    }
  } catch(e) { }
}

function renderNotifications() {
  const listEl = document.getElementById('notificationsList');
  const badgeEl = document.getElementById('notificationsBadge');
  if (!listEl || !badgeEl) return;
  
  const unreadCount = notificationsList.filter(n => !n.is_read).length;
  if (unreadCount > 0) {
    badgeEl.textContent = unreadCount;
    badgeEl.classList.remove('hidden');
  } else {
    badgeEl.classList.add('hidden');
  }
  
  if (notificationsList.length === 0) {
    const isArNotif = (currentLang === "ar");
    listEl.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 22px 12px; font-size: 0.9em;"><i class="fa-regular fa-bell-slash" style="font-size:1.8em; margin-bottom:8px; display:block; opacity:0.4;"></i>' + (isArNotif ? 'لا توجد رسائل أو إشعارات حالياً' : 'No messages or notifications currently') + '</div>';
    return;
  }
  
  listEl.innerHTML = '';
  notificationsList.forEach(n => {
    const item = document.createElement('div');
    const d = new Date(n.created_at);
    const isArNotif = (currentLang === "ar");
    const dateStr = isArNotif
      ? (d.toLocaleDateString('ar-EG') + ' ' + d.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}))
      : (d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}));
    const formattedMsg = formatNotificationMessage(n.message);
    const displayMsg = isArNotif ? formattedMsg : translateNotification(formattedMsg);
    
    const isDeactivation = formattedMsg.includes('تعطيل') || formattedMsg.includes('إغلاق') || formattedMsg.includes('رفض') || displayMsg.toLowerCase().includes('disabled');
    const isActivation = formattedMsg.includes('تفعيل') || formattedMsg.includes('قبول') || formattedMsg.includes('بنجاح') || displayMsg.toLowerCase().includes('enabled') || displayMsg.toLowerCase().includes('success');

    item.className = 'notification-item' 
      + (n.is_read ? ' is-read' : ' is-unread') 
      + (isActivation ? ' type-activation' : (isDeactivation ? ' type-warning' : ''));
    
    let iconWrap = '<div style="width:28px; height:28px; border-radius:8px; background:rgba(59,130,246,0.15); color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.9em;"><i class="fa-solid fa-bell"></i></div>';
    if (isActivation) {
      iconWrap = '<div style="width:28px; height:28px; border-radius:8px; background:rgba(16,185,129,0.15); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.9em;"><i class="fa-solid fa-shield-check"></i></div>';
    } else if (isDeactivation) {
      iconWrap = '<div style="width:28px; height:28px; border-radius:8px; background:rgba(245,158,11,0.15); color:#f59e0b; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.9em;"><i class="fa-solid fa-shield-halved"></i></div>';
    }
    
    item.innerHTML = `
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
        <div style="display: flex; align-items: flex-start; gap: 8px; flex: 1;">
          ${iconWrap}
          <div class="notif-text">
            ${displayMsg}
            ${(() => {
              const stId = n.student_id || (n.message && n.message.match(/الطالب \((\d+)\)/) ? n.message.match(/الطالب \((\d+)\)/)[1] : '');
              if (stId && students[stId]) {
                const stObj = students[stId];
                return `<div style="margin-top: 5px;">
                  <a href="javascript:void(0)" class="notif-student-pill" onclick="event.stopPropagation(); window.openStudentFromNotif('${stId}')">
                    <i class="fa-solid fa-user-check"></i> ${isArNotif ? 'فتح استمارة الطالب:' : 'Open Student:'} ${stObj.name || stId}
                  </a>
                </div>`;
              }
              return '';
            })()}
          </div>
        </div>
        <button class="btn-delete-single-notif" data-id="${n.id}" title="${isArNotif ? 'حذف هذا الإشعار' : 'Delete this notification'}" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 2px 4px; font-size: 0.85em; opacity: 0.5; transition: opacity 0.2s, color 0.2s;" onmouseenter="this.style.opacity='1'; this.style.color='#ef4444';" onmouseleave="this.style.opacity='0.5'; this.style.color='var(--text-secondary)';">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.73em; color: var(--text-secondary); padding-inline-start: 36px;">
        <span><i class="fa-regular fa-clock"></i> ${dateStr}</span>
        ${!n.is_read ? `<span class="notif-badge-new">• ${isArNotif ? 'جديد' : 'New'}</span>` : ''}
      </div>
    `;
    
    // Mark as read on item click
    item.onclick = async (e) => {
      if (e.target.closest('.btn-delete-single-notif')) return; // handled separately
      if (!n.is_read && window.supabaseClient) {
        try {
          await window.supabaseClient.from('communications').update({ status: 'read' }).eq('id', n.id);
        } catch(err) {}
        n.is_read = true;
        renderNotifications();
      }
    };
    
    // Single delete button handler
    const delBtn = item.querySelector('.btn-delete-single-notif');
    if (delBtn) {
      delBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.supabaseClient) {
          try {
            await window.supabaseClient.from('communications').delete().eq('id', n.id);
          } catch(err) {}
        }
        notificationsList = notificationsList.filter(item => item.id !== n.id);
        renderNotifications();
      };
    }
    
    listEl.appendChild(item);
  });
}

window.openStudentFromNotif = function(stId) {
  if (!stId || !students[String(stId)]) return;
  if (typeof window.showStudentCard === 'function') window.showStudentCard();
  if (typeof updateStudentUI === 'function') updateStudentUI(String(stId));
  const card = document.getElementById("studentDetailsCard") || document.querySelector(".studentCard");
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const drop = document.getElementById('notificationsDropdown');
  if (drop) drop.classList.add('hidden');
};

function setupNotificationsUI() {
  const btn = document.getElementById('notificationsToggleBtn');
  const drop = document.getElementById('notificationsDropdown');
  const markAllBtn = document.getElementById('markAllReadBtn');
  const clearReadBtn = document.getElementById('clearReadNotificationsBtn');
  const syncCloud = document.getElementById('cloudSyncIndicator');
  
  // Ensure cloudSyncIndicator is ALWAYS visible
  if (syncCloud) syncCloud.classList.remove('hidden');

  if (btn && drop) {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const willOpen = drop.classList.contains('hidden');
      
      // Close user profile dropdown if open
      document.getElementById('userProfileDropdown')?.classList.add('hidden');
      
      // NEVER hide cloud indicator!
      if (syncCloud) syncCloud.classList.remove('hidden');
      
      if (willOpen) {
        drop.classList.remove('hidden');
        fetchNotifications();
      } else {
        drop.classList.add('hidden');
      }
    };
    
    document.addEventListener('click', (e) => {
      if (!drop.contains(e.target) && !btn.contains(e.target)) {
        drop.classList.add('hidden');
      }
    });
  }
  
  if (markAllBtn) {
    markAllBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!window.supabaseClient) return;
      const unreadIds = notificationsList.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length > 0) {
        try {
          await window.supabaseClient.from('communications').update({ status: 'read' }).in('id', unreadIds);
        } catch(err) { console.error('Error marking notifications as read:', err); }
        notificationsList.forEach(n => n.is_read = true);
        renderNotifications();
        showToast("تم تحديد كافة الرسائل كمقروءة", "success");
      }
    };
  }

  if (clearReadBtn) {
    clearReadBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!window.supabaseClient) return;
      const readIds = notificationsList.filter(n => n.is_read).map(n => n.id);
      if (readIds.length === 0) {
        showToast("لا توجد رسائل مقروءة لمسحها", "info");
        return;
      }
      try {
        await window.supabaseClient.from('communications').delete().in('id', readIds);
        notificationsList = notificationsList.filter(n => !n.is_read);
        renderNotifications();
        showToast("تم مسح الرسائل المقروءة بنجاح", "success");
      } catch(err) {
        console.error('Error deleting read notifications:', err);
        showToast("فشل مسح الرسائل المقروءة", "err");
      }
    };
  }
}

function initNotificationsModule() {
  setupNotificationsUI();
  if (window.supabaseClient) {
    cleanupOldNotifications();
    fetchNotifications();
    try {
      window.supabaseClient.channel('communications_notifications_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'communications' }, payload => {
          fetchNotifications();
        })
        .subscribe();
    } catch(err) {}
  }
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initNotificationsModule);
} else {
  initNotificationsModule();
}


// =============================================================================
// ASSISTANT SUBSCRIPTION & FEATURE GATING ENGINE
// =============================================================================
window.applyAssistantSubscription = function(subData) {
  if (!subData) return;

  const today     = new Date(); today.setHours(0,0,0,0);
  const endDate   = new Date(subData.plan_end_date);  endDate.setHours(0,0,0,0);
  const startDate = new Date(subData.plan_start_date); startDate.setHours(0,0,0,0);
  const msPerDay  = 86400000;
  const daysLeft  = Math.ceil((endDate - today) / msPerDay);
  const totalDays = Math.max(1, Math.ceil((endDate - startDate) / msPerDay));
  const isActive  = (daysLeft > 0) && (subData.is_active !== false);

  window.SUBSCRIPTION = {
    loaded: true,
    isActive: isActive,
    planKey: subData.plan_key || 'monthly',
    planName: subData.plan_name || 'الخطة القياسية',
    startDate: subData.plan_start_date,
    endDate: subData.plan_end_date,
    maxStudents: subData.max_students || (subData.plan_key === 'semi_annual' ? 1000 : (subData.plan_key === 'quarterly' ? 750 : 600)),
    maxAssistants: subData.max_assistants || (subData.plan_key === 'semi_annual' ? 5 : (subData.plan_key === 'quarterly' ? 4 : 2)),
    marketingEnabled: (subData.plan_key === 'semi_annual') || !!subData.marketing_enabled,
    daysLeft: Math.max(0, daysLeft),
    totalDays: totalDays
  };

  // 1. Update Student Count in Topbar Pill
  const countEl = document.getElementById("totalStudentsCount");
  if (countEl && typeof students !== 'undefined') {
    const combinedCount = (typeof window.getTotalStudentsCombinedCount === "function") ? window.getTotalStudentsCombinedCount() : Object.values(students || {}).filter(s => s && s.id && (s.name || s.phone || s.className)).length;
    countEl.textContent = `${combinedCount} / ${window.SUBSCRIPTION.maxStudents}`;
  }

  // 2. Enforce Marketing Restriction for Assistant
  const mktBtn = document.getElementById('btnTabMarketing');
  if (mktBtn) {
    if (!window.SUBSCRIPTION.marketingEnabled) {
      mktBtn.classList.add('locked-feature');
      mktBtn.setAttribute('title', 'حملات التسويق متاحة حصرياً في الخطة الذهبية');
    } else if (typeof currentPermissions !== 'undefined' && currentPermissions.can_access_marketing !== false) {
      mktBtn.classList.remove('locked-feature');
      mktBtn.removeAttribute('title');
    }
  }

  // 3. Enforce Expiration Lock Screen (if expired)
  const lockEl = document.getElementById('assistantSubscriptionLockScreen');
  if (lockEl) {
    if (!window.SUBSCRIPTION.isActive) {
      lockEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const infoEl = document.getElementById('asstLockPlanInfo');
      if (infoEl) {
        infoEl.innerHTML = `
          <div style="background:rgba(255,255,255,0.06);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);margin-top:14px;text-align:right;">
            <div style="font-size:0.95em;color:#EF4444;font-weight:800;margin-bottom:6px;display:flex;align-items:center;gap:8px;">
              <i class="fa-solid fa-clock-rotate-left"></i> استهلاك مدة الاشتراك: 100% (0 يوم متبقي)
            </div>
            <div style="font-size:0.85em;color:#94A3B8;line-height:1.6;">
              تاريخ الانتهاء: <b style="color:#F1F5F9;">${window.SUBSCRIPTION.endDate || '—'}</b> | الباقة: <b style="color:#F1F5F9;">${window.SUBSCRIPTION.planName}</b>
            </div>
          </div>`;
      }

      // Persistent warning notification when expired
      if (!window._asstSubLockAlertShown) {
        window._asstSubLockAlertShown = true;
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'انتهاء صلاحية اشتراك النظام',
            html: `<p style="color:var(--text-secondary);margin-bottom:12px">انتهت فترة صلاحية اشتراك المركز بالكامل.</p><p style="font-size:0.9em;color:#EF4444;font-weight:700">تم تعليق العمليات التشغيلية حتى تقوم الإدارة بتجديد الباقة.</p>`,
            confirmButtonText: 'إغلاق',
            confirmButtonColor: '#2563EB',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      }
    } else {
      lockEl.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
};

// Initial subscription check on load
(async function initAssistantSubscriptionEarly() {
  try {
    if (window.supabaseClient) {
      const { data } = await window.supabaseClient.from('settings').select('config').eq('id', 1).maybeSingle();
      if (data?.config?.subscription) {
        window.applyAssistantSubscription(data.config.subscription);
      }
    }
  } catch(e) {
    console.warn('[Subscription] Early load error:', e);
  }
})();



// =============================================================================
// STUDENT SMART CONTRACT & BLANK REGISTRATION FORM ENGINE
// =============================================================================
function getNextMonthDateFormatted(baseDate) {
  const d = baseDate ? new Date(baseDate) : new Date();
  d.setMonth(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

window.openStudentContractModal = function() {
  const allStudents = window.students || (typeof students !== 'undefined' ? students : {});
  const cId = window.currentId || (typeof currentId !== 'undefined' ? currentId : null);
  if (!cId || !allStudents[cId]) {
    window.showToast("يرجى اختيار أو فتح ملف طالب أولاً لطباعة الإقرار", "warning");
    return;
  }

  const st = allStudents[cId];
  const eData = window.evalData || (typeof evalData !== 'undefined' ? evalData : {});
  const centerTitle = (eData && eData.centerName) ? eData.centerName : "المركز التعليمي";
  const managerTitle = (eData && eData.manager) ? ("إشراف أ/ " + eData.manager) : "إدارة السنتر والعمليات";
  const role = window.currentUserRole || (typeof currentUserRole !== 'undefined' ? currentUserRole : 'admin');
  const shiftMgr = localStorage.getItem("ca_current_username") || (role === 'admin' ? 'الإدارة' : 'المسؤول الميداني');
  const getToday = window.nowDateStr || (typeof nowDateStr === 'function' ? nowDateStr : (() => new Date().toISOString().split('T')[0]));
  const todayStr = getToday();
  const nextMonthStr = getNextMonthDateFormatted(new Date());

  // Calculate total package price
  let totalRequiredPrice = 0;
  const enrolledPkgs = (st.packages && st.packages.length > 0) ? st.packages : [];
  const parseNum = window.toInt || (typeof toInt === 'function' ? toInt : (v => {
    if (typeof v === 'object' && v !== null) return parseInt(v.price || 0) || 0;
    const n = parseInt(v); return isNaN(n) ? 0 : n;
  }));
  
  if (enrolledPkgs.length > 0) {
    enrolledPkgs.forEach(pkgName => {
      const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(pkgName) : { price: 0 };
      totalRequiredPrice += parseNum(pDet.price);
    });
  } else if (st.className) {
    const pDet = (typeof window.getPkgDetails === 'function') ? window.getPkgDetails(st.className) : { price: 0 };
    totalRequiredPrice = parseNum(pDet.price) || 0;
  }

  const downPayment = Math.round(totalRequiredPrice * 0.5);
  const remainPayment = totalRequiredPrice - downPayment;
  const packagesListText = enrolledPkgs.length > 0 ? enrolledPkgs.join(" + ") : (st.className || "حصة عامة");

  const contractHtml = `
    <div class="contract-single-page" style="border: 2px solid #0b192c; padding: 12px 16px; border-radius: 4px; position: relative; background: #ffffff; box-sizing: border-box; font-family: 'Cairo', sans-serif; color: #0f172a;">
      
      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0b192c; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="text-align: right; flex: 1.1;">
          <h2 style="margin: 0; font-size: 1.35em; font-weight: 900; color: #0b192c; letter-spacing: -0.3px;">${centerTitle}</h2>
          <span style="font-size: 0.82em; color: #1e3a8a; font-weight: 800;">${managerTitle} — الشؤون القانونية والطلابية</span>
        </div>
        
        <div style="text-align: center; border: 1.5px solid #0b192c; border-radius: 6px; padding: 4px 14px; background: #f8fafc; flex: 1.3;">
          <span style="font-size: 1.08em; font-weight: 900; color: #0b192c; letter-spacing: 0.3px;">إقرار وتعهّد قانوني مُلزم لتسجيل طالب</span>
          <div style="font-size: 0.68em; color: #b91c1c; font-weight: 800; margin-top: 1px;">(سند ذمة مالية وحماية حقوق الملكية الفكرية)</div>
        </div>
        
        <div style="text-align: left; font-size: 0.82em; flex: 0.9;">
          <div>كود الطالب: <strong style="font-size: 1.15em; color: #0b192c; font-family: monospace;">#${st.id}</strong></div>
          <div style="color: #475569; font-size: 0.82em; margin-top: 2px;">تاريخ التحرير: <b style="color: #0b192c;">${todayStr}</b></div>
        </div>
      </div>

      <!-- SECTION 1: STUDENT DATA TABLE -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 0.84em; border: 1.5px solid #0b192c;">
        <tbody>
          <tr>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; width: 17%; color: #0b192c;">اسم الطالب (المُقرّ):</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: 900; font-size: 1em; color: #0b192c; width: 33%;">${st.name || "—"}</td>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; width: 18%; color: #0b192c;">المرحلة / الصف الدراسي:</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; width: 32%; font-weight: 800;">${(st.className && st.className !== "عام" && st.className !== "General") ? st.className : "عام"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">رقم هاتف الطالب:</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; direction: ltr; text-align: right; font-family: monospace; font-size: 0.98em; font-weight: 700;">${st.phone || "—"}</td>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">رقم ولي الأمر المعتمد:</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; direction: ltr; text-align: right; font-family: monospace; font-size: 0.98em; font-weight: 700;">${st.parentPhone || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">المواد / الباقات المسجلة:</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: 800; color: #1e3a8a;">${packagesListText}</td>
            <td style="padding: 4px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">إجمالي قيمة الاشتراك:</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: 900; font-size: 1.05em; color: #0b192c;">${totalRequiredPrice} جنيهاً مصرياً</td>
          </tr>
        </tbody>
      </table>

      <!-- SECTION 2: INSTALLMENT SCHEDULE -->
      <div style="font-weight: 900; font-size: 0.86em; color: #0b192c; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
        <span><i class="fa-solid fa-file-invoice-dollar" style="color: #1e3a8a;"></i> خطة وجدول سداد قيمة الاشتراك المقررة:</span>
        <span style="font-size: 0.78em; color: #b91c1c; font-weight: 800;">* الأصل القانوني هو سداد كامل المبلغ (100%) فورياً عند التسجيل</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; font-size: 0.82em; border: 1.5px solid #0b192c;">
        <thead>
          <tr style="background: #0b192c; color: #ffffff;">
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: right; width: 28%;">الدفعة المقررة</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: center; width: 16%;">النسبة والصفة</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: center; width: 18%;">المبلغ المستحق</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: right; width: 38%;">الموعد والآلية الملزمة قانوناً</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: bold; background: #ffffff;">الدفعة الأولى (مقدم الحجز وتثبيت المقعد)</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; color: #0b192c; background: #ffffff;">50% إلزامي فوري</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; font-size: 1em; color: #0b192c; background: #ffffff;">${downPayment} ج</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; background: #ffffff;">تُسدد نقداً وفورياً عند تحرير هذا الإقرار لتأكيد القيد</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: bold; background: #fffbf0;">الدفعة الثانية (المتبقي — استثناء مشروط)</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; color: #b91c1c; background: #fffbf0;">50% رخصة مؤقتة</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; font-size: 1em; color: #b91c1c; background: #fffbf0;">${remainPayment} ج</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; background: #fffbf0; font-weight: 700;">تُسدد إجبارياً بحلول: <b style="color:#0b192c;">${nextMonthStr}</b> (مهلة قصوى شهر)</td>
          </tr>
        </tbody>
      </table>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 4px 8px; margin-bottom: 8px; font-size: 0.74em; color: #991b1b; line-height: 1.35; font-weight: 700;">
        <i class="fa-solid fa-triangle-exclamation"></i> تنبيه مالي مشدد: خيار تقسيم السداد رخصة استثنائية مشروطة بوفاء الدفعة الثانية في موعدها المحدد؛ وانقضاء مهلة الشهر دون سداد يُسقط الاستثناء وتُطبق الجزاءات الصارمة بالبند (2) أدناه فوراً.
      </div>

      <!-- SECTION 3: LEGAL CLAUSES -->
      <div style="background: #f8fafc; border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; margin-bottom: 8px; font-size: 0.77em; color: #0f172a; line-height: 1.45;">
        <div style="font-weight: 900; color: #0b192c; margin-bottom: 4px; font-size: 0.88em; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
          <span><i class="fa-solid fa-scale-balanced" style="color: #1e3a8a;"></i> بنود الإقرار والتعهد الرسمي المشدد (أحكام نهائية وقاطعة ملزمة قانوناً):</span>
          <span style="font-size: 0.74em; color: #b91c1c; font-weight: 800;">واجبة النفاذ الفوري</span>
        </div>
        <ol style="margin: 0; padding-right: 16px; display: flex; flex-direction: column; gap: 3px;">
          <li><strong>إقرار صحة البيانات والالتزام المالي:</strong> يُقر الطالب بصحة بياناته واختياره للباقات المحددة، ويُعد توقيعه أدناه إقراراً قاطعاً بشغل ذمته المالية بإجمالي قيمة الاشتراك كدين مستحق وواجب السداد فور تسجيله بالنظام.</li>
          <li><strong>جزاءات التأخر وسقوط المقعد:</strong> في حال التخلف عن سداد الدفعة الثانية في موعدها (خلال شهر)، يحق للمركز فوراً: (أ) حجب كارت الطالب ومنعه من دخول المحاضرات، (ب) إلغاء حجز المقعد لقوائم الانتظار، (ج) احتساب أي حضور لاحق كحصة منفردة بالحد الأقصى للتسعير دون خصمها من الاشتراك لحين سداد المتأخرات كاملاً.</li>
          <li><strong>حظر تسريب أو تصوير المذكرات (حماية ملكية فكرية مشددة):</strong> مذكرات الشرح وبنوك الأسئلة والمراجعات ملكية فكرية حصرية للمركز للاستخدام الشخصي للطالب فقط. يُحظر تماماً تصويرها أو نشرها ورقياً أو إلكترونياً (عبر تليجرام/واتساب/فيسبوك). ويترتب على أي تسريب: الفصل النهائي الفوري وسقوط كافة الرسوم مع الملاحقة القضائية بالتعويض المالي الرادع.</li>
          <li><strong>التوثيق المحاسبي الإلكتروني المعتمد:</strong> تُعد القيود والسجلات الصادرة عن منصة (Studify) حجة محاسبية وقانونية قاطعة في إثبات المعاملات والمدفوعات، وللطالب حق طلب واستلام إيصال سداد إلكتروني موثق فور دفع أي مبالغ.</li>
          <li><strong>حجية وإلزامية العقد:</strong> يُعد توقيع الطالب أدناه بمثابة موافقة نهائية، صريحة، وقطعية لا رجعة فيها على كافة الشروط والجزاءات، وتعتبر هذه الوثيقة عقداً رسمياً ملزماً يخضع لكافة الآثار القانونية المترتبة عليه.</li>
        </ol>
      </div>

      <!-- SECTION 4: SIGNATURES (2 COLUMNS ONLY: STUDENT MANDATORY & CENTER OPERATIONS) -->
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 12px; margin-top: 6px; font-size: 0.82em; align-items: stretch;">
        <div style="border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; background: #ffffff;">
          <div style="font-weight: 900; color: #0b192c; margin-bottom: 2px;">توقيع الطالب المُقرّ (إلزامي):</div>
          <div style="font-size: 0.73em; color: #64748b; margin-bottom: 16px;">أقر باطلاعي التام وموافقتي الملزمة على كافة بنود العقد والجزاءات الصارمة أعلاه</div>
          <div style="border-bottom: 1.5px dashed #0b192c; width: 100%;"></div>
          <div style="display: flex; justify-content: space-between; font-size: 0.76em; color: #0b192c; margin-top: 4px; font-weight: 800;">
            <span>اسم الطالب: ${st.name || "............................"}</span>
            <span>توقيع الطالب: ............................</span>
          </div>
        </div>

        <div style="border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; background: #f8fafc;">
          <div style="font-weight: 900; color: #0b192c; margin-bottom: 2px;">اعتماد إدارة السنتر والعمليات:</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-weight: 900; color: #1e3a8a; font-size: 0.95em;">المسؤول: ${shiftMgr}</span>
            <span style="font-size: 0.7em; color: #059669; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> قيد إلكتروني نشط ومعتمد بنظام Studify</span>
          </div>
          <div style="border-bottom: 1.5px dashed #0b192c; width: 100%;"></div>
          <div style="font-size: 0.76em; color: #0b192c; margin-top: 4px; font-weight: 800;">
            <span>تأشيرة الاعتماد والختم: ............................................................</span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 8px; padding-top: 4px; border-top: 1.5px solid #0b192c; display: flex; justify-content: space-between; align-items: center; font-size: 0.7em; color: #475569; font-weight: 700;">
        <span>وثيقة قانونية رسمية ملزمة ومسجلة إلكترونياً عبر منصة <b>Studify</b> للأنظمة التعليمية المتكاملة</span>
        <span>تاريخ التحرير والطباعة: <b>${todayStr}</b></span>
      </div>

    </div>
  `;

  const area = document.getElementById("printableContractArea");
  if (area) area.innerHTML = contractHtml;

  const modal = document.getElementById("contractModal");
  if (modal) modal.classList.remove("hidden");
};

window.openBlankContractModal = function() {
  const eData = window.evalData || (typeof evalData !== 'undefined' ? evalData : {});
  const centerTitle = (eData && eData.centerName) ? eData.centerName : "المركز التعليمي";
  const managerTitle = (eData && eData.manager) ? ("إشراف أ/ " + eData.manager) : "إدارة السنتر والعمليات";
  const getToday = window.nowDateStr || (typeof nowDateStr === 'function' ? nowDateStr : (() => new Date().toISOString().split('T')[0]));
  const todayStr = getToday();

  const blankHtml = `
    <div class="contract-single-page" style="border: 2px solid #0b192c; padding: 12px 16px; border-radius: 4px; position: relative; background: #ffffff; box-sizing: border-box; font-family: 'Cairo', sans-serif; color: #0f172a;">
      
      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0b192c; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="text-align: right; flex: 1.1;">
          <h2 style="margin: 0; font-size: 1.35em; font-weight: 900; color: #0b192c; letter-spacing: -0.3px;">${centerTitle}</h2>
          <span style="font-size: 0.82em; color: #1e3a8a; font-weight: 800;">${managerTitle} — الشؤون القانونية والطلابية</span>
        </div>
        
        <div style="text-align: center; border: 1.5px solid #0b192c; border-radius: 6px; padding: 4px 14px; background: #f8fafc; flex: 1.3;">
          <span style="font-size: 1.08em; font-weight: 900; color: #0b192c; letter-spacing: 0.3px;">استمارة تقديم وتعهّد رسمي لتسجيل طالب</span>
          <div style="font-size: 0.68em; color: #b91c1c; font-weight: 800; margin-top: 1px;">(سند ذمة مالية وحماية حقوق الملكية الفكرية)</div>
        </div>
        
        <div style="text-align: left; font-size: 0.82em; flex: 0.9;">
          <div>كود الطالب: <strong style="font-size: 1.15em; color: #0b192c;">............................</strong></div>
          <div style="color: #475569; font-size: 0.82em; margin-top: 2px;">تاريخ التحرير: <b style="color: #0b192c;">${todayStr}</b></div>
        </div>
      </div>

      <!-- SECTION 1: STUDENT DATA TABLE (BLANK) -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 0.84em; border: 1.5px solid #0b192c;">
        <tbody>
          <tr>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; width: 18%; color: #0b192c;">اسم الطالب الرباعي:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1; width: 32%;">...................................................</td>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; width: 18%; color: #0b192c;">المرحلة / الصف الدراسي:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1; width: 32%;">...................................................</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">رقم هاتف الطالب:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">...................................................</td>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">رقم ولي الأمر المعتمد:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">...................................................</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">المواد / الباقات المسجل بها:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">1- ...................... 2- ......................</td>
            <td style="padding: 5px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; color: #0b192c;">إجمالي قيمة الاشتراك:</td>
            <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-weight: 800;">....................................... جنيهاً</td>
          </tr>
        </tbody>
      </table>

      <!-- SECTION 2: INSTALLMENT SCHEDULE (BLANK) -->
      <div style="font-weight: 900; font-size: 0.86em; color: #0b192c; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
        <span><i class="fa-solid fa-file-invoice-dollar" style="color: #1e3a8a;"></i> خطة وجدول سداد قيمة الاشتراك المقررة:</span>
        <span style="font-size: 0.78em; color: #b91c1c; font-weight: 800;">* الأصل القانوني هو سداد كامل المبلغ (100%) فورياً عند التسجيل</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; font-size: 0.82em; border: 1.5px solid #0b192c;">
        <thead>
          <tr style="background: #0b192c; color: #ffffff;">
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: right; width: 28%;">الدفعة المقررة</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: center; width: 16%;">النسبة والصفة</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: center; width: 18%;">المبلغ المطلوب</th>
            <th style="padding: 4px 8px; border: 1px solid #0b192c; text-align: right; width: 38%;">الموعد والآلية الملزمة قانوناً</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: bold; background: #ffffff;">الدفعة الأولى (مقدم الحجز وتثبيت المقعد)</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; color: #0b192c; background: #ffffff;">50% إلزامي فوري</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800; background: #ffffff;">.................. ج</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; background: #ffffff;">تُسدد فورياً ونقداً لتأكيد القيد النهائي</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: bold; background: #fffbf0;">الدفعة الثانية (المتبقي — استثناء مشروط)</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 900; color: #b91c1c; background: #fffbf0;">50% رخصة مؤقتة</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800; background: #fffbf0;">.................. ج</td>
            <td style="padding: 4px 8px; border: 1px solid #cbd5e1; background: #fffbf0; font-weight: 700;">تُسدد إجبارياً خلال شهر كحد أقصى من التسجيل</td>
          </tr>
        </tbody>
      </table>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 4px 8px; margin-bottom: 8px; font-size: 0.74em; color: #991b1b; line-height: 1.35; font-weight: 700;">
        <i class="fa-solid fa-triangle-exclamation"></i> تنبيه مالي مشدد: خيار تقسيم السداد رخصة استثنائية مشروطة بوفاء الدفعة الثانية في موعدها المحدد؛ وانقضاء مهلة الشهر دون سداد يُسقط الاستثناء وتُطبق الجزاءات الصارمة بالبند (2) أدناه فوراً.
      </div>

      <!-- SECTION 3: LEGAL CLAUSES -->
      <div style="background: #f8fafc; border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; margin-bottom: 8px; font-size: 0.77em; color: #0f172a; line-height: 1.45;">
        <div style="font-weight: 900; color: #0b192c; margin-bottom: 4px; font-size: 0.88em; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
          <span><i class="fa-solid fa-scale-balanced" style="color: #1e3a8a;"></i> بنود الإقرار والتعهد الرسمي المشدد (أحكام نهائية وقاطعة ملزمة قانوناً):</span>
          <span style="font-size: 0.74em; color: #b91c1c; font-weight: 800;">واجبة النفاذ الفوري</span>
        </div>
        <ol style="margin: 0; padding-right: 16px; display: flex; flex-direction: column; gap: 3px;">
          <li><strong>إقرار صحة البيانات والالتزام المالي:</strong> يُقر الطالب بصحة بياناته واختياره للباقات المحددة، ويُعد توقيعه أدناه إقراراً قاطعاً بشغل ذمته المالية بإجمالي قيمة الاشتراك كدين مستحق وواجب السداد فور تسجيله بالنظام.</li>
          <li><strong>جزاءات التأخر وسقوط المقعد:</strong> في حال التخلف عن سداد الدفعة الثانية في موعدها (خلال شهر)، يحق للمركز فوراً: (أ) حجب كارت الطالب ومنعه من دخول المحاضرات، (ب) إلغاء حجز المقعد لقوائم الانتظار، (ج) احتساب أي حضور لاحق كحصة منفردة بالحد الأقصى للتسعير دون خصمها من الاشتراك لحين سداد المتأخرات كاملاً.</li>
          <li><strong>حظر تسريب أو تصوير المذكرات (حماية ملكية فكرية مشددة):</strong> مذكرات الشرح وبنوك الأسئلة والمراجعات ملكية فكرية حصرية للمركز للاستخدام الشخصي للطالب فقط. يُحظر تماماً تصويرها أو نشرها ورقياً أو إلكترونياً (عبر تليجرام/واتساب/فيسبوك). ويترتب على أي تسريب: الفصل النهائي الفوري وسقوط كافة الرسوم مع الملاحقة القضائية بالتعويض المالي الرادع.</li>
          <li><strong>التوثيق المحاسبي الإلكتروني المعتمد:</strong> تُعد القيود والسجلات الصادرة عن منصة (Studify) حجة محاسبية وقانونية قاطعة في إثبات المعاملات والمدفوعات، وللطالب حق طلب واستلام إيصال سداد إلكتروني موثق فور دفع أي مبالغ.</li>
          <li><strong>حجية وإلزامية العقد:</strong> يُعد توقيع الطالب أدناه بمثابة موافقة نهائية، صريحة، وقطعية لا رجعة فيها على كافة الشروط والجزاءات، وتعتبر هذه الوثيقة عقداً رسمياً ملزماً يخضع لكافة الآثار القانونية المترتبة عليه.</li>
        </ol>
      </div>

      <!-- SECTION 4: SIGNATURES (2 COLUMNS ONLY: STUDENT MANDATORY & CENTER OPERATIONS) -->
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 12px; margin-top: 6px; font-size: 0.82em; align-items: stretch;">
        <div style="border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; background: #ffffff;">
          <div style="font-weight: 900; color: #0b192c; margin-bottom: 2px;">توقيع الطالب المُقرّ (إلزامي):</div>
          <div style="font-size: 0.73em; color: #64748b; margin-bottom: 16px;">أقر باطلاعي التام وموافقتي الملزمة على كافة بنود العقد والجزاءات الصارمة أعلاه</div>
          <div style="border-bottom: 1.5px dashed #0b192c; width: 100%;"></div>
          <div style="display: flex; justify-content: space-between; font-size: 0.76em; color: #0b192c; margin-top: 4px; font-weight: 800;">
            <span>اسم الطالب: ...................................</span>
            <span>توقيع الطالب: ............................</span>
          </div>
        </div>

        <div style="border: 1.5px solid #0b192c; border-radius: 4px; padding: 6px 12px; background: #f8fafc;">
          <div style="font-weight: 900; color: #0b192c; margin-bottom: 2px;">اعتماد إدارة السنتر والعمليات:</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-weight: 900; color: #1e3a8a; font-size: 0.95em;">المسؤول: ...................................</span>
            <span style="font-size: 0.7em; color: #059669; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> قيد رسمي معتمد بنظام Studify</span>
          </div>
          <div style="border-bottom: 1.5px dashed #0b192c; width: 100%;"></div>
          <div style="font-size: 0.76em; color: #0b192c; margin-top: 4px; font-weight: 800;">
            <span>تأشيرة الاعتماد والختم: ............................................................</span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 8px; padding-top: 4px; border-top: 1.5px solid #0b192c; display: flex; justify-content: space-between; align-items: center; font-size: 0.7em; color: #475569; font-weight: 700;">
        <span>استمارة تقديم رسمية معتمدة ومسجلة إلكترونياً عبر منصة <b>Studify</b> للأنظمة التعليمية المتكاملة</span>
        <span>تاريخ التحرير والطباعة: <b>${todayStr}</b></span>
      </div>

    </div>
  `;

  const area = document.getElementById("printableContractArea");
  if (area) area.innerHTML = blankHtml;

  const modal = document.getElementById("contractModal");
  if (modal) modal.classList.remove("hidden");
};
window.printContractDocument = function() {
  const area = document.getElementById("printableContractArea");
  if (!area || !area.innerHTML.trim()) {
    return window.print();
  }

  let iframe = document.getElementById("contractPrintFrame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "contractPrintFrame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.zIndex = "-9999";
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إقرار وتعهد طالب - Studify</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        @page {
          size: A4 portrait;
          margin: 6mm 8mm;
        }
        *, *::before, *::after {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
          color: #0f172a;
          direction: rtl;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .contract-single-page {
          width: 100%;
          box-sizing: border-box;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
        }
      </style>
    </head>
    <body>
      ${area.innerHTML}
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn("Iframe print fallback to window.print():", e);
      window.print();
    }
  }, 350);
};

// Immediate Language Application
if (typeof applyLanguage === "function") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLanguage);
  } else {
    applyLanguage();
  }
}
