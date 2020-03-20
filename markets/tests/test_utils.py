import logging

from django.test import TestCase
from django.conf import settings

logging.disable(logging.CRITICAL)


class OWMCase(TestCase):
    """ Test OpenWeatherMap API client """

    def setUp(self) -> None:
        self.api = settings.OWM_CLIENT

    def test_city_temperature(self):
        response = self.api.city_temperature('Kyiv')
        self.assertIsInstance(response, float)

    def test_city_temperature_failure(self):
        response = self.api.city_temperature('Viyk')
        self.assertTrue(response is None)
