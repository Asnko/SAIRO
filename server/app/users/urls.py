from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SCHTokenObtainPairView,
    RegisterView,
    MeView,
    DepartmentListView,
    SendVerificationCodeView,
    VerifyCodeView,
)

app_name = 'auth'

urlpatterns = [
    path('token/',              SCHTokenObtainPairView.as_view(),  name='token-obtain'),
    path('token/refresh/',      TokenRefreshView.as_view(),        name='token-refresh'),
    path('register/',           RegisterView.as_view(),            name='register'),
    path('departments/',        DepartmentListView.as_view(),      name='departments'),
    path('email/send-code/',    SendVerificationCodeView.as_view(), name='email-send-code'),
    path('email/verify-code/',  VerifyCodeView.as_view(),          name='email-verify-code'),
    path('me/',                 MeView.as_view(),                  name='me'),
]
