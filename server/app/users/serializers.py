import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, EmailVerification, DEPARTMENT_CHOICES

SCH_EMAIL_DOMAINS = ('@sch.ac.kr', '@asan.sch.ac.kr', '@mail.sch.ac.kr')


def validate_sch_email(email: str) -> str:
    if not any(email.lower().endswith(d) for d in SCH_EMAIL_DOMAINS):
        raise serializers.ValidationError(
            '순천향대학교 이메일(@sch.ac.kr, @asan.sch.ac.kr, @mail.sch.ac.kr)만 사용 가능합니다.'
        )
    return email.lower()


# ── 전공 목록 API용 ───────────────────────────────────────────────────────────

class DepartmentSerializer(serializers.Serializer):
    """전공 목록 — value/label 쌍"""
    value = serializers.CharField()
    label = serializers.CharField()


# ── 사용자 ────────────────────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    initials           = serializers.ReadOnlyField()
    full_name          = serializers.SerializerMethodField()
    department_display = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'full_name',
            'email', 'department', 'department_display',
            'gpa', 'ai_tone', 'initials', 'is_email_verified',
        ]
        read_only_fields = ['id', 'initials', 'full_name', 'department_display', 'is_email_verified']

    def get_full_name(self, obj: User) -> str:
        return obj.get_full_name()


# ── 이메일 인증 ───────────────────────────────────────────────────────────────

class SendVerificationCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        return validate_sch_email(value)


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code  = serializers.CharField(min_length=6, max_length=6)

    def validate_email(self, value: str) -> str:
        return validate_sch_email(value)


# ── 회원가입 ──────────────────────────────────────────────────────────────────

class UserRegisterSerializer(serializers.Serializer):
    """
    회원가입 필드:
      - name       : 이름
      - username   : 아이디 (영문+숫자, 4~20자)
      - department : 전공 코드 (DEPARTMENT_CHOICES의 value)
      - email      : SCH 이메일 (인증 완료)
      - password   : 비밀번호 (8자 이상)
    """
    name       = serializers.CharField(max_length=50)
    username   = serializers.CharField(min_length=4, max_length=20)
    department = serializers.ChoiceField(choices=[c[0] for c in DEPARTMENT_CHOICES])
    email      = serializers.EmailField()
    password   = serializers.CharField(min_length=8, write_only=True)

    def validate_username(self, value: str) -> str:
        if not re.fullmatch(r'[a-zA-Z0-9_]+', value):
            raise serializers.ValidationError('아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.')
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('이미 사용 중인 아이디입니다.')
        return value.lower()

    def validate_email(self, value: str) -> str:
        value = validate_sch_email(value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('이미 가입된 이메일입니다.')
        verified = EmailVerification.objects.filter(email=value, is_used=True).exists()
        if not verified:
            raise serializers.ValidationError('이메일 인증을 먼저 완료해주세요.')
        return value

    def create(self, validated_data: dict) -> User:
        name     = validated_data.pop('name')
        password = validated_data.pop('password')
        user = User(
            first_name=name,
            is_email_verified=True,
            **validated_data,
        )
        user.set_password(password)
        user.save()
        return user


# ── JWT ───────────────────────────────────────────────────────────────────────

class SCHTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT 응답에 user 프로필 포함"""

    def validate(self, attrs: dict) -> dict:
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
