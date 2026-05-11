from django.db import models
from django.conf import settings


class Note(models.Model):
    """학생 메모 — Context Chain 노드"""
    user    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    title   = models.CharField(max_length=200, verbose_name='제목')
    content = models.TextField(blank=True, verbose_name='내용')
    course  = models.CharField(max_length=100, blank=True, verbose_name='관련 강의')
    tags    = models.JSONField(default=list, verbose_name='태그')
    is_weak = models.BooleanField(default=False, verbose_name='이해 부족')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = '메모'
        verbose_name_plural = '메모 목록'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title


class NoteLink(models.Model):
    """메모 간 연결 (Context Chain 엣지)"""
    source = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='outgoing_links')
    target = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='incoming_links')
    weight = models.FloatField(default=1.0, verbose_name='연결 강도')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('source', 'target')
        verbose_name = '메모 연결'
        verbose_name_plural = '메모 연결 목록'

    def __str__(self) -> str:
        return f'{self.source} → {self.target}'
