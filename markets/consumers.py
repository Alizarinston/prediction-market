from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from rest_framework.authtoken.models import Token
from .models import MarketUser


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = 'auth_%s' % self.user_id

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.user_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        print('SERVER RECEIVE: ', text_data)
        print('USERID: ', self.user_id)
        text_data_json = json.loads(text_data)
        # message = text_data_json['message']
        token = ''
        username = ''
        cash = ''
        if len(text_data_json) == 1:
            token = text_data_json['token']

        if str(token) == str(Token.objects.filter(user=self.user_id)[0]):
            profile = MarketUser.objects.filter(pk=self.user_id)
            username = profile[0].username
            cash = profile[0].cash
            print('user/cash: ', username, cash)
        # print(username)
        # print(cash)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.user_group_name,
            {
                'type': 'auth_message',
                'username': username,
                'cash': cash
            }
        )

    # Receive message from room group
    def auth_message(self, event):
        # message = event['message']
        username = event['username']
        cash = event['cash']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'command': 'auth',
            'username': username,
            'cash': cash
        }))
