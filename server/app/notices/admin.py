from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'published_at', 'expires_at', 'is_active']
    list_filter = ['tag', 'tone', 'is_active']
    search_fields = ['title', 'summary']
    date_hierarchy = 'published_at'
