// eslint-disable-next-line import/no-anonymous-default-export
export default {
  NETWORK_NAME: process.env.NETWORK_NAME || "Avalanche Mainnet",
  NETWORK_URL:
    process.env.NETWORK_URL || "https://api.avax.network/ext/bc/C/rpc",
  SNOWTRACE_API:
    process.env.SNOWTRACE_API || "https://api-testnet.snowtrace.io/api",
  NFT_LICENSE:
    process.env.NFT_LICENSE ||
    "https://arweave.net/_D9kN1WrNWbCq55BSAGRbTB4bS3v8QAPTYmBThSbX3A/4",
  ARWEAVE_NODE: process.env.ARWEAVE_NODE || "https://node1.bundlr.network",
  ARWEAVE_LINK: process.env.ARWEAVE_LINK || "https://arweave.net/",
  ARWEAVE_NETWORK_URL:
    process.env.ARWEAVE_NETWORK_URL || "https://api.avax.network/ext/bc/C/rpc",
  ARWEAVE_PRIVATE_KEY:
    process.env.ARWEAVE_PRIVATE_KEY ||
    "5d59e018069e693ad3170f469453e9988e2ac2d95f75e91351e0b85dc85f9468",
  IMAGE_TYPE: process.env.IMAGE_TYPE || "png",
  IMAGE_CONTENT_TYPE: process.env.IMAGE_CONTENT_TYPE || "image/png",
  SNOWTRACE_GET_LOGS: "getLogs",
  BUY_ABI:
    "event Buy(address indexed,address,uint256,uint256,address,uint256,string)",
  ALL_NFT_MODE: 0,
  MY_NFT_MODE: 1,
  BUY_NFT_MODE: 2,  
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
  FUNDRAISER_DISTRO_LABEL: "Sponsor (red·dev)",
  SELLER_DISTRO_LABEL: "Seller (red·dev, then you)",
  ARTIST_DISTRO_LABEL: "Artist (Blake Chamberlain)",
  BENEFICIARY_DISTRO_LABEL: "Beneficiary (FUNPROBIANI)",
};
