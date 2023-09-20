import {showToast} from "@/utils/showToast";
import {clearStorage} from "../utils/clearStorage";
import router from "../router";

export const URL = import.meta.env.ENV_BACKEND_SERVICE;
export const commonHeadersUpload = () => ({
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem(import.meta.env.ENV_TOKEN_KEY)}`,
    }
});

export const commonHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem(import.meta.env.ENV_TOKEN_KEY)}`,
    }
});

export function handleResponse(status, data) {
    return (() => {
        switch (status) {
            case 200:
                return data;
            case 201:
                showToast("error", data.message);
                return null;

            case 401:
                showToast("warning", "Đã hết phiên đăng nhập, mời đăng nhập lại");
                clearStorage();
                router.push('/login')
                return null;

            default:
                console.log("Execute API failed!");
                showToast("error", "Có lỗi xảy ra");
                return null;
        }
    })();
}
