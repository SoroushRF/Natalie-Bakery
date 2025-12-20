from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    UNIT_CHOICES = (
        ('ea', 'each'),
        ('kg', 'kg'),
        ('lb', 'lb'),
    )
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='ea')
    is_custom_cake = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    available_options = models.ManyToManyField('CakeOption', blank=True, related_name='products')
    square_id = models.CharField(max_length=100, null=True, blank=True, help_text="Square Catalog Object ID")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class CakeOption(models.Model):
    # This stores available choices for custom cakes
    OPTION_TYPES = (
        ('FLAVOR', 'Flavor'),
        ('FILLING', 'Filling'),
        ('SIZE', 'Size'),
    )
    option_type = models.CharField(max_length=20, choices=OPTION_TYPES)
    name = models.CharField(max_length=100)
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.option_type}: {self.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Ready', 'Ready'),
        ('Collected', 'Collected'),
    )
    customer_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    pickup_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    # Custom Cake options (stored as strings to preserve choice even if options change)
    flavor = models.CharField(max_length=100, null=True, blank=True)
    filling = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=100, null=True, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class SiteContent(models.Model):
    # Hero Section
    hero_title = models.CharField(max_length=200, default="The Art of Persian Pastry")
    hero_subtitle = models.TextField(default="Delicate saffron, cardamom, and rosewater masterpieces crafted for the most discerning palates.")
    hero_main_image = models.ImageField(upload_to='content/hero/', null=True, blank=True)
    hero_button_text = models.CharField(max_length=50, default="Explore the Collection")

    # Story Section
    about_title = models.CharField(max_length=200, default="Handcrafted with Generations of Tradition")
    about_description = models.TextField(default="Every item at Natalie Bakery is a labor of love...")
    about_side_image = models.ImageField(upload_to='content/about/', null=True, blank=True)
    about_side_image_2 = models.ImageField(upload_to='content/about/', null=True, blank=True)

    # Contact Info
    contact_tagline = models.CharField(max_length=255, default="Visit Our Boutique")
    maps_url_override = models.URLField(null=True, blank=True, help_text="Custom Google Maps embed URL")

    # Footer
    footer_tagline = models.CharField(max_length=255, default="Authentic Persian flavors meet modern culinary artistry.")
    instagram_handle = models.CharField(max_length=100, default="@nataliebakery.toronto")

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global Site Content"

    class Meta:
        verbose_name = "Global Site Content"
        verbose_name_plural = "Global Site Content"

class UIAsset(models.Model):
    key = models.SlugField(unique=True, help_text="Unique identifier for this asset (e.g., 'footer-logo')")
    image = models.ImageField(upload_to='content/ui/')
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.key

class SiteFeature(models.Model):
    site_content = models.ForeignKey(SiteContent, related_name='features', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class SiteGalleryImage(models.Model):
    site_content = models.ForeignKey(SiteContent, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='content/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    section = models.CharField(max_length=50, default='story', help_text="e.g. 'story', 'hero', 'footer'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
