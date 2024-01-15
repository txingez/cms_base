<script setup>

import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import { reactive } from "@vue/reactivity";
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { onMounted } from "vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { uploadImage } from "../../services/uploadFile";
import { handleResponse } from "../../services/commonService";
import { previewer } from "../../stores/previewer";
import PreviewHomePage from "../../components/PreviewHomePage.vue";
import { getByPageID, saveData } from "../../services/homePage";
import { showToast } from "../../utils/showToast";
import { ModalConfirm } from "../../components/ModalConfirm";
import { Buffer } from "buffer";
import { handleGoogleImageLink } from "../../utils/handleGoogleImageLink";

const previewerStore = previewer()

// const introduction = ref(null);
// const toolbarIntroduction = computed(() => ToolbarEditor(introduction))

const ICONS_MISSION = [
  'https://lh3.googleusercontent.com/pw/AIL4fc92P1hsYz1B1HrZGloCO4Vl-uylzW_NojqXDFFHdCoPdITZZh2zy7_IU4iedZGBDwxdP4fl29usb1aFqNoH1yXJUEHAOMNUs0If04ZC6cvsytd95KhHvsldVctuREiljFeOJ-jIPCOPUOSkcnzvt9GN=w249-h256-s-no?authuser=0',
  'https://lh3.googleusercontent.com/pw/AIL4fc9SZVX44PkbLTDWFQdGFt58Hs9n5WW4yOVj8RFqKpzTDBawzoHEp4Sbz5B2avJvEh4krJismHBLfADwAejQwpR4-Wf2y-2CM50ERRbl-yNDXZiRMBK15HQqeLTkKs5WFe5kumpBK6ZyIs44_1ZpIGHi=w256-h256-s-no?authuser=0',
  'https://lh3.googleusercontent.com/pw/AIL4fc-vuqx4NdQb9LsnkMpNAT0HYYQi84EJ6ORCvfLBxWQ-mlwF7XMv8_8VHZVBXncRxHw35VJKz3Eq2rDK7RCvcSLw-jNqXDWtnanC5JgJNl2CNU_z2WosOL8QSClPsNncNkj45NkOR0XzDKtH8krRHQp7=w246-h256-s-no?authuser=0',
  'https://lh3.googleusercontent.com/pw/AIL4fc9-Uq_LYLtlIoDHqOgxz89mMzB5Uts2ero9SGVGDLMopMSs3u-1VTDPVWur03cPu5XsFi0nshTD24gSdZbUyG13NajHEYf4oGrMfUQzsKetM8Mb4tWjMPhxSOkkY47JbO7h0V0Ba5jsdCt75DtaXs5c=w500-h500-s-no?authuser=0'
]

const formState = reactive({
  bannerSlides: [
    {title: '', description: '', target: '', image: [], placeTitle: '', labelBtn: 'Thông tin chi tiết'}
  ],
  introduction: {videoURL: '', description: ''},
  homePageTitle: {title: '', description: ''},
  titleMission: '',
  imageMission: [],
  missions: [
    {title: '', content: ''}
  ],
  descriptionEvaluate: '',
  stories: [
    {description: '', image: []}
  ],
  evaluateSlides: [
    {title: '', target: '', image: []}
  ]
})

const otherState = reactive({
  missionsToDelete: [],
  slidesToDelete: [],
  bannerToDelete: [],
  storyToDelete: [],
  loading: false
})

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý trang chủ', to: '/management_home'}
];
const pid = 'HOME'
const mission = 'MISSION'

const validateMessages = {
  required: "Thông tin này là bắt buộc",
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

const removeStory = (item) => {
  let index = formState.stories.indexOf(item);
  if (index !== -1) {
    otherState.storyToDelete.push(item)
    formState.stories.splice(index, 1);
  }
}

const removeBannerSlide = (item) => {
  let index = formState.bannerSlides.indexOf(item);
  if (index !== -1) {
    otherState.bannerToDelete.push(item)
    formState.bannerSlides.splice(index, 1);
  }
}

const addEvaluateSlide = () => {
  formState.evaluateSlides.push({title: '', target: '', image: []});
};

const addBannerSlide = (index) => {
  formState.bannerSlides.push({
    title: '',
    description: '',
    target: '',
    image: [],
    placeTitle: index === 2 ? 'center' : 'left-bottom',
    labelBtn: 'Thông tin chi tiết'
  });
};

const addStory = (index) => {
  formState.stories.push({description: '', image: []});
};


const uploadFile = (options) => {
  const {onError, data, file, onProgress} = options;

  uploadImage(file, onProgress)
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        console.log(responseData)
        if (!responseData) {
          const error = new Error('Uploaded Failed');
          onError(error);
        }

        if (data.type === pid) {
          formState.bannerSlides[data.index].image = [{
            file: file,
            status: 'done',
            response: responseData,
            url: handleGoogleImageLink(responseData.data.file_url)
          }];
        } else if (data.type === 'story') {
          formState.stories[data.index].image = [{
            file: file,
            status: 'done',
            response: responseData,
            url: handleGoogleImageLink(responseData.data.file_url)
          }];
        } else {
          formState.evaluateSlides[data.index].image = [{
            file: file,
            status: 'done',
            response: responseData,
            url: handleGoogleImageLink(responseData.data.file_url)
          }];
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
        const responseData = handleResponse(response.status, response.data);
        const decodeContent = JSON.parse(Buffer.from(responseData.data.content.split('.')[1], 'base64').toString());
        console.log(JSON.stringify(decodeContent))
        formState.bannerSlides = decodeContent.data.bannerSlides.map(slide => {
          return {
            ...slide, ...{
              image: [{
                status: 'done',
                uid: slide.image[0].uid,
                url: handleGoogleImageLink(slide.image[0].url)
              }]
            }
          }
        })
        formState.introduction = decodeContent.data.introduction
        formState.titleMission = decodeContent.data.titleMission
        formState.imageMission = decodeContent.data.imageMission
        formState.missions = decodeContent.data.missions
        formState.descriptionEvaluate = decodeContent.data.descriptionEvaluate
        formState.evaluateSlides = decodeContent.data.evaluateSlides.map(slide => {
          return {
            ...slide, ...{
              image: [{
                status: 'done',
                uid: slide.image[0].uid,
                url: handleGoogleImageLink(slide.image[0].url)
              }]
            }
          }
        })
        formState.stories = decodeContent.data.stories
        formState.homePageTitle = decodeContent.data.homePageTitle
      })
      .catch((err) => {
        console.log('Lấy dữ liệu thất bại ', err)
        handleResponse(err.response.status, err.response.data)
      })
}
const handlePreview = () => {
  const dataPreview = {
    banner: formState.bannerSlides.map(bl => ({...bl, ...{description: bl.description === '<p><br></p>' ? '' : bl.description}})),
    // introduction: formState.introduction,
    titleMission: formState.titleMission,
    imageMission: formState.imageMission,
    missions: formState.missions.map((mission, index) => ({...mission, ...{icon: ICONS_MISSION[index]}})),
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
    content: {
      ...formState,
      ...{missions: formState.missions.map((mission, index) => ({...mission, ...{icon: ICONS_MISSION[index]}}))},
      ...{bannerSlides: formState.bannerSlides.map(bl => ({...bl, ...{description: bl.description === '<p><br></p>' ? '' : bl.description}}))}
    },
  };

  console.log(JSON.stringify(body));
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

const placeMissionByIndex = (index) => {
  switch (index) {
    case 0:
      return 'trái'
    case 1:
      return 'dưới'
    case 2:
      return 'phải'
    case 3:
      return 'trên'
  }
}
</script>

<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>

  <div class="bg-white p-10">
    <TitlePage label="QUẢN LÝ NỘI DUNG TRANG CHỦ"/>
    <a-form :model="formState" :validate-messages="validateMessages" layout="vertical" @finish="handleSubmit">
      <DividerWithTitle label="Chỉnh sửa banner"/>
      <div v-for="(slide, index) in formState.bannerSlides" class="flex items-center">
        <div class="basis-full">
          <a-form-item :label="['Tiêu đề ', index + 1]" :name="['bannerSlides', index, 'title']"
                       :rules="[{ required: true }]">
            <a-textarea v-model:value="slide.title" rows="3"/>
          </a-form-item>
          <a-form-item :label="['Nội dung ', index + 1]" :name="['bannerSlides', index, 'description']"
                       :rules="[{ required: false }]">
            <a-textarea v-model:value="slide.description" rows="5"/>
          </a-form-item>
          <a-form-item :label="['Đường dẫn  ', index + 1]" :name="['bannerSlides', index, 'target']"
                       :rules="[{ required: false }]">
            <a-input v-model:value="slide.target"
                     placeholder="Đường dẫn (Bỏ trống nếu không đặt đường dẫn cho banner)"/>
          </a-form-item>
          <a-form-item :label="['Tên nút  ', index + 1]" :name="['bannerSlides', index, 'labelBtn']"
                       :rules="[{ required: false }]">
            <a-input v-model:value="slide.labelBtn" placeholder="Tên nút"/>
          </a-form-item>
          <a-form-item :label="['Ảnh nền slide ', index + 1]" :name="['bannerSlides', index, 'image']"
                       :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">
            <a-upload v-model:file-list="slide.image" :custom-request="uploadFile"
                      :data="{ index: index, type: pid }" :max-count="1" accept=".png, .jpg, .jpeg"
                      list-type="picture-card">
              <div v-if="slide.image.length < 2">
                <plus-outlined/>
                <div>Upload</div>
              </div>
            </a-upload>
          </a-form-item>
        </div>
        <a-button :disabled="formState.bannerSlides.length === 1" class="flex items-center justify-center"
                  danger
                  shape="circle" type="text" @click="removeBannerSlide(slide)">
          <minus-circle-outlined/>
        </a-button>
      </div>
      <a-button v-if="formState.bannerSlides.length < 3" class="flex items-center" type="dashed"
                @click="addBannerSlide(formState.bannerSlides.length)">
        <plus-outlined/>
        Thêm slide
      </a-button>
      <DividerWithTitle label="Phần tiêu đề"/>
      <a-form-item :rules="[{ required: true }]" label="Tiêu đề" name="homePageTitle">
        <div class="w-full">
          <a-textarea v-model:value="formState.homePageTitle.title" rows="5"/>
        </div>
      </a-form-item>
      <a-form-item :rules="[{ required: true }]" label="Nội dung" name="homePageTitle">
        <div class="w-full">
          <a-textarea v-model:value="formState.homePageTitle.description" rows="5"/>
        </div>
      </a-form-item>

      <DividerWithTitle label="Phần mục tiêu"/>
      <div v-for="(mission, index) in formState.missions" class="flex items-center">
        <div class="basis-full">
          <!-- <a-form-item :label="['Tiêu đề nhiệm vụ ', index + 1]" :name="['missions', index, 'title']"
              :rules="[{ required: true }]">
              <a-input v-model:value="mission.title" placeholder="Tiêu đề nhiệm vụ" />
          </a-form-item> -->
          <a-form-item :label="['Tiêu đề mục tiêu ', placeMissionByIndex(index)]" :name="['missions', index, 'title']"
                       :rules="[{ required: true }]">
            <div class="w-full">
              <a-textarea v-model:value="mission.title" rows="3"/>
            </div>
          </a-form-item>
          <a-form-item :label="['Nội dung mục tiêu ', placeMissionByIndex(index)]"
                       :name="['missions', index, 'content']"
                       :rules="[{ required: true }]">
            <div class="w-full">
              <a-textarea v-model:value="mission.content" rows="3"/>
            </div>
          </a-form-item>
          <!-- <a-form-item :label="['Icon ', index + 1]"
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
          </a-form-item> -->
        </div>
        <!-- <a-button :disabled="formState.missions.length === 1" class="flex items-center justify-center" danger
                  shape="circle" type="text" @click="removeMission(mission)">
            <minus-circle-outlined/>
        </a-button> -->
      </div>
      <a-button v-if="formState.missions.length < 4" class="flex items-center" type="dashed" @click="addMission">
        <plus-outlined/>
        Thêm nhiệm vụ
      </a-button>

      <DividerWithTitle label="Phần công cụ đánh giá"/>
      <a-form-item label="Mô tả công cụ đánh giá" name="descriptionEvaluate" class="basis-full"
                   :rules="[{ required: true }]">
        <a-textarea v-model:value="formState.descriptionEvaluate" rows="3"/>
      </a-form-item>
      <div v-for="(slide, index) in formState.evaluateSlides" class="flex items-center">
        <div class="basis-full">
          <a-form-item :label="['Tiêu đề ', index + 1]" :name="['evaluateSlides', index, 'title']"
                       :rules="[{ required: true }]">
            <a-textarea v-model:value="slide.title" rows="3"/>
          </a-form-item>
          <a-form-item :label="['Đường dẫn ', index + 1]" :name="['evaluateSlides', index, 'target']"
                       :rules="[{ required: true }]">
            <a-input v-model:value="slide.target" placeholder="Đường dẫn đến biểu mãu đánh giá"/>
          </a-form-item>
          <a-form-item :label="['Ảnh nền slide ', index + 1]" :name="['evaluateSlides', index, 'image']"
                       :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">
            <a-upload v-model:file-list="slide.image" :custom-request="uploadFile" :data="{ index: index }"
                      :max-count="1" accept=".png, .jpg, .jpeg" list-type="picture-card">
              <div v-if="slide.image.length < 2">
                <plus-outlined/>
                <div>Upload</div>
              </div>
            </a-upload>
          </a-form-item>
        </div>
        <a-button :disabled="formState.evaluateSlides.length === 1" class="flex items-center justify-center"
                  danger
                  shape="circle" type="text" @click="removeEvaluateSlide(slide)">
          <minus-circle-outlined/>
        </a-button>
      </div>
      <a-button v-if="formState.evaluateSlides.length < 2" class="flex items-center" type="dashed"
                @click="addEvaluateSlide">
        <plus-outlined/>
        Thêm slide
      </a-button>

      <DividerWithTitle label="Phần giới thiệu"/>
      <a-form-item :rules="[{ required: true }]" label="Nội dung" name="introduction">
        <div class="w-full">
          <a-textarea v-model:value="formState.introduction.description" rows="5"/>
        </div>
      </a-form-item>
      <a-form-item :rules="[{ required: true }]" label="Đường dẫn video" name="introduction">
        <div class="w-full">
          <a-textarea v-model:value="formState.introduction.videoURL" rows="1"/>
        </div>
      </a-form-item>

      <!--            <DividerWithTitle label="Phần câu chuyện về kinh doanh bền vững"/>-->
      <!--            <div v-for="(story, index) in formState.stories" class="flex items-center">-->
      <!--                <div class="basis-full">-->
      <!--                    <a-form-item :label="['Tóm tắt nội dung ', index + 1]" :name="['stories', index, 'description']"-->
      <!--                                 :rules="[{ required: true }]">-->
      <!--                        <a-input v-model:value="story.description" placeholder="Tóm tắt nội dung"/>-->
      <!--                    </a-form-item>-->
      <!--                    <a-form-item :label="['Hình ảnh ', index + 1]" :name="['stories', index, 'image']"-->
      <!--                                 :rules="[{ required: true, message: 'Ảnh chưa được upload' }]">-->
      <!--                        <a-upload v-model:file-list="story.image" :custom-request="uploadFile" :data="{ index: index, type: 'story' }"-->
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

  <PreviewHomePage/>
</template>
