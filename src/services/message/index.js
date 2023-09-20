import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const getAll = (limit, offset) => {
    return axios.get(`${URL}/api/v1/cms/list_messages?limit=${limit}&offset=${offset}`, commonHeader());
};

