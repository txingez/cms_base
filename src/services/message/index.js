import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;
const config = {
    headers: headers()
};

export const getAll = (page, perPage) => {
    return axios.get(`${URL}/message?page=${page}&perPage=${perPage}`, config);
};

