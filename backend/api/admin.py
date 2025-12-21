from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Category, Product, CakeOption, Order, OrderItem, SiteContent, UIAsset, SiteFeature, SiteGalleryImage

admin.site.site_header = "Natalie Bakery Administration"
admin.site.site_title = "Natalie Bakery Admin Portal"
admin.site.index_title = "Welcome to the Natalie Bakery Management Console"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'name', 'category', 'price', 'is_custom_cake', 'is_featured')
    list_display_links = ('image_preview', 'name')
    list_filter = ('category', 'is_custom_cake', 'is_featured')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'square_id')
    filter_horizontal = ('available_options',)
    readonly_fields = ('created_at', 'image_preview_large')
    
    fieldsets = (
        (None, {
            'fields': ('category', 'name', 'slug', 'description', 'price', 'unit', 'image', 'image_preview_large', 'square_id', 'created_at')
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

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
        return "No Image"
    image_preview.short_description = 'Preview'

    def image_preview_large(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="200" style="border-radius: 8px;" />')
        return "No Image Preview available"
    image_preview_large.short_description = 'Image Preview'

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
