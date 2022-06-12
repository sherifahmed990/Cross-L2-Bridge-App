import Web3 from "web3";
export const getWeb3 = async () => {

    // const provider = new Web3.providers.HttpProvider(
    //     // "https://optimism-kovan.infura.io/v3/9993794675844a8eb35dab69a76b7190"
    //     "https://opt-kovan.g.alchemy.com/v2/IIjE38jVk-Te-q7JNunlLtMDTPzP3_ux"
    // );

    const provider = new Web3.providers.WebsocketProvider(
       "wss://opt-kovan.g.alchemy.com/v2/IIjE38jVk-Te-q7JNunlLtMDTPzP3_ux"
    );


    const web3 = new Web3(provider)

    return web3
}