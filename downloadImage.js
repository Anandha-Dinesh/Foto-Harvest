const fs = require("fs");
const request = require("request")

var download = async function (uri, filename, callback) {
  await request.head (uri, async function(err, res, body) {
   await request(uri).pipe(fs.createWriteStream(filename)).on("close", ()=>{
    console.log("downloaded");
   });
  });
};

module.exports = download;

