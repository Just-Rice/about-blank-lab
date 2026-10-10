// Smoke test: loads index.html at a phone and a desktop viewport and fails on any
// console error, uncaught exception, or horizontal scrolling.
//
// Run from the repo root (needs Playwright with Chromium installed):
//   node tests/console-errors.js            # serves this folder on a local port
//   node tests/console-errors.js <url>      # or check a deployed copy
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const VIEWPORTS = [
  { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: "desktop", viewport: { width: 1366, height: 900 } },
];

function serve() {
  return new Promise(function (resolve) {
    const server = http.createServer(function (req, res) {
      const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/\/$/, "/index.html"));
      if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "Content-Type": file.endsWith(".html") ? "text/html" : "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", function () { resolve(server); });
  });
}

(async function () {
  const server = process.argv[2] ? null : await serve();
  const url = process.argv[2] || "http://127.0.0.1:" + server.address().port + "/";
  const browser = await chromium.launch();
  let failed = false;

  for (const v of VIEWPORTS) {
    const page = await browser.newPage(v);
    const errors = [];
    page.on("console", function (m) { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", function (e) { errors.push(e.message); });

    await page.goto(url, { waitUntil: "load" });
    await page.click("#themeToggle"); // exercise the page's script once
    const overflow = await page.evaluate(function () {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });

    if (overflow > 0) errors.push("page scrolls sideways by " + overflow + "px");
    console.log((errors.length ? "FAIL " : "ok   ") + v.name + (errors.length ? "\n  " + errors.join("\n  ") : ""));
    if (errors.length) failed = true;
    await page.close();
  }

  await browser.close();
  if (server) server.close();
  process.exit(failed ? 1 : 0);
})();
