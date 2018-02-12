exports.stringify = (obj) => {
  if (!obj) {
    return '';
  } else {
    return Object.keys(obj).sort().map(key => {
      let val = obj[key];

      if (val === undefined) { return ''; }
      if (val === null) { return encode(key); }

      // NOTE: 如果需要传递数组，请自己和服务端商量好该如何处理
      //
      // if (Array.isArray(val)) {
      //   return val.slice().reduce((r, v) => {
      //     if (val2 === undefined) {
      //       return r;
      //     }
      //     return r.concat(encode(key) + '[]=' + encode(v));
      //   }, []).join('&');
      // }

      return encode(key) + '=' + encode(val);
    }).filter(x => {
      return x.length > 0;
	  }).join('&');
  }
};


// NOTE: 同样没处理数组
// 问题不是需不需要数组，而是以什么样的形式来传递数组
exports.parse = (str) => {
  str = str.trim().replace(/^[?#&]/, '').replace('/\+/g', ' ');

  return str.split('&').reduce((r, s) => {
    let i = s.indexOf('=');
    let key = s.slice(0, i);
    let val = i === -1 ? undefined : s.slice(i+1);

    r[key] = val === undefined ? null : decode(val);
    return r;
  }, {});
};

function encode(value) {
  return encodeURIComponent(value);
}

function decode(value) {
  return decodeURIComponent(value);
}
