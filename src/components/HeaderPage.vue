<template>
    <div class="bg-white min-h-[60px] flex items-center justify-end space-x-5 px-[20px]">
        <!--        <div class="pt-3">-->
        <!--            <a-dropdown :trigger="['click']"-->
        <!--                        placement="bottomLeft"-->
        <!--            >-->
        <!--                <a-badge :count="5"-->
        <!--                         :overflow-count="10"-->
        <!--                         class="hover:cursor-pointer">-->
        <!--                    <bell-outlined class="text-2xl font-normal"/>-->
        <!--                </a-badge>-->
        <!--                <template #overlay>-->
        <!--                    <a-menu>-->
        <!--                        <a-menu-item v-for="notification in notifications"-->
        <!--                                     :key="notification.id"-->
        <!--                        >-->
        <!--                            <a-badge :color="notification.read ? '#22c55e' : '#f97316'"-->
        <!--                                     :class="`${notification.read ? '' : 'font-semibold'} text-xl`"-->
        <!--                                     :text="notification.title"/>-->
        <!--                        </a-menu-item>-->
        <!--                        <a v-if="countNotification > 5"-->
        <!--                           class="py-[5px] px-[12px] flex justify-end"-->
        <!--                           @click.prevent="showListNotification">-->
        <!--                            Xem tất cả-->
        <!--                        </a>-->
        <!--                    </a-menu>-->
        <!--                </template>-->
        <!--            </a-dropdown>-->
        <!--        </div>-->
        <a-dropdown :trigger="['click']">
            <a-avatar :size="{ xs: 18, sm: 20, md: 36, lg: 40, xl: 40, xxl: 40 }"
                      class="cursor-pointer bg-blue-500 flex justify-center items-center">
                <template #icon>
                    <user-outlined/>
                </template>
            </a-avatar>
            <template #overlay>
                <a-menu collapsible>
                    <a-menu-item key="0">
                        <div class="flex items-center space-x-1">
                            <setting-outlined/>
                            <span>Cài đặt</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <div class="flex items-center space-x-1">
                            <logout-outlined/>
                            <span @click="handleLogOut">Đăng xuất</span>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup>
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {handleResponse} from "@/services/commonService";
import {getNotifications, updateReadNotification} from "../services/notification";
import {logout} from "../services/authentication";
import {clearStorage} from "../utils/clearStorage";
// import {onMessage} from "firebase/messaging";
// import {firebaseMessaging} from "../services/firebaseMessaging";

const router = useRouter();

const countNotification = ref(0);
const notifications = ref([]);
//
// onMessage(firebaseMessaging, (payload) => {
//   console.log(payload)
//   const dataInner = JSON.parse(payload.data.data);
//   countNotification.value = dataInner.unreadNotifications;
// });

const handleLogOut = () => {
    const body = {
        email: localStorage.getItem(import.meta.env.ENV_EMAIL_KEY)
    }
    logout(body).finally(() => {
        clearStorage()
        router.push('/login')
    })
};

const handleClickBell = () => {
    getNotifications(1, 5, '')
        .then(response => {
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                countNotification.value = 0;
                notifications.value = responseData.data.docs.map(d => {
                    return {
                        id: d._id,
                        objectId: d.object_id,
                        title: d.title,
                        read: d.read
                    }
                });
            }
        })
        .catch(error => {
            console.log('Lấy danh sách thông báo thất bại', error);
        });
};

const handleClickNotification = (notification) => {
    updateReadNotification(notification.id);
    router.push(`/news/editor/${notification.objectId}`);
};

const showListNotification = () => {
    router.push('/notifications');
};

</script>
