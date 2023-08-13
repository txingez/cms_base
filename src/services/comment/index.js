import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;
const config = {
    headers: headers()
};

export const getComments = (page, perPage, otherFilter) => {
    return axios.get(`${URL}/comment?page=${page}&perPage=${perPage}${otherFilter}`, config);
};

export const deleteComment = id => {
    return axios.delete(`${URL}/comment/${id}`, config);
};
