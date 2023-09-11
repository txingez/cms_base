<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {open} from "../../utils/previewerUtils";
import {PlusOutlined} from "@ant-design/icons-vue";
import {uploadImage} from "../../services/uploadFile";
import {handleResponse} from "../../services/commonService";
import PreviewModal from "../PreviewModal.vue";
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
    boldText: '',
    description: '',
    image: [],
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
        boldText: formState.boldText,
        description: formState.description,
        image: formState.image[0].url
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
        console.log('Lưu know about us data thất bại ', err)
        showToast('error', 'Lưu cài đặt thất bại');
    })
}

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage('NEWS', file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formState.resources[data.index].image = [{
                    name: responseData.data.filename,
                    status: 'done',
                    response: responseData,
                    url: responseData.data.image_url
                }]
            } else {
                formState.resources[data.index].error = 'Upload ảnh đến server bị lỗi';
                const error = new Error('Uploaded Failed');
                onError(error);
            }
        })
        .catch(error => {
            console.log('Lỗi khi upload', error);
            formState.image = [];
        });
}
</script>

<template>
    <DividerWithTitle label="Tổng quan"/>

    <a-form :model="formState"
            label-align="left"
            :label-col="{span: 4}"
            :label-wrap="true"
            @finish="handleSubmit">
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

    <PreviewModal/>
</template>
