/* eslint-disable import/no-anonymous-default-export */

import { getThemeConfig } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
const NFT_PLURAL = getThemeConfig().APP_NFT_PLURAL
const BENEFICIARY =getThemeConfig().APP_BENEFICIARY
const PURPOSE = getThemeConfig().APP_PURPOSE
const campaign = getThemeConfig().APP_CAMPAIGN_NAME
export default {
  SNOWTRACE_API: "https://api-testnet.snowtrace.io/api",
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
      text: "1.0 - 10 AVAX",
      selected: false,
      key: "price",
    },
    {
      id: 4,
      text: "10 - 100 AVAX",
      selected: false,
      key: "price",
    },
    {
      id: 5,
      text: "> 100 AVAX",
      selected: false,
      key: "price",
    },
  ],
  CARDS_PER_PAGE: 12,
  MYCARDS_PER_PAGE: 100,
  CARDS_DISPLAY_MIN_LOADED: 4,
  MAX_TOP_LIST: 3,
  faq: [
    {
      question: "Why did red�dev create the NFT Art Project?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question: "How does the NFT Art Project innovate in the NFT Art space?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question:
        "What if I�d like to fork the code? Is NFT Art Project open source?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question: "I am an artist, and I would like to participate. How can I?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question: "I am a fundraiser at an NGO. How can we participate?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question: "I have having technical difficulties. What should I do?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      question:
        "Can NFTs minted here be exhibited and sold on other platforms such as Kalao?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
  ],
  ART_NAME: "Catdrops",
  PATTERN: "Pattern",
  PATTERN_COLOR: "Pattern Color",
  LAYER_CHOICE: 'Choice',
  PICK_DISTRO: "How would you like the proceeds to be distributed?",
  DISTRIBUTION: "Funds Distribution",
  DIST: "Distribution",
  MY_DISTRO: "My Distro",
  BACK_TO_PRESET: "Back to Alter-Egos",
  BACKGROUND_COLOR: "Background Color",
  NAME: "Name",
  ALTER_EGO: "Alter-Ego",
  FINAL_CHECK: "Final Check",
  FINAL_TEXT: "Final Check Before Minting",
  TWITTER_API: "https://twitter.com/intent/tweet?",
  NEW_NAME: "My New NFT",
  MINT_TITLE: "Mint a NFT",
  MY_NFT: "My NFT",
  HERO_DESC:
    "Design your own unique Catdrop #AwardNFTs while helping FUNPROBIANI care for pets and strays that we love.",
  TOP_PAGE_DESC:
    `These three ${NFT_PLURAL} have raised the most funds for ${BENEFICIARY}’s work of ${PURPOSE}. Each time someone buys one, more money is raised. Would you like to own one and help ${BENEFICIARY}?`,
  HOW_UNIQUE_DESC:
    "The Catdrops Collection has been created using Fund Raisin in order to help you use Catdrops to fund-raise for FUNPROBIANI in Maturín, Venezuelan, which, as a core part of its mission, focuses on caring for strays and pets of people with low incomes.",
  HOW_UNIQUE_MINT:
    " When you mint—i.e. create a new—NFT, you decide how funds are distributed between FUNPROBIANI, the artist, the sponsor (us), and the seller, each time your newly minted NFT is traded, for its entire life. You can mint an NFT where most of the funds go to FUNPROBIANI, or you can mint one where most of the funds go to the seller, or to the artist, for instance. It is your choice.",
  HOW_UNIQUE_RARE:
    "Catdrops with a gold background are expensive and legendary. Only five can exist, and there may be even fewer since the entire collection of 300 can mint out completely without any of these being minted. On a budget? Minting becomes a game of strategy. You are in control of the Catdrop’s features, so create one that you think will be especially rare or otherwise cool. Thousands of combinations are possible. Extra rare: frowny-faces can only be minted during the first 24 hours, and there can only be 20 Catdrops with yellow eyes, ten for each Catdrop shape.",
  HOW_UNIQUE_SUPPORT:
    "When you buy or sell Catdrop #AwardNFTs, part of the price paid will go to Fund Raisin’s fundraiser for FUNPROBIANI. You can check how much using the pie chart associated with each NFT, and you can also sort your search results accordingly. Funds raised go directly to the recipients’ wallets; there are no intermediaries. Fund Raisin never touches money destined for FUNPROBIANI, the artist, nor the seller. <br><br> FUNPROBIANI, The Foundation for Animal Welfare, is a non-profit organization founded in 2007. It is dedicated to the rescue, recovery, sterilization and adoption of stray animals in Maturín’s city. Considering that the problem of abandoned animals lies fundamentally in their overpopulation, FUNPROBIANI is actively involved in population control through the mass sterilization of dogs and cats.  <br> <br>FUNPROBIANI finances its own operation through modest private donations, vaccination and deworming days. However, this attention is offered at very low (or no) cost, so this income is insufficient to the maintenance of the animals and for the spay & neuter campaigns that the fulfillment of its objectives requires.  <br><br> The FUNPROBIANI members work on a voluntary basis, being the only eventually paid staff: Two veterinary doctors who have dedicated themselves to the cause. FUNPROBIANI was notarized in the Main Registry of the Monagas State according to document no. 28, folios 222/229, Volume 1, Protocol 1, fourth quarter of 2009, dated October 22, 2009",
  HOW_UNIQUE_GREEN:
    "Because Fund Raisin NFTs are minted on the Avalanche platform, it takes a tiny amount of electricity, similar to the amount used to make toast or brew coffee thanks to its novel consensus protocol. Also it's fast! Minting is a quick process that uses only a tiny bit of the Avalanche network’s capacity for less than a second.",
  WAGMI_DESC:
    `The purpose of ${campaign} is to demonstrate to you how you can use the Fund Raisin platform to raise money for a cause that you believe in. It could be anything from funding your first movie to paying for your parent’s surgery. It could be another NGO. Engage your imagination! Soon we will be releasing tools that will allow you to create one yourself. In the meantime, if you have a good idea, get in touch, and we may be able to help you create your first Fund Raisin fundraiser.`,
  INSTAGRAM_LINK: "https://www.instagram.com/",
  INSTAGRAM_LINK_TOOLTIP: "MUAFNFT on Instagram",
  INSTAGRAM_LINK_2: "https://www.instagram.com/",
  INSTAGRAM_LINK_2_TOOLTIP: "Instagram",
  DISCORD_LINK: "https://discord.gg/",
  TWITTER_LINK: "https://twitter.com/",
  TWITTER_LINK_TOOLTIP: "Twitter",
  NFT_LICENSE_LINK:
    "https://github.com/a16z/a16z-contracts/blob/master/arweave_upload/licenses/PERSONAL.pdf",
  NFT_LICENSE_NAME: "Can't Be Evil Personal License"
};
