import api from './libs/api'
import util from './libs/util'
import WxValidate from './libs/wx-validate/WxValidate'

App({
    onLaunch() {
        // this.getSiteConfig();
        // this.getEsfSiteConfig();
        // this.getSystemInfo();
        this.getUserOpenId();
    },


    getSiteConfig(forceUpdate = false) {
        return new Promise((resolve, reject) => {
            if (this.globalData.siteConfig && !forceUpdate) {
                resolve(this.globalData.siteConfig)
            } else {
                api.common.siteConfig().then(json => {
                    // json.data.siteName = json.data.m_minname
                    this.globalData.siteConfig = json.data;
                    resolve(json.data)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    },
    getEsfSiteConfig(forceUpdate = false) {
        return new Promise((resolve, reject) => {
            if (this.globalData.siteConfig && !forceUpdate) {
                resolve(this.globalData.siteConfig)
            } else {
                api.common.esfSiteConfig().then(json => {
                    // json.data.siteName = json.data.m_minname
                    this.globalData.esfSiteConfig = json.data;
                    resolve(json.data)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    },
    getSystemInfo() {
        let system = wx.getSystemInfoSync()
        this.globalData.system = system
    },
    getUserInfo() {
        let that = this
        return new Promise((resolve, reject) => {
            if (that.globalData.userInfo) {
                resolve(that.globalData.userInfo)
            } else {
                //调用登录接口
                wx.login({
                    success: function () {
                        wx.getUserInfo({
                            success: function (res) {
                                that.globalData.userInfo = res.userInfo
                                resolve(res.userInfo)
                            }
                        })
                    }
                })
            }
        })
    },
    /**
     * 获取openid 
     * @returns {Promise}
     */
    getUserOpenId: function (status) {
        var self = this;
        //不要在30天后才更换openid-尽量提前10分钟更新 
        return new Promise((resolve, reject) => {
            //  console.log(Object.keys(self.globalData.userInfo).length != 0)
            if (!self.globalData.isUser || status == 'fresh') {
                wx.login({
                    success: function (loginres) {
                        wx.getUserInfo({
                            success: function (resuserinfo) {
                                self.globalData.userInfo = resuserinfo.userInfo;
                                api.getOpenId({code: loginres.code}).then(res => {
                                    let data = res;
                                    self.globalData.customInfo = data;
                                    self.globalData.phone = data.phone;
                                    if (!data.open_id) {
                                        self.globalData.customInfo = data;
                                        self.globalData.isUser = true;
                                    } else {
                                        self.globalData.wxData = data;
                                    }
                                    resolve(data);
                                })
                            }
                        });
                    }
                })
            } else {
                resolve(self.globalData);
            }
        });
    },
    /**
     * 页面跳转 url 页面路径，isForceNavigateTo 是否强制使用NavigateTo来跳转
     * 需要注意的是 传递页面的参数时只能是字字符串
     * @param url
     * @param params
     * options: {type: 'navigate' | 'redirect', force: false} //type 跳转方式, force: url一致时是否强制跳转
     */
    goPage(url, params = {}, options = {type: 'navigate'}) {
        if (!options.force && this.isCurrentPage()) return;
        //如果传了params 就做参数的拼接
        let query = util.params2Query(params)
        if (query)
            url = url + (url.indexOf('?') > -1 ? '' : '?') + query;

        let obj = Object.assign({url: url}, options)
        if (options.type == 'redirect' || getCurrentPages().length >= 5) {
            wx.redirectTo({url})
        } else {
            wx.navigateTo({url})
        }
    },
    getPage() {
        return getCurrentPages()[getCurrentPages().length - 1]
    },
    isCurrentPage(url, params = {}) {
        let page = this.getPage();
        if (!new RegExp(page.__route__).test(url)) return false
        if (JSON.stringify(params) !== JSON.stringify(page.options)) return false
        return true
    },
    getUrl() {
        let page = this.getPage();
        return page.__route__ + '?' + util.params2Query(page.options);
    },
    /**
     * 表单校验
     * @param rules
     * @param messages
     * @constructor
     */
    WxValidate: (rules, messages) => new WxValidate(rules, messages),
    globalData: {
        siteConfig: null,
        esfSiteConfig: null,
        system: null,
        userInfo: null,
        openid: '',
        customInfo: {},
        isUser: false,
        wxData: null,
        phone: '',
    },
})