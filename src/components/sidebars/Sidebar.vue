<template>
    <a-layout-sider :width="250"
                    breakpoint="xl"
                    theme="light"
                    v-model:collapsed="collapsed"
                    collapsible>
        <div class="flex items-center justify-center h-16">
            <div v-if="collapsed">L</div>
            <div v-else>Logo</div>
        </div>
        <a-menu v-model:selectedKeys="selectedKeys"
                v-model:open-keys="openKeys"
                mode="inline">
            <a-menu-item key="dashboard"
                         style="margin-top: 0 !important;"
                         @click="navigate('/dashboard')">
                <template #icon>
                    <dashboard-outlined/>
                </template>
                <span>Dashboard</span>
            </a-menu-item>

            <a-sub-menu key="submenu_1">
                <template #title>
                    <div>
                        <icon>
                            <template #component>
                                <IconManagementSite/>
                            </template>
                        </icon>
                        <span>Quản lý Site</span>
                    </div>
                </template>
<!--                <a-menu-item key="management_home"-->
<!--                             @click="navigate('/management_home')">-->
<!--                    <template #icon>-->
<!--                        <HomeOutlined/>-->
<!--                    </template>-->
<!--                    <span>Quản lý trang chủ</span>-->
<!--                </a-menu-item>-->
                <a-menu-item key="management_overview"
                             @click="navigate('/management_overview')">
                    <template #icon>
                        <ProfileOutlined/>
                    </template>
                    <span>Quản lý trang tổng quan</span>
                </a-menu-item>
                <a-sub-menu key="submenu_1_1">
                    <template #title>
                        <div>
                            <menu-outlined/>
                            <span>Quản lý hoạt động</span>
                        </div>
                    </template>
                    <a-menu-item key="editor_activity" @click="navigate('/activity/editor')">
                        <template #icon>
                            <form-outlined/>
                        </template>
                        <span>Soạn thảo hoạt động</span>
                    </a-menu-item>
                    <a-menu-item key="activities" @click="navigate('/activities')">
                        <template #icon>
                            <unordered-list-outlined/>
                        </template>
                        <span>Danh sách hoạt động</span>
                    </a-menu-item>
                </a-sub-menu>
            </a-sub-menu>

            <a-sub-menu key="submenu_2">
                <template #title>
                    <div>
                        <FundViewOutlined/>
                        <span>Quản lý Dữ liệu</span>
                    </div>
                </template>
                <a-menu-item key="management_message" @click="navigate('/message')">
                    <template #icon>
                        <MessageOutlined/>
                    </template>
                    <span>Quản lý tin nhắn</span>
                </a-menu-item>
                <a-menu-item key="management_result" @click="navigate('/evaluated_result')">
                    <template #icon>
                        <FundProjectionScreenOutlined/>
                    </template>
                    <span>Quản lý kết quả đánh giá</span>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </a-layout-sider>
</template>
<script setup>
import Icon, {
    DashboardOutlined,
    FormOutlined,
    FundProjectionScreenOutlined,
    FundViewOutlined,
    HomeOutlined,
    MenuOutlined,
    MessageOutlined,
    ProfileOutlined,
    UnorderedListOutlined
} from "@ant-design/icons-vue";
import {ref} from "@vue/reactivity";
import {useRouter} from "vue-router";
import {watch} from "vue";
import IconManagementSite from "../icons/IconManagementSite.vue";

const router = useRouter();

const collapsed = ref(false);
const selectedKeys = ref(['dashboard']);
const openKeys = ref([''])
const navigate = (path) => {
    router.push(path);
};

watch(
    () => router.currentRoute,
    (n) => {
        const selectedKey = (() => {
            switch (router.currentRoute.value.name) {
                case 'edit_news':
                    return 'editor_news';

                default:
                    return router.currentRoute.value.name;
            }
        })();

        selectedKeys.value = [selectedKey];
    },
    {
        deep: true,
        immediate: true
    }
);

watch(() => router.currentRoute,
    (n) => {
        openKeys.value = (() => {
            switch (router.currentRoute.value.name) {
                case 'management_home':
                case 'management_overview':
                case 'banner':
                    return ['submenu_1'];

                case 'editor_activity':
                case 'edit_activity':
                case 'activities':
                    return ['submenu_1', 'submenu_1_1'];

                case 'management_message':
                case 'management_result':
                    return ['submenu_2']

                default:
                    return ['']
            }
        })();
    },
    {
        deep: true,
        immediate: true
    })
</script>
