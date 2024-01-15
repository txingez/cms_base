<script setup>

import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import { reactive } from "@vue/reactivity";
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import {QuillEditor} from "@vueup/vue-quill";
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
import { handleGoogleImageLink } from "../../utils/handleGoogleImageLink";

const previewerStore = previewer()

const introduction = ref(null);
const toolbarIntroduction = computed(() => ToolbarEditor(introduction))

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý trang sáng kiến ESG', to: '/management_esg'}
];

const formState = reactive({
    banner: [],
    introduction: {title: '', content: ''},
    benifit: {
        headTitle: '',
        contents: [
            {
                title: '',
                description: ''
            }
        ]
    },
    condition: {title: '', content: ''},
    timeline: {
        headTitle: '',
        contents: [
            {
                datetime: '',
                title: '',
                description: '',
                image: []
            }
        ]
    },
    stories: [
        {description: '', image: []}
    ]
})

const otherState = reactive({
    loading: false,
    benifitToDelete: [],
    storyToDelete: [],
    eventToDelete: []
})


const pid = 'IDEA'

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
                url: handleGoogleImageLink(responseData.data.file_url)
            }

            switch (data.type) {
                case "Banner":
                    formState.banner = [result]
                    return;
                case "Timeline":
                    formState.timeline.contents[data.index].image = [result]
                    return;
                case "Story":
                    formState.stories[data.index].image = [result]
                    return;
                default:
                    console.error(`Unsupported type: ${data.type}`)
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
          console.log(decodeContent.data.banner)
            formState.banner = decodeContent.data.banner.map(b => {
              return {...b, ...{url: handleGoogleImageLink(b.url)}}
            })
            formState.introduction = decodeContent.data.introduction
            formState.benifit = decodeContent.data.benifit
            formState.condition = decodeContent.data.condition
            formState.timeline = decodeContent.data.timeline
            formState.stories = decodeContent.data.stories
        })
        .catch((err) => {
            console.log('Lấy dữ liệu thất bại ', err)
            handleResponse(err.response.status, err.response.data)
        })
}

const removeBenifit = (item) => {
    let index = formState.benifit.contents.indexOf(item);
    if (index !== -1) {
        otherState.benifitToDelete.push(item)
        formState.benifit.contents.splice(index, 1);
    }
}

const removeStory = (item) => {
    let index = formState.stories.indexOf(item);
    if (index !== -1) {
        otherState.storyToDelete.push(item)
        formState.stories.splice(index, 1);
    }
}

const removeEvent = (item) => {
    let index = formState.timeline.contents.indexOf(item);
    if (index !== -1) {
        otherState.eventToDelete.push(item)
        formState.timeline.contents.splice(index, 1);
    }
}

const addEvent = (index) => {
    formState.timeline.contents.push(
        {
                datetime: '',
                title: '',
                description: '',
                image: []
        }
    );
};

const addBenifit = (index) => {
    formState.benifit.contents.push({title: '', description: ''});
};

const addStory = (index) => {
    formState.stories.push({description: '', image: []});
};

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
    ModalConfirm("Lưu chỉnh sửa", "Hành động này sẽ lưu dữ liệu và cập nhật dữ liệu này trên website. Bạn chắc chắn muốn thực hiện chứ!", callback)
}
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes" />
    </div>

    <div class="bg-white p-10">
        <TitlePage label="QUẢN LÝ NỘI DUNG TRANG SÁNG KIẾN ESG" />
        <a-form :model="formState" :validate-messages="validateMessages" layout="vertical" @finish="handleSubmit">
            <DividerWithTitle label="Chỉnh sửa banner"/>
            <a-form-item :label="['Ảnh nền banner']" :name="banner"
                         :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">
                <a-upload v-model:file-list="formState.banner" :custom-request="uploadFile"
                            :data="{index: index, type: 'Banner'}" :max-count="1" accept=".png, .jpg, .jpeg"
                            list-type="picture-card">
                    <div v-if="formState.banner.length < 2">
                        <plus-outlined/>
                        <div>Upload</div>
                    </div>
                 </a-upload>
            </a-form-item>
            <DividerWithTitle label="Phần giới thiệu"/>
            <a-form-item :rules="[{ required: true }]" label="Tiêu đề" name="introduction">
                <div class="w-full">
                    <a-textarea v-model:value="formState.introduction.title" rows="2"/>
                </div>
            </a-form-item>
            <a-form-item :rules="[{ required: true }]" label="Nội dung" name="introduction">
                <div class="w-full">
                    <quill-editor ref="introduction" v-model:content="formState.introduction.content" :modules="ModulesEditor"
                        :toolbar="toolbarIntroduction" class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                        content-type="html">
                    </quill-editor>
                </div>
            </a-form-item>
            <DividerWithTitle label="Phần lợi ích"/>
            <a-form-item :rules="[{ required: true }]" label="Tiêu đề" name="introduction">
                <div class="w-full">
                    <a-textarea v-model:value="formState.benifit.headTitle" rows="2"/>
                </div>
            </a-form-item>
            <div v-for="(content, index) in formState.benifit.contents" class="flex items-center">
                <div class="basis-full">
                    <a-form-item :label="['Đầu mục ', index + 1]" :name="['contents', index, 'title']">
                        <a-input v-model:value="content.title" placeholder="Tạo đầu mục"/>
                    </a-form-item>
                    <a-form-item :label="['Nội dung ', index + 1]" :name="['contents', index, 'description']">
                        <a-textarea v-model:value="content.description" rows="4"/>
                    </a-form-item>
                </div>
                <a-button :disabled="formState.benifit.contents.length === 1" class="flex items-center justify-center"
                          danger
                          shape="circle" type="text" @click="removeBenifit(content)">
                    <minus-circle-outlined/>
                </a-button>
            </div>
            <a-button class="flex items-center" type="dashed"
                      @click="addBenifit(formState.stories.length)">
                <plus-outlined/>
                Thêm nội dung
            </a-button>
            <DividerWithTitle label="Phần điều kiện"/>
            <a-form-item :rules="[{ required: true }]" label="Tiêu đề" name="condition">
                <div class="w-full">
                    <a-textarea v-model:value="formState.condition.title" rows="2"/>
                </div>
            </a-form-item>
            <a-form-item :rules="[{ required: true }]" label="Nội dung" name="condition">
                <div class="w-full">
                    <quill-editor ref="introduction" v-model:content="formState.condition.content" :modules="ModulesEditor"
                        :toolbar="toolbarIntroduction" class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                        content-type="html">
                    </quill-editor>
                </div>
            </a-form-item>
            <DividerWithTitle label="Phần lộ trình"/>
            <a-form-item :rules="[{ required: true }]" label="Tiêu đề" name="condition">
                <div class="w-full">
                    <a-textarea v-model:value="formState.timeline.headTitle" rows="2"/>
                </div>
            </a-form-item>
            <div v-for="(content, index) in formState.timeline.contents" class="flex items-center">
                <div class="basis-full">
                    <a-form-item :label="['Mốc thời gian ', index + 1]" :name="['contents', index, 'datetime']">
                        <a-input v-model:value="content.datetime" placeholder="Thời gian"/>
                    </a-form-item>
                    <a-form-item :label="['Tiêu đề tiêu đề sự kiện ', index + 1]" :name="['contents', index, 'title']">
                        <a-textarea v-model:value="content.title" rows="4"/>
                    </a-form-item>
                    <a-form-item :label="['Mô tả nội dung sự kiện ', index + 1]" :name="['contents', index, 'description']">
                        <a-textarea v-model:value="content.description" rows="6"/>
                    </a-form-item>
                    <a-form-item :label="['Hình ảnh sự kiện ', index + 1]" :name="['contents', index, 'image']"
                                 :rules="[{message: 'Ảnh chưa được upload' }]">
                        <a-upload v-model:file-list="content.image" :custom-request="uploadFile"
                                  :data="{ index: index, type: 'Timeline' }" :max-count="1" accept=".png, .jpg, .jpeg"
                                  list-type="picture-card">
                            <div v-if="content.image.length < 2">
                                <plus-outlined/>
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </div>
                <a-button :disabled="formState.timeline.contents.length === 1" class="flex items-center justify-center"
                          danger
                          shape="circle" type="text" @click="removeEvent(content)">
                    <minus-circle-outlined/>
                </a-button>
            </div>
            <a-button class="flex items-center" type="dashed"
                      @click="addEvent(formState.timeline.contents.length)">
                <plus-outlined/>
                Thêm nội dung
            </a-button>
<!--            <DividerWithTitle label="Phần câu chuyện về kinh doanh bền vững"/>-->
<!--            <div v-for="(story, index) in formState.stories" class="flex items-center">-->
<!--                <div class="basis-full">-->
<!--                    <a-form-item :label="['Tóm tắt nội dung ', index + 1]" :name="['stories', index, 'description']">-->
<!--                        <a-input v-model:value="story.description" placeholder="Tóm tắt nội dung"/>-->
<!--                    </a-form-item>-->
<!--                    <a-form-item :label="['Hình ảnh ', index + 1]" :name="['stories', index, 'image']">-->
<!--                        <a-upload v-model:file-list="story.image" :custom-request="uploadFile" :data="{ index: index, type: 'Story' }"-->
<!--                                  :max-count="1" accept=".png, .jpg, .jpeg" list-type="picture-card">-->
<!--                            <div v-if="story.image.length < 2">-->
<!--                                <plus-outlined/>-->
<!--                                <div>Upload</div>-->
<!--                            </div>-->
<!--                        </a-upload>-->
<!--                    </a-form-item>-->
<!--                </div>-->
<!--                <a-button :disabled="formState.stories.length === 1" class="flex items-center justify-center"-->
<!--                          danger-->
<!--                          shape="circle" type="text" @click="removeStory(story)">-->
<!--                    <minus-circle-outlined/>-->
<!--                </a-button>-->
<!--            </div>-->
<!--            <a-button class="flex items-center" type="dashed"-->
<!--                      @click="addStory(formState.stories.length)">-->
<!--                <plus-outlined/>-->
<!--                Thêm nội dung-->
<!--            </a-button>-->
            <div class="flex justify-end gap-2 mt-5">
                <!-- <a-button @click.prevent="handlePreview">
                    Xem trước kết quả
                </a-button> -->
                <a-button :loading="otherState.loading" class="bg-[#1677ff]" html-type="submit" type="primary">
                    Lưu cài đặt
                </a-button>
            </div>
        </a-form>
    </div>
    <PreviewESGPage />
</template>
