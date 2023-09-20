<script setup>
import {RouterView} from "vue-router";
import {useNotificator} from "./stores/notificator";
import {useToast} from "vue-toastification";
import {watch} from "vue";

const toast = useToast();
const notificator = useNotificator();

watch(
    () => notificator.$state,
    (n) => {
        if (!!n.type) {
            toast(n.message, {
                position: n.position,
                type: n.type,
                timeout: 3000,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: "button",
                icon: true,
                rtl: true,
            });
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

</script>

<template>
    <RouterView/>
</template>
