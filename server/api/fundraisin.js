import express from "express";
import { artist } from "../contracts/artist.js";
import { fundRaisin } from "../contracts/fundraisin.js";
import { site } from "../contracts/site.js";
const routes = express();

routes.get("/top-nft/:walletAddress", async (req, res) => {
  let nft = await fundRaisin.getTopFundraiser(req.params.walletAddress);
  res.send(nft);
});

routes.get("/my-nft/:walletAddress", async (req, res) => {
  let nft = await fundRaisin.getMyNFTs(req.params.walletAddress);
  res.send(nft);
});

routes.get("/buy-nft/:walletAddress", async (req, res) => {
  let nft = await fundRaisin.getBuyNFTs(req.params.walletAddress, req.query);
  res.send(nft);
});

routes.get("/token/:tokenId/owner", async (req, res) => {
  let nft = await fundRaisin.getTokenOwner(req.params.tokenId);
  res.send(nft);
});

routes.get("/funds-raised/:type", async (req, res) => {
  const index = ["beneficiary", "artist", "sponsor"];
  const _site = await site.getSite();
  let name;

  if (index.indexOf(req.params.type) === 0) {
    const beneficiary = await site.getBeneficiaryById(_site.beneficiaryId);
    name = beneficiary.beneficiaryName;
  } else if (index.indexOf(req.params.type) === 1) {
    const address = await artist.getArtistWallet(_site.artCreationPackId)
    const art = await artist.getArtist(address);
    name = art.artistName;
  } else if (index.indexOf(req.params.type) === 2) {
    const fundraiser = await site.getFundraiserById(_site.fundraiserId);
    name = fundraiser.fundraiserName;
  }

  const response = await fundRaisin.getAllNFTs(
    index.indexOf(req.params.type),
    [process.env.APP_SITE_ID]
  );
  res.send({ ...response, name });
});

routes.get("/validate/:tokenId", async (req, res) => {
  let nft = await fundRaisin.getNFTByTokenId(req.params.tokenId);
  let response = await fundRaisin.getSHA256Hash(req.params.tokenId);
  //res.send({ hash: response, valid: response === nft[0]?.hashedSecret });
  res.send(response === nft[0]?.hashedSecret);
});

routes.get('/totalminted', async (req,res)=>{
  const minted = await fundRaisin.getSiteWiseMinted()
  res.send({minted});
});

export default routes;
