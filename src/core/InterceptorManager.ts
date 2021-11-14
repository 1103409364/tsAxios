import { ResolvedFn, RejectedFn } from '..'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null> // 是拦截器或者 null
  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })

    return this.interceptors.length - 1 // 把长度作为拦截器的id
  }
  // 遍历拦截器 给拦截器内部使用的，不在接口声明中
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null //防止 id 错乱，不能用 splice
    }
  }
}
