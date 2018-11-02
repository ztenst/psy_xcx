import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'
let app = getApp();
import _ from '../../libs/lodash/we-lodash';

Page({
    data: {
    },
    onLoad(options) {
        api.getContact({uid:options.uid}).then(res=>{
           let contactInfo = res.data;
            this.setData({contactInfo});
        })
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
                    title: '明悦心空',
                    content: '明悦心空需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
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
    //拨打电话
    call(e) {
        let phone = e.currentTarget.dataset.tel.replace(/\s*转\s*/, ',');
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    copyTBL(e){
        wx.setClipboardData({
            data: this.data.contactInfo.wx,
            success: function(res) {
                // self.setData({copyTip:true}),
                wx.showModal({
                    title: '提示',
                    content: '复制成功',
                    success(res) {
                    }
                })
            }
        });
    }
});


