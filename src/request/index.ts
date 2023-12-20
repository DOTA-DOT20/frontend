import { post, get } from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)
export const getBalanceList = (data = {}) => get('/v1/get_balance_list', data)