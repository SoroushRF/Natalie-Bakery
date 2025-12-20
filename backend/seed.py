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
    Product.objects.update_or_create(
        name='Saffron & Rosewater Baklava',
        defaults={
            'category': pastries,
            'price': 24.03,
            'unit': 'kg',
            'description': 'Luxurious layers of phyllo with premium pistachios and saffron syrup.',
            'is_custom_cake': False,
            'is_featured': True
        }
    )

    Product.objects.update_or_create(
        name='Signature Custom Celebration Cake',
        defaults={
            'category': cakes,
            'price': 85.00,
            'unit': 'ea',
            'description': 'A masterpiece tailored to your celebration. Select your flavor and filling.',
            'is_custom_cake': True,
            'is_featured': True
        }
    )

    Product.objects.update_or_create(
        name='Barbari Bread',
        defaults={
            'category': bread,
            'price': 4.50,
            'unit': 'ea',
            'description': 'Traditional Persian flatbread, topped with sesame seeds.',
        }
    )

    Product.objects.update_or_create(
        name='Assorted Persian Cookies',
        defaults={
            'category': pastries,
            'price': 18.00,
            'unit': 'lb',
            'description': 'A delicate selection of traditional chickpea, rice, and walnut cookies.',
        }
    )

    # Cake Options
    options = [
        ('FLAVOR', 'Cardamom & Rose'),
        ('FLAVOR', 'Saffron Vanilla'),
        ('FLAVOR', 'Pistachio Dream'),
        ('FILLING', 'Apricot Jam'),
        ('FILLING', 'Honey Buttercream'),
        ('FILLING', 'Pomegranate Reduction'),
        ('SIZE', 'Regular'),
        ('SIZE', '6" Small (Serves 8-10)'),
        ('SIZE', '10" Large (Serves 25-30)'),
    ]

    # Cleanup: Remove Medium if it exists
    CakeOption.objects.filter(option_type='SIZE', name='8" Medium (Serves 15-20)').delete()

    created_options = []
    regular_opt = None
    for opt_type, name in options:
        opt, _ = CakeOption.objects.get_or_create(option_type=opt_type, name=name)
        created_options.append(opt)
        if name == 'Regular':
            regular_opt = opt

    # Link options to products
    all_products = Product.objects.all()
    sig_cake = Product.objects.filter(name='Signature Custom Celebration Cake').first()
    
    for product in all_products:
        if product == sig_cake:
            product.available_options.set(created_options)
        else:
            # All other items get 'Regular' size by default
            if regular_opt:
                product.available_options.add(regular_opt)

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
