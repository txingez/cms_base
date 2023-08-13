import crypto from 'crypto';

export const encryptRSA = (data, publicKey) => {
    const encryptedData = crypto.publicEncrypt({
            key: "-----BEGIN PUBLIC KEY-----" + publicKey + "-----END PUBLIC KEY-----",
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(data, 'utf-8')
    )

    return encryptedData.toString("base64");
};
