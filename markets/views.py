from rest_framework import viewsets, mixins, permissions

from .models import Market, Asset, Order
from .serializers import MarketListSerializer, MarketDetailSerializer, AssetSerializer, OrderSerializer


class MarketViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketDetailSerializer

    serializer_action_classes = {
        'list': MarketListSerializer
    }

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        try:
            return self.serializer_action_classes[self.action]

        except (KeyError, AttributeError):
            return super().get_serializer_class()


class AssetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
