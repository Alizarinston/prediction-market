from django.test import TestCase
from utils import secret_dict, OpenWeatherMap


class OWMCase(TestCase):
    """ Test OpenWeatherMap API client """

    def setUp(self) -> None:
        self.api = OpenWeatherMap(secret_dict['owm_id'])

    def test_city_temperature(self):
        response = self.api.city_temperature('Kyiv')
        self.assertIsInstance(response, float)

    def test_city_temperature_failure(self):
        response = self.api.city_temperature('Viyk')
        self.assertTrue(response is None)
