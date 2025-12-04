import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/scrape", async (req, res) => {
    try {
        const browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.goto("https://example.com");

        const title = await page.title();

        await browser.close();

        res.json({ title });
    } catch (err) {
        res.json({ error: err.toString() });
    }
});

app.listen(3000, () => console.log("API running on port 3000"));
