<template>
    <a-breadcrumb :routes="routes">
        <template #itemRender="{ route, path }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.name }}
            </span>
            <router-link v-else-if="route.name === 'Home'" :to="route.to" class="flex justify-center items-center">
                <home-outlined class="flex items-center justify-center"/>
            </router-link>
            <router-link v-else :to="route.to">
                {{ route.name }}
            </router-link>
        </template>
    </a-breadcrumb>
</template>

<script setup>
import {HomeOutlined} from "@ant-design/icons-vue";

defineProps({
    routes: {
        default: []
    }
})
</script>
