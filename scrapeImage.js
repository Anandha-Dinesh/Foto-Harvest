const puppeteer = require("puppeteer");
var zipper = require("zip-local");
const fsExtra = require('fs-extra');
const download = require("./downloadImage");

const scrapeImage = async (req, res) => {
  let info = {
    keyword: req.body.searchKeyword,
    count: req.body.imageCount,
  };
  if (
    info.keyword === "" ||
    null ||
    undefined ||
    info.count === "" ||
    null ||
    undefined
  ) {
    res.status(400).json({ Message: "Pls give all inputs" });
  } else {
    
    fsExtra.emptyDirSync(__dirname+"/images");
    fsExtra.emptyDirSync(__dirname+"/output");
    let browser;
    if (!browser) {
      browser = await puppeteer.launch({ headless: false });
    }

    const page = await browser.newPage();

    const URL = "https://www.google.com/imghp?hl=EN";
    await page.goto(encodeURI(URL), { waitUntil: ["networkidle2"] });
    await page.waitForSelector("#APjFqb");
    await page.type("#APjFqb", info.keyword);
    await page.keyboard.press("Enter");

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    for (let i = 0; i < Number(info.count); i++) {
      try {
        let scrs = await page.$$(".rg_i");
        await scrs[i]
          .click({
            waitUntil: "networkidle0",
          })
          .then(async () => {
            await page.reload();

            let imgUrl = await page.$$(".iPVvYb");
            let imgDwnUrl = await (
              await imgUrl[0].getProperty("src")
            ).jsonValue();
            console.log(imgDwnUrl);
            download(imgDwnUrl, `./images/image-${i}.png`, function () {
              console.log("done");
            });
            await page.click(".eMY8cf");
          });
      } catch (error) {
        console.log("");
      }
    }
    await browser.close();
    zipper.sync.zip("./images/").compress().save("./output/Images.zip");
    res.redirect("/Download");
    console.log("Completed");
  }
};

module.exports = scrapeImage;
