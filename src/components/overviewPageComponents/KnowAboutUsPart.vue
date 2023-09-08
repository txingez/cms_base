<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {onMounted, reactive, ref} from "vue";
import {open} from "../../utils/previewerUtils";
import {PlusOutlined} from "@ant-design/icons-vue";
import {uploadImage} from "../../services/uploadFile";
import {handleResponse} from "../../services/commonService";
import PreviewModal from "../PreviewModal.vue";
import {saveData} from "../../services/overviewPage";
import {showToast} from "../../utils/showToast";

const props = defineProps({
    pageId: String
})

const formState = reactive({
    title: '',
    boldText: '',
    description: '',
    image: []
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
    <DividerWithTitle label="Biết về chúng tôi"/>

    <a-form :model="formState"
            label-align="left"
            :label-col="{span: 4}"
            :label-wrap="true"
            @finish="handleSubmit">
        <a-form-item name="title"
                     label="Tiêu đề"
                     :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 100, message: 'Nội dung quá dài'}]">
            <a-input v-model:value="formState.title" placeholder="Tiêu đề"/>
        </a-form-item>
        <a-form-item name="boldText"
                     label="Mô tả ngắn chữ đậm"
                     :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 200, message: 'Nội dung quá dài'}]">
            <a-textarea v-model:value="formState.boldText"
                        placeholder="Mô tả ngắn chữ đậm"
                        allow-clear
                        show-count
                        :maxlength="200"
                        :rows="3"/>
        </a-form-item>
        <a-form-item name="description"
                     label="Mô tả"
                     :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 500, message: 'Nội dung quá dài'}]">
            <a-textarea v-model:value="formState.description"
                        placeholder="Mô tả"
                        allow-clear
                        show-count
                        :maxlength="500"
                        :rows="5"/>
        </a-form-item>
        <a-form-item name="image"
                     label="Ảnh"
                     :rules="[{required: true, message: 'Ảnh chưa được upload'}]">
            <a-upload v-model:file-list="formState.image"
                      accept=".png, .jpg, .jpeg"
                      list-type="picture-card"
                      :max-count="1"
                      @preview="open"
                      :custom-request="uploadFile">
                <div v-if="formState.image.length < 2">
                    <plus-outlined/>
                    <div>Upload</div>
                </div>
            </a-upload>
        </a-form-item>

        <a-form-item class="text-right">
            <a-button html-type="submit" type="primary" class="bg-[#1677ff]" :loading="loading">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>

    <PreviewModal/>
</template>
