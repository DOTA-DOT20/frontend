import { get, useAxios} from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)
export const getBalanceList = (data = {}) => get('/v1/get_account_balance', data)

export const requestBalance = () => {
    return useAxios({
        url: '/v1/get_account_balance',
        method: "GET"
    }, {
        manual: true,
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
