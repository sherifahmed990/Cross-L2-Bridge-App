import React, { useState } from 'react';
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

export default function Navbar() {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };
  return (
    <div className='rounded-div flex items-center justify-between h-20 font-bold sticky top-0 z-50' style={{ backgroundColor: '#ecf0f3' }}>
        <img src="bridge.png" alt='/' width='80' height='80' />
          <h1 className='text-2xl m-2'>Cross L2 Bridge Between Rollups</h1>
        {/* <div className='hidden md:block'>
            <ThemeToggle />
        </div> */}

        <div>
          <ul className='hidden md:flex mr-10'>
            <Link href='/'>
              <li className='ml-10 text-sm uppercase cursor-pointer'>Home</li>
            </Link>
            <Link href='/about'>
              <li className='ml-10 text-sm uppercase cursor-pointer'>About</li>
            </Link>
            </ul>
        </div> 

        {/* Menu Icon */}
      <div onClick={handleNav} className='block md:hidden cursor-pointer z-10'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu */}
      <div
        className={
          nav
            ? 'md:hidden fixed left-0 top-20 flex flex-col items-center justify-between w-full h-[90%] bg-primary ease-in duration-300 z-10 bg-white'
            : 'fixed left-[-100%] top-20 h-[90%] flex flex-col items-center justify-between ease-in duration-30'
        }
        style={{ backgroundColor: '#ecf0f3' }}>
        <ul className='w-full p-4'>
          <li onClick={handleNav} className='border-b py-6'>
            <Link href='/'>Home</Link>
          </li>
          <li onClick={handleNav} className='border-b py-6'>
            <Link href='/about'>About</Link>
          </li>
          <li className=' py-6'>
          <div className='flex items-center justify-between max-w-[630px] m-auto py-4'>
        <p>Developer : Sherif Abdelmoatty</p> 
      
            <a href='https://github.com/sherifahmed990/' target='_blank' rel="noreferrer">
              <div className='rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaGithub />
              </div>
            </a>

          </div>
          </li>
        </ul>

        

        </div>
    </div>
  )
}
