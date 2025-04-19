from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse, Http404
from django.utils import timezone
from .models import File
from .serializers import FileSerializer
from django.http import FileResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from urllib.parse import quote
import os
from rest_framework import status # Статусы HTTP для Response
import logging


logger = logging.getLogger(__name__)

# Получаем список файлов (для обычных пользователей - толькьо свои, для админов - можно указать user_id)
class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        user_id = self.request.query_params.get('user_id')
        if user.is_staff and user_id:
            return File.objects.filter(user_id=user_id)
        return File.objects.filter(user=user)

# Загрузка файла
class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        comment = request.data.get('comment', '')
        if not request.user.is_authenticated:
            return Response({'error': 'Требуется авторизация'}, status=403)

        if not file:
            return Response({'error': 'Файл не передан'}, status=400)

        file_obj = File.objects.create(
            user=request.user,
            original_name=file.name,
            file=file,
            comment=comment,
            size=file.size
        )
        logger.info(f"{request.user.username} загрузил файл: {file.name}")
        return Response(FileSerializer(file_obj).data, status=201)

# Удаление файла
class FileDeleteView(generics.DestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise Http404
        instance.file.delete(save=False)  # Удаление физического файла
        logger.warning(f"Файл удалён: {instance.original_name}")
        instance.delete()


# Обновление данных файла(имя, комментарий)
class FileUpdateView(generics.UpdateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_update(self, serializer):
        file = self.get_object()
        if file.user != self.request.user and not self.request.user.is_staff:
            raise Http404
        logger.debug(f"Файл обновлен: {file.original_name}")
        serializer.save()


# Генерация публичной ссылки
class GeneratePublicLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            file = File.objects.get(pk=pk)
            if file.user != request.user and not request.user.is_staff:
                return Response({'error': 'Нет доступа'}, status=403)
            if not file.public_link:
                file.save()
            return Response({'public_link': file.public_link}) #f'/api/storage/public/{file.public_link}/'
        except File.DoesNotExist:
            return Response({'error': 'Файл не найден'}, status=404)


class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file = get_object_or_404(File, pk=pk)

            # Проверка прав доступа
            if file.user != request.user and not request.user.is_staff:
                return HttpResponseBadRequest("Нет доступа к файлу")

            # Открываем файл в бинарном режиме
            file_stream = file.file.open('rb')

            # Создаем ответ с файлом
            response = FileResponse(file_stream)

            # Устанавливаем обязательные заголовки
            response['Content-Type'] = 'application/octet-stream'

            # Формируем правильный Content-Disposition
            filename = file.original_name
            ascii_filename = filename.encode('ascii', errors='ignore').decode('ascii')

            if filename == ascii_filename:
                # Если имя файла в ASCII, используем простой формат
                filename_header = f'attachment; filename="{filename}"'
            else:
                # Для Unicode-имен используем RFC 5987 кодировку
                filename_header = f"attachment; filename*=UTF-8''{quote(filename)}"

            response['Content-Disposition'] = filename_header
            response['Content-Length'] = file.file.size

            # Логируем скачивание
            file.last_download = timezone.now()
            file.save()

            return response

        except Exception as e:
            logger.error(f"Download error: {str(e)}")
            return HttpResponseBadRequest("Ошибка при скачивании файла")

# Скачивание через публичную ссылку
class PublicDownloadView(APIView):
    def get(self, request, link):
        try:
            file = get_object_or_404(File, public_link=link)

            file_stream = file.file.open('rb')
            response = FileResponse(file_stream)

            # Важно: кодируем имя файла для корректной работы с UTF-8
            filename_header = f'attachment; filename="{file.original_name}"'
            if any(ord(char) > 127 for char in file.original_name):
                from urllib.parse import quote
                filename_header = f"attachment; filename*=UTF-8''{quote(file.original_name)}"

            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = filename_header
            response['Content-Length'] = file.file.size

            file.last_download = timezone.now()
            file.save()

            return response

        except Exception as e:
            logger.error(f"Public download error: {str(e)}")
            return HttpResponseBadRequest("Неверная ссылка или файл недоступен")