from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/auth/(?P<user_name>\w+)/$', consumers.ChatConsumer),
]
