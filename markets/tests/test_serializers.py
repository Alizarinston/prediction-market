from rest_framework.test import APITestCase
from json import loads

from ..serializers import OutcomeSerializer, MarketSerializer

TEST_DATA_PATH = 'markets/tests/test_data.json'


def load_data(filename=TEST_DATA_PATH):
    with open(filename) as file:
        return loads(file.read())


data = load_data()


class SerializersTestCase(APITestCase):
    def setUp(self) -> None:
        self.outcome_data = data['outcome']
        self.market_data = data['market']

    def test_serializer_creation(self):
        serializer = OutcomeSerializer(data=self.outcome_data)
        self.assertTrue(serializer.is_valid())

        serializer = MarketSerializer(data=self.market_data)
        self.assertTrue(serializer.is_valid())
        market = serializer.create(serializer.validated_data)
        self.assertEqual(market.name, self.market_data['name'])
        self.assertEqual(market.description, self.market_data['description'])
        self.assertEqual(market.outcomes.first().description, data['market']['outcomes'][0]['description'])
        self.assertEqual(market.outcomes.first().probability, 50)
        self.assertEqual(market.outcomes.all()[1].description, data['market']['outcomes'][1]['description'])
        self.assertEqual(market.outcomes.all()[1].probability, 50)
