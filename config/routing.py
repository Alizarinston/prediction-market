from channels.auth import AuthMiddlewareStack
# from .token_auth import TokenAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import markets.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            markets.routing.websocket_urlpatterns
        )
    ),
})
