<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary"
                class="bg-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:opacity-80 focus:bg-orange-500 focus:border-orange-500"
                @click="backHome">Back Home
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
