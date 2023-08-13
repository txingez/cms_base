<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>

  <div class="bg-white mt-2 p-5">
    <div class="text-2xl font-bold mb-5">
      Quản lý Popup
    </div>
    <a-form name="dynamic_form_item"
            layout="vertical"
            :model="formData"
            @finish="handleOk">
      <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <a-col :md="6" :xs="24" class="items-end justify-start flex">
          <a-form-item name="popupImage"
                       :rules="[{required: true, message: 'Trường ảnh là bắt buộc'}]">
            <div>
              <div>
                <a-upload v-model:file-list="formData.popupImage"
                          accept=".png, .jpg, .jpeg"
                          name="file_upload"
                          list-type="picture-card"
                          :max-count="1"
                          :custom-request="uploadFile"
                          :before-upload="beforeUpload"
                          @preview="handlePreview"
                          @remove="handleRemovePopup">
                  <img v-if="formData.imageUrl" :src="formData.imageUrl" alt="avatar"/>
                  <div v-else>
                    <loading-outlined v-if="state.loading"/>
                    <plus-outlined v-else/>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </div>
              <div class="italic">Vui lòng sử dụng ảnh tỉ lệ 3:4</div>
              <div class="text-orange-500 text-xs" v-if="formData.error !== ''">{{ formData.error }}</div>
            </div>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="Kiểu liên kết"
                       name="linkType">
            <a-select ref="select"
                      v-model:value="formData.linkType"
                      :options="optionsLinkType">
            </a-select>
          </a-form-item>
          <a-form-item label="URL"
                       v-if="formData.linkType === 'url'"
                       name="url">
            <a-input v-model:value="formData.url"
                     placeholder="https://..."/>
          </a-form-item>
          <a-form-item label="Chọn bài viết"
                       v-else-if="formData.linkType === 'post'"
                       name="news">
            <a-select v-model:value="formData.news"
                      class="w-full"
                      placeholder="Nhập và chọn bài viết"
                      showSearch
                      :filter-option="false"
                      :not-found-content="state.fetchingData ? undefined : null"
                      :options="newsData"
                      @search="fetchNews">
              <template v-if="state.fetchingData" #notFoundContent>
                <a-spin size="small"/>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="Từ ngày">
            <a-date-picker v-model:value="formData.activeTime"
                           class="w-full"
                           show-time
                           :showNow="false"
                           format="YYYY-MM-DD HH:mm"
                           placeholder="Ngày bắt đầu"/>
          </a-form-item>
          <a-form-item label="Đến ngày">
            <a-date-picker v-model:value="formData.deactivateTime"
                           class="w-full"
                           show-time
                           :showNow="false"
                           format="YYYY-MM-DD HH:mm"
                           placeholder="Ngày kết thúc"/>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="flex justify-end space-x-2">
        <a-button @click="handleCancel">Huỷ</a-button>
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
import {onMounted, ref} from "vue";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {showToast} from "../../utils/showToast";
import {getImageUrlByName} from "../../utils/getImageUrl";
import {handleResponse} from "../../services/commonService";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {createPopup, editPopup, getPopups} from "../../services/popup";
import {getAllNews} from "../../services/news";
import {debounce} from "lodash-es";
import dayjs from "dayjs";
import {removeImage, uploadImage} from "../../services/uploadFile";

const optionsLinkType = [
  {value: 'url', label: 'Web URL'},
  {value: 'post', label: 'Bài viết'}
];

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý popup', to: '/popup'}
];

const state = reactive({
  loading: false,
  uploadLoading: false,
  fetchingData: false,
  previewVisible: false,
  previewImage: ''
});

const formData = reactive({
  id: '0',
  popupImage: [],
  linkType: 'url',
  url: '',
  news: '',
  activeTime: null,
  deactivateTime: null,
  error: ''
});

const newsData = ref([]);

onMounted(() => {
  resetFormData();
  // getPopupData();
});

const fetchNews = debounce(value => {
  state.fetchingData = true;
  getAllNews(1, 1000, `&filters[search]=${value}`)
      .then(response => {
        state.fetchingData = false;
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          newsData.value = responseData.data.docs.map(n => {
            return {
              label: n.title,
              value: n._id
            }
          })
        }
      });
}, 500);

const resetFormData = () => {
  formData.id = '0';
  formData.popupImage = [];
  formData.linkType = 'url';
  formData.url = '';
  formData.news = '';
  formData.activeTime = null;
  formData.deactivateTime = null;
  formData.error = '';
};

const handleOk = () => {
  if (formData.error !== 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.') {
    state.loading = true;

    const body = {
      imageFileName: formData.popupImage[0].name,
      type: formData.linkType,
      url: formData.linkType === 'url' ? formData.url : null,
      link: formData.linkType === 'post' ? formData.news : null,
      ...(formData.activeTime && {activeTime: formData.activeTime.format('YYYY-MM-DD HH:mm')}),
      ...(formData.deactivateTime && {deactivateTime: formData.deactivateTime.format('YYYY-MM-DD HH:mm')})
    };

    const request = formData.id !== '0' ? editPopup(formData.id, body) : createPopup(body);
    request.then(response => {
      const responseData = handleResponse(response.status, response.data);
      state.loading = false;
      if (responseData) {
        formData.id = responseData.data._id;
        showToast('success', 'Lưu popup thành công');
      }
    }).catch(error => {
      console.log('Lưu popup bị lỗi, ', error);
      state.loading = false;
      showToast('error', 'Lưu popup thất bại');
    })
  } else {
    showToast('error', 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.');
  }
};

const handleCancel = () => {
  resetFormData();
  getPopupData();
};

const handlePreview = (file) => {
  state.previewVisible = true;
  state.previewImage = file.url;
};

const cancelPreview = () => {
  state.previewVisible = false;
  state.previewImage = '';
};

const beforeUpload = (file) => {
  formData.error = '';
  return new Promise((resolve, reject) => {
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      file.status = 'error';
      formData.error = 'Vui lòng sử dụng ảnh dung lượng tối đa 5MB.';
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
        if ((width / height) === (4 / 3)) {
          file.status = 'done';
          formData.error = '';
        } else {
          file.status = 'error';
          formData.error = 'Tỉ lệ ảnh không đúng';
        }
        resolve(true);
      }
    }
  })
};

const uploadFile = (options) => {
  const {onError, file, onProgress} = options;

  uploadImage('POPUPS', file, onProgress)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          formData.popupImage = [{
            name: responseData.data.filename,
            status: 'done',
            response: responseData,
            url: getImageUrlByName(responseData.data.filename)
          }];
        } else {
          const error = new Error('Uploaded Failed');
          onError(error);
        }
      })
      .catch(error => {
        console.log('Upload popup thất bại, ', error);
        onError(error);
      });
};

const handleRemovePopup = file => removeImage(file.name);

const getPopupData = () => {
  getPopups(1, 10)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData && responseData.data.docs.length !== 0) {
          const data = responseData.data.docs[0];
          formData.id = data._id;
          formData.popupImage = [{
            name: data.imageFileName,
            status: 'done',
            url: getImageUrlByName(data.imageFileName)
          }];
          formData.linkType = data.type;
          formData.url = data.type === 'url' ? data.url : '';
          formData.news = data.type === 'post' ? data.link._id : '';
          newsData.value = data.type === 'post'
              ? [{value: data.link._id, label: data.link.title}]
              : [];
          formData.activeTime = data.activeTime ? dayjs(data.activeTime) : null
          formData.deactivateTime = data.deactivateTime ? dayjs(data.deactivateTime) : null;
          formData.error = '';
        } else {
          formData.activeTime = dayjs();
        }
      })
      .catch(error => {
        console.log('Lấy dữ liệu popup bị lỗi, ', error);
        showToast('error', 'Lấy dữ liệu popup thất bại');
      });
};
</script>
