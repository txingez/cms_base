import {headers, URL} from "../commonService";
import axios from "axios";

const config = {headers: headers()};

export const login = body => {
    return axios.post(`${URL}/api/v1/auth/sign_in`, body, config)
}

export const logout = () => {
    return axios.post(`${URL}/api/v1/auth/sign_out`)
}