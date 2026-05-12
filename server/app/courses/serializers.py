from rest_framework import serializers
from .models import Course, CourseMeeting, Enrollment


class CourseMeetingSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = CourseMeeting
        fields = ['id', 'day', 'day_display', 'start_period', 'end_period']


class CourseSerializer(serializers.ModelSerializer):
    course_type_display = serializers.CharField(source='get_course_type_display', read_only=True)
    meetings = CourseMeetingSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'year', 'smt', 'code', 'sbjt_id', 'cls_no',
            'name', 'professor', 'professor_id', 'room',
            'department', 'open_org', 'open_shyr',
            'course_type', 'course_type_display',
            'credits', 'meeting_raw', 'meetings',
            'tone', 'semester', 'syllabus_url',
        ]
        read_only_fields = [
            'year', 'smt', 'code', 'sbjt_id', 'cls_no',
            'name', 'professor', 'professor_id', 'room',
            'department', 'open_org', 'open_shyr',
            'course_type', 'credits', 'meeting_raw', 'meetings',
            'semester', 'syllabus_url',
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True,
    )

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_id', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']

    def create(self, validated_data: dict) -> Enrollment:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
