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
* `api/auth/`: [rest auth endpoints](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html).
* `api/markets/`: provides all actions: `create()`, `retrieve()`, `update()`, `partial_update()` and `list()`.
* `api/markets/<market_id>/resolve/`: only `PATCH` allowed, resolve market by "outcome_pk" field.
* `api/assets/`: provides read only actions: `list()` and `retrieve()`.
* `api/orders/`: provides read only actions: `list()` and `retrieve()`.

Markets filter parameters: `proposal`, `category`.

For example, filter markets by category `Other` and proposal `True`:

`/api/markets/?category=OTH&proposal=true`