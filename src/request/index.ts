import { get, useAxios} from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)
export const getBalanceList = (data = {}) => get('/v1/get_balance_list', data)

export const requestBalance = () => {
    return useAxios({
        url: '/v1/get_balance_list',
        method: "GET"
    }, {
        manual: true,
        autoCancel: false
    })
}

export const getUsersIncData = (data: any) => get(`/data/users_inc_data/${data.tick}/${data.blockNumber}/7/1`, data)
export const getTransactionAmount = (data: any) => get(`/v1/get_transaction_amount`, data)
