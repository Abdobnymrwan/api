import express from "express";
import puppeteer from "puppeteer-core";
import { locateChrome } from "@puppeteer/browsers";

const app = express();
const PORT = process.env.PORT || 3000;

// تحديد المتصفح الذي تم تحميله في Render
const chromiumPath = await locateChrome({
  cacheDir: "/opt/render/.cache/puppeteer", 
  browser: "chromium",
  buildId: "stable"
}).then(x => x.executablePath);

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "missing ?url=" });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: chromiumPath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (err) {
    res.json({ error: err.toString() });
  }
});

app.listen(PORT, () => console.log("Scraper started on port", PORT));
