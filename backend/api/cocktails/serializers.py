from rest_framework import serializers

from .models import Cocktail
from ingredients.serializers import IngredientSerializer
from liquors.serializers import LiquorSerializer
from liquors.models import Liquor
from ingredients.models import Ingredient


class CocktailSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    liquors = LiquorSerializer(many=True)

    class Meta:
        model = Cocktail
        fields = (
            "public_id",
            "name",
            "description",
            "amt_saved",
            "complexity",
            "image",
            "ingredients",
            "liquors",
            "instructions",
            "created_by",
            "is_private",
        )

    # only called when running "serializer.save() in view"
    def create(self, validated_data):
        breakpoint()
        liquors = validated_data.pop("liquors", None)
        ingredients = validated_data.pop("ingredients", None)

        liquor_ids = [liquor["public_id"] for liquor in liquors]
        ingredient_ids = [ingredient["public_id"] for ingredient in ingredients]

        liquor_ids = [
            liquor["id"]
            for liquor in Liquor.objects.filter(public_id__in=liquor_ids).values()
        ]
        ingredient_ids = [
            ingredient["id"]
            for ingredient in Ingredient.objects.filter(
                public_id__in=ingredient_ids
            ).values()
        ]

        cocktail = self.Meta.model(**validated_data)
        cocktail.save()

        cocktail.liquors.set(liquor_ids)
        cocktail.ingredients.set(ingredient_ids)

        return cocktail
