const app = getApp();
Page({
    data: {},
    onLoad(options) {
        this.setData({
            type: options.type,
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
        }
        app.goPage(url);
    }
});
