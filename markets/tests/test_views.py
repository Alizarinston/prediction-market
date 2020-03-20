from rest_framework.test import force_authenticate, APITestCase, APIRequestFactory
from django.contrib.auth import get_user_model

from .test_serializers import data
from ..views import MarketViewSet
from ..models import Outcome, Market


class ViewSetsTestCase(APITestCase):
    fixtures = 'data.json',

    def setUp(self) -> None:
        self.factory = APIRequestFactory()

        self.outcome = Outcome.objects.first()
        self.market = Market.objects.first()
        self.user = get_user_model().objects.get_by_natural_key('admin')

    def test_market_create(self):
        request = self.factory.post('api/markets/', data=data['market'], format='json')
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'post': 'create'})(request)
        self.assertEqual(response.status_code, 201)

    def test_market_list(self):
        request = self.factory.get('api/markets/?proposal=false')
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'get': 'list'})(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['name'], data['market']['name'])
        self.assertEqual(response.data['results'][0]['proposal'], False)

        request = self.factory.get('api/markets/?proposal=true')
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'get': 'list'})(request)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(not len(response.data['results']))

    def test_market_retrieve(self):
        request = self.factory.get('api/markets/{}/'.format(self.market.pk))
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'get': 'retrieve'})(request, pk=self.market.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.market.pk)
        self.assertEqual(response.data['name'], data['market']['name'])

    def test_market_resolve(self):
        request = self.factory.patch('api/markets/{}/resolve/', data={'outcome_pk': self.outcome.pk})
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'patch': 'resolve'})(request, pk=self.market.pk)

        self.outcome.refresh_from_db()
        self.market.refresh_from_db()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.outcome.is_winner())
        self.assertTrue(self.market.resolved)

        request = self.factory.patch('api/markets/{}/resolve/', data={'outcome_pk': self.outcome.pk})
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'patch': 'resolve'})(request, pk=self.market.pk)
        self.assertTrue(response.status_code, 400)
