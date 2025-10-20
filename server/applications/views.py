from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Application, ComponentImage
from .serializers import ApplicationSerializer, ComponentImageSerializer

@api_view(['GET'])
def get_sports(request):
    """Возвращает список доступных видов спорта"""
    sports = [choice[0] for choice in Application.SPORT_CHOICES]
    return Response(sports)

@api_view(['POST'])
def create_application(request):
    """Создает новую заявку на тренировку"""
    serializer = ApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Заявка успешно создана',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': 'Ошибка при создании заявки',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_images(request):
    """Возвращает все активные изображения компонентов"""
    images = ComponentImage.objects.filter(is_active=True)
    serializer = ComponentImageSerializer(images, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_component_image(request, component):
    """Возвращает изображение для конкретного компонента"""
    try:
        image = ComponentImage.objects.filter(component=component, is_active=True).first()
        if image:
            serializer = ComponentImageSerializer(image)
            return Response(serializer.data)
        else:
            return Response({'message': 'Изображение не найдено'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_component_image(request):
    """Создает новое изображение компонента"""
    serializer = ComponentImageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Изображение успешно создано',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': 'Ошибка при создании изображения',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

def admin_applications(request):
    """Простая админка для просмотра заявок"""
    applications = Application.objects.all()
    return render(request, 'admin_applications.html', {
        'applications': applications
    })

def admin_images(request):
    """Простая админка для управления изображениями"""
    images = ComponentImage.objects.all()
    return render(request, 'admin_images.html', {
        'images': images
    })
