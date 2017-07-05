/**
 * 节流函数，timeStep内不会被触发两次或以上
 * @param  {Number} timeStep [description]
 */
export default timeStep => {
  return (target, name, descriptor) => {
    const fn = descriptor.value
    let calling = false

    descriptor.value = function (...args) {
      if (calling) {
        return
      }

      fn.apply(this, args)
      calling = true
      setTimeout(_ => calling = false, timeStep)
    }

    return descriptor
  }
}