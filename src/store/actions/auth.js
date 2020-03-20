import axios from 'axios';
import * as actionTypes from './actionTypes';
import WebSocketInstance from "../../websocket";
import { HOST_URL } from '../../settings';


export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authUpdate = (username, cash, wallet) => {
  return {
    type: actionTypes.AUTH_UPDATE,
    username: username,
    cash: cash,
    wallet: wallet,
  };
};

export const authSuccess = (token, username, cash, userID) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username,
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
  if (WebSocketInstance.socketRef) {
    WebSocketInstance.socketRef.close(1000, "Closing Connection Normally");
  }
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
    axios.post(`${HOST_URL}/api/auth/login/`, {
      username: username,
      password: password
    })
      .then(res => {
        const token = res.data.key;

        axios.get(`${HOST_URL}/api/auth/user/`, {headers: {
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
            WebSocketInstance.connect(res.data.id, token); // userdID, token

            dispatch(authSuccess(token, username, cash, userID));
            dispatch(checkAuthTimeout(3600));
          });
      })
      .catch(err => {
        dispatch(authFail(err))
      })
  }
};

export const authSignup = (username, email, password1, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios.post(`${HOST_URL}/api/auth/registration/`, {
      username: username,
      email: email,
      password1: password1,
      password2: password2
    })
      .then(res => {
        const token = res.data.key;

        axios.get(`${HOST_URL}/api/auth/user/`, {headers: {
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
      }
    }
  }
};