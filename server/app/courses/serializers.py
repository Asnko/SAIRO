from rest_framework import serializers
from .models import Course, Enrollment


class CourseSerializer(serializers.ModelSerializer):
    course_type_display = serializers.CharField(source='get_course_type_display', read_only=True)
    day_display         = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'professor', 'room',
            'department', 'course_type', 'course_type_display',
            'credits', 'day', 'day_display', 'start_hour',
            'duration', 'tone', 'semester',
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
