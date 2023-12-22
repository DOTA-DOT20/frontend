"use client"
import  styles from "./index.module.css";
import { getTickList, getBalanceList } from '@/request/index'
import React, {use, useEffect, useState} from "react";
import {Pagination} from "@nextui-org/react";
import {useConnectWallet} from "@/hooks/usePolkadot";
import {Button} from "@nextui-org/react";

let isRequesting = false

type Token = {
    market_supply: number,
    total_supply: number,
    tick: string
    holders: number
    deploy_number: number
    start_block: number
};
export default function Home() {
    const [ticks, setTicks] = useState([])
    const [inputWord, setInputword] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10
    const [keyword, setKeyword] = useState('')
    const [balanceList, setBalanceList] = useState()

    const {
        connect,
        selectedAccount
    } = useConnectWallet()

    const getBalanceListFun = async () => {
        let data: any = {
            address: selectedAccount.address
        }
        try {
            const res: any = await getBalanceList(data)
            console.log(res)
            if (res.code == 0) {
                setBalanceList(res.balance_list)
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleConnect = async () => {

        const { isWeb3Injected } = await import(
            "@polkadot/extension-dapp"
            );

        if(isWeb3Injected) {
            try {
                await connect()
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('eee')
        }

    }

    const getTicks = async () => {
      try {
        let data: any = {
            page_index: page,
            page_size: pageSize
        }
        if (keyword) {
            data['keyword'] = keyword
        }
        const res: any = await getTickList(data)
        if (res.code == 0) {
            setTicks(res.ticks)
            let total = res.total
            setTotal(Math.ceil(total / pageSize))
        }
        // const res = await getTokens()
        // setTicks(res.tokens)
        isRequesting = false
      } catch (error: any) {
        console.log(error.message)
        isRequesting = false
      }
    }
    const search = () => {
        console.log('search', inputWord)
        setPage(1)
        setKeyword(inputWord)
    }
    const inputKeydown = (e: any) => {
        if (e.keyCode == 13) {
            search()
        }
    }
    useEffect(() => {
        if (isRequesting) {
            return
        } else {
            isRequesting = true
            getTicks()
        }
    }, [page, keyword])
    useEffect(() => {
        if (selectedAccount?.address) {
            getBalanceListFun()
        }
    } , [selectedAccount])
    const keywordChange = (e: any) => {
        setInputword(e.target.value)
    }
    return (
        <main className="h-screen md:px-24 px-8 py-24 w-full">
            <div className={`max-w-3xl mx-auto flex justify-between items-center border px-5 py-2 mb-16 ${styles.searchBox}`}>
                <input type="text" className={`grow h-12 rounded-xl md:px-5 py-4 ${styles.searchInput}`} placeholder="Please input token name..." onChange={keywordChange} onKeyDown={inputKeydown} />
                <button className={`w-40 h-10 p-2 rounded-3xl text-white ${styles.searchButton}`} onClick={search}>Search</button>
            </div>
            <div className={`w-full border px-5 py-4 overflow-auto ${styles.tableContainer}`}>
                <table className={`table-fixed w-full min-w-max ${styles.table}`}>
                    <thead className={`opacity-60 h-10 ${styles.tableHeader}`}>
                        <tr>
                            <th className="rounded-l-3xl w-10">#</th>
                            <th className="min-w-16">Name</th>
                            <th className="min-w-44">Progress</th>
                            <th className="min-w-32 w-44">Total Supply</th>
                            <th className="min-w-32">Minted %</th>
                            <th>Holders</th>
                            <th>Start Block</th>
                            <th>End Block</th>
                            <th className="rounded-r-3xl">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticks.map((token: Token, index: number ) => {
                            const progress = (token.market_supply / token.total_supply * 100).toFixed(2);
                            return (
                                <tr key={token.tick} className={`h-24 border-b ${styles.tableRow}`}>
                                    <td className="text-center">{index + 10 * (page - 1) + 1}</td>
                                    <td className="text-center">{token.tick}</td>
                                    <td className="h-24 flex justify-center items-center">
                                        <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{width: 200}}>
                                            <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{width: progress + '%'}}></div>
                                        </div>
                                    </td>
                                    <td className="text-center">{token.total_supply}</td>
                                    <td className="text-center">{progress}%</td>
                                    <td className="text-center">{token.holders}</td>
                                    <td className="text-center">{token.start_block}</td>
                                    <td className="text-center">{token.start_block + 42000}</td>
                                    <td className="text-center">{selectedAccount?.address ? (balanceList?.[token.tick] || '0') : (
                                        <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white" size="lg"
                                            onClick={handleConnect}>Connect Wallet</Button>
                                    )}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Pagination
                total={total}
                classNames={{
                    wrapper: "gap-10 overflow-visible h-8 rounded border-divider mt-10 ml-auto mr-auto",
                    item: "w-8 h-8 text-small rounded-none bg-transparent",
                    cursor: "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
                }}
                onChange={(page) => setPage(page)}
            />
        </main>
    )
}
