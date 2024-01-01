"use client"

import {RadioGroup, Radio, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import  styles from "./index.module.css";
import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import { ISubmittableResult } from "@polkadot/types/types";
import { useConnectWallet } from "@/hooks/usePolkadot";
import { Mint, MintInfo } from "./components/mint";
import {Deploy, DeployInfo} from "@/app/inscribe/components/deploy";
import {Transfer, TransferInfo, transferSchema} from "@/app/inscribe/components/transfer";
import { Bills } from "./components/bills";
import {useRecords} from "@/app/inscribe/hooks/useRecords";

export default function Home() {
    const end = 18723993

    const [checkedType, setChecked] = useState('mint')
    const [blockNumber, setBlockNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = React.useState(1);

    const { records, addRecord } = useRecords()

    const [modalInfo, setModalInfo] = useState<{
        open: boolean,
        title: string,
        content: string | React.ReactNode
    }>({
        open: false,
        title: '',
        content: ''
    })

    const { connect, getApi, getInjectedAccount, selectedAccount } = useConnectWallet()

    async function subscribeNewHeads() {
        const api = await getApi()
        console.log('subscribeNewHeads');
        return await api.rpc.chain.subscribeNewHeads(async (header:any) => {
            console.log(`Chain is at block: #${header.number}`);
            const blockNumber = header.number
            console.log(blockNumber.toString());
            setBlockNumber(blockNumber.toString())
        })
    }

    useEffect(() => {
        let unsubscribe: any;
        console.log('useEffect');
        subscribeNewHeads().then((res) => {
            unsubscribe = res
        })
        return () =>  {
            if(unsubscribe) {
                unsubscribe?.()
                console.log('unsubscribe');
            }
        }
    }, []);

    const handleTransition = (result: any) => {
        const hash = result.txHash
        const url = `https://polkadot.subscan.io/extrinsic/${hash}`
        setModalInfo({
            open: true,
            title: 'Transition Success',
            content: <>
                <p>Transaction successful, please wait for the indexer to confirm.</p>
                {hash && <a href={url} target="_blank">Subscan</a>}
            </>
        })
    }

    const handleTransitionFail = (error: Error) => {
        console.log(error);
        setModalInfo({
            open: true,
            title: 'Transition Fail',
            content: <>
                <p>{error.toString()}</p>
            </>
        })
    }
    const handleChanged = (event: ChangeEvent<any>) => {
        setChecked(event.target.value)
    }

    const transfer = async (info: any, type: string, receiver?: string) => {
        return new Promise(async (resolve, reject) => {
            const api = await getApi()
            const injector = await getInjectedAccount()
            if (injector) {
                const batchAll = [
                    api.tx.balances.transferKeepAlive(receiver || selectedAccount.address, 0),
                    api.tx.system.remarkWithEvent(JSON.stringify(info))
                ]
                console.log(type)
                api.tx.utility.batchAll(batchAll).signAndSend(selectedAccount.address, { signer: injector.signer }, (result: ISubmittableResult & {blockNumber: any}) => {
                    if (result.status.isFinalized) {
                        const blockNumber = result.blockNumber.toNumber()
                        console.log('success! blockNumber:', blockNumber)
                        resolve(result)
                    }
                }).catch((error: any) => {
                    reject(error)
                });
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleDeploy = async (meta: DeployInfo) => {
        const { tick, amount } = meta

        if( !tick || !amount  || !meta.blockNumber ) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                    <p>Before deploying, please check whether the fields `Amount Per Block`, `BlockNumber`, and `Ticket` are filled in correctly.</p>
                </>
            })
            return false
        }

        if( +meta.blockNumber < +blockNumber ) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                    <p>The `BlockNumber` field must be greater than the current block; otherwise, the deployment is invalid.</p>
                </>
            })
            return false
        }

        const info = {
            p: "dot-20",
            op: "deploy",
            tick,
            amt: +amount,
            start: +meta.blockNumber,
        }

        if(selectedAccount?.address) {
            setIsLoading(true)
            transfer(info, 'deploy')
                .then(handleTransition, handleTransitionFail)
        } else {
            await connect()
        }
    }

    const handleMint = async ({ tick }: MintInfo) => {
        if (+blockNumber > end) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                    <p>Sorry, the minting function has been closed.</p>
                </>
            })
            return false
        }
        if(!tick) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                    <p>Before minting DOT-20 inscription, please check whether the Ticket field is filled in correctly.</p>
                </>
            })
            return false
        }
        const info = {
            p: "dot-20",
            op: "mint",
            tick
        }
        if(selectedAccount?.address) {
            setIsLoading(true)
            transfer(info, 'mint')
                .then(handleTransition, handleTransitionFail)
        } else {
            await connect()
        }
    }

    const handleTransfer = async (meta: TransferInfo) => {
        const { tick, amount, receiver } = meta
        const result = transferSchema.validate(meta);
        if(result.error) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                <p>{result.error.message}</p>
            </>
            })
        } else {
            const info = {
                p: "dot-20",
                op: "transfer",
                tick,
                amt: +amount
            }
            console.log(info);
            setIsLoading(true)
            transfer(info, 'transfer', receiver)
                .then((result) => {
                    console.log(result);
                    addRecord({
                        tick,
                        from: selectedAccount.address,
                        to: receiver,
                        amt: +amount,
                        hash: result.txHash.toString()
                    })
                    return handleTransition(result)
                }, handleTransitionFail)
        }

    }

    const handleConnect = async () => {
        const { isWeb3Injected } = await import(
          "@polkadot/extension-dapp"
        );
        if(isWeb3Injected) {
            try {
                setIsLoading(true)
                await connect()
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.log(error)
            }
        } else {
            console.log('eee')
            await connect()
        }

    }

    const handleModalClose = () => {
        setModalInfo((info) => {
            return {
                ...info,
                open: false
            }
        })
    }

    return (
        <div className="p-12">
            <h2 className={styles.title}>Dota Inscribe</h2>
            <p className={styles.subTitle}>Start your new inscribe on dot-20</p>
            <div className={styles.content}>
                <div className={styles.contentHead}>
                    <RadioGroup
                        // size="lg"
                        orientation="horizontal"
                        value={checkedType}
                        onChange={handleChanged}
                        className={styles.group}
                    >
                        <Radio value="mint" classNames={{label: styles.option}}>Mint</Radio>
                        <Radio value="deploy" isDisabled classNames={{label: styles.option}}>Deploy</Radio>
                        <Radio value="transfer" classNames={{label: styles.option}}>Transfer</Radio>
                    </RadioGroup>
                </div>
                {checkedType === 'mint' && <Mint
                  selectedAccount={selectedAccount}
                  isLoading={isLoading}
                  onMint={handleMint}
                  onConnect={handleConnect}
                  isEnd
                /> }
                {checkedType === 'deploy' && <Deploy
                  selectedAccount={selectedAccount}
                  isLoading={isLoading}
                  onDeploy={handleDeploy}
                  onConnect={handleConnect}
                  blockNumber={blockNumber}
                /> }
                {checkedType === 'transfer' && <Transfer
                  selectedAccount={selectedAccount}
                  isLoading={isLoading}
                  onTransfer={handleTransfer}
                  onConnect={handleConnect}
                /> }
            </div>
            {
                checkedType === 'transfer' && <Bills records={records}  blockNumber={blockNumber} />
            }
            <Modal backdrop="blur" isOpen={modalInfo.open} onClose={handleModalClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 color-green">{modalInfo.title}</ModalHeader>
                            <ModalBody>
                                {modalInfo.content}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
