import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_BACKEND_SERVICE;

export const saveData = (body) => {
    return axios.patch(`${URL}/api/v1/cms/update_esg`, body, commonHeader());
}

export const getByPageID = (pageID) => {
    return axios.get(`${URL}/api/v1/cms/get_by_page_id?page_id=${pageID}`, commonHeader());
}
