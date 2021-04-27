from profile_pictures.models import ProfilePicture
from rest_framework import permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import ProfilePictureSerializer

class ProfilePictureViewset(viewsets.ModelViewSet):
    serializer_class = ProfilePictureSerializer
    queryset = ProfilePicture.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.AllowAny,)
