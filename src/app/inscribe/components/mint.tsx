import styles from "@/app/inscribe/index.module.css";
import {Button, Input} from "@nextui-org/react";
import Loading from "@/components/Loading";
import React, {useState} from "react";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

export interface MintInfo {
    tick: string
}

interface Props {
    selectedAccount?: InjectedAccountWithMeta
    onMint: (meta: MintInfo) => void
    onConnect: () => void
    isLoading: boolean
    isEnd: boolean
}

export const Mint = (props: Props) => {

    const [tick, setTick] = useState("DOTA");

    const handleMint = () => {
        props.onMint?.({tick})
    }

    return (
        <>
            <div className={styles.contentBody}>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <Input
                            label="Ticket"
                            labelPlacement="outside-left"
                            placeholder="4 characters like 'DOTA'..."
                            value={tick}
                            onValueChange={setTick}
                        />
                    </div>
                </div>
                <p className={styles.tip}>Tips: If there are no minting accounts in the current block, the production of that block is destroyed.</p>
            </div>
            <div className={styles.contentFooter}>
                {
                    props.selectedAccount?.address ?
                        <Button className={`btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white ${props.isEnd ? 'opacity-50 cursor-not-allowed' : ''}`}
                                size="lg"
                                onClick={handleMint}
                                isLoading={props.isLoading}
                                spinner={<Loading />}
                        >
                            Mint
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

