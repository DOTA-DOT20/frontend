"use client"

import {RadioGroup, Radio, Input, Button} from "@nextui-org/react";
import  styles from "./index.module.css";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {useRecoilState} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {accountState} from "@/stores/account";
import {web3FromAddress} from "@polkadot/extension-dapp";


export default function Home() {
    const [selectedAccount] = useRecoilState<InjectedAccountWithMeta>(accountState);

    const [checkedType, setChecked] = useState('mint')

    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("1000");
    const handleChanged = (event: ChangeEvent<any>) => {
        setChecked(event.target.value)
    }


    const handleMint = () => {
        if(selectedAccount?.address) {
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
                    <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 block flex-1 color-white"
                            size="lg"
                            onClick={handleMint}
                    >
                      MINT
                    </Button>
                  </div>
                </> }
            </div>
        </div>
    )
}
