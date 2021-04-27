from rest_framework import serializers

from .models import ProfilePicture

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePicture
        fields = (
            "public_id",
            "image"
        )
    
    def create(self, validated_data):
        validated_data["user_id"] = self.context["request"].user.id
        validated_data["is_active"] = True

        ProfilePicture.objects.filter(user=self.context["request"].user).update(is_active=False)

        profile_picture = self.Meta.model(**validated_data)
        profile_picture.save()

        return profile_picture
