import {
    $dialog
} from '../../components/wxcomponents'
const app = getApp();
Page({
    data: {},
    onLoad(options) {
        this.setData({
            tabIndex:options.type,
            userInfo: app.globalData.userInfo,
            customInfo: app.globalData.customInfo
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
    goTo(e) {
        let dataset = e.currentTarget.dataset, url = '';
        if (dataset.type == 'yuyue') {
            url = '/pages/user/yuyue';
        } else if (dataset.type == 'record') {
            url = '/pages/user/record';
        }else if (dataset.type == 'zixun') {
            url = '/pages/counselor/counselor';
        } else if (dataset.type == 'kehu') {
            url = '/pages/user/customer_manage';
        }
        app.goPage(url);
    }
});
