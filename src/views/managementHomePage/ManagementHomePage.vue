<script setup>

import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import {reactive} from "@vue/reactivity";
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ModulesEditor} from "../../constants/modulesEditor";
import {ToolbarEditor} from "../../constants/toolbarEditor";
import {computed, ref} from "vue";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {open} from "../../utils/previewerUtils";
import {uploadImage} from "../../services/uploadFile";
import {handleResponse} from "../../services/commonService";
import {previewer} from "../../stores/previewer";
import PreviewHomePage from "../../components/PreviewHomePage.vue";
import {saveData} from "../../services/homePage";
import {showToast} from "../../utils/showToast";
import {ModalConfirm} from "../../components/ModalConfirm";

const previewerStore = previewer()

const introduction = ref(null);
const toolbarIntroduction = computed(() => ToolbarEditor(introduction))

const formState = reactive({
    introduction: '',
    titleMission: '',
    missions: [
        {content: '', icon: ''}
    ],
    descriptionEvaluate: '',
    evaluateSlides: [
        {title: '', target: '', image: []}
    ]
})

const otherState = reactive({
    missionsToDelete: [],
    slidesToDelete: [],
    loading: false
})

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý trang chủ', to: '/management_home'}
];
const pid = 'HOME'

const validateMessages = {
    required: "${label} là bắt buộc",
};

const removeMission = (item) => {
    let index = formState.missions.indexOf(item);
    if (index !== -1) {
        otherState.missionsToDelete.push(item)
        formState.missions.splice(index, 1);
    }
}

const addMission = () => {
    formState.missions.push({content: '', icon: ''});
};

const removeEvaluateSlide = (item) => {
    let index = formState.evaluateSlides.indexOf(item);
    if (index !== -1) {
        otherState.slidesToDelete.push(item)
        formState.evaluateSlides.splice(index, 1);
    }
}

const addEvaluateSlide = () => {
    formState.evaluateSlides.push({title: '', target: '', image: []});
};

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage(file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            console.log(responseData)
            if (responseData) {
                formState.evaluateSlides[data.index].image = [{
                    file: file,
                    status: 'done',
                    response: responseData,
                    url: responseData.data.file_url
                }];
            } else {
                const error = new Error('Uploaded Failed');
                onError(error);
            }
        })
        .catch(error => {
            console.log('Lỗi khi upload', error);
            formState.image = [];
        });
}

const handlePreview = () => {
    const dataPreview = {
        introduction: formState.introduction,
        titleMission: formState.titleMission,
        missions: formState.missions,
        descriptionEvaluate: formState.descriptionEvaluate,
        evaluateSlides: formState.evaluateSlides
    }
    previewerStore.updatePreviewHomePage(dataPreview)
    previewerStore.updateIsPreview(true)
}

const handleSubmit = () => {
    otherState.loading = true;

    const body = {
        page_id: pid,
        content: formState,
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


const icons = ['mountain-sun', 'house', 'star', 'cloud', 'face-smile', 'shield-halved', 'bolt', 'umbrella', 'gift', 'gear',
    'trash', 'droplet', 'fire', 'thumbs-up', 'thumbs-down', 'globe', 'truck', 'city', 'bicycle', 'flask', 'person', 'handshake',
    'earth-asia', 'users', 'feather', 'sun', 'fish', 'shop', 'chart-simple', 'gauge', 'hand-holding-heart', 'location-pin',
    'network-wired', 'rocket', 'water', 'sitemap', 'moon', 'leaf', 'seedling', 'trophy', 'hammer', 'recycle', 'wind', 'virus',
    'chart-line']

const handleClick = (index, icon) => {
    formState.missions[index].icon = icon
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <TitlePage label="QUẢN LÝ NỘI DUNG TRANG CHỦ"/>
        <a-form :model="formState"
                :validate-messages="validateMessages"
                layout="vertical"
                @finish="handleSubmit">
            <DividerWithTitle label="Phần giới thiệu"/>
            <a-form-item :rules="[{required: true}]"
                         label="Nội dung phần giới thiệu"
                         name="introduction">
                <div class="w-full">
                    <quill-editor ref="introduction"
                                  v-model:content="formState.introduction"
                                  :modules="ModulesEditor"
                                  :toolbar="toolbarIntroduction"
                                  class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                                  content-type="html">
                    </quill-editor>
                </div>
            </a-form-item>

            <DividerWithTitle label="Phần mục tiêu"/>
            <a-form-item :rules="[{required: true}]"
                         label="Tiêu đề mục tiêu"
                         name="titleMission">
                <a-input v-model:value="formState.titleMission" placeholder="Nhập tiêu đề phần mục tiêu"/>
            </a-form-item>
            <div v-for="(mission, index) in formState.missions"
                 class="flex items-center">
                <div class="basis-full">
                    <a-form-item :label="['Nhiệm vụ ', index + 1]"
                                 :name="['missions', index, 'content']"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="mission.content" placeholder="Nội dung nhiệm vụ"/>
                    </a-form-item>
                    <a-form-item :label="['Icon ', index + 1]"
                                 :name="['missions', index, 'icon']"
                                 :rules="[{required: true}]">
                        <a-dropdown-button>
                            <font-awesome-icon v-if="mission.icon !== ''" :icon="['fas', mission.icon]"/>
                            <span v-else>Icon</span>
                            <template #overlay>
                                <a-space :wrap="true" class="w-[250px] flex justify-around">
                                    <font-awesome-icon v-for="icon in icons"
                                                       :icon="['fas', icon]"
                                                       @click="handleClick(index, icon)"/>
                                </a-space>
                            </template>
                        </a-dropdown-button>
                    </a-form-item>
                </div>
                <a-button :disabled="formState.missions.length === 1"
                          class="flex items-center justify-center"
                          danger
                          shape="circle"
                          type="text"
                          @click="removeMission(mission)">
                    <minus-circle-outlined/>
                </a-button>
            </div>
            <a-button class="flex items-center"
                      type="dashed"
                      @click="addMission">
                <plus-outlined/>
                Thêm nhiệm vụ
            </a-button>

            <DividerWithTitle label="Phần công cụ đánh giá"/>
            <a-form-item label="Mô tả công cụ đánh giá"
                         name="descriptionEvaluate"
                         class="basis-full"
                         :rules="[{required: true}]">
                <a-textarea v-model:value="formState.descriptionEvaluate"
                            :rows="5"
                            placeholder="Nhập mô tả công cụ đánh giá"/>
            </a-form-item>
            <div v-for="(slide, index) in formState.evaluateSlides"
                 class="flex items-center">
                <div class="basis-full">
                    <a-form-item :label="['Tiêu đề ', index + 1]"
                                 :name="['evaluateSlides', index, 'title']"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="slide.title" placeholder="Tiêu đề slide"/>
                    </a-form-item>
                    <a-form-item :label="['Đích đến  ', index + 1]"
                                 :name="['evaluateSlides', index, 'target']"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="slide.target" placeholder="Đường dẫn đến biểu mãu đánh giá"/>
                    </a-form-item>
                    <a-form-item :label="['Ảnh nền slide ', index + 1]"
                                 :name="['evaluateSlides', index, 'image']"
                                 :rules="[{required: true, message: 'Ảnh chưa được upload'}]">
                        <a-upload v-model:file-list="slide.image"
                                  :custom-request="uploadFile"
                                  :data="{index: index}"
                                  :max-count="1"
                                  accept=".png, .jpg, .jpeg"
                                  list-type="picture-card"
                                  @preview="open">
                            <div v-if="slide.image.length < 2">
                                <plus-outlined/>
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </div>
                <a-button :disabled="formState.evaluateSlides.length === 1"
                          class="flex items-center justify-center"
                          danger
                          shape="circle"
                          type="text"
                          @click="removeEvaluateSlide(slide)">
                    <minus-circle-outlined/>
                </a-button>
            </div>
            <a-button v-if="formState.evaluateSlides.length < 2"
                      class="flex items-center"
                      type="dashed"
                      @click="addEvaluateSlide">
                <plus-outlined/>
                Thêm slide
            </a-button>

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

    <PreviewHomePage/>
</template>
