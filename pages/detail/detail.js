//获取应用实例
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
    onLoad: function (options) {
        var courseList = [];
        for (var i = 0; i < 7; i++) {
            courseList[i] = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        }
        ;
        this.setData({courseList});

        api.getProductInfo(options.id).then(json => {
            let zxsInfo = json.data;
            this.setData({zxsInfo});
            courseList.forEach((v, index) => {
                zxsInfo['times'].forEach((V, I) => {
                        if ((index + 1) == V.week) {
                            v.forEach((vv, ii) => {
                                if(vv.id==V.time_area){
                                    vv.selected=true;
                                }
                            })
                        }
                    }
                )
            });
            this.setData({courseList})
        });

    },
    gotoBookTime(e){
        let id = e.currentTarget.dataset.id;
        app.goPage('/pages/detail/book-time', {'id': id})
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
