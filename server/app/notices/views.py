from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Notice
from .serializers import NoticeSerializer


class NoticeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/notices/       — 공지 목록
    GET /api/v1/notices/{id}/  — 공지 상세
    ?tag=scholarship           — 태그 필터
    ?search=장학금              — 검색
    """
    queryset = Notice.objects.filter(is_active=True)
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tag', 'tone']
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['published_at']
    ordering = ['-published_at']
