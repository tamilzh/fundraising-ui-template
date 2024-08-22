function isBase64(str) {
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

function getBuyFilters(price, bg, pattern) {
  return [
    {
      id: 0,
      header: "Price",
      filterType: "dropdown",
      menuType: "text",
      menu: price,
      selected: false,
      key: "price",
    },
    {
      id: 1,
      header: "Background",
      filterType: "dropdown",
      menuType: "box",
      menu: bg === undefined ? [] : bg,
      selected: false,
      key: "bgcolor",
    },
    {
      id: 2,
      header: "Pattern",
      filterType: "dropdown",
      menuType: "box",
      menu: pattern === undefined ? [] : pattern,
      selected: false,
      key: "pattern",
    },
    {
      id: 3,
      header: "Owner",
      filterType: "textbox",
      selected: false,
      key: "owner",
    },
    {
      id: 4,
      header: "View All",
      filterType: "button",
      selected: true,
      key: "all",
    },
  ];
}

function getBuySort() {
  return [
    {
      id: 0,
      header: "Price",
      direction: "up",
      sortType: "price",
      selected: false,
    },
    {
      id: 1,
      header: "Price",
      direction: "down",
      sortType: "price",
      selected: false,
    },
    {
      id: 2,
      header: "Beneficiary %",
      direction: "down",
      sortType: "tnc",
      selected: false,
    },
  ];
}

async function addLayerChoiceDynamically(
  id,
  layers,
  setData,
  setLoading,
  layerChList
) {
  const current = layers[id]?.layerName;
  return {
    title: current,
    identifier: `layerchoice${id}`,
    category: "layerchoice",
    widget: "catalogue",
    preview: true,
    navButton: current,
    getData: async function () {
      layerChList = layerChList.map((item) => {
        return {
          ...item,
          layerName: current,
        };
      });
      setData(layerChList);
      setLoading(false);
    },
  };
}

const insert = function (index, ...items) {
  this.splice(index, 0, ...items);
};

export {
  isBase64,
  getBuyFilters,
  getBuySort,
  addLayerChoiceDynamically,
  insert,
};

export const getThemeConfig = () => {
  const defaultSetting = {
    APP_BENEFICIARY: "",
    APP_ARTIST: "",
    APP_SPONSOR: "",
    APP_CAMPAIGN_NAME: "",
    APP_NFT_PLURAL: "",
    APP_ABOUT_CARD_TITLE: "",
    APP_ABOUT_CARD_DESC: "",
    APP_ABOUT_CARD_TITLE1: "",
    APP_ABOUT_CARD_TITLE2: "",
    APP_ABOUT_CARD_TITLE3: "",
    APP_ABOUT_CARD_TITLE4: "",
    APP_ABOUT_CARD_DESC1: "",
    APP_ABOUT_CARD_DESC2: "",
    APP_ABOUT_CARD_DESC3: "",
    APP_ABOUT_CARD_DESC4: "",
    APP_NFT_NAME: "",
    APP_DESC: "",
    APP_INSTA_LINK: "",
    APP_DISCORD_LINK: "",
    APP_TWITTER_LINK: "",
    APP_FUNDRAISIN_WEBSITE_LINK: "https://fundraisin.app",
    APP_PURPOSE: "",
  };

  try {
    const theme = sessionStorage.getItem('THEME');
    const data = JSON.parse(theme);
    console.log('THEME')
    return { ...defaultSetting, ...data };
  } catch (err) {
    console.log('THEME',err)

  }
  return defaultSetting;
};
