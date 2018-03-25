import api from '../../libs/api'
let app = getApp();
import _ from '../../libs/lodash/we-lodash';

Page({
    data: {
        toast: null,


    },
    onLoad() {
        this.setData({
            toast: this.selectComponent('#toast')
        });

        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'note': {required: true},
        }, {
            'note': {required: '请输入您的建议'},
        });

    },
    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitForm(e) {
        const formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.data.toast.show(error.msg)
            return false
        }
        let params = Object.assign({},formParms,
            {uid: app.globalData.customInfo.uid});
        api.addReport(params).then(res => {
            let data = res;
            this.data.toast.show(data.msg);
            if (data.status == "success") {
                setTimeout(function () {
                    app.goPage('/pages/index/index')
                }, 2e3)
            }
        });
    },
});


