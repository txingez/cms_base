<script setup>

import TittlePage from "../../components/TittlePage.vue";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {numberWithComma} from "../../utils/formatNumber";
import EvaluatedResultModal from "../../components/modals/EvaluatedResultModal.vue";
import {resultModalStore} from "../../stores/resultModalStore";

const resultModal = resultModalStore()

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
    {title: 'Xếp hạng sao', key: 'rate', dataIndex: ['result', 'rate']},
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

const getTableData = options => {
    tableData.value = sampleResponse.data.results.map((r, index) => {
            return {
                ...r,
                key: r.id,
                number: (options.targetPage - 1) * pageSizeState.value + index + 1
                // fullNameEvaluated: r.organizationProfile.fullName,
                // evaluatedDate: r.organizationProfile.evaluatedDate,
                // companyName: r.organizationProfile.companyName,
                // taxCode: r.organizationProfile.taxCode,
                // registrationType: r.organizationProfile.registrationType,
                // businessType: r.organizationProfile.businessType,
                // totalPoint: r.result.total,
                // rate: r.result.rate
            }
        }
    )

    console.log(tableData.value)
    total.value = sampleResponse.data.total
    current.value = sampleResponse.data.page
    // const {targetPage, pageSize} = options;

    // getAll(targetPage, pageSize)
    //     .then(response => {
    //         const responseData = handleResponse(response.status, response.data);
    //         return responseData !== null
    //             ? (() => {
    //                 tableData.value = responseData.data.results.map((c, index) => {
    //                     return {
    //                         key: c.id,
    //                         number: (pageSizeState.value - 1) * targetPage + index + 1,
    //                         id: c.id,
    //                         fullName: `${c.lastName} ${c.firstName}`,
    //                         email: c.email,
    //                         phoneNumber: c.phoneNumber,
    //                         message: c.message,
    //                         createdAt: dateTimeFormatString(c.createdAt)
    //                     }
    //                 });
    //
    //                 total.value = responseData.data.total;
    //                 current.value = responseData.data.page;
    //             })()
    //             : tableData.value = [];
    //     })
    //     .catch(error => {
    //         console.log('Lỗi khi lấy danh sách tin nhắn,', error);
    //         showToast('error', 'Lấy danh sách thất bại');
    //     });
}

const sampleResponse = {
    status: 200,
    message: 'success',
    data: {
        total: 1,
        page: 1,
        results: [
            {
                id: 1,
                organizationProfile: {
                    companyName: 'Cong ty ABC',
                    taxCode: '123456789',
                    foundedYear: '2000',
                    registrationType: 'Doanh nghiệp tư nhân',
                    businessType: 'Doanh nghiệp không niêm yết',
                    fullTimeEmployees: '1000',
                    femaleFullTimeEmployees: '500',
                    partTimeEmployees: '200',
                    femalePartTimeEmployees: '50',
                    seasonalEmployees: '100',
                    femaleSeasonalEmployees: '70',
                    numberManagers: '100',
                    numberFemaleManagers: '30',
                    equalFifteenAndUnderEighteenEmployees: '0',
                    b6Value: 'Có',
                    b7Value: 'Có',
                    businessModel: 'Sản xuất năng lượng khác',
                    startedESGYear: '2020',
                    websiteCompany: 'https://website.com',
                    fullNameManager: 'DO VAN A',
                    sexManager: 'male',
                    nationManager: 'Kinh',
                    workPlaceManager: 'Tong giam doc',
                    emailManager: 'email@email.com',
                    phoneNumberManager: '0987654321',
                    evaluatedDate: '30/08/2023',
                    fullName: 'TRAN VAN B',
                    workPlace: 'Truong phong',
                    workUnit: 'Phong ke hoach',
                    email: 'abc@email.com',
                    phoneNumber: '0981234567'
                },
                answers: [
                    {key: 'E1', answer: 'B'},
                    {key: 'E2', answer: 'B'},
                    {key: 'E3', answer: 'B'},
                    {key: 'E4', answer: 'B'},
                    {key: 'E5', answer: 'B'},
                    {key: 'E6', answer: 'B'},
                    {key: 'E7', answer: 'B'},
                    {key: 'E8', answer: 'B'},
                    {key: 'E9', answer: 'B'},
                    {key: 'E10', answer: 'B'},
                    {key: 'E11', answer: 'B'},
                    {key: 'E12', answer: 'B'},
                    {key: 'E13', answer: 'B'},
                    {key: 'E14', answer: 'B'},
                    {key: 'E15', answer: 'B'},
                    {key: 'E16', answer: 'B'},
                    {key: 'S1', answer: 'B'},
                    {key: 'S2', answer: 'B'},
                    {key: 'S3', answer: 'B'},
                    {key: 'S4', answer: 'B'},
                    {key: 'S5', answer: 'B'},
                    {key: 'S6', answer: 'B'},
                    {key: 'S7', answer: 'B'},
                    {key: 'S8', answer: 'B'},
                    {key: 'S9', answer: 'B'},
                    {key: 'S10', answer: 'B'},
                    {key: 'S11', answer: 'B'},
                    {key: 'S12', answer: 'B'},
                    {key: 'S13', answer: 'B'},
                    {key: 'S14', answer: 'B'},
                    {key: 'S15', answer: 'B'},
                    {key: 'S16', answer: 'B'},
                    {key: 'S17', answer: 'B'},
                    {key: 'S18', answer: 'B'},
                    {key: 'S19', answer: 'B'},
                    {key: 'S20', answer: 'B'},
                    {key: 'S21', answer: 'B'},
                    {key: 'S22', answer: 'B'},
                    {key: 'S23', answer: 'B'},
                    {key: 'S24', answer: 'B'},
                    {key: 'S25', answer: 'B'},
                    {key: 'S26', answer: 'B'},
                    {key: 'S27', answer: 'B'},
                    {key: 'S28', answer: 'B'},
                    {key: 'S29', answer: 'B'},
                    {key: 'S30', answer: 'B'},
                    {key: 'S31', answer: 'B'},
                    {key: 'G1', answer: 'B'},
                    {key: 'G2', answer: 'B'},
                    {key: 'G3', answer: 'B'},
                    {key: 'G4', answer: 'B'},
                    {key: 'G5', answer: 'B'},
                    {key: 'G6', answer: 'B'},
                    {key: 'G7', answer: 'B'},
                    {key: 'G8', answer: 'B'},
                    {key: 'G9', answer: 'B'},
                    {key: 'G10', answer: 'B'},
                    {key: 'G11', answer: 'B'},
                    {key: 'G12', answer: 'B'},
                    {key: 'G13', answer: 'B'},
                    {key: 'G14', answer: 'B'},
                    {key: 'G15', answer: 'B'},
                    {key: 'G16', answer: 'B'}
                ],
                result: {
                    environment: {
                        point: 25,
                        distribution: 50
                    },
                    social: {
                        point: 30,
                        distribution: 25
                    },
                    governance: {
                        point: 35,
                        distribution: 25
                    },
                    total: 48,
                    rate: 1
                }
            }
        ]
    }
}

const showResult = result => {
    resultModal.show()
    resultModal.setData(result)
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <TittlePage label="Quản lý kết quả đánh giá"/>

    <div class="mt-5">
        <a-table :columns="columns"
                 :data-source="tableData"
                 :pagination="false"
                 :scroll="{ x: 500, y: 700 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'view'">
                    <div @click.prevent="showResult(record)">
                        <font-awesome-icon icon="fa-solid fa-eye"/>
                    </div>
                </template>
                <template v-else-if="column.key === 'rate'">
                    <a-rate :value="record.result.rate" allow-half :count="3"></a-rate>
                </template>
            </template>
        </a-table>
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

    <EvaluatedResultModal/>
</template>
