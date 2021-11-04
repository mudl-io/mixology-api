from typing import OrderedDict
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, permissions
from django.db.models import Count
from django.contrib.postgres.search import TrigramSimilarity
import json
import random

from api.views import JWTAuthViewset
from api.pagination import DefaultPaginator
from .models import Cocktail
from .serializers import *
from custom_user.models import CustomUser


class CocktailsPaginator(DefaultPaginator):
    # return extra data: "user_cocktails_count" and "platform_cocktails_count"
    # used on frontend to determine if should make subsequent request when infinite scrolling is active
    def get_paginated_filtered_response(
        self, data, user_created_count, platform_created_count
    ):
        return Response(
            OrderedDict(
                [
                    ("count", self.page.paginator.count),
                    ("next", self.get_next_link()),
                    ("previous", self.get_previous_link()),
                    ("results", data),
                    ("user_cocktails_count", user_created_count),
                    ("platform_cocktails_count", platform_created_count),
                ]
            )
        )


class CocktailsViewSet(JWTAuthViewset):
    serializer_class = CocktailSerializer
    queryset = Cocktail.objects.all()
    permission_classes = (permissions.AllowAny,)
    pagination_class = CocktailsPaginator

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_cocktail = self.perform_create(serializer)
        new_cocktail_serializer = CocktailSerializer(
            new_cocktail, context={"request": request}, many=False
        )

        headers = self.get_success_headers(serializer.data)
        return Response(
            new_cocktail_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def perform_create(self, serializer):
        cocktail = serializer.save()

        cocktail.created_by = self.request.user
        cocktail.is_default = self.request.user.is_admin
        cocktail.save()

        return cocktail

    def list(self, request, *args, **kwargs):
        queryset = []

        try:
            queryset = self.get_custom_queryset(request)
        except Exception as e:
            if str(e) == "not found":
                return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=["post"], detail=True)
    def save_cocktail(self, request, public_id=None):
        try:
            cocktail = self.get_object()

            if request.user not in cocktail.saved_by.all():
                cocktail.saved_by.add(request.user)
            else:
                cocktail.saved_by.remove(request.user)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False)
    def filtered_cocktails(self, request):
        paginator = CocktailsPaginator()

        liquors_filter = (
            json.loads(request.query_params["liquors_filter"])
            if "liquors_filter" in request.query_params
            else None
        )
        ingredients_filter = (
            json.loads(request.query_params["ingredients_filter"])
            if "ingredients_filter" in request.query_params
            else None
        )

        cocktails = self.get_non_exact_matches(
            liquors_filter, ingredients_filter
        ).order_by("name")

        user_created_count = cocktails.filter(is_default=False).count()
        platform_created_count = cocktails.count() - user_created_count

        page = paginator.paginate_queryset(request=self.request, queryset=cocktails)

        if page is not None:
            serializer = CocktailSerializer(
                page, context={"request": request}, many=True
            )

            if serializer.data:
                return paginator.get_paginated_filtered_response(
                    data=serializer.data,
                    user_created_count=user_created_count,
                    platform_created_count=platform_created_count,
                )

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=["post"], detail=True)
    def viewed_cocktail(self, request, public_id=None):
        cocktail = self.get_object()

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

    def get_custom_queryset(self, request):
        order_by_field = (
            request.query_params["order_by"]
            if "order_by" in request.query_params
            else "name"
        )

        limit = (
            int(request.query_params["limit"])
            if "limit" in request.query_params
            else None
        )

        if not request.query_params:
            return self.filter_queryset(self.get_queryset())
        elif request.query_params["action"] == "saved_cocktails":
            if (
                not request.user
                or request.user.username != request.query_params["username"]
            ):
                raise Exception("forbidden")

            return request.user.saved_cocktails.all().order_by(order_by_field)
        elif request.query_params["action"] == "created_cocktails":
            if not request.user:
                raise Exception("forbidden")

            if request.query_params["username"] != request.user.username:
                user = CustomUser.objects.get(username=request.query_params["username"])
                return user.created_cocktails.filter(is_private=False).order_by(
                    order_by_field
                )

            return request.user.created_cocktails.all().order_by(order_by_field)
        elif request.query_params["action"] == "search":
            search_value = request.query_params["search_value"]
            cocktails = Cocktail.objects.filter(is_private=False)

            if "username" in request.query_params:
                cocktails = cocktails.filter(
                    created_by__username=request.query_params["username"]
                )

            return (
                cocktails.annotate(similarity=TrigramSimilarity("name", search_value))
                .filter(similarity__gt=0.01)
                .order_by("-similarity")[:10]
            )
        elif request.query_params["action"] == "most_liked":
            user = CustomUser.objects.get(username=request.query_params["username"])
            return (
                user.created_cocktails.all()
                .annotate(times_savedd=Count("saved_by"))
                .order_by("-times_savedd")[:limit]
            )
        else:
            raise Exception("not found")

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
                num_liquors=len(liquor_ids),
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
