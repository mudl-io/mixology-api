from django.contrib import admin
from .models import Cocktail

class CocktailAdmin(admin.ModelAdmin):
    pass

admin.site.register(Cocktail, CocktailAdmin)
