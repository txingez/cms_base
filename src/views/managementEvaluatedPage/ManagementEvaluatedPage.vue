<script setup>

import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import { reactive } from "@vue/reactivity";
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import { QuillEditor } from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ModulesEditor } from "../../constants/modulesEditor";
import { ToolbarEditor } from "../../constants/toolbarEditor";
import { computed, onMounted, ref } from "vue";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";
import { open } from "../../utils/previewerUtils";
import { uploadImage } from "../../services/uploadFile";
import { handleResponse } from "../../services/commonService";
import { previewer } from "../../stores/previewer";
import { getByPageID, saveData } from "../../services/homePage";
import { showToast } from "../../utils/showToast";
import { ModalConfirm } from "../../components/ModalConfirm";
import { Buffer } from "buffer";
import { ENUM } from "../../constants/enum";
import PreviewEvaluatedPage from "../../components/PreviewEvaluatedPage.vue";

const previewerStore = previewer()

const introduction = ref(null);
const toolbarIntroduction = computed(() => ToolbarEditor(introduction))

const formState = reactive({
    introduction: '',
    esg: { title: '', image: [], document: [] },
    nec: { title: '', image: [], document: [] },
})

const otherState = reactive({
    loading: false
})

const routes = [
    { name: 'Home', to: '/' },
    { name: 'Quản lý trang công cụ đánh giá', to: '/management_evaluated_page' }
];

const pid = 'EVALUATE'

const validateMessages = {
    required: "${label} là bắt buộc",
};

const uploadFile = (options) => {
    const { onError, data, file, onProgress } = options;

    uploadImage(file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            console.log(responseData)
            if (!responseData) {
                const error = new Error('Uploaded Failed');
                onError(error);
            }

            const result = {
                file: file,
                name: file.name,
                status: 'done',
                response: responseData,
                url: responseData.data.file_url
            }

            switch (data.form) {
                case ENUM.FORM_ID.ESG:        
                    if (data.type === 'image') {
                        formState.esg.image = [result]
                    } else {
                        formState.esg.document = [result]
                    }
                    return;
                case ENUM.FORM_ID.NEC:
                    if (data.type === 'image') {
                        formState.nec.image = [result]
                    } else {
                        formState.nec.document = [result]
                    }
                    return;
            }
        })
        .catch(error => {
            console.log('Lỗi khi upload', error);
            formState.image = [];
        });
}

onMounted(() => {
    getContent()
})

const getContent = () => {
    getByPageID(pid)
        .then(response => {
            console.log(JSON.stringify(response))
            const responseData = handleResponse(response.status, response.data);
            const decodeContent = JSON.parse(Buffer.from(responseData.data.content.split('.')[1], 'base64').toString());
            formState.introduction = decodeContent.data.introduction
            formState.esg.title = decodeContent.data.esg.title
            formState.esg.image = decodeContent.data.esg.image
            formState.esg.document = decodeContent.data.esg.document
            formState.nec.title = decodeContent.data.nec.title
            formState.nec.image = decodeContent.data.nec.image
            formState.nec.document = decodeContent.data.nec.document
        })
        .catch((err) => {
            console.log('Lấy dữ liệu thất bại ', err)
            handleResponse(err.response.status, err.response.data)
        })
}
const handlePreview = () => {
    const dataPreview = {
        introduction: formState.introduction,
        esg: formState.esg,
        nec: formState.nec
    }
    previewerStore.updatePreviewEvaluatedPage(dataPreview)
    previewerStore.updateIsPreview(true)
}

const handleSubmit = () => {
    otherState.loading = true;

    const body = {
        page_id: pid,
        content: { ...formState }
    };

    const callback = () => {
        saveData(body)
            .then((response) => {
                const handledResponse = handleResponse(response.status, response.data)
                if (handledResponse) {
                    showToast('success', 'Success')
                }
            }).catch((err) => {
                console.log('Lưu home page data thất bại ', err)
                showToast('error', 'Lưu cài đặt thất bại');
                handleResponse(err.response.status, err.response.data)
            }).finally(() => {
                otherState.loading = false;
            })
    }
    ModalConfirm("Lưu bài viết", "Hành động này sẽ lưu dữ liệu và cập nhật dữ liệu này trên website. Bạn chắc chắn muốn thực hiện chứ!", callback)
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes" />
    </div>

    <div class="bg-white p-10">
        <TitlePage label="QUẢN LÝ NỘI DUNG TRANG CÔNG CỤ ĐÁNH GIÁ" />
        <a-form :model="formState" :validate-messages="validateMessages" layout="vertical" @finish="handleSubmit">
            <DividerWithTitle label="Phần giới thiệu" />
            <a-form-item :rules="[{ required: true }]" label="Nội dung phần giới thiệu" name="introduction">
                <div class="w-full">
                    <quill-editor ref="introduction" v-model:content="formState.introduction" :modules="ModulesEditor"
                        :toolbar="toolbarIntroduction" class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                        content-type="html">
                    </quill-editor>
                </div>
            </a-form-item>
            <DividerWithTitle label="Chỉnh sửa công cụ ESG" />
            <a-form-item label="Tiêu đề" :name="['esg', 'title']" required>
                <a-input v-model:value="formState.esg.title" placeholder="Tiêu đề" />
            </a-form-item>
            <a-row>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Thubmnail" :name="['esg', 'image']"
                        :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">
                        <a-upload v-model:file-list="formState.esg.image" :custom-request="uploadFile"
                            :data="{ type: 'image', form: 'ESG' }" :max-count="1" accept=".png, .jpg, .jpeg"
                            list-type="picture-card" @preview="open">
                            <div v-if="formState.esg.image.length < 2">
                                <plus-outlined />
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Tài liệu hướng dẫn" :name="['esg', 'document']"
                        :rules="[{ required: true, message: 'Tài liệu chưa được upload' }]">
                        <a-upload v-model:file-list="formState.esg.document" :data="{ type: 'doc', form: 'ESG' }"
                            :max-count="1" accept=".docx, .pdf, .mp4, .csv, .xlsx, .pptx" :custom-request="uploadFile">
                            <a-button v-if="formState.esg.document.length < 1" class="flex justify-center items-center">
                                <UploadOutlined />
                                <span>Upload</span>
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>

            <DividerWithTitle label="Chỉnh sửa công cụ NEC" />
            <a-form-item label="Tiêu đề" :name="['nec', 'title']" required>
                <a-input v-model:value="formState.nec.title" placeholder="Tiêu đề" />
            </a-form-item>
            <a-row>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Thubmnail" :name="['nec', 'image']"
                        :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">
                        <a-upload v-model:file-list="formState.nec.image" :custom-request="uploadFile"
                            :data="{ type: 'image', form: 'NEC' }" :max-count="1" accept=".png, .jpg, .jpeg"
                            list-type="picture-card" @preview="open">
                            <div v-if="formState.nec.image.length < 1">
                                <plus-outlined />
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Tài liệu hướng dẫn" :name="['nec', 'document']"
                        :rules="[{ required: true, message: 'Tài liệu chưa được upload' }]">
                        <a-upload v-model:file-list="formState.nec.document" :data="{ type: 'doc', form: 'NEC' }"
                            :max-count="1" accept=".docx, .pdf, .mp4, .csv, .xlsx, .pptx" :custom-request="uploadFile">
                            <a-button v-if="formState.nec.document.length < 1" class="flex justify-center items-center">
                                <UploadOutlined />
                                <span>Upload</span>
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>

            <div class="flex justify-end gap-2 mt-5">
                <a-button @click.prevent="handlePreview">
                    Xem trước kết quả
                </a-button>
                <a-button :loading="otherState.loading" class="bg-[#1677ff]" html-type="submit" type="primary">
                    Lưu cài đặt
                </a-button>
            </div>
        </a-form>
    </div>

    <PreviewEvaluatedPage />
</template>
