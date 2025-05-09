from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Признак админа
    #is_admin = models.BooleanField(default=False)

    #Относительный путь к личному хранилищу
    storage_path = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.username
