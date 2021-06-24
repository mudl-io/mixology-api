from django.db import migrations
from django.contrib.postgres.operations import TrigramExtension


class Migration(migrations.Migration):

    dependencies = [
        ("cocktails", "0024_remove_cocktail_image"),
    ]

    operations = [TrigramExtension()]
