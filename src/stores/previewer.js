import {defineStore} from "pinia";
import {reactive} from "vue";

export const previewer = defineStore('preview', () => {
    const previewerState = reactive({
        isPreview: false,
        previewContent: '',
        type: ''
    })

    const updateIsPreview = newVal => {
        previewerState.isPreview = newVal
    }

    const updatePreviewContent = (newVal, type) => {
        previewerState.previewContent = type === 'IMAGE_URL' ? newVal.url : newVal
        previewerState.type = type
    }

    return {previewerState, updateIsPreview, updatePreviewContent}
})
