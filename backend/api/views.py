from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, CakeOption, Order
from .serializers import CategorySerializer, ProductSerializer, CakeOptionSerializer, OrderSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug', 'is_custom_cake']
    search_fields = ['name', 'description']
    lookup_field = 'slug'

class CakeOptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CakeOption.objects.all()
    serializer_class = CakeOptionSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # In a real app, you might restrict this to authenticated users or specific order tracking
