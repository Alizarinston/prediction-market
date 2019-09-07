import logging

from django.core.exceptions import ImproperlyConfigured
from requests import get, exceptions
from json import loads

from config import constants

logger = logging.getLogger('custom')


def get_secret(filename):
    """ Get the secret from json file or raise exception """

    fields = (
        'secret_key', 'db_admin', 'db_pass', 'db_name', 'db_host', 'db_port', 'broker_url', 'hosts', 'admins', 'owm_id'
    )

    try:
        with open(filename) as secret:
            secret = loads(secret.read())

        return {field: secret[field] for field in fields}

    except IOError:
        raise ImproperlyConfigured('Specified file does not exists: {0}'.format(filename))

    except KeyError as k:
        raise ImproperlyConfigured('Add the {0} field to json secret'.format(k))


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


secret_dict = get_secret(constants.secret_filename)
owm = OpenWeatherMap(secret_dict['owm_id'])
