<template>
  <!--            Modal tạo-->
  <a-modal v-model:visible="visibleModal"
           width="600px"
           :mask-closable="false"
           :footer="null"
           @cancel="handleCancel"
           @ok="handleOk">
    <template #title>
      <span>{{ titleModal }}</span>
    </template>
    <!--        Form-->
    <a-form ref="formDataRef"
            name="form_data_category"
            layout="vertical"
            :model="formData"
            @finish="handleOk">
      <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
          <a-form-item label="Tên chuyên mục"
                       name="categoryName"
                       :rules="[{ required: true, message: 'Tên chuyên mục là bắt buộc.' }]">
            <a-input v-model:value="formData.categoryName"
                     :maxlength="255"
                     placeholder="Tên chuyên mục"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="Thứ tự hiển thị trên menu"
                       :rules="[{ required: true, message: 'Thứ tự hiển thị là bắt buộc' }]"
                       name="orderNo">
            <a-input v-model:value="formData.orderNo"
                     placeholder="1"/>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="Chuyên mục con"
                       name="isSubCategory">
            <a-checkbox v-model:checked="formData.isSubCategory"/>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-form-item label="Chuyên mục cha"
                       name="parentCategoryId"
                       :rules="[{required: formData.isSubCategory, message: 'Chuyên mục cha không được để trống' }]">
            <a-select ref="select"
                      v-model:value="formData.parentCategoryId"
                      allow-clear
                      show-search
                      placeholder="Chuyên mục cha"
                      :disabled="!formData.isSubCategory"
                      :options="optionsParentCategory"
                      :filter-option="filterOption"
                      @select="handleSelectParentCategory">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="Ẩn khỏi menu"
                       name="isHide">
            <a-checkbox v-model:checked="formData.isHide"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="Nơi đăng tin"
                       name="placeAppear"
                       :rules="[{required: true, message: 'Bạn phải chọn ít nhất một nơi đăng tin' }]">
            <a-select v-model:value="formData.placeAppear"
                      mode="multiple"
                      placeholder="Chọn nơi đăng tin"
                      :options="optsPlaceAppear"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider/>
      <div class="flex space-x-2 justify-end">
        <a-button key="back" @click="handleCancel">Huỷ</a-button>
        <a-form-item>
          <a-button key="submit"
                    class="bg-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:opacity-80 focus:bg-orange-500 focus:border-orange-500"
                    type="primary"
                    :loading="state.loading"
                    html-type="submit">Lưu
          </a-button>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
  <!--            Modal tạo-->

  <!--  Header Page-->
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <div class="flex justify-between">
    <div class="text-2xl font-bold">
      Danh sách chuyên mục
    </div>
    <div class="flex justify-end space-x-2">
      <a-button
          type="primary"
          @click="showCreateForm">
        <plus-outlined/>
        Tạo
      </a-button>
    </div>
  </div>
  <!--  End Header Page-->

  <!--  Table quản lý-->
  <div class="mt-5">
    <a-table :columns="columns"
             :data-source="tableData"
             :pagination="false"
             :expandRowByClick="true"
             :rowKey="record => record.id"
             :scroll="{ x: 1300, y: 1000 }">
      <!--      Inner Table-->
      <template #expandedRowRender="{record}">
        <a-table :columns="innerColumns"
                 :data-source="record.subCategories"
                 :show-header="false"
                 :rowKey="record => record.id"
                 :pagination="false">
          <template #bodyCell="{column, record}">
            <template v-if="column.key === 'isHide'">
              <a-checkbox v-model:checked="record.isHide" disabled/>
            </template>
            <template v-else-if="column.key === 'placeAppear'">
              <div class="flex flex-row">
                <a-tag v-for="place in record.placeAppear"
                       :key="place"
                       color="#fb923c">
                  {{ getLabelPlaceAppear(place) }}
                </a-tag>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <span @click="showEditForm(record)">
                <a>Sửa</a>
              </span>
              <a-divider type="vertical"/>
              <span @click="showConfirmDelete(record.id)">
                <a>Xoá</a>
              </span>
            </template>
          </template>
          <template #emptyText>
            <div>Không có chuyên mục con</div>
          </template>
        </a-table>
      </template>
      <!--      Inner Table-->

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isHide'">
          <a-checkbox v-model:checked="record.isHide" disabled/>
        </template>
        <template v-else-if="column.key === 'placeAppear'">
          <div class="flex flex-row">
            <a-tag v-for="place in record.placeAppear"
                   :key="place"
                   color="#fb923c">
              {{ getLabelPlaceAppear(place) }}
            </a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <span @click="showEditForm(record)">
                <a>Sửa</a>
              </span>
          <a-divider type="vertical"/>
          <span @click="showConfirmDelete(record.id)">
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
  <!--  Table quản lý-->
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {createVNode, onMounted, ref} from "vue";
import {Modal} from "ant-design-vue";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getLastIndexOrderNo,
  updateCategory
} from "../../services/category";
import {handleResponse} from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {numberWithComma} from "../../utils/formatNumber";
import {showToast} from "../../utils/showToast";

const columns = [
  {title: 'Chuyên mục', dataIndex: 'categoryName', key: 'categoryName', width: 200},
  {title: 'Thứ tự hiển thị', dataIndex: 'orderNo', key: 'orderNo', width: 130},
  {title: 'Ẩn khỏi menu?', key: 'isHide', dataIndex: 'isHide', width: 130},
  {title: 'Nơi hiển thị', key: 'placeAppear', dataIndex: 'placeAppear'},
  {title: 'Người tạo', key: 'createdBy', dataIndex: 'createdBy', width: 250},
  {title: 'Thao tác', key: 'action', width: 110}
];

const innerColumns = [
  {title: 'Chuyên mục con', dataIndex: 'categoryName', key: 'categoryName', width: 200},
  {title: 'Thứ tự hiển thị', dataIndex: 'orderNo', key: 'orderNo', width: 130},
  {title: 'Ẩn khỏi menu?', key: 'isHide', dataIndex: 'isHide', width: 130},
  {title: 'Nơi hiển thị', key: 'placeAppear', dataIndex: 'placeAppear'},
  {title: 'Người tạo', key: 'createdBy', dataIndex: 'createdBy', width: 250},
  {title: 'Thao tác', key: 'action', width: 110}
];

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý chuyên mục', to: '/category'}
];

const optsPlaceAppear = [
  {label: 'Tin tức', value: 'news'},
  {label: 'Tin văn hoá', value: 'culturalNews'},
  {label: 'Thông điệp ban lãnh đạo', value: 'conveyLeadership'}
];

const state = reactive({
  loading: false,
  uploadLoading: false
});

const formData = reactive({
  id: '0',
  categoryName: '',
  isSubCategory: false,
  parentCategoryId: null,
  orderNo: '',
  isHide: false,
  placeAppear: ['news']
});

const tableData = ref([]);
const titleModal = ref('');
const visibleModal = ref(false);
const optionsParentCategory = ref([]);
const isEdit = ref(false);
const total = ref(1);
const current = ref(1);
const pageSize = ref(10);

onMounted(() => {
  handleTableChange(1)
});

const getLabelPlaceAppear = placeValue => {
  const placeAppearOpt = optsPlaceAppear.find(opt => opt.value === placeValue);
  return placeAppearOpt.label;
};

const showCreateForm = () => {
  visibleModal.value = true;
  titleModal.value = 'Tạo chuyên mục';
  getBiggestOrderNo();
  getTableData({targetPage: 1, pageSize: 1000, isShowForm: true});
};

const handleSelectParentCategory = () => {
  getBiggestOrderNo(formData.parentCategoryId);
};

const getBiggestOrderNo = (parentCategoryId) => {
  getLastIndexOrderNo(parentCategoryId)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        formData.orderNo = responseData && responseData.data ? responseData.data.orderNo + 1 : 1;
      });
};

const showEditForm = (record) => {
  getTableData({targetPage: 1, pageSize: 1000, isShowForm: true});
  getCategory(record.id)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          formData.id = responseData.data._id;
          formData.categoryName = responseData.data.name;
          formData.orderNo = responseData.data.orderNo;
          formData.isSubCategory = responseData.data.isSubCategory;
          formData.parentCategoryId = responseData.data.isSubCategory ? responseData.data.parentCategory._id : null;
          formData.isHide = responseData.data.isHide;
          formData.placeAppear = responseData.data.placeAppear;

          visibleModal.value = true;
          titleModal.value = 'Chỉnh sửa chuyên mục';

          isEdit.value = true;
        }
      });
}

const handleOk = () => {
  state.loading = true;

  const body = {
    name: formData.categoryName,
    orderNo: parseInt(formData.orderNo),
    isSubCategory: formData.isSubCategory,
    ...(formData.isSubCategory && {parentCategory: formData.parentCategoryId}),
    isHide: formData.isHide,
    placeAppear: formData.placeAppear
  };

  const request = isEdit.value ? updateCategory(formData.id, body) : createCategory(body);
  request.then(response => {
    const responseData = handleResponse(response.status, response.data);
    state.loading = false;
    if (responseData) {
      handleTableChange(1);
      resetModal();
    }
  }).catch(error => {
    console.log('Lưu/chỉnh sửa category thất bại ', error);
    state.loading = false;
    showToast('error', `${isEdit.value ? 'Chỉnh sửa chuyên mục thất bại' : 'Tạo mới chuyên mục thất bại'}`)
  })
};

const handleCancel = () => {
  resetModal();
};

const resetModal = () => {
  visibleModal.value = false;
  isEdit.value = false;
  optionsParentCategory.value = [];

  formData.id = '';
  formData.categoryName = '';
  formData.isSubCategory = false;
  formData.parentCategoryId = null;
  formData.orderNo = '';
  formData.isHide = false;
  formData.placeAppear = ['news'];
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const showConfirmDelete = (categoryId) => {
  Modal.confirm({
    title: 'Bạn thực sự muốn xoá chuyên mục này?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', null, 'Bạn có chắc bạn muốn xóa nội dung này?'),
    okText: 'Xoá',
    okType: 'danger',
    cancelText: 'Huỷ',
    onOk() {
      deleteCategory(categoryId)
          .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
              visibleModal.value = false;
              handleTableChange(1);
            }
          });
    },
    onCancel() {
      console.log('Cancel');
    }
  });
};

const onShowSizeChange = (currentPage, size) => {
  current.value = currentPage;
  pageSize.value = size;
};

const handleTableChange = (page) => {
  getTableData({
    targetPage: page,
    pageSize: pageSize.value
  });
}

const getTableData = (options) => {
  const {targetPage, pageSize, isShowForm} = options;

  getCategories(targetPage, pageSize)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);

        if (isShowForm) {
          return responseData !== null
              ? optionsParentCategory.value = responseData.data.docs.map(c => ({label: c.name, value: c._id}))
              : optionsParentCategory.value = [];
        }

        return responseData !== null
            ? (() => {
              tableData.value = responseData.data.docs.map(c => {
                return {
                  id: c._id,
                  categoryName: c.name,
                  isSubCategory: c.isSubCategory,
                  createdBy: c.createdBy,
                  orderNo: c.orderNo,
                  isHide: c.isHide,
                  placeAppear: c.placeAppear,
                  subCategories: c.subCategories.sort((a, b) => a.orderNo - b.orderNo).map(sc => {
                    return {
                      key: sc._id,
                      id: sc._id,
                      categoryName: sc.name,
                      isSubCategory: sc.isSubCategory,
                      createdBy: sc.createdBy,
                      orderNo: sc.orderNo,
                      isHide: sc.isHide,
                      placeAppear: sc.placeAppear,
                    }
                  })
                }
              });
              total.value = responseData.data.totalDocs;
              current.value = responseData.data.page;
            })()
            : tableData.value = [];
      });
};
</script>
