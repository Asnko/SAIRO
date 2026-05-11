"""
이메일 발송 유틸리티
"""
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_verification_email(email: str, code: str) -> None:
    """
    HTML 인증번호 이메일 발송.
    개발 환경(console backend)에서는 터미널에 출력됩니다.
    """
    subject = f'[SCH Campus AI] 이메일 인증번호: {code}'

    # 텍스트 fallback
    text_body = (
        f'SCH Campus AI 이메일 인증\n\n'
        f'인증번호: {code}\n\n'
        f'10분 이내에 앱에 입력해주세요.\n'
        f'본인이 요청하지 않은 경우 이 메일을 무시하세요.'
    )

    # HTML 렌더링 — 각 자리를 리스트로 전달 (템플릿에서 for loop)
    html_body = render_to_string('users/email_verification.html', {
        'email': email,
        'code': list(code),   # ['1','2','3','4','5','6']
    })

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    msg.attach_alternative(html_body, 'text/html')
    msg.send()
