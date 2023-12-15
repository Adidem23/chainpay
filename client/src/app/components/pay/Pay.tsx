"use client"
import React from 'react'
import { useChainStore } from '../store/chainStore'
import { Princess_Sofia } from 'next/font/google';
import { useState, useEffect } from 'react'
import {
  AuthKitSignInData,
  SafeAuthInitOptions,
  SafeAuthPack,
  SafeAuthUserInfo
} from '@safe-global/auth-kit'
import {EthHashInfo} from '@safe-global/safe-react-components'
import Safe, {EthersAdapter} from '@safe-global/protocol-kit'
import {ethers, BrowserProvider, Eip1193Provider} from 'ethers';
import { getSafeTxV4TypedData, getTypedData, getV3TypedData } from '../../typedData'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import {createTheme} from '@mui/system';
import { Carousel, Image, Modal } from 'antd';

import { send } from 'process'

const Pay = () => {
  const [safeAuthPack, setSafeAuthPack] = useState<SafeAuthPack>()
  const [isAuthenticated, setIsAuthenticated] = useState(!!safeAuthPack?.isAuthenticated)
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
    null
  )
  const [userInfo, setUserInfo] = useState<SafeAuthUserInfo | null>(null)
  const [chainId, setChainId] = useState<string>()
  const [balance, setBalance] = useState<string>()
  const [consoleMessage, setConsoleMessage] = useState<string>('')
  const [consoleTitle, setConsoleTitle] = useState<string>('')
  const [provider, setProvider] = useState<BrowserProvider>()
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
const {address, setAddress} = useChainStore();
const {amount, setAmount} = useChainStore();
  const [addr, setAddr] = React.useState('');
  const [price ,setPrice] = React.useState(0);

  useEffect(() => {
    // @ts-expect-error - Missing globals
    const params = new URL(window.document.location).searchParams
    const chainId = params.get('chainId');

    (async () => {
      const options: SafeAuthInitOptions = {
        enableLogging: true,
        buildEnv: 'production',
        chainConfig: {
          chainId: chainId || '0x64',
          rpcTarget: 'https://gnosis.drpc.org'
        }
      }
     

      const authPack = new SafeAuthPack()

      await authPack.init(options)

      console.log('safeAuthPack:safeEmbed', authPack.safeAuthEmbed)

      setSafeAuthPack(authPack)

      authPack.subscribe('accountsChanged', async (accounts) => {
        console.log('safeAuthPack:accountsChanged', accounts, authPack.isAuthenticated)
        if (authPack.isAuthenticated) {
          const signInInfo = await authPack?.signIn()

          setSafeAuthSignInResponse(signInInfo)
          setIsAuthenticated(true)
        }
      })

      authPack.subscribe('chainChanged', (eventData) =>
        console.log('safeAuthPack:chainChanged', eventData)
      )
    })()
  }, [])

  useEffect(()=> {
      if(!safeAuthPack || !isAuthenticated) return;
      (async () => {
        const web3Provider = safeAuthPack.getProvider()
        const userInfo = await safeAuthPack.getUserInfo()
  
        setUserInfo(userInfo)
  
        if (web3Provider) {
          const provider = new BrowserProvider(safeAuthPack.getProvider() as Eip1193Provider)
          const signer = await provider.getSigner()
          const signerAddress = await signer.getAddress()
  
          setChainId((await provider?.getNetwork()).chainId.toString())
          setBalance(
            ethers.formatEther((await provider.getBalance(signerAddress)) as ethers.BigNumberish)
          )
          setProvider(provider)
        }
      })()
  }, [isAuthenticated])

  const login = async() => {
    const signInInfo = await safeAuthPack?.signIn()

    if (signInInfo) {
      setSafeAuthSignInResponse(signInInfo)
    } else {
      setSafeAuthSignInResponse(null)
    }
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await safeAuthPack?.signOut()

    setSafeAuthSignInResponse(null)
  }

  const getUserInfo = async () => {
    const userInfo = await safeAuthPack?.getUserInfo()

    uiConsole('User Info', userInfo)
  }

  const getAccounts = async () => {
    const accounts = await provider?.send('eth_accounts', [])

    uiConsole('Accounts', accounts)
  }

 
 


  const getChainId = async (text: string, name: string) => {
    const chainId = await provider?.send('eth_chainId', [])  
    uiConsole('ChainId', chainId)
  }

  const signAndExecuteSafeTx = async (index: number) => {
    const safeAddress = safeAuthSignInResponse?.safes?.[index] || '0x'

    // Wrap Web3Auth provider with ethers
    const provider = new BrowserProvider(safeAuthPack?.getProvider() as Eip1193Provider)
    const signer = await provider.getSigner()
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })
    const protocolKit = await Safe.create({
      safeAddress,
      ethAdapter
    })

    // Create transaction
    let tx = await protocolKit.createTransaction({
      transactions: [
        {
          to: ethers.getAddress(safeAuthSignInResponse?.eoa || '0x'),
          data: '0x',
          value: ethers.parseUnits('0.0001', 'ether').toString()
        }
      ]
    })

    // Sign transaction. Not necessary to execute the transaction if the threshold is one
    // but kept to test the sign transaction modal
    tx = await protocolKit.signTransaction(tx)

    // Execute transaction
    const txResult = await protocolKit.executeTransaction(tx)
    uiConsole('Safe Transaction Result', txResult)
  }

  const signMessage = async (data: any, method: string) => {
    let signedMessage

    const params = {
      data,
      from: safeAuthSignInResponse?.eoa
    }

    if (method === 'eth_signTypedData') {
      signedMessage = await provider?.send(method, [params.data, params.from])
    } else if (method === 'eth_signTypedData_v3' || method === 'eth_signTypedData_v4') {
      signedMessage = await provider?.send(method, [params.from, JSON.stringify(params.data)])
    } else {
      signedMessage = await (await provider?.getSigner())?.signMessage(data)
    }

    uiConsole('Signed Message', signedMessage)
  }

  const sendTransaction = async () => {
    const tx = await provider?.send('eth_sendTransaction', [
      {
        from: safeAuthSignInResponse?.eoa,
        to: safeAuthSignInResponse?.eoa,
        value: ethers.parseUnits('0.001', 'ether').toString(),
        gasLimit: 21000
      }
    ])

     console.log("Clicked on Pay")
    uiConsole('Transaction Response', tx)
  }

  const switchChain = async () => {
    const result = await provider?.send('wallet_switchEthereumChain', [
      {
        chainId: '0x1'
      }
    ])

    uiConsole('Switch Chain', result)
  }

  const addChain = async () => {
    const result = await provider?.send('wallet_addEthereumChain', [
      {
        chainId: '0x2105',
        chainName: 'Base',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://base.publicnode.com'],
        blockExplorerUrls: ['https://basescan.org/']
      }
    ])

    uiConsole(`Add chain`, result)
  }

  const uiConsole = (title: string, message: unknown) => {
    setConsoleTitle(title)
    setConsoleMessage(typeof message === 'string' ? message : JSON.stringify(message, null, 2))
  }
  return (
    <div className='flex flex-col items-center justify-evenly w-full h-4/6 overflow-scroll'>
       <div className='flex flex-row h-20% w-80% items-center justify-center gap-4 '>
            <div className='text-black text-lg'>The Amount to be Paid: </div>
            <input type="text" placeholder='Amount' className='text-lg text-[#8F8F8F] font-bold px-2 rounded-[6px] border-[1px] border-black' onChange={(e) => {setPrice(e.target.value)}} />
        </div> 

        <div className='flex flex-row h-20% w-80% items-center justify-center'>
            <input type="text" onChange={(e)=>setAddr(e.target.value)} placeholder='Enter Etherium address' className='text-black px-2 py-1 rounded-[6px] border-[1px] border-black w-full' />
        </div>
        
        <div className='flex flex-row h-20% w-80% items-center justify-center'>
            <button onClick={() => sendTransaction() } className='flex items-center justify-center  w-30% rounded-[50px] h-full font-bold text-white bg-[#39A7FF] cursor-pointer'>PAY</button>
        </div>
        {safeAuthSignInResponse?.eoa && (
        <Grid container>
          <Grid item md={4} p={4}>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              Signer
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h4" color="primary" fontWeight="bold">
              Chain{' '}
              <Typography component="span" color="secondary" fontSize="1.45rem">
                {chainId}
              </Typography>
            </Typography>
            <Typography variant="h4" color="primary" sx={{ my: 1 }} fontWeight="bold">
              Balance{' '}
              <Typography component="span" color="secondary" fontSize="1.45rem">
                {balance}
              </Typography>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              sx={{ my: 1 }}
              onClick={() => getUserInfo()}
            >
              getUserInfo
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ my: 1 }}
              onClick={() => getAccounts()}
            >
              eth_accounts
            </Button>
            
           
           
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ my: 1 }}
              onClick={() => sendTransaction()}
            >
              eth_sendTransaction
            </Button>
            
          </Grid>
          <Grid item md={3} p={4}>
            <>
              <Typography variant="h3" color="secondary" fontWeight={700}>
                Safe accounts
              </Typography>
              <Divider sx={{ my: 2 }} />
              {safeAuthSignInResponse?.safes?.length ? (
                safeAuthSignInResponse?.safes?.map((safe, index) => (
                  <>
                    <Box sx={{ my: 3 }} key={index}>
                      <EthHashInfo address={safe} showCopyButton shortAddress={true} />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={() => signAndExecuteSafeTx(index)}
                    >
                      Sign and execute
                    </Button>
                    <Divider sx={{ my: 3 }} />
                  </>
                ))
              ) : (
                <Typography variant="body1" color="secondary" fontWeight={700}>
                  No Available Safes
                </Typography>
              )}
            </>
          </Grid>
          <Grid item md={5} p={4}>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              Console
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" color="primary" fontWeight={700}>
              {consoleTitle}
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              sx={{ mt: 2, overflowWrap: 'break-word' }}
            >
              {consoleMessage}
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default Pay