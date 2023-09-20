<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <div v-if="notifications.length !== 0"
         class="bg-white p-5">
        <div class="flex justify-end mb-5">
            <a-checkbox v-model:checked="checked"
                        @change="handleCheck">
                Tin chưa đọc
            </a-checkbox>
        </div>
        <a-list :data-source="notifications"
                :loading="loadingData"
                item-layout="horizontal">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>
                            <a :class="`${item.read ? 'font-normal' : 'font-semibold'} text-base`"
                               @click="handleClickNotification(item)">
                                {{ item.title }}
                            </a>
                        </template>
                        <template #avatar>
                            <a-badge :color="item.read ? '#22c55e' : '#f97316'"/>
                        </template>
                    </a-list-item-meta>
                    <div>{{ item.createdAt }}</div>
                </a-list-item>
            </template>
        </a-list>
        <div class="flex justify-end mt-2.5">
            <a-pagination v-model:current="current"
                          v-model:pageSize="pageSize"
                          :pageSizeOptions="['10', '20']"
                          :show-total="t => `Total ${numberWithComma(t)} items`"
                          :total="total"
                          show-size-changer
                          @change="handleChangePage"
                          @showSizeChange="onShowSizeChange"/>
        </div>
    </div>
    <div v-else>
        <a-empty>
            <template #description>
        <span>
          Không có thông báo
        </span>
            </template>
        </a-empty>
    </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {getNotifications, updateReadNotification} from "../../services/notification";
import {numberWithComma} from "../../utils/formatNumber";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {dateTimeFormatString} from "../../utils/reformatTime";
import {handleResponse} from "../../services/commonService";
import {useRouter} from "vue-router";
import {showToast} from "../../utils/showToast";

const router = useRouter();

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Thông báo', to: '/notifications'}
];

const loadingData = ref(false);
const checked = ref(false);
const notifications = ref([]);
const current = ref(1);
const total = ref(0);
const pageSize = ref(10);

onMounted(() => {
    loadingData.value = true;
    getNotificationData({targetPage: current.value, pageSize: pageSize.value});
});

const handleClickNotification = notification => {
    updateReadNotification(notification.id);
    router.push(`/news/editor/${notification.objectId}`);
};

const onShowSizeChange = (currentPage, size) => {
    current.value = currentPage;
    pageSize.value = size;
};

const handleCheck = e => {
    checked.value = e.target.checked;
    getNotificationData({
        targetPage: current.value,
        pageSize: pageSize.value,
        ...(e.target.checked && {otherFilter: '&read=0'})
    })
};

const handleChangePage = page => {
    getNotificationData({
        targetPage: page,
        pageSize: pageSize.value
    });
};

const getNotificationData = options => {
    const {targetPage, pageSize, otherFilter} = options;
    getNotifications(targetPage, pageSize, otherFilter ? otherFilter : '')
        .then(response => {
            loadingData.value = false;
            const responseData = handleResponse(response.status, response.data);
            if (responseData) {
                notifications.value = responseData.data.docs.map(d => {
                    return {
                        id: d._id,
                        objectId: d.object_id,
                        title: d.title,
                        read: d.read,
                        createdAt: dateTimeFormatString(d.createdAt)
                    }
                })
                total.value = responseData.data.totalDocs;
            }
        })
        .catch(error => {
            console.log('Lỗi khi lấy danh sách thông báo, ', error);
            showToast('error', 'Lấy danh sách thông báo thất bại');
        });
};
</script>
