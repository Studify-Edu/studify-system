const fs = require("fs");
const files = ["d:/Students/assistant/app.js", "d:/Students/admin/admin.js", "d:/Students/assistant/index.html", "d:/Students/admin/admin.html"];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, "utf8");

    content = content.replace(new RegExp("\x27عام\x27", "g"), "\x27بدون باقة\x27");
    content = content.replace(new RegExp("\x27General\x27", "g"), "\x27Without Package\x27");
    
    fs.writeFileSync(file, content, "utf8");
    console.log("Processed " + file);
});
