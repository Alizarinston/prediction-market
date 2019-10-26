from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .exceptions import MarketBaseError
from .models import Outcome, Market, Order


class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outcome
        fields = 'id', 'outstanding', 'probability', 'description', 'is_winner'
        read_only_fields = 'outstanding', 'probability', 'is_winner'


class MarketSerializer(serializers.ModelSerializer):
    outcomes = OutcomeSerializer(many=True)

    class Meta:
        model = Market

        fields = (
            'id', 'created', 'name', 'start_date', 'end_date', 'supply', 'anon', 'proposal', 'resolved', 'outcomes',
            'category', 'description'
        )

        read_only_fields = 'created', 'resolved'

    def validate(self, attrs) -> dict:
        # validate start_date and end_date

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


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = 'id', 'created', 'order_type', 'amount', 'user', 'outcome'

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)

        try:
            instance.populate()

        except MarketBaseError as e:
            raise ValidationError({'detail': e.msg})

        instance.save()
        return instance
