from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from django.http import HttpResponse
from rest_framework.permissions import AllowAny

def home_view(request):
    return HttpResponse("""
        <h1>Добро пожаловать в MyCloud</h1>
        <p><a href="/admin/">Админка</a></p>
        <p><a href="http://localhost:3000">Фронтенд</a></p>
    """)

# Регистрация
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Вход
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user = authenticate(request, username=request.data.get("username"),
                            password=request.data.get("password"))
        if user is not None:
            login(request, user)  # станавливаем сессию
            return Response({"user": UserSerializer(user).data})
        return Response({"error": "Неверные данные"}, status=400)


# Текущий пользователь
class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({"error": "Не авторизован"}, status=401)

# Список пользователей (только для админа)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


# Удаления пользователя (только для админа)
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Проверка авторизации

    def post(self, request):
        logout(request)
        return Response({"message": "Вы вышли"})


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)