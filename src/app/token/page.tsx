"use client"
import { getTokens } from "@/app/utils/get-tokens"
import  styles from "./index.module.css";
import { getTickList } from '@/request/index'
import React, { useEffect, useState, useRef } from "react";
import {Pagination} from "@nextui-org/react";

let isRequesting = false

export default function Home() {
    const [ticks, setTicks] = useState([])
    const [inputWord, setInputword] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10
    const [keyword, setKeyword] = useState('')
  
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
    const inputKeydown = (e) => {
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
  
    const keywordChange = (e) => {
        setInputword(e.target.value)
    }
    return (
        <main className="min-h-screen p-24">
            <div className={`max-w-3xl mx-auto flex justify-between items-center border px-5 py-2 mb-16 ${styles.searchBox}`}>
                <input type="text" className={`grow h-12 rounded-xl px-5 py-4 ${styles.searchInput}`} placeholder="Please input token name..." onChange={keywordChange} onKeyDown={inputKeydown} />
                <button className={`w-40 h-10 rounded-3xl text-white ${styles.searchButton}`} onClick={search}>Search</button>
            </div>
            <div className={`w-full border px-5 py-4 ${styles.tableContainer}`}>
                <table className="table-auto w-full">
                    <thead className={`opacity-60 h-10 ${styles.tableHeader}`}>
                        <tr>
                            <th className="rounded-l-3xl">#</th>
                            <th>Name</th>
                            <th>Progress</th>
                            <th>Total Supply</th>
                            <th>Minted %</th>
                            <th>Holders</th>
                            <th className="rounded-r-3xl">Deploy Block</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticks.map((token, index) => {
                            const progress = (token.market_supply / token.total_supply * 100).toFixed(2);
                            const progressDoneWidth = progress / 100 * 200;
                            return (
                                <tr key={token.tick} className={`h-24 border-b ${styles.tableRow}`}>
                                    <td className="text-center">{index + 10 * (page - 1) + 1}</td>
                                    <td className="text-center">{token.tick}</td>
                                    <td className="h-24 flex justify-center items-center">
                                        <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{width: 200}}>
                                            <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{width: progressDoneWidth}}></div>
                                        </div>
                                    </td>
                                    <td className="text-center">{token.total_supply}</td>
                                    <td className="text-center">{progress}%</td>
                                    <td className="text-center">{token.holders}</td>
                                    <td className="text-center">{token.deploy_number}</td>
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
