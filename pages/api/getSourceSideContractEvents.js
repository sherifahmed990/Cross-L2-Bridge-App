// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getContract} from "../../utils/getContract"

export default async function handler(req, res) {
    let sourceSideContract = process.env.NEXT_PUBLIC_SOURCE_SIDE_CONTRACT_ADDRESS
    let contract = await getContract(sourceSideContract)
    try{
        let events = await contract.getPastEvents("Transaction", { fromBlock: 1})  
        res.status(200).json(events)      
    }
    catch(e){
        console.log(e)
        res.status(400)
    }
  }
  