const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('pageerror', function(err) {
            console.log('Page error: ' + err.toString());
        });
        page.on('console', msg => console.log('Console:', msg.text()));
        
        await page.goto('file:///d:/Students/index.html', {waitUntil: 'networkidle0'});
        await browser.close();
    } catch (e) {
        console.error("Puppeteer error:", e);
    }
})();
