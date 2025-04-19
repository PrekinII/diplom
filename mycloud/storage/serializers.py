from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    # Кастомные поля должны быть объявлены здесь
    uploaded_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    size = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.size < 1024:
            return f"{obj.size} B"
        elif obj.size < 1024 * 1024:
            return f"{obj.size / 1024:.2f} KB"
        return f"{obj.size / (1024 * 1024):.2f} MB"

    class Meta:
        model = File
        fields = [
            'id',
            'original_name',
            'comment',
            'uploaded_at',
            'size',
            'last_download',
            'public_link',
            'user'
        ]
        read_only_fields = [
            'id',
            'user',
            'uploaded_at',
            'last_download',
            'public_link',
            'size'  # Так как это вычисляемое поле
        ]
        extra_kwargs = {
            'original_name': {'required': True, 'allow_blank': False},
            'comment': {'required': False, 'allow_blank': True}
        }