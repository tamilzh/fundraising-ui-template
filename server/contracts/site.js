import { ethers } from "ethers";
import constant from "../utils/constant.js";
import deployment from "./abi/Campaign.json" assert { type: "json" };
import { Provider } from "./provider.js";

const Contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_SITE,
  deployment.abi,
  Provider
);

function site() {}

site.getSite = async () => {
  let site = await Contract.campaignList(process.env.APP_SITE_ID);
  return {
    siteId: site.campaignId.toNumber(),
    siteName: site.campaignName,
    fundraiserId: site.sponsorId.toNumber(),
    beneficiaryId: site.beneficiaryId.toNumber(),
    artCreationPackId: site.artPackId.toNumber(),
    siteDistro: {
      fundraiserDistroMin: site.campaignDistro.sponsorDistroMin.toNumber(),
      fundraiserDistroMax: site.campaignDistro.sponsorDistroMax.toNumber(),
      beneficiaryDistroMin: site.campaignDistro.beneficiaryDistroMin.toNumber(),
      beneficiaryDistroMax: site.campaignDistro.beneficiaryDistroMax.toNumber(),
      artistDistroMin: site.campaignDistro.artistDistroMin.toNumber(),
      artistDistroMax: site.campaignDistro.artistDistroMax.toNumber(),
      sellerDistroMin: site.campaignDistro.sellerDistroMin.toNumber(),
      sellerDistroMax: site.campaignDistro.sellerDistroMax.toNumber(),
      devCutOfFundraiserDistro:
        site.campaignDistro.devCutOfSponsorDistro.toNumber(),
    },
    startsOn: site.startsOn.toNumber(),
    endsOn: site.endsOn.toNumber(),
    datesLocked: site.datesLocked,
    maxCount: site.maxCount.toNumber()
  };
};

site.isApproved = async () => {
  return await Contract.isCampaignApproved(process.env.APP_SITE_ID, 0);
};

site.getSiteByAddress = async (type, address) => {
  let sites = await Contract.getCampaignByAddress(address, type);
  return sites;
};

site.getBgPriceBySite = async () => {
  return await Contract.getBgPriceByCampaign(process.env.APP_SITE_ID, 0, 0);
};

site.getBeneficiary = async (address) => {
  let id = await Contract.getBeneficiaryByAddress(address);
  return await Contract.beneficiaryList(id);
};

site.getBeneficiaryById = async (id) => {
  return await Contract.beneficiaryList(id);
};

site.getFundraiser = async (address) => {
  let id = await Contract.getFundraiserByAddress(address);
  return await Contract.fundraiserList(id);
};

site.getFundraiserById = async (id) => {
  return await Contract.fundraiserList(id);
};

site.getSiteDistribution = async (siteDetails,artistDetails) => {
  //Please don't change slider order this will impact in distribution
  let color = constant.color;
 // let beneficiary = await Contract.beneficiaryList(siteDetails.beneficiaryId);
 // let fundraiser = await Contract.fundraiserList(siteDetails.fundraiserId);
  return [
    {
      name: constant.BENEFICIARY_DISTRO_LABEL,
      defaultValue: siteDetails.siteDistro.beneficiaryDistroMin / 100,
      min: siteDetails.siteDistro.beneficiaryDistroMin / 100,
      max: siteDetails.siteDistro.beneficiaryDistroMax / 100,
      category: "beneficiary",
    },
    {
      name: constant.ARTIST_DISTRO_LABEL,// || artistDetails?.artistName,
      defaultValue: siteDetails.siteDistro.artistDistroMin / 100,
      min: siteDetails.siteDistro.artistDistroMin / 100,
      max: siteDetails.siteDistro.artistDistroMax / 100,
      category: "artist",
    },
    {
      name: constant.FUNDRAISER_DISTRO_LABEL,// || fundraiser?.fundraiserName,
      defaultValue: siteDetails.siteDistro.fundraiserDistroMin / 100,
      min: siteDetails.siteDistro.fundraiserDistroMin / 100,
      max: siteDetails.siteDistro.fundraiserDistroMax / 100,
      category: "fundraiser",
    },
    {
      name: constant.SELLER_DISTRO_LABEL,
      defaultValue:
        100 -
        (siteDetails.siteDistro.fundraiserDistroMin +
          siteDetails.siteDistro.beneficiaryDistroMin +
          siteDetails.siteDistro.artistDistroMin) /
          100,
      min: siteDetails.siteDistro.sellerDistroMin / 100,
      max: siteDetails.siteDistro.sellerDistroMax / 100,
      category: "seller",
    },
  ];
};

site.getPresetDistribution = async () => {
  let presets = await Contract.getPresetDistributionByCampaignId(
    process.env.APP_SITE_ID
  );
  return presets
    .filter((item) => item.distroPresetId.toNumber() > 0)
    .map((preset) => {
      return {
        distroPresetId: preset.distroPresetId.toNumber(),
        presetName: preset.presetName,
        shortPresetName: `${preset.shortPresetName} Distro`,
        fundraiserDistro: preset.sponsorDistro.toNumber(),
        beneficiaryDistro: preset.beneficiaryDistro.toNumber(),
        artistDistro: preset.artistDistro.toNumber(),
        siteId: preset.campaignId.toNumber(),
        order: preset.presetOrder.toNumber()
      };
    });
};

export { site };
