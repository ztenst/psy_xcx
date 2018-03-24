import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime';
import _ from '../../../libs/lodash/we-lodash';

Component({
    behaviors: [],
    properties: {
        menu: {
            type: Object,
            value: {},
            observer(newV) {
                if (Object.keys(newV).length > 0) {
                    this.setData({
                        barMenu: this.data.menu
                    })
                    this.initData();
                }
            }
        },
        showFilterBarPop: {
            type: Boolean,
            value: true,
            observer(v) {
                this.setData({
                    visible: v
                });
            }
        },
    },
    data: {
        selectIndexTab: 0,
        currentSelectIndex: 0,//二级列表左侧列表选项
        tabs: {},
        items: {},
        column: '',
        visible: false,
        selectData: {},
        range: {},
        popup: null
    },
    ready() {
        this.data.popup = this.selectComponent('.popup');
    },
    methods: {
        //初始化数据
        initData(tabIndex) {
            var tmpTabIndx = 0, barMenu = this.data.barMenu;
            console.log(barMenu)
            // console.log(this.data.menu)
            tabIndex === undefined ? tmpTabIndx = barMenu.selectIndex : tmpTabIndx = tabIndex;
            //判断tabindex的范围是否在数组内
            if (tmpTabIndx >= 0 && tmpTabIndx < barMenu.list.length) {
                this.setData({
                    selectIndexTab: tmpTabIndx
                });
            } else {
                this.setData({
                    selectIndexTab: 0
                });
            }
            //确认选中tab的一级列表
            this.setData({
                sideMenus: barMenu.list[this.data.selectIndexTab]
            });
            //如果当前选中tab是对应选中结果的tab
            // debugger;
            if (this.data.selectIndexTab == barMenu.selectIndex) {
                this.setData({
                    currentSelectIndex: this.data.sideMenus.selectIndex
                })
            } else {
                this.setData({
                    [`sideMenus.selectIndex`]: -1,
                    currentSelectIndex: -1
                });
            }

            //判断是否包含二级列表，包含则赋值
            if (this.data.sideMenus.detailList[this.data.currentSelectIndex].childAreas) {
                this.setData({
                    items: this.data.sideMenus.detailList[this.data.currentSelectIndex]
                })
            } else {
                //不显示二级列表
                this.setData({
                    items: this.data.sideMenus
                })
            }

        },
        // 点击右侧列表
        clickItem(e) {
            let dataset = e.currentTarget.dataset;
            this.setData({
                [`selectData.${dataset.tag}`]: dataset.id
            });
            this.changeSelect();
        },
        // 点击二级目录左侧列表
        clickSidebar(e) {
            let dataset = e.currentTarget.dataset;
            if (this.data.currentSelectIndex !== dataset.index) {
                this.setData({
                    currentSelectIndex: dataset.index,
                    [`selectData.${dataset.tag}`]: dataset.id
                });

                //存在二级列表
                if (this.data.sideMenus.detailList[this.data.currentSelectIndex].childAreas) {
                    this.setData({
                        items: this.data.sideMenus.detailList[this.data.currentSelectIndex]
                    });
                } else {
                    //只有一级列表，记录选项，退出
                    this.setData({
                        [`selectData.street`]: '',
                    });
                    this.changeSelect();
                }
            }
            // this.triggerEvent('changeMainItem',{dataset.sidemenu,
            //     dataset.index});
        },

        // 筛选方法
        clickFilterbar(e) {
            let dataset = e.currentTarget.dataset;
            this.data.barMenu.list[dataset.tabindex].selectIndex = dataset.index;
            this.setData({
                [`barMenu.list`]: this.data.barMenu.list,//记录一级列表选项
                [`range.${dataset.tag}`]: dataset.id
            });
        },

        changeSelect() {
            this.triggerEvent('changeSelect', {selectData: this.data.selectData});
        },

        handleEnsurePrice(e) {

            let [minprice, maxprice] = [parseInt(this.data.selectData.minprice), parseInt(this.data.selectData.maxprice)];
            if (isNaN(minprice) || isNaN(maxprice) || minprice >= maxprice) {
                this.data.popup.show('最低价不能高于最高价')
            } else {
                this.setData({
                    [`selectData.pricetag`]: '',
                    [`selectData.xinfangjiage`]: ''
                })
                this.changeSelect();
            }
        },

        inputMinprice(e) {
            this.setData({
                [`selectData.minprice`]: e.detail.value
            })
        },
        inputMaxprice(e) {
            this.setData({
                [`selectData.maxprice`]: e.detail.value
            });
        },
        //提交已选内容
        handleEnsure() {
            this.setData({
                selectData: Object.assign(this.data.selectData, this.data.range)
            });
            this.changeSelect();
        },
        //清除已选内容
        async handleClean() {
            let barMenu = this.data.barMenu;
            let o3 = _.chain(barMenu.list)
                .map((item) => {
                    item.selectIndex = 0;
                    return item.filed;
                })
                .value();
            this.data.range = _.fromPairs(o3.map((v) => {
                return [v, ""];
            }));
            // console.log(menu)
            this.setData({
                [`barMenu.list`]: barMenu.list,//记录一级列表选项
                range: this.data.range
            })
        },
        // 关闭弹框
        closeDialog() {
            this.triggerEvent('closeDialog');
        },
    }

})