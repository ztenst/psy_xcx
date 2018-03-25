let app = getApp();
import api from '../../libs/api';

Page({
    data: {
        num:0
    },
    onLoad(options) {
        api.getUserList({uid: app.globalData.customInfo.uid}).then(res => {
            console.log(res)
            this.setData({
                listData: res.data.list
            })
        })
    },
    goDetail(e) {
        let dataset = e.currentTarget.dataset, url = '', params = {};
        url = "/pages/user/yuyue-detail";
        params = {id: dataset.id}
        app.goPage(url, params);
    },
});

