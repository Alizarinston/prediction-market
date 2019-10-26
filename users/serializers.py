from rest_framework import serializers

from .models import MarketUser
from markets.serializers import OrderSerializer


class UserSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(read_only=True, many=True)

    class Meta:
        model = MarketUser
        fields = 'username', 'cash', 'orders'
        read_only_fields = 'cash', 'orders'
