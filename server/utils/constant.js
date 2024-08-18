// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SNOWTRACE_API: "https://api-testnet.snowtrace.io/api",
  SNOWTRACE_GET_LOGS: "getLogs",
  BUY_ABI:
    "event Buy(address indexed,address,uint256,uint256,address,uint256,string)",
  ALL_NFT_MODE: 0,
  MY_NFT_MODE: 1,
  BUY_NFT_MODE: 2,
  color: ["#FF66D7", "#FFFF99", "#2ACFD3", "#FF9B05"],
  priceFilter: [
    {
      id: 0,
      text: "< 0.1 AVAX",
      selected: false,
      key: "price",
    },
    {
      id: 1,
      text: "0.1 - 0.5 AVAX",
      selected: false,
      key: "price",
    },
    {
      id: 2,
      text: "0.5 - 1.0 AVAX",
      selected: false,
      key: "price",
    },
    {
      id: 3,
      text: "10 - 100 AVAX",
      selected: false,
      key: "price",
    },
  ],
  CARDS_PER_PAGE: 12,
  CARDS_DISPLAY_MIN_LOADED: 4,
  MAX_TOP_LIST: 3,
  FUNDRAISER_DISTRO_LABEL: 'Sponsor (red·dev)',
  SELLER_DISTRO_LABEL: 'Seller (red·dev, then you)',
  ARTIST_DISTRO_LABEL: 'Artist (Blake Chamberlain)',
  BENEFICIARY_DISTRO_LABEL: 'Beneficiary (FUNPROBIANI)'
};
