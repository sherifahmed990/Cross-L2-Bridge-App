import {getWeb3, getWeb3Wss} from "./getWeb3"

let getContract = async (address, isWss=false) => {
    // Load a deployed contract instance into a web3 contract object
    const web3 = isWss?await getWeb3Wss():await getWeb3()

    // Load the artifact with the specified address
    let contractArtifact
    try {
        contractArtifact = await import(`../artifacts/contracts/${address}.json`)
    } catch (e) {
        console.log(`Failed to load contract artifact "../artifacts/contracts/${address}.json"`)
        return undefined
    }
    return new web3.eth.Contract(contractArtifact.abi, address)
}


export {getContract}