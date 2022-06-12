import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';
import {getContract} from "../utils/getContract"

const Transactions = () => {
  const[transactions, setTransactions] = useState([]);
  const[transactionHashs, settransactionHashs] = useState([]);
  const[claimedTransactionNonces, setClaimedTransactionNonces] = useState([]);
  const[claimedTransactionHashs, setClaimedTransactionHashs] = useState([]);

  const tokens = {'0x0000000000000000000000000000000000000000':"icons/ethereum.png",
                  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1':"icons/dai.png",
                  '0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B':"icons/chainlink.png"}


  useEffect(() => {
    async function fetchTransactions(){      
      const response = await fetch(`/api/getSourceSideContractEvents`)
      const data = await response.json()
      setTransactions(data.map((e) =>e['returnValues'][0]))
      settransactionHashs(data.map((e) =>e['transactionHash']))
    }

    async function fetchclaimedTransactions(){
      let destinationSideContract = process.env.NEXT_PUBLIC_DESTINATION_SIDE_CONTRACT_ADDRESS
      let contract =  await getContract(destinationSideContract)
      try{
        let events = await contract.getPastEvents("Reward", { fromBlock: 1})        
        setClaimedTransactionNonces(events.map((e) =>e['returnValues']["nonce"]))
        setClaimedTransactionHashs(events.map((e) =>e['transactionHash']))
      }
      catch(e){
        console.log(e)
      }
    }

    async function registerNewTransactions(){
      let sourceSideContract = process.env.NEXT_PUBLIC_SOURCE_SIDE_CONTRACT_ADDRESS
      let contract = await getContract(sourceSideContract)
      
      contract.events.Transaction({
        fromBlock: "latest"
      }, function(error, event){ console.log(event); })
      .on('data', async function(e){
          console.log(e['returnValues'][0]); // same results as the optional callback above
          // settransactionHashs([e['transactionHash'], ...claimedTransactionHashs])
          // setTransactions([e['returnValues'][0], ...transactions])
          await fetchclaimedTransactions()
          await fetchTransactions()
      })
      .on('changed', function(event){
          // remove event from local database
      })
      .on('error', console.error);
    }

    // async function registerNewClaimedTransactions(){

    // }

    async function fetchAndRegisterTransactions(){
      await fetchclaimedTransactions()
      await fetchTransactions()
      await registerNewTransactions()
    }

    fetchAndRegisterTransactions()
    //fetchclaimedTransactions()
    
  }, [])

  return (
    <div className='rounded-div my-4'>
      <div className='flex flex-col md:flex-row justify-between pt-4 pb-6 text-center md:text-right'>
        <h1 className='text-2xl font-bold my-2'>Latest Transactions</h1>
        {/* <form>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full bg-primary border border-input px-4 py-2 rounded-2xl shadow-xl'
            type='text'
            placeholder='Search a coin'
          />
        </form> */}
      </div>

      <table className='table-auto w-full border-collapse text-center'>
        <thead>
          <tr className='border-b'>
            <th className='px-4 py-2'>Token</th>
            <th className='px-4 py-2 hidden md:table-cell'>Destination Address</th>
            <th className='px-4 py-2'>Amount</th>
            <th className='px-4 py-2'>Fee</th>
            <th>LP</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            // .filter((value) => {
            //   if (searchText === '') {
            //     return value;
            //   } else if (
            //     value.name.toLowerCase().includes(searchText.toLowerCase())
            //   ) {
            //     return value;
            //   }
            // })
            .map((transaction, index) => (
              <TransactionItem key={transactionHashs[index]} transactionHash={transactionHashs[index]} transaction={transaction}
              isClaimed={(claimedTransactionNonces.includes(transactions[index][6]))} tokens={tokens} claimedTransactionHash={claimedTransactionHashs[index]}/>
            )).reverse()}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;