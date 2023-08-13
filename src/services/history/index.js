import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const getHistories = (page, perPage, otherFilters) => {
    return axios.get(`${URL}/activity-logs?page=${page}&perPage=${perPage}${otherFilters}`, {headers: headers()});
};
