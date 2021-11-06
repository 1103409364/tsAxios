import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { buildUrl } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import xhr from './xhr'
import { processHeaders } from '../helpers/headers'

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
  config.headers = transformHeaders(config) // 先处理headers再处理data
  config.data = transformRequestData(config)
}

// 处理url参数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params) // 断言 url 不为空
}
// 处理body
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
// 解析header
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
// 解析response data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
