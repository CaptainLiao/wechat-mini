const ERR_CODE = {
  USER_CANCELLED: -101,
  PROMISE_CANCELLED: -102,
  RESPONSE_ERROR: -103,
  ARGUMENT_ERROR: -104
}

class UserCancelledError extends Error {
  constructor() {
    super('用户取消操作')
    this.code = ERR_CODE.USER_CANCELLED
  }
}

class PromiseCancelledError extends Error {
  constructor() {
    super('Promise Cancelled')
    this.code = ERR_CODE.PROMISE_CANCELLED
  }
}

class ResponseError extends Error {
  constructor(response, msg) {
    super(msg || '请求响应错误')
    this.code = ERR_CODE.RESPONSE_ERROR
    this.response = response
  }
}

class ArgumentError extends Error {
  constructor(detail) {
    super('参数错误')
    this.code = ERR_CODE.ARGUMENT_ERROR
    this.detail = detail
  }
}

module.exports = {
  ERR_CODE,

  UserCancelledError,
  PromiseCancelledError,
  ResponseError,
  ArgumentError
}
