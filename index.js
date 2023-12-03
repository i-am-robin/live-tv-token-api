const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({});

    const page = await browser.newPage();

    // Enable request interception
    await page.setRequestInterception(true);

    let matchingURL = null;

    page.on("request", async (request) => {
      const url = request.url();
      console.log(url);

      if (url.includes("http://tv.ebox.live:8080/roarzone/") && !matchingURL) {
        matchingURL = url;
        console.log(matchingURL);
      }

      // Continue other requests
      request.continue();
    });

    await page.goto("http://tv.ebox.live/");

    // Close the browser after a certain time
    setTimeout(async () => {
      await browser.close();
    }, 7000); // Adjust the timeout value as needed
    if (matchingURL) {
      const match = matchingURL.match(/token=([^&]*)/);
      const tokenValue = match ? match[1] : null;
      console.log(tokenValue);
      res.json({ url: matchingURL, token: tokenValue });
    } else {
      res.json({ error: "No matching URL found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
