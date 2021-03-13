from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, permissions, viewsets

from .models import Liquor
from .serializers import *


class LiquorsViewSet(viewsets.ModelViewSet):
    serializer_class = LiquorSerializer
    queryset = Liquor.objects.all()
