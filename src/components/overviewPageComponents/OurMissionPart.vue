<script setup>
import DividerWithTitle from "../DividerWithTitle.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {handleResponse} from "../../services/commonService";
import PreviewModal from "../PreviewModal.vue";
import {saveData} from "../../services/overviewPage";
import {showToast} from "../../utils/showToast";
import {ModulesEditor} from "../../constants/modulesEditor";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {ToolbarEditor} from "../../constants/toolbarEditor";

const quill = ref()

const toolbar = computed(() => ToolbarEditor(quill))

const props = defineProps({
    pageId: String
})

const formState = reactive({
    missions: [
        {id: 0, title: '', description: ''}
    ],
    content : ''
})

const missionToDelete = ref([])
const loading = ref(false)

onMounted(() => {
    getComponentData()
})

const getComponentData = () => {
}

const handleSubmit = () => {
    loading.value = true

    const createAndEditData = formState.missions.map(m => {
        return {
            ...(m.id !== 0 && {id: m.id}),
            title: m.title,
            description: m.description,
            action: m.id === 0 ? 'CREATE' : 'EDIT'
        }
    })

    const deleteData = missionToDelete.value.filter(m => m.id !== 0).map(m => {
        return {
            id: m.id,
            title: m.title,
            description: m.description,
            action: 'DELETE'
        }
    })

    const body = {
        pid: props.pageId,
        missions: [...createAndEditData, ...deleteData]
    }

    saveData(body, 'bo sung sau').then((response) => {
        const handledResponse = handleResponse(response.status, response.data)
        if (handledResponse) {
            loading.value = false
            getComponentData()
            showToast('success', 'Success')
        }
    }).catch((err) => {
        loading.value = false
        console.log('Lưu our mission thất bại ', err)
        showToast('error', 'Lưu cài đặt thất bại');
    })
}


const removeRow = (item) => {
    let index = formState.missions.indexOf(item);
    if (index !== -1) {
        missionToDelete.value.push(item)
        formState.missions.splice(index, 1);
    }
}

const addRow = () => {
    formState.missions.push({
        id: 0,
        title: '',
        description: ''
    });
};

</script>

<template>
    <DividerWithTitle label="Mục tiêu của chúng tôi"/>

    <a-form :label-wrap="true"
            label-align="left"
            :label-col="{span: 4}"
            :model="formState"
            @finish="handleSubmit">
        <div class="space-y-5 mb-5">
            <div v-for="(mission, index) in formState.missions"
                 :key="mission.id"
                 class="flex items-center gap-5">
                <div class="basis-full">
<!--                    <a-form-item :name="['missions', index, 'title']"-->
<!--                                 :label="['Tiêu đề ', index + 1]"-->
<!--                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">-->
<!--                        <a-input v-model:value="mission.title" placeholder="Tiêu đề nhiệm vụ"/>-->
<!--                    </a-form-item>-->
                    <a-form-item name="content"
                                 label="Nội dung"
                                 :rules="[{required: true, message: 'Nội dung không được để trống'}]">
                        <div class="w-full">
                            <quill-editor ref="quill"
                                          v-model:content="formState.content"
                                          class="min-h-[300px] max-h-[700px] overflow-x-scroll"
                                          :modules="ModulesEditor"
                                          :toolbar="toolbar"
                                          content-type="html">
                            </quill-editor>
                        </div>
                    </a-form-item>
                </div>
<!--                <a-form-item>-->
<!--                    <a-button type="text"-->
<!--                              shape="circle"-->
<!--                              danger-->
<!--                              @click="removeRow(mission)"-->
<!--                              :disabled="formState.missions.length === 1">-->
<!--                        <minus-circle-outlined/>-->
<!--                    </a-button>-->
<!--                </a-form-item>-->
            </div>
<!--            <a-form-item>-->
<!--                <a-button v-if="formState.missions.length < 4"-->
<!--                          type="dashed"-->
<!--                          class="flex items-center"-->
<!--                          @click="addRow">-->
<!--                    <plus-outlined/>-->
<!--                    Thêm mục-->
<!--                </a-button>-->
<!--            </a-form-item>-->
        </div>

        <a-form-item class="text-right">
            <a-button html-type="submit" type="primary" class="bg-[#1677ff]" :loading="loading">
                Lưu cài đặt
            </a-button>
        </a-form-item>
    </a-form>

    <PreviewModal/>
</template>
