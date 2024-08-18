import express from "express";
import sharp from "sharp";
import fs from "fs";
import { upload, fund } from "../arweave-bundlr/index.js";
import request from "request";
import { v4 as uuidv4 } from "uuid";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const routes = express();

const changeColor = (info, destFile) => {
  const dom = new JSDOM(`<!DOCTYPE html><body></body></html>`);
  dom.window.document.body.innerHTML = fs.readFileSync(destFile, "utf8");
  let classes = dom.window.document.getElementsByClassName(info.class);
  for (let k = 0; k < classes.length; k++) {
    classes[k].style.fill = info.value;
  }
  fs.writeFileSync(destFile, dom.window.document.body.innerHTML, "utf8");
};

const changeLayer = async (data, destFile) => {
  const layerFile = `/tmp/${data.name}.svg`;
  await downloadFile(data.value, layerFile);

  const pattern = fs.readFileSync(layerFile, {
    encoding: "utf8",
    flag: "r",
  });

  const template = fs.readFileSync(destFile, {
    encoding: "utf8",
    flag: "r",
  });

  const pattern_data = pattern;
  let template_data = template;

  const pattern_style_string_start = pattern_data.indexOf("<style>");
  const pattern_style_string_end = pattern_data.indexOf("</defs>");
  const pattern_style_string = pattern_data.substring(
    pattern_style_string_start,
    pattern_style_string_end
  );

  const layer_string_identifier = '<g class="patterns">';

  const pattern_layer_string_start =
    pattern_data.indexOf(layer_string_identifier) +
    layer_string_identifier.length;
  const pattern_layer_string_end = pattern_data.lastIndexOf("</g>");
  const pattern_layer_string = pattern_data.substring(
    pattern_layer_string_start,
    pattern_layer_string_end
  );

  const template_style_identifier = "</style>";

  const template_style_insert_position =
    template_data.lastIndexOf("</style>") + template_style_identifier.length;
  template_data =
    template_data.slice(0, template_style_insert_position) +
    pattern_style_string +
    template_data.slice(template_style_insert_position);

  const template_data_insert_position = template_data.lastIndexOf("</g>");
  template_data =
    template_data.slice(0, template_data_insert_position) +
    pattern_layer_string +
    template_data.slice(template_data_insert_position);

  fs.writeFileSync(destFile, template_data, "utf8");
};

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resize = async (source, destination, w = 900, h = 900) => {
  await sharp(source)
    .resize({
      fit: sharp.fit.contain,
      width: w,
      height: h,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toFile(destination);
};

const getFilesizeInBytes = (filename) => {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
};

const processingImage = async (data, srcFile, destFile, preview = true) => {
  fs.copyFileSync(srcFile, destFile);
  let layers = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "color") {
      changeColor(data[i], destFile);
    } else {
      if (process.env.IMAGE_TYPE?.toLowerCase() === "svg") {
        await changeLayer(data[i], destFile);
      } else {
        //const originalFile = `/tmp/${process.env.CONTRACT_ADDRESS_ARTIST}-${data[i].name}`;
        //const resizeFile = `/tmp/preview-${process.env.CONTRACT_ADDRESS_ARTIST}-${data[i].name}`;
        const originalFile = `/tmp/${uuidv4()}`;
        const resizeFile = `/tmp/${uuidv4()}`;

        await downloadFile(data[i].value, originalFile);
        if (preview) {
          await resize(originalFile, resizeFile, 400, 400);
        }
        layers.push({
          input: preview ? resizeFile : originalFile,
        });
      }
    }
  }
  return layers;
};

const constructTokenURI = async (image, nftMetadata) => {
  if (Object.keys(nftMetadata).length > 0) {
    nftMetadata.image = image.original;
    nftMetadata.imagepng = image.resized;
    nftMetadata.imageType = "image/png";
    nftMetadata.license = process.env.NFT_LICENSE;
    return await upload(JSON.stringify(nftMetadata), false, "application/json");
  }
};

const uploadFileToArweave = async (finalNFTimage) => {
  const { data, file } = finalNFTimage;

  const srcFile = "server/preview.svg";
  const destFile = `/tmp/${file}`;
  const originalFile = `/tmp/${file}.${process.env.IMAGE_TYPE}`;

  const layers = await processingImage(data, srcFile, destFile, false);
  await sharp(destFile).composite(layers).jpeg().toFile(originalFile);

  const original = await upload(
    originalFile,
    true,
    process.env.IMAGE_CONTENT_TYPE
  );

  // Should be always png for twitter and social media sharing
  const resizedFile = `/tmp/${uuidv4()}.png`;
  await sharp(originalFile)
    .resize({ fit: sharp.fit.contain, width: 1600, height: 900 })
    .png()
    .toFile(resizedFile);

  const resized = await upload(resizedFile, true, "image/png");
  return { original, resized };
};

const downloadFile = async (url, path) => {
  const createFile = request(url).pipe(fs.createWriteStream(`${path}`));
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

routes.post("/preview", async (req, res) => {
  const { data, file, preview = true } = req.body;
  try {
    if (data.length > 0) {
      const srcFile = "server/preview.svg";
      const destFile = `/tmp/${file}`;
      const layers = await processingImage(data, srcFile, destFile, preview);
      const buffer = await sharp(destFile)
        .composite(layers)
        .resize({
          fit: sharp.fit.contain,
          width: 400,
          height: 400,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toBuffer();
      fs.unlinkSync(destFile);
      layers.map((file) =>  fs.unlinkSync(file.input));
      /*await sharp(destFile)
        .composite(layers)
        .resize({ fit: sharp.fit.contain, width: 900, height: 900 })
        .png()
        .toFile(`/tmp/${file}.png`);*/
      //await sharp(destFile).composite(layers).resize({fit: sharp.fit.contain, width: 900, height: 900 }).png().toFile(`/tmp/preview.png`)
      //let buffer = await sharp(`/tmp/PATTERN-01.jpg`).composite([{input: `/tmp/LAYER-01.png`}]).toBuffer();//.toFile(`/tmp/FINAL.png`)
      //const filename = `HEART_BLUE.png`;
      //await sharp(`/tmp/${filename}`).extract({ left: 3901, top: 300, width: 550, height: 550 }).toFile(`/tmp/cropped-${filename}`)
      res.send(`data:image/jpg;base64,${buffer.toString("base64")}`);
    }
  } catch (err) {
    console.error(`Error while creating preview ${err}.`);
    res.sendStatus(500);
  }
});

routes.post("/upload", async (req, res) => {
  try {
    const { finalNFTimage, nftMetadata } = req.body;
    const image = await uploadFileToArweave(finalNFTimage);
    const tokenUri = await constructTokenURI(image, nftMetadata);
    res.send({ tokenUri });
  } catch (err) {
    console.error(`Error while creating preview ${err}.`);
    res.sendStatus(500);
  }
});

routes.post("/download", async (req, res) => {
  const input_file = `/tmp/${uuidv4()}.${process.env.IMAGE_TYPE}`;
  const output_file = `/tmp/${uuidv4()}.png`;
  await downloadFile(req.body.url, input_file);
  await sharp(input_file)
    .resize({ fit: sharp.fit.contain, width: 1600, height: 900 })
    .png()
    .toFile(output_file);
  res.sendFile(output_file);
});

routes.get("/arweave-balance", async (req, res) => {
  res.send(await fund(0));
});

export default routes;
