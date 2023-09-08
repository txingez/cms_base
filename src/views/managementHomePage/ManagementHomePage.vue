<script setup>

import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TittlePage from "../../components/TittlePage.vue";
import AboutUsPart from "../../components/homePageComponents/AboutUsPart.vue";
import ActionsPart from "../../components/homePageComponents/ActionsPart.vue";
import ResourcePart from "../../components/homePageComponents/ResourcePart.vue";

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý trang chủ', to: '/management_home'}
];
const pid = 'home_page_pid'
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <TittlePage label="QUẢN LÝ NỘI DUNG TRANG CHỦ"/>
        <AboutUsPart :page-id="pid"/>
        <ActionsPart :page-id="pid"/>
        <ResourcePart :page-id="pid"/>
    </div>
</template>
