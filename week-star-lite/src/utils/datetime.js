var LOCALES = {
  'zh_cn': {
    weekday: function(i) { return '星期' + '日一二三四五六'[i] },
    weekday_abbr: function(i) { return '周' + '日一二三四五六'[i] }
    // 本地月日就免了，因为现在几乎看不到“一月二十三日”这种描述了
  }
}
// XXX: ...默认中文
var LOCALE = LOCALES['zh_cn']

// 自定义日期格式如下(年月日都必须提供):
// "2011-11-11"
// "2011-11-11 11:11"
// "2011-11-11 11:11:11"
var re_custom = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/

// iso8601日期格式见:
// http://www.ecma-international.org/ecma-262/5.1/#sec-15.9
var re_iso8601 = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?T(?:(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?)?Z?$/

function toDate(input) {
  if (!input) {
    return new Date()
  } else if (input instanceof Date) {
    return new Date(input)
  } else if (typeof input === 'number') {
    return new Date(input)
  } else if (typeof input === 'string'){
    // 如果是自定义的格式，则用本地时间，
    // 否则，使用原生的构造方法(本地还是UTC看具体实现)。
    var r = re_custom.exec(input)
    if (r) {
      return new Date(~~r[1], ~~r[2]-1, ~~r[3], ~~r[4], ~~r[5], ~~r[6])
    }

    r = re_iso8601.exec(input)
    if (r) {
      // month/date缺省值为1月/1日
      var month = ~~r[2] - 1
      if (month < 0) month = 0
      var date = ~~r[3]
      if (date === 0) date = 1

      return new Date(Date.UTC(~~r[1], month, date, ~~r[4], ~~r[5], ~~r[6], ~~r[7]))
    }

    return new Date(input)
  }
}

function format(fmt, idate) {
  var d = toDate(idate)
  if (!d) {
    return fmt
  }

  // 按照strftime的规则，但是多了个数字，比如 "%d"=>"02", "%1d" => "2"
  // 因为在中文里，页面上的日期一般会显示成“1月2日”，而不是“01月02日”，也不是“一月二日”
  var re = new RegExp('%([1-9]?)(.)', 'g')
  var r = fmt.replace(re, function(_, digit, val) {
    // 并没有把strftime完全复制，只是其中用的比较多的
    switch (val) {
    case 'a': // 星期(简)
      return LOCALE.weekday_abbr(d.getDay())
    case 'A': // 星期
      return LOCALE.weekday(d.getDay())
    case 'd': // 日，01-31
      return zfill(digit || 2, d.getDate())
    case 'H': // 时，00-23
      return zfill(digit || 2, d.getHours())
    case 'I': // 时，01-12
      return zfill(digit || 2, (d.getHours() % 12) || 12)
    case 'm': // 月
      return zfill(digit || 2, d.getMonth() + 1)
    case 'M': // 分
      return zfill(digit || 2, d.getMinutes())
    case 'R': // == %H:%M
      return [
        zfill(2, d.getHours()),
        zfill(2, d.getMinutes())
      ].join(':')
    case 'T': // == %H:%M:%S
      return [
        zfill(2, d.getHours()),
        zfill(2, d.getMinutes()),
        zfill(2, d.getSeconds())
      ].join(':')
    case 's':
      return d.getTime() / 1000
    case 'S': // 秒
      return zfill(digit || 2, d.getSeconds())
    case 'w': // 星期，0-6
      return d.getDay()
    case 'y': // 年，两位
      return d.getFullYear() % 100
    case 'Y': // 年，四位
      return d.getFullYear()
    case '%':
      return '%'
    default: // 未匹配到，保持原样
      return _
    }
  })

  return r
}

var ZEROS = '00000000000000000000'
function zfill(n, val) {
  var r = val.toString()
  while (r.length < n) {
    r = ZEROS.slice(0, n-r.length) + r
  }
  return r
}

var ONE_SECOND = 1000
var ONE_MINUTE = ONE_SECOND * 60
var ONE_HOUR = ONE_MINUTE * 60
var ONE_DAY = ONE_HOUR * 24

function diffDay(a, b) {
  a = toDate(a)
  b = toDate(b)
  if (!a || !b) {
    return ''
  }

  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  var diff = b.getTime() - a.getTime()
  var days = ~~(diff / ONE_DAY)
  return days
}

module.exports = {
  toDate: toDate,
  format: format,
  zfill: zfill,
  diffDay: diffDay
}
