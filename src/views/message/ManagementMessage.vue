<script setup>
import { reactive } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import { handleResponse } from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import { numberWithComma } from "../../utils/formatNumber";
import { dateTimeFormatString } from "../../utils/reformatTime";
import { showToast } from "../../utils/showToast";
import TitlePage from "../../components/TitlePage.vue";
import { getAll } from "../../services/message";
import {ModalInfo} from "../../components/ModalInfo"


const columns = [
    { title: 'STT', dataIndex: 'number', key: 'number', width: 70, align: 'center' },
    { title: 'Họ tên', key: 'fullName', dataIndex: 'fullName', width: 180, align: 'center' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200, align: 'center' },
    { title: 'SĐT', key: 'phoneNumber', dataIndex: 'phoneNumber', width: 100, align: 'center' },
    { title: 'Ngày tạo', key: 'createdAt', dataIndex: 'createdAt', width: 100, align: 'center' },
    { title: 'Xem nội dung', key: 'view', width: 80, align: 'center' }
];

const routes = [
    { name: 'Home', to: '/' },
    { name: 'Quản lý tin nhắn', to: '/message' }
];

const state = reactive({
    loading: false
})

const tableData = ref([]);
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

const getTableData = options => {
    const { targetPage, pageSize } = options;

    getAll(pageSize, (targetPage - 1) * pageSize)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            return responseData.data.results.length > 0
                ? (() => {
                    tableData.value = responseData.data.results.map((c, index) => {
                        return {
                            key: c.id,
                            number: (targetPage - 1) * pageSize + index + 1,
                            id: c.id,
                            fullName: `${c.full_name}`,
                            email: c.email,
                            phoneNumber: c.phone_number,
                            message: c.message,
                            createdAt: dateTimeFormatString(c.created_at)
                        }
                    });

                    total.value = responseData.data.total;
                    current.value = responseData.data.page;
                })()
                : tableData.value = [];
        })
        .catch(error => {
            handleResponse(error.response.status, error.response.data)
            console.log('Lỗi khi lấy danh sách tin nhắn,', error);
            showToast('error', 'Lấy danh sách thất bại');
        });
}

const showResult = (value) => {
    ModalInfo("Nội dung tin nhắn", value.message)
}
</script>
<template>
    <!--  Header Page-->
    <div class="mb-5">
        <BreadCrumb :routes="routes" />
    </div>
    <TitlePage label="Quản lý tin nhắn" />
    <!--  End Header Page-->

    <!--  Table quản lý-->
    <div class="mt-5">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ x: 500, y: 700 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'view'">
                    <div class="hover:cursor-pointer text-blue-500" @click.prevent="showResult(record)">
                        <font-awesome-icon icon="fa-solid fa-eye"/>
                    </div>
                </template>
            </template>
        </a-table>
        <div class="flex justify-end mt-2.5">
            <a-pagination v-model:current="current" v-model:pageSize="pageSizeState" :pageSizeOptions="['10', '20']"
                :show-total="t => `Total ${numberWithComma(t)} items`" :total="total" show-size-changer
                @change="handleTableChange" @showSizeChange="onShowSizeChange" />
        </div>
    </div>
    <!--  Table quản lý-->
</template>
