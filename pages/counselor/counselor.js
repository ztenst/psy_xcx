import api from '../../libs/api'
import Util from '../../utils/util'
let app = getApp();
const qiniuUploader = require("../../libs/qiniuUploader");
function getKey() {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var key = '';
    var time = new Date().getTime();
    var Range = 999999 - 100000;
    var Rand = Math.random();
    var num = 100000 + Math.round(Rand * Range);
    return key + myDate.getFullYear() + '/' + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day) + '/' + new Date().getTime() + num + '.jpg';
}
function didPressChooesImage(that) {
    // initQiniu();
    // 微信 API 选文件
    wx.chooseImage({
        count: 1,
        success(res) {
            var filePath = res.tempFilePaths[0];
            // 交给七牛上传
            qiniuUploader.upload(filePath, (res) => {
                    that.setData({
                        image: 'http://'+res.imageURL
                    });
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                }
                , {
                    region: 'NCN', // 华北区
                    domain: 'oofuaem2b.bkt.clouddn.com',
                    uptokenURL: 'https://psy.madridwine.cn/api/image/qnUpload',
                    shouldUseQiniuFileName: false,
                    key: getKey(),
                }
            );
        }
    })
}
Page({
    data: {
        toast: null,
        sexItems: [
            {name: '男', value: 1},
            {name: '女', value: 2},
        ],
        eduList:[],
        eduindex:0,
        image:''

    },
    onLoad() {
        this.setData({
            toast: this.selectComponent('#toast')
        });
        this.setData({
            customInfo: app.globalData.customInfo,
            userInfo: app.globalData.userInfo,
            date:'1970'
        });
        this.getUserTag();

        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'name': {required: true}, //姓名
            'phone': {required: true, tel: true}, // 电话
            'sex': {required: true}, //性别,
            'edu': {required: true}, //学历
        }, {
            'name': {required: '请输入姓名'}, //姓名
            'phone': {required: '请填写正确格式的手机号码'}, // 电话
            'sex': {required: '请选择性别'}, //性别
            'edu': {required: '请选择学历'}, //学历
        });
    },
    getUserTag(){
        api.getUserTags().then(res=>{
            let json = res.data,tmpList=[];
            for (let key in json) {
                tmpList.push({'id': key, 'name': json[key]});
                if(Object.keys(json).length==tmpList.length){
                    this.setData({
                        eduList: tmpList
                    })
                }
            }
        })
    },
    //学历改变
    bindEduPickerChange(e) {
        this.setData({eduindex: e.detail.value})
    },
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    /**
     *设置性别
     * @param e
     */
    sexRadioChange(e) {
        console.log(e.detail.value)
        this.setData({
            sex: e.detail.value
        });
    },

    //上传项目图片
    didPressChooesImage() {
        var that = this;
        didPressChooesImage(that);
    },

    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitLoginForm(e) {
        const formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.data.toast.show(error.msg)
            return false
        }
        let params = Object.assign({},
            formParms, {imgs: this.data.uploadImgs},
            {openid:app.globalData.customInfo.open_id,pro: app.globalData.userInfo.province,city: app.globalData.userInfo.city});
        api.indexSub(params).then(res => {
            let data = res;
            this.data.toast.show(data.msg);
            if(data.status=="success"){
                setTimeout(function () {
                    app.goPage('/pages/index/index')
                },2e3)
            }
        });
    },
});


