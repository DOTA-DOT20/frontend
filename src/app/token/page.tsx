"use client"
import  styles from "./index.module.css";
import {getTickList, getBalanceList, BalanceItem} from '@/request/index'
import React, { useEffect, useState } from "react";
import {useConnectWallet} from "@/hooks/usePolkadot";
import Image from "next/image";
import goIcon from "@/icons/go.svg";
import Link from "next/link";

let isRequesting = false

type Token = {
    circulating_supply: number,
    total_supply: number,
    tick: string
    holder: number
    deploy_number: number
    total_blocks: number
    start_block: number
};


export default function TokenList() {
    const [ticks, setTicks] = useState([])
    const [inputWord, setInputword] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10
    const [keyword, setKeyword] = useState('')
    const [balanceList, setBalanceList] = useState<{
        [tick: string]: string
    }>({})
    const [blockNumber, setBlockNumber] = useState(0)

    const {
        getApi,
        selectedAccount
    } = useConnectWallet()

    const getBalanceListFun = async () => {
        const defaultTick = 'DOTA'
        const data: any = {
            account: selectedAccount.address,
            tick: defaultTick
        }
        try {
            const res: any = await getBalanceList(data)
            const balance = res?.balance as BalanceItem[]
            if (balance) {
                const list = balance.reduce((prev, item) => {
                    return {
                        ...prev,
                        [item.tick]: parseFloat(item.available).toFixed(0)
                    }
                }, {});
                setBalanceList(balance.length ? list : {[defaultTick]: '0'})
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const getTicks = async () => {
      try {
        const data: any = {
            page_index: page,
            page_size: pageSize
        }
        if (keyword) {
            data['keyword'] = keyword
        }
        const res:any = await getTickList(data)
        const { ticks, total } = res
        if (ticks) {
            setTicks(ticks)
            setTotal(Math.ceil(total / pageSize))
        }
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

    async function loadBlockNumber() {
        const api = await getApi()
        const header = await api.rpc.chain.getHeader()
        const blockNumber = header.number.toNumber()
        console.log(blockNumber);
        if(blockNumber) {
            setBlockNumber(blockNumber)
        }
    }

    useEffect(() => {
        if (isRequesting) {
            return
        } else {
            isRequesting = true
            loadBlockNumber()
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
        <main className="min-h-full md:px-16 px-8 py-16 w-full">
            <div className={`max-w-3xl mx-auto flex justify-between items-center border px-5 py-2 mb-16 ${styles.searchBox}`}>
                <input type="text" className={`grow h-12 rounded-xl md:px-5 py-4 ${styles.searchInput}`} placeholder="Please input token name..." onChange={keywordChange} onKeyDown={inputKeydown} />
                <button className={`w-40 h-10 p-2 rounded-3xl text-white ${styles.searchButton}`} onClick={search}>Search</button>
            </div>
            <div className={`w-full border px-5 py-4 overflow-x-auto overflow-y-hidden ${styles.tableContainer}`}>
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
                            const progress = Math.min(
                                Math.max(
                                    ((1 - ((18723993 - (+blockNumber || 0)) / token.total_blocks)) * 100),
                                    0
                                ),
                                100
                            ).toFixed(2);

                            return (
                                <>
                                    <tr className={`h-24 border-b ${styles.tableRow}`}>
                                        <td className="text-center">{index + 10 * (page - 1) + 1}</td>
                                        <td className="text-center">{token.tick}</td>
                                        <td className="h-24 flex justify-center items-center">
                                            <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{width: 200}}>
                                                <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{width: progress + '%'}}></div>
                                            </div>
                                        </td>
                                        <td className="text-center">{token.total_supply}</td>
                                        <td className="text-center">{(token.circulating_supply / token.total_supply).toFixed(2)}%</td>
                                        <td className="text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {token.holder}
                                                {token.holder && <Link href={`/token/${token.tick}/holders`}>
                                                  <Image src={goIcon} width={16} height={16} alt="go to holders" />
                                                </Link>}
                                            </div>
                                        </td>
                                        <td className="text-center">{token.start_block}</td>
                                        <td className="text-center">{token.start_block + token.total_blocks}</td>
                                        <td className="text-center">
                                            {selectedAccount?.address && (balanceList?.[token.tick] || '0')}
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
