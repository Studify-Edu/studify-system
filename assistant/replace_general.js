const fs = require("fs");
const files = ["d:/Students/assistant/app.js", "d:/Students/admin/admin.js", "d:/Students/assistant/assistant.html", "d:/Students/admin/admin.html"];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, "utf8");

    // Replace the exact instances
    content = content.replace(/"عام"/g, "\"بدون باقة\"");
    content = content.replace(/'عام'/g, "'بدون باقة'");
    content = content.replace(/"General"/g, "\"Without Package\"");
    content = content.replace(/'General'/g, "'Without Package'");
    content = content.replace(/`عام`/g, "`بدون باقة`");
    content = content.replace(/`General`/g, "`Without Package`");
    
    // Specifically fix any places where "General Manager" might have been replaced (though it uses lowercase usually, let"s check)
    content = content.replace(/general manager/gi, "general manager");
    content = content.replace(/"Without Package Notice"/g, "\"General Notice\"");
    
    fs.writeFileSync(file, content, "utf8");
    console.log("Processed " + file);
});
