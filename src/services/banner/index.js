import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;
const config = {
    headers: headers()
}

export const createBanner = body => {
    return axios.post(`${URL}/banner`, body, {headers: headers()});
};

export const editBanner = (id, body) => {
    return axios.patch(`${URL}/banner/update/${id}`, body, {headers: headers()});
};

export const getBanners = (page, pageSize) => {
    return axios.get(`${URL}/banner?page=${page}&perPage=${pageSize}`, config);
};

export const getBanner = id => {
    return axios.get(`${URL}/banner/${id}`, config);
};

export const deleteBanner = id => {
    return axios.delete(`${URL}/banner/${id}`, {headers: headers()});
};
