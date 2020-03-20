let DEBUG = true;
let HOST_URL = "https://";
let SOCKET_URL = "wss://";
if (DEBUG) {
  HOST_URL = "http://127.0.0.1:8000";
  SOCKET_URL = "ws://127.0.0.1:8000";
}

export { HOST_URL, SOCKET_URL };