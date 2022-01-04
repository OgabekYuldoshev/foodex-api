const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const puppeteer = require('puppeteer');

nunjucks.configure({
    autoescape: true
});

const maxRunningTime = 60 * 60 * 1000;
let browser = null;

const getBrowser = async () => {
    if (browser) {
        return browser;
    }
    browser = await puppeteer.launch({
        // userDataDir: __dirname + path.sep + '..' + path.sep + '..' + path.sep + '..' + path.sep + 'static' + path.sep + 'browser-data',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-web-security'
        ],
        // dumpio: true
    });
    browser.__BROWSER_START_TIME_MS__ = Date.now();
    return browser;
};

const cleanup = async (browser) => {
    if ((Date.now() - browser.__BROWSER_START_TIME_MS__) >= maxRunningTime) {
        await getBrowser();
    }
};

const generator = async ({ dir, filePath, content }) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    const htmlContent = await html({ content });

    return new Promise((resolve, reject) => {
        image({ content: htmlContent, filePath })
            .then(() => resolve(filePath))
            .catch((e) => reject(e));
    });
};

const image = async ({ filePath, content }) => {
    let page = null;
    try {
        const browser = await getBrowser();
        page = await browser.newPage();
        await page.setViewport({ width: 595, height: 842, deviceScaleFactor: 2 });
        await page.setContent(content, { waitUntil: ['domcontentloaded', 'load'] });
        const element = await page.$('body');
        await element.screenshot({
            path: filePath,
            type: 'png'
        });
    } finally {
        if (page) {
            await page.close();
            page = null;
        }
        await cleanup(browser);
    }
};

const html = ({ content }) => {
    nunjucks.configure(path.join(__dirname, '/view'), {
        autoescape: true,
    });

    return new Promise((resolve) => {
        resolve(nunjucks.render('index.html', content));
    });
};

module.exports = generator;
