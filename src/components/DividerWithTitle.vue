<script setup>
defineProps({
    label: String,
    place: String
})
</script>

<template>
    <a-divider :orientation="place ? place : 'left'" orientation-margin="0px">
        <span class="text-lg font-bold">{{ label }}</span>
    </a-divider>
</template>
