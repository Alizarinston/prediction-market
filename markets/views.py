from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.views import Response

from datetime import datetime

from .models import Outcome, Market, Asset, Order
from .permissions import UpdateAndIsAdmin
from .serializers import MarketSerializer, AssetSerializer, OrderSerializer


class MarketViewSet(viewsets.ModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = UpdateAndIsAdmin,

    def get_queryset(self):
        """ Filter queryset by url parameters """

        filters = {}
        proposal = self.request.query_params.get('proposal')
        category = self.request.query_params.get('category')

        if proposal is not None:
            filters['proposal'] = True if proposal == 'true' else False

        if category is not None:
            filters['category'] = category

        return Market.objects.filter(**filters).order_by('-created')

    @action(methods=['patch'], detail=True)
    def resolve(self, request, pk=None):
        """ Resolve specified market by given outcome """

        instance = self.get_object()

        if instance.resolved or instance.proposal or datetime.now().date() < instance.end_date:
            raise ValidationError({'detail': 'Wrong pk.'})

        outcome_pk = request.data.get('outcome_pk')

        if outcome_pk is None:
            raise ValidationError({'detail': 'Wrong outcome_pk.'})

        try:
            outcome = Outcome.objects.get(pk=outcome_pk)

        except Outcome.DoesNotExist:
            raise ValidationError({'detail': 'Wrong outcome_pk.'})

        if outcome not in instance.outcomes.all():
            raise ValidationError({'detail': 'Wrong outcome_pk.'})

        instance.resolve(outcome)
        return Response(self.get_serializer(instance).data)


class AssetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Asset.objects.order_by('id')
    serializer_class = AssetSerializer
    permission_classes = permissions.IsAuthenticated,


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.order_by('-created')
    serializer_class = OrderSerializer
    permission_classes = permissions.IsAuthenticated, UpdateAndIsAdmin
