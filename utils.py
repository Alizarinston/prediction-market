import logging

from django.core.exceptions import ImproperlyConfigured
from json import loads
from config import constants
from requests import get, exceptions

logger = logging.getLogger('custom')


def get_secret(filename):
    """ Get the secret from json file or raise exception """

    fields = (
        'secret_key', 'db_admin', 'db_pass', 'db_name', 'db_host', 'db_port', 'broker_url', 'hosts', 'admins', 'appid'
    )

    try:
        with open(filename) as secret:
            secret = loads(secret.read())

        return {field: secret[field] for field in fields}

    except IOError:
        raise ImproperlyConfigured('Specified file does not exists: {0}'.format(filename))

    except KeyError as k:
        raise ImproperlyConfigured('Add the {0} field to json secret'.format(k))


secret_dict = get_secret(constants.secret_filename)


class OpenWeatherMap(object):

    def __init__(self, appid: str):
        self.uri = 'https://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=' + appid

    def _request(self, uri: str) -> dict:
        """ Make GET request to given uri """

        try:
            return self._parse_errors(get(uri).json())

        except exceptions.Timeout:
            logger.critical('Timeout occurred')

        except exceptions.ConnectionError as e:
            logger.critical('Connection error: {}'.format(e))

    def city_temperature(self, city: str) -> dict:
        """ Retrieve temperature info """

        return self._request(self.uri.format(city))["main"]["temp"]

    @staticmethod
    def _parse_errors(response: dict) -> dict:
        if 'errors' in response:
            for error in response['errors']:
                logger.warning('OpenWeatherMap response error: {}'.format(error))

            return {}

        return response


owm = OpenWeatherMap(secret_dict.get('appid'))

