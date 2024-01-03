import { get, useAxios} from './request'
import {ConfigureOptions} from "axios-hooks";
import {AxiosRequestConfig} from "axios";


export const getTickList = (data = {}) => get('/v1/get_tick_list', data)

export interface BalanceItem {
    tick: string
    available: string
}

type AccountBalanceResponse = { balance: BalanceItem[], total: number };
export const getBalanceList = (data = {}) => get<AccountBalanceResponse>('/v1/get_account_balance', data)


type Tick = {
    circulating_supply: number,
    total_supply: number,
    tick: string
    holder: number
    deploy_number: number
    total_blocks: number
    start_block: number
};
export const requestTicks = () => {
    return useAxios<{ticks: Tick[], total_address: number}>({
        url: '/v1/get_tick_list',
        method: "GET"
    })
}
export const requestBalance = () => {
    return useAxios<AccountBalanceResponse>({
        url: '/v1/get_account_balance',
        method: "GET"
    }, {
        manual: true,
        autoCancel: false
    })
}

export interface HolderItem {
    available: string,
    hold: string,
    tick: string,
    user_address: string
}

export const requestBalanceList = (config: AxiosRequestConfig) => {
    return useAxios<{
        balance_list: HolderItem[],
        total:number
    }>({
        url: '/v1/get_balance_list',
        method: "GET",
        ...config
    }, {
        autoCancel: false
    })
}

export const requestTransactionStatus = () => {
    return useAxios({
        url: '/v1/get_transaction_status',
        method: "GET"
    }, {
        manual: true,
        autoCancel: false
    })
}

export const getTransactionAmount = (data: any) => get(`/v1/get_transaction_amount`, data)
