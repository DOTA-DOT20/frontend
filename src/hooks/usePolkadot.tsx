"use client"

const { ApiPromise, WsProvider } = require('@polkadot/api');
import {useRecoilState} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {accountState} from "@/stores/account";
import {useMemo, useState} from "react";

const provider = new WsProvider('wss://rect.me');

const ss58Format = 42;

export const useConnectWallet = () => {
    const [selectedAccount, setSelectedAccount] = useRecoilState<InjectedAccountWithMeta>(accountState);
    const [allAccounts, setAllAccounts] = useState<InjectedAccountWithMeta[]>([]);

    const connect = async () => {
        const { web3Accounts, web3Enable } = await import(
            "@polkadot/extension-dapp"
            );


        const extensions = await web3Enable("DOTA - DOT20");
        if (extensions.length === 0) {
            console.log("Please use SubWallet or Polkadot.js extension");
            alert("Please use SubWallet or Polkadot.js extension");
            return;
        }
        const accounts = await web3Accounts({ss58Format});
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
            setSelectedAccount,
            getApi: () => {
                return ApiPromise.create({provider})
            },
            getInjectedAccount: async () => {

                const { web3FromAddress } = await import(
                    "@polkadot/extension-dapp"
                    );


                if(selectedAccount?.address) {
                    return web3FromAddress(selectedAccount.address)
                }
            }
        }
    }, [selectedAccount, allAccounts])
}


