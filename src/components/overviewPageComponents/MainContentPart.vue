<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {handleResponse} from "../../services/commonService";
import {saveData} from "../../services/overviewPage";
import {showToast} from "../../utils/showToast";
import {ModulesEditor} from "../../constants/modulesEditor";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ToolbarEditor} from "../../constants/toolbarEditor";

const quill = ref()

const props = defineProps({
    pageId: String
})

const formState = reactive({
    title: '',
    content: ''
})

const loading = ref(false)

const toolbar = computed(() => ToolbarEditor(quill))

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
        content: formState.content
    }

    saveData(body, 'bo sung sau').then((response) => {
        const handledResponse = handleResponse(response.status, response.data)
        if (handledResponse) {
            loading.value = false
            getComponentData()
            showToast('success', 'Success')
        }
    }).catch((err) => {
        loading.value = false
        console.log('Lưu main content data thất bại ', err)
        showToast('error', 'Lưu cài đặt thất bại');
    })
}
</script>

<template>
    <DividerWithTitle label="Nội dung chính"/>

    <a-form :model="formState"
            label-align="left"
            :label-col="{span: 3}"
            :label-wrap="true"
            @finish="handleSubmit">
        <a-form-item name="title"
                     label="Tiêu đề"
                     :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 100, message: 'Nội dung quá dài'}]">
            <a-input v-model:value="formState.title" placeholder="Tiêu đề"/>
        </a-form-item>
        <a-form-item name="content"
                     label="Nội dung"
                     :rules="[{required: true, message: 'Nội dung không được để trống'}]">
            <div class="w-full">
                <quill-editor ref="quill"
                              v-model:content="formState.content"
                              class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                              :modules="ModulesEditor"
                              :toolbar="toolbar"
                              content-type="html">
                </quill-editor>
            </div>
        </a-form-item>

        <a-form-item class="text-right">
            <a-button html-type="submit" type="primary" class="bg-[#1677ff]" :loading="loading">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>

</template>
