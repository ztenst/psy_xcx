import api from '../../../libs/api';
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime';

Component({
    properties: {
        listOpts: {
            type: Object,
            value: {},
            observer(n, o) {
                if (Object.keys(n).length > 0 && !this.data.listApi) {
                    this.initData();
                } else {
                    this.resetLoad();
                }
            }
        },
    },

    data: {
        listApi: '',
        listData: [],
        listOtherParams: {},
        listScroll: {
            hasMore: true,
            nodata_str: '没有找到呢，去掉点筛选条件实施看吧!'
        },
        page: 1,
    },
    methods: {
        initData() {
            this.getListApi(this.data.listOpts.listType);
            this.resetLoad();
        },

        //重置加载更多参数
        resetLoad() {
            this.setData({
                listOtherParams: this.data.listOpts.condition || {},
                [`listScroll.hasMore`]: true,
                listData: [],
                page: 1,
            });
            this.loadMore();
        },
        /**
         * 加载数据
         */
        loadMore() {
            let params = Object.assign({}, {page: this.data.page}, this.data.listOpts.condition);
            if (!this.data.listScroll.hasMore || this.data.page === 0) return;
            if (this.data.listApi) {
                this.data.listApi(params).then(res => {
                    this.handleJson(res.data);
                });
            }
        },
        /**
         * 处理返回的数据格式
         * @param json
         */
        handleJson(json) {
            let page = this.data.page;
            let nextPage = json.pageCount === 0 || json.page_count === 0 || json.pageCount === page || json.page_count === page ? 0 : page + 1;
            this.setData({
                page: nextPage,
                [`listScroll.hasMore`]: (nextPage == 0 ? false : true),
                listData: this.data.listData.concat(json.list||[])
            });
        },

        /**
         * 获取列表的api
         * @param listType
         */
        getListApi(listType) {
            switch (listType) {
                case 'product':
                    this.setData({
                        listApi: api.getProductList
                    });
                    break;
                case 'bbs':
                    this.setData({
                        listApi: api.getCusList
                    });
                    break;
                default:
                    break;
            }

        }
    }

})