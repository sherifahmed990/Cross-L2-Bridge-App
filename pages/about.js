import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

export default function About() {
  return (
    <div>
    <Head>
        <title>L2 Tokens Bridge Between Rollups</title>
        <meta name="description" content="L2 Bridge App" />
        <link rel="icon" href="/bridge.png" />
    </Head>
      <Navbar />
      <div className='rounded-div my-4'>
        <span className="text-2xl font-bold box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 ...">
        Cross L2 Bridge Between Rollups
        </span><br/><br/>
        <a className="mr-6 underline" href='https://gitcoin.co/issue/gitcoinco/skunkworks/253/100027342'>Gitcoin bounty</a>
        <a className="mr-6 underline" href='https://notes.ethereum.org/@vbuterin/cross_layer_2_bridges'>Document by @vbuterin descriping the bounty</a>
        <br/><br/>
        <p>This project is a cross domain bridge to move ether and tokens between L2 networks(EVM compatible).</p><br/>
        <p>Currently the source and destination contract are both deployed on the optimistic kovan testnet as a proof of concept.</p>
        <br/>
        <p>The L1 contract is deployed on kovan testnet. All communication between the source and destination contract goes through the L1 contract.</p>
        <br/>
        <a className="mr-6 underline" href='https://kovan-optimistic.etherscan.io/address/0x6Fa32eE1871631717b7898A8C41Bc851Bf07b3e5'>Deployed Source Contract(Optimistic Kovan)</a><br/><br/>
        <a className="mr-6 underline" href='https://kovan-optimistic.etherscan.io/address/0x2A22D002f4BBA380502071E0D152d5D10A5281B5'>Deployed Destination Contract(Optimistic Kovan)</a><br/><br/>
        <a className="mr-6 underline" href='https://kovan.etherscan.io/address/0xF3A7EDf172C66427D8284f19f6c62Be1a738Fb33'>Deployed L1 Contract(Kovan)</a><br/><br/>
        <a className="mr-6 underline" href='https://github.com/sherifahmed990/Cross-Layer-2-Bridge/'>Project Github Link</a><br/><br/>

        <div className='flex items-center max-w-[630px] m-auto py-4'>
        <p>Developer : Sherif Abdelmoatty - sherif.ahmed990@gmail.com</p> 
            <a className='px-4' href='https://github.com/sherifahmed990/' target='_blank'>
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaGithub />
              </div>
            </a>
           
          </div>

       
      </div>
    </div>
  )
}
