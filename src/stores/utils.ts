import {atom} from "recoil";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";
import {ReactNode} from "react";

interface ModalState {
    open: boolean,
    title?: string,
    content?: string | ReactNode
}

export const modalState = atom<ModalState>({
    key: 'modal',
    default: {
        open: false
    },
});
