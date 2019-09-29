from rest_framework.permissions import IsAdminUser


class UpdateAndIsAdmin(IsAdminUser):
    allowed_actions = 'update', 'partial_update', 'destroy', 'resolve'

    def has_permission(self, request, view):
        if view.action in self.allowed_actions:
            return super().has_permission(request, view)

        return True
