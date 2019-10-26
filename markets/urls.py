from rest_framework.routers import DefaultRouter
from django.urls import path

from . import views

router = DefaultRouter()
router.register(r'markets', views.MarketViewSet)
router.register(r'orders', views.OrderViewSet)

urlpatterns = [
    path('settings/', views.Settings.as_view()),
]

urlpatterns += router.urls
