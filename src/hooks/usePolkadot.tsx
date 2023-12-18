"use client"

const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
import {web3Accounts, web3Enable, web3FromAddress} from "@polkadot/extension-dapp";
import {useRecoilState} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {accountState} from "@/stores/account";
import {useMemo, useState} from "react";

const provider = new WsProvider('wss://eosla.com');

const ss58Format = 0;

export const useConnectWallet = () => {
    const [selectedAccount, setSelectedAccount] = useRecoilState<InjectedAccountWithMeta>(accountState);
    const [allAccounts, setAllAccounts] = useState<InjectedAccountWithMeta[]>([]);

    const connect = async () => {
        const extensions = await web3Enable("DOTA - DOT20");
        if (extensions.length === 0) {
            console.log("Please create cess-hacknet chain account.");
            return;
        }
        const accounts = await web3Accounts();
        console.log("accounts========", accounts);
        if (accounts.length == 0) {
            console.log("Please create account fisrt.");
        }
        setAllAccounts(accounts || [])
        if(accounts?.[0]) {
            setSelectedAccount(accounts[0])
        }
    }

    return useMemo(() => {
        return {
            connect,
            selectedAccount,
            allAccounts,
            getApi: () => {
                return ApiPromise.create({provider})
            },
            getInjectedAccount: async () => {
                if(selectedAccount?.address) {
                    return web3FromAddress(selectedAccount.address)
                }
            }
        }
    }, [selectedAccount, allAccounts])
}


