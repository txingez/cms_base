import {commonHeader, commonHeadersUpload} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const uploadImage = (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${URL}/api/v1/cms/upload_file`,
        formData,
        Object.assign(commonHeadersUpload(), onProgress ? {
            onUploadProgress: e => {
                onProgress({percent: (e.loaded / e.total) * 100});
            }
        } : {}));
};

export const removeImage = fileName => {
    return axios.delete(`${URL}/${fileName}`, commonHeader());
};
