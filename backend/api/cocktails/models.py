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
    complexity = models.IntegerField(
        default=0, validators=[MaxValueValidator(10), MinValueValidator(0)]
    )
    instructions = models.TextField("Instructions", default="mix together")
    ingredients = models.ManyToManyField(Ingredient)
    liquors = models.ManyToManyField(Liquor)
    created_by = models.ForeignKey(
        CustomUser,
        default=None,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_cocktails",
    )
    saved_by = models.ManyToManyField(
        CustomUser, default=None, related_name="saved_cocktails"
    )
    is_private = models.BooleanField(default=False)
    viewed_by = models.ManyToManyField(
        CustomUser, default=None, related_name="viewed_cocktails"
    )

    @property
    def times_saved(self):
        return self.saved_by.count()
    
    @property
    def image(self):
        return self.cocktail_image.first()

    # TODO
    # Use the react-tag-input npm module to generate tags associated with different cocktails

    # tags = TaggableManager()

    def __str__(self):
        return self.name


class LiquorAmount(models.Model):
    liquor = models.ForeignKey(Liquor, on_delete=models.CASCADE)
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE)
    amount = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10)],
    )
    unit = models.CharField("Unit", max_length=10, default="oz")


class IngredientAmount(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    cocktail = models.ForeignKey(Cocktail, on_delete=models.CASCADE)
    amount = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10)],
    )
    unit = models.CharField("Unit", max_length=10, default="oz")
