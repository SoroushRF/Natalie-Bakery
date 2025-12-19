from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, CakeOptionViewSet, OrderViewSet, SiteContentView, UIAssetViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cake-options', CakeOptionViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'ui-assets', UIAssetViewSet)

urlpatterns = [
    path('site-content/', SiteContentView.as_view(), name='site-content'),
    path('', include(router.urls)),
]
