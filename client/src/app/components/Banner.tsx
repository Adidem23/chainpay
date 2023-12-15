'use client'

import React from 'react'

import { Carousel, Image } from 'antd';
import { useChainStore } from './store/chainStore';

const Banner = () => {

  const sponsorArr = ['1inch.png', 'safe.png', 'safe.png', 'push.png' ]

  const {mode} = useChainStore() as any;

  return (
    
    <div className='flex flex-col h-full items-center justify-around w-2/5 bg-[#87C4FF78]'>
        <div className='flex flex-col h-1/2 items-center justify-center w-full'>
          <img src="/logos/chainpay-logo.png" width={120} alt="chainpay" />
          <div className='text-3xl mt-2 font-bold text-black'>ChainPay</div>
          <div className='text-lg mt-5 text-black'>Your Preferred <span className='font-semibold'>Currency</span>, Your Seamless <span className='font-semibold'>Trade</span></div>
        </div>

        <div className='flex flex-col h-1/4 items-center justify-center w-full'>
          <img src={`/logos/${''+sponsorArr[mode]}`} width={150} height={50} alt="" />
        </div>

        <div className='flex flex-col h-1/4 items-center justify-center w-full'>
          <div className='flex flex-col items-center justify-evenly h-30% w-95% text-lg text-black'>
            {/* User add */}
            {/* Chain id */}
            <div className='flex flex-row items-center h-1/6 w-30% text-lg font-semibold text-black'>Chain ID:</div>
            <div className='flex flex-row items-center h-1/6 w-30%  text-black'>0x677953216891546</div>
            {/* User name */}
            {/* Email id */}
            {/*  */}
          </div>
          
        </div>
      </div>
  )
}

export default Banner