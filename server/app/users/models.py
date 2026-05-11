from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random
import string


# ── 전공 목록 ─────────────────────────────────────────────────────────────────
# 나중에 Admin에서 추가/수정 가능. 아래는 임시 데이터.
DEPARTMENT_CHOICES = [
    # ── 의과대학 ──────────────────────────────────────────────────────────
    ('medicine',              '의학과'),

    # ── 간호보건대학 ──────────────────────────────────────────────────────
    ('nursing',               '간호학과'),
    ('medical_lab',           '임상병리학과'),
    ('physical_therapy',      '물리치료학과'),
    ('occupational_therapy',  '작업치료학과'),
    ('radiology',             '방사선학과'),
    ('health_admin',          '보건행정경영학과'),

    # ── 인문사회대학 ──────────────────────────────────────────────────────
    ('korean_lang',           '국어국문학과'),
    ('english_lang',          '영어영문학과'),
    ('history',               '사학과'),
    ('philosophy',            '철학과'),
    ('social_welfare',        '사회복지학과'),
    ('law',                   '법학과'),
    ('public_admin',          '행정학과'),
    ('economics',             '경제학과'),

    # ── 경영대학 ──────────────────────────────────────────────────────────
    ('business',              '경영학과'),
    ('accounting',            '회계학과'),
    ('trade',                 '무역학과'),

    # ── 자연과학대학 ──────────────────────────────────────────────────────
    ('math',                  '수학과'),
    ('physics',               '물리학과'),
    ('chemistry',             '화학과'),
    ('biology',               '생명과학과'),
    ('food_nutrition',        '식품영양학과'),
    ('child_family',          '아동가족학과'),

    # ── 공과대학 ──────────────────────────────────────────────────────────
    ('mechanical_eng',        '기계공학과'),
    ('electrical_eng',        '전기공학과'),
    ('electronic_eng',        '전자공학과'),
    ('chemical_eng',          '화학공학과'),
    ('civil_eng',             '토목환경공학과'),
    ('architecture',          '건축학과'),
    ('industrial_eng',        '산업경영공학과'),

    # ── IT융합대학 ────────────────────────────────────────────────────────
    ('computer_sw',           '컴퓨터소프트웨어공학과'),
    ('ai_bigdata',            'AI빅데이터학과'),
    ('information_security',  '정보보호학과'),
    ('media_comm',            '미디어커뮤니케이션학과'),
    ('game',                  '게임학과'),

    # ── 예체능대학 ────────────────────────────────────────────────────────
    ('design',                '디자인학과'),
    ('sports',                '스포츠과학과'),
]


class User(AbstractUser):
    """
    Custom user model.
    - username : 로그인 아이디 (AbstractUser 기본 필드 그대로 사용)
    - department : DEPARTMENT_CHOICES 중 선택
    - email : SCH 이메일 (인증 필수)
    """
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        blank=True,
        verbose_name='전공',
    )
    gpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        verbose_name='평점',
    )
    ai_tone = models.CharField(
        max_length=10,
        choices=[('formal', '격식체'), ('casual', '반말')],
        default='formal',
        verbose_name='AI 말투',
    )
    is_email_verified = models.BooleanField(
        default=False,
        verbose_name='이메일 인증 여부',
    )

    # username 이 로그인 식별자 (AbstractUser 기본값 유지)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자 목록'

    def __str__(self) -> str:
        return f'{self.get_full_name()} (@{self.username})'

    @property
    def initials(self) -> str:
        name = self.get_full_name()
        return name[:2] if name else self.username[:2].upper()

    @property
    def department_display(self) -> str:
        return dict(DEPARTMENT_CHOICES).get(self.department, self.department)


class EmailVerification(models.Model):
    """이메일 인증번호 — 6자리, 10분 유효"""

    email      = models.EmailField(verbose_name='이메일')
    code       = models.CharField(max_length=6, verbose_name='인증번호')
    is_used    = models.BooleanField(default=False, verbose_name='사용 여부')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(verbose_name='만료 시각')

    class Meta:
        verbose_name = '이메일 인증'
        verbose_name_plural = '이메일 인증 목록'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.email} — {self.code}'

    @classmethod
    def generate_code(cls) -> str:
        return ''.join(random.choices(string.digits, k=6))

    @classmethod
    def create_for_email(cls, email: str) -> 'EmailVerification':
        cls.objects.filter(email=email, is_used=False).update(is_used=True)
        return cls.objects.create(
            email=email,
            code=cls.generate_code(),
            expires_at=timezone.now() + timezone.timedelta(minutes=10),
        )

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def verify(self, code: str) -> bool:
        if self.is_used or self.is_expired:
            return False
        if self.code != code:
            return False
        self.is_used = True
        self.save(update_fields=['is_used'])
        return True
