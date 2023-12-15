import React from 'react'

import { Select } from 'antd'

interface SwapCardProps {
    from: boolean
}

const SwapCard: React.FC<SwapCardProps> = ({from}) => {

    const chains = ['']

  return (
    <div className='flex flex-col items-center justify-evenly h-full w-30% bg-[#C7E3FF] rounded-[6px] p-1'>
        <div className='h-10% w-full flex flex-row items-center justify-between text-sm ml-4'>{from ? "From" : "To"}</div>

        <div className='flex flex-row w-full items-center justify-between h-70%'>

            <div className='h-full w-70% flex flex-row items-center justify-start p-0 '>
                <img className='rounded-full ' width={45} src="" alt="" />
                <Select className='text-sm font-semibold' defaultValue="MATIC" style={{ width: 100, fontWeight: 600 }} bordered={false}>
                    {chains?.map((code: any) => (
                        <Select.Option value={code.code}>{code.dial_code} <span className='text-sm font-semibold' >{code.code}</span> </Select.Option>
                    ))}
                </Select>
            </div>

            <div className='w-25% h-70%  rounded-[8px] '>
                {
                    from ?
                    <input className='flex items-center justify-center h-full w-full text-sm font-semibold  p-1 rounded-[8px]' placeholder='0.00' />
                    :
                    <div className='flex items-center justify-center h-full w-full text-sm font-semibold p-1 '>0.00</div>
                }
            </div>
        </div>    
    </div>
  )
}

export default SwapCard