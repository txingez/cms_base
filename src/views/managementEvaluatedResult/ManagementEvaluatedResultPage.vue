<script setup>

import TitlePage from "../../components/TitlePage.vue";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import { onMounted, ref } from "vue";
import { numberWithComma } from "../../utils/formatNumber";
import { getFormData } from "../../services/activity";
import { handleResponse } from "../../services/commonService";
import { Buffer } from "buffer";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { ENUM } from "../../constants/enum";
import * as XLSX from "xlsx";
import { showToast } from "../../utils/showToast";

const router = useRouter()

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý kết quả đánh giá', to: '/evaluated_result'}
];

const columns = [
  {title: 'STT', dataIndex: 'number', key: 'number', width: 60},
  {title: 'Họ và tên người đánh giá', key: 'fullNameEvaluated', dataIndex: ['organizationProfile', 'fullName']},
  {title: 'Ngày thực hiện đánh giá', dataIndex: ['organizationProfile', 'evaluatedDate'], key: 'evaluatedDate'},
  {title: 'Tên doanh nghiệp/tổ chức', key: 'companyName', dataIndex: ['organizationProfile', 'companyName']},
  {title: 'Mã số thuế', key: 'taxCode', dataIndex: ['organizationProfile', 'taxCode'], width: 120},
  {title: 'Loại hình đăng ký', key: 'registrationType', dataIndex: ['organizationProfile', 'registrationType']},
  {title: 'Loại hình Doanh nghiệp', key: 'businessType', dataIndex: ['organizationProfile', 'businessModel']},
  {title: 'Công cụ đánh giá', key: 'formId', dataIndex: 'formId'},
  {title: 'Tổng điểm', key: 'totalPoint', dataIndex: ['result', 'total'], width: 110},
  {title: 'Xếp hạng', key: 'rate', dataIndex: ['result', 'rate'], width: 100},
  {title: 'Xem', key: 'view', width: 70}
];

const tableData = ref([])
const total = ref(1);
const current = ref(1);
const pageSizeState = ref(10);
const exportLoading = ref(false);

onMounted(() => {
  handleTableChange(1)
});

const onShowSizeChange = (currentPage, size) => {
  current.value = currentPage;
  pageSizeState.value = size;
};

const handleTableChange = page => {
  getTableData({
    targetPage: page,
    pageSize: pageSizeState.value
  });
};

const getTableData = async (options) => {
  const {targetPage, pageSize} = options;
  const body = {
    limit: pageSize,
    offset: (targetPage - 1) * pageSize
  }

  getFormData(body)
      .then((response) => {
        const responseData = handleResponse(response.status, response.data);
        tableData.value = responseData.data.results.map((r, index) => {
          const formData = JSON.parse(Buffer.from(r.data.split('.')[1], 'base64').toString());
          return {
            ...formData.data,
            key: r.id,
            formId: r.form_id,
            number: (options.targetPage - 1) * pageSizeState.value + index + 1
          }
        });

        total.value = responseData.data.total;
        current.value = responseData.data.page;
      }).catch(error => {
    console.log(error)
    handleResponse(error.response.status, error.response.data);
    console.log('Lấy thông tin thất bại,', error);
  })
}

const showResult = data => {
  router.push(`/result_detail/${data.key}`)
}

const handleTime = (time, format) => {
  return dayjs(time).format(format)
}

const mappingToolkit = formId => {
  switch (formId) {
    case ENUM.FORM_ID.ESG:
      return ENUM.FORM_ID.ESG;
    case ENUM.FORM_ID.NEC:
      return 'CE'
  }
}

const exportFile = () => {
  exportLoading.value = true;
  getFormData({limit: 9999, offset: 0})
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        const rowsData = responseData.data.results.map((r, index) => {
          const formData = JSON.parse(Buffer.from(r.data.split('.')[1], 'base64').toString());
          console.log(formData.data.organizationProfile.startedESGYear)
          return {
            STT: index + 1,
            'Công cụ đánh giá': r.form_id,
            'Tên Công ty': formData.data.organizationProfile.companyName,
            'Địa chỉ': formData.data.organizationProfile.addressCompany,
            'Mã số thuế': formData.data.organizationProfile.taxCode,
            'Loại hình đăng ký': formData.data.organizationProfile.registrationType !== 'OTHER' ? formData.data.organizationProfile.registrationType : formData.data.organizationProfile.registrationTypeOtherInput,
            'Loại hình kinh doanh': formData.data.organizationProfile.businessModel !== 'OTHER' ? formData.data.organizationProfile.businessModel : formData.data.organizationProfile.businessModelOtherInput,
            'Năm thành lập': formData.data.organizationProfile.foundedYear,
            'Trụ sở chính': formData.data.organizationProfile.firstManufactureFactory,
            'Thời gian bắt đầu thực hiện ESG': formData.data.organizationProfile.startedESGYear ? handleTime(formData.data.organizationProfile.startedESGYear, 'DD-MM-YYYY') : '',
            'Website': formData.data.organizationProfile.websiteCompany,
            'Người thực hiện': formData.data.organizationProfile.fullName,
            'SĐT': formData.data.organizationProfile.phoneNumber,
            'EMAIL': formData.data.organizationProfile.email,
            'Chức vụ': formData.data.organizationProfile.workPlace,
            'Ngày đánh giá': handleTime(formData.data.organizationProfile.evaluatedDate, 'DD-MM-YYYY HH:mm:ss'),
            'Tên lãnh đạo': formData.data.organizationProfile.fullNameManager,
            'SĐT lãnh đạo': formData.data.organizationProfile.phoneNumberManager,
            'EMAIL lãnh đạo': formData.data.organizationProfile.emailManager,
            'Chức vụ lãnh đạo': formData.data.organizationProfile.workPlaceManager,
            'Tổng điểm': formData.data.result.total,
            'Xếp hạng': formData.data.result.rate
          }
        })

        const worksheet = XLSX.utils.json_to_sheet(rowsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
        XLSX.writeFile(workbook, "Evaluated_Results.xlsx", {compression: true});
      })
      .catch(err => {
        console.log(err)
        showToast('error', 'Trích xuất dữ liệu thất bại')
      })
      .finally(() => exportLoading.value = false)
}
</script>

<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <TitlePage label="Quản lý kết quả đánh giá"/>

  <a-button @click="exportFile" :loading="exportLoading">
    Xuất Excel
  </a-button>

  <div class="mt-5">
    <a-table :columns="columns"
             :data-source="tableData"
             :pagination="false"
             :scroll="{ x: 1500, y: 1000 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'view'">
          <div class="hover:cursor-pointer text-blue-500"
               @click.prevent="showResult(record)">
            <font-awesome-icon icon="fa-solid fa-eye"/>
          </div>
        </template>
        <template v-else-if="column.key === 'evaluatedDate'">
          <span>{{ handleTime(record.organizationProfile.evaluatedDate, 'DD-MM-YYYY HH:mm:ss') }}</span>
        </template>
        <template v-else-if="column.key === 'formId'">
          <span>{{ mappingToolkit(record.formId) }}</span>
        </template>
      </template>
    </a-table>
    <div class="flex justify-end mt-2.5">
      <a-pagination v-model:current="current" v-model:pageSize="pageSizeState" :pageSizeOptions="['10', '20']"
                    :show-total="t => `Total ${numberWithComma(t)} items`" :total="total" show-size-changer
                    @change="handleTableChange" @showSizeChange="onShowSizeChange"/>
    </div>
  </div>
</template>
