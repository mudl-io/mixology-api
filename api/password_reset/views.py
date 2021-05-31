from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
import random

from .models import PasswordReset
from custom_user.models import CustomUser

class PasswordResetViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    @action(methods=["post"], detail=False)
    def send_verification_code_email(self, request):
        email = request.data["email"]

        if not email:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        PasswordReset.objects.filter(email=email).update(is_active=False)

        verification_code = ''.join(random.choice('0123456789ABCDEF') for i in range(8))
        new_reset = PasswordReset(email=request.data["email"], verification_code=verification_code, is_active=True)
        
        new_reset.save()

        self.send_email(new_reset)

        return Response(status=status.HTTP_200_OK)
    
    @action(methods=["post"], detail=False)
    def verify_code(self, request):
        code = request.data["verification_code"]
        email = request.data["email"]

        if not code:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        active_reset = PasswordReset.objects.get(email=email, is_active=True)

        if not active_reset:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if active_reset.verification_code.lower() != code.lower():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_200_OK)
    
    @action(methods=["post"], detail=False)
    def reset_password(self, request):
        password = request.data["new_password"]
        email = request.data["email"]

        if not email or not password:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        user = CustomUser.objects.get(email=email)

        if not user:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        user.set_password(password)
        user.save()

        return Response(status=status.HTTP_200_OK) 

    def send_email(self, password_reset):
        send_mail(
            'Cocktail password reset code',
            password_reset.verification_code,
            'cocktail-app-dev@gmail.com',
            [password_reset.email],
            fail_silently=False,
        )
