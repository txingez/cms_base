import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const createNews = body => {
    return axios.post(`${URL}/news`, body, {headers: headers()});
}

export const updateNews = (id, body) => {
    return axios.patch(`${URL}/news/update/${id}`, body, {headers: headers()});
};

export const getAllNews = (page, pageSize, otherFilter) => {
    return axios.get(`${URL}/news?page=${page}&perPage=${pageSize}${otherFilter}`, {headers: headers()});
}

export const getNews = newsId => {
    return axios.get(`${URL}/news/${newsId}`, {headers: headers()});
};

export const deleteNews = newsId => {
    return axios.delete(`${URL}/news/${newsId}`, {headers: headers()});
};

export const approveNews = (newsId, body) => {
    return axios.put(`${URL}/news/approve/${newsId}`, body, {headers: headers()});
};

export const publicNews = (newsId, body) => {
    return axios.put(`${URL}/news/public/${newsId}`, body, {headers: headers()});
};

export const dismissNews = (newsId, body) => {
    return axios.put(`${URL}/news/dismiss/${newsId}`, body, {headers: headers()});
};

export const draftNews = body => {
    return axios.post(`${URL}/news/draft`, body, {headers: headers()});
};
