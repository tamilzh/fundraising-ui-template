# Catdrop

## Getting started

Clone the repository `git@gitlab-server.red.dev:nft-project/catdrop.git`

# Before start the server please authenticate with google cloud

1. Run `gcloud auth login`
2. Run `gcloud auth application-default login`
3. Run `gcloud config set project [project-id]`
4. Ensure you have enough permission to store data in datastore

# Create .env files

1. Create .env file under clinet folder and keep the folllowing

    REACT_APP_TITLE="Fund Raisin - Collection"

    REACT_APP_DESRIPTION="A Fund Raisin #AwardNFTs from the Collection"

    REACT_APP_BASE_API="https://localhost:8080"

2. Create .env file root of the project folder and keep the below

    // Smart Contract deployment address
    PORT=8080

    APP_WEBSITE_LINK=https://localhost:3000

    NETWORK_NAME=Avalanche Fuji Testnet

    NETWORK_URL="https://api.avax-test.network/ext/bc/C/rpc"

    ARWEAVE_NODE="https://node1.bundlr.network"

    ARWEAVE_LINK="https://arweave.net/"

    NFT_LICENSE="https://arweave.net/
    _D9kN1WrNWbCq55BSAGRbTB4bS3v8QAPTYmBThSbX3A/4"

    ARWEAVE_NETWORK_URL="https://api.avax.network/ext/bc/C/rpc"5dc85f9468"

    APP_SITE_ID=5

    CONTRACT_ADDRESS_ARTIST="0x70aFCA14142272dEc97570dE18139Ad8fa34A7e7"

    CONTRACT_ADDRESS_SITE="0x079118268F9071A969ab893B8C1c9c9F3F215210"

    CONTRACT_ADDRESS_RARITY="0xfC6d519a6c653495fc11d71828723f0F2b30A809"

    CONTRACT_ADDRESS_FUNDRAISIN="0xbfe8604f26C825Db140CA1beAe1E6d81AE9eD623"

    IMAGE_TYPE=
    
    IMAGE_CONTENT_TYPE=

# To start sever

Open a new terminal

1. cd server
2. Run `npm install`
3. Run `npm run start`

Open browser and browse `http://localhost:8080`

# To start client

Open a new terminal

1. cd client
2. Run npm install
3. npm run start

Open browser and browse `http://localhost:3000`
