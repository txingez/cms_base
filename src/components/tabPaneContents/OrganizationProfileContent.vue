<script setup>
import ProfileESG from "./profiles/ProfileESG.vue";
import ProfileNEC from "./profiles/ProfileNEC.vue";
import {ENUM} from "../../constants/enum";

defineProps({
    organizationProfile: {},
    formId: String
})
</script>

<template>
    <div class="flex flex-col gap-3">
        <ProfileESG v-if="formId === ENUM.FORM_ID.ESG" :organization-profile="organizationProfile"/>
        <ProfileNEC v-else-if="formId === ENUM.FORM_ID.NEC" :organization-profile="organizationProfile"/>

        <div class="font-bold text-lg">Thông tin 01 lãnh đạo doanh nghiệp (để liên hệ)</div>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Họ và tên:</div>
                    <div class="font-bold">{{ organizationProfile.fullNameManager }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Giới tính:</div>
                    <div class="font-bold">{{ organizationProfile.sexManager }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Dân tộc:</div>
                    <div class="font-bold">{{ organizationProfile.nationManager }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Vị trí công tác:</div>
                    <div class="font-bold">{{ organizationProfile.workPlaceManager }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Email::</div>
                    <div class="font-bold">{{ organizationProfile.emailManager }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Điện thoại:</div>
                    <div class="font-bold">{{ organizationProfile.phoneNumberManager }}</div>
                </div>
            </a-col>
        </a-row>

        <div class="font-bold text-lg">Người thực hiện đánh giá</div>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Họ và tên:</div>
                    <div class="font-bold">{{ organizationProfile.fullName }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Ngày thực hiện đánh giá:</div>
                    <div class="font-bold">{{ organizationProfile.evaluatedDate }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Vị trí công tác:</div>
                    <div class="font-bold">{{ organizationProfile.workPlace }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Đơn vị công tác:</div>
                    <div class="font-bold">{{ organizationProfile.workUnit }}</div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[10, 10]">
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Email::</div>
                    <div class="font-bold">{{ organizationProfile.email }}</div>
                </div>
            </a-col>
            <a-col :md="12" :xs="24">
                <div class="flex gap-2">
                    <div>Điện thoại:</div>
                    <div class="font-bold">{{ organizationProfile.phoneNumber }}</div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
