from django.db import models

class Liquor(models.Model):
    name = models.CharField('Name', max_length=240)
    description = models.TextField('Description')

    def __str__(self):
        return self.name