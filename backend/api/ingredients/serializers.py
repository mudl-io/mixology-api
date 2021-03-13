from rest_framework import serializers
from .models import Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ("public_id", "name", "description")
        extra_kwargs = {
            "public_id": {"validators": []},
        }
