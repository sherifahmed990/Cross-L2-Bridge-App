import Web3 from "web3";
export const getWeb3 = async () => {

    const provider = new Web3.providers.HttpProvider(
        process.env.WEB3_HTTPS_PROVIDER);

    const web3 = new Web3(provider)

    return web3
}

export const getWeb3Wss = async () => {

    const provider = new Web3.providers.WebsocketProvider(
       process.env.WEB3_WSS_PROVIDER);


    const web3 = new Web3(provider)

    return web3
}