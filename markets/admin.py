from django.contrib import admin
from .models import Outcome, Market, Proposal, Asset, Order


@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    search_fields = 'description',


@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    search_fields = 'name',
    list_filter = 'start_date', 'end_date', 'resolved'


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    search_fields = 'name',
    list_filter = 'start_date', 'end_date', 'supply'


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_filter = 'closed',


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_filter = 'order_type',
