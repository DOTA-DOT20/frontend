"use client"
import styles from "./index.module.css";
import { Spinner, Pagination } from '@nextui-org/react'
import React, { useState } from "react";
// import {useConnectWallet} from "@/hooks/usePolkadot";
import Image from "next/image";
import upIcon from "@/icons/up.svg";
import downIcon from "@/icons/down.svg";
import dotaIcon from "@/icons/dota.svg";
import Link from "next/link";

export default function Home() {
  const [inputWord, setInputword] = useState('')
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const search = () => {
    console.log('search', inputWord)
    setPage(1)
    setKeyword(inputWord)
  }

  const keywordChange = (e: any) => {
    setInputword(e.target.value)
  }

  const inputKeydown = (e: any) => {
    if (e.keyCode == 13) {
      search()
    }
  }

  return (
    <main className="min-h-full md:px-16 px-8 py-16 w-full">
      <div className={styles.marketplaceTitle}>The Ultimate DOT-20 Explorer</div>
      <div className={styles.marketplaceIntro}>Innovative asset standard on Polkadot</div>
      <div className={`max-w-3xl mx-auto flex justify-between items-center border px-5 py-2 mb-16 ${styles.searchBox}`}>
        <input type="text" className={`grow h-12 rounded-xl md:px-5 py-4 ${styles.searchInput}`} placeholder="Please input token name..." onChange={keywordChange} onKeyDown={inputKeydown} />
        <button className={`w-40 h-10 p-2 rounded-3xl text-white ${styles.searchButton}`} onClick={search}>Search</button>
      </div>
      <div className={`w-full border px-5 py-4 overflow-x-auto overflow-y-hidden ${styles.tableContainer}`}>
        <table className={`table-fixed w-full min-w-max ${styles.table}`}>
          <thead className={`opacity-60 h-10 ${styles.tableHeader}`}>
            <tr>
              <th className="rounded-l-3xl">Token</th>
              <th className="min-w-16">Price</th>
              <th className="min-w-44">Change 24H</th>
              <th className="min-w-32 w-44">Volume 24H</th>
              <th className="min-w-32">Total Volume</th>
              <th>Marketcap</th>
              <th>Total Supply</th>
              <th className="rounded-r-3xl">Token Holders</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`h-24 border-b ${styles.tableRow}`}>
              <td className="text-center">DOTA</td>
              <td className="text-center">
                1,000 sats
                <br />
                <span className={styles.tdIntro}>$16.35</span>
              </td>
              <td className="text-center">
                <Image className={styles.icon} src={upIcon} width={24} height={24} alt="up" />
                <span className={styles.changeUp}>
                  188%
                </span>
              </td>
              <td className="text-center">
                <div className={styles.flex}>
                  <Image className={styles.icon} src={dotaIcon} width={16} height={16} alt="dota" />
                  <span>
                    955,725,123
                  </span>
                </div>
                <div className={styles.tdIntro}>
                  $2,932,133.81
                </div>
              </td>
              <td className="text-center">
                <div className={styles.flex}>
                  <Image className={styles.icon} src={dotaIcon} width={16} height={16} alt="dota" />
                  <span>
                    955,725,123
                  </span>
                </div>
                <div className={styles.tdIntro}>
                  $2,932,133.81
                </div>
              </td>
              <td className="text-center">
                <div className={styles.flex}>
                  <Image className={styles.icon} src={dotaIcon} width={16} height={16} alt="dota" />
                  <span>
                    955,725,123
                  </span>
                </div>
                <div className={styles.tdIntro}>
                  $2,932,133.81
                </div>
              </td>
              <td className="text-center">21,000,000</td>
              <td className="text-center">16,357</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex w-full justify-center mt-8">
          <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={1}
              total={20}
              // onChange={(page) => replace({page: `${page}`})}
          />
      </div>
    </main>
  )
}
