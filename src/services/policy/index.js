import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;
const config = {headers: headers()};

export const getAllPolicies = () => {
    return axios.get(`${URL}/policy`, config);
};

export const updateUserInPolicy = (policyId, body) => {
    return axios.patch(`${URL}/policy/update/${policyId}`, body, config);
};

