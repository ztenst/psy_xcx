let app = getApp();
import api from '../../libs/api';

Page({
    data: {
        num:0
    },
    onLoad(options) {
        api.getUserList({uid: app.globalData.customInfo.uid}).then(res => {
            this.setData({
                listData: res.data
            })
        });
    },
    goDetail(e) {
        let dataset = e.currentTarget.dataset, url = '', params = {};
        url = "/pages/user/score";
        params = {id:dataset.id,oid: dataset.oid,type:'用户',status:dataset.status}
        app.goPage(url, params);
    },
});

