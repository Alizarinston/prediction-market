from rest_framework import viewsets, permissions, generics
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.views import APIView, Response

from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from datetime import datetime

from .models import Outcome, Market, Order
from .permissions import UpdateAndIsAdmin
from .serializers import OutcomeSerializer, MarketSerializer, OrderSerializer


class Settings(APIView):
    """ Server settings view """

    @staticmethod
    def get(_request):
        return Response({
            'version': settings.API_VERSION,
            'lang': settings.LANGUAGE_CODE,
            'languages': [language[0] for language in settings.LANGUAGES]
        })


class OutcomeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Outcome.objects.order_by('id')
    serializer_class = OutcomeSerializer


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

    def get_queryset(self):
        """ Filter queryset by url parameters """

        filters = {}
        user = self.request.query_params.get('user')
        order_type = self.request.query_params.get('type')

        if user is not None:
            filters['user__pk'] = user

        if order_type is not None:
            filters['order_type'] = True if order_type == 'sell' else False

        return Order.objects.filter(**filters).order_by('-created')

    @action(methods=['GET'], detail=False, url_path=r'asset/(?P<outcome_pk>[\d]+)')
    def asset(self, _request, outcome_pk):
        """ Get outcome`s asset """

        outcome = generics.get_object_or_404(Outcome, pk=outcome_pk)
        return Response({'asset': Order.calculate_asset(outcome)})
