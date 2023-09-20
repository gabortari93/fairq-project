from rest_framework import permissions
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

from membership.models import Membership
from organisation.models import Organisation
from organisation_user.models import OrganisationUser
from waiting_list.models import WaitingList


# GENERAL PERMISSIONS
class IsOrganisationUser(permissions.BasePermission):
    message = "User must be an active organisation user."

    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is related to an OrganisationUser object
        if not request.user.organisation_user:
            return False

        # Check if user's status is active
        if not request.user.is_active:
            return False

        # If all checks pass, permission granted
        return True


# OBJECT PERMISSIONS FOR ORGANISATIONS

class IsOrganisationOwnerOrOrganisationReadOnly(permissions.BasePermission):
    message = "User must be a member of the organisation and have the owner role to access the organisation."

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        user_membership = obj.organisation_membership.filter(member__user=request.user).first()
        if user_membership and user_membership.role == 3:  # Assuming '3' represents the role of 'OWNER'
            return True

        return False


class IsOrganisationAdminOrOrganisationReadOnly(permissions.BasePermission):
    message = "User must be a member of the organisation and have at least an admin role to access the organisation."

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        user_membership = obj.organisation_membership.filter(member__user=request.user).first()
        if user_membership and user_membership.role in [2, 3]:  # Assuming '2' represents the role of 'ADMIN'
            return True

        return False


class IsOrganisationMember(permissions.BasePermission):
    message = "User must be a member of the organisation to access the organisation."

    def has_object_permission(self, request, view, obj):
        user_membership = obj.organisation_membership.filter(member__user=request.user).first()
        if user_membership:
            return True

        return False


# MEMBERSHIP PERMISSIONS
class IsMemberOfOrganisation(permissions.BasePermission):
    message = "User must be a member of the organisation to see the other memberships."

    def has_permission(self, request, view):
        org_id = view.kwargs.get('pk')
        return Membership.objects.filter(organisation_id=org_id, member__user=request.user).exists()


class IsAdminOfOrganisation(permissions.BasePermission):
    message = "User must be a admin of the organisation to manage memberships."

    def has_permission(self, request, view):
        org_id = view.kwargs.get('pk')
        user_membership = Membership.objects.filter(organisation_id=org_id, member__user=request.user).first()
        return user_membership is not None and user_membership.role in [2, 3]


class IsApplicationOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        applicant_user = obj.applicant.user

        if request.user == applicant_user:
            return True

        else:
            return False


class IsApplicantOrAdminUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.applicant.user == request.user or request.user.is_staff


class IsReconfirmationApplicantOrAdminUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.application.applicant.user == request.user or request.user.is_staff


class IsOrganisationAdminOrOwnerForCSV(BasePermission):
    message = "User must be an admin or owner of the organization to access this view."

    def has_permission(self, request, view):
        list_id = view.kwargs.get('list_id')
        waiting_list = get_object_or_404(WaitingList, id=list_id)

        # Get the user's membership for the organization from the Membership model
        user_membership = waiting_list.organisation.organisation_membership.filter(
            member__user=request.user,
            status__in=[2],
        ).first()

        if user_membership and user_membership.role in [2, 3]:  # Assuming '2' represents the role of 'Administrator'
            return True

        return False


class IsOrganisationAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow organisation admins or owners to create a new waiting list
    """

    def has_permission(self, request, view):
        try:
            organisation_id = request.data.get('organisation')
            organisation = Organisation.objects.get(id=organisation_id)

            org_user = OrganisationUser.objects.get(user=request.user)

            valid_roles = [2, 3]  # admins and owners

            membership = Membership.objects.filter(
                organisation=organisation,
                member=org_user,
                role__in=valid_roles,
                status=2  # joined
            )

            return membership.exists()

        except (Organisation.DoesNotExist, OrganisationUser.DoesNotExist, Membership.DoesNotExist):
            return False


class IsWaitinglistOrganisationMember(permissions.BasePermission):
    """
    Custom permission to only allow organisation users who are members of the
    organisation that manages the waiting list to access the endpoint
    """

    def has_permission(self, request, view):
        try:
            waiting_list_id = view.kwargs.get('list_id') or view.kwargs.get('pk')
            waiting_list = WaitingList.objects.get(id=waiting_list_id)
            organisation = waiting_list.organisation

            org_user = OrganisationUser.objects.get(user=request.user)

            if request.method in SAFE_METHODS:
                valid_roles = [1, 2, 3]  # viewers, admins, and owners
            else:
                valid_roles = [2, 3]  # admins and owners

            membership = Membership.objects.filter(
                organisation=organisation,
                member=org_user,
                role__in=valid_roles,
                status=2  # joined
            )

            return membership.exists()

        except (WaitingList.DoesNotExist, OrganisationUser.DoesNotExist, Membership.DoesNotExist):
            return False
