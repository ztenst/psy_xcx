//获取应用实例
import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'
import Util from '../../utils/util';
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime';

var WxParse = require('../../libs/wxParse/wxParse.js');
import _ from '../../libs/lodash/we-lodash';

const app = getApp();

Page({
    data: {
        pid: 0,
        tabIndex: 0,//设置当前的tabindex
        canNotUseList: [],
        begin: null,
        end: null
    },
    async onLoad(options) {
        let self = this;
        this.setData({
            pid: options.id
        });
        let res = await   api.getTime(options.id);
        let json = res.data;
        this.setData({
            yuan: json.price,
            price: json.price,
            dateList: json.list.slice(0),
        });
        this.formatTime(json.list[0].list);
        this.getCanNotUseList(json.list[0].list)
        console.log(json.list.slice(0));
        
    },
    onShow() {
        app.getUserOpenId().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                is_zxs: res.is_zxs
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
                    onConfirm(e) {
                    },
                });
            } else if (res.uid && res.is_user != '1') {
                app.goPage('/pages/login/login')
            }
        });
    },
    getCanNotUseList(list) {
        let LIST = list.slice(0);
        LIST = _.filter(list, (o) => {
            return o.can_use == '0';
        });
        this.setData({
            canNotUseList: LIST
        });
    },
    getTimeList(e) {
        let index = e.currentTarget.dataset.index, dateList = this.data.dateList;
        this.setData({
            tabIndex: index,
        });
        this.formatTime(dateList[index].list);
        this.getCanNotUseList(dateList[index].list)
    },
    selectTime(e) {
        let dataset = e.currentTarget.dataset, tempBeginEnd = this.data.tempBeginEnd;
        if (dataset.iscan != 0) {
            let begin = this.data.begin;
            let end = this.data.end;
            if (!begin) {
                this.setData({
                    begin: dataset.id,
                });
            } else {
                if (begin != dataset.id) {
                    if (!end) {
                        if (dataset.id > begin)
                            this.setData({
                                end: dataset.id,
                            });
                        else {
                            this.setData({
                                end: begin,
                            });
                            this.setData({
                                begin: dataset.id,
                            });
                        }

                    } else {
                        if (dataset.id <= begin) {
                            this.setData({
                                begin: dataset.id,
                            });
                        } else {
                            this.setData({
                                end: dataset.id,
                            });
                        }
                    }
                }
            }
        }
        if (this.data.begin && this.data.end) {
            this.setData({
                price: Math.floor(parseInt(this.data.end - this.data.begin + 1) * this.data.yuan * 100) / 100
            });
        }
    },
    gotoPay() {
        let self = this;
        let setPayParam = {
            price: this.data.price,
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
                        pid: self.data.pid,
                        price: setPayParam.price,
                        begin: self.handleDate(self.data.begin),
                        end: self.handleDate(self.data.end)
                    };
                    api.addOrder(vipParams).then(r => {
                        let json = r.data;
                        console.log(json.status)
                        if (json.status == 'success') {
                            let url = '/pages/index/index';
                            app.goPage(url);
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
    //处理时间格式
    formatTime(list) {
        let LIST = list.slice(0);
        LIST.map((v, i) => {
            v.id = v.time;
            v.time = v.time >= 10 ? v.time + ":00" : '0' + v.time + ":00";
        });
        this.setData({
            timeList: LIST
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
