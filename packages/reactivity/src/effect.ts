import { Target } from "./reactive"

export let activeEffect: ReactiveEffect | undefined = undefined

class ReactiveEffect {
  public parent: ReactiveEffect | undefined = undefined
  public active = true
  public deps: Array<Set<ReactiveEffect>> = []
  constructor(public fn: Function) {}

  run() {
    if (!this.active) {
      this.fn()
    }

    try {
      /** 依赖收集 */
      activeEffect = this
      this.parent = activeEffect
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn) // 创建响应式Effect
  _effect.run() // 默认执行一次
}

const targetMap = new WeakMap()
export function track(target: Target, type: string, key: string | symbol) {
  if (activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set<ReactiveEffect>()))
  }
  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    debugger
    activeEffect.deps.push(dep)
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  const effects = depsMap.get(key)

  effects &&
    effects.forEach((effect: ReactiveEffect) => {
      if (effect !== activeEffect) {
        effect.run()
      }
    })
}
