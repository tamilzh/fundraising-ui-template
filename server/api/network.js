import express from "express";
import { getNetwork } from "../contracts/provider.js";
import build from "../build.json" assert { type: "json" };
import constant from "../utils/constant.js";

const routes = express();

routes.get("/network", async (req, res) => {
  let sites = await getNetwork();
  res.send({ ...sites, name: constant.NETWORK_NAME , mode: process.env.NODE_ENV });
});

routes.get("/build", async (req, res) => {
  res.send(build);
});

routes.get("/avax-to-usd", async (req, res) => {
  try {
      const queryUSD = await fetch(
        "https://nomics.com/data/exchange-markets-ticker?base=AVAX&convert=USD&interval=1d&limit=1&quote=USD&start=0&status=active"
      );
      const getUSD = await queryUSD.json();
      const price = getUSD.items ? getUSD.items[0].price : 0;
      res.send({ usd: Number(price).toFixed(2) });    
  } catch (err) {
    res.send({ usd: 0, err: err });
  }
});

export default routes;
