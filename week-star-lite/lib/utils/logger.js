// 向服务器推送程序错误日志等

const LOG_LEVEL = {
  NOT_SET: 0,
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50
}

// 最低日志等级
const THRESHOLD_LEVEL = LOG_LEVEL.INFO
// 触发请求的等级
const PUSH_LEVEL = LOG_LEVEL.ERROR

// 缓存的消息队列
const MAX_EVENT_COUNT = 5
let events = []

let getContext = function() {}

function send() {
  const payload = {
    events: events,
    context: getContext()
  }
  events = []

  wx.requestAsync({
    url: 'https://gj.huoli.com/api/bot/message/push?channel_id=106',
    data: {
      text: JSON.stringify(payload)
    }
  }).catch(() => {})
}

const push = (level, ...args) => {
  if (level < THRESHOLD_LEVEL) {
    return
  }

  // 有时候微信会自己调用console.error()
  if (!args || !args[0]) {
    return
  }

  try {
    events.unshift({
      t: new Date().toString(),
      data: args.map(x => {
        if (x instanceof Error) {
          return {
            message: x.message,
            stack: x.stack
          }
        } else {
          return x
        }
      })
    })

    if (events.length > MAX_EVENT_COUNT) {
      events = events.slice(0, MAX_EVENT_COUNT)
    }

    if (level >= PUSH_LEVEL) {
      send()
    }
  } catch (error) {
    // ignore
  }
}

const logger = {
  push,

  debug: push.bind(null, LOG_LEVEL.DEBUG),
  // 为了和console.log相匹配
  log: push.bind(null, LOG_LEVEL.DEBUG),
  info: push.bind(null, LOG_LEVEL.INFO),
  warn: push.bind(null, LOG_LEVEL.WARN),
  error: push.bind(null, LOG_LEVEL.ERROR)
}

logger.hook = function(console, opts = {}) {
  ['debug', 'log', 'info', 'warn', 'error'].forEach(name => {
    let oldFn = console[name]

    console[name] = (...args) => {
      oldFn && oldFn.apply(null, args)
      logger[name].apply(null, args)
    }
  })

  if (opts.getContext) getContext = opts.getContext
}

module.exports = logger
