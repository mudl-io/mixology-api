# djsr/authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

from cocktails.models import Cocktail

class CustomUser(AbstractUser):
    created_cocktails = models.ManyToManyField(Cocktail, related_name='created_cocktail')
    saved_cocktails = models.ManyToManyField(Cocktail, related_name='saved_cocktail')
