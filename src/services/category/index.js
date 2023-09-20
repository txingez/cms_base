import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const createCategory = body => {
    return axios.post(`${URL}/categories`, body, commonHeader());
};

export const getCategories = (page, perPage) => {
    return axios.get(`${URL}/categories?page=${page}&perPage=${perPage}`, commonHeader());
};

export const getCategory = id => {
    return axios.get(`${URL}/categories/${id}`, commonHeader());
};

export const updateCategory = (id, body) => {
    return axios.patch(`${URL}/categories/update/${id}`, body, commonHeader());
};

export const deleteCategory = id => {
    return axios.delete(`${URL}/categories/${id}`, commonHeader());
};

export const getLastIndexOrderNo = parentCategoryId => {
    return axios.get(`${URL}/categories/lastCategory${parentCategoryId ? `?parentCategoryId=${parentCategoryId}` : ''}`, commonHeader());
};
