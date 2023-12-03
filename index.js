require("dotenv").config();
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

const app = require("express")();

app.get("/", async (req, res) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHORME_EXICUTEABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto("https://pptr.dev/");
  const title = await page.title();

  res.send(title);
});

app.listen(5000, () => console.log("server is runing on port 5000..."));
