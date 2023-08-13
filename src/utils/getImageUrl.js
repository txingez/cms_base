export const getImageUrl = (fileUrl) => {
    const http = (() => {
        switch (import.meta.env.MODE) {
            case 'development':
            case 'uat':
                return 'http://';
            default:
                return 'https://';
        }
    })();
    return `${http}${fileUrl}`;
}


export const getImageUrlByName = fileName => {
    const URL = import.meta.env.ENV_GET_STATIC_SERVICE;
    return `${URL}/${fileName}`;
}
