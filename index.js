import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Puppeteer Scraper API is running ✔");
});

// /scrape?url=https://example.com
app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing parameter: ?url=" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // منع الحظر عبر إضافة User-Agent حقيقي
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    const html = await page.content();

    await browser.close();

    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () =>
  console.log(`Scraper API running on port ${PORT}`)
);
