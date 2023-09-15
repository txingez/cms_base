<script setup>
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import {ModulesEditor} from "../../constants/modulesEditor";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import {reactive} from "@vue/reactivity";
import {computed, onMounted, ref} from "vue";
import {ToolbarEditor} from "../../constants/toolbarEditor";
import {saveData} from "../../services/overviewPage";
import {handleResponse} from "../../services/commonService";
import {showToast} from "../../utils/showToast";
import PreviewModal from "../../components/PreviewModal.vue";
import {open} from "../../utils/previewerUtils";
import {ModalConfirm} from "../../components/ModalConfirm"

const quillAbout = ref()
const quillMission = ref()

const toolbarAbout = computed(() => ToolbarEditor(quillAbout))
const toolbarMission = computed(() => ToolbarEditor(quillMission))

const loading = ref(false)

const formState = reactive({
    id: "",
    contentAbout: ''
    // contentMission: ''
})

const pid = 'ESG'
const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý trang tổng quan', to: '/management_overview'}
];

const getContentOverview = (response) => {
  formState.id = response.data.page_id;
  formState.contentAbout = response.data.content;
};

// onMounted(() => {
//     getContentOverview()
// })
const handleSubmit = () => {
    loading.value = true;

    const body = {
        page_id: pid,
        content: formState.contentAbout,
    };

    const callback = () => {
        saveData(body)
            .then((response) => {
                const handledResponse = handleResponse(response.status, response.data)
                if (handledResponse) {
                    loading.value = false
                    getContentOverview(handledResponse)
                    showToast('success', 'Success')
                }
            }).catch((err) => {
                loading.value = false
                console.log('Lưu overview data thất bại ', err)
                showToast('error', 'Lưu cài đặt thất bại');
            })
    }
    ModalConfirm("Lưu bài viết", "Hành động này sẽ lưu dữ liệu và cập nhật dữ liệu này trên website. Bạn chắc chắn muốn thực hiện chứ!", callback)
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <TitlePage label="QUẢN LÝ NỘI DUNG TRANG TỔNG QUAN"/>

        <a-form :model="formState"
                layout="vertical"
                label-align="left"
                @finish="handleSubmit">
            <DividerWithTitle label="Tổng quan"/>
            <a-form-item name="contentAbout"
                         label="Nội dung"
                         :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                <div class="w-full">
                    <quill-editor ref="quillAbout"
                                  v-model:content="formState.contentAbout"
                                  class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                                  :modules="ModulesEditor"
                                  :toolbar="toolbarAbout"
                                  content-type="html"/>
                </div>
            </a-form-item>
            <div class="text-right space-x-2">
                <a-button @click.prevent="open(formState.contentAbout, 'HTML')">
                    Xem trước kết quả
                </a-button>
                <a-button html-type="submit" type="primary" class="bg-[#1677ff]" :loading="loading">
                    Lưu cài đặt
                </a-button>
            </div>
        </a-form>
    </div>

    <PreviewModal/>
</template>
