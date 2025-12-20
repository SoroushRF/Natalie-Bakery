from django.test import TestCase
from django.utils.text import slugify
from api.models import Category, Product, SiteContent, CakeOption

class CategoryModelTest(TestCase):
    def test_slug_generation(self):
        category = Category.objects.create(name="Custom Cakes")
        self.assertEqual(category.slug, slugify("Custom Cakes"))

class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Cakes")

    def test_slug_generation(self):
        product = Product.objects.create(
            category=self.category,
            name="Saffron Rose Cake",
            price=45.00
        )
        self.assertEqual(product.slug, slugify("Saffron Rose Cake"))

    def test_default_unit(self):
        product = Product.objects.create(
            category=self.category,
            name="Cookie",
            price=2.00
        )
        self.assertEqual(product.unit, 'ea')

class SiteContentModelTest(TestCase):
    def test_singleton_behavior(self):
        # Create first instance
        content1 = SiteContent(hero_title="Title 1")
        content1.save()
        # Create second instance
        content2 = SiteContent(hero_title="Title 2")
        content2.save()
        
        # There should only be one record in the DB
        self.assertEqual(SiteContent.objects.count(), 1)
        # The record should reflect the most recent save
        self.assertEqual(SiteContent.objects.first().hero_title, "Title 2")
        self.assertEqual(content1.pk, content2.pk)

class CakeOptionModelTest(TestCase):
    def test_str_representation(self):
        option = CakeOption.objects.create(
            option_type='FLAVOR',
            name='Pistachio',
            price_modifier=5.00
        )
        self.assertEqual(str(option), "FLAVOR: Pistachio")

    def test_product_options_relationship(self):
        category = Category.objects.create(name="Cakes")
        product = Product.objects.create(
            category=category,
            name="Custom Wedding Cake",
            price=100.00,
            is_custom_cake=True
        )
        flavor = CakeOption.objects.create(option_type='FLAVOR', name='Vanilla')
        size = CakeOption.objects.create(option_type='SIZE', name='Large')
        
        product.available_options.add(flavor, size)
        
        self.assertEqual(product.available_options.count(), 2)
        self.assertIn(flavor, product.available_options.all())
        self.assertIn(size, product.available_options.all())
