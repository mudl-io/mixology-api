from rest_framework import serializers

from .models import Post
from cocktails.models import Cocktail
from cocktails.serializers import CocktailSerializer
from custom_user.models import CustomUser
from custom_user.serializers import CustomUserSerializer


class PostSerializer(serializers.ModelSerializer):
    posted_by = CustomUserSerializer(many=False, read_only=True)
    cocktail = CocktailSerializer(many=False, read_only=True)
    cocktail_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Post
        fields = (
            "public_id",
            "title",
            "description",
            "created_at",
            "posted_by",
            "cocktail",
            "cocktail_id",
        )
        extra_kwargs = {
            "cocktail_id": {"write_only": True},
        }

    def create(self, validated_data):
        cocktail_id = Cocktail.objects.get(
            public_id=str(validated_data.pop("cocktail_id"))
        ).id
        validated_data["cocktail_id"] = cocktail_id
        validated_data["posted_by_id"] = self.context["request"].user.id

        new_post = self.Meta.model(**validated_data)

        new_post.save()
        return new_post
