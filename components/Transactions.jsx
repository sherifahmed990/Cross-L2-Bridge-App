import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';
import {getContract} from "../utils/getContract"

const Transactions = () => {
  const[transactions, setTransactions] = useState([]);
  const[transactionHashs, settransactionHashs] = useState([]);
  const[claimedTransactionNonces, setClaimedTransactionNonces] = useState([]);
  const[claimedTransactionHashs, setClaimedTransactionHashs] = useState([]);
  const [loading, setloading] = useState(false);

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
          setloading(true)
          await fetchclaimedTransactions()
          await fetchTransactions()
          setloading(false)
      })
      .on('changed', function(event){
          // remove event from local database
      })
      .on('error', function(e){
        console.error(e)
        setloading(false)
      });
    }

    // async function registerNewClaimedTransactions(){

    // }

    async function fetchAndRegisterTransactions(){
      setloading(true)
      await fetchclaimedTransactions()
      await fetchTransactions()
      await registerNewTransactions()
      setloading(false)
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
      {loading?
      <div className='flex text-center justify-center'>
        <svg role="status" className="content-center inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>:
      <div></div>      
      }
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