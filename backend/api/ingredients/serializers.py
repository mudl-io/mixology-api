from rest_framework import serializers
from .models import Ingredient

from cocktails.models import IngredientAmount


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ("public_id", "name", "description")
        extra_kwargs = {
            "public_id": {"validators": []},
        }


class CocktailIngredientSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = ("public_id", "name", "description", "amount", "unit")
        extra_kwargs = {
            "public_id": {"validators": []},
        }

    # serializer is passed in "cocktail_id" from the CocktailSerializer
    # in order to compute this attribute from their join table
    def get_amount(self, instance):
        amount = IngredientAmount.objects.filter(
            ingredient=instance, cocktail_id=self.context.get("cocktail_id")
        ).only("amount")
        return amount or 0

    def get_unit(self, instance):
        unit = IngredientAmount.objects.filter(
            ingredient=instance, cocktail_id=self.context.get("cocktail_id")
        ).only("unit")
        return unit or "oz"
