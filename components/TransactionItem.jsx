import React, { useState } from 'react';
import {getEthereum} from "../utils/getEthereum"
import {getWeb3} from "../utils/getWeb3"
import {getContract} from "../utils/getContract"

import Web3 from "web3";
import sjcl from 'sjcl'
import Image from 'next/image';
import Link from 'next/link';



const TransactionItem = ({ transaction, transactionHash, isClaimed, tokens, claimedTransactionHash }) => {

  const [loading, setloading] = useState(false);
  const [claimed, setClaimed] = useState(isClaimed);
  const [claimedTh, setClaimedTh] = useState(claimedTransactionHash);

  let provideLiquidity = async (e) => {
    const ethereum = await getEthereum()
    
    const web3 = await getWeb3()
    let t = await web3.eth.getTransactionReceipt(transactionHash)

    let d = web3.eth.abi.decodeParameters([ {
            type: 'address',
            name: 'tokenAddress'
        },{
            type: 'address',
            name: 'destination'
        },{
            type: 'uint256',
            name: 'amount'
        },{
            type: 'uint256',
            name: 'fee'
        },{
            type: 'uint256',
            name: 'startTime'
        },{
            type: 'uint256',
            name: 'feeRampup'
        },{
            type: 'uint256',
            name: 'nonce'
        }],t.logs[t.logs.length-1].data)
 
    let destinationSideContract = process.env.NEXT_PUBLIC_DESTINATION_SIDE_CONTRACT_ADDRESS
    let contract =  await getContract(destinationSideContract)

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    let encodedABI = contract.methods.claim(d).encodeABI()

    var tx = {
        from: accounts[0],
        to:destinationSideContract,
        data: encodedABI,
    };

    setloading(true)
    const token = d[0]

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
              .approve(destinationSideContract, d[2]+d[3])
              .encodeABI(),
          },
        ],
      }).then(async (result) =>  {
        console.log(result)
      }).catch((error) => {
        console.error(error)
        setloading(false)
        return
      });
    }else {
      tx.value = String(d[2]+d[3]);
    }

    try{
      const sentTx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })
      setClaimedTh(sentTx)
      setClaimed(true)
    }catch(error){
      console.error(error)
    }
    
    setloading(false)
  }

  return (
    <tr className='h-[80px] border-b'>
      <td className='px-4 py-2'><img src={tokens[transaction[0]]} alt='/' width='40' height='40' /></td>
      <td className='px-4 py-2 hidden md:table-cell underline'><Link href={`https://kovan-optimistic.etherscan.io/tx/${transactionHash}`}><a target="_blank">{transaction[1]}</a></Link></td>
      {/* <td className='px-4 py-2 hidden md:table-cell'>{transaction[1]}</td> */}
      <td className='px-4 py-2'>{transaction[2]}</td>
      <td className='px-4 py-2'>{transaction[3]}</td>
      <td className='px-4 py-2 underline'>
      {(claimed)?
        
        <p className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-500">
          <Link href={`https://kovan-optimistic.etherscan.io/tx/${claimedTh}`}><a target="_blank">Claimed</a></Link>
          {/* Claimed */}
        </p>
        
        :
        (loading)?
          <button className="border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" disabled>
              <svg role="status" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              Processing...
          </button> 
          :
          <button className="border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={(e) => provideLiquidity(e)}>Provide Liquidity</button>
      } 
      </td>
      
    </tr>
  );
};

export default TransactionItem;