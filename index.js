import express from "express";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Playwright Scraper API running ✔");
});

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing ?url=" });
  }

  try {
    const browser = await chromium.launch({
      args: ["--no-sandbox"],
      headless: true
    });

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    });

    await page.goto(url, { waitUntil: "networkidle", timeout: 0 });

    const html = await page.content();

    await browser.close();

    res.send(html);
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

app.listen(PORT, () => console.log("Scraper Online on port " + PORT));
