import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const createPost = body => {
    return axios.post(`${URL}/api/v1/cms/create_post`, body, commonHeader());
}

export const updatePost = (body) => {
    return axios.patch(`${URL}/api/v1/cms/update_post`, body, commonHeader());
};

export const getAll = (body) => {
    return axios.post(`${URL}/api/v1/cms/posts`, body, commonHeader());
}

export const getFormData = async (body) => {
    return axios.post(`${URL}/api/v1/cms/form_data`, body, commonHeader());
}

export const getById = activityId => {
    return axios.get(`${URL}/api/v1/post_detail?id=${activityId}`, commonHeader());
};

export const deletePost = id => {
    return axios.delete(`${URL}/api/v1/cms/delete_post?id=${id}`, commonHeader());
};

export const publicById = (activityId, body) => {
    return axios.put(`${URL}/activity/public/${activityId}`, body, commonHeader());
};

export const dismissById = (activityId, body) => {
    return axios.put(`${URL}/activity/dismiss/${activityId}`, body, commonHeader());
};

export const saveForm = body => {
    return axios.post(`${URL}/api/v1/cms/create_post`, body, commonHeader());
};
