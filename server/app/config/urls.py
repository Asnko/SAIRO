"""
SCH Campus AI — Root URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def ping(request):
    """GET /api/v1/ping/ — 연결 테스트"""
    return JsonResponse({
        'status': 'ok',
        'message': '🎓 SCH Campus AI 서버에 연결됐습니다!',
        'server': 'Django 5.1',
        'version': '1.0.0',
    })


# API v1 prefix
API_V1 = 'api/v1/'

urlpatterns = [
    # ── Health check (인증 불필요) ──────────────────────────────────────────
    path(API_V1 + 'ping/', ping, name='ping'),

    # ── Admin ──────────────────────────────────────────────────────────────
    path('admin/', admin.site.urls),

    # ── API v1 ─────────────────────────────────────────────────────────────
    path(API_V1 + 'auth/',    include('app.users.urls',   namespace='auth')),
    path(API_V1 + 'courses/', include('app.courses.urls', namespace='courses')),
    path(API_V1 + 'notices/', include('app.notices.urls', namespace='notices')),
    path(API_V1 + 'notes/',   include('app.notes.urls',   namespace='notes')),
    path(API_V1 + 'campus/',  include('app.campus.urls',  namespace='campus')),

    # ── OpenAPI Schema ─────────────────────────────────────────────────────
    path('api/schema/',        SpectacularAPIView.as_view(),        name='schema'),
    path('api/docs/',          SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/',         SpectacularRedocView.as_view(url_name='schema'),   name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
