// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    let destinationSideContract = process.env.NEXT_PUBLIC_DESTINATION_SIDE_CONTRACT_ADDRESS
    const { ethers } = require("ethers");
    // const apiKey = process.env.INFURA_API_KEY
    const apiKey = process.env.ALCHEMY_API_KEY
    const provider = new ethers.providers.AlchemyProvider("optimism-kovan", apiKey)

    const private_key = process.env.PRIVATE_KEY
    const signerl1 = new ethers.Wallet(private_key, provider);

    const abi = await import(`../../artifacts/contracts/${destinationSideContract}.json`)

    const contract = new ethers.Contract(destinationSideContract, abi.abi, provider);

    let contractWithSigner = contract.connect(signerl1);

    try{
        let tx = await contractWithSigner.declareNewHashOnionHeadToL1();
        res.status(200).json(tx['hash'])
    }catch(e){
        console.log(e)
        res.status(400)
    }
  }
  