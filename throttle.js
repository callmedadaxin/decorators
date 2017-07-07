/**
 * 固定的函数执行速率
 * 旨在控制函数的执行频率不得高于  1000 / wait
 * @param  {Number} wait [description]
 */
export default function (wait = 250) {
  var last
  var timer

  return function (target, name, descriptor) {
    let func = descriptor.value
    descriptor.value = function (...args) {
      var now = +new Date()

      if (last && now < last + wait) {
        clearTimeout(timer)

        // 保证在当前时间区间结束后，再执行一次 fn
        timer = setTimeout(() => {
          last = now
          func.apply(this, args)
        }, wait)

      // 在时间区间的最开始和到达指定间隔的时候执行一次 func
      } else {
        last = now
        func.apply(this, args)
      }
    }
    return descriptor
  }
}
