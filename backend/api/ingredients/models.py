from django.db import models
import uuid

from custom_user.models import CustomUser


class Ingredient(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True)
    name = models.CharField("Name", max_length=240)
    description = models.TextField("Description", blank=True)
    created_by = models.ForeignKey(
        CustomUser,
        default=None,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_ingredients",
    )

    def __str__(self):
        return self.name
