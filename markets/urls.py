from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'markets', views.MarketViewSet)
router.register(r'orders', views.OrderViewSet)

urlpatterns = router.urls
