from rest_framework import permissions, viewsets

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related('user', 'vehicle').all()
    serializer_class = ReviewSerializer
    filterset_fields = ['vehicle', 'rating']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        return [permissions.IsAuthenticated()] if self.request.method != 'GET' else [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
