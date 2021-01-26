from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
# from taggit.managers import TaggableManager

from ingredients.models import Ingredient
from liquors.models import Liquor

class Cocktail(models.Model):
    name = models.CharField('Name', max_length=240)
    description = models.TextField('Description')
    amt_saved = models.PositiveIntegerField()
    complexity = models.IntegerField(
        default=0,
        validators=[
            MaxValueValidator(10),
            MinValueValidator(0)
        ]
    )
    image = models.ImageField(default='./defaultimg.png')
    instructions = models.TextField('Instructions', default='mix together')
    ingredients = models.ManyToManyField(Ingredient)
    liquors = models.ManyToManyField(Liquor)

    # TODO
    # Use the react-tag-input npm module to generate tags associated with different cocktails

    # tags = TaggableManager()

    def __str__(self):
        return self.name