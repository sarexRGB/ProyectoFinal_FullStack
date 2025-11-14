from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView

urlpatterns = [
    path('', ClienteListCreateView.as_view(), name = 'clientes-list'),
    path('<int:pk>/', ClienteDetailView.as_view(), name = 'cliente-detail')
]