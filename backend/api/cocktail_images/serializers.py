from cocktail_images.models import CocktailImage
from rest_framework import serializers

from .models import CocktailImage
from cocktails.models import Cocktail


class CocktailImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CocktailImage
        fields = (
            "public_id",
            "name",
            "image"
        )
    
    def create(self, validated_data):
        cocktail_id = self.context["request"].data["cocktail_id"]
        cocktail = Cocktail.objects.get(public_id=cocktail_id)
        validated_data['cocktail_id'] = cocktail.id
        
        cocktail_image = self.Meta.model(**validated_data)
        cocktail_image.save()
        
        return cocktail_image
