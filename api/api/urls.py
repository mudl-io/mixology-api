"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from cocktails.views import CocktailsViewSet
from ingredients.views import IngredientsViewSet
from liquors.views import LiquorsViewSet
from cocktail_images.views import CocktailImagesViewSet
from profile_pictures.views import ProfilePictureViewset
from password_reset.views import PasswordResetViewset

router = DefaultRouter()
router.register(r"^api/cocktails", CocktailsViewSet, basename="cocktail")
router.register(r"^api/ingredients", IngredientsViewSet, basename="ingredient")
router.register(r"^api/liquors", LiquorsViewSet, basename="liquor")
router.register(r"^api/cocktail_images", CocktailImagesViewSet, basename="cocktail_image")
router.register(r"^api/profile_pictures", ProfilePictureViewset, basename="profile_picture")
router.register(r"^api/password_reset", PasswordResetViewset, basename="password_reset")

urlpatterns = [
    url(r"^", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api/", include("custom_user.urls")),
]
