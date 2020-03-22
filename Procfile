release: python manage.py migrate && python manage.py loaddata data.json
web: gunicorn config.wsgi --log-file -
web2: daphne config.routing:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channel_layer -v2