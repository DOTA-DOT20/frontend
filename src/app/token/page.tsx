"use client"
import  styles from "./index.module.css";
import { getTickList, getBalanceList, getUsersIncData, getTransactionAmount } from '@/request/index'
import React, {useRef, useEffect, useState} from "react";
import {useConnectWallet} from "@/hooks/usePolkadot";
import {ScrollShadow, Button} from "@nextui-org/react";
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/pie';

let isRequesting = false

let timeout: any = null

type Token = {
    market_supply: number,
    total_supply: number,
    tick: string
    holders: number
    deploy_number: number
    start_block: number
};
const lineOption = {
    grid: {
        top: '5%',
        left: '10%',
        right: '5%',
        bottom: '30%'
    },
    xAxis: {
        type: 'category',
        data: [''],
        axisLabel: {
        color: '#FFF',
        fontSize: '10px'
        },
        splitLine: {
        show: true,
        lineStyle: {
            color: '#FFF',
            opacity: 0.1
        }
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
        color: '#FFF',
        fontSize: '10px'
        },
        splitLine: {
        show: false
        }
    },
    series: [
        {
        data: [],
        type: 'line',
        center: ['50%', '38%'],
        smooth: true,
        lineStyle: {
            color: '#DE0376'
        },
        symbol: (value: any, params: any) => {
            if (params.dataIndex === 6) {
                return 'circle'
            } else {
                return 'none'
            }
        },
        symbolSize: 8,
        itemStyle: {
            color: '#DE0376'
        }
        }
    ]
};
const option = {
    title: {
        show: false,
        text: '',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
    },
    color: ['#DE0376', '#7B2150'],
    series: [
      {
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['50%', '38%'],
        data: [{value: 0, name: 'DOTA'}, {value: 0, name: 'Others'}],
        itemStyle: {
            normal: {
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                }
            }
        }
      }
    ]
};
export default function Home() {
    const [ticks, setTicks] = useState([])
    const [inputWord, setInputword] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10
    const [keyword, setKeyword] = useState('')
    const [balanceList, setBalanceList] = useState()
    const [liveData, setLiveData] = useState<any>([])
    const [blockNumber, setBlockNumber] = useState(0)

    const lineRef = useRef<any>(null)
    const pieRef = useRef<any>(null)

    const {
        getApi,
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
            await connect()
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
    const getTransaction = async () => {
        const api = await getApi()
        try {
            let res:any = await getTransactionAmount({})
            if (res.code == 0) {
                let txList = res.tx_list
                let tx = txList[0]
                let blockHeight = tx.block_height
                const hash = await api.rpc.chain.getBlockHash(blockHeight);
                const block = await api.rpc.chain.getBlock(hash);
                let live:any = []
                block.block.extrinsics.forEach((extrinsic: any) => {
                    live.unshift({
                        hash: extrinsic.hash.toString(),
                        block: blockHeight
                    })
                });
                setLiveData(live)
                let echarts = pieRef.current.getEchartsInstance()
                option.series[0].data[0].value = tx.dota_amount
                option.series[0].data[1].value = tx.tx_amount - tx.dota_amount
                echarts.setOption(option);
            }
            timeout = setTimeout(() => {
                getTransaction()
            }, 6000)
        } catch (error) {
            console.log(error)
            timeout = setTimeout(() => {
                getTransaction()
            }, 6000)
        }

    }
    const getUsersIncDataFun = async () => {
        const api = await getApi()
        const header = await api.rpc.chain.getHeader()
        const blockNumber = header.number.toNumber()
        const data = {
            blockNumber: blockNumber,
            tick: 'dota'
        }
        try {
            const res: any = await getUsersIncData(data)
            let now = new Date().getTime()
            let times = []
            for (let i = 0; i < 7; i++) {
                let time = now - 3600000 * i
                let hour = new Date(time).getHours()
                let hourStr = hour < 10 ? '0' + hour : hour
                times.push(`${hourStr}:00`)
            }
            lineOption.series[0].data = res.map((item: any) => item[0])
            lineOption.xAxis.data = times.reverse()
            let echarts = lineRef.current.getEchartsInstance()
            echarts.setOption(lineOption);
        } catch (error: any) {
            console.log(error.message)
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
    useEffect(() => {

        getTransaction()
        window.addEventListener('beforeunload', () => {
            clearTimeout(timeout)
        })
        return () => {
            clearTimeout(timeout)
        }
    }, [])
    const keywordChange = (e: any) => {
        setInputword(e.target.value)
    }
    return (
        <main className="min-h-full md:px-24 px-8 py-24 w-full">
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
                            // const progress = (token.market_supply / token.total_supply * 100).toFixed(2);
                            const progress = ((1 - ((18723993 - (+blockNumber)) / 42000)) * 100).toFixed(2);
                            
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
                                        <td className="text-center">{blockNumber ? progress : '--'}%</td>
                                        <td className="text-center">{token.holders}</td>
                                        <td className="text-center">{token.start_block}</td>
                                        <td className="text-center">{token.start_block + 42000}</td>
                                        <td className="text-center">{selectedAccount?.address ? (balanceList?.[token.tick] || '0') : (
                                            <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white" size="lg"
                                                onClick={handleConnect}>Connect Wallet</Button>
                                        )}</td>
                                    </tr>
                                    <tr className={`h-24 border-b ${styles.tableRow}`}>
                                        <td colSpan={9}>
                                            <span className="flex justify-center items-center" style={{padding: '20px 0'}}>
                                                <span className={`text-center ${styles.section}`} style={{overflow: 'hidden', display: 'block'}}>
                                                    <div className="mb-2.5 flex justify-between align-middle">
                                                        <div>Live ( {liveData.length} )</div>
                                                        {
                                                            liveData.length && <div>Estimate Rewards: <span className="text-large text-primary">{Math.floor(5000000 / liveData.length)}</span> ${token.tick}</div>
                                                        }
                                                    </div>
                                                    <p className="flex justify-center items-center" style={{width: '100%', backgroundColor: '#252024', borderRadius: 12, height: 24, marginBottom: 2}}>
                                                        <span className="rounded-l-3xl" style={{fontSize:12, flex: 1}}>Block</span>
                                                        <span className="rounded-r-3xl" style={{fontSize:12, flex: 2}}>Hash</span>
                                                    </p>
                                                    <ScrollShadow className="h-[250px]" style={{width: '100%'}}>
                                                        <table className={`table-fixed w-full min-w-max`} style={{minWidth: '100%'}}>
                                                            <tbody>
                                                            {
                                                                liveData.map((item: any) => (
                                                                    <tr style={{height: 40, borderBottom: '1px solid rgba(255, 255, 255, 0.10)'}}>
                                                                        <th style={{fontSize:12}}>{item.block}</th>
                                                                        <th colSpan={2} style={{fontSize:12, textOverflow: 'ellipsis', overflow: 'hidden'}}><a target="_blank" href={`https://polkadot.subscan.io/extrinsic/${item.hash}`} >{item.hash}</a></th>
                                                                    </tr>
                                                                ))
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </ScrollShadow>
                                                </span>
                                                <span className={`text-center ${styles.section}`}>
                                                    <p className="text-left mb-2.5">DOTA Ratio</p>
                                                    <p style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: 12}}>
                                                        <p style={{display: 'flex', alignItems: 'center'}}>DOTA <span style={{marginLeft: 8, width: 12, height: 12, borderRadius: '50%', background: '#DE0376'}}></span></p>
                                                        <p style={{display: 'flex', alignItems: 'center', marginLeft: 15}}>Others <span style={{marginLeft: 8, width: 12, height: 12, borderRadius: '50%', background: '#7B2150'}}></span></p>
                                                    </p>
                                                    <ReactEcharts ref={pieRef} option={option} style={{height: 360}} />
                                                </span>

                                            </span>
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
