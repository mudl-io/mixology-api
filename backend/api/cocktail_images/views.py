from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import CocktailImage
from cocktails.models import Cocktail
from .serializers import *


class CocktailImagesViewSet(viewsets.ModelViewSet):
    serializer_class = CocktailImageSerializer
    queryset = CocktailImage.objects.all()
