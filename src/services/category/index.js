import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;
const config = {headers: headers()}

export const createCategory = body => {
    return axios.post(`${URL}/categories`, body, config);
};

export const getCategories = (page, perPage) => {
    return axios.get(`${URL}/categories?page=${page}&perPage=${perPage}`, config);
};

export const getCategory = id => {
    return axios.get(`${URL}/categories/${id}`, config);
};

export const updateCategory = (id, body) => {
    return axios.patch(`${URL}/categories/update/${id}`, body, config);
};

export const deleteCategory = id => {
    return axios.delete(`${URL}/categories/${id}`, config);
};

export const getLastIndexOrderNo = parentCategoryId => {
    return axios.get(`${URL}/categories/lastCategory${parentCategoryId ? `?parentCategoryId=${parentCategoryId}` : ''}`, config);
};
