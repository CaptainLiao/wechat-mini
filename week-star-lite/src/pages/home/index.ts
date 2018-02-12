import wepy from 'wepy'
import sleep from '../../utils/sleep'
import {phone} from '../../utils/validate'

// components
import user from '../../components/user/index'

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: 'test'
  }
  components = {
    'c-user': user
  }

  mixins = []

  data = {
    number: 0
  }

  methods = {

  }

  onLoad() {
    this.loops()
    print(phone('13266596743'))
  }

  m: number = 0;
  async loops() {
    await sleep(1)
    this.number = ++this.m;
    this.$apply();
    this.loops()
  }
}

// helper
function print(a: any) {
  console.log('print the number ', a)
}