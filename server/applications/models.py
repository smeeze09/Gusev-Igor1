from django.db import models
from django.utils import timezone

class Application(models.Model):
    SPORT_CHOICES = [
        ('бокс', 'Бокс'),
        ('кикбоксинг', 'Кикбоксинг'),
        ('муай-тай', 'Муай-тай'),
        ('BJJ', 'BJJ'),
        ('вольная борьба', 'Вольная борьба'),
        ('тхэквондо', 'Тхэквондо'),
        ('ОФП', 'ОФП'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Имя')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    sport_type = models.CharField(max_length=20, choices=SPORT_CHOICES, verbose_name='Вид спорта')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.name} - {self.sport_type} ({self.created_at.strftime("%d.%m.%Y %H:%M")})'

class ComponentImage(models.Model):
    COMPONENT_CHOICES = [
        ('hero', 'Главная секция (Hero)'),
        ('lot1', 'Лот 1'),
        ('lot2', 'Лот 2'),
        ('lot3', 'Лот 3'),
        ('about', 'Секция "Об аукционе"'),
        ('training', 'Секция "Тренировки"'),
        ('logo', 'Логотип'),
        ('background', 'Фоновое изображение'),
    ]
    
    component = models.CharField(max_length=20, choices=COMPONENT_CHOICES, verbose_name='Компонент')
    image_url = models.URLField(verbose_name='Ссылка на изображение')
    alt_text = models.CharField(max_length=200, verbose_name='Альтернативный текст')
    is_active = models.BooleanField(default=True, verbose_name='Активно')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Изображение компонента'
        verbose_name_plural = 'Изображения компонентов'
        ordering = ['component', '-created_at']
    
    def __str__(self):
        return f'{self.get_component_display()} - {self.alt_text}'
