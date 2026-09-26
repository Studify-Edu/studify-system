const fs = require("fs");
let content = fs.readFileSync("d:/Students/admin/admin.js", "utf8");
content = content.replace("  \"exp_voda\": { ar: \"ط§ظ„ظ…ظ†طµط±ظپ ظپظˆط¯ط§ظپظˆظ†:\", en: \"Vodafone Spent:\" },\r\n,\r\n  \"exp_cash_vault\"", "  \"exp_voda\": { ar: \"ط§ظ„ظ…ظ†طµط±ظپ ظپظˆط¯ط§ظپظˆظ†:\", en: \"Vodafone Spent:\" },\r\n  \"exp_cash_vault\"");
fs.writeFileSync("d:/Students/admin/admin.js", content, "utf8");
console.log("Fixed");
