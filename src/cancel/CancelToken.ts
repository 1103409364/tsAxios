import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason: Cancel): void
  // (reason: string | PromiseLike<string>): void
}
// 请求返回时间不确定，重复请求时，要防止先请求后返回的覆盖后请求先返回的数据
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  // 工厂函数
  static source(): CancelTokenSource {
    let cancel!: Canceler // 断言 cancel 有值
    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
