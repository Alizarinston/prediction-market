from rest_framework import generics, permissions

from .models import Market, Outcome, Asset, Order
from .serializers import OutcomeSerializer, MarketSerializer, AssetSerializer, OrderSerializer


class MarketList(generics.ListCreateAPIView):
    """ Get markets list or create a market """

    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [permissions.IsAuthenticated]


class MarketDetail(generics.RetrieveUpdateDestroyAPIView):
    """ Get markets details """

    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [permissions.IsAuthenticated]


class OutcomeList(generics.ListCreateAPIView):
    """ Get outcomes list or create a outcome """

    queryset = Outcome.objects.all()
    serializer_class = OutcomeSerializer


class OutcomeDetail(generics.RetrieveAPIView):
    """ Get outcome details """

    queryset = Outcome.objects.all()
    serializer_class = OutcomeSerializer


class AssetList(generics.ListAPIView):
    """ Get asset list """

    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


class AssetDetail(generics.RetrieveAPIView):
    """ Get asset details """

    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderList(generics.ListCreateAPIView):
    """ Get orders list or create a new order """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderDetail(generics.RetrieveAPIView):
    """ Get order details """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
