from celery import Celery
from os import environ
from importlib import import_module

# load settings

try:
    environ['DJANGO_SETTINGS_MODULE']

except KeyError:
    environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

settings = import_module(environ['DJANGO_SETTINGS_MODULE'])

# celery configuration

app = Celery(settings.BASE_NAME)
app.config_from_object(settings)
app.autodiscover_tasks()
app.conf.task_default_queue = 'default'
