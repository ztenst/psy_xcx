import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime';
import _ from '../../../libs/lodash/we-lodash';
import util from "../../../libs/util";

Component({
    properties: {
        filters: {
            type: Array,
            value: null,
            observer(newVal, oldVal) {
                if (_.keys(newVal).length > 0) {
                    this.initData();
                }
            }
        },
        filterCondition: {
            type: Object,
            value: {},
            observer(newVal) {
                if (newVal && this.data.barMenus.length > 0) {
                    this.handleFilterCondition();
                }
            }
        },
    },
    data: {
        barMenus: [],
        showFilterBarPop: false,
        hasTabHeader: false,
        selectedMenu: {},
        selectedIndexMenu: -1,
        apiPfilterData: false
    },
    methods: {
        //筛选数据入口，初始化筛选数据
        initData() {
            let barMenus = [], temList = [];
            _.chain(this.data.filters)
                .forEach((v) => {
                    if(v.name!='更多'){
                        let result = this.getOriginItem(v);
                        barMenus.push(Object.assign({}, v, result));
                    }else{
                        let result = this.getMoreItem(v.list);
                        barMenus.push(Object.assign({}, {list: result}, {name: '更多', type: 'more', selectIndex: 0}));
                    }
                })
                .value();
            this.setData({
                barMenus: barMenus
            });
        },
        getOriginItem(Item) {
            let data = [], emptyObj = {id: '', name: '不限'}, list = Item.list;
            _.chain(list)
                .tap((list) => {
                    list.unshift(emptyObj);
                })
                .map((item) => {
                    item.selectIndex = 0;
                    if (Array.isArray(item.childAreas)) {
                        item.childAreas.unshift(emptyObj);
                    }
                })
                .value();

            data.push({
                selectIndex: 0,
                detailList: list
            });
            Item.list = data;
            Item.selectIndex = 0;
            Item.label = Item.name;
            return Item;
        }
        ,
        getMoreItem(Item) {
            let emptyObj = {id: '', name: '不限'}, list = Item.list;
            _.chain(Item)
                .forEach((v) => {
                    v.selectIndex = 0;
                    v.list.unshift(emptyObj);
                    v.list.map((item) => {
                        item.selectIndex = 0;
                    });
                    v.detailList = v.list;
                })
                .value();
            return Item;
        }
        ,
        handleFilterCondition() {
            let filterCondition = this.data.filterCondition,
                filterConditionkeys = _.keys(this.data.filterCondition);
            _.chain(this.data.barMenus)
                .forEach((barMenu, menuIndex) => {
                    if (barMenu.type !== 'more') {
                        if (filterConditionkeys.indexOf(barMenu.filed) !== -1) {
                            barMenu.list[0].detailList.find((items, index) => {
                                if (filterCondition[barMenu.filed] == items.id) {
                                    let childList = items.childAreas;
                                    if (childList) {
                                        childList.find((v, i) => {
                                            if (filterConditionkeys.indexOf('street') !== -1) {
                                                if (filterCondition['street'] == v.id) {
                                                    barMenu.name = v.name;
                                                    barMenu.list[0].selectIndex = index;
                                                    barMenu.list[0].detailList[index].selectIndex = i;
                                                }
                                            } else {
                                                barMenu.name = items.name;
                                                barMenu.list[0].selectIndex = index;
                                                barMenu.list[0].detailList[index].selectIndex = 0;
                                            }
                                        })
                                    } else {
                                        barMenu.name = items.name;
                                        barMenu.list[0].selectIndex = index;
                                    }
                                }
                            });
                        } else {
                            barMenu.name = barMenu.label;
                            barMenu.list[0].selectIndex = 0;
                        }
                    } else {
                        let res = filterConditionkeys.filter((n) => {
                            return _.chain(barMenu.list)
                                .map((item) => {
                                    return item.filed;
                                })
                                .value()
                                .indexOf(n) !== -1;
                        });
                        barMenu.name = res.length > 0 ? `筛选(${res.length})` : `筛选`;
                        barMenu.list.find((tabitem, tabindex) => {
                            if (res.indexOf(tabitem.filed) !== -1) {
                                tabitem.detailList.find((items, index) => {
                                    if (filterCondition[tabitem.filed] == items.id) {
                                        barMenu.list[tabindex].selectIndex = index;
                                    }
                                })
                            } else {
                                barMenu.list[tabindex].selectIndex = 0;
                            }
                        });
                    }
                })
                .value();
            this.setData({
                barMenus: this.data.barMenus,
            });
        }
        ,
//显示弹出框
        handleShowDialog(e) {
            let dataset = e.currentTarget.dataset;
            let isEqual = dataset.index == this.data.selectedIndexMenu;
            // console.log(dataset)
            this.setData({
                showFilterBarPop: isEqual ? false : true,
                selectedMenu: dataset.barmenu,
                selectedIndexMenu: isEqual ? -1 : dataset.index,
            });
        }
        ,
//关闭弹出框
        handleCloseDialog() {
            this.setData({
                showFilterBarPop: false,
                selectedIndexMenu: -1,
            });
        }
        ,
// 选择二级目录左侧列表时调用。
        handleChangeMainItem(mainItem) {
            let _mainItem = JSON.parse(JSON.stringify(mainItem));
        }
        ,
//修改选项
        changeSelect(e) {
            this.setData({
                filterCondition: util.filterEmpty(Object.assign(this.data.filterCondition, e.detail.selectData)),
            });
            this.handleFilterCondition();
            this.triggerFilter();
            this.handleCloseDialog();
        }
        ,
        triggerFilter() {
            let params = this.data.filterCondition;
            this.triggerEvent('changeSelect', {condition: params});
        }
        ,
    }
})
;