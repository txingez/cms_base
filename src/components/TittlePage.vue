<script setup>
defineProps({
    label: String
})
</script>

<template>
    <div class="mb-10 flex justify-between">
        <div class="text-2xl font-bold">{{ label }}</div>
    </div>
</template>
