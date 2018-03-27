const app = getApp();
Component({
    properties: {
        tabIndex: {
            type: String,
            value: ''
        },
        is_zxs: {
            type: String,
            value: '',
        },
    },
    data: {},
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
                if (this.data.is_zxs != 1 ) {
                    app.goPage('/pages/counselor/counselor')
                } else {
                    app.goPage('/pages/user/user', {type: 2})
                }
            } else if (index == '3') {
                app.goPage('/pages/user/user', {type: 3})
            }
        }
    }
})