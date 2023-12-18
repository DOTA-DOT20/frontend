"use client"

import {RadioGroup, Radio, Input, Button} from "@nextui-org/react";
import  styles from "./index.module.css";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {useRecoilState} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {accountState} from "@/stores/account";
import {isWeb3Injected, web3FromAddress} from "@polkadot/extension-dapp";
import {useConnectWallet} from "@/hooks/usePolkadot";


export default function Home() {
    const [checkedType, setChecked] = useState('mint')

    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("500000");

    const { connect, getApi, getInjectedAccount, selectedAccount } = useConnectWallet()

    const handleChanged = (event: ChangeEvent<any>) => {
        setTick('')
        setAmount('')
        setChecked(event.target.value)
    }

    const transfer = async (info: any) => {
        const api = await getApi()
        const injector = await getInjectedAccount()
        if (injector) {
            api.tx.utility.batchAll([
            api.tx.balances.transferKeepAlive(selectedAccount.address, 1 * 1e12),
            api.tx.system.remark(JSON.stringify(info)),
            ]).signAndSend(selectedAccount.address, { signer: injector.signer }, (result: any) => {
            if (result.status.isInBlock) {
            } else if (result.status.isFinalized) {
                let blockNumber = result.blockNumber.toNumber()
                console.log('success! blockNumber:', blockNumber)
            }
            });
        }
    }

    const handleDeploy = async () => {
        let info = {
            p: "dot-20",
            op: "deploy",
            tick,
            amount
        }
        if(selectedAccount?.address) {
            transfer(info)
        } else {
            await connect()
        }
    }


    const handleMint = async () => {
        let info = {
            p: "dot-20",
            op: "mint",
            tick
        }
        if(selectedAccount?.address) {
            transfer(info)
        } else {
            await connect()
        }
    }

    const handleConnet = async () => {
        if(isWeb3Injected) {
            await connect()
        } else {
            console.log('eee')
        }

    }

    return (
        <div className="p-12">
            <h2 className={styles.title}>Dota Inscribe</h2>
            <p className={styles.subTitle}>Start your new inscribe on dot-20</p>
            <div className={styles.content}>
                <div className={styles.contentHead}>
                    <RadioGroup
                        size="lg"
                        orientation="horizontal"
                        value={checkedType}
                        onChange={handleChanged}
                        className={styles.group}
                    >
                        <Radio value="mint">Mint</Radio>
                        <Radio value="deploy">Deploy</Radio>
                        <Radio value="transfer" isDisabled={true}>Transfer</Radio>
                    </RadioGroup>
                </div>
                {checkedType === 'mint' && <>
                  <div className={styles.contentBody}>
                    <div className={styles.form}>
                      <div className={styles.formItem}>
                        <label htmlFor="name">Ticket</label>
                        <Input
                          placeholder="4 characters like 'DOTA'..."
                          value={tick}
                          onValueChange={setTick}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.contentFooter}>
                      {
                            selectedAccount?.address ?
                                <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                                        size="lg"
                                        onClick={handleMint}
                                >
                                    MINT
                                </Button>
                                :
                                <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                                        size="lg"
                                        onClick={handleConnet}
                                >
                                    CONNECT WALLET
                                </Button>
                        }
                  </div>
                </> }
                {checkedType === 'deploy' && <>
                  <div className={styles.contentBody}>
                    <div className={styles.form}>
                      <div className={styles.formItem}>
                        <label htmlFor="name">Ticket</label>
                        <Input
                          placeholder="4 characters like 'DOTA'..."
                          value={tick}
                          onValueChange={setTick}
                        />
                      </div>
                      <div className={styles.formItem}>
                        <label htmlFor="name">Amount</label>
                        <Input
                            type="number"
                            min={1}
                            placeholder="Amount"
                            value={amount}
                            onValueChange={setAmount}
                        />
                        </div>
                    </div>
                  </div>
                  <div className={styles.contentFooter}>
                      {
                        selectedAccount?.address ?
                            <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                                size="lg"
                                onClick={handleDeploy}
                            >
                                DEPLOY
                            </Button>
                            :
                            <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                                size="lg"
                                onClick={handleConnet}
                            >
                                CONNECT WALLET
                            </Button>
                        }
                  </div>
                </> }
            </div>
        </div>
    )
}
