import axios from 'axios';

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

const initialState = {
    number: 0
};

export default function counter(state = initialState, action) {
    console.log(action.number);
    switch(action.type) {
        case types.INCREMENT:
            return { ...state, number: action.number + 1 };
        case types.DECREMENT:
            return { ...state, number: action.number - 1 };
        default:
            return state;
    }
}

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