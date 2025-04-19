from rest_framework import serializers
from .models import User
import re


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name']
        extra_kwargs = {"password": {"write_only": True}}

    def validate_username(self, value):
        # !!! Улучшенная валидация логина с детальными сообщениями
        if len(value) < 4 or len(value) > 20:
            raise serializers.ValidationError(
                "Длина логина должна быть от 4 до 20 символов"
            )
        if not re.match(r'^[a-zA-Z]', value):
            raise serializers.ValidationError(
                "Логин должен начинаться с латинской буквы"
            )
        if not re.match(r'^[a-zA-Z0-9]+$', value):
            raise serializers.ValidationError(
                "Логин может содержать только латинские буквы и цифры"
            )
        return value

    def validate_email(self, value):
        # Валидация email
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', value):
            raise serializers.ValidationError(
                "Введите корректный email адрес"
            )
        return value

    def validate_password(self, value):
        # Сообщения для пароля
        errors = []
        if len(value) < 6:
            errors.append("минимум 6 символов")
        if not re.search(r'[A-Z]', value):
            errors.append("хотя бы одна заглавная буква")
        if not re.search(r'\d', value):
            errors.append("хотя бы одна цифра")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            errors.append("хотя бы один спецсимвол (!@#$%^&* и др.)")

        if errors:
            raise serializers.ValidationError(
                "Пароль должен содержать: " + ", ".join(errors)
            )
        return value

    def create(self, validated_data):
        # Чеширование пароля при создании
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', '')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    #is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'is_staff']
        read_only_fields = ['is_staff']  # !!! Запрет изменения статуса админа через API

