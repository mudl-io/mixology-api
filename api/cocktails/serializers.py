from rest_framework import serializers

from .models import Cocktail, LiquorAmount, IngredientAmount
from ingredients.serializers import CocktailIngredientSerializer
from liquors.serializers import CocktailLiquorSerializer
from custom_user.serializers import CustomUserSerializer
from cocktail_images.serializers import CocktailImageSerializer

from liquors.models import Liquor
from ingredients.models import Ingredient


class CocktailSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()
    liquors = serializers.SerializerMethodField()
    image = CocktailImageSerializer(many=False, required=False)
    created_by = CustomUserSerializer(many=False, required=False)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Cocktail
        read_only_fields = ("image",)
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
        liquors = self.get_liquors_to_save()
        ingredients = self.get_ingredients_to_save()

        liquor_ids = [liquor["id"] for liquor in liquors.values()]
        ingredient_ids = [ingredient["id"] for ingredient in ingredients.values()]

        cocktail = self.Meta.model(**validated_data)
        cocktail.save()

        cocktail.liquors.set(liquor_ids)
        cocktail.ingredients.set(ingredient_ids)

        self.save_liquor_amounts(cocktail)
        self.save_ingredient_amounts(cocktail)

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

    def get_liquors_to_save(self):
        liquors = self.context["request"].data["liquors"]
        liquor_ids = [liquor["public_id"] for liquor in liquors]

        return Liquor.objects.filter(public_id__in=liquor_ids)

    def get_ingredients_to_save(self):
        ingredients = self.context["request"].data["ingredients"]
        ingredient_ids = [ingredient["public_id"] for ingredient in ingredients]

        return Ingredient.objects.filter(public_id__in=ingredient_ids)

    def save_liquor_amounts(self, cocktail):
        liquor_models = self.get_liquors_to_save()
        amounts = []

        for liquor_model in liquor_models:
            request_liquor = self.find_item(self.context["request"].data["liquors"], liquor_model.public_id)
            amount = request_liquor["amount"]
            unit = request_liquor["unit"]
            amounts.append(
                {
                    "amount": amount,
                    "unit": unit,
                    "liquor": liquor_model,
                    "cocktail": cocktail,
                }
            )

        LiquorAmount.objects.bulk_create([LiquorAmount(**values) for values in amounts])

    def save_ingredient_amounts(self, cocktail):
        ingredient_models = self.get_ingredients_to_save()
        amounts = []

        for ingredient_model in ingredient_models:
            request_ingredient = self.find_item(self.context["request"].data["ingredients"], ingredient_model.public_id)
            amount = request_ingredient["amount"]
            unit = request_ingredient["unit"]
            amounts.append(
                {
                    "amount": amount,
                    "unit": unit,
                    "ingredient": ingredient_model,
                    "cocktail": cocktail,
                }
            )

        IngredientAmount.objects.bulk_create(
            [IngredientAmount(**values) for values in amounts]
        )

    def find_item(self, options, public_id):
        for option in options:
            if option['public_id'] == str(public_id):
                return option
