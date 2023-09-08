import {defineStore} from "pinia";
import {reactive} from "vue";

export const previewer = defineStore('preview', () => {
    const previewerState = reactive({
        isPreview: false,
        previewUrl: ''
    })

    const updateIsPreview = newVal => {
        previewerState.isPreview = newVal
    }

    const updatePreviewUrl = newVal => {
        previewerState.previewUrl = newVal
    }

    return {previewerState, updateIsPreview, updatePreviewUrl}
})
