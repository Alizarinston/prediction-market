let DEBUG = true;
let HOST_URL = "https://aeneas-prediction-market.herokuapp.com";
let SOCKET_URL = "wss://aeneas-prediction-market.herokuapp.com";
if (DEBUG) {
  HOST_URL = "http://127.0.0.1:8000";
  SOCKET_URL = "ws://127.0.0.1:8000";
}

export { HOST_URL, SOCKET_URL };