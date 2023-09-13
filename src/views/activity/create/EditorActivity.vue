<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <TitlePage label="Sự kiện - Tin tức - Thư viện"/>
        <a-form autocomplete="off"
                name="form_data"
                layout="vertical"
                :model="formData"
                :validate-messages="validateMessages"
                @finish="onFinish">
            <a-row :gutter="[50]">
                <a-col :xs="24" :md="12">
                    <a-form-item label="Tiêu đề"
                                 name="title"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="formData.title"
                                 :maxlength="255"
                                 placeholder="Tiêu đề"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Chuyên mục"
                                 name="category"
                                 :rules="[{required: true}]">
                        <a-select v-model:value="formData.category"
                                  :options="optionsCategory"
                                  allow-clear
                                  placeholder="Chuyên mục"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Ngày đăng"
                                 name="releaseDate"
                                 :rules="[{required: true}]">
                        <a-date-picker class="w-full"
                                       v-model:value="formData.releaseDate"
                                       format="YYYY-MM-DD"
                                       valueFormat="YYYY-MM-DD"
                                       placeholder="Chọn ngày đăng"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Ảnh"
                                 name="image"
                                 :rules="[{required: true}]">
                        <div>
                            <a-upload name="bigImage"
                                      v-model:file-list="formData.image"
                                      accept=".png, .jpg, .jpeg"
                                      list-type="picture-card"
                                      :max-count="1"
                                      :before-upload="file => beforeUpload(file)"
                                      @preview="file => open(file, 'IMAGE_URL')"
                                      :custom-request="uploadFile">
                                <div v-if="formData.image.length < 2">
                                    <plus-outlined/>
                                    <div>Upload</div>
                                </div>
                            </a-upload>
                            <div class="italic">Ảnh hiển thị trong chi tiết bài viết.</div>
                            <div class="italic">Vui lòng sử dụng ảnh tỉ lệ: 16:9</div>
                            <div class="text-orange-500 text-sm">
                                {{
                                formData.errorImage === 'Size' ? 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.' : formData.errorImage === 'Aspect Ratio' ? 'Tỉ lệ ảnh không đúng' : ''
                                }}
                            </div>
                        </div>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Loại nội dung"
                                 name="contentType"
                                 :rules="[{required: true}]">
                        <a-select v-model:value="formData.contentType"
                                  :options="optionContentType"
                                  placeholder="Loại nội dung">
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Nguồn"
                                 name="source"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="formData.source"
                                 :maxlength="255"
                                 placeholder="Nguồn"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="24">
                    <a-form-item label="Nội dung"
                                 v-if="formData.contentType === contentTypeEnum.HTML"
                                 name="content"
                                 :rules="[{required: true}]">
                        <div class="w-full">
                            <quill-editor ref="quill"
                                          v-model:content="formData.content"
                                          class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                                          :modules="ModulesEditor"
                                          :toolbar="toolbar"
                                          content-type="html">
                            </quill-editor>
                        </div>
                    </a-form-item>
                    <a-form-item label="Nội dung"
                                 v-else
                                 name="link"
                                 :rules="[{required: true}]">
                        <a-input v-model:value="formData.link" placeholder="Link (https:www.content.com)"/>
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="flex space-x-5 justify-end">
                <a-button @click="handleCancel">
                    Huỷ
                </a-button>
                <a-button danger
                          v-if="state.isEdit"
                          @click="showConfirm({title: 'Xoá hoạt động', type: 'DELETE'})">
                    Xoá
                </a-button>
                <a-button type="dashed"
                          v-if="formData.status === '' || formData.status === statusEnum.DRAFT"
                          @click="handleDraft"
                          :loading="state.loadingDraft">
                    Lưu nháp
                </a-button>
                <a-form-item>
                    <a-button type="primary"
                              :loading="state.loading"
                              html-type="submit"
                              class="bg-[#1677ff]">
                        {{ formData.status === '' || formData.status === statusEnum.DRAFT ? 'Đăng tin' : 'Lưu' }}
                    </a-button>
                </a-form-item>
            </div>
        </a-form>
    </div>

    <a-modal v-model:open="state.visibleModalConfirm"
             :confirm-loading="state.confirmLoading"
             :maskClosable="false"
             @cancel="resetModal">
        <template #title>
            <span class="font-bold">{{ state.titleModal }}</span>
        </template>
        <template #footer>
            <a-button @click="handleConfirm(false)">Huỷ</a-button>
            <a-button type="primary"
                      class="bg-[#1677ff]"
                      @click="handleConfirm(true)">
                Xác nhận
            </a-button>
        </template>
        <div>
            <span>Bạn xác nhận thực hiện thao tác này?</span>
        </div>
    </a-modal>
  ¬

    <PreviewModal/>
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {useRouter} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import {handleResponse} from "../../../services/commonService";
import {uploadImage} from "../../../services/uploadFile";
import {PlusOutlined} from "@ant-design/icons-vue";
import {showToast} from "../../../utils/showToast";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb.vue";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ModulesEditor} from "../../../constants/modulesEditor";
import {ToolbarEditor} from "../../../constants/toolbarEditor";
import TitlePage from "../../../components/TitlePage.vue";
import {createPost, deletePost, getById, saveForm, updatePost} from "../../../services/activity";
import PreviewModal from "../../../components/PreviewModal.vue";
import {open} from "../../../utils/previewerUtils";

const router = useRouter();
const quill = ref(null);

const toolbar = computed(() => ToolbarEditor(quill))

const statusEnum = {
    DRAFT: "DRAFT",
    PUBLISH: "PUBLISH"
}

const categoryEnum = {
    LIBRARY: "LIBRARY",
    NEWS: "NEWS",
    EVENT: "EVENT"
}

const pageEnum = {
    LIBRARY: "LIB",
    ACTIVITIES: "ATV"
}

const contentTypeEnum = {
    HTML: "HTML",
    LINK: "LINK"
}

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Danh sách hoạt động', to: '/activities'},
    {name: 'Soạn thảo hoạt động', to: '/activity/editor'}
];

const formData = reactive({
    id: 0,
    title: '',
    status: '',
    category: null,
    image: [],
    content: '',
    link: '',
    errorImage: '',
    contentType: null,
    releaseDate: '',
    source: ''
});

const optionsCategory = [
    {label: 'Thư viện', value: 'LIBRARY'},
    {label: 'Sự kiện', value: 'EVENT'},
    {label: 'Tin tức', value: 'NEWS'}
];

const optionContentType = [
    {label: 'Nội dung đính kèm', value: 'LINK'},
    {label: 'Nội dung soạn thảo', value: 'HTML'}
];

const state = reactive({
    fetching: false,
    loadingDraft: false,
    optionsAuthor: [],
    keywordInput: '',
    loading: false,
    isEdit: false,
    visibleModalConfirm: false,
    titleModal: '',
    typeModal: '',
    reason: ''
});

const resetForm = () => {
    formData.id = 0;
    formData.title = '';
    formData.category = null;
    formData.releaseDate = '';
    formData.image = [];
    formData.content = '';
    formData.link = '';
    formData.errorImage = '';
    formData.source = '';

    state.disableEdit = false;
};

watch(router.currentRoute, (route) => {
    if (route.params.activityId === undefined) {
        resetForm()

        state.isEdit = false;
    } else {
        const activityId = route.params.activityId;
        state.isEdit = true;

        getById(activityId)
            .then(response => {
                const responseData = handleResponse(response.status, response.data);
                if (responseData) {
                    formData.id = responseData.id;
                    formData.title = responseData.title;
                    formData.status = responseData.status;
                    formData.category = responseData.category;
                    formData.image = responseData.image ? [{
                        name: responseData.image,
                        url: responseData.image,
                        status: 'done'
                    }] : [];
                    formData.releaseDate = responseData.release_date;
                    formData.contentType = responseData.content_type;
                    formData.source = responseData.source
                    formData.content = responseData.content_type === contentTypeEnum.HTML ? responseData.content : '';
                    formData.link = responseData.content_type === contentTypeEnum.LINK ? responseData.content : '';
                    formData.errorImage = '';
                }
            });
    }
}, {
    immediate: true,
    deep: true
});

onMounted(() => {
    const activityId = router.currentRoute.value.params.activityId;

    if (activityId) {
        getDetail(activityId);
    }
});

const getDetail = (activityId) => {
    getById(activityId)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formData.id = responseData.id;
                formData.title = responseData.title;
                formData.status = responseData.status;
                formData.category = responseData.category;
                formData.image = responseData.image ? [{
                    name: responseData.image,
                    url: responseData.image,
                    status: 'done'
                }] : [];
                formData.releaseDate = responseData.release_date;
                formData.contentType = responseData.content_type;
                formData.source = responseData.source
                formData.content = responseData.content_type === 'HTML' ? responseData.content : '';
                formData.link = responseData.content_type === 'LINK' ? responseData.content : '';
                formData.errorImage = '';
            } else {
                showToast('error', 'Không lấy được thông tin');
                router.push('/activities');
            }
        })
        .catch(error => {
            console.log('Lỗi lấy thông tin hoạt động, ', error);
            showToast('error', 'Không lấy được thông tin hoạt động');
            router.push('/activities');
        });
}

const validateMessages = {
    required: "${label} là bắt buộc",
};

const handleCancel = () => {
    resetForm();
    router.push('/activities')
};

const handleDraft = () => {
    state.loadingDraft = true;
    if (formData.title === '') {
        state.loadingDraft = false;
        showToast('warning', 'Hãy nhập tiêu đề');
        return;
    }
    const body = {
        status: statusEnum.DRAFT,
        additional_params: {
            page_id: getPageId(formData.category),
            source: formData.source,
            title: formData.title,
            category: formData.category,
            image: formData.image.length !== 0 ? formData.image[0].url : null,
            content: formData.contentType === contentTypeEnum.HTML ? formData.content : formData.link,
            content_type: formData.contentType,
            release_date: formData.releaseDate
        }
    };

    saveForm(body)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            state.loadingDraft = false;
            if (responseData) {
                resetForm();
                router.push('/activities');
                showToast('success', 'Lưu nháp thành công');
            }
        })
        .catch(error => {
            state.loadingDraft = false;
            console.log('Lỗi khi lưu nháp, ', error);
            showToast('error', 'Lưu nháp thất bại');
        });
};

const onFinish = () => {
    if (formData.errorImage === 'Size') {
        showToast('error', 'Vui lòng sử dụng ảnh có dung lượng chuẩn');
    } else {

        const body = {
            status: statusEnum.PUBLISH,
            additional_params: {
                page_id: getPageId(formData.category),
                source: formData.source,
                title: formData.title,
                category: formData.category,
                image: formData.image.length !== 0 ? formData.image[0].url : null,
                content: formData.contentType === contentTypeEnum.HTML ? formData.content : formData.link,
                content_type: formData.contentType,
                release_date: formData.releaseDate
            }
        };

        executeActivityAPI(body);
    }
};

const executeActivityAPI = (body) => {
    state.loading = true;
    const request = formData.id !== 0 ? updatePost({...body, id: formData.id}) : createPost(body);
    request.then(response => {
        const responseData = handleResponse(response.status, response.data);
        state.loading = false;
        if (responseData) {
            showToast('success', formData.id !== 0 ? 'Chỉnh sửa thành công' : 'Tạo mới thành công');
            resetForm();
            router.push('/activities')
        }
    }).catch(error => {
        console.log('Lỗi khi tạo hoạt động', error);
        state.loading = false;
        showToast('error', formData.id !== 0 ? 'Chỉnh sửa thất bại' : 'Tạo mới thất bại');
    });
};

const beforeUpload = (file) => {
    formData.error = '';
    return new Promise((resolve, reject) => {
        const isLt5M = file.size / 1024 / 1024 <= 5;
        if (!isLt5M) {
            file.status = 'error';
            formData.errorImage = 'Size';
            return reject(false);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = () => {
                const height = image.height;
                const width = image.width;
                if ((width / height) === (16 / 9)) {
                    file.status = 'done';
                    formData.errorImage = '';
                } else {
                    formData.errorImage = 'Aspect Ratio';
                }
                return resolve(true);
            }
        }
    })
};

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage(file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);

            if (responseData) {
                formData.image = [{
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
            switch (data.type) {
                case 'big':
                    formData.bigImage = [];
                    return;
                case 'small':
                    formData.thumbnail = [];
                    return;
            }
        });
};

const showConfirm = (opt) => {
    state.visibleModalConfirm = true;
    state.titleModal = opt.title;
    state.typeModal = opt.type;
};

const resetModal = () => {
    state.visibleModalConfirm = false
    state.titleModal = '';
    state.typeModal = '';
    state.reason = '';
};

const handleConfirm = confirmed => {
    const activityId = router.currentRoute.value.params.activityId;
    state.confirmLoading = true;
    const request = (() => {
        switch (state.typeModal) {
            case 'DELETE':
                if (confirmed) {
                    return deletePost(activityId);
                }
                return;
        }
    })();
    request.then(response => {
        const responseData = handleResponse(response.status, response.data);
        state.confirmLoading = false;
        if (responseData) {
            showToast('success', 'Thao tác thành công');
            router.push('/activities');
            resetModal();
        }
    })
};

const handleImageCssInContent = content => {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    let imgTags = tempDiv.getElementsByTagName('img');
    for (const img of imgTags) {
        img.style.margin = '5px'
    }
    return tempDiv.innerHTML.toString();
};

const getPageId = category => {
    switch (category) {
        case categoryEnum.NEWS:
        case categoryEnum.EVENT:
            return pageEnum.ACTIVITIES;
        case categoryEnum.LIBRARY:
            return pageEnum.LIBRARY;
        default:
            console.error(`Category ${category} is not supported!!!`)
    }
}
</script>
