from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    tag_display  = serializers.CharField(source='get_tag_display',  read_only=True)
    tone_display = serializers.CharField(source='get_tone_display', read_only=True)

    class Meta:
        model = Notice
        fields = [
            'id', 'tag', 'tag_display', 'tone', 'tone_display',
            'title', 'summary', 'content', 'source_url',
            'published_at', 'expires_at', 'is_active',
        ]
