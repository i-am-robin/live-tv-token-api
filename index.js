const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("server is runing on port dsfjk");
});

app.get("/token", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // Enable request interception
    await page.setRequestInterception(true);

    let matchingURL = null;

    page.on("request", async (request) => {
      const url = request.url();
      console.log(url);

      if (url.includes("http://tv.ebox.live:8080/roarzone/") && !matchingURL) {
        matchingURL = url;
        await browser.close();
      } else {
        // Continue other requests
        request.continue();
      }
    });

    await page.goto("http://tv.ebox.live/");

    // Close the browser if no matching request is found within a certain time
    setTimeout(async () => {
      await browser.close();
    }, 5000); // Adjust the timeout value as needed

    if (matchingURL) {
      const match = matchingURL.match(/token=([^&]*)/);
      const tokenValue = match ? match[1] : null;
      res.json({ url: matchingURL, token: tokenValue });
    } else {
      res.json({ error: "No matching URL found" });
    }
  } catch (error) {
    res.json({ error: "No matching URL found" });
  }
});

app.listen("5000", () => console.log("server is runing on port 5000"));
