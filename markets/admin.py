from django.contrib import admin
from .models import Outcome, Market, Order


class OutcomeInline(admin.TabularInline):
    model = Market.outcomes.through


@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    search_fields = 'description',
    readonly_fields = 'is_winner',


@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    search_fields = 'name',
    list_filter = 'start_date', 'end_date', 'resolved'
    exclude = 'outcomes',
    readonly_fields = 'created',
    inlines = OutcomeInline,


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_filter = 'order_type',
    readonly_fields = 'created',
