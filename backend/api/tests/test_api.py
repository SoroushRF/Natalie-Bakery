from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import Category, Product, CakeOption

class APIDataContractTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Pastries")
        self.product = Product.objects.create(
            category=self.category,
            name="Saffron Treat",
            price=15.00,
            unit="ea",
            is_custom_cake=False,
            description="Sweet treat"
        )
        self.option = CakeOption.objects.create(
            option_type='FLAVOR',
            name='Rose',
            price_modifier=2.50
        )
        self.product.available_options.add(self.option)

    def test_product_list_contract(self):
        """Verify the list API returns all fields required by the Gallery and Carousels"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check first item in list
        data = response.json()
        if isinstance(data, dict) and 'results' in data:
            product_data = data['results'][0]
        else:
            product_data = data[0]

        required_fields = [
            'id', 'name', 'slug', 'price', 'unit', 
            'image', 'is_custom_cake', 'category_name'
        ]
        for field in required_fields:
            self.assertIn(field, product_data, f"API Missing field: {field}")

    def test_product_detail_contract(self):
        """Verify the Detail API returns all fields required by ProductDetail page"""
        response = self.client.get(f'/api/products/{self.product.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        
        # Core fields
        required_fields = [
            'id', 'name', 'description', 'price', 
            'unit', 'is_custom_cake', 'available_options'
        ]
        for field in required_fields:
            self.assertIn(field, data, f"Detail API Missing: {field}")

        # Relationship fields (critical for Customization logic)
        options = data['available_options']
        self.assertTrue(len(options) > 0)
        option_fields = ['id', 'option_type', 'name', 'price_modifier']
        for field in option_fields:
            self.assertIn(field, options[0], f"Option Missing: {field}")
