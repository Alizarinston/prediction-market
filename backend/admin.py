from django.contrib import admin
from .models import Market, Outcome, Position, Order

admin.site.register([Market, Outcome, Position, Order])
