from django.db import models
import uuid

from cocktails.models import Cocktail

class CocktailImage(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField("Name", max_length=240)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(default="./defaultimg.png")
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE)
