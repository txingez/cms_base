import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const getAll = (page, perPage) => {
    return axios.get(`${URL}/result?page=${page}&perPage=${perPage}`, commonHeader());
};

export const getFormDataById = (id) => {
    return axios.get(`${URL}/api/v1/cms/form_detail?id=${id}`, commonHeader())
}
