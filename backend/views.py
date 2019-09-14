from backend.models import Market, Outcome
from backend.serializers import MarketSerializer
from backend.serializers import OutcomeSerializer, PositionSerializer, OrderSerializer
from rest_framework.views import APIView, Response
from rest_framework import generics, permissions, status


class MarketList(generics.ListCreateAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer


class MarketDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer


class OutcomeList(APIView):
    def get(self, request):
        """
        This view should return a list of all the outcomes,
        if there is no 'market' keyword argument and
        all outcomes for a particular market if there is a 'market
        keyword argument.
        """
        market = request.GET.get('market', None)
        if market:
            outcomes = Outcome.objects.filter(market__id=market)
        else:
            outcomes = Outcome.objects.all()
        serializer = OutcomeSerializer(outcomes, many=True)
        return Response(serializer.data)


class OutcomeDetail(generics.RetrieveAPIView):
    queryset = Outcome.objects.all()
    serializer_class = OutcomeSerializer


class PositionList(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        positions = self.request.user.portfolio.positions.all()
        return positions


class PositionDetail(generics.RetrieveAPIView):
    serializer_class = PositionSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        positions = self.request.user.portfolio.positions.all()
        return positions


class OrderList(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        portfolio = request.user.portfolio
        data = {**request.data, 'portfolio': portfolio.id}
        serializer = OrderSerializer(data=data)
        if portfolio:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        orders = self.request.user.portfolio.orders.all()
        return orders


class OrderDetail(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        orders = self.request.user.portfolio.orders.all()
        return orders
