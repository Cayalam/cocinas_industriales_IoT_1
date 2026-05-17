from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    DispositivoViewSet,
    login_view, logout_view, perfil_view,
    ingestar_lectura,
)

router = DefaultRouter()
router.register(r'dispositivos', DispositivoViewSet, basename='dispositivo')

urlpatterns = [
    # Auth
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/perfil/', perfil_view, name='perfil'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ESP32 ingesta (no requiere JWT, usa X-API-Key)
    path('ingesta/', ingestar_lectura, name='ingestar_lectura'),

    # Dispositivos + lecturas anidadas
    path('', include(router.urls)),
]
