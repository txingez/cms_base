import {useNotificator} from "@/stores/notificator";

export const showToast = (type, message, position = "top-right") => {
    const notificator = useNotificator();
    notificator.changeToast({
        type: type,
        message: message,
        position: position,
    });
};
