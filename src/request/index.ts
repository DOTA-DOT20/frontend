import { get, useAxios} from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)
export const getBalanceList = (data = {}) => get('/v1/get_balance_list', data)

export const requestBalance = () => {
    return useAxios({
        url: '/v1/get_balance',
        method: "GET"
    }, {
        manual: true,
        autoCancel: false
    })
}

export const requestBills = () => {
    return useAxios({
        url: '/v1/user_trading',
        method: "GET"
    }, {
        manual: true,
        autoCancel: false
    })
}

export const getTransactionAmount = (data: any) => get(`/v1/get_transaction_amount`, data)
