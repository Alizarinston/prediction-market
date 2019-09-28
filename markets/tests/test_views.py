from rest_framework.test import force_authenticate, APITestCase, APIRequestFactory

from users.models import MarketUser
from .test_serializers import data
from ..views import MarketViewSet


class ViewSetsTestCase(APITestCase):
    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.user = MarketUser.objects.create_superuser(username='user', email='', password='pass')

    def test_market_views(self):
        request = self.factory.post('api/markets/', data=data['market'], format='json')
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'post': 'create'})(request)
        self.assertEqual(response.status_code, 201)

        request = self.factory.get('api/markets/')
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'get': 'list'})(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], data['market']['name'])

        pk = response.data[0]['id']
        request = self.factory.get('api/markets/{}/'.format(pk))
        force_authenticate(request, self.user)
        response = MarketViewSet.as_view(actions={'get': 'retrieve'})(request, pk=pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], pk)
        self.assertEqual(response.data['name'], data['market']['name'])
