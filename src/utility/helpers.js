import xml2js from 'xml2js';
import admin from 'firebase-admin';
import { HTTP_STATUS } from '../common/constant';
import message from '../common/responseMessage.json';

export const response = (res, code, key, data, msg) => {
    const result = {
        isSuccess: code === HTTP_STATUS.SUCCESS,
        message: msg || message[key],
        data: code === HTTP_STATUS.SUCCESS ? data : null,
    };
    return res.status(code).json(result);
};

export const xmlToJson = (xml) => {
    var parser = new xml2js.Parser(/* options */);
    return new Promise((resolve, reject) => {
        parser
            .parseStringPromise(xml)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const startAndEndOfWeek = (date) => {

    // If no date object supplied, use current date
    // Copy date so don't modify supplied date
    var now = date ? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0, 0, 0, 0);

    // Get the previous Monday
    var monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 2);

    // Get next Sunday
    var sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 8);

    // Return array of date objects
    return {
        monday,
        sunday
    };
}

export const sendPushNotification = (message) => {
    admin.messaging().send(message).then((res) => {
        console.log('Successfully sent message:', res);
    }).catch((err) => {
        console.log('Error sending message:', err);
    });
}