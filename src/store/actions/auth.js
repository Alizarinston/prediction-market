import axios from 'axios';
import * as actionTypes from './actionTypes';
import WebSocketInstance from "../../websocket";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (token, username, cash, userID) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username, // WebSocketInstance.username
        cash: cash,
        userID: userID,
    }
};

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    localStorage.removeItem('cash');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
};

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: username,
            password: password
        })
        .then(res => {
            const token = res.data.key;

            axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                }})
                    .then(res => {

                        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                        localStorage.setItem('token', token);
                        localStorage.setItem('username', res.data.username);
                        localStorage.setItem('cash', res.data.cash);
                        localStorage.setItem('userID', res.data.id);
                        localStorage.setItem('expirationDate', expirationDate);


                        const username = res.data.username;
                        const cash = res.data.cash;
                        const userID = res.data.id;
                        WebSocketInstance.connect(res.data.id, token); // token, userdID

                        dispatch(authSuccess(token, username, cash, userID));
                        // dispatch(authSuccess(token, username));
                        dispatch(checkAuthTimeout(3600));
                    });

            // WebSocketInstance.connect(token);
            // const username = res.data.username;
            // const cash = res.data.cash;
            // dispatch(authSuccess(token, username, cash));

        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
};

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/api/auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(res => {
            const token = res.data.key;



            axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                }})
                    .then(res => {

                        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                        localStorage.setItem('token', token);
                        localStorage.setItem('username', res.data.username);
                        localStorage.setItem('cash', res.data.cash);
                        localStorage.setItem('userID', res.data.id);
                        localStorage.setItem('expirationDate', expirationDate);


                        const username = res.data.username;
                        const cash = res.data.cash;
                        const userID = res.data.id;
                        WebSocketInstance.connect(res.data.id, token);

                        dispatch(authSuccess(token, username, cash, userID));
                        // dispatch(authSuccess(token, username));
                        dispatch(checkAuthTimeout(3600));
                    });

        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const cash = localStorage.getItem('cash');
        const userID = localStorage.getItem('userID');
        // let username = null;
        // let cash = null;
        // let userID = null;

        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if ( expirationDate <= new Date() ) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token, username, cash, userID));
                dispatch(
                  checkAuthTimeout(
                    (expirationDate.getTime() - new Date().getTime()) / 1000
                  ));
                WebSocketInstance.connect(userID, token);
                // WebSocketInstance.connect(token, userID);
                // dispatch(authSuccess(token, WebSocketInstance.username, WebSocketInstance.cash));

                // // axios.defaults.headers = {
                // //     "Content-Type": "application/json",
                // //     Authorization: `Token ${token}`
                // // };
                // axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
                //     "Content-Type": "application/json",
                //     Authorization: `Token ${token}`
                // }})
                //     .then(res => {
                //         const username = res.data.username;
                //         const cash = res.data.cash;
                //         const userID = res.data.id;
                //
                //         // username = res.data.username;
                //         // cash = res.data.cash;
                //         // userID = res.data.id;
                //         // localStorage.setItem('username', username);
                //         // localStorage.setItem('cash', cash);
                //         // localStorage.setItem('userID', userID);
                //         dispatch(authSuccess(token, username, cash, userID));
                //         dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) );
                //     });
                //
                // // username = localStorage.getItem('username');
                // // cash = localStorage.getItem('cash');
                // // userID = localStorage.getItem('userID');
                //
                // // dispatch(authSuccess(token, username, cash, userID));
                // // dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) );
                //
                // /*axios.defaults.headers = {
                //     "Content-Type": "application/json",
                //     Authorization: `Token ${token}`
                // };
                //
                // console.log(token);
                // axios.get(`http://127.0.0.1:8000/api/auth/user/`)
                //     .then(res => {
                //         localStorage.setItem('user_id', res.data.id);
                //         // const user_id = localStorage.getItem('user_data');
                //         console.log(localStorage.getItem('user_data'))
                //     });*/
            }
        }
    }
};