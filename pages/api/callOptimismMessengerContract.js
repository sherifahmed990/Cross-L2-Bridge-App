// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    const sdk = require("@eth-optimism/sdk")
    const { ethers } = require("ethers");

    const apiKey = process.env.INFURA_API_KEY
    const providerl1 = new ethers.providers.InfuraProvider("kovan", apiKey)
    const private_key = process.env.PRIVATE_KEY
    const signerl1 = new ethers.Wallet(private_key, providerl1);

    const providerl2 = new ethers.providers.InfuraProvider("optimism-kovan", apiKey)
    const signerl2 = new ethers.Wallet(private_key, providerl2);


    const crossChainMessenger = new sdk.CrossChainMessenger({ l1ChainId: 42, 
        l1SignerOrProvider: signerl1, 
        l2SignerOrProvider: signerl2
    })
    const hash = "0x4fae43f5b8626ef6a79b76209d6287c2335d7bcb78ee811ceb0425f7633899ee"

    try{
        const c = await crossChainMessenger.getMessageStatus(hash)
        console.log(c)
        if(c!=4){
            res.status(400).json("Still .....")
            return
        }

        const r = await crossChainMessenger.finalizeMessage(hash)
        res.status(200).json(r)
    }catch(e){
        console.log(e)
        res.status(400)
    }
  }
  