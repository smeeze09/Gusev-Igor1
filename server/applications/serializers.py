from rest_framework import serializers
from .models import Application, ComponentImage

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'name', 'phone', 'sport_type', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_phone(self, value):
        # Простая валидация телефона
        if not value or len(value) < 10:
            raise serializers.ValidationError("Введите корректный номер телефона")
        return value
    
    def validate_name(self, value):
        # Валидация имени
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Имя должно содержать минимум 2 символа")
        return value.strip()

class ComponentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentImage
        fields = ['id', 'component', 'image_url', 'alt_text', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_image_url(self, value):
        # Простая валидация URL
        if not value or not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Введите корректную ссылку на изображение")
        return value
