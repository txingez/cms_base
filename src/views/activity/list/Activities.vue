<template>
    <a-drawer :get-container="false"
              :visible="state.visibleDrawer"
              :width="500"
              placement="right"
              title="Tìm kiếm"
              @close="closeDrawer">
        <a-form :model="filterForm"
                layout="vertical" name="banner-filter-form">
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
            </a-row>
            <div class="flex justify-end space-x-2">
                <a-form-item>
                    <a-button key="reset" @click="resetDrawer">
                        Cài lại
                    </a-button>
                </a-form-item>
                <a-form-item>
                    <a-button key="find"
                              class="bg-[#1677ff]"
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
        <TitlePage label="Danh sách bài viết"/>
        <div class="flex justify-end space-x-2">
            <a-button v-if="selectedRowKeys.length !== 0"
                      key="deleteButton"
                      danger
                      @click="showConfirm">
                Xoá
            </a-button>
            <a-button key="openDrawer"
                      class="flex justify-center items-center"
                      @click="showDrawer">
                <search-outlined/>
                Tìm kiếm
            </a-button>
            <a-button key="openDrawer"
                      class="bg-[#1677ff] flex justify-center items-center"
                      type="primary"
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
                 :loading="state.tableLoading"
                 :pagination="false"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                 :scroll="{ x: 1300, y: 1000 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                    <a class="text-blue-400 hover:text-blue-500 hover:underline" @click="showActivityNews(record.id)">
                        {{ record.title }}
                    </a>
                </template>
                <template v-else-if="column.key === 'status'">
                    <div class="w-full">
                        <a-tag :color="colorByStatus[record.status]" class="text-sm">
                            {{ labelByStatus[record.status] }}
                        </a-tag>
                    </div>
                </template>
                <template v-else-if="column.key === 'category'">
                    <span>{{ handleCategory(record.category) }}</span>
                </template>
                <template v-else-if="column.key === 'image'">
                    <a-image :height="100" :src="record.image" :width="150" alt="image"/>
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
                          :show-total="t => `Total ${numberWithComma(t)} items`"
                          :total="total"
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
import {PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {handleResponse} from "../../../services/commonService";
import {useRouter} from "vue-router";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb.vue";
import {numberWithComma} from "../../../utils/formatNumber";
import axios from "axios";
import {showToast} from "../../../utils/showToast";
import {deletePost, getAll} from "../../../services/activity";
import TitlePage from "../../../components/TitlePage.vue";

const columns = [
    {title: 'Tiêu đề', dataIndex: 'title', key: 'title', fixed: 'left', width: 300, ellipsis: true},
    {title: 'Ngày đăng', dataIndex: 'release_date', key: 'release_date', width: 130},
    {title: 'Nguồn', dataIndex: 'source', key: 'source'},
    {title: 'Chuyên mục', dataIndex: 'category', key: 'category', width: 150},
    {title: 'Ảnh', dataIndex: 'image', key: 'image', width: 200},
    {title: 'Loại nội dung', dataIndex: 'content_type', key: 'content_type', width: 130},
    {title: 'Trạng thái', key: 'status', dataIndex: 'status', width: 130},
];

const optionsStatus = [
    {value: '', label: 'Tất cả'},
    {value: 'DRAFT', label: 'Tin đang soạn'},
    {value: 'PUBLISH', label: 'Tin đã đăng'}
];

const colorByStatus = {
    DRAFT: '#f87171',
    PUBLISH: '#22c55e',
    DISMISS: '#d1d5db'
};

const labelByStatus = {
    DRAFT: 'Tin đang soạn',
    PUBLISH: 'Tin đã đăng',
    DISMISS: 'Tin đã bị gỡ'
};

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Danh sách tin tức', to: '/activities'}
];

const optionsCategory = [
    {label: 'Thư viện', value: 'LIBRARY'},
    {label: 'Sự kiện', value: 'EVENT'},
    {label: 'Tin tức', value: 'NEWS'}
]

const router = useRouter();

const total = ref(1);
const current = ref(1);
const pageSize = ref(10);
const tableData = ref([]);
const selectedRowKeys = ref([]);

const state = reactive({
    tableLoading: false,
    loading: false,
    uploadLoading: false,
    visibleDrawer: false
});

const filterForm = reactive({
    findByWord: '',
    status: '',
    category: null
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

const resetDrawer = () => {
    filterForm.findByWord = '';
    filterForm.status = '';
    filterForm.category = null
};

const navigate = (target) => {
    resetDrawer();
    router.push(target);
}

const handleCategory = category => {
    switch (category) {
        case 'LIBRARY':
            return 'Thư viện'
        case 'EVENT':
            return 'Sự kiện'
        case 'NEWS':
            return 'Tin tức'
    }
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
                ? [deletePost(activityId)]
                : selectedRowKeys.value.map(activityId => {
                    return deletePost(activityId);
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
    return {
        ...(filterForm.findByWord.length !== 0 && {query: filterForm.findByWord}),
        ...(filterForm.status !== '' && {status: filterForm.status}),
        ...(filterForm.category && {category: filterForm.category})
    };
};

const handleTableChange = page => {
    console.log(page)
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

    const body = {
        limit: pageSize,
        offset: (targetPage - 1) * pageSize,
        additional_params: otherFilter
    }
    console.log(body)
    getAll(body)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            state.visibleDrawer = false;
            state.tableLoading = false;
            responseData !== null
                ? (() => {
                    tableData.value = responseData.data.results.map(n => {
                        return {
                            key: n.id,
                            id: n.id,
                            title: n.title,
                            source: n.source,
                            release_date: n.release_date,
                            image: n.image,
                            category: n.category,
                            content: n.content,
                            content_type: n.content_type,
                            page_id: n.page_id,
                            status: n.status
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
