import config from '../config'
import api from './api'
import util from './util'
const app = getApp();

export default {
  //下单发送模板
  sendOrderTemplate(formId, plot, from, name, phone) {
    return new Promise((resolve, reject) => {

      Promise.all([app.getSiteConfig(), app.getUserOpenid()]).then(results => {
        console.log(results)
        let siteConfig = results[0]
        let openid = results[1]
        if (!openid)
          reject({ msg: '获取openid失败' })

        let template_data = {
          touser: openid,
          template_id: config.template_id,
          page: app.getUrl(),
          form_id: formId,
          data: {
            keyword1: {
              value: plot,
            },
            keyword2: {
              value: from,
            },
            keyword3: {
              value: name,
            },
            keyword4: {
              value: phone,
            },
            keyword5: {
              value: `${siteConfig.siteName}房产顾问将会与您联系，请保持手机畅通。`,
            },
          }
        }
        api.weixin.template(JSON.stringify(template_data)).then(json => {
          resolve(json)
        })
      }).catch(errs => {
        reject({ msg: '模板发送失败' })
      })

    })

  },
}