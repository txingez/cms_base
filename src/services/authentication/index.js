import {headers, URL} from "../commonService";
import axios from "axios";

const config = {headers: headers()};

export const login = body => {
    return axios.post(`${URL}/auth-cms/login`, body, config);
};

export const logout = body => {
    return axios.post(`${URL}/auth-cms/logout`, body, config);
};
