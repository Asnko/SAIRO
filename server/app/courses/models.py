from django.db import models
from django.conf import settings


class Course(models.Model):
    """강의 마스터 데이터"""

    TONE_CHOICES = [
        ('blue',   'Blue'),
        ('sky',    'Sky'),
        ('purple', 'Purple'),
        ('gold',   'Gold'),
    ]
    TYPE_CHOICES = [
        ('major_req',  '전공필수'),
        ('major_elec', '전공선택'),
        ('gen_req',    '교양필수'),
        ('gen_elec',   '교양선택'),
    ]
    DAY_CHOICES = [(i, d) for i, d in enumerate(['월', '화', '수', '목', '금'])]

    name        = models.CharField(max_length=100, verbose_name='강의명')
    code        = models.CharField(max_length=20, unique=True, verbose_name='강의코드')
    professor   = models.CharField(max_length=50, verbose_name='교수명')
    room        = models.CharField(max_length=50, verbose_name='강의실')
    department  = models.CharField(max_length=100, verbose_name='개설학과')
    course_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='이수구분')
    credits     = models.PositiveSmallIntegerField(default=3, verbose_name='학점')
    day         = models.PositiveSmallIntegerField(choices=DAY_CHOICES, verbose_name='요일')
    start_hour  = models.FloatField(verbose_name='시작시간')   # e.g. 10.5 = 10:30
    duration    = models.FloatField(default=1.25, verbose_name='수업시간(h)')
    tone        = models.CharField(max_length=10, choices=TONE_CHOICES, default='blue', verbose_name='색상')
    semester    = models.CharField(max_length=10, verbose_name='학기')  # e.g. '2026-1'

    class Meta:
        verbose_name = '강의'
        verbose_name_plural = '강의 목록'
        ordering = ['day', 'start_hour']

    def __str__(self) -> str:
        return f'{self.name} ({self.code})'


class Enrollment(models.Model):
    """수강신청 — 학생 ↔ 강의 M:N"""
    user   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        verbose_name = '수강신청'
        verbose_name_plural = '수강신청 목록'

    def __str__(self) -> str:
        return f'{self.user} → {self.course}'
