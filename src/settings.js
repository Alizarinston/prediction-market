let DEBUG = true;
let HOST_URL = "http://pm-api.eba-ui7fbawd.eu-central-1.elasticbeanstalk.com";
let SOCKET_URL = "ws://pm-api.eba-ui7fbawd.eu-central-1.elasticbeanstalk.com";
if (DEBUG) {
  HOST_URL = "http://127.0.0.1:8000";
  SOCKET_URL = "ws://127.0.0.1:8000";
}

export { HOST_URL, SOCKET_URL };