from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('vehicle__name', 'user__email', 'comment')
    readonly_fields = ('created_at',)
