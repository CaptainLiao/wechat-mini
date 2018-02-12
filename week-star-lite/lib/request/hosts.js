const config = require('../config')

let current = {
  test: {
    code: '',
    pay: 'http://101.200.123.157:7000',
    ticket: 'https://t.rsscc.com'
  },
  production: {
    code: '',
    pay: 'https://payment.rsscc.com',
    ticket: 'https://jp.rsscc.com'
  }
}[config.env]

current.h5 = 'https://h5.133.cn'

module.exports = (hosts) => {
  if (hosts) {
    current = Object.assign({}, current, hosts)
  }
  return current
}
