from django.db import models

from user.models import AuthUser


class Applicant(models.Model):
    user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name="applicant")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def set_password(self, raw_password):
        # Do nothing. Prevents setting password for applicant.
        pass

    def check_password(self, raw_password):
        # Always return False. Prevents authenticating by password.
        return False

    class Meta:
        verbose_name = "applicant"
        verbose_name_plural = "applicants"
