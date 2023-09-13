<script setup>

import TitlePage from "../../components/TitlePage.vue";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {numberWithComma} from "../../utils/formatNumber";
import {resultStore} from "../../stores/resultStore";
import {getFormData} from "../../services/activity";
import {handleResponse} from "../../services/commonService";
import {Buffer} from "buffer";
import {useRouter} from "vue-router";

const result = resultStore()
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
    {title: 'Mã số thuế', key: 'taxCode', dataIndex: ['organizationProfile', 'taxCode'], width: 110},
    {title: 'Loại hình đăng ký', key: 'registrationType', dataIndex: ['organizationProfile', 'registrationType']},
    {title: 'Loại hình Doanh nghiệp', key: 'businessType', dataIndex: ['organizationProfile', 'businessType']},
    {title: 'Tổng điểm', key: 'totalPoint', dataIndex: ['result', 'total']},
    {title: 'Xếp hạng', key: 'rate', dataIndex: ['result', 'rate']},
    {title: 'Xem', key: 'view', width: 70}
];

const tableData = ref([])
const total = ref(1);
const current = ref(1);
const pageSizeState = ref(10);

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
        offset: targetPage - 1
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
    result.setData(data)
    router.push(`/result_detail/${data.key}`)
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <TitlePage label="Quản lý kết quả đánh giá"/>

    <div class="mt-5">
        <a-table :columns="columns"
                 :data-source="tableData"
                 :pagination="false"
                 :scroll="{ x: 1500, y: 1000 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'view'">
                    <div @click.prevent="showResult(record)" class="hover:cursor-pointer text-blue-500">
                        <font-awesome-icon icon="fa-solid fa-eye"/>
                    </div>
                </template>
            </template>
        </a-table>
        <div class="flex justify-end mt-2.5">
            <a-pagination v-model:current="current" v-model:pageSize="pageSizeState" :pageSizeOptions="['10', '20']"
                          :total="total" :show-total="t => `Total ${numberWithComma(t)} items`" show-size-changer
                          @change="handleTableChange" @showSizeChange="onShowSizeChange"/>
        </div>
    </div>
</template>
