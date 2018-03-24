let DATA_TYPES = {
  '*': /.+/, //任意
  'n': /^\d+$/, //整数
  'm': /^1[3-9]\d{9}$/, //电话
  'p': /^\d{6}$/, //邮政
  'e': /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //email
  'url': /^(\w+:\/\/)?\w+(\.\w+)+.*$/, //url
  'positive': /^[1-9]\d*$/, //正整数
  'positiveFloat': /^(([1-9]\d*)|((([1-9]\d*)|0)?\.[0-9]+))$/ //正浮点数
  //其他正则
  // *9-100 --> /^.{9-100}$/ //限制长度
}

//取得正则表达式
function getReg(type) {
  let r = DATA_TYPES[type]
  if (r) return r
  if (/\*\d/.test(type)) {
    let nums = type.match(/\d+/g)
    return new RegExp('^.{' + nums.join(',') + '}$')
  }
  return null
}

// 检测input样例
// <input data-datatype data-nullmsg="...." data-errmsg="...."/>
// 返回对象中err为{name: value: msg: }
// checkbox检测true样例:
// <checkbox data-name="..." data-nullmsg="...."/>
export default {
  addType(types) {
    DATA_TYPES = Object.assign(DATA_TYPES, types)
  },
  //检测表单, 输入目标selector
  check(selector = '.input') {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery().selectAll('.input').fields({
        dataset: true,
        size: true,
        properties: ['name', 'value', 'checked']
      }, res => {
        console.log(res)

        let datas = {};
        for (let i = 0; i < res.length; i++) {
          let r = res[i];
          let [set, name, value] = [r.dataset, r.name || r.dataset.name, r.value || r.checked];
          datas[name] = value

          //不可见的input不去检查
          if (r.width == 0 || r.height == 0) continue;

          if (!value && set.nullmsg) {
            //为空
            resolve({
              err: { name, value, msg: set.nullmsg },
            })
            return;
          } else if (set.datatype ) {
            let reg = getReg(set.datatype)
            if(reg && !reg.test(value)){
              let msg = set.errmsg || `${name}错误`
              //验证不通过
              resolve({
                err: { name, value, msg },
              })
              return;
            }
          }

        }
        //最后返回所有数据: { err: null, detail: {name: '...', ....} }
        resolve({ err: null, detail: datas })
      }).exec();

    })
  }
}
