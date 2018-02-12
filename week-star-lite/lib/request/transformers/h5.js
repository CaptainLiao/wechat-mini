const hosts = require('../hosts')

module.exports = (options) => {
  let header = Object.assign({}, options.header)

  return {
    url: hosts().h5 + options.url,
    method: options.method,
    header: {},
    data: options.data
  }
}
