let app = getApp();
import api from '../../libs/api';

Page({
    data: {
        rater: {
            max: 5,
            star: `★`,
            value: 0,
            activeColor: `#ffcf3f`,
            margin: 2,
            fontSize: 25,
            disabled: !1,
            text: [],
            defaultTextColor: `#999`,
        },
        stars: [`★`, `★`, `★`, `★`, `★`],
        colors: [],
        cutIndex: -1,
        cutPercent: 0,
        is_nm: 1,
    },
    onLoad(options) {
        this.setData({
            oid: options.id,
            toast: this.selectComponent('#toast')
        });

    },
    /**
     * 点击触发事件
     */
    handlerClick(e) {
        const i = e.currentTarget.dataset.index;
        const rater = this.data.rater
        const value = rater.value
        this.update(value === i + 1 ? i : i + 1)
    },
    /**
     * 更新 value
     */
    update(value = 0) {
        const rater = this.data.rater
        const _val = Number(value)
        this.setData({
            [`rater.value`]: _val < 0 ? 0 : _val > rater.max ? rater.max : _val
        })

        this.updateStyle()
        this.updateValue()

        
    },
    // 更新style
    updateStyle(id, vm) {
        const rater = this.data.rater;
        const max = rater.max;
        const value = rater.value;
        const activeColor = rater.activeColor;
        const colors = []

        for (let j = 0; j < max; j++) {
            if (j <= value - 1) {
                colors.push(activeColor)
            } else {
                colors.push(`#ccc`)
            }
            this.setData({
                colors: colors
            });
        }
    },

    // 更新value
    updateValue(id, vm) {
        const rater = this.data.rater;
        const value = rater.value
        const _val = value.toString().split(`.`)
        const sliceValue = _val.length === 1 ? [_val[0], 0] : _val

        this.setData({
            cutIndex: sliceValue[0] * 1,
            cutPercent: sliceValue[1] * 10,
        })
    },
    /**
     * 切换输入的手机号格式
     * @param e
     */
    switchPhoneChange(e) {
        this.setData({
            is_nm: e.detail.value?1:0
        });
    },
    //评分
    setGrade(e) {
        const formParms = e.detail.value;
        console.log(formParms)
        let params = Object.assign({}, formParms,
            {uid: app.globalData.customInfo.uid,oid:this.data.oid});
        api.setGrade(params).then(res => {
            let data = res;
            this.data.toast.show(data.msg);
            if (data.status == "success") {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                },2e3)
            }
        });
    }
});

