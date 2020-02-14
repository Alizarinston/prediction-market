from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from rest_framework.authtoken.models import Token
from .models import MarketUser
from django.db.models import signals
from django.dispatch import receiver
import channels.layers


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = 'auth_%s' % self.user_id

        # Join room group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print('SERVER RECEIVE: ', text_data)
        print('USERID: ', self.user_id)
        text_data_json = json.loads(text_data)

        await self.validate_token(text_data_json)

        if not self.scope['user'].id:
            await self.close()
        else:
            # Send message to room group
            await self.channel_layer.group_send(
                self.user_group_name,
                {
                    'type': 'auth_message',
                    'username': self.scope['user'].username,
                    'cash': self.scope['user'].cash
                }
            )

    async def validate_token(self, text_data_json):
        """
        Check if user is authenticated via Token.
        """
        if self.scope['user'].id:
            pass
        else:
            try:
                if 'token' in text_data_json:
                    token = text_data_json['token']

                    if str(token) == str(Token.objects.filter(user=self.user_id)[0]):
                        profile = MarketUser.objects.filter(pk=self.user_id)
                        self.scope['user'] = profile[0]
                        print('user/cash: ', self.scope['user'].username, self.scope['user'].cash)
                    else:
                        await self.close()
                else:
                    await self.close()

            except Exception as e:
                # Data is not valid, so close it.
                print(e)
                pass

    # Receive message from room group
    async def auth_message(self, event):
        if not self.scope['user'].id:
            await self.close()
        else:
            username = event['username']
            cash = event['cash']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
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
