from rest_framework import serializers
from .models import Liquor

from cocktails.models import LiquorAmount


class LiquorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Liquor
        read_only_fields = ("is_default",)
        fields = ("public_id", "name", "description", "created_by", "is_default")
        extra_kwargs = {
            "public_id": {"validators": []},
        }


class CocktailLiquorSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()

    class Meta:
        model = Liquor
        fields = ("public_id", "name", "description", "amount", "unit")
        extra_kwargs = {
            "public_id": {"validators": []},
        }

    # serializer is passed in "cocktail_id" from the CocktailSerializer
    # in order to compute this attribute from their join table
    def get_amount(self, instance):
        try:
            liquor_amount = LiquorAmount.objects.get(
                liquor=instance, cocktail_id=self.context.get("cocktail_id")
            )

            return liquor_amount.amount
        except:
            return 0

    def get_unit(self, instance):
        try:
            liquor_amount = LiquorAmount.objects.get(
                liquor=instance, cocktail_id=self.context.get("cocktail_id")
            )

            return liquor_amount.unit
        except:
            return "oz"
