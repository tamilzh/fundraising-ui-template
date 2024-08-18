import "./dotent-config.js";
import path from "path";
import * as url from "url";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import artAPI from "./api/artist.js";
import siteAPI from "./api/site.js";
import fundraisinAPI from "./api/fundraisin.js";
import arweaveAPI from "./api/arweave.js";
import shareAPI from "./api/share.js";
import network from "./api/network.js";

const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", function (req, res) {
  res.send("Welcome to Fund Raisin App");
});

app.use("/site", siteAPI);
app.use("/artCreationPack", artAPI);
app.use("/fundraisin", fundraisinAPI);
app.use(shareAPI);
app.use(arweaveAPI);
app.use(network);
app.get("/constants", async (req, res) => {
  res.send({
    contract: {
      artist: process.env.CONTRACT_ADDRESS_ARTIST,
      site: process.env.CONTRACT_ADDRESS_SITE,
      rarity: process.env.CONTRACT_ADDRESS_RARITY,
      fundraisin: process.env.CONTRACT_ADDRESS_FUNDRAISIN,
    },
    NETWORK_URL: process.env.NETWORK_URL
  });
});
const root = path.join(__dirname, "client", "build");
app.use(express.static(root, { lastModified: false, etag: false }));

/** All other routes redirected to front-end app */
app.get("*", function (req, res) {
  res.sendFile("index.html", { root, lastModified: false, etag: false });
});

app.listen(PORT, async () => {
  console.log(`${process.env.NODE_ENV} server listening on ${PORT}`);
});
