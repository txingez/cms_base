<template>
  <a-layout-sider class="bg-white"
                  :width="250"
                  breakpoint="md"
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

      <a-sub-menu key="submenu_0">
        <template #title>
            <span>
              <container-outlined/>
              <span>Tin Tức</span>
            </span>
        </template>
        <a-menu-item key="category"
                     @click="navigate('/category')">
          <template #icon>
            <profile-outlined/>
          </template>
          <span>Quản lý chuyên mục</span>
        </a-menu-item>
        <a-sub-menu key="submenu_0_1">
          <template #title>
            <span>
              <menu-outlined/>
              <span>Quản lý tin tức</span>
            </span>
          </template>
          <a-menu-item key="editor_news" @click="navigate('/news/editor')">
            <template #icon>
              <form-outlined/>
            </template>
            <span>Soạn thảo tin tức</span>
          </a-menu-item>
          <a-menu-item key="news" @click="navigate('/news')">
            <template #icon>
              <unordered-list-outlined/>
            </template>
            <span>Danh sách tin tức</span>
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>

      <a-sub-menu key="submenu_1">
        <template #title>
            <span>
              <icon>
                <template #component>
                  <IconManagementSite/>
                </template>
              </icon>
              <span>Quản lý Site</span>
            </span>
        </template>
        <a-menu-item key="management_policy"
                     @click="navigate('/policy')">
          <template #icon>
            <apartment-outlined/>
          </template>
          <span>Quản lý phân quyền</span>
        </a-menu-item>
        <a-menu-item key="comment"
                     @click="navigate('/comment')">
          <template #icon>
            <comment-outlined/>
          </template>
          <span>Quản lý bình luận</span>
        </a-menu-item>
        <a-menu-item key="popup" @click="navigate('/popup')">
          <template #icon>
            <icon>
              <template #component>
                <IconPopup/>
              </template>
            </icon>
          </template>
          <span>Quản lý popup</span>
        </a-menu-item>
        <a-menu-item key="banner" @click="navigate('/banner')">
          <template #icon>
            <picture-outlined/>
          </template>
          <span>Quản lý banner</span>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
<script setup>
import Icon, {
  ApartmentOutlined,
  CommentOutlined,
  ContainerOutlined,
  DashboardOutlined,
  FormOutlined,
  MenuOutlined,
  PictureOutlined,
  ProfileOutlined,
  UnorderedListOutlined
} from "@ant-design/icons-vue";
import {ref} from "@vue/reactivity";
import {useRouter} from "vue-router";
import {watch} from "vue";
import IconManagementSite from "../icons/IconManagementSite.vue";
import IconPopup from "../icons/IconPopup.vue";

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
          case 'category':
            return ['submenu_0'];

          case 'management_policy':
          case 'comment':
          case 'popup':
          case 'banner':
            return ['submenu_1'];

          case 'editor_news':
          case 'edit_news':
          case 'news':
            return ['submenu_0', 'submenu_0_1'];

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
