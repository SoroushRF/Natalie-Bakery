from django.contrib import admin
from .models import Category, Product, CakeOption, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_custom_cake')
    list_filter = ('category', 'is_custom_cake')
    prepopulated_fields = {'slug': ('name',)}

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
