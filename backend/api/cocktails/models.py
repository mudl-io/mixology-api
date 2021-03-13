from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
import uuid

# from taggit.managers import TaggableManager

from ingredients.models import Ingredient
from liquors.models import Liquor
from custom_user.models import CustomUser


class Cocktail(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField("Name", max_length=240)
    description = models.TextField("Description", null=True, blank=True)
    amt_saved = models.PositiveIntegerField(default=0)
    complexity = models.IntegerField(
        default=0, validators=[MaxValueValidator(10), MinValueValidator(0)]
    )
    image = models.ImageField(default="./defaultimg.png")
    instructions = models.TextField("Instructions", default="mix together")
    ingredients = models.ManyToManyField(Ingredient)
    liquors = models.ManyToManyField(Liquor)
    created_by = models.ForeignKey(
        CustomUser,
        default=None,
        on_delete=models.SET_NULL,
        null=True,
        related_name="cocktail_created_by",
    )
    saved_by = models.ManyToManyField(
        CustomUser, default=None, related_name="cocktail_saved_by"
    )
    is_private = models.BooleanField(default=False)

    # TODO
    # Use the react-tag-input npm module to generate tags associated with different cocktails

    # tags = TaggableManager()

    def __str__(self):
        return self.name
