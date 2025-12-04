import express from "express";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Cloudflare Scraper API ✔ works");
});

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing ?url=" });
  }

  try {
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

app.listen(PORT, () => console.log("API running on port " + PORT));
