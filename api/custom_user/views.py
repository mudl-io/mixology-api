from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action

from api.views import JWTAuthViewset
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser, Follower


class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format="json"):
        validations = self.validate_data(request.data)

        if not validations["is_valid"]:
            # return 207 so I can display the error to the user on the front end
            return Response(
                validations["error_message"], status=status.HTTP_207_MULTI_STATUS
            )

        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def validate_data(self, data):
        user = data["username"]
        email = data["email"]

        user_exists = CustomUser.objects.filter(username=user).count() > 0

        if user_exists:
            return {"is_valid": False, "error_message": "Username is already in use"}

        email_exists = CustomUser.objects.filter(email=email).count()

        if email_exists:
            return {
                "is_valid": False,
                "error_message": "Email address is already in use",
            }

        return {"is_valid": True, "error_message": ""}


class CustomUserGet(APIView):
    permission_classes = ()
    authentication_classes = (JWTAuthentication,)

    # find user by username since usernames are unique identifiers
    def get(self, request, format="json"):
        username = request.query_params["username"]

        if not username:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.get(username=username)
        serializer = CustomUserSerializer(
            user, context={"request": request}, many=False
        )

        if serializer.data:
            user_res = serializer.data
            return Response(user_res, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)


class CustomUsersViewset(JWTAuthViewset):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    lookup_field = "username"

    @action(methods=["get"], detail=True)
    def followers(self, request, username=None):
        user = self.get_object()

        follower_ids = Follower.objects.filter(followee=user).values_list(
            "follower", flat=True
        )
        following_users = CustomUser.objects.filter(id__in=follower_ids).order_by(
            "username"
        )

        page = self.paginate_queryset(following_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(following_users, many=True)
        return Response(serializer.data)

    # handles both following and unfollowing another user
    @action(methods=["post"], detail=True)
    def follow(self, request, username=None):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        followee = self.get_object()
        follower = self.request.user

        follow_record = Follower.objects.filter(followee=followee, follower=follower)

        if follow_record.exists():
            follow_record.delete()
        else:
            Follower.objects.create(followee=followee, follower=follower)

        return Response(status=status.HTTP_200_OK)


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
