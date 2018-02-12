function withLoading(fn, title = '加载中...') {
  return (...args) => {
    if (title) {
      wx.showLoading({ title })
    } else {
      wx.showLoading()
    }
    return fn(...args).then(
      result => {
        wx.hideLoading()
        return result
      },
      error => {
        wx.hideLoading()
        throw error
      }
    )
  }
}

module.exports = withLoading
