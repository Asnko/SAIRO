from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.conf import settings

from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/courses/           - 전체 강의 목록
    GET /api/courses/{id}/      - 강의 상세
    ?year=2026&smt=11           - 필터링 11 = 1학기, 12 = 하기계절학기, 21 = 2학기, 22 = 동기계절학기
    ?search=인공지능             - 검색
    """
    queryset = Course.objects.prefetch_related('meetings')
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny] if settings.DEBUG else [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['year', 'smt', 'course_type', 'department']
    search_fields = ['name', 'professor', 'room', 'code']


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    GET    /api/courses/enrollments/       - 내 수강 목록
    POST   /api/courses/enrollments/       - 수강신청
    DELETE /api/courses/enrollments/{id}/  - 수강취소
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
            .prefetch_related('course__meetings')
        )

