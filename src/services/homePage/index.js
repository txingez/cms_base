import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const saveData = (body, endpoint) => {
    return axios.post(`${URL}/${endpoint}`, body, commonHeader());
}

