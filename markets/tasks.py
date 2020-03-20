from celery import shared_task
from markets.models import Market
import datetime


@shared_task(name="predict_weather")
def predict_weather(name):
    Market.objects.create(name=name,
                          b=100,
                          start_date=datetime.datetime.now(),
                          end_date=datetime.datetime.now() + datetime.timedelta(days=1),
                          resolved=False,
                          outcomes_description='1;2')
