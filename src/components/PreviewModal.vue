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
        <img alt="preview" class="w-full" :src="previewerStore.previewerState.previewImage"/>
    </a-modal>
</template>
