var assert = require('assert');
const puppeteer = require('puppeteer');

describe('Student account', async function () {
    describe('Register as Student', function () {
        it('redirect to dashboard and display Student', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/signup');
            await page.type('input[name=name]', 'Student Testing');
            await page.type('input[name=email]', 'student@webcademy.com');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('.signup', form => {
                form.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            const url = page.url();
            const role = await page.$eval('#role', el => el.textContent);
            assert.equal(url, 'http://localhost:3000/dashboard');
            assert.equal(role, 'Student');
            browser.close();
        });
    });

    describe.only('Login as Student', function () {
        it('redirect to dashboard and display Student', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'student@webcademy.com');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('#login', el => {
                el.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            const url = page.url();
            const role = await page.$eval('#role', el => el.textContent);
            assert.equal(url, 'http://localhost:3000/dashboard');
            assert.equal(role, 'Student');
            browser.close();
        });
    });
});
