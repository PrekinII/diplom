from django.urls import path
from .views import *

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", CurrentUserView.as_view()),
    path("all/", UserListView.as_view()),
    path("<int:pk>/delete/", UserDeleteView.as_view())
]
