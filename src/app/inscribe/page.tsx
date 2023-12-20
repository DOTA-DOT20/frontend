"use client"

import {RadioGroup, Radio, Input, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import  styles from "./index.module.css";
import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import Loading from "@/components/Loading";
import {ISubmittableResult} from "@polkadot/types/types";
import {useConnectWallet} from "@/hooks/usePolkadot";

export default function Home() {
    const [checkedType, setChecked] = useState('mint')

    const [tick, setTick] = useState("DOTA");
    const [amount, setAmount] = useState("500000");
    const [blockNumber, setBlockNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    async function loadBlockNumber() {
        const api = await getApi()
        const header = await api.rpc.chain.getHeader()
        const blockNumber = header.number.toNumber()
        console.log(blockNumber);
        if(blockNumber) {
            setBlockNumber(blockNumber+20)
        }
    }

    useEffect(() => {
        loadBlockNumber()
    }, []);


    const handleChanged = (event: ChangeEvent<any>) => {
        setTick('')
        setAmount('')
        setChecked(event.target.value)
    }

    const transfer = async (info: any, type: any) => {
        return new Promise(async (resolve, reject) => {
            const api = await getApi()
            const injector = await getInjectedAccount()
            if (injector) {
                api.tx.utility.batchAll([
                    api.tx.balances.transferKeepAlive(selectedAccount.address, 0.01 * 1e12),
                    api.tx.system.remark(JSON.stringify(info)),
                ]).signAndSend(selectedAccount.address, { signer: injector.signer }, (result: ISubmittableResult & {blockNumber: any}) => {
                    console.log(result);
                    if (result.status.isInBlock) {
                    } else if (result.status.isFinalized) {
                        let blockNumber = result.blockNumber.toNumber()
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

    const handleDeploy = async () => {
        if(!tick || !amount  || !blockNumber) {
            setModalInfo({
                open: true,
                title: 'Tips',
                content: <>
                    <p>Before deploying, please check whether the fields `Amount Per Block`, `BlockNumber`, and `Ticket` are filled in correctly.</p>
                </>
            })
            return false
        }


        let info = {
            p: "dot-20",
            op: "deploy",
            tick,
            amt: +amount,
            start: +blockNumber,
        }
        if(selectedAccount?.address) {
            setIsLoading(true)
            transfer(info, 'deploy').then((result:any) => {
                const hash = result.txHash
                const url = `https://polkadot.subscan.io/extrinsic/${hash}`
                setModalInfo({
                    open: true,
                    title: 'Deploy Success',
                    content:<>
                        <p>Deploy transition success, please check token list later</p>
                        {hash && <a href={url} target="_blank">subscan</a>}
                    </>
                })
            }, (error) => {
                setModalInfo({
                    open: true,
                    title: 'Deploy Fail',
                    content: <>
                        <p>{error.toString()}</p>
                    </>
                })
            })
        } else {
            await connect()
        }
    }

    const handleAmountChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setAmount(number);
    }

    const handleBlockNumberChange = (value: string) => {
        const number = value.replace(/[^\d]/g, '');
        setBlockNumber(number);
    }


    const handleMint = async () => {
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

        let info = {
            p: "dot-20",
            op: "mint",
            tick
        }
        if(selectedAccount?.address) {
            setIsLoading(true)
            transfer(info, 'mint').then((result: any) => {
                const hash = result.txHash
                const url = `https://polkadot.subscan.io/extrinsic/${hash}`
                setModalInfo({
                    open: true,
                    title: 'Mint Success',
                    content: <>
                        <p>Mint tx success, please check your balance later</p>
                        {hash && <a href={url} target="_blank">subscan</a>}
                    </>
                })
            }, (error) => {
                console.log(error);
                setModalInfo({
                    open: true,
                    title: 'Mint Fail',
                    content: <>
                        <p>{error.toString()}</p>
                    </>
                })
            })
        } else {
            await connect()
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

    const totalAmount = useMemo(() => {
        if(amount) {
            return parseInt(amount) * 43000
        }
        return ''
    }, [amount]);

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
                                <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                        size="lg"
                                        onClick={handleMint}
                                        isLoading={isLoading}
                                        spinner={<Loading />}
                                >
                                    MINT
                                </Button>
                                :
                                <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                        size="lg"
                                        onClick={handleConnect}
                                        isLoading={isLoading}
                                        spinner={<Loading />}
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
                        selectedAccount?.address ?
                            <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                size="lg"
                                onClick={handleDeploy}
                                isLoading={isLoading}
                                spinner={<Loading />}
                            >
                                DEPLOY
                            </Button>
                            :
                            <Button className="btn btn-large bg-pink-500 hover:bg-sky-700 flex-1 color-white"
                                size="lg"
                                onClick={handleConnect}
                                isLoading={isLoading}
                                spinner={<Loading />}
                            >
                                CONNECT WALLET
                            </Button>
                        }
                  </div>
                </> }
            </div>

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
