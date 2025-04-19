from django.urls import path
from .views import *


urlpatterns = [
    path('', FileListView.as_view()),  # GET
    path('upload/', FileUploadView.as_view()),  # POST
    path('<int:pk>/delete/', FileDeleteView.as_view()),  # DELETE
    path('<int:pk>/edit/', FileUpdateView.as_view()),  # PATCH
    #path('<int:pk>/download/', FileDownloadView.as_view()),  # GET
    path('<int:pk>/download/', FileDownloadView.as_view()),
    path('<int:pk>/generate_link/', GeneratePublicLinkView.as_view()),  # POST
    path('public/<str:link>/', PublicDownloadView.as_view()),  # GET
    #path('public/<uuid:link>/', PublicDownloadView.as_view(), name='public-download'),
]