from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, NoteLinkViewSet

app_name = 'notes'

router = DefaultRouter()
router.register(r'',     NoteViewSet,     basename='note')
router.register(r'links', NoteLinkViewSet, basename='note-link')

urlpatterns = [path('', include(router.urls))]
