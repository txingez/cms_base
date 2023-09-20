<script setup>
defineProps({
    label: String
})
</script>

<template>
    <div class="my-5 font-semibold md:text-lg xl:text-xl text-base">
        {{ label.toUpperCase() }}
    </div>
</template>
