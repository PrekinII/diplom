from django.contrib import admin
from .models import File


class FileAdmin(admin.ModelAdmin):
    # Поля, которые будут отображаться в списке файлов
    list_display = ('original_name', 'user', 'size', 'uploaded_at', 'public_link')

    # Фильтры для удобной навигации
    list_filter = ('user', 'uploaded_at')

    # Поиск по полям по полям синий трактор едет к нам
    search_fields = ('original_name', 'comment', 'user__username')

    # Поля только для чтения
    readonly_fields = ('size', 'uploaded_at', 'last_download', 'public_link')

    # Группировка полей при редактировании
    fieldsets = (
        (None, {
            'fields': ('user', 'original_name', 'file')
        }),
        ('Дополнительная информация', {
            'fields': ('size', 'uploaded_at', 'last_download', 'public_link', 'comment'),
            'classes': ('collapse',)
        }),
    )


admin.site.register(File, FileAdmin)