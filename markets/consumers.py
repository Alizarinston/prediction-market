from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from rest_framework.authtoken.models import Token
from .models import MarketUser, Market, Order, Outcome
from django.db.models import signals
from django.dispatch import receiver
import channels.layers
from .serializers import OutcomeSerializer, MarketSerializer, OrderSerializer, UserSerializer


class AuthConsumer(AsyncWebsocketConsumer):
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

        if 'token' in text_data_json:
            await self.authenticate(text_data_json)
        else:
            await self.close()

    async def authenticate(self, text_data_json):
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
                    'cash': self.scope['user'].cash,
                    'wallet': self.scope['user'].wallet
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
                token = text_data_json['token']

                if str(token) == str(Token.objects.filter(user=self.user_id)[0]):
                    profile = MarketUser.objects.filter(pk=self.user_id)
                    self.scope['user'] = profile[0]
                    print('user/cash: ', self.scope['user'].username, self.scope['user'].cash)
                    print('WALLET: ', self.scope['user'].wallet)
                else:
                    await self.close()

            except Exception as e:
                # Data is not valid, so close it.
                print(e)
                await self.close()

    # Receive message from room group
    async def auth_message(self, event):
        if not self.scope['user'].id:
            await self.close()
        else:
            username = event['username']
            cash = event['cash']
            wallet = event['wallet']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'command': 'auth',
                'username': username,
                'cash': cash,
                'wallet': wallet
            }))

    @staticmethod
    @receiver(signals.post_save, sender=MarketUser)
    def user_update(sender, instance, **kwargs):
        print('SOMETHING SENDER ', sender)
        print('SOMETHING INSTANCE ', instance.id)
        group_name = 'auth_%s' % instance.id
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'auth_message',
                'username': instance.username,
                'cash': instance.cash,
                'wallet': instance.wallet
            }
        )


class AnonConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel = self.scope['url_route']['kwargs']['channel']
        self.user_group_name = 'anon_%s' % self.channel

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
        print('CHANNEL: ', self.channel)
        text_data_json = json.loads(text_data)

        if 'channel' in text_data_json:
            await self.get_channel_data(text_data_json)
        else:
            await self.close()

    async def get_channel_data(self, text_data_json):
        channel = text_data_json['channel']

        # if 'outcome' in text_data_json:
        #     outcome = text_data_json['outcome']
        #     market_orders = OrderSerializer(Order.objects.all().filter(outcome=outcome), many=True).data
        # else:
        market_data = MarketSerializer(Market.objects.get(id=channel)).data
        # print('First outcome: ', Market.objects.get(id=channel).outcomes.first().id)
        # print('market_data: ', market_data)
        # print('ORDER: ', OrderSerializer(Order.objects.all().filter(outcome=5), many=True).data)
        # print('OUTCOME: ', OutcomeSerializer(Outcome.objects.get(id=8)).data)

        # print('OUTCOME: ', Outcome.objects.get(id=8).order.all())

        market_orders = OrderSerializer(Order.objects.all(), many=True).data
        # if str(channel) == 'markets':
        #     markets = MarketSerializer(Market.objects.filter(proposal=True).order_by('-created'), many=True).data
        # else:
        #     await self.close()

        # Send message to room group
        await self.channel_layer.group_send(
            self.user_group_name,
            {
                'type': 'channel_message',
                'market_data': market_data,
                'market_orders': market_orders
            }
        )

    # Receive message from room group
    async def channel_message(self, event):
        market_data = event['market_data']
        market_orders = event['market_orders']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'command': 'market',
            'market_data': market_data,
            'market_orders': market_orders
        }))

    # async def order_message(self, event):
    #     market_orders = event['market_orders']
    #     print('MARKET_ORDERS: ', market_orders)
    #
    #     # Send message to WebSocket
    #     await self.send(text_data=json.dumps({
    #         'command': 'order',
    #         'market_orders': market_orders
    #     }))

    """ Лол, это тупо """
    @staticmethod
    @receiver(signals.post_save, sender=Order)
    def market_update(sender, instance, **kwargs):
        market_id = instance.outcome.market.all()[0].id
        group_name = 'anon_%s' % market_id
        print('CHANGED: ', instance.outcome.market.all()[0].id)
        print(instance)
        market_data = MarketSerializer(Market.objects.get(id=market_id)).data
        market_orders = OrderSerializer(Order.objects.all(), many=True).data
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'channel_message',
                'market_data': market_data,
                'market_orders': market_orders
            }
        )

    """ Genius """
    # @staticmethod
    # @receiver(signals.post_save, sender=Order)
    # def market_update(sender, instance, **kwargs):
    #     market_id = instance.outcome.market.all()[0].id
    #     group_name = 'anon_%s' % market_id
    #     print('CHANGED: ', instance.outcome.market.all()[0].id)
    #     print(instance)
    #     channel_layer = channels.layers.get_channel_layer()
    #     async_to_sync(channel_layer.group_send)(
    #         group_name,
    #         {
    #             'type': 'order_message',
    #             'market_orders': instance,
    #         }
    #     )
