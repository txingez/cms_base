import {headers, headersUpload} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;
const config = {
    headers: headersUpload()
}

export const uploadImage = (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`${URL}/upload`,
        formData,
        Object.assign(config, onProgress ? {
            onUploadProgress: e => {
                onProgress({percent: (e.loaded / e.total) * 100});
            }
        } : {}));
};

export const removeImage = fileName => {
    return axios.delete(`${URL}/${fileName}`, {headers: headers()});
};
