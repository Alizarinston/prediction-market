from django.contrib import admin
from backend.models import Portfolio, Market, Outcome, Position, Order

models = [Portfolio, Market, Outcome, Position, Order]
admin.site.register(models)
