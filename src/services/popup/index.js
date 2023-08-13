import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;
const config = {headers: headers()};

export const createPopup = body => {
    return axios.post(`${URL}/popup`, body, config);
};

export const editPopup = (id, body) => {
    return axios.patch(`${URL}/popup/update/${id}`, body, config);
};

export const getPopups = (page, pageSize) => {
    return axios.get(`${URL}/popup?page=${page}&perPage=${pageSize}`, config);
};
