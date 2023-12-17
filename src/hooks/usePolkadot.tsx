"use client"

import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";

export const connectWallet = async () => {
    const extensions = await web3Enable("Data tranding market");
    if (extensions.length === 0) {
        console.log("Please create cess-hacknet chain account.");
        return;
    }
    const allAccounts = await web3Accounts(); // 获取所有波卡钱包账户
    console.log("allAccounts========", allAccounts);
    if (allAccounts.length == 0) {
        console.log("Please create account fisrt.");
    }
    return allAccounts
}


