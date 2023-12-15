"use client";

import { MetaMaskInpageProvider } from "@metamask/providers";
import { ExternalProvider } from "@ethersproject/providers";


export const getMetaMask = () => {
    if (window.ethereum) {
        const ethereum = window.ethereum;
        return ethereum as unknown as MetaMaskInpageProvider & ExternalProvider;
    } else {
        throw new Error("MetaMask not found");
    }
}