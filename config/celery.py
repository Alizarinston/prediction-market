from celery import Celery
from importlib import import_module

settings = import_module('config.settings')

app = Celery(settings.app_name)
app.config_from_object(settings)
app.autodiscover_tasks()
