const express = require("express");
const bodyParser = require("body-parser");
const scrapeImage = require("./scrapeImage");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", scrapeImage);

app.get("/Download", (req, res) => {
  res.sendFile(__dirname + "/Public/outputpage.html");
});

app.get("/Download:Images.zip", (req, res) => {
  const filePath = __dirname + "/output/Images.zip";
  res.download(filePath, "Images.zip", (err) => {
    if (err) {
      res.send({
        error: err,
        msg: "Problem downloading the file",
      });
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log("server is running in port 4000");
});
