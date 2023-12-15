"use client";

import { getMetaMask } from "../hooks/web";
import { ethers } from "ethers";

export const getWalletDetails = async (): Promise<{ signer: ethers.providers.JsonRpcSigner, address: string, provider: ethers.providers.Web3Provider }> => {
    console.log('called getWalletDetails')
    const metamask = getMetaMask();
    await metamask.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(metamask);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('get wallet details returned', { signer, address, provider })
    return { signer, address, provider };
}