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
        try:
            ingredient_amount = IngredientAmount.objects.get(
                ingredient=instance, cocktail_id=self.context.get("cocktail_id")
            )

            return ingredient_amount.amount
        except:
            return 0

    def get_unit(self, instance):
        try:
            ingredient_amount = IngredientAmount.objects.get(
                ingredient=instance, cocktail_id=self.context.get("cocktail_id")
            )

            return ingredient_amount.unit
        except:
            return "oz"
