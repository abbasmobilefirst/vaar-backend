
const CryptoJS = require("crypto-js");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + './../../.env') });


exports.encryptToken = (token) => {
    let x = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), process.env.KEY_ENCRYPT_DECRYPT).toString();
    return Buffer.from(x, 'utf8').toString('base64')
}


exports.decryptToken = (token) => {
    
    let y = CryptoJS.AES.decrypt(Buffer.from(token, 'base64').toString('utf8'), process.env.KEY_ENCRYPT_DECRYPT);
    return y.toString(CryptoJS.enc.Utf8);
}
