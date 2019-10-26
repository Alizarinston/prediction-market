from rest_framework.permissions import IsAdminUser


class UpdateAndIsAdmin(IsAdminUser):
    def has_permission(self, request, view):
        if request.method in ('PUT', 'PATCH', 'DELETE'):
            return super().has_permission(request, view)

        return True
