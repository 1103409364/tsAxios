import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { buildUrl } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    // 返回的可能是字符串，尝试转为json
    return transformResponseData(res)
  })
}

// 处理配置
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理url参数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params) // 断言 url 不为空
}

// 解析response data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse) //transformResponse(res.data)
  return res
}
