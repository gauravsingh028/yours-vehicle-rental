from django.conf import settings
from django.db import models

from vehicles.models import Vehicle


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'vehicle'], name='one_review_per_user_vehicle')]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.vehicle} — {self.rating}/5'
