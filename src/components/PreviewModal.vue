<script setup>
import {previewer} from "../stores/previewer";
import {close} from "../utils/previewerUtils";

const previewerStore = previewer()

</script>

<template>
    <a-modal :footer="null"
             :open="previewerStore.previewerState.isPreview"
             title="Preview"
             @cancel="close">
        <img v-if="previewerStore.previewerState.type === 'IMAGE_URL'" :src="previewerStore.previewerState.previewContent" alt="preview"
             class="w-full"/>
        <div v-else v-html="previewerStore.previewerState.previewContent"/>
    </a-modal>
</template>
