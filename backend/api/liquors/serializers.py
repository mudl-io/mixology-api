from rest_framework import serializers
from .models import Liquor

class LiquorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Liquor 
        fields = ('pk', 'name', 'description')