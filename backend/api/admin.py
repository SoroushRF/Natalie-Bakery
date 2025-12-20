from django.contrib import admin
from .models import Category, Product, CakeOption, Order, OrderItem, SiteContent, UIAsset, SiteFeature, SiteGalleryImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_custom_cake', 'is_featured', 'created_at')
    list_filter = ('category', 'is_custom_cake', 'is_featured')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'square_id')
    filter_horizontal = ('available_options',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('category', 'name', 'slug', 'description', 'price', 'unit', 'image', 'square_id', 'created_at')
        }),
        ('Customization', {
            'fields': ('is_custom_cake', 'available_options'),
            'description': 'If "is custom cake" is checked, selected options will appear on the product page.'
        }),
        ('Promotion', {
            'fields': ('is_featured',),
            'description': 'Featured products appear in the "Featured Collection" on the homepage.'
        }),
    )

@admin.register(CakeOption)
class CakeOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'option_type', 'price_modifier')
    list_filter = ('option_type',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'pickup_datetime', 'status', 'total_price')
    list_filter = ('status', 'pickup_datetime')
    inlines = [OrderItemInline]

class SiteFeatureInline(admin.TabularInline):
    model = SiteFeature
    extra = 1

class SiteGalleryImageInline(admin.TabularInline):
    model = SiteGalleryImage
    extra = 1

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    inlines = [SiteFeatureInline, SiteGalleryImageInline]
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_title', 'hero_subtitle', 'hero_main_image', 'hero_button_text')
        }),
        ('Story (Handcrafted) Section', {
            'fields': ('about_title', 'about_description', 'about_side_image', 'about_side_image_2')
        }),
        ('Contact & Branding', {
            'fields': ('contact_tagline', 'maps_url_override', 'footer_tagline', 'instagram_handle')
        }),
    )

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(UIAsset)
class UIAssetAdmin(admin.ModelAdmin):
    list_display = ('key', 'description')
    search_fields = ('key', 'description')
