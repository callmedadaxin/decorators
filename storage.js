/**
 * 自动进行localStorage缓存
 * @param  {String} options.key 缓存的key
 */
export default ({ key }) => {
  return (target, name, descriptor) => {
    const func = descriptor.value

    descriptor.value = function (...args) {
      console.log(`storage ==> ${key}: ${JSON.stringify(args[1])}`)
      localStorage.setItem(key, JSON.stringify(args[1]))
      return func.apply(this, args)
    }

    return descriptor
  }
}
