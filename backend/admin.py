from django.contrib import admin
from backend.models import Portfolio, Market, Outcome, Position, Order

# Register your models here.
models = [Portfolio, Market, Outcome, Position, Order]
admin.site.register(models)
