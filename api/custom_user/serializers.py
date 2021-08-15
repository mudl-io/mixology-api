from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, Follower

from profile_pictures.serializers import ProfilePictureSerializer


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """

    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    active_profile_picture = ProfilePictureSerializer(many=False, required=False)
    is_followed = serializers.SerializerMethodField("is_being_followed")

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "email",
            "username",
            "password",
            "saved_cocktails_count",
            "created_cocktails_count",
            "viewed_cocktails_count",
            "active_profile_picture",
            "profile_description",
            "is_followed",
            "followers_count",
            "following_count",
        )
        read_only_fields = (
            "saved_cocktails_count",
            "created_cocktails_count",
            "viewed_cocktails_count",
            "active_profile_picture",
            "is_followed",
            "followers_count",
            "following_count",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(
            **validated_data
        )  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    """
    This is an N+1 query waiting to happen. If there is every a moment where grabbing a lot of users
    then this needs to be changed so that it doesn't make a lot of individual queries to get this 
    flag for each relationship.
    """

    def is_being_followed(self, requested_user):
        requesting_user = self.context["request"].user

        if requesting_user.is_anonymous:
            return False

        return Follower.objects.filter(
            follower=requesting_user, followee=requested_user
        ).exists()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)

        # Custom data you want to include
        data.update({"id": self.user.id})
        data.update({"user": self.user.username})
        data.update({"email": self.user.email})

        return data
