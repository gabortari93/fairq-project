from django.db import models

from language.models import Language
from user.models import AuthUser


class OrganisationUser(models.Model):
    user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name="organisation_user")
    language = models.ForeignKey(to=Language, on_delete=models.DO_NOTHING, null=True, blank=True,
                                 verbose_name="User language")

    def __str__(self):
        return f"User {self.user.email} - ID: {self.id}"

    class Meta:
        verbose_name = "organisation user"
        verbose_name_plural = "organisation users"
