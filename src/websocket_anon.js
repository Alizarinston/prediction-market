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

  connect(channel) {
      console.log("ID: ", channel);
    const path = `ws://127.0.0.1:8000/ws/anon/${channel}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('WebSocket open');
        this.sendMessage({
            // message: "Client send this message",
            channel: channel
        })
    };
    this.socketNewMessage(JSON.stringify({
      command: 'fetch_messages'
    }));
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
      console.log('Client receive: ', e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect(channel);
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log('COMMAND: ', command);
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'market') {
        this.callbacks[command](parsedData.markets)
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
      console.log('FETCH TOKEN: ', token);
      this.sendMessage({ token: token })
  }

  newChannel(channel) {
      console.log('FETCH CHANNEL: ', channel);
      this.sendMessage({ channel: channel })
  }

  addCallbacks(authCallback) {
      this.callbacks['market'] = authCallback;
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
