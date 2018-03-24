export default {
  //过滤特殊字符
  stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？] ")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
      rs = rs + s.substr(i, 1).replace(pattern, '&lt;');
    }
    return rs;
  },
  //去除htmltag
  removeHTMLTag(str) {
    if (!str) return '';
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/ /ig, ''); //去掉
    return str;
  },
  //变量url化
  params2Query(params) {
    params = params || {}
    return Object.keys(this.filterEmpty(params))
      .map(key => {
        let v = params[key]
        return key + '=' + (typeof v !== 'object' ? v : JSON.stringify(v))
      })
      .join('&')
  },
  /**
   * 过滤空字符串, null, undefined
   * @param  {Object} data [description]
   * @return {[type]}      [description]
   */
  filterEmpty(data) {
    data = data || {}
    let obj = {};
    Object.keys(data).forEach(key => {
      let item = data[key]
      if (item !== '' && item !== undefined && item !== null)
        obj[key] = item
    })
    return obj;
  },
  //rpx 转 px
  rpx2px(rpx) {
    let app = getApp()
    let screenWidth
    if (app && app.globalData.system) {
      screenWidth = app.globalData.system.screenWidth
    } else {
      screenWidth = wx.getSystemInfoSync().screenWidth
    }
    return Math.round(screenWidth / 750 * rpx);
  },
  getScreenWidth() {
    return this.rpx2px(750)
  },
  getScreenHeight() {
    let app = getApp()
    if (app && app.globalData.system)
      return app.globalData.system.screenHeight
    return wx.getSystemInfoSync().screenHeight
  },

  /**
   * 函数节流(throttle)：函数在一段时间内多次触发只会执行第一次，在这段时间结束前，不管触发多少次也不会执行函数。
   * @param fn
   * @param gapTime
   * @returns {Function}
   */
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }

    let _lastTime = null

    // 返回新的函数
    return function () {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments) //将this和参数传给原函数
        _lastTime = _nowTime
      }
    }
  },
  debounce(fn, delta, context) {
    var timeoutID = null;

    return function () {
      clearTimeout(timeoutID);
      var args = arguments;
      timeoutID = setTimeout(function () {
          console.log(1)
        fn.apply(context, args);
      }, delta);
    };
  }
}