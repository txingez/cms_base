import {commonHeader, URL} from "../commonService";
import axios from "axios";

export const login = body => {
    return axios.post(`${URL}/api/v1/auth/sign_in`, body, commonHeader())
}

export const logout = body => {
    return axios.post(`${URL}/api/v1/auth/sign_out`, body)
}
