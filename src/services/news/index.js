import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const createNews = body => {
    return axios.post(`${URL}/news`, body, commonHeader());
}

export const updateNews = (id, body) => {
    return axios.patch(`${URL}/news/update/${id}`, body, commonHeader());
};

export const getAllNews = (page, pageSize, otherFilter) => {
    return axios.get(`${URL}/news?page=${page}&perPage=${pageSize}${otherFilter}`, commonHeader());
}

export const getNews = newsId => {
    return axios.get(`${URL}/news/${newsId}`, commonHeader());
};

export const deleteNews = newsId => {
    return axios.delete(`${URL}/news/${newsId}`, commonHeader());
};

export const approveNews = (newsId, body) => {
    return axios.put(`${URL}/news/approve/${newsId}`, body, commonHeader());
};

export const publicNews = (newsId, body) => {
    return axios.put(`${URL}/news/public/${newsId}`, body, commonHeader());
};

export const dismissNews = (newsId, body) => {
    return axios.put(`${URL}/news/dismiss/${newsId}`, body, commonHeader());
};

export const draftNews = body => {
    return axios.post(`${URL}/news/draft`, body, commonHeader());
};
