from django.contrib import admin
from .models import Application, ComponentImage

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'sport_type', 'created_at']
    list_filter = ['sport_type', 'created_at']
    search_fields = ['name', 'phone']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

@admin.register(ComponentImage)
class ComponentImageAdmin(admin.ModelAdmin):
    list_display = ['component', 'alt_text', 'is_active', 'created_at']
    list_filter = ['component', 'is_active', 'created_at']
    search_fields = ['alt_text', 'image_url']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['component', '-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('component', 'image_url', 'alt_text', 'is_active')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
