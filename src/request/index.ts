import { post, get } from './request'

export const getTickList = (data = {}) => get('/v1/get_tick_list', data)