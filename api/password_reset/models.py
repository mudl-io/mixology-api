from django.db import models


class PasswordReset(models.Model):
    email = models.EmailField(max_length=254)
    verification_code = models.TextField("Description", null=False, blank=False)
    is_active = models.BooleanField(default=False)
