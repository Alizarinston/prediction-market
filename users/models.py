from django.db import models
from django.contrib.auth.models import AbstractUser


class MarketUser(AbstractUser):
    """ Prediction market custom user model """

    cash = models.FloatField(default=0)

    class Meta:
        db_table = 'users'
