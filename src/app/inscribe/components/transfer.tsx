import { isNumber, isNaN } from "lodash";
import {Button, Input} from "@nextui-org/react";
import Loading from "@/components/Loading";
import React, {useEffect, useMemo, useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import TickSelector from "@/components/TickSelector";
import {requestBalance} from "@/request";
import {useConnectWallet} from "@/hooks/usePolkadot";
import {formatNumberWithCommas} from "@/utils/format";
import styles from "@/app/inscribe/index.module.css";

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
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");

    const { selectedAccount } = useConnectWallet()
    const [{ data }, getBalance]  = requestBalance()

    const totalBalance = useMemo(() => {
        const balance = data?.balance_list
        return balance?.[tick] || 0
    }, [data, tick])

    useEffect(() => {
        if(selectedAccount?.address) {
            getBalance({
                params: {
                    address: selectedAccount.address
                }
            })
        }
    }, [selectedAccount]);


    const handleAmountChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setAmount(number);
    }

    const handleAmountBlur = () => {
        const number = parseInt(amount)
        if(isNumber(number) && !isNaN(number)) {
            if(number > totalBalance) {
                setAmount(totalBalance)
            }
        } else {
            setAmount('')
        }
    }

    const handleMaxBalance = () => {
        setAmount(totalBalance)
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
                        <div className={styles.formItemContent}>
                            <Input
                                type="number"
                                min={1}
                                placeholder="Amount"
                                value={amount}
                                onValueChange={handleAmountChange}
                                onBlur={handleAmountBlur}
                            />
                            <a onClick={handleMaxBalance} className={styles.allBalance}>Max</a>
                            <p className={`text-right ${styles.balanceTip}`}>{
                                totalBalance >= 0 && `Available: ${formatNumberWithCommas(totalBalance)} ${tick}`
                            }</p>
                        </div>
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

