from django.contrib import admin
from .models import Course, CourseMeeting, Enrollment


class CourseMeetingInline(admin.TabularInline):
    model = CourseMeeting
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'professor', 'room', 'semester', 'credits', 'course_type']
    list_filter = ['year', 'smt', 'course_type', 'department']
    search_fields = ['name', 'code', 'professor', 'sbjt_id']
    inlines = [CourseMeetingInline]
    readonly_fields = ['semester', 'syllabus_url']


@admin.register(CourseMeeting)
class CourseMeetingAdmin(admin.ModelAdmin):
    list_display = ['course', 'day', 'start_period', 'end_period']
    list_filter = ['day', 'course__year', 'course__smt']
    search_fields = ['course__name']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at']
    list_filter = ['course__year', 'course__smt']
    search_fields = ['user__student_id', 'course__name']

