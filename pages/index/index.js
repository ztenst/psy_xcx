import {
    $dialog
} from '../../components/wxcomponents'
import {
  $d1
} from '../../components/wxcomponents'
import api from '../../libs/api';
wx.showShareMenu({
  withShareTicket: true
})
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
      // console.log(app.globalData.userInfo);
      if(!app.globalData.userInfo) {
        $d1.alert({
          title: '明悦心空',
          content: '请先去个人中心登录',
          buttons: [{
            text: '知道了',
            type: 'weui-dialog__btn_primary',
          }],
          onConfirm(e) { 
            app.goPage('/pages/user/user', {}, { type: 'redirect' })
          },
        });
      }
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
    gotoDetail(e) {
        let id = e.currentTarget.dataset.id;
        app.goPage('/pages/article/article', {'id': id})
    }
});
