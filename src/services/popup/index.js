import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const createPopup = body => {
    return axios.post(`${URL}/popup`, body, commonHeader());
};

export const editPopup = (id, body) => {
    return axios.patch(`${URL}/popup/update/${id}`, body, commonHeader());
};

export const getPopups = (page, pageSize) => {
    return axios.get(`${URL}/popup?page=${page}&perPage=${pageSize}`, commonHeader());
};
