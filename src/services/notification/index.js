import {headers} from "../commonService";
import axios from "axios";

const URL = import.meta.env.ENV_NOTIFICATION_SERVICE;
const config = {headers: headers()};

export const registerToken = body => {
    return axios.post(`${URL}/regist-token`, body, config);
};

export const getNotifications = (page, pageSize, otherFilter) => {
    return axios.get(`${URL}/cms?page=${page}&limit=${pageSize}&type=ADMIN_NOTIFICATION${otherFilter}`, config);
};

export const updateReadNotification = notificationId => {
    return axios.get(`${URL}/cms/${notificationId}`, config);
};
