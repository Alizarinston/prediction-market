from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MarketUser


@admin.register(MarketUser)
class CustomUserAdmin(UserAdmin):
    model = MarketUser
    list_display = 'username', 'is_active', 'is_superuser', 'cash'
    search_fields = 'username',
    ordering = '-date_joined',


CustomUserAdmin.fieldsets += ('MarketUser fields', {'fields': ('cash',)}),
