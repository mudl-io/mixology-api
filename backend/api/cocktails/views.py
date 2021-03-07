from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Count
import json
import random

from .models import Cocktail
from .serializers import *

from liquors.models import Liquor
from ingredients.models import Ingredient

class CocktailsViewSet(viewsets.ModelViewSet):
    serializer_class = CocktailSerializer
    queryset = Cocktail.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        cocktail = serializer.save()

        cocktail.created_by = self.request.user
        cocktail.save()

    @action(detail=False)
    def random_cocktail(self, request):
        liquors_filter = json.loads(request.query_params['liquors_filter'])
        ingredients_filter = json.loads(request.query_params['ingredients_filter'])
        should_be_exact = json.loads(request.query_params['find_exact_match'])

        liquors = Liquor.objects.filter(public_id__in=liquors_filter)
        ingredients = Ingredient.objects.filter(public_id__in=ingredients_filter)

        cocktails = None
        random_cocktail = None

        if should_be_exact:
            cocktails = self.get_tight_matches(liquors, ingredients)
        else:
            cocktails = self.get_loose_matches(liquors, ingredients)

        # try to find as close of a match as possible
        # if this doesn't return any results, send a no content reponse
        if not cocktails.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        random_cocktail = random.choice(cocktails)
        serializer = CocktailSerializer(random_cocktail, context={'request': request}, many=False)

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def get_tight_matches(liquors, ingredients):
        cocktails = None

        if liquors.exists() and ingredients.exists():
            cocktails = Cocktail.objects.annotate(num_liquors=Count('liquors'), num_ingredients=Count('ingredients')) \
                                        .filter(
                                            is_private=False,
                                            liquors__in=liquors,
                                            ingredients__in=ingredients,
                                            num_liquors=liquors.count(),
                                            num_ingredients=ingredients.count()
                                        )
        elif liquors.exists():
            cocktails = Cocktail.objects.annotate(num_liquors=Count('liquors')) \
                                        .filter(
                                            is_private=False,
                                            liquors__in=liquors,
                                            num_liquors=liquors.count(),
                                        )
        elif ingredients.exists():
            cocktails = Cocktail.objects.annotate(num_liquors=Count('liquors')) \
                                        .filter(
                                            is_private=False,
                                            ingredients__in=ingredients,
                                            num_ingredients=ingredients.count()
                                        )
        else:
            cocktails = Cocktail.objects.filter(is_private=False)

        return cocktails

    @staticmethod
    def get_loose_matches(liquors, ingredients):
        cocktails = None

        if liquors.exists() and ingredients.exists():
            cocktails = Cocktail.objects.filter(is_private=False, liquors__in=liquors, ingredients__in=ingredients)
        elif liquors.exists():
            cocktails = Cocktail.objects.filter(is_private=False, liquors__in=liquors)
        elif ingredients.exists():
            cocktails = Cocktail.objects.filter(is_private=False, ingredients__in=ingredients)
        else:
            cocktails = Cocktail.objects.filter(is_private=False)

        return cocktails
