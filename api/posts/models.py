from django.db import models
import uuid

from cocktails.models import Cocktail
from custom_user.models import CustomUser


class Post(models.Model):
    public_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, unique=True, editable=False
    )
    title = models.TextField("Name", max_length=50)
    description = models.TextField("Description", null=True, blank=True, max_length=240)
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    cocktail = models.ForeignKey(
        Cocktail, on_delete=models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return self.posted_by.username + " - " + self.title