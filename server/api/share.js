import path from "path";
import * as url from "url";
import express from "express";
import fs from "fs";
import sharp from "sharp";

const __dirname = url.fileURLToPath(new URL("../../", import.meta.url));
const routes = express();

const downloadFile = async (url, name) => {
  let createFile = request(url).pipe(fs.createWriteStream(name));
  await new Promise((resolve, reject) => {
    createFile
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

routes.get("/share", async (req, res) => {
  
  const find = process.env.APP_WEBSITE_LINK;
  let replace = `https://arweave.net/${req.query.image}?${Date.now()}`;
  //Download the arweave image and resize it
  // let input_file = 'server/twitter-preview.svg'
  // let output_file = 'server/twitter-preview.png'
  // await downloadFile(`https://arweave.net/${req.query.image}`, input_file);
  // await sharp(input_file).resize({fit: sharp.fit.contain, width: 1600, height: 900}).png().toFile(output_file);
  //TODO
  //Upload the image to arweave and get the link and share in twitter

  let raw = fs.readFileSync(
    path.join(__dirname, "/client/build/index.html"),
    "utf8"
  );
  
  raw = raw.replace(new RegExp(`${find}/preview.png`, 'g'), replace); // replace all occurance
  //raw = raw.replace(new RegExp(`200`, 'g'), "400");
  raw = raw.replace(find, replace);
  res.send(raw);
});


export default routes;
