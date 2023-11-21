<script setup>
defineProps({
    organizationProfile: {}
})
</script>

<template>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tên doanh nghiệp (theo Giấy chứng nhận đăng ký doanh nghiệp):</div>
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
                <div>Mã số doanh nghiệp:</div>
                <div class="font-bold">{{ organizationProfile.taxCode }}</div>
            </div>
        </a-col>
    </a-row>

    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Địa chỉ đăng ký kinh doanh: </div>
                <div class="font-bold">{{ organizationProfile.addressCompany }}</div>
            </div>
        </a-col>
    </a-row>

    <!--    <a-row :gutter="[10, 10]">-->
    <!--        <a-col :md="24" :xs="24">-->
    <!--            <div class="flex gap-2">-->
    <!--                <div>Địa điểm cơ sở sản xuất chính thứ nhất:</div>-->
    <!--                <div class="font-bold">{{ organizationProfile.firstManufactureFactory }}</div>-->
    <!--            </div>-->
    <!--        </a-col>-->
    <!--    </a-row>-->

    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Tên các tỉnh/thành phố có cơ sở sản xuất, kinh doanh của doanh nghiệp mà khác với địa chỉ đăng ký kinh doanh (nếu có):</div>
                <div class="font-bold">{{
                    organizationProfile.secondManufactureFactory ? organizationProfile.secondManufactureFactory : '-'
                    }}
                </div>
            </div>
        </a-col>
    </a-row>

    <a-row :gutter="[10, 10]">
        <a-col :md="24" :xs="24">
            <div class="flex gap-2">
                <div>Loại hình đăng ký:</div>
                <div class="font-bold">
                    {{
                    organizationProfile.registrationType === 'other' ? organizationProfile.registrationTypeOtherInput : organizationProfile.registrationType
                    }}
                </div>
            </div>
        </a-col>
    </a-row>

    <!--    <a-row :gutter="[10, 10]">-->
    <!--        <a-col :md="24" :xs="24">-->
    <!--            <div class="flex gap-2">-->
    <!--                <div>Loại hình Doanh nghiệp:</div>-->
    <!--                <div class="font-bold">{{ organizationProfile.businessType }}</div>-->
    <!--            </div>-->
    <!--        </a-col>-->
    <!--    </a-row>-->

    <div class="font-bold text-lg">Thông tin người lao động của doanh nghiệp:</div>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số nhân viên toàn thời gian (bao gồm tất cả hợp đồng lao động không thời hạn, hợp đồng lao động có thời hạn, hợp đồng lao động thử việc):</div>
                <div class="font-bold">{{ organizationProfile.fullTimeEmployees }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>trong đó: tổng số nhân viên nữ:</div>
                <div class="font-bold">{{ organizationProfile.femaleFullTimeEmployees }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số nhân viên bán thời gian:</div>
                <div class="font-bold">{{ organizationProfile.partTimeEmployees }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>trong đó: tổng số nhân viên nữ:</div>
                <div class="font-bold">{{ organizationProfile.femalePartTimeEmployees }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số nhân viên thời vụ:</div>
                <div class="font-bold">{{ organizationProfile.seasonalEmployees }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>trong đó: tổng số nhân viên nữ:</div>
                <div class="font-bold">{{ organizationProfile.femaleSeasonalEmployees }}</div>
            </div>
        </a-col>
    </a-row>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Tổng số cán bộ cấp quản lý (từ cấp trưởng phòng/ trưởng bộ phận trở lên):</div>
                <div class="font-bold">{{ organizationProfile.numberManagers }}</div>
            </div>
        </a-col>
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>trong đó: Tổng số cán bộ cấp quản lý là nữ:</div>
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
    <div class="flex gap-1">
        <div class="text-left">
            Doanh nghiệp có phải là doanh nghiệp do phụ nữ làm chủ không (có một hoặc nhiều phụ nữ sở hữu
            từ 51% vốn điều lệ trở lên, trong đó có ít nhất một người cấp quản lý điều hành doanh nghiệp)?
        </div>
        <div class="font-bold">{{ organizationProfile.b6Value }}</div>
    </div>
    <div class="flex gap-2">
        <div>
            Doanh nghiệp có phải là doanh nghiệp do phụ nữ trực tiếp điều hành (là việc phụ nữ đảm nhận vị trí điều hành cao nhất trong Ban giám đốc, có thể là vị trí Tổng Giám đốc/ Giám đốc điều hành) không:
        </div>
        <div class="font-bold">{{ organizationProfile.b7Value }}</div>
    </div>
    <div class="flex gap-2">
        <div>Lĩnh vực hoạt động sản xuất, kinh doanh chính của doanh nghiệp thuộc nhóm ngành nào dưới đây:</div>
        <div class="font-bold">
            {{
            organizationProfile.businessModel === 'other' ? organizationProfile.businessModelOtherInput : organizationProfile.businessModel
            }}
        </div>
    </div>
    <a-row :gutter="[10, 10]">
        <a-col :md="12" :xs="24">
            <div class="flex gap-2">
                <div>Năm bắt đầu triển khai ESG (nếu đã triển khai):</div>
                <div class="font-bold">
                    {{
                    organizationProfile.startedESGYear ? organizationProfile.startedESGYear : '-'
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
