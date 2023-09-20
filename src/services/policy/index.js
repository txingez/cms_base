import {commonHeader} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_CMS_SERVICE;

export const getAllPolicies = () => {
    return axios.get(`${URL}/policy`, commonHeader());
};

export const updateUserInPolicy = (policyId, body) => {
    return axios.patch(`${URL}/policy/update/${policyId}`, body, commonHeader());
};

