import wepy from 'wepy'
import sleep from '../../utils/sleep'

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'test'
  }
  components = {
  }

  mixins = []

  data = {
    number: 0
  }


  methods = {

  }

  onLoad() {
    this.loops()
    print('sss')
  }

  m: number = 0;
  async loops() {
    await sleep(1)
    this.number = ++this.m;
    this.$apply();
    this.loops()
  }
}
function print(a: number) {
  console.log('print the number ', a)
}