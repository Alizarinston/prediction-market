release: python manage.py migrate && python manage.py loaddata data.json
web: daphne config.asgi:application 