/**
 * delays each call by ms milliseconds
 * @param  {Number} delay delay ms
 * @return {promise}
 */
export default delay => {
  return (target, name, descriptor) => {
    const fn = descriptor.value

    descriptor.value = function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(_ => {
          resolve(func.apply(this, args))
        }, delay)
      })
    }

    return descriptor
  }
}