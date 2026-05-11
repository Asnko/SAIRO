from rest_framework import serializers
from .models import Note, NoteLink


class NoteLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteLink
        fields = ['id', 'source', 'target', 'weight', 'created_at']
        read_only_fields = ['id', 'created_at']


class NoteSerializer(serializers.ModelSerializer):
    linked_count = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'course',
            'tags', 'is_weak', 'linked_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'linked_count', 'created_at', 'updated_at']

    def get_linked_count(self, obj: Note) -> int:
        return obj.outgoing_links.count() + obj.incoming_links.count()

    def create(self, validated_data: dict) -> Note:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
