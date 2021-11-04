from rest_framework import permissions

from api.views import JWTAuthViewset
from .models import CocktailImage
from .serializers import *


class CocktailImagesViewSet(JWTAuthViewset):
    serializer_class = CocktailImageSerializer
    queryset = CocktailImage.objects.all()
    permission_classes = (permissions.AllowAny,)
