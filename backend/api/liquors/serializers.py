from rest_framework import serializers
from .models import Liquor

class LiquorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Liquor 
        fields = ('public_id', 'name', 'description')
        extra_kwargs = {
            'public_id': {'validators': []},
        }