import { isNumber, isNaN } from "lodash";
import Joi from "joi";
import {Button, Input} from "@nextui-org/react";
import Loading from "@/components/Loading";
import React, {useEffect, useMemo, useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import TickSelector from "@/components/TickSelector";
import {BalanceItem, requestBalance} from "@/request";
import {useConnectWallet} from "@/hooks/usePolkadot";
import {formatNumberWithCommas} from "@/utils/format";
import styles from "@/app/inscribe/index.module.css";
import {Balance} from "@polkadot/types/interfaces";

export interface TransferInfo {
    tick: string
    amount: number,
    receiver: string
}

const polkadotAddressRegex = /^1[a-zA-Z0-9]{24,}$/;

const customMessages = {
    'string.pattern.base': '{{#label}} must match the specified DOT address format'
};

export const transferSchema = Joi.object({
    tick: Joi.string()
        .label('Tick')
        .length(4)
        .required(),
    amount: Joi.number().min(1)
        .label('Amount')
        .required(),
    receiver: Joi.string()
        .label('Receive Address')
        .pattern(polkadotAddressRegex).required().messages(customMessages)
})

interface Props {
    selectedAccount?: InjectedAccountWithMeta
    onTransfer: (meta: TransferInfo) => void
    onConnect: () => void
    isLoading: boolean
    blockNumber: string
}

export const Transfer = (props: Props) => {
    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");

    const { selectedAccount } = useConnectWallet()
    const [{ data }, getBalance]  = requestBalance()

    const totalBalance = useMemo(() => {
        const balance: BalanceItem[] = data?.balance || []
        const amount = (balance.find((item) => item.tick === tick)?.available || '0') as string;
        return parseFloat(
            (parseFloat(amount)).toFixed(0)
        )
    }, [data, tick])

    useEffect(() => {
        if(selectedAccount?.address) {
            getBalance({
                params: {
                    account: selectedAccount.address,
                    tick
                }
            })
        }
    }, [selectedAccount, props.blockNumber]);

    const handleAmountChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setAmount(number);
    }

    const handleAmountBlur = () => {
        const number = parseInt(amount)
        if(isNumber(number) && !isNaN(number)) {
            if(number > totalBalance) {
                setAmount(totalBalance.toFixed(0))
            }
        } else {
            setAmount('')
        }
    }

    const handleMaxBalance = () => {
        setAmount(totalBalance.toFixed(0))
    }

    const handleReceiver = (value: string) => {
        setReceiver(value);
    }

    function handleDeploy() {
        props.onTransfer({
            tick,
            amount: +amount,
            receiver
        })
    }

    return (
        <>
            <div className={styles.contentBody}>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <TickSelector
                            value={tick}
                            onValueChange={setTick}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <Input
                            type="number"
                            min={1}
                            label="Amount"
                            labelPlacement="outside-left"
                            placeholder="Amount"
                            value={amount}
                            onValueChange={handleAmountChange}
                            onBlur={handleAmountBlur}
                            classNames={{
                                base: 'flex',
                                mainWrapper: 'flex-1'
                            }}
                            style={{height: 50, maxWidth: 320}}
                        />
                        <a onClick={handleMaxBalance} className={styles.allBalance}>Max</a>
                        {
                            <p className={`text-right ${styles.balanceTip}`}>{
                                (totalBalance >= 0 && tick) && `Available: ${formatNumberWithCommas(totalBalance)} ${tick}`
                            }</p>
                        }
                    </div>
                    <div className={styles.formItem}>
                        <Input
                            label="Receive Address"
                            labelPlacement="outside-left"
                            type="text"
                            placeholder="Please inout your address"
                            value={receiver}
                            onValueChange={handleReceiver}
                            classNames={{
                                base: 'flex',
                                mainWrapper: 'flex-1'
                            }}
                            style={{height: 50, maxWidth: 320}}
                        />
                    </div>
                    <p className={styles.tip}>Tips: DOTA's transfer function is currently being tested. Please refrain from using the transfer function until it is officially announced and enabled on  <a className="text-primary decoration-solid" href="https://twitter.com/dot20_dota" target="_blank">Twitter</a>.</p>
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

