from django.db import models
from users.models import User
import uuid


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_name = models.CharField(max_length=255)
    comment = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    size = models.IntegerField()
    last_download = models.DateTimeField(null=True, blank=True)
    public_link = models.CharField(max_length=64, unique=True, blank=True,null=True)

    def save(self, *args, **kwargs):
        if not self.public_link:
            self.public_link = uuid.uuid4().hex
        super().save(*args, **kwargs)
