from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser


class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format="json"):
        validations = self.validate_data(request.data)

        if not validations["is_valid"]:
            # return 207 so I can display the error to the user on the front end
            return Response(validations["error_message"], status=status.HTTP_207_MULTI_STATUS)

        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def validate_data(self, data):
        user = data['username']
        email = data['email']

        user_exists = CustomUser.objects.filter(username=user).count() > 0

        if user_exists:
            return {"is_valid": False, "error_message": "Username is already in use"}

        email_exists = CustomUser.objects.filter(email=email).count()

        if email_exists:
            return {"is_valid": False, "error_message": "Email address is already in use"}

        return {"is_valid": True, "error_message": ""}
        


class ObtainTokenPairWithUser(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
