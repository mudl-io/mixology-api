from rest_framework import viewsets
from django.db.models import Q

from .models import Ingredient
from .serializers import *


class IngredientsViewSet(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer

    def perform_create(self, serializer):
        ingredient = serializer.save()

        ingredient.created_by = self.request.user
        ingredient.is_default = self.request.user.is_admin
        ingredient.save()

    # perform logical OR to get all elements that are either created by default or are created by the requesting user
    def get_queryset(self):
        queryset = Ingredient.objects.filter(
            Q(created_by__isnull=True) | Q(created_by=self.request.user)
        )
        return queryset
