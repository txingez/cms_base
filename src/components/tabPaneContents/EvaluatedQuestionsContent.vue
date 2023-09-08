<script setup>

defineProps({
    resultData: {},
    questions: {}
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div v-for="result in resultData" class="flex flex-col gap-1.5">
            <div class="font-bold">{{ `${result.key}-${questions[result.key].question}` }}</div>
            <div>{{ questions[result.key].answers[result.answer].answer }}</div>
        </div>
    </div>
</template>
