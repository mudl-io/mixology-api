from rest_framework import serializers
from .models import Liquor

from cocktails.models import LiquorAmount


class LiquorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquor
        fields = ("public_id", "name", "description")
        extra_kwargs = {
            "public_id": {"validators": []},
        }


class CocktailLiquorSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField()

    class Meta:
        model = Liquor
        fields = ("public_id", "name", "description", "amount")
        extra_kwargs = {
            "public_id": {"validators": []},
        }

    # serializer is passed in "cocktail_id" from the CocktailSerializer
    # in order to compute this attribute from their join table
    def get_amount(self, instance):
        amount = LiquorAmount.objects.filter(
            liquor=instance, cocktail_id=self.context.get("cocktail_id")
        )
        return amount or 0