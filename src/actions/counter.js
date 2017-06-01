import * as types from './ActionTypes';
import axios from 'axios';

export function increment(number) {
    return {
        type: types.INCREMENT,
        number: number
    };
}

export function incrementRequest(number) {
    return (dispatch) => {
        const data = {
            number: number,
        };
        return axios.post('/counter', data)
                    .then((response) => {
                        console.log(response.data.number);
                        dispatch(increment(response.data.number));  
                        console.log('success');
                    }).catch((error) => {
                        console.log('error');
                    })
    }
}

export function decrement(number) {
    return {
        type: types.DECREMENT,
        number: number
    };
}

export function decrementRequest(number) {
    return (dispatch) => {
        const data = {
            number: number,
        };
        return axios.post('/counter', data)
                    .then((response) => {
                        console.log(response.data.number);
                        dispatch(decrement(response.data.number));
                        console.log('success');
                    }).catch((error) => {
                        console.log('error');
                    })
    }
}