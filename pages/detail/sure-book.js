//获取应用实例
import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'
import Util from '../../utils/util'
var WxParse = require('../../libs/wxParse/wxParse.js');
const app = getApp();
Page({
    data: {
        zxsInfo: {},
        dateList: [{
            1: [1, 2, 3, 4],
        }],
        course: [1, 2, 3, 4]
    },
    onLoad (options) {
        this.setData({
            options:options
        })
        api.getProductInfo(options.id).then(json => {
            let zxsInfo = json.data;
            this.setData({zxsInfo});
        });
    },
    onShow(){
        app.getUserOpenId().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                is_zxs:res.is_zxs
            });
            if (!res.uid) {
                //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
                $dialog.alert({
                    title: '经纪圈新房通',
                    content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                    buttons: [{
                        text: '知道了',
                        type: 'weui-dialog__btn_primary',
                    }],
                    onConfirm(e) {},
                });
            }else if(res.uid&&res.is_user!='1'){
                app.goPage('/pages/login/login')
            }
        });
    },
    gotoBookTime(e){
        let id = e.currentTarget.dataset.id;
        app.goPage('/pages/detail/book-time', {'id': id})
    },
    goback(){
        wx.navigateBack({
            delta: 1
        })
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
