const app = getApp();
Component({
    properties: {
        tabIndex: {
            type: String,
            value: ''
        },
    },
    data: {
        is_zxs: app.globalData.customInfo.is_zxs
    },
    attached() {
    },
    ready() {
    },
    methods: {
        goTo(e) {
            let index = e.currentTarget.dataset.index;
            if (index == '0') {
                app.goPage('/pages/index/index')
            } else if (index == '1') {
                app.goPage('/pages/consult/consult')
            } else if (index == '2') {
                if (this.data.is_zxs == '0') {
                    app.goPage('/pages/counselor/counselor')
                } else if (this.data.is_zxs == '1') {
                    app.goPage('/pages/user/user', {type: 'counselor'})
                }
            } else if (index == '3') {
                app.goPage('/pages/user/user', {type: 'user'})
            } else if (index == '4') {
                app.goPage('/pages/suggest/suggest')
            }
        }
    }
})