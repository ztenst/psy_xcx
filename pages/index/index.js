import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api';

const app = getApp();
Page({
    data: {},
    onLoad() {
        api.index().then(res => {
            if (res.data.length >= 0) {
                this.setData({
                    list: res.data
                });
            }
        });
    },
    onShow(){
        app.getUserOpenId().then(res => {
            console.log(res)
            this.setData({
                userInfo: app.globalData.userInfo
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
    gotoDetail(e) {
        let id = e.currentTarget.dataset.id;
        app.goPage('/pages/article/article', {'id': id})
    }
});
