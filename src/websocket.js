class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(token, userID) {
      console.log("ID: ", userID);
    const path = `ws://127.0.0.1:8000/ws/auth/${userID}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('WebSocket open');
      this.sendMessage({
          // message: "Client send this message",
          token: token
    })
    };
    this.socketNewMessage(JSON.stringify({
      command: 'fetch_messages'
    }));
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
      console.log('Client receive: ', e.data);
        // this.username = JSON.parse(e.data).username;
        // this.cash = JSON.parse(e.data).cash;
        // console.log('WTF: ', JSON.parse(e.data).command)
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect(token, userID);
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log('COMMAND: ', command);
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'auth') {
        this.callbacks[command](parsedData.username, parsedData.cash)
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(username) {
    this.sendMessage({ command: 'fetch_messages', username: username });
  }

  newChatMessage(message) {
    this.sendMessage({ command: 'new_message', from: message.from, message: message.content });
  }

  fetchToken(token) {
      this.sendMessage({ token: token })
  }

  addCallbacks(authCallback) {
      this.callbacks['auth'] = authCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;