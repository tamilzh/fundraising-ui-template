import { logInfo } from "./log";

export const BASE_API = 'https://fundraising-ui-template.vercel.app'
const getConstants = async () => {
  const response = await fetch(`${BASE_API}/constants`);
  const data = await response.json();
  return data;
};

const getBackgrounds = async (artCreationPackId) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${artCreationPackId}/backgrounds`
  );
  const data = await response.json();
  return data;
};

const getPatterns = async (artCreationPackId) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${artCreationPackId}/patterns`
  );
  const data = await response.json();
  return data;
};

const getLayers = async (artCreationPackId, patternId) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${artCreationPackId}/pattern/${patternId}/layers`
  );
  const data = await response.json();
  return data;
};

const getLayerChoices = async (artCreationPackId, patternId, layerId) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${artCreationPackId}/pattern/${patternId}/layer/${layerId}/layerchoices`
  );
  const data = await response.json();
  return data;
};

const getApprovedNames = async (artCreationPackId) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${artCreationPackId}/approvednames`
  );
  const data = await response.json();
  return data;
};

const getPresetDistribution = async (siteId) => {
  const response = await fetch(`${BASE_API}/site/${siteId}/presetdistribution`);
  const data = await response.json();
  return data;
};

const getRarityList = async (siteId) => {
  const response = await fetch(`${BASE_API}/site/${siteId}/raritydetails`);
  const data = await response.json();
  return data;
};

const isApproved = async () => {
  const response = await fetch(`${BASE_API}/site/approved`);
  const data = await response.json();
  return data;
};

const getSite = async () => {
  const response = await fetch(`${BASE_API}/site`);
  const data = await response.json();
  return data;
};

const getSiteDistribution = async (siteDetails) => {
  const response = await fetch(`${BASE_API}/site/distribution`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(siteDetails),
  });
  const data = await response.json();
  return data;
};

const getFilterData = async (siteDetails) => {
  const response = await fetch(
    `${BASE_API}/artCreationPack/${siteDetails.artCreationPackId}/getfilterData`
  );
  const data = await response.json();
  return data;
};

const getBuyNFT = (walletAddress, page, limit) => {
  const pagination = page && limit ? `?page=${page}&limit=${limit}` : "";
  const controller = new AbortController();
  const signal = controller.signal;
  const promise = new Promise(async (resolve) => {
    try {
      const response = await fetch(
        `${BASE_API}/fundraisin/buy-nft/${walletAddress}${pagination}`,
        {
          method: "get",
          signal,
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      if (error && error.name === "AbortError") {
        logInfo(`IGNORE: ${error.message}`);
      }
    }
  });
  promise.cancel = () => controller.abort();
  return promise;
};

const getPreviewImage = (body) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const promise = new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_API}/preview`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
        signal,
      });
      const data = await response.text();
      resolve(data);
    } catch (error) {
      if (error && error.name === "AbortError") {
        logInfo(`IGNORE: ${error.message}`);
        reject({});
      }
    }
  });
  promise.cancel = () => controller.abort();
  return promise;
};

const getTokenOwner = async (tokenId) => {
  const response = await fetch(`${BASE_API}/fundraisin/token/${tokenId}/owner`);
  const data = await response.text();
  return data;
};

const getTopFundraiser = async (walletAddress) => {
  const response = await fetch(`${BASE_API}/fundraisin/top-nft/${walletAddress}`);
  const data = await response.json();
  return data;
};

const getMyNFT = async (walletAddress) => {
  const response = await fetch(`${BASE_API}/fundraisin/my-nft/${walletAddress}`);
  const data = await response.json();
  return data;
};

const getTotalMinted = async () => {
  const response = await fetch(`/fundraisin/totalminted`);
  const data = await response.json();
  return data;
};

export {
  getConstants,
  getBackgrounds,
  getPatterns,
  getLayers,
  getLayerChoices,
  getApprovedNames,
  getPresetDistribution,
  getRarityList,
  isApproved,
  getSite,
  getSiteDistribution,
  getFilterData,
  getBuyNFT,
  getTopFundraiser,
  getMyNFT,
  getTokenOwner,
  getTotalMinted,
  getPreviewImage,
};
