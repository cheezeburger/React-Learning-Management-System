var assert = require('assert');
const puppeteer = require('puppeteer');

describe('Student - Course', async function () {
    describe('Enroll to course', function () {
        it('should change enrollment status to enrolled', async function () {
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
            await page.goto('http://localhost:3000/courses/M55OnpTqzgosiodbb5k')
            await page.waitForSelector('#enrollCourse', {visible: true});

            await page.$eval('#enrollCourse', el => {
                el.click();
            });

            await page.waitForSelector('#enrolled', {visible: true});
            const enrollText = await page.$eval('#enrolled', el => el.textContent);
            assert.equal(enrollText, 'Enrolled');
        });
    });

    describe('View curriculum', function () {
        it('should display curriculum contents', async function () {
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
            await page.goto('http://localhost:3000/courses/M55OnpTqzgosiodbb5k/curriculum/M55S-xbhKIMAHU_1DUT')
            await page.waitForSelector('#curriculumEditor', {visible: true});

            const curriculumDisplay = await page.$('#curriculumEditor');
            assert.notEqual(curriculumDisplay, null);
            browser.close();
        });
    });

    describe('View assignments', function () {
        it('should display assignment contents', async function () {
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
            await page.goto('http://localhost:3000/courses/M55OnpTqzgosiodbb5k/assignment/M55SRPpEAt9gDKwlvMA')
            await page.waitForSelector('input[name=q1]', {visible: true});

            const fieldInput = await page.$('input[name=q1]');
            assert.notEqual(fieldInput, null);
            browser.close();
        });
    });

    describe('Submit assignments', function () {
        it('should successfully submit assignment', async function () {
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
            await page.goto('http://localhost:3000/courses/M55OnpTqzgosiodbb5k/assignment/M55SRPpEAt9gDKwlvMA')
            await page.waitForSelector('input[name=q1]', {visible: true});

            await page.type('input[name=q1]', 'This is a testing.');
            await page.$eval('#submit', el => {
                el.click();
            });
            
            const submitted = await page.$('#submitted');

            assert.notEqual(submitted, null);
            browser.close();
        });
    });

    describe('View announcements', function () {
        it('should show a list of announcements', async function () {
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
            await page.goto('http://localhost:3000/dashboard');

            await page.waitForSelector('#announcements', {visible: true});
            await page.$eval('#announcements', el => {
                el.click();
            });
            
            const announcementItem = await page.$('#announcementItem');

            assert.notEqual(announcementItem, null);
            browser.close();
        });
    });

    describe('View announcements', function () {
        it('should show a list of announcements', async function () {
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
            await page.goto('http://localhost:3000/dashboard');

            await page.waitForSelector('#announcements', {visible: true});
            await page.$eval('#announcements', el => {
                el.click();
            });
            
            const announcementItem = await page.$('#announcementItem');

            assert.notEqual(announcementItem, null);
            browser.close();
        });
    });

    describe.only('View submission feedback', function () {
        it('should display instructor feedback', async function () {
            const browser = await puppeteer.launch({
                headless: false,
                executablePath:
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            });
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/login');
            await page.type('input[name=email]', 'student@gmail.com');
            await page.type('input[name=password]', '1234567890');
            await page.$eval('#login', el => {
                el.click();
            });

            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            await page.waitForSelector('#showFeedback', {visible: true});
            await page.$eval('#showFeedback', el => {
                el.click();
            });
            
            const feedback = await page.$eval('#feedback', el => el.textContent);

            assert.equal(feedback, 'Test');
            browser.close();
        });
    })
});