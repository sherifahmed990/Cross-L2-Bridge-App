import {getWeb3} from "./getWeb3"

let getContract = async (address) => {
    // Load a deployed contract instance into a web3 contract object
    const web3 = await getWeb3()

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