from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.views import Response

from django.utils.translation import ugettext_lazy as _

from datetime import datetime

from .models import Outcome, Market, Order
from .permissions import UpdateAndIsAdmin
from .serializers import MarketSerializer, OrderSerializer


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
            raise ValidationError({'id': _('Invalid input.')})

        outcome_pk = request.data.get('outcome_pk', None)

        if outcome_pk is None:
            raise ValidationError({'outcome_pk': _('Invalid input.')})

        try:
            outcome = Outcome.objects.get(pk=outcome_pk)

        except Outcome.DoesNotExist:
            raise ValidationError({'outcome_pk': _('Invalid input.')})

        if outcome not in instance.outcomes.all():
            raise ValidationError({'outcome_pk': _('Invalid input.')})

        instance.resolve(outcome)
        return Response(self.get_serializer(instance).data)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.order_by('-created')
    serializer_class = OrderSerializer
    permission_classes = permissions.IsAuthenticated, UpdateAndIsAdmin
