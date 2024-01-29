<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>

  <div class="bg-white p-10">
    <TitlePage label="Sự kiện - Tin tức - Thư viện"/>
    <a-form :model="formData"
            :validate-messages="validateMessages"
            autocomplete="off"
            layout="vertical"
            name="form_data"
            @finish="onFinish">
      <a-row :gutter="[50]">
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Tiêu đề Tiếng Việt"
                       name="title">
            <a-input v-model:value="formData.title"
                     :maxlength="255"
                     placeholder="Tiêu đề"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Tiêu đề Tiếng Anh"
                       name="titleEn">
            <a-input v-model:value="formData.titleEn"
                     :maxlength="255"
                     placeholder="Tiêu đề"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Chuyên mục"
                       name="category">
            <a-select v-model:value="formData.category"
                      :options="optionsCategory"
                      allow-clear
                      placeholder="Chuyên mục"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Ngày đăng"
                       name="releaseDate">
            <a-date-picker v-model:value="formData.releaseDate"
                           class="w-full"
                           format="YYYY-MM-DD"
                           placeholder="Chọn ngày đăng"
                           valueFormat="YYYY-MM-DD"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="Độ ưu tiên" name="priority">
            <a-input-number :min="0" v-model:value="formData.priority" placeholder="Nhập độ ưu tiên" class="w-full"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="Tin nổi bật"
                       name="hotNews">
            <a-checkbox v-model:checked="formData.hotNews"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24" v-if="formData.hotNews">
          <a-form-item :rules="[{required: formData.hotNews}]"
                       label="Mô tả Tiếng Việt"
                       name="description">
            <a-textarea v-model:value="formData.description"
                        :rows="4"
                        placeholder="Mô tả bài viết"/>
          </a-form-item>
          <a-form-item :rules="[{required: formData.hotNews}]"
                       label="Mô tả Tiếng Anh"
                       name="descriptionEn">
            <a-textarea v-model:value="formData.descriptionEn"
                        :rows="4"
                        placeholder="Mô tả bài viết"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Ảnh"
                       name="image">
            <div>
              <a-upload v-model:file-list="formData.image"
                        :before-upload="file => beforeUpload(file)"
                        :custom-request="uploadFile"
                        :max-count="1"
                        accept=".png, .jpg, .jpeg"
                        list-type="picture-card"
                        name="bigImage"
                        @preview="file => open(file, 'IMAGE_URL')">
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
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Nguồn"
                       name="source">
            <a-input v-model:value="formData.source"
                     :maxlength="255"
                     placeholder="Nguồn"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="[{required: true}]"
                       label="Loại nội dung"
                       name="contentType">
            <a-select v-model:value="formData.contentType"
                      :options="optionContentType"
                      placeholder="Loại nội dung">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <div v-if="formData.contentType === contentTypeEnum.HTML">
            <a-form-item :rules="[{required: true}]"
                         label="Nội dung Tiếng Việt"
                         name="content">
              <div class="w-full">
                <quill-editor ref="quill"
                              v-model:content="formData.content"
                              :modules="ModulesEditor"
                              :toolbar="toolbar"
                              class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                              content-type="html">
                </quill-editor>
              </div>
            </a-form-item>
            <a-form-item :rules="[{required: true}]"
                         label="Nội dung Tiếng Anh"
                         name="contentEn">
              <div class="w-full">
                <quill-editor ref="quill"
                              v-model:content="formData.contentEn"
                              :modules="ModulesEditor"
                              :toolbar="toolbar"
                              class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                              content-type="html">
                </quill-editor>
              </div>
            </a-form-item>
          </div>
          <a-form-item v-else
                       :rules="[{required: true}]"
                       label="Nội dung"
                       name="link">
            <a-input v-model:value="formData.link" placeholder="Link (https:www.content.com)"/>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="flex space-x-5 justify-end">
        <a-button @click="handleCancel">
          Huỷ
        </a-button>
        <a-button v-if="state.isEdit"
                  danger
                  @click="showConfirm({title: 'Xoá hoạt động', type: 'DELETE'})">
          Xoá
        </a-button>
        <a-button v-if="formData.status === '' || formData.status === statusEnum.DRAFT"
                  :loading="state.loadingDraft"
                  type="dashed"
                  @click="handleDraft">
          Lưu nháp
        </a-button>
        <a-form-item>
          <a-button :loading="state.loading"
                    class="bg-[#1677ff]"
                    html-type="submit"
                    type="primary">
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
      <a-button class="bg-[#1677ff]"
                type="primary"
                @click="handleConfirm(true)">
        Xác nhận
      </a-button>
    </template>
    <div>
      <span>Bạn xác nhận thực hiện thao tác này?</span>
    </div>
  </a-modal>

  <PreviewModal/>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { handleResponse } from "../../../services/commonService";
import { uploadImage } from "../../../services/uploadFile";
import { PlusOutlined } from "@ant-design/icons-vue";
import { showToast } from "../../../utils/showToast";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb.vue";
import { QuillEditor } from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ModulesEditor } from "../../../constants/modulesEditor";
import { ToolbarEditor } from "../../../constants/toolbarEditor";
import TitlePage from "../../../components/TitlePage.vue";
import { createPost, deletePost, getById, saveForm, updatePost } from "../../../services/activity";
import PreviewModal from "../../../components/PreviewModal.vue";
import { open } from "../../../utils/previewerUtils";
import { handleGoogleImageLink } from "../../../utils/handleGoogleImageLink";

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
  titleVi: '',
  titleEn: '',
  status: '',
  category: null,
  hotNews: false,
  descriptionVi: '',
  descriptionEn: '',
  image: [],
  contentVi: '',
  contentEn: '',
  link: '',
  errorImage: '',
  contentType: null,
  releaseDate: '',
  source: '',
  priority: 0
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
  formData.titleEn = '';
  formData.category = null;
  formData.releaseDate = '';
  formData.image = [];
  formData.content = '';
  formData.contentEn = '';
  formData.link = '';
  formData.errorImage = '';
  formData.source = '';
  formData.hotNews = false;
  formData.description = '';
  formData.descriptionEn = '';
  formData.priority = 0;

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
            formData.hotNews = responseData.hot_news ? responseData.hot_news : false;
            formData.description = responseData.description
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
            url: handleGoogleImageLink(responseData.image),
            status: 'done'
          }] : [];
          formData.releaseDate = responseData.release_date;
          formData.contentType = responseData.content_type;
          formData.source = responseData.source
          formData.content = responseData.content_type === 'HTML' ? responseData.content : '';
          formData.link = responseData.content_type === 'LINK' ? responseData.content : '';
          formData.errorImage = '';
          formData.hotNews = responseData.hot_news ? responseData.hot_news : false;
          formData.description = responseData.description
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
  if (formData.titleVi === '') {
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
      titleEn: formData.titleEn,
      category: formData.category,
      image: formData.image.length !== 0 ? formData.image[0].url : null,
      content: formData.contentType === contentTypeEnum.HTML ? formData.content : formData.link,
      contentEn: formData.contentType === contentTypeEnum.HTML ? formData.contentEn : formData.link,
      content_type: formData.contentType,
      release_date: formData.releaseDate,
      hot_news: formData.hotNews,
      ...(formData.hotNews && {description: formData.description}),
      ...(formData.hotNews && {descriptionEn: formData.descriptionEn}),
      priority: formData.priority
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
        titleEn: formData.titleEn,
        category: formData.category,
        image: formData.image.length !== 0 ? formData.image[0].url : null,
        content: formData.contentType === contentTypeEnum.HTML ? formData.content : formData.link,
        contentEn: formData.contentType === contentTypeEnum.HTML ? formData.contentEn : formData.link,
        content_type: formData.contentType,
        release_date: formData.releaseDate,
        hot_news: formData.hotNews,
        ...(formData.hotNews && {description: formData.description}),
        ...(formData.hotNews && {descriptionEn: formData.descriptionEn}),
        priority: formData.priority
      }
    };

    executeActivityAPI(body);
  }
};

const executeActivityAPI = (body) => {
  state.loading = true;
  const request = formData.id !== 0 ? updatePost({...body, id: formData.id}) : createPost(body);
  request
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          showToast('success', formData.id !== 0 ? 'Chỉnh sửa thành công' : 'Tạo mới thành công');
          resetForm();
          router.push('/activities')
        }
      })
      .catch(error => {
        console.log('Lỗi khi tạo hoạt động', error);
        showToast('error', formData.id !== 0 ? 'Chỉnh sửa thất bại' : 'Tạo mới thất bại');
        handleResponse(error.response.status, error.response.data)
      })
      .finally(() => {
        state.loading = false;
      })
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
            url: handleGoogleImageLink(responseData.data.file_url)
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
  request
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          showToast('success', 'Thao tác thành công');
          router.push('/activities');
          resetModal();
        }
      })
      .catch((err) => {
        console.log(err)
        handleResponse(err.response.status, err.response.data)
      })
      .finally(() => {
        state.confirmLoading = false;
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
