from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from markets import views

urlpatterns = [
    path('markets/', views.MarketList.as_view()),
    path('markets/<int:pk>/', views.MarketDetail.as_view()),
    path('outcomes/', views.OutcomeList.as_view()),
    path('outcomes/<int:pk>/', views.OutcomeDetail.as_view()),
    path('positions/', views.PositionList.as_view()),
    path('positions/<int:pk>/', views.PositionDetail.as_view()),
    path('orders/', views.OrderList.as_view()),
    path('orders/<int:pk>/', views.OrderDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
