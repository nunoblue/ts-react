import storage from 'store/storages/localStorage';
import axios from 'axios';
import config from '../../configs';

const instance = axios.create({
    baseURL: config.apServer,
    timeout: 4000,
    withCredentials: true,
});

const requestInterceptor = (method, url, data, headers) => {
    const defaultHeaders = {
        'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
    };
    const options = {
        method,
        url,
        responseType: 'json',
        headers: defaultHeaders,
    };
    if (data && (method === 'GET' || method === 'DELETE')) {
        options.params = data;
    } else if (data) {
        options.data = JSON.stringify(data);
        options.headers = Object.assign(options.headers, {
            'Content-Type': 'application/json',
        });
    }
    if (headers) {
        options.headers = Object.assign(options.headers, headers);
    }
    return new Promise((resolve, reject) => {
        instance.request(options)
            .then((response) => {
                resolve(response);
            }).catch((error) => {
                if (error.response) {
                    error.message = error.response.data ? error.response.data.message : `${error.response.status} ${error.response.statusText}`;
                } else {
                    error.message = error.message || `${error.status} ${error.statusText}`;
                }
                reject(error);
            });
    });
};

const client = {
    get(url, data, headers) {
        return requestInterceptor('GET', url, data, headers);
    },
    post(url, data, headers) {
        return requestInterceptor('POST', url, data, headers);
    },
    delete(url, data, headers) {
        return requestInterceptor('DELETE', url, data, headers);
    },
    all(requests) {
        return Promise.all(requests);
    },
};

export default client;
