release: python manage.py migrate && python manage.py loaddata data.json
web: daphne config.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker -v2