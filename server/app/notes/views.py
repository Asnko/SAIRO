from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Note, NoteLink
from .serializers import NoteSerializer, NoteLinkSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/notes/          — 내 메모 목록
    POST   /api/v1/notes/          — 메모 생성
    GET    /api/v1/notes/{id}/     — 메모 상세
    PATCH  /api/v1/notes/{id}/     — 메모 수정
    DELETE /api/v1/notes/{id}/     — 메모 삭제
    GET    /api/v1/notes/{id}/links/ — 연결된 메모 목록
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['course', 'is_weak']
    search_fields = ['title', 'content', 'course']

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Note.objects.none()
        return Note.objects.filter(user=self.request.user)

    @action(detail=True, methods=['get'])
    def links(self, request, pk=None):
        """GET /api/v1/notes/{id}/links/ — 이 메모와 연결된 메모들"""
        note = self.get_object()
        outgoing = NoteLink.objects.filter(source=note).select_related('target')
        incoming = NoteLink.objects.filter(target=note).select_related('source')
        linked_notes = (
            [link.target for link in outgoing] +
            [link.source for link in incoming]
        )
        serializer = NoteSerializer(linked_notes, many=True, context={'request': request})
        return Response(serializer.data)


class NoteLinkViewSet(viewsets.ModelViewSet):
    """
    POST   /api/v1/notes/links/       — 메모 연결 생성
    DELETE /api/v1/notes/links/{id}/  — 메모 연결 삭제
    """
    serializer_class = NoteLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return NoteLink.objects.none()
        return NoteLink.objects.filter(source__user=self.request.user)
