/**
 * 在指定时间内只执行一次回调
 * @param  {Number} wait ms
 */
export default function (wait) {
  let timmer
  return function (target, name, descriptor) {
    let func = descriptor.value
    descriptor.value = function (...args) {
      if (!timmer) {
        timmer = setTimeout(() => {
          timmer = null
          // 在时间到了之后执行
          func.apply(this, args)
        }, wait)
      }
    }
    return descriptor
  }
}
