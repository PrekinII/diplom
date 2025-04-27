from django.middleware import csrf
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from users.views import home_view

# @ensure_csrf_cookie
# def get_csrf_token(request):
#     return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})

@ensure_csrf_cookie
def get_csrf_token(request):
    token = csrf.get_token(request)  # возвращает актуальный CSRF-токен
    return JsonResponse({'csrfToken': token})

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/storage/', include('storage.urls')),
    path('api/csrf/', get_csrf_token),
]

# Обработка медиафайлов
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
