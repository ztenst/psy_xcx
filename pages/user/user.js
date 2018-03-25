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
