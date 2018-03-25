import config from '../../config'
import {
    $dialog
} from '../../components/wxcomponents'
let app = getApp();
import api from '../../libs/api';


Page({
    data: {
        static_path: config.static_path,
        listOpts: {},//列表项组件参数
        searchOpts: {},//搜索组件参数
        filterOpts: {},//筛选组件参数
        condition: {},
        showSearchPanel: false,
        cidIndex: 0,
        menus: [],
        focused: false,
    },
    async onLoad(options) {
        let res = await api.getActiveTags();
        this.setData({
            filters: res.data,
            listOpts: {
                listType: 'product',
                ToTop: 91,
                bottom:100
            },
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
    //搜索组件和筛选组件最终触发列表组件的加载
    changeData(e) {
        this.setData({
            condition: e.detail.condition,
            [`listOpts.condition`]: e.detail.condition,
            menus: e.detail.barMenus || []
        });
    },
});

