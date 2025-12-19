from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, CakeOption, Order, SiteContent, UIAsset
from .serializers import (CategorySerializer, ProductSerializer, CakeOptionSerializer, 
                          OrderSerializer, SiteContentSerializer, UIAssetSerializer)
from rest_framework.response import Response
from rest_framework.views import APIView

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

class SiteContentView(APIView):
    def get(self, request):
        config = SiteContent.load()
        serializer = SiteContentSerializer(config, context={'request': request})
        return Response(serializer.data)

class UIAssetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UIAsset.objects.all()
    serializer_class = UIAssetSerializer
    lookup_field = 'key'
