import wepy from 'wepy'

export default class testMixin extends wepy.mixin {
  data = {
    mixin: 'This is mixin data.'
  }
  methods = {
    tap () {
      this.mixin = 'mixin data was changed'
      console.log('mixin method tap')
    }
  }

  onShow() {
    console.log('mixin onShow')
    function a(m: number): number{
      return m
    }
    console.log(a(22))
  }

  onLoad() {
    console.log('mixin onLoad')
  }
}
