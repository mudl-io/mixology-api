from django.db import models
import uuid

from custom_user.models import CustomUser

class ProfilePicture(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(default="./defaultimg.png")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="profile_picture")
    is_active =  models.BooleanField(default=False)
