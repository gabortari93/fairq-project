from django.db import models

from organisation.models import Organisation
from organisation_user.models import OrganisationUser

STATUS_CHOICES = [
    (1, "Invited"),
    (2, "Joined"),
    (3, "Removed"),
]

ROLE_CHOICES = [
    (1, "Viewer"),
    (2, "Administrator"),
    (3, "Owner"),
]


class Membership(models.Model):
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Status")
    role = models.IntegerField(choices=ROLE_CHOICES, default=1, verbose_name="Role")
    organisation = models.ForeignKey(to=Organisation, on_delete=models.CASCADE,
                                     related_name='organisation_membership', verbose_name="Org Membership")
    member = models.ForeignKey(to=OrganisationUser, on_delete=models.CASCADE, related_name='user_membership',
                               verbose_name="User")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Membership {self.id} - User: {self.member.user.email}, Organisation: {self.organisation.name}"

    class Meta:
        verbose_name = "organisation membership"
        verbose_name_plural = "organisation memberships"
