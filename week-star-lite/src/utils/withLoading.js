import {sleep} from './sleep'
async function withLoading(fn, title) {
  try {
    if (title) {
      wx.showLoading({
        title,
        mask: true
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    let res = await fn()
    await wx.hideLoading()
    return res
  } catch (e) {
    await wx.hideLoading()
    throw (e)
  }

}

export default withLoading
