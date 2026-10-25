const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const fs = require("node:fs");
const matter = require("gray-matter");

const baseURL = process.env.TEST_BASE_URL || "http://localhost:3000";
let browser;
before(async () => {
    browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
});
after(async () => { await browser?.close(); });

async function session(options, run) {
    const context = await browser.newContext({ baseURL, ...options });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
        if (message.type() === "error" && /hydration|hydrated|server rendered/i.test(message.text())) errors.push(message.text());
    });
    try {
        await run(page, context);
        assert.deepEqual(errors, [], "No runtime or hydration errors");
    } finally { await context.close(); }
}

// Model the translator replacing React's text nodes with <font> wrappers.
async function translateMenu(page) {
    await page.locator("nav").evaluate(nav => {
        const walker = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            if (!node.textContent.trim() || node.parentElement.closest("font,script,style")) continue;
            const font = document.createElement("font");
            font.textContent = node.textContent;
            node.replaceWith(font);
        }
    });
}

test("translated navigation survives hover, routing, and theme changes", async () => {
    await session({}, async page => {
        await page.goto("/");
        await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
        await translateMenu(page);
        for (const route of ["about", "skills", "projects", "blog", "contact", "about"]) {
            const link = page.locator(`nav a[href="/${route}"]`);
            await link.hover();
            await link.click();
            await page.waitForURL(`**/${route}`);
            await page.locator("main h1").first().waitFor();
            await page.getByRole("button", { name: "Switch color theme", exact: true }).click();
        }
        assert.equal(await page.getByText("This page couldn't load.", { exact: true }).count(), 0);
    });
});

test("blocked storage still supports themes and navigation", async () => {
    await session({ colorScheme: "dark" }, async (page, context) => {
        await context.addInitScript(() => {
            Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
        });
        await page.goto("/");
        await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
        await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
        await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
        await page.waitForFunction(() => document.documentElement.dataset.theme === "light");
        await page.getByRole("button", { name: "Switch color theme", exact: true }).click();
        await page.locator('nav a[href="/contact"]').click();
        await page.getByRole("textbox", { name: "Terminal command" }).fill("help");
        await page.getByRole("textbox", { name: "Terminal command" }).press("Enter");
        assert.equal(await page.locator("main").isVisible(), true);
    });
});

test("invalid saved themes recover and OS changes respect explicit colors", async () => {
    await session({ colorScheme: "light" }, async (page, context) => {
        await context.addInitScript(() => {
            localStorage.setItem("mustacho-theme-mode", "broken-mode");
            localStorage.setItem("mustacho-color-theme", "broken-color");
        });
        await page.goto("/");
        await page.waitForFunction(() => document.documentElement.dataset.colorTheme === "cream");
        await page.emulateMedia({ colorScheme: "dark" });
        await page.waitForFunction(() => document.documentElement.dataset.colorTheme === "default");
        await page.getByRole("button", { name: "Switch color theme", exact: true }).click();
        await page.waitForFunction(() => document.documentElement.dataset.colorTheme === "cream");
        await page.emulateMedia({ colorScheme: "light" });
        await page.emulateMedia({ colorScheme: "dark" });
        await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
        assert.equal(await page.locator("html").getAttribute("data-color-theme"), "cream");
    });
});

test("deep-linked skill modal, mobile navigation and terminal boot work", async () => {
    await session({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }, async page => {
        await page.goto("/skills?skill=React");
        await page.getByRole("button", { name: /close/i }).click();
        await page.waitForURL("**/skills");
        await page.getByRole("button", { name: "Open Menu", exact: true }).click();
        await page.getByRole("link", { name: "Contact", exact: true }).filter({ visible: true }).click();
        await page.waitForURL("**/contact");
        await page.getByText("Mustacho Terminal v2.0", { exact: false }).waitFor();
        await page.waitForFunction(() => document.body.style.overflow !== "hidden");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "No horizontal overflow");
        await page.screenshot({ path: ".next/runtime-mobile.png", fullPage: true });
    });
});

test("all published routes, favicon and local fonts load", async () => {
    await session({}, async page => {
        const externalFonts = [];
        page.on("request", request => { if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url()); });
        const projects = JSON.parse(fs.readFileSync("src/data/projects.json", "utf8"));
        const blogs = fs.readdirSync("blogs").filter(name => /\.mdx?$/.test(name)).map(name => {
            const { data } = matter(fs.readFileSync(`blogs/${name}`, "utf8"));
            return data.id || name.replace(/\.mdx?$/, "");
        });
        for (const route of ["/", "/about", "/skills", "/projects", "/blog", "/contact", ...projects.map(p => `/projects/${p.id}`), ...blogs.map(id => `/blog/${id}`)]) {
            const response = await page.goto(route);
            assert.equal(response.status(), 200, route);
            await page.locator("main h1").first().waitFor();
        }
        for (const asset of ["/favicon.ico", "/fonts/dynapuff-latin.woff2", "/fonts/fredoka-latin.woff2"]) {
            assert.equal((await page.request.get(asset)).status(), 200, asset);
        }
        for (const route of ["/not-a-real-route", "/projects/not-a-real-project", "/blog/not-a-real-post"]) {
            const response = await page.request.get(route);
            assert.equal(response.status(), 404, route);
        }
        assert.deepEqual(externalFonts, []);
        await page.goto("/about");
        await page.locator("main h1").waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => {
            let element = document.querySelector("main h1");
            while (element) {
                if (Number(getComputedStyle(element).opacity) < 0.99) return false;
                element = element.parentElement;
            }
            return true;
        });
        await page.waitForTimeout(600); // Let the staggered decorative entrance finish before visual QA.
        await page.screenshot({ path: ".next/runtime-desktop.png", fullPage: true });
    });
});

test("optimized gallery images and animated GIF previews open and close", async () => {
    await session({}, async page => {
        for (const id of ["hungerfall", "overseer"]) {
            await page.goto(`/projects/${id}`);
            const thumbnail = page.locator('main img[alt*="asset"]').first();
            await thumbnail.scrollIntoViewIfNeeded();
            await thumbnail.evaluate(image => image.decode());
            const src = await thumbnail.getAttribute("src");
            assert.ok(id === "overseer" ? src.endsWith(".gif") : src.startsWith("/_next/image?"));
            await thumbnail.click();
            const preview = page.getByRole("img", { name: "Expanded project preview" });
            await preview.waitFor();
            await preview.evaluate(image => image.decode());
            assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
            await page.keyboard.press("Escape");
            await preview.waitFor({ state: "detached" });
            assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
        }
    });
});
