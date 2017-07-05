/**
 * 防止同样的请求并行发送
 */
const hash = (args) => {
  return args.length ? JSON.stringify(args) : 'debounce'
}
let queue = {}
export default (target, name, descriptor) => {
  const func = descriptor.value

  descriptor.value = function (...args) {
    const key = hash(args)
    if (!queue[key]) {
      queue[key] = []
      return new Promise((resolve, reject) => {
        queue[key].push({
          resolve,
          reject
        })
        func.apply(this, args).then(res => {
          queue[key].forEach(deferred => {
            deferred.resolve(res)
            delete queue[key]
          })
        }).catch(error => {
          queue[key].forEach(deferred => {
            deferred.reject(error)
            delete queue[key]
          })
        })
      })
    } else {
      // push it into queue[key]
      return new Promise((resolve, reject) => {
        queue[key].push({
          resolve,
          reject
        })
      })
    }
  }
  return descriptor
}
