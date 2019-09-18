from rest_framework import serializers
from markets.models import Market, Outcome, Asset, Order


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = ('id', 'name', 'b', 'number_of_outcomes', 'start_date', 'end_date', 'resolved', 'outcomes_description')


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outcome
        fields = ('id', 'market', 'description', 'outstanding', 'probability', 'winning')


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ('id', 'outcome', 'market', 'portfolio', 'amount', 'closed')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'outcome', 'market', 'portfolio', 'position', 'type', 'amount', 'timestamp')
        read_only_fields = ('market', 'position', 'timestamp')
