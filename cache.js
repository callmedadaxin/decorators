const hash = (args) => {
  return args.length ? JSON.stringify(args) : 'cache'
}

const proccessPromise = (data, async) => {
  if (async) {
    return Promise.resolve(data)
  }

  return data
}

/**
 * 用于函数结果缓存
 * 假设调用过该函数，且传递的参数相同，则直接返回原结果
 * @param  {Boolean} options.async 是否为异步，（Promise方式）
 * @return {Promise || other}   若为异步，则为Promise，否则为原函数结果
 */
export default ({async = false}) => {
  let cache = new Map()

  return (target, name, descriptor) => {
    const func = descriptor.value

    descriptor.value = function (...args) {
      let forceUpdate = false
      // 强制刷新缓存
      if (args.indexOf('CACHE_FORCE_UPDATE') >= 0) {
        args.splice(args.indexOf('CACHE_FORCE_UPDATE'), 1)
        forceUpdate = true
      }

      let key = hash(args)

      if (cache.has(key) && !forceUpdate) {
        console.log(`get from cache ${key}`)
        return proccessPromise(cache.get(key), async)
      }

      let result = func.apply(this, args)
      if (async) {
        return result.then(res => {
          console.log(`set cache ${key}`, res)
          cache.set(key, res)
          return res
        })
      }

      return result
    }

    return descriptor
  }
}
