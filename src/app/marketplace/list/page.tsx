"use client"
import React, { useState } from "react";
import styles from './index.module.css'
import Image from "next/image";
import backIcon from '@/icons/back.svg'
import dotaIcon from '@/icons/dota.svg'
import { Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem } from '@nextui-org/react'
import { useConnectWallet } from "@/hooks/usePolkadot";

import Link from "next/link"

const groudList = [
  {
    value: 1,
    label: 'Listed'
  },
  {
    value: 2,
    label: 'Orders'
  },
  {
    value: 3,
    label: 'My Orders'
  },
  {
    value: 4,
    label: 'Holders'
  }
]

const periodItems = [
  {
    value: 7,
    label: '1 Week'
  },
  {
    value: 30,
    label: '1 Month'
  }
]

export default function MarketplaceList() {
  const [listType, setListType] = useState(1)
  const [isOpenListOrder, setIsOpenListOrder] = useState(false)
  const [isOpenBuy, setIsOpenBuy] = useState(false)

  const [listPrice, setListPrice] = useState('')
  const [listAmount, setListAmount] = useState('')

  const [period, setPeriod] = useState(7)

  const { selectedAccount } = useConnectWallet()

  const cardList = () => {
    return <>
      <div className={`my-8 ${styles.cardList}`}>
        <div className={styles.cardItem}>
          <div className={styles.cardTitle}>
            DOTA
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardContentText}>
              1,000,000
            </div>

            <div className={styles.cardContentSecond}>
              0.001 DOT / DOTA
            </div>
            <div className={styles.cardContentSecond}>
              $0.1 / DOTA
            </div>
          </div>
          <div className={`flex justify-center p-4`}>
            <Image src={dotaIcon} width={16} height={16} alt="dota" />
            <span className={`${styles.secondText} ${styles.mgl4}`}>100</span>
            <span className={`${styles.secondText} ${styles.leftAuto}`}>
              $10,000
            </span>
          </div>
          <div className="p-3">
            <button className={`h-10 p-2 rounded-3xl text-white width-full ${styles.searchButton} ${styles.widthFull}`} onClick={() => setIsOpenBuy(true)}>Buy</button>
          </div>
        </div>
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
    </>
  }

  const holders = () => {
    return <>
      <div className={`w-full border px-5 py-4 overflow-x-auto overflow-y-hidden my-8 ${styles.tableContainer}`}>
        <table className={`table-fixed w-full min-w-max ${styles.table}`}>
          <thead className={`opacity-60 h-10 ${styles.tableHeader}`}>
            <tr>
              <th className="rounded-l-3xl w-40">Rank</th>
              <th className="min-w-44">Address</th>
              <th className="min-w-44">Percentage</th>
              <th className="rounded-r-3xl w-80">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`h-24 border-b ${styles.tableRow}`}>
              <td className="text-center">1</td>
              <td className="text-center">15zVRNWm ...... NR2aZzZF</td>
              <td className="text-center">
                <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{ width: 200, margin: '0 auto' }}>
                  <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{ width: 50 + '%' }}></div>
                </div>
              </td>
              <td className="text-center">25,241,509,673,168</td>
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
    </>
  }

  return (
    <main className="min-h-full md:px-16 px-8 py-16 w-full">
      <Link href="/marketplace">
        <div className={styles.back}>
          <Image src={backIcon} width={8} alt="back" />
          <span className={styles.backText}>Dota</span>
        </div>
      </Link>

      <div className={styles.info}>
        <div className="text-center">
          <span className={styles.infoText}>
            Floor Price
          </span>
          <div className={styles.infoContent}>
            <Image src={dotaIcon} width={16} alt="dota" />
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className={styles.infoText}>
            24 Hour Volume
          </span>
          <div className={styles.infoContent}>
            <Image src={dotaIcon} width={16} alt="dota" />
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className={styles.infoText}>
            7 Days Volume
          </span>
          <div className={styles.infoContent}>
            <Image src={dotaIcon} width={16} alt="dota" />
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className={styles.infoText}>
            24 Hour Sales
          </span>
          <div className={styles.infoContent}>
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className={styles.infoText}>
            Total Item Listed
          </span>
          <div className={styles.infoContent}>
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className={styles.infoText}>
            Total Volume
          </span>
          <div className={styles.infoContent}>
            <Image src={dotaIcon} width={16} alt="dota" />
            <span className={styles.infoContentText}>
              1,000 dot
            </span>
          </div>
        </div>
      </div>

      <div className={styles.groudArea}>
        <div className={styles.groud}>
          {
            groudList.map(item => {
              return (
                <span
                  className={`${styles.groudItem} ${listType === item.value ? styles.active : ''}`}
                  onClick={() => setListType(item.value)}>
                  {item.label}
                </span>
              )
            })
          }
        </div>

        <button className={`w-40 h-10 p-2 rounded-3xl text-white ${styles.searchButton}`} onClick={() => setIsOpenListOrder(true)}>List</button>
      </div>

      {listType === 4 ? holders() : cardList()}

      {/* List */}
      <Modal backdrop="blur" size="xl" isOpen={isOpenListOrder} onClose={() => setIsOpenListOrder(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className={`flex flex-col gap-1 text-center ${styles.borderBottom}`}>List DOTA for sale</ModalHeader>
              <ModalBody className={styles.borderBottom}>
                <div className={styles.listInfo}>
                  <div className="flex items-center justify-center">
                    <Image src={dotaIcon} width={36} height={36} alt="dota" />
                    <div className="flex items-baseline">
                      <span className={styles.listAmount}>
                        100,000,000
                      </span>
                      <span className={styles.listUnit}>
                        DOTA
                      </span>
                    </div>
                  </div>
                  <div className={styles.listAvailable}>Available amount</div>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center flex-wrap">
                <Input
                    label="Price"
                    labelPlacement="outside-left"
                    placeholder="Please Input your price"
                    value={listPrice}
                    onValueChange={setListPrice}
                    className="my-4"
                    classNames={{
                      label: styles.inputLabel,
                      base: 'flex',
                      mainWrapper: styles.input
                    }}
                />
                <Input
                    label="Amount"
                    labelPlacement="outside-left"
                    placeholder="Please Input the amount"
                    value={listAmount}
                    onValueChange={setListAmount}
                    className="my-4"
                    classNames={{
                      label: styles.inputLabel,
                      base: 'flex',
                      mainWrapper: styles.input
                    }}
                />

                <div className={`my-2 text-center ${styles.widthFull}`}>
                  Floor price <span className={styles.focus}>0.3 DOT</span>, Your price $0
                </div>

                <div className={`my-4 flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.inputLabel}>Expiration</span>
                  <Select
                      items={periodItems}
                      aria-label="period"
                      placeholder="Select a period"
                      className="select"
                      selectionMode="single"
                      classNames={{
                          base: 'w-40',
                          mainWrapper: 'flex-1',
                          trigger: 'border-1 border-slate-100'
                      }}
                      radius="full"
                      size="sm"
                      // selectedKeys={period ? [period] : []}
                      onChange={(e) => setPeriod(e.target.value || period)}
                      style={{height: 40, border: '1px solid rgba(255, 255, 255, 0.80)',maxWidth: 160}}
                  >
                      {(item) => (
                          <SelectItem key={item.value} textValue={item.label}>
                              <div className="flex gap-2 items-center">
                                  <div className="flex flex-col">
                                      <span className="text-small">{item.label}</span>
                                  </div>
                              </div>
                          </SelectItem>
                      )}
                  </Select>
                </div>
                <div className={`my-4 flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.inputLabel}>Service Fee</span>
                  <span>
                    2 %
                  </span>
                </div>
                <div className={`my-4 flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.inputLabel}>Total Cost</span>
                  <span>
                    ~0.33 DOT
                  </span>
                </div>

                <button className={`h-10 p-2 rounded-3xl text-white width-full ${styles.searchButton} ${styles.widthFull}`}>List</button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Buy */}
      <Modal backdrop="blur" size="xl" isOpen={isOpenBuy} onClose={() => setIsOpenBuy(false)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className={`flex flex-col gap-1 text-center ${styles.borderBottom}`}>BUY DOTA</ModalHeader>
              <ModalBody className={styles.borderBottom}>
                <div className={styles.listInfo}>
                  <div className="flex items-center justify-center">
                    <Image src={dotaIcon} width={36} height={36} alt="dota" />
                    <div className="flex items-baseline">
                      <span className={styles.listAmount}>
                        100,000,000
                      </span>
                      <span className={styles.listUnit}>
                        DOTA
                      </span>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center flex-wrap">
                <Input
                    label="DOTA Receiving Wallet"
                    labelPlacement="outside"
                    value={selectedAccount?.address}
                    readOnly
                    className="my-6 h-12"
                    classNames={{
                      base: 'flex',
                      mainWrapper: `${styles.input} h-12`,
                      inputWrapper: 'h-12',
                      input: 'text-center h-12'
                    }}
                />

                <div className={`flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.infoText}>Network Fee</span>
                  <span className={styles.infoText}>
                    ~31 sats/vbytes
                  </span>
                </div>
                <div className={`flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.infoText}>Buyer Fee (2.00%)</span>
                  <span className={styles.infoText}>
                    0.0000338 DOT
                  </span>
                </div>
                <div className={`my-4 flex justify-between items-center ${styles.widthFull}`}>
                  <span className={styles.inputLabel}>Total Cost</span>
                  <span>
                  ~0.0017238 DOT
                  </span>
                </div>

                <button className={`h-10 p-2 rounded-3xl text-white width-full ${styles.searchButton} ${styles.widthFull}`}>Buy</button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  )
}