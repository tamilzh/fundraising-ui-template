import Bundlr from "@bundlr-network/client";
import fs from "fs";
const bundlr = new Bundlr.default(
  process.env.ARWEAVE_NODE,
  'avalanche',
  process.env.ARWEAVE_PRIVATE_KEY,
  {
    providerUrl: process.env.ARWEAVE_NETWORK_URL,
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
  return `${process.env.ARWEAVE_LINK}${tx.id}`;
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