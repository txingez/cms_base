<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <div class="mb-10 flex justify-between">
            <div class="text-2xl font-bold">Soạn thảo tin tức</div>
            <a-button type="primary"
                      v-if="state.isEdit"
                      @click="showModalHistory">
                Lịch sử
            </a-button>
        </div>
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
                        <a-tree-select v-model:value="formData.category"
                                       multiple
                                       :tree-data="state.optionsCategory"
                                       show-search
                                       allow-clear
                                       placeholder="Chuyên mục"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Tin nổi bật">
                        <a-checkbox v-model:checked="formData.isHotNews" :disabled="state.disableEdit"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Tác giả"
                                 name="authorId"
                                 :rules="[{required: true}]">
                        <a-select v-model:value="formData.authorId"
                                  placeholder="Tác giả"
                                  showSearch
                                  :filter-option="false"
                                  :options="state.optionsAuthor"
                                  @search="searchUser">
                            <template v-if="state.fetching" #notFoundContent>
                                <a-spin size="small"/>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Ngày đăng"
                                 name="activeTime"
                                 :rules="[{required: true}]">
                        <a-date-picker v-model:value="formData.activeTime"
                                       class="w-full"
                                       :showNow="false"
                                       show-time
                                       format="YYYY-MM-DD HH:mm"
                                       valueFormat="YYYY-MM-DD HH:mm"
                                       placeholder="Chọn ngày đăng"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Đối tượng"
                                 name="target"
                                 :rules="[{required: true}]">
                        <a-select v-model:value="formData.target"
                                  :options="state.optionsTarget"
                                  placeholder="Đối tượng"/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12" class="mb-2">
                    <a-form-item label="Từ khoá">
                        <a-input v-model:value="state.keywordInput"
                                 @blur="handleInputKeyword"
                                 @keyup.enter="handleInputKeyword"
                                 placeholder="Từ khoá"/>
                    </a-form-item>
                    <template v-for="(keyword, index) in formData.keywords"
                              :key="keyword">
                        <a-tag :closable="true"
                               @close="deleteKeyword(keyword)">
                            {{ keyword }}
                        </a-tag>
                    </template>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Mô tả"
                                 name="description"
                                 :rules="[{required: true}]">
                        <a-textarea v-model:value="formData.description"
                                    placeholder="Mô tả"
                                    :rows="5"
                                    allow-clear/>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Ảnh lớn"
                                 name="bigImage"
                                 :rules="[{required: formData.smallImage.length === 0 && formData.bigImage.length === 0}]">
                        <div>
                            <div>
                                <a-upload name="big_image"
                                          v-model:file-list="formData.bigImage"
                                          accept=".png, .jpg, .jpeg"
                                          list-type="picture-card"
                                          :max-count="1"
                                          :data="{type: 'big'}"
                                          :before-upload="file => beforeUpload(file, 'big')"
                                          @remove="handleRemoveImage"
                                          @preview="handlePreview"
                                          :custom-request="uploadFile">
                                    <div v-if="formData.bigImage.length < 2">
                                        <plus-outlined/>
                                        <div>Upload</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="italic">Ảnh hiển thị trong chi tiết bài viết.</div>
                            <div class="italic">Vui lòng sử dụng ảnh tỉ lệ: 16:9</div>
                            <div class="text-orange-500 text-sm">
                                {{
                                formData.errorBigImage === 'Size' ? 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.' : formData.errorBigImage === 'Aspect Ratio' ? 'Tỉ lệ ảnh không đúng' : ''
                                }}
                            </div>
                        </div>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12">
                    <a-form-item label="Ảnh nhỏ"
                                 name="smallImage"
                                 :rules="[{required: formData.smallImage.length === 0 && formData.bigImage.length === 0}]">
                        <div>
                            <div>
                                <a-upload name="small_image"
                                          v-model:file-list="formData.smallImage"
                                          accept=".png, .jpg, .jpeg"
                                          list-type="picture-card"
                                          :max-count="1"
                                          :data="{type: 'small'}"
                                          :before-upload="file => beforeUpload(file, 'small')"
                                          @remove="handleRemoveImage"
                                          @preview="handlePreview"
                                          :custom-request="uploadFile">
                                    <div v-if="formData.smallImage.length < 2">
                                        <plus-outlined/>
                                        <div>Upload</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="italic">Ảnh thumbnail hiển thị ở các phần danh sách, banner.</div>
                            <div class="italic">Vui lòng sử dụng ảnh tỉ lệ: 16:9 có dung lượng &lt;= 300kb</div>
                            <div class="text-orange-500 text-sm">
                                {{
                                formData.errorSmallImage === 'Size' ? 'Vui lòng sử dụng ảnh dung lượng tối đa 300KB.' : formData.errorSmallImage === 'Aspect Ratio' ? 'Tỉ lệ ảnh không đúng' : ''
                                }}
                            </div>
                        </div>
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :md="24">
                    <a-form-item label="Nội dung"
                                 name="content"
                                 :rules="[{required: true}]">
                        <div class="w-full">
                            <quill-editor ref="quill"
                                          v-model:content="formData.content"
                                          class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                                          :modules="modules"
                                          :toolbar="toolbar"
                                          content-type="html">
                            </quill-editor>
                        </div>
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="flex space-x-5 justify-end">
                <a-button @click="handleCancel">
                    Huỷ
                </a-button>
                <a-button danger v-if="state.isEdit"
                          @click="showConfirm({title: 'Xoá tin tức', type: 'DELETE'})">
                    Xoá
                </a-button>
                <a-button type="dashed"
                          v-if="formData.status === '' || formData.status === 'DRAFT'"
                          @click="handleDraft"
                          :loading="state.loadingDraft">
                    Lưu nháp
                </a-button>
                <a-button danger
                          v-if="state.isEdit && formData.status === 'POSTED' && policies.includes('PUBLIC_NEWS')"
                          @click="showConfirm({title: 'Gỡ tin', type: 'DISMISS'})">
                    Gỡ tin
                </a-button>
                <a-form-item>
                    <a-button
                            type="primary"
                            :loading="state.loading"
                            html-type="submit">
                        {{ formData.status === '' || formData.status === 'DRAFT' ? 'Đăng tin' : 'Lưu' }}
                    </a-button>
                </a-form-item>
                <a-button v-if="formData.status === 'WAITING_APPROVE' && policies.includes('APPROVE_NEWS')"
                          type="primary"
                          @click="showConfirm({title: 'Phê duyệt', type: 'APPROVE'})">
                    Phê duyệt
                </a-button>
                <a-button
                        v-if="(formData.status === 'WAITING_POSTED' || formData.status === 'WAITING_APPROVE') && policies.includes('PUBLIC_NEWS')"
                        type="primary"
                        @click="showConfirm({title: 'Duyệt đăng', type: 'PUBLIC'})">
                    Duyệt đăng
                </a-button>
            </div>
        </a-form>
    </div>

  <!--  Modal xác nhận xoá bài viết-->
    <a-modal v-model:visible="state.visibleModalConfirm"
             :confirm-loading="state.confirmLoading"
             :maskClosable="false"
             @cancel="resetModal">
        <template #title>
            <span class="font-bold">{{ state.titleModal }}</span>
        </template>
        <template #footer>
            <a-button @click="handleConfirm(false)">Từ chối</a-button>
            <a-button type="primary"
                      @click="handleConfirm(true)">
                Xác nhận
            </a-button>
        </template>
        <div class="space-y-2.5" v-if="state.typeModal !== 'DELETE'">
            <div>Nhận xét</div>
            <a-textarea v-model:value="state.reason" placeholder="Nhập nhận xét"/>
        </div>
        <div v-else>
            <span>Bạn xác nhận thực hiện xoá bài viết này?</span>
        </div>
    </a-modal>
  <!--  kết thúc modal xác nhận xoá bài viết-->

    <a-modal :visible="state.previewVisible" title="Preview" :footer="null" @cancel="cancelPreview">
        <img alt="preview" class="w-full" :src="state.previewImage"/>
    </a-modal>
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {getCategories} from "../../../services/category";
import {handleResponse} from "../../../services/commonService";
import {removeImage, uploadImage} from "../../../services/uploadFile";
import {getImageUrlByName} from "../../../utils/getImageUrl";
import {PlusOutlined} from "@ant-design/icons-vue";
import {showToast} from "../../../utils/showToast";
import dayjs from "dayjs";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb.vue";
import {
    approveNews,
    createNews,
    deleteNews,
    dismissNews,
    draftNews,
    getNews,
    publicNews,
    updateNews
} from "../../../services/news";
import {decodeJWT} from "../../../utils/decodeJWT";
import {ACCESS_TOKEN_KEY} from "../../../constants/constants";
import {getHistories} from "../../../services/history";
import {numberWithComma} from "../../../utils/formatNumber";
import {debounce} from "lodash-es";
import {getUser, getUsers} from "../../../services/user";
import {dateTimeFormatString} from "../../../utils/reformatTime";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageResize from "quill-image-resize";
import Compressor from 'compressorjs';

const router = useRouter();
const quill = ref(null);

const modules = {
    name: 'imageResize',
    module: ImageResize,
    options: {}
};

const toolbar = {
    container: [
        [{'font': []}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'color': []}, {'background': []}],
        [{'align': null}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        ['image', 'video'],
        ['clean']
    ],
    handlers: {
        'image': () => {
            let fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('multiple', 'multiple');
            fileInput.setAttribute('accept', 'image/*');
            fileInput.addEventListener('change', () => {
                if (fileInput.files !== null) {
                    for (let i = 0; i < fileInput.files.length; i++) {
                        uploadImage('NEWS', fileInput.files[i]).then((res) => {
                            const range = quill.value.getQuill().getSelection();
                            quill.value.getQuill().insertEmbed(range.index, 'image', getImageUrlByName(res.data.data.filename));
                        });
                    }
                    fileInput.value = '';
                }
            });
            fileInput.click();
        }
    }
};

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Danh sách tin tức', to: '/news'},
    {name: 'Soạn thảo tin tức', to: '/news/editor'}
];

const columnsHistoryTable = [
    {title: 'Hành động', dataIndex: 'action', key: 'action'},
    {title: 'Người thực hiện', dataIndex: 'createdBy', key: 'createdBy'},
    {title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt'},
    {title: 'Thao tác', dataIndex: 'operation', key: 'operation'},
    {title: 'Ý kiến', dataIndex: 'comment', key: 'comment'}
];

const formData = reactive({
    id: '',
    title: '',
    status: '',
    category: [],
    isHotNews: false,
    activeTime: '',
    target: 'ALL',
    authorId: null,
    keywords: [],
    description: '',
    bigImage: [],
    smallImage: [],
    content: '',
    errorBigImage: '',
    errorSmallImage: ''
});

const state = reactive({
    fetching: false,
    loadingDraft: false,
    optionsAuthor: [],
    optionsCategory: [],
    optionsTarget: [
        {value: 'ALL', label: 'Tất cả'},
    ],
    keywordInput: '',
    loading: false,
    isEdit: false,
    visibleModalConfirm: false,
    titleModal: '',
    typeModal: '',
    reason: '',
    treeCategory: [],
    previewVisible: false,
    previewImage: ''
});

const stateHistory = reactive({
    visibleModalHistory: false,
    historyTableData: [],
    current: 1,
    pageSize: 10,
    total: 1
});

const policies = ref([]);

watch(router.currentRoute, (route) => {
    if (route.params.newsId === undefined) {
        formData.id = '';
        formData.title = '';
        formData.category = [];
        formData.isHotNews = false;
        formData.activeTime = '';
        formData.authorId = null;
        formData.description = '';
        formData.bigImage = [];
        formData.smallImage = [];
        formData.content = '';
        formData.keywords = [];
        formData.status = '';

        state.isEdit = false;
    } else {
        const newsId = route.params.newsId;
        state.isEdit = true;

        getNews(newsId)
            .then(response => {
                const responseData = handleResponse(response.status, response.data);
                if (responseData) {
                    formData.id = responseData.data._id;
                    formData.title = responseData.data.title;
                    formData.status = responseData.data.status;
                    formData.category = responseData.data.category ? responseData.data.category.map(c => c._id) : [];
                    formData.isHotNews = responseData.data.isHotNews;
                    formData.activeTime = dayjs(responseData.data.activeTime).format('YYYY-MM-DD HH:mm');
                    formData.authorId = responseData.data.author ? responseData.data.author._id : '';
                    state.optionsAuthor = [{
                        value: responseData.data.author._id,
                        label: responseData.data.author.username
                    }];
                    formData.description = responseData.data.description;
                    formData.bigImage = responseData.data.bigImage ? [{
                        name: responseData.data.bigImage,
                        url: getImageUrlByName(responseData.data.bigImage),
                        status: 'done'
                    }] : [];
                    formData.smallImage = responseData.data.smallImage ? [{
                        name: responseData.data.smallImage,
                        url: getImageUrlByName(responseData.data.smallImage),
                        status: 'done'
                    }] : [];
                    formData.content = responseData.data.content;
                    formData.keywords = responseData.data.keywords;
                    formData.errorBigImage = '';
                    formData.errorSmallImage = '';
                }
            });
    }
}, {
    immediate: true,
    deep: true
});

onMounted(() => {
    const newsId = router.currentRoute.value.params.newsId;
    // const decodedInfoUser = decodeJWT(sessionStorage.getItem(ACCESS_TOKEN_KEY));
    // policies.value = JSON.parse(decodedInfoUser.policies).map(p => p.name);
    //
    // if (newsId) {
    //     getDetailNews(newsId);
    // } else {
    //     const userId = decodedInfoUser._id;
    //     getUser(userId)
    //         .then(response => {
    //             formData.authorId = userId;
    //             const responseData = handleResponse(response.status, response.data);
    //             if (responseData) {
    //                 state.optionsAuthor = [
    //                     {
    //                         value: userId,
    //                         label: responseData.data.fullName
    //                     }];
    //             }
    //         })
    //         .catch(error => {
    //             console.log('Lấy thông tin user lỗi', error);
    //         });
    //     const now = dayjs();
    //     formData.activeTime = now.format('YYYY-MM-DD HH:mm');
    // }
    //
    // getCategories(1, 1000)
    //     .then(response => {
    //         const responseData = handleResponse(response.status, response.data);
    //         if (responseData) {
    //             state.optionsCategory = responseData.data.docs.map(c => {
    //                 return {
    //                     label: c.name, value: c._id, children: c.subCategories.map(sc => {
    //                         return {label: sc.name, value: sc._id}
    //                     })
    //                 }
    //             })
    //         }
    //     })
    //     .catch(error => {
    //         console.log('Lấy danh sách chuyên mục lỗi', error);
    //     });
});

const getDetailNews = (newsId) => {
    state.isView = true;

    getNews(newsId)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formData.id = responseData.data._id;
                formData.title = responseData.data.title;
                formData.status = responseData.data.status;
                formData.category = responseData.data.category ? responseData.data.category.map(c => c._id) : [];
                formData.isHotNews = responseData.data.isHotNews;
                formData.activeTime = dayjs(responseData.data.activeTime).format('YYYY-MM-DD HH:mm');
                formData.authorId = responseData.data.author ? responseData.data.author._id : '';
                state.optionsAuthor = [{value: responseData.data.author._id, label: responseData.data.author.fullName}];
                formData.description = responseData.data.description;
                formData.bigImage = responseData.data.bigImage ? [{
                    name: responseData.data.bigImage,
                    url: getImageUrlByName(responseData.data.bigImage),
                    status: 'done'
                }] : [];
                formData.smallImage = responseData.data.smallImage ? [{
                    name: responseData.data.smallImage,
                    url: getImageUrlByName(responseData.data.smallImage),
                    status: 'done'
                }] : [];
                formData.content = responseData.data.content;
                formData.keywords = responseData.data.keywords;
                formData.target = responseData.data.target;
                formData.errorBigImage = '';
                formData.errorSmallImage = '';
            } else {
                showToast('error', 'Không lấy được thông tin bài viết');
                router.push('/news');
            }
        })
        .catch(error => {
            console.log('Lỗi lấy thông tin bài viết, ', error);
            showToast('error', 'Không lấy được thông tin bài viết');
            router.push('/news');
        });
}

const validateMessages = {
    required: "${label} là bắt buộc",
};

const resetForm = () => {
    formData.id = '';
    formData.title = '';
    formData.category = [];
    formData.isHotNews = false;
    formData.activeTime = '';
    formData.authorId = null;
    formData.description = '';
    formData.bigImage = [];
    formData.smallImage = [];
    formData.content = '';
    formData.keywords = [];
    formData.errorBigImage = '';
    formData.errorSmallImage = '';

    state.isView = false;
    state.disableEdit = false;
};

const handleCancel = () => {
    resetForm();
    router.push('/news')
};

const handleDraft = () => {
    state.loadingDraft = true;
    if (formData.title === '') {
        state.loadingDraft = false;
        showToast('warning', 'Hãy nhập tiêu đề');
        return;
    }
    const body = {
        ...(formData.id !== '' && {newId: formData.id}),
        title: formData.title,
        isHotNews: formData.isHotNews,
        ...(formData.category.length !== 0 && {categoryId: formData.category.toString()}),
        description: formData.description,
        bigImage: formData.bigImage.length !== 0 ? formData.bigImage[0].name : null,
        smallImage: formData.smallImage.length !== 0 ? formData.smallImage[0].name : null,
        activeTime: formData.activeTime,
        authorId: formData.authorId,
        keywords: formData.keywords,
        content: handleImageCssInContent(formData.content),
        target: formData.target
    };

    draftNews(body)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            state.loadingDraft = false;
            if (responseData) {
                resetForm();
                router.push('/news');
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
    if (formData.errorBigImage === 'Size' || formData.errorSmallImage === 'Size') {
        showToast('error', 'Vui lòng sử dụng ảnh có dung lượng chuẩn');
    } else {

        let body = {
            ...((formData.status === 'DRAFT' && formData.id !== '') && {newId: formData.id}),
            title: formData.title,
            isHotNews: formData.isHotNews,
            categoryId: formData.category.toString(),
            description: formData.description,
            bigImage: formData.bigImage.length !== 0 ? formData.bigImage[0].name : formData.smallImage[0].name,
            smallImage: formData.smallImage.length !== 0 ? formData.smallImage[0].name : null,
            activeTime: formData.activeTime,
            authorId: formData.authorId,
            keywords: formData.keywords,
            content: handleImageCssInContent(formData.content),
            target: formData.target
        };

        if (formData.smallImage.length === 0) {
            const file = formData.bigImage[0].file;
            if (file.size > 300000) {
                new Compressor(file, {
                    quality: 0.1,
                    success(result) {
                        const newFile = new File([result], result.name, {lastModified: Date.now(), type: result.type});
                        uploadImage('NEWS', newFile)
                            .then((res) => {
                                const responseData = handleResponse(res.status, res.data);
                                if (responseData) {
                                    const finalBody = Object.assign(body, {smallImage: responseData.data.filename});
                                    executeNewsAPI(finalBody)
                                }
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                    },
                    error(error) {
                        console.log(error.message);
                    }
                })
            }
        } else {
            executeNewsAPI(body);
        }
    }
};

const executeNewsAPI = (body) => {
    state.loading = true;
    const request =
        formData.id !== '' && formData.status !== 'DRAFT' ? updateNews(formData.id, body) : createNews(body);
    request.then(response => {
        const responseData = handleResponse(response.status, response.data);
        state.loading = false;
        if (responseData) {
            showToast('success', formData.id !== '' && formData.status !== 'DRAFT' ? 'Chỉnh sửa tin tức thành công' : 'Tạo tin tức mới thành công');
            resetForm();
            router.push('/news')
        }
    }).catch(error => {
        console.log('Lỗi khi tạo bài viết', error);
        state.loading = false;
        showToast('error', formData.id !== '' && formData.status !== 'DRAFT' ? 'Chỉnh sửa tin tức thất bại' : 'Tạo tin tức mới thất bại');
    });
};

const searchUser = debounce(value => {
    state.fetching = true;
    getUsers(1, 1000, `&filters[search]=${value}`)
        .then(response => {
            state.fetching = false;
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                state.optionsAuthor = responseData.data.docs.map(u => {
                    return {
                        label: u.fullName,
                        value: u._id
                    }
                })
            }
        })
        .catch(error => {
            state.fetching = false;
            console.log('Lỗi khi tìm kiếm user', error);
            state.optionsAuthor = [];
        });
}, 300);

const handleInputKeyword = () => {
    const inputValue = state.keywordInput;
    let currentKeywords = formData.keywords;
    if (inputValue && currentKeywords.indexOf(inputValue) === -1) {
        formData.keywords = [...currentKeywords, inputValue];
        state.keywordInput = '';
    }
};

const deleteKeyword = removedKeyword => {
    formData.keywords = formData.keywords.filter(k => k !== removedKeyword);
};

const beforeUpload = (file, type) => {
    formData.error = '';
    return new Promise((resolve, reject) => {
        const isLt5M = file.size / 1024 / 1024 <= 5;
        const isLt300KB = file.size <= 300000;
        if (type === 'big' && !isLt5M) {
            file.status = 'error';
            formData.errorBigImage = 'Size';
            return reject(false);
        }

        if (type === 'small' && !isLt300KB) {
            file.status = 'error';
            formData.errorSmallImage = 'Size';
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
                    if (type === 'big') {
                        formData.errorBigImage = '';
                    } else {
                        formData.errorSmallImage = '';
                    }
                } else {
                    if (type === 'big') {
                        formData.errorBigImage = 'Aspect Ratio';
                    } else {
                        formData.errorSmallImage = 'Aspect Ratio';
                    }
                }
                return resolve(true);
            }
        }
    })
};

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage('NEWS', file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                switch (data.type) {
                    case 'big':
                        formData.bigImage = [{
                            name: responseData.data.filename,
                            file: file,
                            status: 'done',
                            response: responseData,
                            url: getImageUrlByName(responseData.data.filename)
                        }];
                        return;
                    case 'small':
                        formData.smallImage = [{
                            name: responseData.data.filename,
                            file: file,
                            status: 'done',
                            response: responseData,
                            url: getImageUrlByName(responseData.data.filename)
                        }];
                        return;
                }
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
                    formData.smallImage = [];
                    return;
            }
        });
};

const handleRemoveImage = file => {
    removeImage(file.name);
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

const handleConfirm = (confirmed) => {
    const newsId = router.currentRoute.value.params.newsId;
    state.confirmLoading = true;
    const request = (() => {
        switch (state.typeModal) {
            case 'APPROVE':
                const bodyApprove = {
                    approved: confirmed,
                    ...(state.reason && {reason: state.reason})
                };
                return approveNews(newsId, bodyApprove);

            case 'PUBLIC':
                const bodyPublic = {
                    posted: confirmed,
                    ...(state.reason && {reason: state.reason})
                };
                return publicNews(newsId, bodyPublic);

            case 'DISMISS':
                const bodyDismiss = {
                    ...(state.reason && {reason: state.reason})
                };
                return dismissNews(newsId, bodyDismiss);

            case 'DELETE':
                if (confirmed) {
                    return deleteNews(newsId);
                }
                return;
        }
    })();
    request.then(response => {
        const responseData = handleResponse(response.status, response.data);
        state.confirmLoading = false;
        if (responseData) {
            showToast('success', 'Thao tác thành công');
            router.push('/news');
            resetModal();
        }
    })
};

const handleAction = (actionStr) => {
    const createOrEditAction = ['CREATE_NEWS', 'UPDATE_NEWS', 'DELETE_NEWS', 'CREATE_DRAFT_NEWS', 'UPDATE_DRAFT_NEWS'];
    if (createOrEditAction.includes(actionStr)) {
        return 'Soạn thảo tin tức';
    }

    if (actionStr.includes('APPROVE_NEWS')) {
        return 'Phê duyệt tin tức';
    }

    if (actionStr.includes('PUBLIC_NEWS')) {
        return 'Duyệt đăng tin tức';
    }

    if (actionStr === 'DISMISS_NEWS') {
        return 'Gỡ tin tức';
    }
};

const handleOperation = (actionStr) => {
    switch (actionStr) {
        case 'CREATE_NEWS':
            return 'Tạo mới tin tức';
        case 'APPROVE_NEWS_WAITING_POSTED':
            return 'Phê duyệt';
        case 'PUBLIC_NEWS_POSTED':
            return 'Đăng tin';
        case 'APPROVE_NEWS_REJECTED':
        case 'PUBLIC_NEWS_REJECTED':
            return 'Từ chối';
        case 'DISMISS_NEWS':
            return 'Gỡ tin';
        case 'UPDATE_DRAFT_NEWS':
            return 'Chỉnh sửa tin nháp';
        case 'CREATE_DRAFT_NEWS':
            return 'Tạo tin nháp';
        case 'UPDATE_NEWS':
            return 'Chỉnh sửa tin tức';
        case 'DELETE_NEWS':
            return 'Xoá tin tức'
    }
};

const handleTableChange = (page) => {
    getHistoryTableData({
            targetPage: page,
            pageSize: stateHistory.pageSize
        }
    );
};

const getHistoryTableData = options => {
    const {targetPage, pageSize} = options;
    getHistories(targetPage, pageSize, `&filters[entity]=news&filters[entityId]=${router.currentRoute.value.params.newsId}`)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                stateHistory.historyTableData = responseData.data.docs.map(h => {
                    return {
                        id: h._id,
                        entity: h.entity,
                        action: handleAction(h.action),
                        operation: handleOperation(h.action),
                        createdBy: h.actionBy,
                        createdAt: dateTimeFormatString(h.createdAt),
                        comment: h.reason
                    }
                });
                stateHistory.current = responseData.data.page;
                stateHistory.total = responseData.data.totalDocs;
            }
        })
        .catch(error => {
            console.log('Lấy dữ liệu lịch sử phê duyệt thất bại,', error);
        });
};

const onShowSizeChange = (currentPage, size) => {
    stateHistory.current = currentPage;
    stateHistory.pageSize = size;
};

const cancelPreview = () => {
    state.previewVisible = false;
    state.previewImage = ''
};

const handlePreview = file => {
    state.previewVisible = true;
    state.previewImage = file.url;
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
</script>
