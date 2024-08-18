import express from "express";
import { site } from "../contracts/site.js";
import { rarity } from "../contracts/rarity.js";
import { artist } from "../contracts/artist.js";

const routes = express();


routes.get('/', async (req,res)=>{
    let sites = await site.getSite();
    res.send(sites);
});

routes.get('/approved', async (req,res)=>{
    let approved = await site.isApproved();
    res.send(approved);
});

routes.post('/distribution', async (req,res)=>{
    //let artistAddress = await artist.getArtistWallet(req.body.artCreationPackId);
    //let artistDetails = await artist.getArtist(artistAddress);
    let distribution = await site.getSiteDistribution(req.body,{});
    res.send(distribution);
});

routes.get('/:siteId/presetdistribution', async (req,res)=>{
    let preset = await site.getPresetDistribution();
    preset.sort((x, y) => x.order - y.order);
    res.send(preset);
});

routes.get('/:siteId/raritydetails', async (req,res)=>{
    let rarityList = await rarity.getRarityList()
    res.send(rarityList);
});

export default routes;