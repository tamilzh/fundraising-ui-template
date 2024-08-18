import express from "express";
import { site } from "../contracts/site.js";
import { artist } from "../contracts/artist.js";

const artController = express();

artController.get('/:artCreationPackId/backgrounds', async (req,res)=>{
    let siteBgPrice = await site.getBgPriceBySite();
    let backgrounds = await artist.getBackgroundColor(req.params.artCreationPackId,siteBgPrice);
    res.send(backgrounds);
});

artController.get('/:artCreationPackId/patterns', async (req,res)=>{
    let patterns = await artist.getPatterns(req.params.artCreationPackId);
    res.send(patterns);
});

artController.get('/:artCreationPackId/pattern/:pattern/layers', async (req,res)=>{
    let layers = await artist.getLayers(req.params.pattern);
    res.send(layers);
});

artController.get('/:artCreationPackId/pattern/:pattern/layer/:layerId/layerchoices', async (req,res)=>{
    let layerChoices = await artist.getLayerChoices(req.params.layerId);
    res.send(layerChoices);
});

artController.get('/:artCreationPackId/approvednames', async (req,res)=>{
    let layerChoices = await artist.getApprovedNames(req.params.artCreationPackId);
    res.send(layerChoices);
});

artController.get('/:artCreationPackId/getfilterData', async (req,res)=>{
    let filterData = await artist.getfilterData(req.params.artCreationPackId);
    res.send(filterData);
});


export default artController;