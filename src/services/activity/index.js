import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;
const config = {headers: headers()}

export const createPost = body => {
    return axios.post(`${URL}/api/v1/cms/create_post`, body, config);
}

export const updatePost = (body) => {
    return axios.patch(`${URL}/api/v1/cms/update_post`, body, config);
};

export const getAll = (body) => {
    return axios.post(`${URL}/api/v1/cms/posts`, body, config);
}

export const getFormData = async(body) => {
    return axios.post(`${URL}/api/v1/cms/form_data`, body, config);
}

export const getById = activityId => {
    return axios.get(`${URL}/activity/${activityId}`, config);
};

export const deletePost = id => {
    return axios.delete(`${URL}/api/v1/cms/delete_post?id=${id}`, config);
};

export const publicById = (activityId, body) => {
    return axios.put(`${URL}/activity/public/${activityId}`, body, config);
};

export const dismissById = (activityId, body) => {
    return axios.put(`${URL}/activity/dismiss/${activityId}`, body, config);
};

export const saveForm = body => {
    return axios.post(`${URL}/api/v1/cms/create_post`, body, config);
};
