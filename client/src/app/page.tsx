"use client"
import { useState, useEffect } from 'react'
import {
  AuthKitSignInData,
  SafeAuthInitOptions,
  SafeAuthPack,
  SafeAuthUserInfo
} from '@safe-global/auth-kit'
import {EthHashInfo} from '@safe-global/safe-react-components'
import Safe, {EthersAdapter} from '@safe-global/protocol-kit'
import { ethers } from 'ethers';
import {BrowserProvider, Eip1193Provider} from 'ethers';
import { getSafeTxV4TypedData, getTypedData, getV3TypedData } from './typedData'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import {createTheme} from '@mui/system';
import React from 'react'

import cn from './utils/cn'

import ModeIndicator from './components/ModeIndicator'
import CustomerInfo from './components/CustomerInfo'

import { Carousel, Image, Modal } from 'antd';
import Banner from './components/Banner';

const page = () => {

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

const getChainId = async () => {
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

const uiConsole = (title: string, message: unknown) => {
  setConsoleTitle(title)
  setConsoleMessage(typeof message === 'string' ? message : JSON.stringify(message, null, 2))
}


  return (
    <div className='flex flex-wrap flex-row w-full h-full'>


      {/* Left side */}
      <div className='flex flex-col h-full w-3/5 '>
        {/* // Status bar */}
        <div className='flex flex-row gap-2 items-center justify-start p-3 text-8rem font-semibold h-10% w-full '>
          <img src='/logos/chainpay-logo.png' width='37' />
          Chainpay
{/* @ts-ignore */}
      <Box mr={5}>
        {!!safeAuthPack?.isAuthenticated ? (
          <>
          <div className='flex flex-row items-center w-auto h-auto'>
          <Box display="flex" alignItems="center">
            <Button variant="contained" onClick={logout} sx={{ ml: 2 }}>
              Log Out
            </Button>
          </Box>
          <Button onClick={handleOpen}>Open modal</Button>
          </div>

          <Modal
            open={open}
            onCancel={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
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
              onClick={() => getChainId()}
            >
              eth_chainId
            </Button>
              <Typography variant="body1" color="primary" fontWeight={700}>
              {consoleTitle}
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              sx={{ mt: 2, overflowWrap: 'break-word' }}
            >

              {consoleMessage}
              {/* <div>Name: {consoleMessage.('name')} </div>
              <img src={consoleMessage).profileImage} alt="" />
              <div>Email: {consoleMessage).email} </div>
              <div>Verifier: {JSON.parse(consoleMessage).verifier}</div>
              <div>VerifierID: {JSON.parse(consoleMessage).verifierId}</div>
              <div>Verifier Params: {consoleMessage)verifierParams}</div>
              <div>Type of Login: {consoleMessage)typeOfLogin}</div> */}
              
            </Typography>
            </Box>
          </Modal>
          </>
        ) : (
          <Button variant="contained" onClick={login}>
            Login
          </Button>
        )}
      </Box>

      
        </div>

        <ModeIndicator />

        <CustomerInfo 
        onLogin={login}
        onLogout={logout}
        isLoggedIn={!!safeAuthPack?.isAuthenticated}
          userInfo={userInfo || undefined}
          
        />

      </div>

      {/* // Right side */}
      <Banner />

    </div>
  )
}

export default page