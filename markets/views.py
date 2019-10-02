from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import Response
from rest_framework.generics import ListAPIView

from datetime import datetime

from .models import Outcome, Market, Asset, Order
from .permissions import UpdateAndIsAdmin
from .serializers import MarketListSerializer, MarketDetailSerializer, AssetSerializer, OrderSerializer


class MarketViewSet(viewsets.ModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketDetailSerializer

    serializer_action_classes = {
        'list': MarketListSerializer
    }

    # permission_classes = permissions.IsAuthenticated, UpdateAndIsAdmin

    def get_serializer_class(self):
        try:
            return self.serializer_action_classes[self.action]

        except (KeyError, AttributeError):
            return super().get_serializer_class()

    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        """ Resolve specified market by given outcome """

        instance = self.get_object()

        if instance.resolved or instance.proposal:
            return Response(data={'detail': 'Wrong pk.'}, status=status.HTTP_400_BAD_REQUEST)

        if datetime.now().date() < instance.end_date:
            return Response(data={'detail': 'Wrong pk.'}, status=status.HTTP_400_BAD_REQUEST)

        outcome_pk = request.data.get('outcome_pk')

        if outcome_pk is None:
            return Response(data={'detail': 'Wrong outcome_pk.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            outcome = Outcome.objects.get(pk=outcome_pk)

        except Outcome.DoesNotExist:
            return Response(data={'detail': 'Wrong outcome_pk.'}, status=status.HTTP_400_BAD_REQUEST)

        if outcome not in instance.outcomes.all():
            return Response(data={'detail': 'Wrong outcome_pk.'}, status=status.HTTP_400_BAD_REQUEST)

        instance.resolve(outcome)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class MarketFilteredList(ListAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketListSerializer
    # permission_classes = permissions.IsAuthenticated,

    def get_queryset(self):
        proposal = self.kwargs['proposal']

        if proposal == 'true':
            proposal = True

        else:
            proposal = False

        return Market.objects.filter(proposal=proposal)


class AssetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = permissions.IsAuthenticated,


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = permissions.IsAuthenticated,
