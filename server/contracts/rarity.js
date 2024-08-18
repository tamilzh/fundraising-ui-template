import deployment from "./abi/Rarity.json" assert { type: "json" };
import { ethers } from "ethers";
import { Provider } from './provider.js';

const Contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_RARITY,
  deployment.abi,
  Provider
);

function rarity() {}

rarity.getAddress = () => {
  return process.env.CONTRACT_ADDRESS_RARITY;
};

rarity.getABI = () => {
  return deployment.abi;
};

rarity.getRarityList = async () => {
  let rarityList = await Contract.getRarityByCampaign(
    process.env.APP_SITE_ID
  );
  return rarityList
    .filter((rarity) => rarity.campaignId.toNumber() > 0)
    .map((rarity) => {
      return {
        rarityId: rarity.rarityId.toNumber(),
        siteId: rarity.campaignId.toNumber(),
        rarityType: rarity.rarityType,
        idOfType: rarity.idOfType.toNumber(),
        startsOn: rarity.startsOn.toNumber(),
        endsOn: rarity.endsOn.toNumber(),
        maxCount: rarity.maxCount.toNumber(),
        currentCount: rarity.currentCount.toNumber(),
      };
    });
};

export { rarity };
