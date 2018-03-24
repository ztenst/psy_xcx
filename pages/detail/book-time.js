//获取应用实例
import api from '../../libs/api'
import Util from '../../utils/util';

var WxParse = require('../../libs/wxParse/wxParse.js');
import _ from '../../libs/lodash/we-lodash';

const app = getApp();

Page({
    data: {
        pid:0,
        tabIndex: 0,//设置当前的tabindex
        canNotUseList: [],
        begin: null,
        end: null
    },
    onLoad: function (options) {
        this.setData({
            pid:options.id
        })
        api.getTime(options.id).then(res => {
            let json = res.data;
            this.setData({
                yuan: json.price,
                price: json.price,
                dateList: json.list,
                timeList: this.formatTime(json.list[0].list),
                canNotUseList: this.getCanNotUseList(json.list[0].list)
            });
        })
    },
    getCanNotUseList(list) {
        return list = _.filter(list, (o) => {
            return o.can_use == '0';
        })
    },
    getTimeList(e) {
        this.setData({
            tabIndex: e.currentTarget.dataset.index,
            timeList: this.formatTime(this.data.dateList[e.currentTarget.dataset.index].list),
            canNotUseList: this.getCanNotUseList(this.data.dateList[e.currentTarget.dataset.index].list)
        });
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
        let self  = this;
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
        let LIST = list;
        LIST.forEach((v, i) => {
            v.id = v.time;
            v.time = v.time >= 10 ? v.time + ":00" : '0' + v.time + ":00";
        });
        return LIST;
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
