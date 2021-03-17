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


class CocktailsViewSet(viewsets.ModelViewSet):
    serializer_class = CocktailSerializer
    queryset = Cocktail.objects.all()
    lookup_field = "public_id"  # look up by public_id instead of id or pk
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        cocktail = serializer.save()

        cocktail.created_by = self.request.user
        cocktail.save()

    @action(methods=["post"], detail=False)
    def save_cocktail(self, request):
        try:
            cocktail_id = request.data["public_id"]
            cocktail = Cocktail.objects.get(public_id=cocktail_id)

            if request.user not in cocktail.saved_by.all():
                cocktail.saved_by.add(request.user)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def unsave_cocktail(self, request):
        try:
            cocktail_id = request.data["public_id"]
            cocktail = Cocktail.objects.get(public_id=cocktail_id)

            if request.user in cocktail.saved_by.all():
                cocktail.saved_by.remove(request.user)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False)
    def saved_cocktails(self, request):
        saved_cocktails = request.user.saved_cocktails.all()
        serializer = CocktailSerializer(
            saved_cocktails, context={"request": request}, many=True
        )

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["get"], detail=False)
    def created_cocktails(self, request):
        created_cocktails = request.user.created_cocktails.all()
        serializer = CocktailSerializer(
            created_cocktails, context={"request": request}, many=True
        )

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["get"], detail=False)
    def filtered_cocktails(self, request):
        liquors_filter = json.loads(request.query_params["liquors_filter"])
        ingredients_filter = json.loads(request.query_params["ingredients_filter"])

        cocktails = self.get_non_exact_matches(liquors_filter, ingredients_filter)

        serializer = CocktailSerializer(
            cocktails, context={"request": request}, many=True
        )

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["post"], detail=False)
    def viewed_cocktail(self, request):
        cocktail = Cocktail.objects.get(public_id=request.data["public_id"])

        if request.user and not request.user.is_anonymous:
            cocktail.viewed_by.add(request.user)
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["get"], detail=False)
    def random_cocktail(self, request):
        liquors_filter = json.loads(request.query_params["liquors_filter"])
        ingredients_filter = json.loads(request.query_params["ingredients_filter"])
        should_be_exact = json.loads(request.query_params["find_exact_match"])
        hide_user_cocktails = json.loads(request.query_params["hide_user_cocktails"])

        cocktails = None
        random_cocktail = None

        if should_be_exact:
            cocktails = self.get_exact_matches(liquors_filter, ingredients_filter)
        else:
            cocktails = self.get_non_exact_matches(liquors_filter, ingredients_filter)

        if hide_user_cocktails:
            cocktails = cocktails.filter(created_by__isnull=True)

        # try to find as close of a match as possible
        # if this doesn't return any results, send a no content reponse
        if not cocktails.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        random_cocktail = random.choice(cocktails)
        serializer = CocktailSerializer(
            random_cocktail, context={"request": request}, many=False
        )

        if serializer.data:
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def get_exact_matches(liquor_ids, ingredient_ids):
        cocktails = None

        cocktails = (
            Cocktail.objects.annotate(
                num_liquors=Count("liquors"), num_ingredients=Count("ingredients")
            )
            .filter(
                is_private=False,
                liquors__public_id__in=liquor_ids,
                num_ingredients=len(liquor_ids),
            )
            .filter(
                ingredients__public_id__in=ingredient_ids,
                num_ingredients=len(ingredient_ids),
            )
        )

        return cocktails

    @staticmethod
    def get_non_exact_matches(liquors, ingredients):
        cocktails = None

        if liquors and ingredients:
            cocktails = Cocktail.objects.filter(
                is_private=False,
                liquors__public_id__in=liquors,
                ingredients__public_id__in=ingredients,
            )
        elif liquors:
            cocktails = Cocktail.objects.filter(
                is_private=False, liquors__public_id__in=liquors
            )
        elif ingredients:
            cocktails = Cocktail.objects.filter(
                is_private=False, ingredients__public_id__in=ingredients
            )
        else:
            cocktails = Cocktail.objects.filter(is_private=False)

        return cocktails