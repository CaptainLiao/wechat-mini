const hbgjAPI = require('./hbgj-api')
const hosts = require('../hosts')

module.exports = (options) => {
  let data = Object.assign(
    {},
    hbgjAPI.getCommonParams(),
    options.data
  )

  if (options.sidFields && options.sidFields.length > 0) {
    data.sid = hbgjAPI.generateSid(options.sidFields, data)
  }

  let header = Object.assign({
    // 其他值请自行覆盖
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }, options.header)

  return {
    url: hosts().ticket + options.url,
    method: options.method,
    header,
    data
  }
}
