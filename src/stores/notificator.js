import { defineStore } from "pinia";

export const useNotificator = defineStore("common", {
    state: () => {
        return {
            type: null,
            message: null,
            position: "top-right",
        };
    },
    actions: {
        changeToast(obj) {
            this.type = obj.type;
            this.message = obj.message;
            this.position = obj.position;
            setTimeout(() => this.resetToast());
        },
        resetToast() {
            this.type = null;
            this.message = null;
            this.position = "top-right";
        },
    },
});
