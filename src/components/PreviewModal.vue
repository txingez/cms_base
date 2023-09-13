<script setup>
import {previewer} from "../stores/previewer";
import {close} from "../utils/previewerUtils";

const previewerStore = previewer()

</script>

<template>
    <a-modal :open="previewerStore.previewerState.isPreview"
             title="Preview"
             :footer="null"
             @cancel="close">
        <img v-if="previewerStore.previewerState.type === 'IMAGE_URL'" alt="preview" class="w-full"
             :src="previewerStore.previewerState.previewContent"/>
        <div v-else v-html="previewerStore.previewerState.previewContent"/>
    </a-modal>
</template>
