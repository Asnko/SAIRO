from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/courses/          — 전체 강의 목록
    GET /api/v1/courses/{id}/     — 강의 상세
    ?semester=2026-1&day=2        — 필터링
    ?search=인공지능               — 검색
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['semester', 'day', 'course_type', 'department']
    search_fields = ['name', 'professor', 'room', 'code']


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/courses/enrollments/       — 내 수강 목록
    POST   /api/v1/courses/enrollments/       — 수강신청
    DELETE /api/v1/courses/enrollments/{id}/  — 수강취소
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Enrollment.objects.none()
        return (
            Enrollment.objects
            .filter(user=self.request.user)
            .select_related('course')
        )
