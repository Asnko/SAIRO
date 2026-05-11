from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User, EmailVerification, DEPARTMENT_CHOICES
from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    SCHTokenObtainPairSerializer,
    SendVerificationCodeSerializer,
    VerifyCodeSerializer,
    DepartmentSerializer,
)
from .email import send_verification_email


class SCHTokenObtainPairView(TokenObtainPairView):
    """POST /api/auth/token/ — 로그인 (아이디 + 비밀번호 → JWT)"""
    serializer_class = SCHTokenObtainPairSerializer


class RegisterView(APIView):
    """POST /api/auth/register/ — 회원가입"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ — 내 프로필 조회·수정"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self) -> User:
        return self.request.user


class DepartmentListView(APIView):
    """GET /api/auth/departments/ — 전공 목록"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        data = [{'value': v, 'label': l} for v, l in DEPARTMENT_CHOICES]
        return Response(data)


class SendVerificationCodeView(APIView):
    """POST /api/auth/email/send-code/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        verification = EmailVerification.create_for_email(email)
        try:
            send_verification_email(email, verification.code)
        except Exception as e:
            return Response(
                {'detail': f'이메일 발송에 실패했습니다: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {'detail': f'{email} 으로 인증번호를 발송했습니다. 10분 이내에 입력해주세요.'},
            status=status.HTTP_200_OK,
        )


class VerifyCodeView(APIView):
    """POST /api/auth/email/verify-code/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code  = serializer.validated_data['code']

        verification = (
            EmailVerification.objects
            .filter(email=email, is_used=False)
            .order_by('-created_at')
            .first()
        )

        if not verification:
            return Response({'detail': '인증번호를 먼저 요청해주세요.'}, status=status.HTTP_400_BAD_REQUEST)
        if verification.is_expired:
            return Response({'detail': '인증번호가 만료됐습니다. 다시 요청해주세요.'}, status=status.HTTP_400_BAD_REQUEST)
        if not verification.verify(code):
            return Response({'detail': '인증번호가 올바르지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': '이메일 인증이 완료됐습니다.', 'verified': True})
