from profile_pictures.models import ProfilePicture
from rest_framework import permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import ProfilePictureSerializer

class ProfilePictureViewset(viewsets.ModelViewSet):
    serializer_class = ProfilePictureSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = ProfilePicture.objects.all()

        if self.request.user and not self.request.user.is_anonymous:
            return queryset.filter(user=self.request.user).order_by("created_at").reverse()
        
        return None
