<script setup>
defineProps({
    organizationProfile: {}
})
</script>

<template>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tên doanh nghiệp/tổ chức:</div>
                <div class="font-bold">{{ organizationProfile.companyName }}</div>
            </div>
        </a-col>
        <a-col :md="6" :xs="24">
            <div class="flex gap-2">
                <div>Năm thành lập:</div>
                <div class="font-bold">{{ organizationProfile.foundedYear }}</div>
            </div>
        </a-col>
        <a-col :md="6" :xs="24">
            <div class="flex gap-2">
                <div>Mã số thuế:</div>
                <div class="font-bold">{{ organizationProfile.taxCode }}</div>
            </div>
        </a-col>
    </a-row>

    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Loại hình đăng ký:</div>
                <div class="font-bold">{{ organizationProfile.registrationType }}</div>
            </div>
        </a-col>
    </a-row>

    <div class="font-bold text-lg">
        Thông tin về tổng số lực lượng lao động (bao gồm cả Hợp đồng (HĐ) thử việc, HĐ thời vụ, HĐ có thời hạn và HĐ
        không xác định thời hạn...)
    </div>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số nhân viên (có đóng bảo hiểm xã hội):</div>
                <div class="font-bold">{{ organizationProfile.insuranceEmployees }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số nhân viên (có đóng bảo hiểm xã hội) là nữ:</div>
                <div class="font-bold">{{ organizationProfile.femaleInsuranceEmployees }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số cán bộ cấp cao (từ cấp phó trưởng phòng/phó trưởng ban trở lên):</div>
                <div class="font-bold">{{ organizationProfile.numberManagers }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số cán bộ cấp cao là nữ:</div>
                <div class="font-bold">{{ organizationProfile.numberFemaleManagers }}</div>
            </div>
        </a-col>
    </a-row>
    <div class="flex gap-2">
        <div>Tổng số lao động vị thành niên (nếu có) - từ đủ 15 tuối đến dưới 18 tuổi:</div>
        <div class="font-bold">
            {{ organizationProfile.equalFifteenAndUnderEighteenEmployees }}
        </div>
    </div>
    <div class="flex gap-2">
        <div>Doanh nghiệp thuộc Lĩnh vực kinh doanh nào:</div>
        <div class="font-bold">
            {{
            organizationProfile.businessModel === 'other' ? organizationProfile.businessModelOtherInput : organizationProfile.businessModel
            }}
        </div>
    </div>
    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Địa chỉ trụ sở đăng ký kinh doanh của doanh nghiệp:</div>
                <div class="font-bold">{{ organizationProfile.address }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Địa chỉ cơ sở sản xuất chính của doanh nghiệp:</div>
                <div class="font-bold">{{ organizationProfile.manufactureAddress }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Các địa chỉ cơ sở sản xuất khác của doanh nghiệp (nếu có):</div>
                <div class="font-bold">{{
                    organizationProfile.otherManufactureAddress ? organizationProfile.otherManufactureAddress : '-'
                    }}
                </div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Địa chỉ website:</div>
                <div class="font-bold">{{ organizationProfile.websiteCompany }}</div>
            </div>
        </a-col>
    </a-row>
</template>
