import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const getUsers = (page, perPage, otherFilters) => {
    return axios.get(`${URL}/user?page=${page}&perPage=${perPage}${otherFilters}`, commonHeader());
};

export const getUser = id => {
    return axios.get(`${URL}/user/${id}`, commonHeader());
};
