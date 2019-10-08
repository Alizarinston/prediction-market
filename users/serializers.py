from rest_framework import serializers

from .models import MarketUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketUser
        fields = 'username', 'cash'
