<template>
    <a-drawer title="Tìm kiếm"
              placement="right"
              :width="500"
              :visible="state.visibleDrawer"
              :get-container="false"
              @close="closeDrawer">
        <a-form name="banner-filter-form"
                :model="filterForm" layout="vertical">
            <a-row :gutter="[10, 10]">
                <a-col :span="24">
                    <a-form-item label="Tìm kiếm"
                                 name="findByWord">
                        <a-input v-model:value="filterForm.findByWord"
                                 placeholder="Nhập Tiêu đề, Từ khóa,.."/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Trạng thái"
                                 name="status">
                        <a-select v-model:value="filterForm.status"
                                  :options="optionsStatus"
                                  placeholder="Chọn trạng thái"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Chuyên mục"
                                 name="categories">
                        <a-select v-model:value="filterForm.category"
                                  :options="optionsCategory"
                                  allow-clear
                                  placeholder="Chọn chuyên mục"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Tác giả"
                                 name="authors">
                        <a-select v-model:value="filterForm.author"
                                  mode="multiple"
                                  label-in-value
                                  placeholder="Chọn tác giả"
                                  :filter-option="false"
                                  :not-found-content="state.fetchingAuthor ? undefined : null"
                                  :options="state.dataAuthor"
                                  @search="fetchAuthor">
                            <template v-if="state.fetchingAuthor" #notFoundContent>
                                <a-spin size="small"/>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Tin của tôi"
                                 name="isMyNews">
                        <a-checkbox v-model:checked="filterForm.isMyNews"
                                    :disabled="!policies.some(p => ['APPROVE_NEWS', 'PUBLIC_NEWS'].includes(p))"/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Tin nổi bật"
                                 name="isHotNews">
                        <a-checkbox v-model:checked="filterForm.isHotNews"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="flex justify-end space-x-2">
                <a-form-item>
                    <a-button key="reset" @click="resetDrawer">
                        Cài lại
                    </a-button>
                </a-form-item>
                <a-form-item>
                    <a-button key="find"
                              type="primary"
                              @click="handleTableChange(1)">
                        Tìm kiếm
                    </a-button>
                </a-form-item>
            </div>
        </a-form>
    </a-drawer>

    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <div class="flex justify-between">
        <TittlePage label="Danh sách tin tức"/>
        <div class="flex justify-end space-x-2">
            <a-button key="deleteButton"
                      v-if="selectedRowKeys.length !== 0"
                      danger
                      @click="showConfirm">
                Xoá
            </a-button>
            <a-button key="openDrawer"
                      @click="showDrawer"
                      class="flex justify-center items-center">
                <search-outlined/>
                Tìm kiếm
            </a-button>
            <a-button key="openDrawer"
                      class="bg-[#1677ff]"
                      type="primary flex justify-center items-center"
                      @click="navigate('/activity/editor')">
                <plus-outlined/>
                Tạo
            </a-button>
        </div>
    </div>

  <!--  Table quản lý-->
    <div class="mt-5">
        <a-table :columns="columns"
                 :data-source="tableData"
                 :pagination="false"
                 :loading="state.tableLoading"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                 :scroll="{ x: 1300, y: 1000 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                    <span @click="showActivityNews(record.id)">
                        <a>{{ record.title }}</a>
                    </span>
                </template>
                <template v-else-if="column.key === 'status'">
                    <div class="w-full">
                        <a-tag :color="colorByStatus[record.status]" class="text-sm">
                            {{ labelByStatus[record.status] }}
                        </a-tag>
                    </div>
                </template>
                <template v-else-if="column.key === 'author'">
                    <span v-if="record.author">{{ record.author.name }}</span>
                    <line-outlined v-else/>
                </template>
                <template v-else-if="column.key === 'isHotNews'">
                    <a-checkbox v-model:checked="record.isHotNews" disabled/>
                </template>
                <template v-else-if="column.key === 'category'">
                    <span v-if="record.category.length !== 0">
                        <a-tag v-for="category in record.category"
                               :key="category.id"
                               color="green"
                               class="text-sm">
                            {{ category.name }}
                        </a-tag>
                    </span>
                    <line-outlined v-else/>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span @click="showActivityNews(record.id)">
                        <a>Sửa</a>
                    </span>
                    <a-divider type="vertical"/>
                    <span @click="showConfirm(record.id)">
                        <a>Xoá</a>
                    </span>
                </template>
            </template>
        </a-table>
        <div class="flex justify-end mt-2.5">
            <a-pagination v-model:current="current"
                          v-model:pageSize="pageSize"
                          :pageSizeOptions="['10', '20']"
                          :total="total"
                          :show-total="t => `Total ${numberWithComma(t)} items`"
                          show-size-changer
                          @change="handleTableChange"
                          @showSizeChange="onShowSizeChange"/>
        </div>
    </div>
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {createVNode, onMounted, ref} from "vue";
import {Modal} from "ant-design-vue";
import {LineOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {handleResponse} from "../../../services/commonService";
import {useRouter} from "vue-router";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb.vue";
import {numberWithComma} from "../../../utils/formatNumber";
import {debounce} from "lodash-es";
import {getUsers} from "../../../services/user";
import {dateTimeFormatString} from "../../../utils/reformatTime";
import axios from "axios";
import {showToast} from "../../../utils/showToast";
import TittlePage from "../../../components/TittlePage.vue";
import {deleteById, getAll} from "../../../services/activity";

const columns = [
    {title: 'Tiêu đề', dataIndex: 'title', key: 'title', fixed: 'left', width: 200, ellipsis: true},
    {title: 'Ngày đăng', dataIndex: 'createdAt', key: 'createdAt', width: 160},
    {title: 'Chuyên mục', dataIndex: 'category', key: 'category'},
    {title: 'Trạng thái', key: 'status', dataIndex: 'status', width: 130},
    {title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy', width: 190},
    {title: 'Tác giả', dataIndex: 'author', key: 'author', width: 200},
    {title: 'Tin nổi bật', dataIndex: 'isHotNews', key: 'isHotNews', width: 110},
    {title: 'Thao tác', key: 'action', fixed: 'right', width: 120}
];

const optionsStatus = [
    {value: '', label: 'Tất cả'},
    {value: 'DRAFT', label: 'Tin đang soạn'},
    {value: 'PUBLIC', label: 'Tin đã đăng'}
];

const colorByStatus = {
    DRAFT: '#f87171',
    PUBLIC: '#22c55e',
    DISMISS: '#d1d5db'
};

const labelByStatus = {
    DRAFT: 'Tin đang soạn',
    WAITING_APPROVE: 'Tin chờ phê duyệt',
    REJECTED: 'Tin bị từ chối',
    WAITING_POSTED: 'Tin chờ đăng',
    POSTED: 'Tin đã đăng',
    DISMISS: 'Tin đã bị gỡ'
};

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Danh sách tin tức', to: '/news'}
];

const optionsCategory = [
    {label: 'Tất cả', value: 'all'},
    {label: 'Sự kiện', value: 'event'},
    {label: 'Chương trình hỗ trợ', value: 'support_program'}
]

const router = useRouter();

const total = ref(1);
const current = ref(1);
const pageSize = ref(10);
const tableData = ref([]);
const policies = ref([]);
const selectedRowKeys = ref([]);

const state = reactive({
    tableLoading: false,
    loading: false,
    uploadLoading: false,
    visibleDrawer: false,
    fetchingAuthor: false,
    dataAuthor: []
});

const filterForm = reactive({
    findByWord: '',
    status: '',
    category: 'all',
    author: [],
    isMyNews: true,
    isHotNews: false
});

onMounted(() => {
    handleTableChange(1);
});

const showDrawer = () => {
    state.visibleDrawer = true;
};

const closeDrawer = () => {
    state.visibleDrawer = false;
};

const fetchAuthor = debounce(value => {
    state.fetching = true;
    getUsers(1, 500, `&filters[search]=${value}`)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            state.fetching = false;
            state.dataAuthor = responseData
                ? responseData.data.docs.map(u => {
                    return {
                        value: u._id,
                        label: u.fullName
                    }
                })
                : [];
        })
        .catch(error => {
            console.log('Search user failed', error);
            state.fetching = false;
            state.dataAuthor = [];
        });
}, 500);

const resetDrawer = () => {
    filterForm.findByWord = '';
    filterForm.status = '';
    filterForm.category = 'all';
    filterForm.author = [];
    filterForm.isMyNews = true;
    filterForm.isHotNews = false;
};

const navigate = (target) => {
    resetDrawer();
    router.push(target);
}

const showConfirm = activityId => {
    Modal.confirm({
        title: 'Xoá tin tức',
        content: createVNode('div', null, `Bạn xác nhận thực hiện xoá ${typeof activityId === 'string' ? '' : 'những'} bài viết này?`),
        confirmLoading: true,
        okText: 'Xác nhận',
        okType: 'danger',
        cancelText: 'Từ chối',
        onOk() {
            const deleteRequests = typeof activityId === 'string'
                ? [deleteById(activityId)]
                : selectedRowKeys.value.map(activityId => {
                    return deleteById(activityId);
                });
            axios.all(deleteRequests).then(responses => {
                const responsesHandled = responses.map(r => handleResponse(r.status, r.data))
                const isSuccessAll = responsesHandled.every(r => r !== null);
                if (isSuccessAll) {
                    state.selectedRowKeys = [];
                    showToast('success', 'Xoá thành công');
                }
                handleTableChange(current.value);
            }).catch(err => {
                console.log('Có lỗi xảy ra khi xoá ', err)
                showToast('error', 'Có lỗi xảy ra khi xoá');
            })
        },
        onCancel() {
            console.log('Cancel');
        }
    });
};

const showActivityNews = activityId => {
    router.push(`/activity/edit/${activityId}`);
    resetDrawer();
}

const onShowSizeChange = (currentPage, size) => {
    current.value = currentPage;
    pageSize.value = size;
};

const getFilterQuery = () => {
    const filterByWord = filterForm.findByWord !== '' ? `&filters[search]=${filterForm.findByWord}` : '';
    const filterByStatus = filterForm.status !== '' ? `&filters[status]=${filterForm.status}` : '';
    const filterByCategory = filterForm.category !== 'all' ? `&filters[categories]=${filterForm.category}` : '';
    const filterByAuthor = filterForm.author.length ? `&filters[authors]=${filterForm.author.map(u => u.value).toString()}` : '';
    const filterByMine = filterForm.isMyNews ? `&filters[isMyNews]=${filterForm.isMyNews}` : '';
    const filterByHotNews = filterForm.isHotNews ? `&filters[isHotNews]=${filterForm.isHotNews}` : '';

    return `${filterByWord}${filterByStatus}${filterByCategory}${filterByAuthor}${filterByMine}${filterByHotNews}`;
};

const handleTableChange = page => {
    getTableData({
            targetPage: page,
            pageSize: pageSize.value,
            otherFilter: getFilterQuery()
        }
    );
};

const getTableData = (options) => {
    state.tableLoading = true;
    const {targetPage, pageSize, otherFilter} = options;

    getAll(targetPage, pageSize, otherFilter)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            state.visibleDrawer = false;
            state.tableLoading = false;
            responseData !== null
                ? (() => {
                    tableData.value = responseData.data.docs.map(n => {
                        return {
                            key: n.id,
                            id: n.id,
                            createdBy: n.createdBy,
                            status: n.status.toUpperCase(),
                            title: n.title,
                            description: n.description,
                            category: n.category,
                            keywords: n.keywords,
                            author: {
                                authorId: n.author._id,
                                name: n.author.fullName
                            },
                            isHotNews: n.isHotNews,
                            createdAt: dateTimeFormatString(n.createdAt)
                        }
                    });
                    total.value = responseData.data.total;
                    current.value = responseData.data.page;
                })()
                : tableData.value = [];
        }).catch((err) => {
        console.log('Lấy dữ liệu thất bại ', err)
        state.tableLoading = false;
    })
};

const onSelectChange = selectedKeys => {
    selectedRowKeys.value = selectedKeys;
};
</script>
