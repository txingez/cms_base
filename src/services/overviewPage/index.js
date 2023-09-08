import {headers} from "../commonService";
import axios from "axios";

const config = {headers: headers()};
const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const saveData = (body, endpoint) => {
    return axios.post(`${URL}/${endpoint}`, body, config);
}

