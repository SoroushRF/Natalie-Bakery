from rest_framework import serializers
from .models import Category, Product, CakeOption, Order, OrderItem, SiteContent, UIAsset, SiteFeature, SiteGalleryImage
from django.utils import timezone
from datetime import timedelta

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CakeOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CakeOption
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    available_options = CakeOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity', 'flavor', 'filling', 'size', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'customer_name', 'email', 'phone', 'total_price', 'pickup_datetime', 'status', 'items')

    def validate(self, data):
        pickup_datetime = data.get('pickup_datetime')
        items_data = data.get('items')

        # Check for custom cakes
        has_custom_cake = False
        for item in items_data:
            product = item['product']
            if product.is_custom_cake:
                has_custom_cake = True
                break

        if has_custom_cake:
            min_lead_time = timezone.now() + timedelta(days=3)
            if pickup_datetime < min_lead_time:
                raise serializers.ValidationError({
                    "pickup_datetime": "Custom Cakes require a minimum 3-day lead time from the current date."
                })
        
        # General lead time (e.g., minimum 1 hour for regular items - optional, but good practice)
        if pickup_datetime < timezone.now():
            raise serializers.ValidationError({
                "pickup_datetime": "Pickup time cannot be in the past."
            })

        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class SiteFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteFeature
        fields = '__all__'

class SiteGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteGalleryImage
        fields = '__all__'

class SiteContentSerializer(serializers.ModelSerializer):
    features = SiteFeatureSerializer(many=True, read_only=True)
    gallery_images = SiteGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = SiteContent
        fields = '__all__'

class UIAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UIAsset
        fields = '__all__'
