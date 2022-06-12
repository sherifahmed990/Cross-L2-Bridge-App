import React, { useState } from "react"
import {getContract} from "../utils/getContract"
import {getWeb3} from "../utils/getWeb3"
import {getEthereum} from "../utils/getEthereum"
import Web3 from "web3"
import { GlobalContext } from '../context/GlobalState';



export default function AddTransaction() {

    const [token, setToken] = useState("0x0000000000000000000000000000000000000000");
    const [amountInput, setAmount] = useState(1000);
    const [destinationInput, setDestination] = useState('');
    const [amountInputValid, setAmountValid] = useState("hidden");
    const [destinationInputValid, setDestinationValid] = useState("hidden");
    const [loading, setloading] = useState(false);

    
    let handleAmount = (value)=>{
        if(isNumeric(value)){
          setAmount(parseInt(value)===0 || parseInt(value) > 1000000000000000?amountInput:value)
        }else if(value === "" || value === "-"){
          setAmount("")
        }
    }

    let handleBlurAmount = (value)=>{
      if(isNumeric(value) && value >= 1000 && value <= 1000000000000000){
        setAmount(value)
        setAmountValid("hidden")
      }else{
        setAmount(1000)
      }
    }

    let handleBlurDestination = (value)=>{
      if(Web3.utils.isAddress(value)){
        setDestination(value)
        setDestinationValid("hidden")
      }else{
        setDestination("")
        setDestinationValid("")
      }
  }
      
    function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && 
            !isNaN(parseInt(str))
    }

    let setWithdrawal = async (e) => {
        e.preventDefault()
        if(destinationInputValid != "hidden" || destinationInput == "")
            return

        setloading(true)

        const value = parseInt(amountInput/1000)
        const ethereum = await getEthereum()
        const web3 = await getWeb3()
        let sourceSideContract = process.env.NEXT_PUBLIC_SOURCE_SIDE_CONTRACT_ADDRESS
        let contract = await getContract(sourceSideContract)

        ethereum.enable()
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        
        await switchNetwork()

        let encodedABI = contract.methods.transfer(token, destinationInput, 
          value, 10).encodeABI()
        
        var tx = {
            from: accounts[0],
            to: sourceSideContract,
            data: encodedABI,
        }

        if(token !== '0x0000000000000000000000000000000000000000'){      
            let minABI = [
              {
                "constant": false,
                "inputs": [
                  {
                    "name": "_spender",
                    "type": "address"
                  },
                  {
                    "name": "_to",
                    "type": "uint256"
                  }
                ],
                "name": "transfer",
                "outputs": [
                  {
                    "name": "",
                    "type": "bool"
                  }
                ],
                "type": "function"
              },{
                "constant": false,
                "inputs": [
                  {
                    "name": "_spender",
                    "type": "address"
                  },
                  {
                    "name": "_value",
                    "type": "uint256"
                  }
                ],
                "name": "approve",
                "outputs": [
                  {
                    "name": "",
                    "type": "bool"
                  }
                ],
                "type": "function"
              }
            ];
            
            // Get ERC20 Token contract instance
            let tokenContract = new web3.eth.Contract(minABI, token);
      
            await ethereum
            .request({
              method: "eth_sendTransaction",
              params: [
                {
                  from: accounts[0],
                  to: token,
                  data: tokenContract.methods
                    .approve(sourceSideContract, value * 1000000)
                    .encodeABI(),
                },
              ],
            }).then((result) =>  {
              console.log(result)
            }).catch((error) => console.error(error));
            tx.value = String(3002000000000);
          }else {
            tx.value = String(3002000000000 + value*1000 + value * 5);
          }
      
          const sentTx = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
          }).then((result) =>  {
            setloading(false)
          }).catch((error) => console.error(error));

          setloading(false)
    }

    let switchNetwork = async (e) => {
        const web3 = await getWeb3()
        
        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        if (ethereum.networkVersion != 69) {
            try {
                await ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.utils.toHex(69) }],
                });
              } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                  try {
                    await ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                            chainId: web3.utils.toHex(69),
                            chainName: 'Optimism Kovan',
                            rpcUrls: ['https://kovan.optimism.io'],
                            blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
                        },
                      ],
                    });
                  } catch (addError) {
                    console.log(addError)
                  }
                }
                // handle other "switch" errors
              }
        }
    }


    return (
        <div className='rounded-div my-4'>
          <div className='flex flex-col md:flex-row justify-between pt-4 pb-6 text-left md:text-left'>
            <h1 className='text-2xl font-bold my-2'>Send Ether and Tokens (Optimistic Kovan --> Optimistic Kovan)</h1><br/>  
          </div>
            <form className='w-[90%] border-collapse m-4' onSubmit={(e) => setWithdrawal(e)} noValidate>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Destination Address
                </label><p className={`text-red-500 text-xs italic ${destinationInputValid}`}>Please fill out this field with a valid address.</p>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Destination Address"
                value={destinationInput}
                onChange={(e) => setDestination(e.target.value)}
                onBlur={(e) => handleBlurDestination(e.target.value)} 
                required/>
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount(in Wei)
                </label><p className={`text-red-500 text-xs italic  ${amountInputValid}`}>Min 1000 wei , Max 1000000000000000</p>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="number" min='1000' placeholder="Amount in Wei"
                value={amountInput}
                onChange={(e) => handleAmount(e.target.value)}
                onBlur={(e) => handleBlurAmount(e.target.value)} 
                required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                    Token
                    </label>
                    <div className="w-full relative mb-6">
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="grid-state"
                        onChange={(e) => setToken(e.target.value)} required>
                            <option value="0x0000000000000000000000000000000000000000">ETHER</option>
                            <option value="0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1">DAI</option>
                            <option value="0x4911b761993b9c8c0d14ba2d86902af6b0074f5b">LINK</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                { (loading)?
                <button className="border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" disabled>
                    <svg role="status" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    Processing...
                </button> 
                :
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Send
                </button>
                }
                </div>
            </form>
        </div>
    
      );
}
