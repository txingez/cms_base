<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {onMounted, reactive} from "vue";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {uploadImage} from "../../services/uploadFile";
import {handleResponse} from "../../services/commonService";
import {open} from "../../utils/previewerUtils";
import PreviewModal from "../PreviewModal.vue";
import {saveData} from "../../services/homePage";
import {showToast} from "../../utils/showToast";

const formState = reactive({
    title: '',
    image: [],
    contents: [
        {id: 0, label: '', text: ''}
    ]
})

const props = defineProps({
    pageId: String
})

const otherState = reactive({
    contentsToDelete: [],
    loading: false
})

onMounted(() => {
    getComponentData()
})

const getComponentData = () => {

}

const handleSubmit = () => {
    otherState.loading = true

    const createAndEditData = formState.contents.map(c => {
        return {
            ...(c.id !== 0 && {id: c.id}),
            label: c.label,
            text: c.text,
            action: c.id === 0 ? 'CREATE' : 'EDIT'
        }
    })

    const deleteData = otherState.contentsToDelete.filter(cd => cd.id !== 0).map(cd => {
        return {
            id: cd.id,
            label: cd.label,
            text: cd.text,
            action: 'DELETE'
        }
    })

    const body = {
        pid: props.pageId,
        title: formState.title,
        image: formState.image[0].url,
        contents: [...createAndEditData, ...deleteData]
    }

    saveData(body, 'bo sung sau').then((response) => {
        const responseHandled = handleResponse(response.status, response.data)
        if (responseHandled) {
            otherState.loading = false
            getComponentData()
            showToast('success', 'Success')
        }
    }).catch((err) => {
        otherState.loading = false
        console.log('Lưu actions data bị lỗi ', err)
        showToast('error', 'Lưu cài đặt thất bại');
    })
}

const uploadFile = (options) => {
    const {onError, file, onProgress} = options;

    uploadImage('NEWS', file, onProgress)
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                formState.image = [{
                    file: file,
                    status: 'done',
                    response: responseData,
                    url: responseData.data.image_url
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

const removeRow = (item) => {
    let index = formState.contents.indexOf(item);
    if (index !== -1) {
        otherState.contentsToDelete.push(item)
        formState.contents.splice(index, 1);
    }
}


const addRow = () => {
    formState.contents.push({
        id: 0,
        label: '',
        text: ''
    });
};

</script>

<template>
    <DividerWithTitle label="Hành động"/>

    <a-form :model="formState"
            label-align="left"
            :label-wrap="true"
            :label-col="{span: 4}"
            @finish="handleSubmit">
        <a-form-item name="title"
                     label="Tiêu đề khối"
                     :rules="[{required: true, message: 'Nội dung không được để trống'},{max: 100, message: 'Nội dung không được quá 100 kí tự'}]">
            <a-input v-model:value="formState.title" placeholder="Tiêu đề"/>
        </a-form-item>
        <a-form-item label="Ảnh"
                     name="image"
                     :rules="[{required: true, message: 'Chưa upload ảnh'}]">
            <a-upload name="image"
                      v-model:file-list="formState.image"
                      accept=".png, .jpg, .jpeg"
                      list-type="picture-card"
                      :max-count="1"
                      @preview="open"
                      :custom-request="uploadFile">
                <div v-if="formState.image.length < 2">
                    <plus-outlined/>
                    <div>Upload</div>
                </div>
            </a-upload>
        </a-form-item>

        <div class="border border-dashed p-5 rounded-md space-y-5 mb-5">
            <div v-for="(contentBlock, index) in formState.contents"
                 class="flex items-center gap-5">
                <div class="basis-full">
                    <a-form-item :name="['contents', index, 'label']"
                                 :label="['Tiêu đề mục ', index + 1]"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-input v-model:value="contentBlock.label" placeholder="Tiêu đề của mục"/>
                    </a-form-item>
                    <a-form-item :name="['contents', index, 'text']"
                                 :label="['Nội dung mục ', index + 1]"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <a-textarea v-model:value="contentBlock.text"
                                    placeholder="Nội dung của mục con"
                                    allow-clear
                                    show-count
                                    :maxlength="250"
                                    :rows="5"/>
                    </a-form-item>
                </div>
                <a-form-item>
                    <a-button type="text"
                              shape="circle"
                              class="flex items-center justify-center"
                              danger
                              @click="removeRow(contentBlock)"
                              :disabled="formState.contents.length === 1">
                        <minus-circle-outlined/>
                    </a-button>
                </a-form-item>
            </div>
            <a-form-item>
                <a-button v-if="formState.contents.length < 10"
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
