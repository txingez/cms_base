<script setup>
defineProps({
    label: String
})
</script>

<template>
    <a-divider orientation="left" orientation-margin="0px">
        {{ label }}
    </a-divider>
</template>
