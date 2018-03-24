const app = getApp();
Component({
    properties: {
        tabIndex: {
            type: String,
            value: ''
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
                app.goPage('/pages/counselor/counselor')
            } else if (index == '3') {
                app.goPage('/pages/user/user')
            } else if (index == '4') {
                app.goPage('/pages/suggest/suggest')
            }
        }
    }
})