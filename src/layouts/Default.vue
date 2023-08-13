<template>
  <a-layout style="min-height: 100vh">
    <Sidebar/>
    <a-layout>
      <HeaderPage/>
      <a-layout-content class="p-5">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import Sidebar from "../components/sidebars/Sidebar.vue";
import HeaderPage from "../components/HeaderPage.vue";

export default defineComponent({
  components: {
    HeaderPage,
    Sidebar
  }
});
</script>

