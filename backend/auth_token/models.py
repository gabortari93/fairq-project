from django.db import models

from user.models import AuthUser


class AuthToken(models.Model):
    user = models.ForeignKey(to=AuthUser, related_name='tokens', on_delete=models.CASCADE,
                             verbose_name="Requester", blank=True, null=True)
    expiry_date = models.DateTimeField(blank=False, verbose_name="Expiry date")
    used_date = models.DateTimeField(blank=True, null=True, verbose_name="Used date")
    token = models.CharField(max_length=100, null=False, blank=False, verbose_name="Authentication token")
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token {self.token} for {self.user.email}"

    class Meta:
        verbose_name = "login token "
        verbose_name_plural = "login tokens"
