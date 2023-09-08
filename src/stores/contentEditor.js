import {defineStore} from "pinia";
import {ref} from "vue";

export const contentEditor = defineStore('contentEditor', () => {
    const content = ref('')

    const update = newContent => {
        content.value = newContent
    }

    return {content, update}
})
