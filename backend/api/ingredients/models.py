from django.db import models
import uuid

class Ingredient(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True)
    name = models.CharField('Name', max_length=240)
    description = models.TextField('Description', blank=True)

    def __str__(self):
        return self.name
