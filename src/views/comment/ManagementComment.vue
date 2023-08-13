<template>
  <a-drawer title="Tìm kiếm"
            placement="right"
            :visible="state.visibleDrawer"
            :get-container="false"
            @close="closeDrawer">
    <a-form name="category-filter-form"
            :model="filterForm" layout="vertical">
      <a-row :gutter="[10, 10]">
        <a-col :span="24">
          <a-form-item label="Tìm kiếm"
                       name="findByWord">
            <a-input v-model:value="filterForm.findByWord"
                     placeholder="Nhập từ khoá để tìm kiếm"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Ngày đăng"
                       name="status">
            <a-range-picker class="w-full"
                            v-model:value="filterForm.createdDateRange"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Nguời đăng"
                       name="createdBy">
            <a-select v-model:value="filterForm.createdBy"
                      mode="multiple"
                      label-in-value
                      placeholder="Chọn người đăng"
                      :filter-option="false"
                      :not-found-content="state.fetching ? undefined : null"
                      :options="state.users"
                      @search="fetchUsers">
              <template v-if="state.fetching" #notFoundContent>
                <a-spin size="small"/>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="flex space-x-2 justify-end">
        <a-form-item>
          <a-button key="reset" @click="reset">
            Cài lại
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button key="find"
                    type="primary"
                    @click="handleTableChange(1)"
                    class="bg-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:opacity-80 focus:bg-orange-500 focus:border-orange-500">
            Tìm kiếm
          </a-button>
        </a-form-item>
      </div>
    </a-form>
  </a-drawer>

  <!--  Header Page-->
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <div class="flex justify-between">
    <div class="text-2xl font-bold">
      Danh sách bình luận
    </div>
    <div class="flex justify-end space-x-2">
      <a-button key="deleteButton"
                v-if="selectedRowKeys.length !== 0"
                danger
                @click="showConfirmDelete">
        Xoá
      </a-button>
      <a-button key="openDrawer"
                @click="showDrawer">
        <search-outlined/>
        Tìm kiếm
      </a-button>
    </div>
  </div>
  <!--  End Header Page-->

  <!--  Table quản lý-->
  <div class="mt-5">
    <a-table :columns="columns"
             :data-source="tableData"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
             :pagination="false"
             :scroll="{ x: 500, y: 700 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span @click="showConfirmDelete(record.id)">
            <a>Xoá</a>
          </span>
        </template>
        <template v-else-if="column.key === 'news'">
          <router-link :to="`/news/editor/${record.news.id}`">
            {{ record.news.title }}
          </router-link>
        </template>
        <template v-else-if="column.key === 'user'">
          <span>{{ record.createdBy.email }}</span>
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
  <!--  Table quản lý-->
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {createVNode, onMounted, ref} from "vue";
import {Modal} from "ant-design-vue";
import {ExclamationCircleOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {handleResponse} from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {deleteComment, getComments} from "../../services/comment";
import {numberWithComma} from "../../utils/formatNumber";
import {debounce} from "lodash-es";
import {getUsers} from "../../services/user";
import {dateTimeFormatString} from "../../utils/reformatTime";
import axios from "axios";
import {showToast} from "../../utils/showToast";

const columns = [
  {title: 'Tiêu đề tin tức', dataIndex: 'news', key: 'news'},
  {title: 'Ngày đăng', key: 'createdAt', dataIndex: 'createdAt'},
  {title: 'Người đăng bình luận', dataIndex: 'user', key: 'user'},
  {title: 'Nội dung bình luận', key: 'content', dataIndex: 'content'},
  {title: 'Thao tác', key: 'action'}
];

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý bình luận', to: '/comment'}
];

const state = reactive({
  loading: false,
  visibleDrawer: false,
  users: [],
  fetching: false
})

const filterForm = reactive({
  createdBy: [],
  findByWord: '',
  createdDateRange: []
});

const tableData = ref([]);
const total = ref(1);
const current = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref([]);

onMounted(() => {
  handleTableChange(1)
});

const showDrawer = () => {
  state.visibleDrawer = true;
};

const closeDrawer = () => {
  state.visibleDrawer = false;
};

const fetchUsers = debounce(value => {
  state.fetching = true;
  getUsers(1, 500, `&filters[search]=${value}`)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        state.fetching = false;
        if (responseData) {
          state.users = responseData.data.users.map(u => {
            return {
              value: u._id,
              label: u.fullName
            }
          })
        }
      });
}, 500);

const showConfirmDelete = commentId => {
  Modal.confirm({
    title: 'Xoá bình luận',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', null, 'Bạn có chắc bạn muốn xóa nội dung này?'),
    okText: 'Xoá',
    okType: 'danger',
    cancelText: 'Huỷ',
    onOk() {
      const requests = typeof commentId === 'string'
          ? [deleteComment(commentId)]
          : selectedRowKeys.value.map(id => {
            return deleteComment(id);
          });
      axios.all(requests)
          .then(responses => {
            const responseData = responses.map(r => handleResponse(r.status, r.data));
            const isSuccessAll = responseData.every(r => r !== null);
            if (isSuccessAll) {
              state.selectedRowKeys = [];
              handleTableChange(current.value);
            }
          })
          .catch(error => {
            console.log('Xoá bình luận có lỗi,', error);
            showToast('error', 'Xoá bình luận thất bại');
          })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

const reset = () => {
  filterForm.createdBy = [];
  filterForm.findByWord = '';
  filterForm.createdDateRange = [];
};

const onShowSizeChange = (currentPage, size) => {
  current.value = currentPage;
  pageSize.value = size;
};

const getFilterQuery = () => {
  const filterByWord = filterForm.findByWord !== '' ? `&filters[search]=${filterForm.findByWord}` : '';
  const filterCreatedBy = filterForm.createdBy.length ? `&filters[author]=${filterForm.createdBy.map(u => u.value).toString()}` : '';
  const filterByCreatedAtFrom = filterForm.createdDateRange.length ? `&filters[date][from]=${filterForm.createdDateRange[0].format('YYYY-MM-DD')}` : '';
  const filterByCreatedAtTo = filterForm.createdDateRange.length ? `&filters[date][to]=${filterForm.createdDateRange[1].format('YYYY-MM-DD')}` : '';

  return `${filterByWord}${filterCreatedBy}${filterByCreatedAtFrom}${filterByCreatedAtTo}`;
};

const onSelectChange = selectedKeys => {
  selectedRowKeys.value = selectedKeys;
};

const handleTableChange = (page) => {
  getTableData({
    targetPage: page,
    pageSize: pageSize.value,
    otherFilter: getFilterQuery()
  });
};

const getTableData = (options) => {
  const {targetPage, pageSize, otherFilter} = options;

  getComments(targetPage, pageSize, otherFilter ? otherFilter : '')
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        return responseData !== null
            ? (() => {
              tableData.value = responseData.data.docs.map(c => {
                return {
                  key: c._id,
                  id: c._id,
                  createdBy: {
                    id: c.user._id,
                    email: c.user.email
                  },
                  news: {
                    id: c.news._id,
                    title: c.news.title
                  },
                  content: c.content,
                  createdAt: dateTimeFormatString(c.createdAt)
                }
              });

              total.value = responseData.data.totalDocs;
              current.value = responseData.data.page;
            })()
            : tableData.value = [];
      })
      .catch(error => {
        console.log('Lỗi khi lấy danh sách bình luận,', error);
        showToast('error', 'Lấy danh sách bình luận thất bại');
      });
}
</script>
