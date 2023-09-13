<template>
  <!--  Header Page-->
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <TitlePage label="Quản lý tin nhắn"/>
  <!--  End Header Page-->

  <!--  Table quản lý-->
    <div class="mt-5">
        <a-table :columns="columns"
                 :data-source="tableData"
                 :pagination="false"
                 :scroll="{ x: 500, y: 700 }"/>
        <div class="flex justify-end mt-2.5">
            <a-pagination v-model:current="current"
                          v-model:pageSize="pageSizeState"
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
import {onMounted, ref} from "vue";
import {handleResponse} from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {numberWithComma} from "../../utils/formatNumber";
import {dateTimeFormatString} from "../../utils/reformatTime";
import {showToast} from "../../utils/showToast";
import TitlePage from "../../components/TitlePage.vue";
import {getAll} from "../../services/message";

const columns = [
    {title: 'STT', dataIndex: 'number', key: 'number'},
    {title: 'Họ tên', key: 'fullName', dataIndex: 'fullName'},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'SĐT', key: 'phoneNumber', dataIndex: 'phoneNumber'},
    {title: 'Tin nhắn', key: 'message', dataIndex: 'message'},
    {title: 'Thao tác', key: 'action'}
];

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý tin nhắn', to: '/message'}
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
    const {targetPage, pageSize} = options;

    getAll(targetPage, pageSize)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            return responseData !== null
                ? (() => {
                    tableData.value = responseData.data.messages.map((c, index) => {
                        return {
                            key: c.id,
                            number: (targetPage - 1) * pageSize + index + 1,
                            id: c.id,
                            fullName: `${c.lastName} ${c.firstName}`,
                            email: c.email,
                            phoneNumber: c.phoneNumber,
                            message: c.message,
                            createdAt: dateTimeFormatString(c.createdAt)
                        }
                    });

                    total.value = responseData.data.total;
                    current.value = responseData.data.page;
                })()
                : tableData.value = [];
        })
        .catch(error => {
            console.log('Lỗi khi lấy danh sách tin nhắn,', error);
            showToast('error', 'Lấy danh sách thất bại');
        });
}
</script>
