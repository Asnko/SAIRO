from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BuildingViewSet, RouteView

app_name = 'campus'

router = DefaultRouter()
router.register(r'buildings', BuildingViewSet, basename='building')

urlpatterns = [
    path('', include(router.urls)),
    path('route/', RouteView.as_view(), name='route'),
]
