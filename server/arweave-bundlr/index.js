import Bundlr from "@bundlr-network/client";
import fs from "fs";

const constant = {
  ARWEAVE_NODE: process.env.ARWEAVE_NODE || "https://node1.bundlr.network",
  ARWEAVE_LINK: process.env.ARWEAVE_LINK || "https://arweave.net/",
  ARWEAVE_NETWORK_URL:
    process.env.ARWEAVE_NETWORK_URL || "https://api.avax.network/ext/bc/C/rpc",
  ARWEAVE_PRIVATE_KEY:
    process.env.ARWEAVE_PRIVATE_KEY ||
    "5d59e018069e693ad3170f469453e9988e2ac2d95f75e91351e0b85dc85f9468",
  
}
const bundlr = new Bundlr.default(
  constant.ARWEAVE_NODE,
  'avalanche',
  constant.ARWEAVE_PRIVATE_KEY,
  {
    providerUrl: constant.ARWEAVE_NETWORK_URL,
  }
);

const upload = async (fileOrData, isFile, format) => {
  const data = isFile ? fs.readFileSync(fileOrData) : fileOrData;
  const tags = [
    {
      name: "Content-Type",
      value: format,
    },
  ];
  // create a Bundlr Transaction
  const tx = bundlr.createTransaction(data, {
    tags,
  });
  // sign the transaction
  await tx.sign();
  // upload the transaction
  await tx.upload();
  // return the transaction id
  return `${constant.ARWEAVE_LINK}${tx.id}`;
}

const fund = async (avax) => {
  if (avax > 0) {
    let unitConverted = 10 ** 18;
    let response = await bundlr.fund(price * unitConverted);
    // response = {
    //     id, // the txID of the fund transfer
    //     quantity, // how much is being transferred
    //     reward, // the amount taken by the network as a fee
    //     target // the address the funds were sent to
    // }
    console.log(response);
  }
  const balance = await bundlr.getLoadedBalance();
  console.log(balance);
  const inAVAX = bundlr.utils.unitConverter(balance);
  console.log(inAVAX);
  return { token: balance, avax: inAVAX };
};

export { upload, fund };