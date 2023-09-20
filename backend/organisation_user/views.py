from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from membership.models import Membership
from membership.serializers import MembershipUserSerializer
from permissions.permissions import IsOrganisationUser
from .models import OrganisationUser
from .serializers import OrganisationUserSerializer


class UserRetrieveUpdateDeleteAPIView(APIView):
    """
    get:
    Get user details

    Retrieve details of the authenticated user.

    patch:
    Update user details

    Partially update the authenticated user's details.

    delete:
    Delete user

    Delete the authenticated user.
    """
    http_method_names = ['get', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve and serialize the details of the authenticated user
        organisation_user = get_object_or_404(OrganisationUser, user=request.user)
        serializer = OrganisationUserSerializer(organisation_user)
        return Response(serializer.data)

    def patch(self, request):
        # Update the authenticated user's details with the provided data
        organisation_user = get_object_or_404(OrganisationUser, user=request.user)
        serializer = OrganisationUserSerializer(organisation_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Delete the authenticated user
        organisation_user = get_object_or_404(OrganisationUser, user=request.user)
        organisation_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class UserRetrieveDeleteAPIView(APIView):
    """
    get:
    Get user details

    Retrieve details of a specific user.

    Parameters:
    - user_id: ID of the user to retrieve.

    delete:
    Delete user

    Delete a specific user.

    Parameters:
    - user_id: ID of the user to delete.
    """
    http_method_names = ['get', 'delete']

    def get(self, request, user_id):
        try:
            # Retrieve and serialize the details of the specified user
            user = OrganisationUser.objects.get(id=user_id)
            serializer = OrganisationUserSerializer(user)
            return Response(serializer.data)
        except OrganisationUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def put(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def delete(self, request, user_id):
        try:
            # Delete the specified user
            user = OrganisationUser.objects.get(id=user_id)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except OrganisationUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class UserListMemberships(ListAPIView):
    """
    get:
    List all organisations where the user is part of

    List all organisations where the user is part of
    """

    serializer_class = MembershipUserSerializer
    pagination_class = None
    queryset = Membership.objects.all()
    permission_classes = [IsAuthenticated, IsOrganisationUser]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(member__user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
