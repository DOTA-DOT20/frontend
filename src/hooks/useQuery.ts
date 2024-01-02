import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { pickBy, isNull, isUndefined } from 'lodash'

export const useQuery = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const all = () => {
    const keys = Array.from(searchParams.keys())
    return keys.reduce((prev, key) => {
      return {
        ...prev,
        [key]: searchParams.getAll(key),
      }
    }, {})
  }

  const replace = (query: { [key: string]: string })  => {
    const params = new URLSearchParams(searchParams)
    Object.keys(query).forEach(key => {
      params.set(key, query[key])
    })
    const searchString =params.toString()
    router.replace(
        `${pathname}?${searchString}`
    )
  }

  return {
    searchParams,
    all,
    replace,
    get(key: string) {
      return searchParams.get(key)
    },
  }
}
