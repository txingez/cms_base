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

    <a-form :label-col="{span: 3}"
            :label-wrap="true"
            :model="formState"
            label-align="left"
            @finish="handleSubmit">
        <div class="space-y-5 mb-5">
            <div v-for="(resource, index) in formState.resources"
                 :key="resource.id"
                 class="flex items-center gap-5">
                <div class="basis-full">
                    <a-form-item :label="['Tiêu đề ', index + 1]"
                                 :name="['resources', index, 'title']"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-input v-model:value="resource.title" placeholder="Tiêu đề nguồn lực"/>
                    </a-form-item>
                    <a-form-item :label="['Mô tả ', index + 1]"
                                 :name="['resources', index, 'description']"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-textarea v-model:value="resource.description"
                                    :maxlength="250"
                                    :rows="5"
                                    allow-clear
                                    placeholder="Mô tả nguồn lực"
                                    show-count/>
                    </a-form-item>
                    <a-form-item :label="['Ảnh ', index + 1]"
                                 :name="['resources', index, 'image']"
                                 :rules="[{required: true, message: 'Ảnh chưa được upload'}]">
                        <a-upload v-model:file-list="resource.image"
                                  :custom-request="uploadFile"
                                  :data="{index: index}"
                                  :max-count="1"
                                  accept=".png, .jpg, .jpeg"
                                  list-type="picture-card"
                                  @preview="open">
                            <div v-if="resource.image.length < 2">
                                <plus-outlined/>
                                <div>Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </div>
                <a-form-item>
                    <a-button :disabled="formState.resources.length === 1"
                              danger
                              shape="circle"
                              type="text"
                              @click="removeRow(resource)">
                        <minus-circle-outlined/>
                    </a-button>
                </a-form-item>
            </div>
            <a-form-item>
                <a-button v-if="formState.resources.length < 6"
                          class="flex items-center"
                          type="dashed"
                          @click="addRow">
                    <plus-outlined/>
                    Thêm mục
                </a-button>
            </a-form-item>
        </div>

        <a-form-item class="text-right">
            <a-button :loading="otherState.loading" class="bg-[#1677ff]" html-type="submit" type="primary">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>

    <PreviewModal/>
</template>
