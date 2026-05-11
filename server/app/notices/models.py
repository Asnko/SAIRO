from django.db import models


class Notice(models.Model):
    TONE_CHOICES = [
        ('neutral', 'Neutral'),
        ('blue',    'Blue'),
        ('sky',     'Sky'),
        ('purple',  'Purple'),
        ('gold',    'Gold'),
        ('success', 'Success'),
        ('warn',    'Warn'),
    ]
    TAG_CHOICES = [
        ('scholarship', '장학'),
        ('academic',    '학사'),
        ('event',       '행사'),
        ('exam',        '시험'),
        ('general',     '일반'),
    ]

    tag        = models.CharField(max_length=20, choices=TAG_CHOICES, verbose_name='태그')
    tone       = models.CharField(max_length=10, choices=TONE_CHOICES, default='neutral', verbose_name='색상')
    title      = models.CharField(max_length=200, verbose_name='제목')
    summary    = models.TextField(verbose_name='요약')
    content    = models.TextField(blank=True, verbose_name='본문')
    source_url = models.URLField(blank=True, verbose_name='원문 URL')
    published_at = models.DateField(verbose_name='게시일')
    expires_at   = models.DateField(null=True, blank=True, verbose_name='만료일')
    is_active    = models.BooleanField(default=True, verbose_name='활성')
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '공지사항'
        verbose_name_plural = '공지사항 목록'
        ordering = ['-published_at']

    def __str__(self) -> str:
        return self.title
