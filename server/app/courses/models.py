from django.db import models
from django.conf import settings
from urllib.parse import urlencode


class Course(models.Model):
    # 강의 마스터 데이터 - 학사정보시스템에서 sync

    TONE_CHOICES = [
        ('blue',   'Blue'),
        ('sky',    'Sky'),
        ('purple', 'Purple'),
        ('gold',   'Gold'),
    ]
    TYPE_CHOICES = [
        ('major_req',    '전공필수'),
        ('major_elec',   '전공선택'),
        ('major_undiv',  '전공'),
        ('general',      '교양'),
    ]

    year        = models.PositiveIntegerField(verbose_name='학년도')
    smt         = models.CharField(max_length=4, verbose_name='학기코드')
    code        = models.CharField(max_length=20, verbose_name='강의코드(CORS_NO)')
    sbjt_id     = models.CharField(max_length=20, verbose_name='과목ID')
    cls_no      = models.CharField(max_length=10, verbose_name='분반')

    name        = models.CharField(max_length=100, verbose_name='강의명')
    professor   = models.CharField(max_length=50, verbose_name='교수명')
    professor_id = models.CharField(max_length=20, verbose_name='교수번호(EMP_NO)')
    room        = models.CharField(max_length=50, verbose_name='강의실')
    department  = models.CharField(max_length=100, verbose_name='개설학과')
    open_org    = models.CharField(max_length=20, verbose_name='개설부서코드')
    open_shyr   = models.CharField(max_length=10, verbose_name='개설학년')

    course_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='이수구분')
    credits     = models.DecimalField(max_digits=3, decimal_places=1, default=3, verbose_name='학점')
    meeting_raw = models.CharField(max_length=100, blank=True, default='', verbose_name='요일시간(원본)')

    tone        = models.CharField(max_length=10, choices=TONE_CHOICES, default='blue', verbose_name='색상')

    class Meta:
        verbose_name = '강의'
        verbose_name_plural = '강의 목록'
        unique_together = ('year', 'smt', 'code')
        ordering = ['year', 'smt', 'name']

    def __str__(self) -> str:
        return f'{self.name} ({self.code})'

    @property
    def semester(self) -> str:
        return f"{self.year}-{self.smt}"

    @property
    def syllabus_url(self) -> str:
        params = {
            'reportName': 'upj/ule/osbj/UleClassSyllPrt2021',
            'odiNames': 'UleClassSyllPrt2021',
            'odiParams': (
                f'YY:{self.year},SMT:{self.smt},EMP_NO:{self.professor_id},'
                f'SBJT_ID:{self.sbjt_id},OPEN_ORGN:{self.open_org},'
                f'OPEN_SHYR:{self.open_shyr},CLS_NO:{self.cls_no},'
                f'CORS_NO:{self.code},LANG:KOR' # LANG:ENG 도 가능
            )
        }
        return f"https://report.sch.ac.kr/oz7/html5.jsp?{urlencode(params)}"


class CourseMeeting(models.Model):
    # 강의 수업시간 - 강의가 한 주에 여러 요일/시간에 있을 수 있음
    DAY_CHOICES = [(i, d) for i, d in enumerate(['월', '화', '수', '목', '금', '토', '일'])]

    course        = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='meetings')
    day           = models.PositiveSmallIntegerField(choices=DAY_CHOICES, verbose_name='요일')
    start_period  = models.PositiveSmallIntegerField(verbose_name='시작교시')
    end_period    = models.PositiveSmallIntegerField(verbose_name='종료교시')

    class Meta:
        verbose_name = '강의 수업시간'
        verbose_name_plural = '강의 수업시간 목록'
        unique_together = ('course', 'day', 'start_period')
        ordering = ['day', 'start_period']

    def __str__(self) -> str:
        day_name = dict(self.DAY_CHOICES)[self.day]
        return f"{self.course.name} — {day_name}{self.start_period}-{self.end_period}"


class Enrollment(models.Model):
    """수강신청 - 학생 ↔ 강의 M:N"""
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
