const app = getApp();
Page({
    data: {},
    onLoad() {
    },
    goTo(e){
        let dataset = e.currentTarget.dataset, url = '';
        if (dataset.type=='yuyue') {
            let url = '/pages/user/yuyue';
            app.goPage(url);
        } else {

        }
    }
});
