from rest_framework import serializers
from .models import Cocktail
from ingredients.serializers import IngredientSerializer
from liquors.serializers import LiquorSerializer

class CocktailSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    liquors = LiquorSerializer(many=True)

    class Meta:
        model = Cocktail 
        fields = ('pk', 'name', 'description', 'amt_saved', 'complexity', 'image', 'ingredients', 'liquors', 'instructions')
