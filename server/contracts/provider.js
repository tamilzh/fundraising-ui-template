import { ethers } from "ethers";

const NETWORK_URL = process.env.NETWORK_URL || "https://api.avax.network/ext/bc/C/rpc";
const Provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
const getNetwork = async() => {
    return await Provider.getNetwork();
}
export { Provider, getNetwork };