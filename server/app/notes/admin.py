from django.contrib import admin
from .models import Note, NoteLink


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'course', 'is_weak', 'created_at']
    list_filter = ['is_weak', 'course']
    search_fields = ['title', 'content', 'user__student_id']


@admin.register(NoteLink)
class NoteLinkAdmin(admin.ModelAdmin):
    list_display = ['source', 'target', 'weight', 'created_at']
