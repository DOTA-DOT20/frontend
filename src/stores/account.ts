import {atom} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

export const accountState = atom<InjectedAccountWithMeta>({
    key: 'address',
    default: undefined,
});
