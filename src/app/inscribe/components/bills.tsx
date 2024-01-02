import React, {useMemo} from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Button} from "@nextui-org/react";
import {TransferRecord} from "@/stores/record";
import {shotAddress} from "@/utils/format";
import TransferStatus from "./TransferStatus";

interface Props {
    records: TransferRecord[]
    blockNumber: string
}

export const Bills = (props: Props) => {

    const bills = useMemo(() => {
        return [...props.records]
    }, [props.blockNumber]);

    return (
        <>
        <div style={{border: '1px solid rgba(255, 255, 255, 0.20)', borderRadius: 25, width: 800, margin: '15px auto 0', padding: '10px 0  20px'}}>
            <h3 className="m-4">Local Transfer Records</h3>
            <Table
                isHeaderSticky
                removeWrapper
                style={{ width: 780, minWidth: 780, margin: '0px auto'}}
                classNames={{
                    base: "max-h-[520px] overflow-auto",
                    table: "min-h-[100px]",
                }}
                aria-label="Local Transfer Records"
            >
                <TableHeader>
                    <TableColumn style={{background: '#252024'}} key="state">Status</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="tick">Tick</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="formatTo">To</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="amt">Amt</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="formatHash">Tx Hash</TableColumn>
                </TableHeader>
                <TableBody>
                    {bills.map((item: TransferRecord) => (
                        <TableRow key={item.hash} style={{borderTop: '1px solid rgba(255, 255, 255, 0.20)', height: 60}}>
                            <TableCell><TransferStatus hash={item.hash} blockNumber={props.blockNumber} /></TableCell>
                            <TableCell>{item.tick}</TableCell>
                            <TableCell><a target="_blank" href={`https://polkadot.subscan.io/account/${item.to}`} >{shotAddress(item.to)}</a></TableCell>
                            <TableCell>{item.amt}</TableCell>
                            <TableCell><a target="_blank" href={`https://polkadot.subscan.io/extrinsic/${item.hash}`} >{shotAddress(item.hash)}</a></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </>
    )
}
