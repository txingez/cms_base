import {headers} from "../commonService";
import axios from "axios";

const config = {headers: headers()};
const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const saveData = (body) => {
    return axios.patch(`${URL}/api/v1/cms/update_esg`, body, config);
}

