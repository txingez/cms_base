import {defineStore} from "pinia";
import {ref} from "vue";

export const resultStore = defineStore('resulModalStore', () => {
    const data = ref({})
    const setData = result => {
        data.value = result
    }

    return {data, setData}
})
