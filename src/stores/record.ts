import {atom} from "recoil";
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()


export type TransferRecord = {
    tick: string,
    from: string,
    to: string,
    amt: number,
    hash: string,
}
export const transferRecordState = atom<TransferRecord[]>({
    key: 'transferRecord',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
