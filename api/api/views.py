from rest_framework import permissions, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.pagination import DefaultPaginator


class JWTAuthViewset(viewsets.ModelViewSet):
    lookup_field = "public_id"  # look up by public_id instead of id or pk
    authentication_classes = (JWTAuthentication,)
    pagination_class = DefaultPaginator
    permission_classes = (permissions.IsAuthenticated,)
