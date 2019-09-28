# Prediction market

[![Actions Status](https://github.com/AverHLV/prediction-market/workflows/tests/badge.svg)](https://github.com/AverHLV/prediction-market/actions) [![codecov](https://codecov.io/gh/AverHLV/prediction-market/branch/dev/graph/badge.svg?token=IqTC5VfkNe)](https://codecov.io/gh/AverHLV/prediction-market)

Simple prediction market on django and django-rest-framework.

## Installation
- Install requirements: `pip install -r requirements.txt`
- Create `market` database.
- Run migrations: `python manage.py migrate`
- Populate database: `python manage.py loaddata data.json`
- Login with default admin credentials: `admin/market_admin`

## API specs:
* `api/auth`: [rest auth endpoints](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html).
* `api/markets`: provides such markets actions as: `create()`, `retrieve()` and `list()`.
* `api/assets`: provides read only actions: `list()` and `retrieve()`.
* `api/orders`: provides read only actions: `list()` and `retrieve()`.