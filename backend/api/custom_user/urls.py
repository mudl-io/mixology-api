from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from django.conf.urls import url, include

from .views import CustomUserCreate,  LogoutAndBlacklistRefreshTokenForUserView, ObtainTokenPairWithUser

urlpatterns = [
    path('user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('token/obtain/', ObtainTokenPairWithUser.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist')
]
