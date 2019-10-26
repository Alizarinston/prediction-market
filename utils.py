import logging
from requests import get, exceptions
from config import constants

logger = logging.getLogger('custom')


class OpenWeatherMap(object):
    """ Open weather map API client """

    _uri = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid={}&q='

    def __init__(self, appid: str):
        self._uri = self._uri.format(appid)

    def _request(self, uri: str) -> dict:
        """ Make GET request to given uri """

        try:
            return self._parse_errors(get(uri, timeout=constants.owm_timeout).json())

        except exceptions.Timeout:
            logger.critical('Timeout occurred')

        except exceptions.HTTPError as e:
            logger.critical('Http error: {}'.format(e))

        except exceptions.ConnectionError as e:
            logger.critical('Connection error: {}'.format(e))

    def city_temperature(self, city: str) -> float:
        """ Retrieve temperature info """

        response = self._request(self._uri + city)

        if response is not None:
            return response['main']['temp']

    @staticmethod
    def _parse_errors(response: dict) -> (dict, None):
        if response['cod'] != 200:
            logger.warning('OpenWeatherMap response error, code: {}'.format(response['cod']))
            return

        return response
