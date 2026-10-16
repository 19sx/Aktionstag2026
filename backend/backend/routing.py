from django.urls import re_path
from .ChannelConsumer import ChannelConsumer
from .GameConsumer import GameConsumer

websocket_urlpatterns = [
    # [\w-]+ statt \w+, weil UUIDs Bindestriche enthalten
    re_path(r"^ws/game/(?P<game_id>[\w-]+)/?$", GameConsumer.as_asgi()),
    re_path(r"^ws/channel/?$", ChannelConsumer.as_asgi()),
]