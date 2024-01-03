"use client"
import {HolderItem, requestBalanceList, requestTicks} from '@/request/index'
import React, {useMemo} from "react";
import {Table, TableBody, TableCell, Pagination, TableColumn, TableHeader, TableRow, Spinner} from "@nextui-org/react";
import {formatNumberWithCommas,} from "@/utils/format";
import styles from "./index.module.css";
import {useQuery} from "@/hooks/useQuery";

type Props = {
    tick: string
}

export default function HolderList(props: Props) {

    const { searchParams, replace } = useQuery()

    const currentPage = parseInt(searchParams.get('page') || '1')

    const [{data: tickData}] = requestTicks()

    const pageSize = 20;

    const [{data, loading}, reload] = requestBalanceList({
        params: {
            tick: props.tick,
            limit: pageSize,
            offset: currentPage
        }
    })

    const totalSupply = useMemo(() => {
        const ticks = tickData?.ticks || []
        const tick = ticks.find(item => item.tick === props.tick)
        return tick?.circulating_supply || 0
    }, [tickData]);

    const pages = useMemo(() => {
        return data?.total_address ? Math.ceil(data?.total_address / pageSize) : 1
    }, [data]);

    const list = data?.balance_list || []

    function setPage(page: number) {

    }

    return (
        <main className="min-h-full md:px-16 px-8 py-16 w-full">
            <h2 className="mb-2 text-2xl">{props.tick} <span className="text-lg">Holders</span></h2>

            <div className={styles.tableContainer}>
                <Table
                    isHeaderSticky
                    removeWrapper
                    aria-label="Local Transfer Records"
                    classNames={{
                        table: "min-h-[300px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn style={{background: '#252024'}} key="rank">Rank</TableColumn>
                        <TableColumn style={{background: '#252024'}} key="address">Address</TableColumn>
                        <TableColumn style={{background: '#252024'}} key="percentage">Percentage</TableColumn>
                        <TableColumn style={{background: '#252024'}} key="value">Value</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={loading}
                        loadingContent={<Spinner color="white" />}
                    >
                        {list.map((item: HolderItem, index) => {
                            const progress = parseFloat(item.available) / totalSupply;
                            return (
                                <TableRow key={item.user_address} style={{borderTop: '1px solid rgba(255, 255, 255, 0.20)', height: 60}}>
                                    <TableCell>{pageSize*(currentPage - 1) + index + 1}</TableCell>
                                    <TableCell><a target="_blank" href={`https://polkadot.subscan.io/account/${item.user_address}`} >{item.user_address}</a></TableCell>
                                    <TableCell>

                                        <div className="flex items-center gap-2">
                                            <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{width: 160}}>
                                                <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{width: progress + '%'}}></div>
                                            </div>
                                            <div>
                                                {
                                                    totalSupply ?  `${(progress * 100).toFixed(2)}%` : ''
                                                }
                                            </div>
                                        </div>

                                    </TableCell>
                                    <TableCell><span>{formatNumberWithCommas(parseFloat(item.available))}</span></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {
                pages > 1 ? (
                    <div className="flex w-full justify-center mt-8">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={currentPage}
                            total={pages}
                            onChange={(page) => replace({page: `${page}`})}
                        />
                    </div>
                ) : null
            }

        </main>
    )
}
