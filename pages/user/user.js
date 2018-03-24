const app = getApp();
Page({
    data: {},
    onLoad() {
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
