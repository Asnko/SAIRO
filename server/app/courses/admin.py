from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'professor', 'room', 'day', 'start_hour', 'semester']
    list_filter = ['semester', 'day', 'course_type', 'department']
    search_fields = ['name', 'code', 'professor']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at']
    list_filter = ['course__semester']
    search_fields = ['user__student_id', 'course__name']
