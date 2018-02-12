import sleep from './sleep'
import wepy from 'wepy'
 
async function withLoading(fn, title) {
  try {
    if (title) {
      wepy.showLoading({
        title,
        mask: true
      })
    } else {
      wepy.showLoading({
        title: '加载中',
        mask: true
      })
    }
    let res = await fn()
    await wepy.hideLoading()
    return res
  } catch (e) {
    await wepy.hideLoading()
    throw (e)
  }

}

export default withLoading
