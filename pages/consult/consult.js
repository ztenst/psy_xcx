import config from '../../config'
let app = getApp();
import api from '../../libs/api';
import util from '../../libs/util';
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime';
import _ from '../../libs/lodash/we-lodash';

Page({
    data: {
        static_path: config.static_path,
        listOpts: {},//列表项组件参数
        searchOpts: {},//搜索组件参数
        filterOpts: {},//筛选组件参数
        condition: {},
        showSearchPanel: false,
        cidIndex: 0,
        menus: [],
        focused: false,
    },
    async onLoad(options) {
        let res = await api.getActiveTags();
        this.setData({
            filters: res.data,
            listOpts: {
                listType: 'product',
                ToTop: 91,
                bottom:100
            },
        });
    },
    //搜索组件和筛选组件最终触发列表组件的加载
    changeData(e) {
        this.setData({
            condition: e.detail.condition,
            [`listOpts.condition`]: e.detail.condition,
            menus: e.detail.barMenus || []
        });
    },
});

