import {defineStore} from "pinia";
import {reactive} from "vue";

export const previewer = defineStore('preview', () => {
    const previewerState = reactive({
        isPreview: false,
        previewContent: '',
        type: '',
        homePageContent: {
            introduction: '',
            titleMission: '',
            missions: [
                {id: 0, content: ''}
            ],
            descriptionEvaluate: '',
            evaluateSlides: [
                {id: 0, title: '', target: '', image: []}
            ]
        }
    })

    const updateIsPreview = newVal => {
        previewerState.isPreview = newVal
    }

    const updatePreviewContent = (newVal, type) => {
        previewerState.previewContent = type === 'IMAGE_URL' ? newVal.url : newVal
        previewerState.type = type
    }

    const updatePreviewHomePage = newVal => {
        previewerState.homePageContent = Object.assign(previewerState.homePageContent, newVal)
    }

    return {previewerState, updateIsPreview, updatePreviewContent, updatePreviewHomePage}
})
