from rest_framework import viewsets
from django.db.models import Q

from .models import Liquor
from .serializers import *


class LiquorsViewSet(viewsets.ModelViewSet):
    serializer_class = LiquorSerializer

    def perform_create(self, serializer):
        liquor = serializer.save()

        liquor.created_by = self.request.user
        liquor.save()
    
    # perform logical OR to get all elements that are either created by default or are created by the requesting user
    def get_queryset(self):
        queryset = Liquor.objects.filter(Q(created_by__isnull=True) | Q(created_by=self.request.user))
        return queryset
