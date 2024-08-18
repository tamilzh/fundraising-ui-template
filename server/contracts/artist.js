import deployment from "./abi/ArtistApprovedCampaign.json" assert { type: "json" };
import { ethers } from "ethers";
import { db } from "../db/datastore.js";
import { Provider } from "./provider.js";

const Contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_ARTIST,
  deployment.abi,
  Provider
);

function artist() {}

artist.getAddress = () => {
  return process.env.CONTRACT_ADDRESS_ARTIST;
};

artist.getABI = () => {
  return deployment.abi;
};

artist.getArtist = async (address) => {
  let id = await Contract.getArtistByAddress(address);
  return await Contract.artistList(id);
};

artist.getArtistById = async (id) => {
  return await Contract.artistList(id);
};

artist.getArtistWallet = async (id) => {
  return await Contract.getArtistWallet(id);
};

artist.getBackgroundColor = async (artCreationPackId, siteBgPrice) => {
  let artistBackgrounds = [];
  let artistBackground = await Contract.getBackgroundColor(
    process.env.APP_SITE_ID,
    artCreationPackId,
    false
  );
  artistBackground.forEach((i) => {
    siteBgPrice.forEach((element) => {
      if (i.rank.toNumber() === element.rank.toNumber()) {
        artistBackgrounds.push({
          colorHexCode: i.colorHexCode,
          backgroundId: i.backgroundId.toNumber(),
          artCreationPackId: i.artPackId.toNumber(),
          rank: i.rank.toNumber(),
          price: Number(
            Number(ethers.utils.formatEther(element.price)).toFixed(2)
          ),
          selected: false,
        });
      }
    });
  });
  return artistBackgrounds.filter((item) => item.backgroundId > 0);
};

artist.getPatterns = async (artCreationPackId) => {
  let patterns = await Contract.getPattern(
    process.env.APP_SITE_ID,
    artCreationPackId,
    false
  );
  return patterns
    .filter((item) => item.patternId.toNumber() > 0)
    .map((pattern) => {
      return {
        patternId: pattern.patternId.toNumber(),
        patternName: pattern.patternName,
        thumbnailURL: pattern.thumbnailURL,
        patternURL: pattern?.patternURL || pattern.thumbnailURL
      };
    });
};

artist.getLayers = async (patternId) => {
  let layers = await Contract.getLayer(
    process.env.APP_SITE_ID,
    patternId,
    false
  );
  return layers
    .filter((item) => item.layerId.toNumber() > 0)
    .map((layer) => {
      return {
        layerId: layer.layerId.toNumber(),
        layerName: layer.layerName,
        layerDepth: layer.layerDepth,
        patternId: layer.patternId.toNumber(),
      };
    });
};

artist.getLayerChoices = async (layerId) => {
  let layerchoices = await Contract.getLayerChoice(
    process.env.APP_SITE_ID,
    layerId,
    false
  );
  return layerchoices
    .filter((item) => item.layerChoiceId.toNumber() > 0)
    .map((layerchoice) => {
      return {
        layerChoiceId: layerchoice.layerChoiceId.toNumber(),
        layerURL: layerchoice.layerURL,
        layerPreviewURL: layerchoice.layerPreviewURL,
        layerId: layerchoice.layerId.toNumber(),
        order: layerchoice.order.toNumber(),
      };
    });
};

artist.getApprovedNames = async (artCreationPackId) => {
  let names = await Contract.getApprovedName(
    process.env.APP_SITE_ID,
    artCreationPackId,
    false
  );
  return names
    .filter((item) => item.approvedNameId.toNumber() > 0)
    .map((name) => {
      return {
        approvedNameId: name.approvedNameId.toNumber(),
        approvedName: name.approvedName,
        artCreationPackId: name.artPackId.toNumber(),
        nextNameNumber: name.nextNameNumber.toNumber(),
      };
    });
};

const getFilterData = async (artCreationPackId) => {
  let backgroundColor = await Contract.getBackgroundColor(
    process.env.APP_SITE_ID,
    artCreationPackId,
    true
  );
  let filterData = {};
  filterData.artistBackground = backgroundColor
    .filter((item, index, self) => {
      return (
        item.backgroundId.toNumber() > 0 &&
        index === self.findIndex((t) => t.colorHexCode === item.colorHexCode)
      );
    })
    .map((item, i) => {
      return {
        id: i,
        style: {
          backgroundColor: item.colorHexCode,
        },
        selected: false,
        key: `bgcolor`,
      };
    });

  let pattern = await Contract.getPattern(
    process.env.APP_SITE_ID,
    artCreationPackId,
    true
  );
  filterData.pattern = pattern
    .filter((item) => item.patternId.toNumber() > 0)
    .map((item, i) => {
      return {
        id: i,
        name: item.patternName,
        style: {
          backgroundImage: `url(${item.thumbnailURL})`,
          backgroundPosition: "center",
        },
        selected: false,
        key: `pattern`,
      };
    });
  return filterData;
};

artist.getfilterData = async (artCreationPackId) => {
  try {
    const [entity] = await db.get("artist", "filterData");
    return entity;
  } catch (err) {
    let filterData = await getFilterData(artCreationPackId);
    try {
      await db.put("artist", "filterData", filterData);
      return filterData;
    } catch (err) {
      return filterData;
    }
  }
};

export { artist };
