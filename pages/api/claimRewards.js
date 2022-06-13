// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getContract} from "../../utils/getContract"

export default async function handler(req, res) {
    let destinationSideContract = process.env.NEXT_PUBLIC_DESTINATION_SIDE_CONTRACT_ADDRESS
    let contract = await getContract(destinationSideContract)
    try{
        let events = await contract.getPastEvents("Reward", { fromBlock: 1})
        let rewardData = events.slice(0, 20).map((e) =>e['returnValues']["rewardData"])

        let sourceSideContract = process.env.NEXT_PUBLIC_SOURCE_SIDE_CONTRACT_ADDRESS
        const { ethers } = require("ethers");
        const apiKey = process.env.INFURA_API_KEY
        const provider = new ethers.providers.InfuraProvider("optimism-kovan", apiKey)
    
        
        const private_key = process.env.PRIVATE_KEY
        const signerl1 = new ethers.Wallet(private_key, provider);
    
        const abi = await import(`../../artifacts/contracts/${sourceSideContract}.json`)
    
        const contract2 = new ethers.Contract(sourceSideContract, abi.abi, provider)
    
        let contractWithSigner = contract2.connect(signerl1)
    
        
        let tx = await contractWithSigner.processClaims(rewardData,{gasLimit: 1000000})

        res.status(200).json({...rewardData, tx})
    }
    catch(e){
        console.log(e)
        res.status(400)
    }
  }
  