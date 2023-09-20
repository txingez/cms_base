import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const createBanner = body => {
    return axios.post(`${URL}/banner`, body, commonHeader());
};

export const editBanner = (id, body) => {
    return axios.patch(`${URL}/banner/update/${id}`, body, commonHeader());
};

export const getBanners = (page, pageSize) => {
    return axios.get(`${URL}/banner?page=${page}&perPage=${pageSize}`, commonHeader());
};

export const getBanner = id => {
    return axios.get(`${URL}/banner/${id}`, commonHeader());
};

export const deleteBanner = id => {
    return axios.delete(`${URL}/banner/${id}`, commonHeader());
};
