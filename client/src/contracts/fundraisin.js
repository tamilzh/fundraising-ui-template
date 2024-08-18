import FundRaisin from "./abi/FundRaisin.json";
import { ethers } from "ethers";
import { logInfo } from "../utils/log";
var ContractSigner, Provider;

function fundRaisin() {}

const isTransactionMined = async (transactionHash) => {
  const txn = await Provider.waitForTransaction(transactionHash, 2);
  logInfo(new Date());
  if (txn && txn.blockNumber && txn.status > 0) {
    return txn;
  } else if (txn.status === 0) {
    await getFailedTransaction(transactionHash);
  } else {
    return false;
  }
};

const getFailedTransaction = async (transactionHash) => {
  const tx = await Provider.getTransaction(transactionHash);
  try {
    await Provider.call(tx, tx.blockNumber);
  } catch (err) {
    throw err;
  }
};

fundRaisin.initializeWithSigner = async (contractAddress, provider, address) => {
  Provider = provider;
  ContractSigner = new ethers.Contract(
    contractAddress,
    FundRaisin.abi,
    provider.getSigner(address)
  );
  logInfo(
    `Connected with new signer ${address.slice(0, 6)}...${address.slice(
      address.length - 4
    )}`
  );
};

fundRaisin.getABI = () => {
  return FundRaisin.abi;
};

fundRaisin.mint = async (mintRequest, price) => {
  const options = {
    value: ethers.utils.parseEther(price),
  };
  let tx = await ContractSigner.mintNFTtoken(mintRequest, options);
  logInfo(new Date());
  tx = await isTransactionMined(tx.hash);
  return tx;
};

fundRaisin.buyNft = async (siteId, siteTokenIndex, tokenId, price) => {
  const options = {
    value: ethers.utils.parseEther(price.toString()),
  };
  let tx = await ContractSigner.buyToken(
    siteId,
    siteTokenIndex,
    tokenId,
    options
  );
  tx = await isTransactionMined(tx.hash);
  return tx;
};

fundRaisin.changeTokenPrice = async (
  siteId,
  siteIndex,
  tokenId,
  price,
  optForSale
) => {
  let tx = await ContractSigner.changeTokenPrice(
    siteId,
    siteIndex,
    tokenId,
    ethers.utils.parseEther(price),
    optForSale
  );
  tx = await isTransactionMined(tx.hash);
  return tx;
};

export { fundRaisin };
