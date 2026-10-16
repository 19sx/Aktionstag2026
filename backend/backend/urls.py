# urls.py
from django.contrib import admin
from django.urls import path
from .views import force_start_game, create_game

urlpatterns = [
    path("admin/", admin.site.urls),
    path("create-game/", create_game),
    path("force-start/", force_start_game),
]