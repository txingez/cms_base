import * as key from "../constants/constants";

export const clearStorage = () => {
    localStorage.removeItem(import.meta.env.ENV_USER_ID_KEY);
    localStorage.removeItem(import.meta.env.ENV_EMAIL_KEY);
    localStorage.removeItem(import.meta.env.ENV_FULL_NAME_KEY);
    localStorage.removeItem(import.meta.env.ENV_TOKEN_KEY);
};
