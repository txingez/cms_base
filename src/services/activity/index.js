import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;
const config = {headers: headers()}

export const createActivity = body => {
    return axios.post(`${URL}/activity`, body, config);
}

export const updateById = (id, body) => {
    return axios.patch(`${URL}/activity/update/${id}`, body, config);
};

export const getAll = (page, pageSize, otherFilter) => {
    return axios.get(`${URL}/activity?page=${page}&perPage=${pageSize}${otherFilter}`, config);
}

export const getFormData = async(body) => {
    return axios.post(`${URL}/api/v1/cms/form_data`, body, config);
}

export const getById = activityId => {
    return axios.get(`${URL}/activity/${activityId}`, config);
};

export const deleteById = activityId => {
    return axios.delete(`${URL}/activity/${activityId}`, config);
};

export const publicById = (activityId, body) => {
    return axios.put(`${URL}/activity/public/${activityId}`, body, config);
};

export const dismissById = (activityId, body) => {
    return axios.put(`${URL}/activity/dismiss/${activityId}`, body, config);
};

export const draft = body => {
    return axios.post(`${URL}/activity/draft`, body, config);
};
