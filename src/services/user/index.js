import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const getUsers = (page, perPage, otherFilters) => {
    return axios.get(`${URL}/user?page=${page}&perPage=${perPage}${otherFilters}`, {headers: headers()});
};

export const getUser = id => {
    return axios.get(`${URL}/user/${id}`, {headers: headers()});
};
