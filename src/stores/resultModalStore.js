import {defineStore} from "pinia";
import {ref} from "vue";

export const resultModalStore = defineStore('resulModalStore', () => {
    const isShow = ref(false)
    const data = ref({})

    const show = () => {
        isShow.value = true
    }

    const hide = () => {
        isShow.value = false
    }

    const setData = result => {
        data.value = result
    }

    return {isShow, data, show, hide, setData}
})
