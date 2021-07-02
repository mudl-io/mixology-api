from profile_pictures.models import ProfilePicture
from rest_framework import permissions

from api.views import JWTAuthViewset
from .serializers import ProfilePictureSerializer


class ProfilePictureViewset(JWTAuthViewset):
    serializer_class = ProfilePictureSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

    def get_queryset(self):
        queryset = ProfilePicture.objects.all()

        if self.request.user and not self.request.user.is_anonymous:
            return (
                queryset.filter(user=self.request.user).order_by("created_at").reverse()
            )

        return None
