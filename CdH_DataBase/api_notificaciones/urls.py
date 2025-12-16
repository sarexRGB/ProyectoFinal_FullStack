from django.urls import path
from .views import NotificacionListCreateView, NotificacionDetailView

urlpatterns = [
    path('notificacion/', NotificacionListCreateView.as_view(), name='notificación-list'),
    path('notificacion/<int:pk>/', NotificacionDetailView.as_view(), name='notificación-detail'),
]
