import React, {useEffect, useMemo, useState} from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Button} from "@nextui-org/react";
import {requestBills} from "@/request";
import {useConnectWallet} from "@/hooks/usePolkadot";

export const Bills = () => {
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [{ data }, getBills]  = requestBills()
    const rowsPerPage = 10;
    const { selectedAccount } = useConnectWallet()

    const [pages, setPages] = useState(0);

    const items = useMemo(() => {
        console.log(data)
        let bills = data?.bills || []
        bills.forEach((bill: any) => {
            bill.formatFrom = bill.from.slice(0, 6) + '...' + bill.from.slice(-6)
            bill.formatTo = bill.to.slice(0, 6) + '...' + bill.to.slice(-6)
            bill.formatHash = bill.tx_hash.slice(0, 6) + '...' + bill.tx_hash.slice(-6)
        })
        return bills || 0
    }, [data])

    useEffect(() => {
        if(data?.total) {
            setPages(Math.ceil(data.total / rowsPerPage))
        }
    }, [data]);

    const getBillsFun = async () => {
        setIsLoading(true)
        await getBills({
            params: {
                address: selectedAccount.address,
                page,
                page_size: rowsPerPage
            }
        })
        setIsLoading(false)
    }

    const refresh = () => {
        getBillsFun()
    }

    useEffect(() => {
        if(selectedAccount?.address) {
            getBillsFun()
        }
    }, [selectedAccount, page]);
    return (
        <>
        <div style={{textAlign:'right', width: 800,margin: '60px auto 10px'}}><Button size="sm" onClick={refresh}>Refresh</Button></div>
        
        <div style={{border: '1px solid rgba(255, 255, 255, 0.20)', borderRadius: 25, width: 800, margin: '0px auto', padding: '20px 0'}}>
            <Table
                isHeaderSticky
                removeWrapper
                style={{ width: 780, minWidth: 780, margin: '0px auto'}}
                classNames={{
                    base: "max-h-[520px] overflow-scroll",
                    table: "min-h-[100px]",
                }}
            >
                <TableHeader>
                    <TableColumn style={{background: '#252024'}} key="tick">Tick</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="formatFrom">From</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="formatTo">To</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="amt">Amt</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="before">Before</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="after">After</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="state">State</TableColumn>
                    <TableColumn style={{background: '#252024'}} key="formatHash">Tx Hash</TableColumn>
                </TableHeader>
                <TableBody
                    items={items}
                    isLoading={isLoading}
                    loadingContent={<Spinner color="white" />}
                >
                    {(item:any) => (
                        <TableRow key={item?.block_hash} style={{borderTop: '1px solid rgba(255, 255, 255, 0.20)', height: 60}}>
                            <TableCell>{item.tick}</TableCell>
                            <TableCell><a target="_blank" href={`https://polkadot.subscan.io/account/${item.from}`} >{item.formatFrom}</a></TableCell>
                            <TableCell><a target="_blank" href={`https://polkadot.subscan.io/account/${item.to}`} >{item.formatTo}</a></TableCell>
                            <TableCell>{item.amt}</TableCell>
                            <TableCell>{item.before}</TableCell>
                            <TableCell>{item.after}</TableCell>
                            <TableCell>{item.state}</TableCell>
                            <TableCell><a target="_blank" href={`https://polkadot.subscan.io/extrinsic/${item.tx_hash}`} >{item.formatHash}</a></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {
                pages > 1 ? (
                    <div className="flex w-full justify-center mt-2">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                ) : null
            }
        </div>
        </>
    )
}