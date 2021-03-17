from rest_framework import serializers

from .models import Cocktail
from ingredients.serializers import CocktailIngredientSerializer
from liquors.serializers import CocktailLiquorSerializer
from custom_user.serializers import CustomUserSerializer

from liquors.models import Liquor
from ingredients.models import Ingredient


class CocktailSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()
    liquors = serializers.SerializerMethodField()
    created_by = CustomUserSerializer(many=False)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        fields = (
            "public_id",
            "name",
            "description",
            "complexity",
            "image",
            "ingredients",
            "liquors",
            "instructions",
            "created_by",
            "is_private",
            "is_saved",
            "times_saved",
        )

    # only called when running "serializer.save() in view"
    def create(self, validated_data):
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

    def get_is_saved(self, instance):
        user = self.context["request"].user

        if not user:
            return False

        return user in instance.saved_by.all()

    def get_ingredients(self, instance):
        return CocktailIngredientSerializer(
            instance.ingredients, many=True, context={"cocktail_id": instance.id}
        ).data

    def get_liquors(self, instance):
        return CocktailLiquorSerializer(
            instance.liquors, many=True, context={"cocktail_id": instance.id}
        ).data
