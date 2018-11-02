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
        toast: null,
        zxsInfo: {},
        dateList: [{
            1: [1, 2, 3, 4],
        }],
        course: [1, 2, 3, 4]
    },
    onLoad: function (options) {
        // var courseList = [];
        // for (var i = 0; i < 7; i++) {
        //     courseList[i] = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        // }
        // ;
        // this.setData({courseList});

        api.getProductInfo(options.id).then(json => {
            let zxsInfo = json.data;
            this.setData({zxsInfo});
            // courseList.forEach((v, index) => {
            //     zxsInfo['times'].forEach((V, I) => {
            //             if ((index + 1) == V.week) {
            //                 v.forEach((vv, ii) => {
            //                     if(vv.id==V.time_area){
            //                         vv.selected=true;
            //                     }
            //                 })
            //             }
            //         }
            //     )
            // });
            // this.setData({courseList})
        });

    },
    onShow(){
        app.getUserOpenId().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                is_zxs:res.is_zxs,
                toast: this.selectComponent('#toast')
            });
            if (!res.uid) {
                //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
                $dialog.alert({
                    title: '明悦心空',
                    content: '明悦心空需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
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
        if (app.globalData.customInfo.uid==id) {
          this.data.toast.show('自己不能预约自己');
        } else {
          app.goPage('/pages/detail/book-time', { 'id': id })
        }
        
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
