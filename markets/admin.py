from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Outcome, Market, Order, MarketUser


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


@admin.register(MarketUser)
class CustomUserAdmin(UserAdmin):
    model = MarketUser
    list_display = 'username', 'is_active', 'is_superuser', 'cash'
    search_fields = 'username',
    ordering = '-date_joined',


CustomUserAdmin.fieldsets += ('MarketUser fields', {'fields': ('cash',)}),
