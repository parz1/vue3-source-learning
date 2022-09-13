import { isObject } from "@vue/shared"
import { ReactiveFlags, mutableHandlers } from "./baseHandler"

export interface Target {
  [ReactiveFlags.IS_REACTIVE]?: boolean
}

const reactiveMap = new WeakMap() // WeakMap key 只能是对象 置为null 自动清空

export function reactive(target: Target) {
  if (!isObject(target)) {
    return
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  let exisitingProxy = reactiveMap.get(target)
  if (exisitingProxy) {
    return exisitingProxy
  }

  // 第一次普通对象代理
  // 下一次targe是代理 如果是代理就不需要再次代理 在get方法里判断

  const proxy = new Proxy(target, mutableHandlers)

  reactiveMap.set(target, proxy)

  return proxy
}

// let target = {
//   name: 'parz1',
//   get alias() {
//     return this.name
//   }
// }

// const proxy = new Proxy(target, {
//   get(target, key, receiver) {
//     return Reflect.get(target, key, receiver)
//   },
//   set(target, key, value, receiver) {
//     return Reflect.set(target, key, value, receiver)
//   },
// })

// proxy.alias

/**
 * Reflect 修改了this指向，指向了proxy
 * console
 *
 * alias
 * name
 */
