<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white mt-2 p-5">
        <div class="text-2xl font-bold mb-5">
            Quản lý Banner
        </div>
        <a-form name="form_banners"
                layout="vertical"
                :model="formDataBanners"
                @finish="handleOk">
            <a-row v-for="(banner, index) in formDataBanners.banners"
                   :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }"
                   :key="banner.id"
                   class="mb-5">
                <a-col :md="6" :xs="24" class="items-end justify-start flex">
                    <a-form-item :name="['banners', index, 'fileList']"
                                 :rules="{required: true, message: 'Trường ảnh là bắt buộc'}">
                        <div>
                            <div>
                                <a-upload v-model:file-list="banner.fileList"
                                          accept=".png, .jpg, .jpeg"
                                          name="file_upload"
                                          list-type="picture-card"
                                          :data="{index: index}"
                                          :max-count="1"
                                          :before-upload="(file) => beforeUpload(file, index)"
                                          :custom-request="uploadFile"
                                          @preview="handlePreview"
                                          @remove="handleRemoveBanner">
                                    <div>
                                        <loading-outlined v-if="state.loading"/>
                                        <plus-outlined v-else/>
                                        <div class="ant-upload-text">Upload</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="italic">Vui lòng sử dụng ảnh tỉ lệ: 16:9</div>
                            <div class="text-orange-500 text-sm">{{ banner.error }}</div>
                        </div>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :xs="24">
                    <a-form-item label="Kiểu liên kết"
                                 name="link_type">
                        <a-select ref="select"
                                  v-model:value="banner.linkType"
                                  :options="optionsLinkType">
                        </a-select>
                    </a-form-item>
                    <a-form-item v-if="banner.linkType === 'url'"
                                 label="URL"
                                 name="url">
                        <a-input v-model:value="banner.url"
                                 placeholder="https://..."/>
                    </a-form-item>
                    <a-form-item v-else-if="banner.linkType === 'post'"
                                 label="Chọn bài viết"
                                 name="post">
                        <a-select v-model:value="banner.news"
                                  placeholder="Nhập và chọn bài viết"
                                  showSearch
                                  :filter-option="false"
                                  :not-found-content="state.fetchingData ? undefined : null"
                                  :options="banner.optionsNews"
                                  @search="(e) => fetchNews(e, index)">
                            <template v-if="state.fetchingData" #notFoundContent>
                                <a-spin size="small"/>
                            </template>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="6" :xs="24">
                    <a-form-item label="Từ ngày">
                        <a-date-picker v-model:value="banner.activeTime"
                                       class="w-full"
                                       show-time
                                       :showNow="false"
                                       format="YYYY-MM-DD HH:mm"
                                       placeholder="Ngày bắt đầu"/>
                    </a-form-item>
                    <a-form-item label="Đến ngày">
                        <a-date-picker v-model:value="banner.deactivateTime"
                                       class="w-full"
                                       show-time
                                       :showNow="false"
                                       format="YYYY-MM-DD HH:mm"
                                       placeholder="Ngày kết thúc"/>
                    </a-form-item>
                </a-col>
                <a-col :md="3" :xs="24">
                    <a-form-item label="Thứ tự hiển thị"
                                 :name="['banners', index, 'orderNo']"
                                 :rules="[{trigger: ['change', 'blur'], validator: validateOrderNo}]">
                        <a-input-number v-model:value="banner.orderNo"
                                        :min="1"
                                        :max="5"
                                        placeholder="Thứ tự"/>
                    </a-form-item>
                </a-col>
                <a-col :md="1" :xs="24" class="items-center justify-start flex">
                    <a-form-item>
                        <a-button type="text"
                                  shape="circle"
                                  danger
                                  @click="removeRow(banner)"
                                  :disabled="formDataBanners.banners.length === 1">
                            <minus-circle-outlined/>
                        </a-button>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item>
                <a-button v-if="formDataBanners.banners.length < 5"
                          type="dashed"
                          @click="addRow">
                    <plus-outlined/>
                    Thêm ảnh
                </a-button>
            </a-form-item>
            <div class="flex justify-end space-x-2">
                <a-button key="back" @click="handleCancel">Huỷ</a-button>
                <a-button key="submit"
                          type="primary"
                          html-type="submit"
                          :loading="state.loading">
                    Lưu
                </a-button>
            </div>
        </a-form>
    </div>

    <a-modal :visible="state.previewVisible" title="Preview" :footer="null" @cancel="cancelPreview">
        <img alt="preview" class="w-full" :src="state.previewImage"/>
    </a-modal>
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {onMounted} from "vue";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {removeImage, uploadImage} from "../../services/uploadFile";
import {createBanner, deleteBanner, editBanner, getBanners} from "../../services/banner";
import {showToast} from "../../utils/showToast";
import {getImageUrlByName} from "../../utils/getImageUrl";
import {handleResponse} from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {debounce} from "lodash-es";
import {getAllNews} from "../../services/news";
import dayjs from "dayjs";
import axios from "axios";

const optionsLinkType = [
    {value: 'url', label: 'Web URL'},
    {value: 'post', label: 'Bài viết'}
];

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý banner', to: '/banner'}
];

const state = reactive({
    loading: false,
    uploadLoading: false,
    fetchingData: false,
    bannerToDelete: [],
    previewVisible: false,
    previewImage: ''
});

const formDataBanners = reactive({
    banners: [{
        id: '0',
        fileList: [],
        linkType: 'url',
        url: '',
        news: '',
        orderNo: '',
        optionsNews: [],
        activeTime: dayjs(),
        deactivateTime: null,
        error: ''
    }]
});

onMounted(() => {
    resetFormData();
    // getBannerData();
});

const resetFormData = () => {
    state.bannerToDelete = [];
    formDataBanners.banners = [{
        id: '0',
        fileList: [],
        linkType: 'url',
        url: '',
        news: '',
        orderNo: '',
        optionsNews: [],
        activeTime: dayjs(),
        deactivateTime: null,
        error: ''
    }];
};

const fetchNews = debounce((value, index) => {
    state.fetchingData = true;
    getAllNews(1, 1000, `&filters[search]=${value}`)
        .then(response => {
            state.fetchingData = false;
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formDataBanners.banners[index].optionsNews = responseData.data.docs.map(n => {
                    return {
                        label: n.title,
                        value: n._id
                    }
                })
            }
        });
}, 300);

const handleOk = () => {
    const isValidBanners = formDataBanners.banners.every(b => b.error === '' || b.error === 'Tỉ lệ ảnh không đúng');
    if (isValidBanners) {
        state.loading = true;

        const createOrEditRequests = formDataBanners.banners.map(b => {
            const body = {
                type: b.linkType,
                imageFileName: b.fileList[0].name,
                post: b.news,
                url: b.url,
                orderNo: b.orderNo,
                ...(b.activeTime && {activeTime: b.activeTime.format('YYYY-MM-DD HH:mm')}),
                ...(b.deactivateTime && {deactivateTime: b.deactivateTime.format('YYYY-MM-DD HH:mm')}),
            }
            return b.id !== '0' ? editBanner(b.id, body) : createBanner(body);
        });
        const deleteRequests = state.bannerToDelete.filter(b => b.id !== '0').map(b => deleteBanner(b.id));
        const requests = createOrEditRequests.concat(deleteRequests);

        axios.all(requests).then(responses => {
            const responseData = responses.map(r => handleResponse(r.status, r.data));
            const isSuccessAll = responseData.every(r => r !== null);
            if (isSuccessAll) {
                state.loading = false;
                state.bannerToDelete = [];
                showToast('success', 'Lưu banner thành công');
                getBannerData();
            }
        }).catch(err => {
            state.loading = false;
            console.log(err);
            showToast('error', 'Có lỗi xảy ra');
        });
    } else {
        showToast('error', 'Có ảnh bị lỗi, hãy xem lại')
    }
};

const cancelPreview = () => {
    state.previewVisible = false;
    state.previewImage = ''
};

const handlePreview = (file) => {
    state.previewVisible = true;
    state.previewImage = file.url;
};

const handleCancel = () => {
    resetFormData();
    getBannerData();
};

const removeRow = (item) => {
    let index = formDataBanners.banners.indexOf(item);
    if (index !== -1) {
        state.bannerToDelete.push(item)
        formDataBanners.banners.splice(index, 1);
    }
};

const addRow = () => {
    formDataBanners.banners.push({
        id: '0',
        fileList: [],
        linkType: 'url',
        url: '',
        news: '',
        orderNo: '',
        optionsNews: [],
        activeTime: dayjs(),
        deactivateTime: null,
        error: ''
    });
};

const beforeUpload = (file, index) => {
    formDataBanners.banners[index].error = '';
    formDataBanners.banners[index].fileList = [];
    return new Promise((resolve, reject) => {
        const isLt5M = file.size / 1024 / 1024 <= 5;
        if (!isLt5M) {
            file.status = 'error';
            formDataBanners.banners[index].error = 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.';
            reject(false)
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
                    formDataBanners.banners[index].error = '';
                } else {
                    formDataBanners.banners[index].fileList = [];
                    formDataBanners.banners[index].error = 'Tỉ lệ ảnh không đúng';
                    file.status = 'error';
                }
                resolve(true);
            }
        }
    })
};

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage('BANNERS', file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formDataBanners.banners[data.index].fileList = [{
                    name: responseData.data.filename,
                    status: 'done',
                    response: responseData,
                    url: getImageUrlByName(responseData.data.filename)
                }]
            } else {
                formDataBanners.banners[data.index].error = 'Upload ảnh đến server bị lỗi';
                const error = new Error('Uploaded Failed');
                onError(error);
            }
        })
        .catch(error => {
            console.log('Upload banner thất bại, ', error);
            onError(error);
        });
};

const handleRemoveBanner = (file) => {
    removeImage(file.name);
};

const getBannerData = () => {
    getBanners(1, 10)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData && responseData.data.length !== 0) {
                formDataBanners.banners = responseData.data.map(b => {
                    return {
                        id: b._id,
                        fileList: [{
                            name: b.imageFileName,
                            status: 'done',
                            url: getImageUrlByName(b.imageFileName)
                        }],
                        linkType: b.type,
                        url: b.type === 'url' ? b.url : '',
                        news: b.type === 'post' ? b.post._id : '',
                        optionsNews: b.type === 'post' ? [{label: b.post.title, value: b.post._id}] : [],
                        orderNo: b.orderNo,
                        activeTime: b.activeTime ? dayjs(b.activeTime) : null,
                        deactivateTime: b.deactivateTime ? dayjs(b.deactivateTime) : null,
                        error: ''
                    }
                })
            }
        })
        .catch(error => {
            console.log('Lấy danh sách banner bị lỗi, ', error);
            showToast('error', 'Lấy danh sách banner thất bại');
        });
};

const validateOrderNo = async (_rule, value) => {
    const checkDuplicate = () => {
        const index = parseInt(_rule.field.split('.')[1]);
        const anotherBanners = formDataBanners.banners.filter((e, i) => i !== index);
        return anotherBanners.some(b => b.orderNo === value.toString());
    };

    if (value === null || value === '') {
        return Promise.reject('Thứ tự là bắt buộc');
    } else if (checkDuplicate()) {
        return Promise.reject('Thứ tự không được trùng nhau')
    } else {
        return Promise.resolve()
    }
};
</script>
