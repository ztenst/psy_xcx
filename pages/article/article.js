//获取应用实例
import api from '../../libs/api'
import Util from '../../utils/util'
var WxParse = require('../../libs/wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
        articleInfo:{}
    },
    onLoad: function (options) {
        api.cusInfo(options.id).then(json => {
            let articleInfo = json.data;
            WxParse.wxParse('content', 'html', articleInfo.content, this, 0);
            this.setData({ articleInfo});
        });
    },

    /**
     * 转发分享
     * @param res
     * @returns {{title: string}}
     */
    onShareAppMessage(res) {
        let self = this;
        return {
            title: self.data.articleInfo.title,
        }
    }
});
