import { isPlainObject } from './util'

// 处理body https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // data 如果是不是json字符串，会报错Unexpected token d in JSON at position 0
      // 例如 data 为 "hello"
      console.error(e)
    }
  }
  return data
}
