import {defineStore} from "pinia";
import {reactive} from "vue";

export const previewer = defineStore('preview', () => {
    const previewerState = reactive({
        isPreview: false,
        previewContent: '',
        type: '',
        homePageContent: {
            banner: [
                { title: '', description: '', target: '', image: [], placeTitle: '', labelBtn: '' }
            ],
            introduction: '',
            titleMission: '',
            imageMission: [],
            missions: [
                {id: 0, content: ''}
            ],
            descriptionEvaluate: '',
            evaluateSlides: [
                {id: 0, title: '', target: '', image: []}
            ]
        },
        evaluatedPageContent: {
            introduction: '',
            esg: {title: '', image: [], labelBtn: '', targetBtn: '', document: []},
            nec: {title: '', image: [], labelBtn: '', targetBtn: '', document: []}
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

    const updatePreviewEvaluatedPage = newVal => {
        previewerState.evaluatedPageContent = Object.assign(previewerState.evaluatedPageContent, newVal)
    }

    return {previewerState, updateIsPreview, updatePreviewContent, updatePreviewHomePage, updatePreviewEvaluatedPage}
})
