from django.urls import path
from . import views

urlpatterns = [
    path('api/sports/', views.get_sports, name='get_sports'),
    path('api/application/', views.create_application, name='create_application'),
    path('api/images/', views.get_images, name='get_images'),
    path('api/images/<str:component>/', views.get_component_image, name='get_component_image'),
    path('api/images/create/', views.create_component_image, name='create_component_image'),
    path('admin/applications/', views.admin_applications, name='admin_applications'),
    path('admin/images/', views.admin_images, name='admin_images'),
]
