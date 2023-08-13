import * as key from "../constants/constants";

export const clearStorage = () => {
    sessionStorage.removeItem(key.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(key.REFRESH_TOKEN_KEY);
};
