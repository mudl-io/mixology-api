# djsr/authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    def __str__(self):
        return self.username

    # TODO
    # Add @property tags for "created_cocktails" and "saved_cocktails"

    @property
    def created_cocktails(self):
        return None

    @property
    def saved_cocktails(self):
        return None
