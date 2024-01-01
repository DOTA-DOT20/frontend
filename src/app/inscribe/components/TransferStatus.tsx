import {requestTransactionStatus} from "@/request";
import {useEffect, useMemo} from "react";
import tickIcon from "@/icons/tick.svg";
import errorIcon from "@/icons/error.svg";
import pendingIcon from "@/icons/pending.svg";
import Image from "next/image";

type Props = {
    hash: string
}
const TransferStatus = (props:Props) => {
    const { hash, blockNumber } = props

    const [{data, loading}, load] = requestTransactionStatus()

    const status = useMemo(() => {
        const status = data?.status
        return {
            isSuccess: status === 1,
            isPending: status === 0 || status === 10000,
            isFail: status === 9,
        }
    }, [data]);

    useEffect(() => {
        if(hash) {
            const status = data?.status;
            const needLoad = !(status === 1 || status === 9)
            if(needLoad) {
                load({
                    params: {
                        'tx_hash': hash
                    }
                })
            }
        }
    }, [blockNumber]);



    return <div className="flex gap-1">
        { status.isSuccess && <>
          <Image
            src={tickIcon}
            width={20}
            height={20}
            alt="Success"
          />
          Success
        </>}
        { status.isPending && <>
          <Image
            src={pendingIcon}
            width={20}
            height={20}
            alt="Pending"
            className={`animate-spin`}
            style={{animationDuration: '3s'}}
          />
          Pending
        </>}
        { status.isFail && <>
          <Image
            src={errorIcon}
            width={20}
            height={20}
            alt="Failed"
          />
          Failed
        </>}
    </div>


}
export default TransferStatus
