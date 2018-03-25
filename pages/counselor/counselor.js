import {
    $dialog
} from '../../components/wxcomponents'
import api from '../../libs/api'
import Util from '../../utils/util'

let app = getApp();
const qiniuUploader = require("../../libs/qiniuUploader");
import _ from '../../libs/lodash/we-lodash';

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
                        image: 'http://' + res.imageURL
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
        eduList: [],
        eduindex: 0,
        zx_modeList: [],
        modeindex: 0,
        zzindex: 0,

        image: '',
        zcList: [],
        zzList: [],
        lingyuList: [],
        times: [],
        courseList: [],
        date: '1970',

        areaList: [],
        streetList: [],
        areaIndex: 0,
        streetIndex: 0,
        dateindex: 0,


    },
    onLoad() {
        this.setData({
            toast: this.selectComponent('#toast')
        });
        this.setData({
            customInfo: app.globalData.customInfo,
            userInfo: app.globalData.userInfo,
            date: '1970'
        });
        api.getActiveTags().then(res => {
            let json = res.data;
            let obj = _.filter(json, {name: "更多"});//更多
            let zc = _.filter(json, {filed: "zc"});//专长
            let mode = _.filter(json, {filed: "mode"});//咨询模式
            this.setData({
                lingyuList: _.filter(obj[0].list, {filed: "ly"})[0].list,
                eduList: _.filter(obj[0].list, {filed: 'edu'})[0].list,
                zzList: _.filter(obj[0].list, {filed: 'zz'})[0].list,
                zcList: zc[0].list,
                zx_modeList: mode[0].list
            });
        });
        //预约时间初始化
        var courseList = [];
        for (var i = 0; i < 7; i++) {
            courseList[i] = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        }
        ;
        this.setData({courseList});
        this.getDateList();
        //获取省份城市字段
        api.getAreaList().then(res => {
            this.setData({areaList: res.data})
            var objectArray = res.data;
            var areaList = [];
            for (var i = 0; i < objectArray.length; i++) {
                areaList.push(objectArray[i]);
                if (i == objectArray.length - 1) {
                    this.setData({
                        areaList: areaList,
                        streetList: objectArray[this.data.areaIndex].childAreas
                    });
                }
            }
        });


        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'name': {required: true},
            'image': {required: true},
            'content': {required: true},
            'place': {required: true},
            'area': {required: true},
            'street': {required: true},
            'id_card': {required: true},
            'company': {required: true},
            'work_year': {required: true},
            'zx_mode': {required: true},
            'ly': {required: true},
            'zc': {required: true},
            'zz': {required: true},
            'edu': {required: true},
            'price': {required: true},
            'price_note': {required: true},
            'times': {required: true},
        }, {
            'name': {required: '请输入姓名'},
            'image': {required: '请选择头像'},
            'content': {required: '请输入个人简介'},
            'place': {required: '请输入具体地点'},
            'area': {required: '请输入区域'},
            'street': {required: '请输入地址'},
            'id_card': {required: '请输入身份证号'},
            'company': {required: '请填写所属机构'},
            'work_year': {required: '请选择工作年限'},
            'zx_mode': {required: '请选择咨询模式'},
            'ly': {required: '请选择领域'},
            'zc': {required: '请选择专长'},
            'zz': {required: '请选择资质'},
            'edu': {required: '请选择学历'},
            'price': {required: '请输入单价'},
            'price_note': {required: '请输入收费简介'},
            'times': {required: '请选择时间'},
        });
    },
    onShow(){
        app.getUserOpenId().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                is_zxs:res.is_zxs
            });
            if (!res.uid) {
                //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
                $dialog.alert({
                    title: '经纪圈新房通',
                    content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                    buttons: [{
                        text: '知道了',
                        type: 'weui-dialog__btn_primary',
                    }],
                    onConfirm(e) {},
                });
            }else if(res.uid&&res.is_user!='1'){
                app.goPage('/pages/login/login')
            }
        });
    },
    chooseDate(e) {
        let data = e.currentTarget.dataset;
        let times = this.data.times;
        times.push({week: data.week, time_area: data.time});
        this.setData({
            times: times
        });
        this.setTime();
    },
    getDateList(){
        var date=new Date;
        var year=date.getFullYear();
        var dateList = Array.from(Array(50), (v, k) => {
            return year-k;
        });
        this.setData({
            dateList,
            date:year
        });
    },
    setTime() {
        let courseList = this.data.courseList;
        let times = this.data.times;
        courseList.forEach((v, index) => {
            times.forEach((V, I) => {
                    if ((index + 1) == V.week) {
                        v.forEach((vv, ii) => {
                            if (vv.id == V.time_area) {
                                vv.selected = true;
                            }
                        })
                    }
                }
            )
        });
        this.setData({courseList})
    },

    //学历改变
    bindEduPickerChange(e) {
        this.setData({eduindex: e.detail.value})
    },
    //资质改变
    bindZZPickerChange(e) {
        this.setData({zzindex: e.detail.value})
    },
    //咨询模式改变
    bindZxModePickerChange(e) {
        this.setData({modeindex: e.detail.value})
    },

    //工作年限改变
    bindDateChange(e) {
        this.setData({
            dateindex: e.detail.value
        })
    },

    //上传项目图片
    didPressChooesImage() {
        var that = this;
        didPressChooesImage(that);
    },

    //区域改变
    bindPickerAreaChange(e) {
        this.setData({areaIndex: e.detail.value, streetIndex: 0})
        var objectArray = this.data.areaList;
        this.setData({streetList: objectArray[e.detail.value].childAreas})
    },
    //街道改变
    bindPickerStreetChange(e) {
        this.setData({
            streetIndex: e.detail.value
        })
    },
    chooseBtn(e) {
        let dataset = e.currentTarget.dataset;
        this.setData({
            [`${dataset.tag}`]: dataset.id
        });
    },
    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitForm(e) {
        let formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.data.toast.show(error.msg);
            return false;
        }
        let params = Object.assign({}, formParms, {uid: app.globalData.customInfo.uid, times: JSON.stringify(this.data.times)});
        api.setZxs(params).then(res => {
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


