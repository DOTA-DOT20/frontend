import { post, get } from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)
export const getBalanceList = (data = {}) => get('/v1/get_balance_list', data)
export const getUsersIncData = (data: any) => get(`/data/users_inc_data/${data.tick}/${data.blockNumber}/7/1`, data)