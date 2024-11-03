import "./dotent-config.js";
import express from "express";
import cors from "cors";

import artAPI from "./api/artist.js";
import siteAPI from "./api/site.js";
import fundraisinAPI from "./api/fundraisin.js";
import arweaveAPI from "./api/arweave.js";
import shareAPI from "./api/share.js";
import network from "./api/network.js";
import bodyParser from "body-parser";
import { getWebsiteConfig } from "./utils/services.js";
import constant from "./utils/constant.js";
// import path from "path";
// import * as url from "url";

// const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", function (req, res) {
  res.send(process.env);
});

app.use(network);
app.use("/site", siteAPI);
app.use("/artCreationPack", artAPI);
app.use("/fundraisin", fundraisinAPI);
app.use(shareAPI);
app.use(arweaveAPI);
app.get("/configuration", async (req, res) => {
  const config = await getWebsiteConfig();
  res.send({
    "PRIMARY": config?.web_main_color,
    "SECONDARY": config?.secondary_color,
    "PRIMARY_GREY": config?.web_main_color,
    "SECONDARY_GREY": config?.secondary_color,
    "GRADIENT_LIGHT": config?.gradient_color_2,
    "GRADIENT_DARK": config?.gradient_color_1,
    "DROPDOWN_HOVER": config?.secondary_color,
    "DISABLED_CLOSE": config?.light_text_color,
    "APP_BENEFICIARY": config?.campaignData?.beneficiaries?.beneficiary_name,
    "APP_ARTIST": config?.campaignData?.aps?.artists?.artist_name,
    "APP_SPONSOR": config?.campaignData?.sponsories?.sponsor_name,
    "APP_CAMPAIGN_NAME": config?.campaign_name,
    "APP_NFT_PLURAL": config?.nft_name_plural,
    "APP_ABOUT_CARD_TITLE": config?.ct_about_main_title,
    "APP_ABOUT_CARD_DESC": config?.ct_about_main_description,
    "APP_ABOUT_CARD_TITLE1": config?.ct_about_title_1,
    "APP_ABOUT_CARD_TITLE2": config?.ct_about_title_2,
    "APP_ABOUT_CARD_TITLE3": config?.ct_about_title_3,
    "APP_ABOUT_CARD_TITLE4": config?.ct_about_title_4,
    "APP_ABOUT_CARD_DESC1": config?.ct_about_description_1,
    "APP_ABOUT_CARD_DESC2": config?.ct_about_description_2,
    "APP_ABOUT_CARD_DESC3": config?.ct_about_description_3,
    "APP_ABOUT_CARD_DESC4": config?.ct_about_description_4,
    "APP_NFT_NAME": config?.nft_name,
    "APP_DESC": config?.ct_about_main_description,
    "APP_INSTA_LINK": config?.ct_social_link_3,
    "APP_DISCORD_LINK": config?.ct_social_link_2,
    "APP_TWITTER_LINK": config?.ct_social_link_1,
    "APP_FUNDRAISIN_WEBSITE_LINK": "https://fundraisin.app",
    "APP_PURPOSE": config?.purpose,
    "DISTRO_COLOR": {
      beneficiary:  config?.beneficiary_color,
      artist:  config?.artist_color,
      sponsor:  config?.sponsor_color,
      seller:  config?.seller_color,
    }
  });
});
app.get("/constants", async (req, res) => {
  res.send({
    contract: {
      artist: process.env.CONTRACT_ADDRESS_ARTIST,
      site: process.env.CONTRACT_ADDRESS_SITE,
      rarity: process.env.CONTRACT_ADDRESS_RARITY,
      fundraisin: process.env.CONTRACT_ADDRESS_FUNDRAISIN,
    },
    NETWORK_URL: constant.NETWORK_URL,
  });
});

app.use("/", (req, res) => {
  res.send("server is  running");
});

app.listen(PORT, async () => {
  console.log(`${process.env.NODE_ENV} server listening on ${PORT}`);
});
