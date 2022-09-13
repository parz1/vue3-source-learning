import { activeEffect, track, trigger } from "./effect"

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
  // 属性访问器 get set es5语法
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    track(target, "get", key)
    // 监控用户取值
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      //更新
      trigger(target, "set", key, value, oldValue)
    }
    return result
    // 监控用户设置
    // return Reflect.set(target, key, value, receiver)
  },
}
