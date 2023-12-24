import styles from "@/app/inscribe/index.module.css";
import {Button, Input} from "@nextui-org/react";
import Loading from "@/components/Loading";
import React, {useEffect, useMemo, useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

export interface DeployInfo {
    tick: string
    amount: string,
    blockNumber: string
}

interface Props {
    selectedAccount?: InjectedAccountWithMeta
    onDeploy: (meta: DeployInfo) => void
    onConnect: () => void
    isLoading: boolean
    blockNumber?: string
}

export const Deploy = (props: Props) => {
    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("500000");
    const [blockNumber, setBlockNumber] = useState("");


    useEffect(() => {
        if(props.blockNumber) {
            setBlockNumber(props.blockNumber)
        }
    }, [props.blockNumber]);


    const handleAmountChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setAmount(number);
    }

    const handleBlockNumberChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setBlockNumber(number);
    }


    const handleMint = () => {

    }

    const totalAmount = useMemo(() => {
        if(amount) {
            return parseInt(amount) * 42000
        }
        return ''
    }, [amount]);

    function handleDeploy() {
        props.onDeploy({
            tick,
            amount,
            blockNumber
        })
    }

    return (
        <>
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
                        <label htmlFor="name">Amount Per Block</label>
                        <Input
                            type="number"
                            min={1}
                            placeholder="Amount Per Block"
                            value={amount}
                            onValueChange={handleAmountChange}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="name">Start BlockNumber</label>
                        <Input
                            type="number"
                            min={1}
                            placeholder="BlockNumber"
                            value={blockNumber}
                            onValueChange={handleBlockNumberChange}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="name">Total</label>
                        <div className={styles.formContent}>{totalAmount} {tick}</div>
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
                            Deploy
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

