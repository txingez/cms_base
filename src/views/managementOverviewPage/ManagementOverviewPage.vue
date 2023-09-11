<script setup>
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TittlePage from "../../components/TittlePage.vue";
import KnowAboutUsPart from "../../components/overviewPageComponents/KnowAboutUsPart.vue";
import OurMissionPart from "../../components/overviewPageComponents/OurMissionPart.vue";
import MainContentPart from "../../components/overviewPageComponents/MainContentPart.vue";

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Quản lý trang tổng quan', to: '/management_overview'}
];

const pid = 'overview_page_pid'
</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>

    <div class="bg-white p-10">
        <TittlePage label="QUẢN LÝ NỘI DUNG TRANG TỔNG QUAN"/>
        <KnowAboutUsPart :page-id="pid"/>
        <OurMissionPart :page-id="pid"/>
<!--        <MainContentPart :page-id="pid"/>-->
    </div>
</template>
