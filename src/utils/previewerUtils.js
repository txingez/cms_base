import {previewer} from "../stores/previewer"

const previewerStore = previewer()

export const open = (content, type) => {
    previewerStore.updateIsPreview(true)
    previewerStore.updatePreviewContent(content, type)
}

export const close = () => {
    previewerStore.updateIsPreview(false)
    previewerStore.updatePreviewContent('', '')
}
