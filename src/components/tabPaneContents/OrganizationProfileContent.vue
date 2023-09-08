<script setup>
defineProps({
    profileData: {}
})
</script>

<template>
    <div class="flex flex-col gap-3">
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Tên doanh nghiệp/tổ chức:</div>
                    <div class="font-bold">{{ profileData.companyName }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="6">
                <div class="flex gap-2">
                    <div>Năm thành lập:</div>
                    <div class="font-bold">{{ profileData.foundedYear }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="6">
                <div class="flex gap-2">
                    <div>Mã số thuế:</div>
                    <div class="font-bold">{{ profileData.taxCode }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Loại hình đăng ký:</div>
                    <div class="font-bold">{{ profileData.registrationType }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Loại hình Doanh nghiệp:</div>
                    <div class="font-bold">{{ profileData.businessType }}</div>
                </div>
            </a-col>
        </a-row>

        <div class="font-bold text-lg">Thông tin lao động</div>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Tổng số nhân viên toàn thời gian:</div>
                    <div class="font-bold">{{ profileData.fullTimeEmployees }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>trong đó: tổng số nhân viên nữ:</div>
                    <div class="font-bold">{{ profileData.femaleFullTimeEmployees }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Tổng số nhân viên bán thời gian:</div>
                    <div class="font-bold">{{ profileData.partTimeEmployees }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>trong đó: tổng số nhân viên nữ:</div>
                    <div class="font-bold">{{ profileData.femalePartTimeEmployees }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Tổng số nhân viên thời vụ:</div>
                    <div class="font-bold">{{ profileData.seasonalEmployees }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>trong đó: tổng số nhân viên nữ:</div>
                    <div class="font-bold">{{ profileData.femaleSeasonalEmployees }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Tổng số cán bộ cấp quản lý (từ trưởng phòng trở lên):</div>
                    <div class="font-bold">{{ profileData.numberManagers }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>trong đó: Tổng số cán bộ cấp quản lý là nữ:</div>
                    <div class="font-bold">{{ profileData.numberFemaleManagers }}</div>
                </div>
            </a-col>
        </a-row>
        <div class="flex gap-2">
            <div>Tổng số lao động vị thành niên (nếu có) - từ đủ 15 tuối đến dưới 18 tuổi:</div>
            <div class="font-bold">
                {{ profileData.equalFifteenAndUnderEighteenEmployees }}
            </div>
        </div>
        <div class="flex gap-1">
            <div class="text-left">
                Doanh nghiệp có phải là doanh nghiệp do phụ nữ làm chủ không (có một hoặc nhiều phụ nữ sở hữu
                từ 51% vốn điều lệ trở lên, trong đó có ít nhất một người cấp quản lý điều hành doanh nghiệp)?
            </div>
            <div class="font-bold">{{ profileData.b6Value }}</div>
        </div>
        <div class="flex gap-2">
            <div>
                Doanh nghiệp có phải là doanh nghiệp do phụ nữ điều hành (vị trí giám đốc, tổng giám đốc, chủ
                tịch Hội Đồng Quản Trị) không?
            </div>
            <div class="font-bold">{{ profileData.b7Value }}</div>
        </div>
        <div class="flex gap-2">
            <div>Mô hình kinh doanh thuộc Lĩnh vực kinh doanh nào:</div>
            <div class="font-bold">{{ profileData.businessModel }}</div>
        </div>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Năm bắt đầu triển khai ESG (nếu đã triển khai):</div>
                    <div class="font-bold">
                        {{
                        profileData.startedESGYear ? profileData.startedESGYear : '-'
                        }}
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Địa chỉ website:</div>
                    <div class="font-bold">{{ profileData.websiteCompany }}</div>
                </div>
            </a-col>
        </a-row>

        <div class="font-bold text-lg">Thông tin 01 lãnh đạo doanh nghiệp (để liên hệ)</div>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Họ và tên:</div>
                    <div class="font-bold">{{ profileData.fullNameManager }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Giới tính:</div>
                    <div class="font-bold">{{ profileData.sexManager }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Dân tộc:</div>
                    <div class="font-bold">{{ profileData.nationManager }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Vị trí công tác:</div>
                    <div class="font-bold">{{ profileData.workPlaceManager }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Email::</div>
                    <div class="font-bold">{{ profileData.emailManager }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Điện thoại:</div>
                    <div class="font-bold">{{ profileData.phoneNumberManager }}</div>
                </div>
            </a-col>
        </a-row>

        <div class="font-bold text-lg">Người thực hiện đánh giá</div>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Họ và tên:</div>
                    <div class="font-bold">{{ profileData.fullName }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Ngày thực hiện đánh giá:</div>
                    <div class="font-bold">{{ profileData.evaluatedDate }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Vị trí công tác:</div>
                    <div class="font-bold">{{ profileData.workPlace }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Đơn vị công tác:</div>
                    <div class="font-bold">{{ profileData.workUnit }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Email::</div>
                    <div class="font-bold">{{ profileData.email }}</div>
                </div>
            </a-col>
            <a-col :xs="24" :md="12">
                <div class="flex gap-2">
                    <div>Điện thoại:</div>
                    <div class="font-bold">{{ profileData.phoneNumber }}</div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
