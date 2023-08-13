<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <a-button type="primary"
                class="bg-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:opacity-80 focus:bg-orange-500 focus:border-orange-500"
                @click="backHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

const backHome = () => {
  router.push({name: "home"})
}
</script>
