<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {onMounted, reactive} from "vue";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {open} from "../../utils/previewerUtils"
import PreviewModal from "../PreviewModal.vue";
import {uploadImage} from "../../services/uploadFile";
import {handleResponse} from "../../services/commonService";
import {saveData} from "../../services/homePage";
import {showToast} from "../../utils/showToast";

const props = defineProps({
    pageId: String
})

const formState = reactive({
    resources: [
        {id: 0, title: '', description: '', image: []}
    ]
})

const otherState = reactive({
    resourcesToDelete: [],
    loading: false
})


onMounted(() => {
    getComponentData()
})

const getComponentData = () => {

}

const handleSubmit = () => {
    otherState.loading = true

    const createAndEditData = formState.resources.map(r => {
        return {
            ...(r.id !== 0 && {id: r.id}),
            title: r.title,
            description: r.description,
            image: r.image[0].url,
            action: r.id === 0 ? 'CREATE' : 'EDIT'
        }
    })

    const deleteData = otherState.resourcesToDelete.filter(rd => rd.id !== 0).map(rd => {
        return {
            id: rd.id,
            title: rd.title,
            description: rd.description,
            image: rd.image[0].url,
            action: 'DELETE'
        }
    })

    const body = {
        pid: props.pageId,
        resources: [...createAndEditData, ...deleteData]
    }

    saveData(body, 'bo sung sau')
        .then((response) => {
            const handledResponse = handleResponse(response.status, response.data)
            if (handledResponse) {
                otherState.loading = false
                getComponentData()
                showToast('success', 'Success')
            }
        }).catch((err) => {
        otherState.loading = false
        console.log('Lưu resource data thất bại ', err)
        showToast('error', 'Lưu cài đặt thất bại')
    })
}

const removeRow = (item) => {
    let index = formState.resources.indexOf(item);
    if (index !== -1) {
        otherState.resourcesToDelete.push(item)
        formState.resources.splice(index, 1);
    }
}

const addRow = () => {
    formState.resources.push({
        id: 0,
        title: '',
        description: '',
        image: []
    });
};

const uploadFile = (options) => {
    const {onError, data, file, onProgress} = options;

    uploadImage('NEWS', file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formState.resources[data.index].image = [{
                    name: responseData.data.filename,
                    status: 'done',
                    response: responseData,
                    url: responseData.data.image_url
                }]
            } else {
                formState.resources[data.index].error = 'Upload ảnh đến server bị lỗi';
                const error = new Error('Uploaded Failed');
                onError(error);
            }
        })
        .catch(error => {
            console.log('Lỗi khi upload', error);
            formState.image = [];
        });
}

</script>

<template>
    <DividerWithTitle label="Nguồn lực"/>

    <a-form :label-wrap="true"
            label-align="left"
            :label-col="{span: 3}"
            :model="formState"
            @finish="handleSubmit">
        <div class="space-y-5 mb-5">
            <div v-for="(resource, index) in formState.resources"
                 :key="resource.id"
                 class="flex items-center gap-5">
                <div class="basis-full">
                    <a-form-item :name="['resources', index, 'title']"
                                 :label="['Tiêu đề ', index + 1]"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-input v-model:value="resource.title" placeholder="Tiêu đề nguồn lực"/>
                    </a-form-item>
                    <a-form-item :name="['resources', index, 'description']"
                                 :label="['Mô tả ', index + 1]"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-textarea v-model:value="resource.description"
                                    placeholder="Mô tả nguồn lực"
                                    allow-clear
                                    show-count
                                    :maxlength="250"
                                    :rows="5"/>
                    </a-form-item>
                    <a-form-item :name="['resources', index, 'image']"
                                 :label="['Ảnh ', index + 1]"
                                 :rules="[{required: true, message: 'Ảnh chưa được upload'}]">
                        <a-upload v-model:file-list="resource.image"
                                  :data="{index: index}"
                                  accept=".png, .jpg, .jpeg"
                                  list-type="picture-card"
                                  :max-count="1"
                                  @preview="open"
                                  :custom-request="uploadFile">
                            <div v-if="resource.image.length < 2">
                                <plus-outlined/>
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </div>
                <a-form-item>
                    <a-button type="text"
                              shape="circle"
                              danger
                              @click="removeRow(resource)"
                              :disabled="formState.resources.length === 1">
                        <minus-circle-outlined/>
                    </a-button>
                </a-form-item>
            </div>
            <a-form-item>
                <a-button v-if="formState.resources.length < 6"
                          type="dashed"
                          class="flex items-center"
                          @click="addRow">
                    <plus-outlined/>
                    Thêm mục
                </a-button>
            </a-form-item>
        </div>

        <a-form-item class="text-right">
            <a-button html-type="submit" type="primary" class="bg-[#1677ff]" :loading="otherState.loading">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>

    <PreviewModal/>
</template>
