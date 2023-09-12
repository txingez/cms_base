<script setup>

defineProps({
    resultData: {},
    questions: {}
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div v-for="result in resultData" class="flex flex-col gap-1.5">
            <div class="font-bold">{{ `${result.question}-${questions[result.question].question}` }}</div>
            <div>{{ questions[result.question].answers[result.answer].answer }}</div>
        </div>
    </div>
</template>
