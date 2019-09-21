from rest_framework import serializers
from .models import Outcome, Market, Asset, Order


class OutcomeSerializer(serializers.ModelSerializer):
    is_winner = serializers.BooleanField()

    class Meta:
        model = Outcome
        fields = 'id', 'outstanding', 'probability', 'description', 'is_winner'


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = 'id', 'created', 'name', 'start_date', 'end_date', 'resolved', 'outcomes'


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = 'id', 'amount', 'closed', 'outcome'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = 'id', 'created', 'order_type', 'amount', 'asset'
