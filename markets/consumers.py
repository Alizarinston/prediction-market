from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from rest_framework.authtoken.models import Token
from .models import MarketUser
from django.db.models import signals
from django.dispatch import receiver
import channels.layers


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

        self.validate_token(text_data_json)

        if not self.scope['user'].id:
            self.close()

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.user_group_name,
            {
                'type': 'auth_message',
                'username': self.scope['user'].username,
                'cash': self.scope['user'].cash
            }
        )

    def validate_token(self, text_data_json):
        """
        Check if user is authenticated via Token.
        """
        if 'token' in text_data_json:
            token = text_data_json['token']

            if str(token) == str(Token.objects.filter(user=self.user_id)[0]):
                profile = MarketUser.objects.filter(pk=self.user_id)
                self.scope['user'] = profile[0]
                print('user/cash: ', self.scope['user'].username, self.scope['user'].cash)

    # Receive message from room group
    def auth_message(self, event):
        if not self.scope['user'].id:
            self.close()

        username = event['username']
        cash = event['cash']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'command': 'auth',
            'username': username,
            'cash': cash
        }))

    @staticmethod
    @receiver(signals.post_save, sender=MarketUser)
    def test(sender, instance, **kwargs):
        print('SOMETHING SENDER ', sender)
        print('SOMETHING INSTANCE ', instance.id)
        group_name = 'auth_%s' % instance.id
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'auth_message',
                'username': instance.username,
                'cash': instance.cash
            }
        )
