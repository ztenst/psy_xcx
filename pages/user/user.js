import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'
const app = getApp();
Page({
    data: {
        isExtendBox:true
    },
    onLoad(options) {
        this.setData({
            tabIndex:options.type,
            userInfo: app.globalData.userInfo,
            customInfo: app.globalData.customInfo
        });
        
    },
    onShow(){
      api.getConfig().then(res => {
        let json = res.data;
        this.setData({
          phone: json.phone
        })
      }),        
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
  onGotUserInfo(){
    app.goPage('/pages/user/user');
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
        } else if (dataset.type == 'time') {
            url = '/pages/user/time_manage';
        } else if (dataset.type == 'price') {
            url = '/pages/user/price_manage';
        }
        app.goPage(url);
    },
    //拨打电话
    call(e) {
        let phone = e.currentTarget.dataset.tel.replace(/\s*转\s*/, ',');
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    toSuggest(){
        app.goPage('/pages/suggest/suggest')
    },
    changeUserInfo(){
        app.goPage('/pages/user/change-userinfo')
    },
    xiala(e){
        this.setData({
            isExtendBox:!this.data.isExtendBox
        });
    }
});
