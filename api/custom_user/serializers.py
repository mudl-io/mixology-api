from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser

from profile_pictures.serializers import ProfilePictureSerializer


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """

    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    active_profile_picture = ProfilePictureSerializer(many=False, required=False)

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
        )
        read_only_fields = (
            "saved_cocktails_count",
            "created_cocktails_count",
            "viewed_cocktails_count",
            "active_profile_picture",
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)

        # Custom data you want to include
        data.update({"id": self.user.id})
        data.update({"user": self.user.username})
        data.update({"email": self.user.email})

        return data
