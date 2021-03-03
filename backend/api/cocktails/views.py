from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, permissions, viewsets
import random

from .models import Cocktail
from .serializers import *

class CocktailsViewSet(viewsets.ModelViewSet):
    serializer_class = CocktailSerializer
    queryset = Cocktail.objects.all()
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False)
    def random_cocktail(self, request):
        cocktails = Cocktail.objects.all()
        random_cocktail = random.choice(cocktails)
        serializer = CocktailSerializer(random_cocktail, context={'request': request}, many=False)

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)
