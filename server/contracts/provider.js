import { ethers } from "ethers";
const Provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL);
//const Signer = new ethers.Wallet(process.env.PRIVATE_KEY_REDDEV, Provider);
const getNetwork = async() => {
    return await Provider.getNetwork();
}
export { Provider, getNetwork };