/* eslint-disable no-param-reassign */
export default {
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    },

    swapArrayItem(arr, index, replaceIndex) {
        arr[replaceIndex] = arr.splice(index, 1, arr[replaceIndex])[0];
        return arr;
    },

    getUniqueKey(number = 100000000000) {
        const uniqueKey = String(Math.floor(Math.random() * number));
        return uniqueKey;
    },

    convertStringOfTrueAndFalseToBollean(str) {
        if (str === 'true') {
            return true;
        } else if (str === 'false') {
            return false;
        }
        return str;
    },

    dataType: [
        {
            value: 'object',
            text: 'object',
        },
        {
            value: 'table',
            text: 'table',
        },
        {
            value: 'dropdown',
            text: 'dropdown',
        },
        {
            value: 'string',
            text: 'string',
        },
        {
            value: 'number',
            text: 'number',
        },
        {
            value: 'integer',
            text: 'integer',
        },
        {
            value: 'float',
            text: 'float',
        },
        {
            value: 'boolean',
            text: 'boolean',
        },
        {
            value: 'date',
            text: 'date',
        },
        {
            value: 'url',
            text: 'url',
        },
        {
            value: 'email',
            text: 'email',
        },
    ],
};