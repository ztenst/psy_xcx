let app = getApp();
import api from '../../libs/api';

Page({
    data: {
        num:0
    },
    onLoad(options) {
        api.getPriceList({uid: app.globalData.customInfo.uid}).then(res => {
            console.log(res)
            this.setData({
                num:res.data.num,
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

