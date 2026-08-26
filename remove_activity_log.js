const fs = require('fs');

function processHtml() {
    let html = fs.readFileSync('d:/Students/index.html', 'utf8');

    // Remove Quick Activity Log Button
    html = html.replace(/<button id="quickActivityLogBtn"[\s\S]*?<\/button>\s*/, '');

    // Remove Activity Log Modal
    const modalRegex = /<div id="activityLogModal" class="modal hidden">[\s\S]*?<div id="activityLogBody"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/;
    html = html.replace(modalRegex, '');

    fs.writeFileSync('d:/Students/index.html', html, 'utf8');
    console.log('✅ Removed Activity Log UI from index.html');
}

function processAppJs() {
    let js = fs.readFileSync('d:/Students/app.js', 'utf8');

    // Remove window.logAction
    js = js.replace(/\/\/ -- Activity Log & Notifications --\s*window\.logAction = function[\s\S]*?\};\s*/, '');

    // Remove lastReadActivityTime definition
    js = js.replace(/let lastReadActivityTime = toInt\(localStorage\.getItem\("ca_last_read_activity"\) \|\| "0"\);\s*/, '');

    // Remove fetchActivityLog
    js = js.replace(/window\.fetchActivityLog = async function\(\) \{[\s\S]*?\}\s*catch\s*\(e\)\s*\{[\s\S]*?\}\s*\};\s*/, '');

    // Remove renderActivityLog and updateNotifications
    js = js.replace(/function renderActivityLog\(logs\)\s*\{[\s\S]*?\}\s*(?=\/\/ --)/, '');

    // Remove call to fetchActivityLog in switchManagerTab
    js = js.replace(/if \(typeof window\.fetchActivityLog === 'function'\) window\.fetchActivityLog\(\);\s*/g, '');

    // Remove permission logic inside applyPermissionsToAssistantUI
    js = js.replace(/\/\/ Activity Log\s*if \(p\.can_access_activity_log\) \{[\s\S]*?\} else \{[\s\S]*?\}\s*/, '');

    // Remove click listeners related to activity log
    js = js.replace(/on\("quickActivityLogBtn", "click", function\(\)\s*\{\s*if\(\$\("activityLogModal"\)\) \$\("activityLogModal"\)\.classList\.remove\("hidden"\);\s*\}\);\s*/, '');

    // Remove localStorage interaction in markAllReadBtn
    js = js.replace(/lastReadActivityTime = Date\.now\(\);\s*localStorage\.setItem\("ca_last_read_activity", lastReadActivityTime\.toString\(\)\);\s*/, '');
    js = js.replace(/fetchActivityLog\(\);\s*/, '');

    // Remove msgTabActivity UI inside dropdown
    js = js.replace(/<button class="msg-tab-btn" id="msgTabActivity"[\s\S]*?<\/button>/, '');
    
    // Remove active class toggle for msgTabActivity
    js = js.replace(/if \(\$\("msgTabActivity"\)\) \$\("msgTabActivity"\)\.classList\.add\("active"\);\s*/, '');
    
    // Remove window.fetchActivityLog inside switchMsgTab
    js = js.replace(/window\.fetchActivityLog && window\.fetchActivityLog\(\);\s*/, '');

    // Remove empty else block after removing fetchActivityLog in switchMsgTab if any
    js = js.replace(/} else \{\s*\}\s*/g, '}');

    // Remove can_access_activity_log from permGroups
    js = js.replace(/, "can_access_activity_log"/g, '');
    
    // Remove from PERMISSIONS_DEFS
    js = js.replace(/\s*\{\s*key:\s*"can_access_activity_log"[^\}]+\},?/, '');

    // Remove icon assignment in permissions generator
    js = js.replace(/else if \(p\.key\.includes\("activity"\)\) icon = "fa-list-ul";\s*/, '');

    // Remove all calls to logAction across the file!
    js = js.replace(/if \(typeof logAction === "function"\) logAction\([^;]+\);\s*/g, '');

    fs.writeFileSync('d:/Students/app.js', js, 'utf8');
    console.log('✅ Removed Activity Log logic from app.js');
}

processHtml();
processAppJs();
