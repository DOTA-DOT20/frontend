"use client"

import {RadioGroup, Radio, Input } from "@nextui-org/react";
import  styles from "./index.module.css";
import {ChangeEvent, useState} from "react";


export default function Home() {

    const [checkedType, setChecked] = useState('mint')

    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("1000");
    const handleChanged = (event: ChangeEvent<any>) => {
        setChecked(event.target.value)
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
                        <Radio value="transfer">Transfer</Radio>
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
                    123
                  </div>
                </> }
            </div>
        </div>
    )
}
