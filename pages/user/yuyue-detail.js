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
    onLoad: function (options) {
        this.setData({
            toast: this.selectComponent('#toast')
        });
        api.orderInfo(options.id).then(json => {
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
    checkOrder(e){
        let id = e.currentTarget.dataset.id;
        api.checkOrder({id:id}).then(res=>{
            let data = res;
            this.data.toast.show(data.msg);
            if (data.status == "success") {
                setTimeout(function () {
                    app.goPage('/pages/user/score',{id:id,oid:'',type:'咨询师'})
                }, 2e3)
            }
        })
    }
});
