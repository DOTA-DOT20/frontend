import {useRecoilState} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {transferRecordState, TransferRecord} from "@/stores/record";
import {useMemo} from "react";

export const useRecords = () => {
    const [records, setRecords] = useRecoilState<TransferRecord[]>(transferRecordState);

    const addRecord = (record: TransferRecord) => {
        setRecords([...records, record]);
    }

    return useMemo(() => {
        return {
            records,
            addRecord
        }
    }, [records]);
}
