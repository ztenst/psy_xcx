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
        course: [1, 2, 3, 4],
        toast:null
    },
    onLoad (options) {
        this.setData({
            options:options,
            toast: this.selectComponent('#toast')
        })
        api.getProductInfo(options.pid).then(json => {
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
                app.goPage('/pages/login/login',{},{type: 'redirect'})
            }
        });
    },
    gotoPay() {
        let self = this;
        let setPayParam = {
            price: this.data.options.price,
            openid: app.globalData.customInfo.open_id
        };
        api.setPay(setPayParam).then(r => {
            let Json = r.data;
            wx.requestPayment({
                'timeStamp': Json.timeStamp,
                'nonceStr': Json.nonceStr,
                'package': Json.package,
                'signType': Json.signType,
                'paySign': Json.paySign,
                success(res) {
                    let vipParams = {
                        uid: app.globalData.customInfo.uid,
                        pid: self.data.options.pid,
                        price: setPayParam.price,
                        begin: self.handleDate(self.data.begin),
                        end: self.handleDate(self.data.end)
                    };
                    api.addOrder(vipParams).then(r => {
                        let data = r;
                        self.data.toast.show(data.msg);
                        if (data.status == "success") {
                            setTimeout(function () {
                                app.goPage('/pages/detail/book-success',{uid:vipParams.pid},{type:'redirect'})
                            }, 2e3)
                        }
                    })
                },
                'fail': function (res) {
                }
            })
        })
    },
    handleDate(time) {
        time = time >= 10 ? time + ":00" : '0' + time + ":00";
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        var day = date.getDate();

        day = (day < 10 ? "0" + day : day);
        var mydate = (year.toString() + "-" + month.toString() + "-" + day.toString());
        return time = mydate + " " + time;
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
