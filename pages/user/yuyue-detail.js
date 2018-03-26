//获取应用实例
import api from '../../libs/api'
import Util from '../../utils/util'

var WxParse = require('../../libs/wxParse/wxParse.js');
const app = getApp();
Page({
    data: {
        toast: null,
        zxsInfo: {},
        dateList: [{
            1: [1, 2, 3, 4],
        }],
        course: [1, 2, 3, 4]
    },
    onLoad(options) {
        this.setData({
            options: options,
            toast: this.selectComponent('#toast')
        });

    },
    onShow() {
        api.orderInfo({id: this.data.options.id, oid: this.data.options.oid, uid: app.globalData.customInfo.uid}).then(json => {
            let zxsInfo = json.data;
            this.setData({zxsInfo});
            // //预约时间初始化
            // var courseList = [];
            // for (var i = 0; i < 7; i++) {
            //     courseList[i] = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
            // }
            // ;
            // courseList.forEach((v, index) => {
            //     zxsInfo['times'].forEach((V, I) => {
            //             if ((index + 1) == V.week) {
            //                 v.forEach((vv, ii) => {
            //                     if (vv.id == V.time_area) {
            //                         vv.selected = true;
            //                     }
            //                 })
            //             }
            //         }
            //     )
            // });
            // this.setData({courseList})
        });
    },
    gotoBookTime(e) {
        let id = e.currentTarget.dataset.id;
        app.goPage('/pages/detail/book-time', {'id': id})
    },
    checkOrder(e) {
        let id = e.currentTarget.dataset.id, self = this;
        api.checkOrder({id: id}).then(res => {
            let data = res;
            this.data.toast.show(data.msg);
            if (data.status == "success") {
                setTimeout(function () {
                    app.goPage('/pages/user/score', {id: id, oid: self.data.options.oid, type: '咨询师'})
                }, 2e3)
            }
        })
    }
});
