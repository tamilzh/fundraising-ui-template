import { ethers, utils } from "ethers";
import deployment from "./abi/FundRaisin.json" assert { type: "json" };
import constant from "../utils/constant.js";
import { db as gcpDS } from "../db/datastore.js";
import db from "../db/db.js";
import { Provider } from "./provider.js";

const Contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_FUNDRAISIN,
  deployment.abi,
  Provider
);

function fundRaisin() {}

const getTokenMetaDataLocal = async (tokenId) => {
  try {
    let metadata = await db.get(
      `${process.env.CONTRACT_ADDRESS_FUNDRAISIN}-${tokenId}`
    );
    return metadata;
  } catch (e) {
    let tokenURI = await Contract.tokenURI(tokenId);
    console.log(`Token Id ${tokenId} URI : ${tokenURI}`);
    const response = await fetch(tokenURI);
    const data = await response.json();
    if (response.status !== 200 && response.status !== 202)
      throw Error(data.message);
    try {
      await db.put(
        `${process.env.CONTRACT_ADDRESS_FUNDRAISIN}-${tokenId}`,
        data
      );
      return data;
    } catch (err) {
      return data;
    }
  }
};

const getTokenMetaData = async (tokenId) => {
  if (process.env.NODE_ENV === "local") {
    const metadata = await getTokenMetaDataLocal(tokenId);
    return metadata;
  }
  try {
    const metadata = await gcpDS.get(
      "metadata",
      `${process.env.CONTRACT_ADDRESS_FUNDRAISIN}-${tokenId}`
    );
    if (metadata) {
      return metadata;
    } else {
      console.log(`storing ${tokenId} to datastore `);
      let tokenURI = await Contract.tokenURI(tokenId);
      const response = await fetch(tokenURI);
      const data = await response.json();
      if (response.status !== 200 && response.status !== 202)
        throw Error(data.message);

      try {
        await gcpDS.put(
          "metadata",
          `${process.env.CONTRACT_ADDRESS_FUNDRAISIN}-${tokenId}`,
          data
        );
        return data;
      } catch (err) {
        return data;
      }
    }
  } catch (e) {
    console.log("error into db" + e);
  }
};

const constructNftMetadata = async (nft, owner) => {
  let color = constant.color;
  let metadata = await getTokenMetaData(nft.tokenId.toNumber());

  return {
    id: nft.campaignTokenIndex.toNumber() - 1,
    tokenId: nft.tokenId.toNumber(),
    siteTokenIndex: nft.campaignTokenIndex.toNumber(),
    image: metadata.image,
    imagepng: metadata.imagepng || "",
    name: metadata.name,
    address: owner,
    pieData: [
      {
        value: metadata.presetDistribution
          ? metadata.presetDistribution.beneficiaryDistro / 100
          : 0,
      },
      {
        value: metadata.presetDistribution
          ? metadata.presetDistribution.artistDistro / 100
          : 0,
      },
      {
        value: metadata.presetDistribution
          ? metadata.presetDistribution.sponsorDistro / 100
          : 0,
      },
      {
        value: metadata.presetDistribution
          ? metadata.presetDistribution.sellerDistro / 100
          : 0,
      },
    ],
    distPresetName: metadata.presetDistribution
      ? metadata.presetDistribution.presetName
      : "",
    price: Number(Number(ethers.utils.formatEther(nft.price)).toFixed(2)),
    originalPrice: nft.lastPrice
      ? Number(Number(ethers.utils.formatEther(nft.lastPrice)).toFixed(2))
      : 0,
    metadata: metadata,
    currentOwner: owner,
    mintedAt: nft.mintedAt ? nft.mintedAt.toNumber() : 0,
    forSale: nft.forSale,
    bgColor: metadata.attributes[0].value,
    pattern: metadata.attributes[1].value,
    numberOfTransfers: nft.numberOfTransfers.toNumber(),
    sold: !nft.forSale,
    totalValue: Number(
      Number(ethers.utils.formatEther(nft.totalFunded)).toFixed(2)
    ),
    /** add any additional details required */
  };
};

fundRaisin.getAddress = () => {
  return process.env.REACT_APP_FUNDRAISIN_ADDRESS;
};

fundRaisin.getABI = () => {
  return FundRaisin.abi;
};

fundRaisin.getTopFundraiser = async (walletAddress) => {
  let nftList = [];
  for (const i of Array.from(
    { length: constant.MAX_TOP_LIST },
    (_, i) => i + 1
  )) {
    let nft = await Contract.top(process.env.APP_SITE_ID, i);
    if (nft.campaignTokenIndex.toNumber() > 0) {
      nft = await Contract.nftByCampaign(
        process.env.APP_SITE_ID,
        nft.campaignTokenIndex.toNumber()
      );
      let owner = await Contract.ownerOf(nft.tokenId.toNumber()); // nft.currentOwner;
      let _nftMetaData = await constructNftMetadata(nft, owner);
      nftList.push(
        Object.assign(_nftMetaData, {
          owned: walletAddress === _nftMetaData.currentOwner,
        })
      );
    }
  }
  nftList.sort((x, y) => y.totalValue - x.totalValue);
  return nftList;
};

fundRaisin.getTokenOwner = async (tokenId) => {
  try {
    return await Contract.ownerOf(tokenId);
  } catch (err) {
    return "";
  }
};

fundRaisin.getMyNFTs = async (wallet) => {
  let lasttimestamp = -1;
  let nftList = [];
  let nfts = [];
  let count = 0;
  if (wallet) {
    nfts = await Contract.getCampaignNfts(
      process.env.APP_SITE_ID,
      constant.MY_NFT_MODE,
      wallet != 0 ? wallet : ethers.constants.AddressZero
    );
    nfts = nfts.filter((item) => item.tokenId.toNumber() > 0);
    for (const nft of nfts) {
      count++;
      if (nft.tokenId.toNumber() > 0) {
        let _nftMetaData = await constructNftMetadata(nft, wallet);
        lasttimestamp =
          _nftMetaData.mintedAt && _nftMetaData.mintedAt > lasttimestamp
            ? _nftMetaData.mintedAt
            : lasttimestamp;
        nftList.push(_nftMetaData);
      }
    }
  }
  nftList.sort((x, y) => y.mintedAt - x.mintedAt);
  return { newest: lasttimestamp, data: nftList };
};

fundRaisin.getBuyNFTs = async (wallet, query) => {
  let nfts = await Contract.getCampaignNfts(
    process.env.APP_SITE_ID,
    constant.ALL_NFT_MODE,
    wallet != 0 ? wallet : ethers.constants.AddressZero
  );
  nfts = nfts.filter((item) => item.tokenId.toNumber() > 0);
  let totalNfts = nfts.length;
  let page = query?.page || 1;
  let limit = query?.limit || totalNfts;
  nfts = nfts.slice(page * limit - limit, page * limit);
  let lasttimestamp = -1;
  let nftList = [];
  for (const nft of nfts) {
    if (nft.tokenId.toNumber() > 0) {
      let owner = nft.currentOwner;
      //let owner = await Contract.ownerOf(nft.tokenId.toNumber());
      let _nftMetaData = await constructNftMetadata(nft, owner);
      lasttimestamp =
        _nftMetaData.mintedAt && _nftMetaData.mintedAt > lasttimestamp
          ? _nftMetaData.mintedAt
          : lasttimestamp;
      nftList.push(_nftMetaData);
    }
  }
  return {
    newest: lasttimestamp,
    data: nftList,
    totalNfts,
    queried: nftList.length,
  };
};

fundRaisin.salesHistory = async () => {
  try {
    let eventContract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS_FUNDRAISIN,
      [constant.BUY_ABI],
      Provider
    );
    let filters = eventContract.filters.Buy(walletAddress);
    let link = `${constant.SNOWTRACE_API}?module=logs`;
    link = `${link}&action=${constant.SNOWTRACE_GET_LOGS}`;
    link = `${link}&address=${filters.address}`;
    link = `${link}&topic0=${filters.topics[0]}`;
    link = `${link}&topic1=${filters.topics[1]}`;
    let salesHistory = await fetch(link)
      .then((response) => {
        let result = response.json();
        return result;
      })
      .then((responseBody) => {
        let history = [];
        if (responseBody.result) {
          let iface = new ethers.utils.Interface([constant.BUY_ABI]);
          // eslint-disable-next-line
          history = responseBody.result.map((token) => {
            let buy = iface.parseLog(token).args;
            if (buy[2].toNumber() === process.env.APP_SITE_ID) {
              return {
                buyer: buy[1],
                tokenId: buy[3].toNumber(),
                price: Number(
                  Number(ethers.utils.formatEther(buy[5])).toFixed(2)
                ),
                tokenName: buy[6],
              };
            }
          });
        }
        return history;
      });
    return salesHistory;
  } catch (err) {
    throw new Error("Something went wrong while retrieving event: " + err);
  }
};

const constructNftMetadataWidget = async (nft, owner) => {
  let metadata = await getTokenMetaData(nft.tokenId.toNumber());
  let totalSold = Number(
    Number(ethers.utils.formatEther(nft.totalFunded)).toFixed(2)
  );
  let lastValue =
    nft.numberOfTransfers.toNumber() > 0
      ? nft.forSale
        ? nft.lastPrice
        : nft.price
      : 0;
  lastValue = Number(Number(ethers.utils.formatEther(lastValue)).toFixed(2));
  return {
    id: nft.campaignTokenIndex.toNumber() - 1,
    tokenId: nft.tokenId.toNumber(),
    address: owner,
    currentPrice: Number(
      Number(ethers.utils.formatEther(nft.price)).toFixed(2)
    ),
    lastPrice: nft.lastPrice
      ? Number(Number(ethers.utils.formatEther(nft.lastPrice)).toFixed(2))
      : 0,
    metadata: metadata,
    currentOwner: owner,
    lastBoughtAt:
      nft.numberOfTransfers.toNumber() > 0 ? nft.mintedAt.toNumber() : 0,
    lastValue,
    lastByBeneficiary:
      lastValue * (metadata.presetDistribution.beneficiaryDistro / 10000), //((ethers.utils.formatEther(nft.totalFunded * (metadata.presetDistribution.beneficiaryDistro/100))).toFixed(2)),
    lastByFundraiser:
      lastValue * (metadata.presetDistribution.sponsorDistro / 10000),
    lastByArtist:
      lastValue * (metadata.presetDistribution.artistDistro / 10000),
    forSale: nft.forSale,
    numberOfTransfers: nft.numberOfTransfers.toNumber(),
    totalValue: totalSold,
    totalByBeneficiary:
      totalSold * (metadata.presetDistribution.beneficiaryDistro / 10000), //((ethers.utils.formatEther(nft.totalFunded * (metadata.presetDistribution.beneficiaryDistro/100))).toFixed(2)),
    totalByFundraiser:
      totalSold * (metadata.presetDistribution.sponsorDistro / 10000),
    totalByArtist:
      totalSold * (metadata.presetDistribution.artistDistro / 10000),
    /** add any additional details required */
  };
};

fundRaisin.getAllNFTs = async (type, sites) => {
  let lasttimestamp = -1;
  let nftList = [];
  for (const site of sites) {
    let nfts = await Contract.getCampaignNfts(
      site,
      constant.ALL_NFT_MODE,
      ethers.constants.AddressZero
    );
    nfts = nfts.filter((item) => item.tokenId.toNumber() > 0);
    for (const nft of nfts) {
      if (nft.tokenId.toNumber() > 0) {
        //let owner = await Contract.ownerOf(nft.tokenId.toNumber());
        let owner = nft.currentOwner;
        let _nftMetaData = await constructNftMetadataWidget(nft, owner);
        lasttimestamp =
          _nftMetaData.mintedAt && _nftMetaData.mintedAt > lasttimestamp
            ? _nftMetaData.mintedAt
            : lasttimestamp;
        nftList.push(_nftMetaData);
      }
    }
  }
  let totalFunded =
    nftList.length > 0 &&
    nftList
      .map((i) => {
        if (type == 0) return i.totalByBeneficiary;
        else if (type == 1) return i.totalByArtist;
        else if (type == 2) return i.totalByFundraiser;
      })
      .reduce((a, b) => a + b);
  return {
    totalValueFunded: totalFunded ? Number(totalFunded.toFixed(2)) : 0,
    totalNftMinted: nftList.length,
    currentlyForSale: nftList.filter((f) => f.forSale).length,
    nft: nftList.sort((x, y) => y.metadata.mintedAt - x.metadata.mintedAt),
  };
};

fundRaisin.getNFTByTokenId = async (tokenId) => {
  try {
    let nfts = await Contract.getCampaignNfts(
      process.env.APP_SITE_ID,
      constant.ALL_NFT_MODE,
      ethers.constants.AddressZero
    );
    return nfts.filter((item) => item.tokenId.toNumber() === Number(tokenId));
  } catch (err) {
    return [];
  }
};

fundRaisin.getSHA256Hash = async (tokenId) => {
  try {
    let metadata = await getTokenMetaData(tokenId);
    let abi = new ethers.utils.AbiCoder();
    let valueArray = [
      tokenId,
      metadata.name,
      [
        metadata.presetDistribution.presetName,
        metadata.presetDistribution.beneficiaryDistro,
        metadata.presetDistribution.artistDistro,
        metadata.presetDistribution.sponsorDistro,
        metadata.presetDistribution.sellerDistro,
      ],
      metadata.attributes.map((item) => {
        return [item.trait_type, item.value, item.id];
      }),
      metadata.license ? metadata.license : constant.NFT_LICENSE,
    ];
    let h = abi.encode(
      [
        "uint256",
        "string",
        "tuple(string,uint256,uint256,uint256,uint256)",
        "tuple(string,string,uint256)[]",
        "string",
      ],
      valueArray
    );
    let hash = utils.sha256(h);
    return hash;
  } catch (err) {
    return null;
  }
};

fundRaisin.getSiteWiseMinted = async () => {
  const minted = await Contract.campaignWiseMinted(process.env.APP_SITE_ID);
  return minted.toNumber();
};

export { fundRaisin };
