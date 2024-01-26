import { useQuery } from '@tanstack/vue-query'
import http from '@/service/http'
import type { MetricsMetaList } from '@/components/Metrics/types'

export function getMetricsMeta() {
  return useQuery({
    // 5 minute cache
    queryKey: ['metrics-meta'],
    queryFn: async () => {
      return (await http.get<MetricsMetaList>('/dashboard/statistics/meta')).data
    },
    // select: (data) => {
    //   return data.reduce((acc, item) => {
    //     Object.keys(item).forEach((key) => {
    //       acc[key] = item[key]
    //     })
    //     return acc
    //   }, {})
    // },
    cacheTime: 1000 * 60 * 5
  })
}
