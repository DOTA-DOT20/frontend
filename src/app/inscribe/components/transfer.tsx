import styles from "@/app/inscribe/index.module.css";
import {Button, Input} from "@nextui-org/react";
import Loading from "@/components/Loading";
import React, {useEffect, useMemo, useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import TickSelector from "@/components/TickSelector";

export interface TransferInfo {
    tick: string
    amount: string,
    receiver: string
}

interface Props {
    selectedAccount?: InjectedAccountWithMeta
    onTransfer: (meta: TransferInfo) => void
    onConnect: () => void
    isLoading: boolean
}

export const Transfer = (props: Props) => {
    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("500000");
    const [receiver, setReceiver] = useState("");


    const handleAmountChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setAmount(number);
    }

    const handleReceiver = (value: string) => {
        setReceiver(value);
    }


    function handleDeploy() {
        props.onTransfer({
            tick,
            amount,
            receiver
        })
    }

    return (
        <>
            <div className={styles.contentBody}>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <label htmlFor="name">Ticket</label>
                        <TickSelector
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
                            onValueChange={handleAmountChange}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="name">Receive Address</label>
                        <Input
                            type="text"
                            placeholder="Please inout your address"
                            value={receiver}
                            onValueChange={handleReceiver}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.contentFooter}>
                {
                    props.selectedAccount?.address ?
                        <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                size="lg"
                                onClick={handleDeploy}
                                isLoading={props.isLoading}
                                spinner={<Loading />}
                        >
                            Transfer
                        </Button>
                        :
                        <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                size="lg"
                                onClick={props.onConnect}
                                isLoading={props.isLoading}
                                spinner={<Loading />}
                        >
                            CONNECT WALLET
                        </Button>
                }
            </div>
        </>
    )
}

