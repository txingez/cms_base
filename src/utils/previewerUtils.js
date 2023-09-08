import {previewer} from "../stores/previewer"

const previewerStore = previewer()

export const open = file => {
    previewerStore.updateIsPreview(true)
    previewerStore.updatePreviewUrl(file.url)
}

export const close = () => {
    previewerStore.updateIsPreview(false)
    previewerStore.updatePreviewUrl('')
}
