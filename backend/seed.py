import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Product, CakeOption

def seed():
    # Categories
    pastries, _ = Category.objects.get_or_create(name='Pastries')
    cakes, _ = Category.objects.get_or_create(name='Cakes')
    bread, _ = Category.objects.get_or_create(name='Bread')

    # Products
    Product.objects.get_or_create(
        name='Saffron & Rosewater Baklava',
        category=pastries,
        price=24.00,
        description='Luxurious layers of phyllo with premium pistachios and saffron syrup.',
        is_custom_cake=False
    )

    Product.objects.get_or_create(
        name='Signature Custom Celebration Cake',
        category=cakes,
        price=85.00,
        description='A masterpiece tailored to your celebration. Select your flavor and filling.',
        is_custom_cake=True
    )

    # Cake Options
    options = [
        ('FLAVOR', 'Cardamom & Rose'),
        ('FLAVOR', 'Saffron Vanilla'),
        ('FLAVOR', 'Pistachio Dream'),
        ('FILLING', 'Apricot Jam'),
        ('FILLING', 'Honey Buttercream'),
        ('FILLING', 'Pomegranate Reduction'),
        ('SIZE', '6" Small (Serves 8-10)'),
        ('SIZE', '8" Medium (Serves 15-20)'),
        ('SIZE', '10" Large (Serves 25-30)'),
    ]

    for opt_type, name in options:
        CakeOption.objects.get_or_create(option_type=opt_type, name=name)

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
