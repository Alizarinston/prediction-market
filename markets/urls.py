from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import SimpleRouter
from django.urls import path

from . import views

router = SimpleRouter()
router.register('markets', views.MarketViewSet)
router.register('assets', views.AssetViewSet)
router.register('orders', views.OrderViewSet)

urlpatterns = [
    path('markets/proposal/<str:proposal>/', views.MarketFilteredList.as_view()),
]

urlpatterns += router.urls
urlpatterns = format_suffix_patterns(urlpatterns)
