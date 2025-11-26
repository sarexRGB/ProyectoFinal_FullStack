from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView

urlpatterns = [
    path('cliente/', ClienteListCreateView.as_view(), name = 'clientes-list'),
    path('cliente/<int:pk>/', ClienteDetailView.as_view(), name = 'cliente-detail')
]