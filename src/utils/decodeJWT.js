export const decodeJWT = (jwtToken) => {
    return JSON.parse(Buffer.from(jwtToken.split('.')[1], 'base64').toString());
};
