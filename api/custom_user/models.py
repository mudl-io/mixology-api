# djsr/authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class CustomUser(AbstractUser):
    profile_description = models.CharField(null=True, max_length=500)

    def __str__(self):
        return self.username

    @property
    def saved_cocktails_count(self):
        return self.saved_cocktails.count()

    @property
    def created_cocktails_count(self):
        return self.created_cocktails.count()

    @property
    def viewed_cocktails_count(self):
        return self.viewed_cocktails.count()

    @property
    def active_profile_picture(self):
        return self.profile_picture.get(is_active=True)

    @property
    def followers_count(self):
        return self.follower.count()

    @property
    def following_count(self):
        return self.followee.count()


class Follower(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    follower = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="follower"
    )
    followee = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="followee"
    )
