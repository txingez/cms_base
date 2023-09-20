import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const saveData = (body) => {
    return axios.patch(`${URL}/api/v1/cms/update_home_page`, body, commonHeader());
}

