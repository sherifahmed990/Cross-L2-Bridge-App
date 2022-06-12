import Head from 'next/head'
import React, { createContext, useState, useContext, useMemo } from 'react';
import Image from 'next/image'
import Transactions from '../components/Transactions'
import Navbar from '../components/Navbar'
import axios from 'axios';
import AddTransaction from '../components/AddTransaction';

// const UserContext = createContext({
//   userName: '',
//   setUserName: () => {},
// });

export default function Home() {
  return (
    <div>
      <Head>
        <title>L2 Tokens Bridge Between Rollups</title>
        <meta name="description" content="L2 Bridge App" />
        <link rel="icon" href="/bridge.png" />
      </Head>
      <Navbar />
        <AddTransaction />
        <Transactions/>
    </div>
  )
}
