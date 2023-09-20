<script setup>

import DividerWithTitle from "../DividerWithTitle.vue";
import {onMounted, reactive, ref} from "vue";
import {saveData} from "../../services/homePage";
import {handleResponse} from "../../services/commonService";
import {showToast} from "../../utils/showToast";

const props = defineProps({
    pageId: String
})

const formState = reactive({
    title: '',
    description: ''
})

const loading = ref(false)

onMounted(() => {
    getComponentData()
})

const getComponentData = () => {

}

const handleSubmit = () => {
    loading.value = true

    const body = {
        pid: props.pageId,
        title: formState.title,
        description: formState.description
    }

    saveData(body, 'bo sung sau').then((response) => {
        const responseHandled = handleResponse(response.status, response.data)
        if (responseHandled) {
            loading.value = false
            getComponentData()
            showToast('success', 'Success');
        }
    }).catch(error => {
        loading.value = false;
        console.log('Lưu thông tin khối about us bị lỗi ', error);
        showToast('error', 'Lưu cài đặt thất bại');
    });
}
</script>

<template>
    <DividerWithTitle label="Hiểu thêm về chúng tôi"/>

    <a-form :label-col="{ span: 2 }"
            :label-wrap="true"
            :model="formState"
            labelAlign="left"
            @finish="handleSubmit">
        <a-form-item :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 100, message: 'Nội dung quá dài'}]"
                     label="Tiêu đề"
                     name="title">
            <a-input v-model:value="formState.title"
                     allow-clear
                     placeholder="Tiêu đề"/>
        </a-form-item>
        <a-form-item :rules="[{required: true, message: 'Nội dung không được để trống'}]"
                     label="Mô tả"
                     name="description">
            <a-textarea v-model:value="formState.description"
                        :maxlength="500"
                        :rows="5"
                        allow-clear
                        placeholder="Mô tả"
                        show-count/>
        </a-form-item>

        <a-form-item class="text-right">
            <a-button :loading="loading" class="bg-[#1677ff]" html-type="submit" type="primary">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>
</template>
