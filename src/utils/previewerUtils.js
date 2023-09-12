import {previewer} from "../stores/previewer"

const previewerStore = previewer()

export const open = file => {
    console.log(JSON.stringify(file.url))
    previewerStore.updateIsPreview(true)
    previewerStore.updatePreviewUrl(file.url)
}

export const close = () => {
    previewerStore.updateIsPreview(false)
    previewerStore.updatePreviewUrl('')
}
