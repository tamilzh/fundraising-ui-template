import express from "express";
import { getNetwork } from "../contracts/provider.js";
import build from "../build.json" assert { type: "json" };
const routes = express();

routes.get("/network", async (req, res) => {
  let sites = await getNetwork();
  res.send({ ...sites, name: process.env.NETWORK_NAME, mode: process.env.NODE_ENV });
});

routes.get("/build", async (req, res) => {
  res.send(build);
});

routes.get("/avax-to-usd", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      const queryUSD = await fetch(
        "https://nomics.com/data/exchange-markets-ticker?base=AVAX&convert=USD&interval=1d&limit=1&quote=USD&start=0&status=active"
      );
      const getUSD = await queryUSD.json();
      const price = getUSD.items ? getUSD.items[0].price : 0;
      res.send({ usd: Number(price).toFixed(2) });
    } else {
      res.send({ usd: 0 });
    }
  } catch (err) {
    res.send({ usd: 0, err: err });
  }
});

export default routes;
