const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const fs = require("node:fs");
const matter = require("gray-matter");
const { createHash } = require("node:crypto");

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

test("projects show the placeholder and retired project pages return 404", async () => {
    await session({}, async page => {
        await page.goto("/projects");
        await page.getByText("New projects are coming soon.", { exact: true }).waitFor();
        assert.equal(await page.locator('main a[href^="/projects/"]').count(), 0);
        assert.equal(await page.locator("[data-project]").count(), 0);

        for (const id of ["charged", "recast", "chesse", "overseer", "hungerfall", "pearl", "evliyacelebi"]) {
            assert.equal((await page.request.get(`/projects/${id}`)).status(), 404, id);
        }
        const sitemap = await (await page.request.get("/sitemap.xml")).text();
        assert.ok(!sitemap.includes("https://mustacho.dev/projects/"));
        await page.goto("/skills");
        assert.equal(await page.locator('main a[href^="/projects/"]').count(), 0);
    });
});

test("each published page shares its own generated Open Graph and Twitter image", async () => {
    await session({}, async page => {
        const blogs = fs.readdirSync("blogs").filter(name => /\.mdx?$/.test(name)).map(name => {
            const { data } = matter(fs.readFileSync(`blogs/${name}`, "utf8"));
            return data.id || name.replace(/\.mdx?$/, "");
        });
        const projects = JSON.parse(fs.readFileSync("src/data/projects.json", "utf8"));
        const routes = ["/", "/about", "/skills", "/projects", "/blog", "/contact", ...blogs.map(id => `/blog/${id}`), ...projects.map(project => `/projects/${project.id}`)];
        const imageHashes = new Set();

        for (const route of routes) {
            await page.goto(route);
            const expected = `https://mustacho.dev/og/${route === "/" ? "home" : route.slice(1)}`;
            assert.equal(await page.locator('meta[property="og:image"]').count(), 1, route);
            assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"), expected, route);
            assert.equal(await page.locator('meta[name="twitter:image"]').getAttribute("content"), expected, route);
            assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"), "summary_large_image", route);
            assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute("content"), await page.locator('meta[property="og:title"]').getAttribute("content"), route);
            assert.ok(await page.locator('meta[property="og:image:alt"]').getAttribute("content"), route);
            assert.equal(await page.locator('meta[property="og:image:width"]').getAttribute("content"), "1200", route);
            assert.equal(await page.locator('meta[property="og:image:height"]').getAttribute("content"), "630", route);

            const response = await page.request.get(new URL(expected).pathname);
            assert.equal(response.status(), 200, route);
            assert.match(response.headers()["content-type"], /^image\/png/, route);
            const png = await response.body();
            assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), route);
            assert.equal(png.readUInt32BE(16), 1200, route);
            assert.equal(png.readUInt32BE(20), 630, route);
            assert.ok(png.length < 5 * 1024 * 1024, "Image fits social platform limits");
            imageHashes.add(createHash("sha256").update(png).digest("hex"));
        }

        assert.equal(imageHashes.size, routes.length, "Each page has a distinct image");
        for (const route of ["/og/not-a-real-page", "/og/blog/not-a-real-post", "/og/projects/not-a-real-project"]) {
            assert.equal((await page.request.get(route)).status(), 404, route);
        }
    });
});

async function mustachePoint(page, side) {
    return page.locator(`[data-mustache-handle="${side}"] circle`).first().evaluate(circle => {
        const point = new DOMPoint(circle.cx.baseVal.value, circle.cy.baseVal.value).matrixTransform(circle.getScreenCTM());
        return { x: point.x, y: point.y };
    });
}

async function mustacheFrame(page) {
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function nearPoint(actual, expected, message) {
    assert.ok(Math.hypot(actual.x - expected.x, actual.y - expected.y) < 2, `${message}: ${JSON.stringify({ actual, expected })}`);
}

async function openMustache(page) {
    await page.goto("/");
    await page.locator("[data-mustache]").waitFor();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("main section")).transform === "none");
}

async function waitForMustacheRest(page) {
    await page.waitForFunction(() => {
        const left = document.querySelector('[data-mustache-handle="left"] circle');
        const right = document.querySelector('[data-mustache-handle="right"] circle');
        return Math.abs(left.cx.baseVal.value - 440) < 0.1 && Math.abs(left.cy.baseVal.value - 498.9) < 0.1 &&
            Math.abs(right.cx.baseVal.value - 1099) < 0.1 && Math.abs(right.cy.baseVal.value - 499.7) < 0.1;
    });
}

for (const width of [1280, 390]) {
    test(`mustache tracks both handles outside its bounds at ${width}px`, async () => {
        await session({ viewport: { width, height: 900 } }, async page => {
            await openMustache(page);
            const originalPath = await page.locator("[data-mustache] path").getAttribute("d");
            for (const side of ["left", "right"]) {
                const start = await mustachePoint(page, side);
                const otherSide = side === "left" ? "right" : "left";
                const other = await mustachePoint(page, otherSide);
                await page.mouse.move(start.x, start.y);
                await page.mouse.down();
                const target = { x: start.x + (side === "left" ? 70 : -70), y: start.y + 110 };
                await page.mouse.move(target.x, target.y, { steps: 8 });
                await mustacheFrame(page);
                nearPoint(await mustachePoint(page, side), target, "Handle follows the pointer 1:1");
                nearPoint(await mustachePoint(page, otherSide), other, "Other half stays still");
                assert.notEqual(await page.locator("[data-mustache] path").getAttribute("d"), originalPath);
                await page.mouse.up();
                await waitForMustacheRest(page);
            }
        });
    });
}

test("mustache regrab stops the spring and keeps the same handle across the center", async () => {
    await session({}, async page => {
        await openMustache(page);
        for (let attempt = 0; attempt < 3; attempt++) {
            const start = await mustachePoint(page, "left");
            await page.mouse.move(start.x, start.y);
            await page.mouse.down();
            await page.mouse.move(start.x + 240, start.y - 45, { steps: 5 });
            await mustacheFrame(page);
            // Release, then catch the moving left handle on the right half of the SVG.
            await page.mouse.up();
            const catching = await mustachePoint(page, "left");
            await page.mouse.move(catching.x, catching.y);
            await page.mouse.down();
            await mustacheFrame(page);
            const caught = await mustachePoint(page, "left");
            const right = await mustachePoint(page, "right");
            await page.waitForTimeout(250);
            nearPoint(await mustachePoint(page, "left"), caught, "Spring stops while held");
            await page.mouse.move(catching.x - 35, catching.y + 30, { steps: 4 });
            await mustacheFrame(page);
            nearPoint(await mustachePoint(page, "left"), { x: caught.x - 35, y: caught.y + 30 }, "Regrab preserves grab offset and handle identity");
            nearPoint(await mustachePoint(page, "right"), right, "Right handle does not switch on");
            await page.mouse.up();
            await waitForMustacheRest(page);
        }
    });
});

test("mustache ignores unrelated pointers and recovers after focus or capture loss", async () => {
    await session({ reducedMotion: "reduce" }, async page => {
        await openMustache(page);
        for (const ending of ["blur", "capture"]) {
            const start = await mustachePoint(page, "left");
            await page.mouse.move(start.x, start.y);
            await page.mouse.down();
            await page.mouse.move(start.x + 60, start.y + 40);
            await mustacheFrame(page);
            const held = await mustachePoint(page, "left");
            await page.locator("[data-mustache]").evaluate(svg => {
                svg.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 99, clientX: 0, clientY: 0, buttons: 1 }));
                svg.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 99 }));
            });
            await mustacheFrame(page);
            nearPoint(await mustachePoint(page, "left"), held, "Another pointer cannot move or release this drag");
            if (ending === "blur") await page.evaluate(() => window.dispatchEvent(new Event("blur")));
            else await page.locator("[data-mustache]").evaluate(svg => { if (svg.hasPointerCapture(1)) svg.releasePointerCapture(1); });
            await page.mouse.move(start.x + 65, start.y + 45);
            await page.mouse.up();
            await waitForMustacheRest(page);
        }
    });
});

test("mustache touch drag follows the finger and resets on cancellation", async () => {
    await session({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" }, async (page, context) => {
        await openMustache(page);
        const cdp = await context.newCDPSession(page);
        const start = await mustachePoint(page, "left");
        const target = { x: start.x + 60, y: start.y + 70, id: 1 };
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...start, id: 1 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [target] });
        await mustacheFrame(page);
        nearPoint(await mustachePoint(page, "left"), target, "Touch follows finger");
        await cdp.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
        await waitForMustacheRest(page);
        assert.equal(await page.evaluate(() => window.scrollY), 0, "Pulling the mustache does not scroll the page");
    });
});
