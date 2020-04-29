var assert = require('assert');
const puppeteer = require('puppeteer');

describe('Admin account', async function () {
    describe('Register as admin', function () {
        it('redirect to dashboard and display admin', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/signup');
            await page.type('input[name=name]', 'Instructor Testing');
            await page.type('input[name=email]', 'instructor@webcademy.com');
            await page.type('input[name=password]', '1234567890');
            await page.type('input[name=referrer]', 'INSTR');
            await page.$eval('.signup', form => {
                form.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            const url = page.url();
            const role = await page.$eval('#role', el => el.textContent);
            assert.equal(url, 'http://localhost:3000/dashboard');
            assert.equal(role, 'Admin');
            browser.close();
        });
    });

    describe('Login as admin', function () {
        it('redirect to dashboard and display admin', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'instructor@webcademy.com');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('.login', el => {
                el.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            const url = page.url();
            const role = await page.$eval('#role', el => el.textContent);
            assert.equal(url, 'http://localhost:3000/dashboard');
            assert.equal(role, 'Admin');
            browser.close();
        });
    });

    describe('Create announcements', function () {
        it('should successfully create a new announcement', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });

            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'instructor@webcademy.com');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('#login', el => {
                el.click();
            });

            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.goto('http://localhost:3000/announcement/add');

            await page.waitForSelector('.rs-picker-toggle', {visible: true});
            await page.select('.rs-picker-toggle', 'SpongeBob Certification');
            await page.type('textarea[name=announcement]', 'Test');

            const announcementItem = await page.$('#announcementItem');

            assert.equal(announcementItem, 'Testing');
            browser.close();
        });
    });

    describe('Edit course', function () {
        it('successfully edit course', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'shaneyo@1utar.my');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('#login', el => {
                el.click();
            });

            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.goto('http://localhost:3000/dashboard');

            await page.waitForSelector('#editBtn', {visible: true});
            await page.$eval('#editBtn', el => {
                el.click();
            });

            await page.waitForSelector('input[name=title]', {visible: true});
            await page.type('input[name=title]', ' Course');
            await page.$eval('#saveBtn', el => {
                el.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            const title = await page.$eval('#title', el => el.textContent);

            assert.equal(title, 'SpongeBob Certification Course');
            browser.close();
        });
    });

    describe.onl('Review assignment', function () {
        it('successfully review submission', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'shaneyo@1utar.my');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('#login', el => {
                el.click();
            });

            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await page.goto('http://localhost:3000/submissions');

            await page.waitForSelector('#reviewBtn', {visible: true});
            await page.$eval('#reviewBtn', el => {
                el.click();
            });

            await page.waitForSelector('textarea[name=comments]', {visible: true});
            await page.type('textarea[name=comments]', 'Test');
            await page.type('input[name=marks]', '80');

            await page.$eval('#submitBtn', el => {
                el.click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            const status = await page.$eval('#status', el => el.textContent);

            assert.equal(status, 'Reviewed');
            browser.close();
        });
    });
});
