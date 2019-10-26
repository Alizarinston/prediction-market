# Prediction market

[![Actions Status](https://github.com/AverHLV/prediction-market/workflows/tests/badge.svg)](https://github.com/AverHLV/prediction-market/actions) [![codecov](https://codecov.io/gh/AverHLV/prediction-market/branch/dev/graph/badge.svg?token=IqTC5VfkNe)](https://codecov.io/gh/AverHLV/prediction-market)

Simple prediction market on django and django-rest-framework.

## Installation
- Install requirements: `pip install -r requirements.txt`;
- Create `market` database;
- Run migrations: `python manage.py migrate`;
- Populate database: `python manage.py loaddata data.json`;
- Login with default admin credentials: `admin/admin`;
- If you want to use custom config set `MARKET_CONF` env variable to your config name,
config should be in `config` folder, otherwise `default.ini` config will be user.


## API specs:
* `api/settings/`: API settings info, only `GET` allowed;
* `api/auth/`: [rest auth endpoints](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html).
* `api/markets/`: provides all actions for `Market` model.
* `api/markets/<market_id>/resolve/`: only `PATCH` allowed, resolve market by `outcome_pk` field.
* `api/orders/`: provides all actions for `Order` model;
* `api/orders/asset/<outcome_pk>/`: get asset (total amount from all orders) for specific outcome.

### Pagination

Default pagination structure:
```json
{
    "count": "results length",
    "next": "next page url",
    "previous": "previous page url",
    "results": ["result0", "result1", "..."]
}
```

* page max size: 50.
* ordering: from newest to oldest.

### Filters

- Markets filter parameters: `proposal`, `category`.

For example, filter markets by category `Other` and proposal `True`:

`GET /api/markets/?category=OTH&proposal=true`

- Orders filter parameters: `user`, `type`.

Filter orders by user `1` and order type `sell`:

`GET /api/orders/?user=1&type=sell`.