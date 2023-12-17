// @ts-ignore
import { cache } from 'react'

export const getTokens = cache(async (page: number, pageSize: number, orderBy?: string, searchTerm?: string) => {
  const fakeData = [
    {name: "dota", progress: 50, totalSupply: "21,000,000", holder: "1,000,000", deployedBlock: "566666"},
    {name: "radi", progress: 60, totalSupply: "1,000,000", holder: "100,000", deployedBlock: "566666"},
    {name: "lolo", progress: 100, totalSupply: "1,000,000", holder: "200,000", deployedBlock: "566666"},
  ]
  return {
    tokens: fakeData,
    total: 3,
  }
})
