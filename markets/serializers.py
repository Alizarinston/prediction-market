from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Outcome, Market, Asset, Order


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outcome
        fields = 'id', 'outstanding', 'probability', 'description', 'is_winner'
        read_only_fields = 'outstanding', 'probability', 'is_winner'


class MarketListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = 'id', 'name', 'start_date', 'end_date', 'supply', 'anon', 'proposal', 'resolved', 'description'


class MarketDetailSerializer(serializers.ModelSerializer):
    outcomes = OutcomeSerializer(many=True)

    class Meta:
        model = Market

        fields = (
            'id', 'created', 'name', 'start_date', 'end_date', 'supply', 'anon', 'proposal', 'resolved', 'outcomes',
            'description'
        )

        read_only_fields = 'created', 'resolved'

    def validate(self, attrs):
        # validate start_date and end_date

        if 'start_date' not in attrs or 'end_date' not in attrs:
            raise ValidationError

        if attrs['start_date'] >= attrs['end_date']:
            raise ValidationError

        return super().validate(attrs)

    def create(self, validated_data: dict) -> Market:
        outcomes = validated_data.pop('outcomes')

        for key in 'proposal', 'supply':
            if key in validated_data:
                validated_data.pop(key)

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
