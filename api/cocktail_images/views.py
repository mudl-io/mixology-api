from rest_framework import permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import CocktailImage
from .serializers import *


class CocktailImagesViewSet(viewsets.ModelViewSet):
    serializer_class = CocktailImageSerializer
    queryset = CocktailImage.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.AllowAny,)
    lookup_field = "public_id"  # look up by public_id instead of id or pk
