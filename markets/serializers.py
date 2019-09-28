from rest_framework import serializers
from .models import Outcome, Market, Asset, Order


class OutcomeSerializer(serializers.ModelSerializer):
    is_winner = serializers.BooleanField(required=False)
    probability = serializers.FloatField(required=False)

    class Meta:
        model = Outcome
        fields = 'id', 'outstanding', 'probability', 'description', 'is_winner'


class MarketSerializer(serializers.ModelSerializer):
    outcomes = OutcomeSerializer(many=True)

    class Meta:
        model = Market

        fields = (
            'id', 'created', 'name', 'start_date', 'end_date', 'supply', 'anon', 'proposal', 'resolved', 'outcomes',
            'description'
        )

    def create(self, validated_data: dict) -> Market:
        outcomes = validated_data.pop('outcomes')
        market = Market.objects.create(**validated_data)
        probability = 100 / len(outcomes)

        for outcome_data in outcomes:
            outcome_data['probability'] = probability
            outcome = Outcome.objects.create(**outcome_data)
            market.outcomes.add(outcome)

        return market


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = 'id', 'amount', 'closed', 'outcome'


class OrderSerializer(serializers.ModelSerializer):
    asset = AssetSerializer()

    class Meta:
        model = Order
        fields = 'id', 'created', 'order_type', 'amount', 'asset'
