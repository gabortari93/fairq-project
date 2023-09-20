from django.db import models
from rest_framework.exceptions import ValidationError

from application.models import Application
from waiting_list.models import WaitingList


class Reconfirmation(models.Model):
    deadline = models.DateTimeField(null=True,
                                    verbose_name="Reconfirmation deadline")
    first_reminder = models.DateTimeField(null=True,
                                          verbose_name="Reconfirmation first reminder date")
    second_reminder = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Reconfirmation second reminder date")
    reconfirmation_date = models.DateTimeField(
        verbose_name="Reconfirmation date", null=True, blank=True)
    application = models.ForeignKey(to=Application, related_name="reconfirmations", verbose_name="Application",
                                    on_delete=models.CASCADE)
    waiting_list = models.ForeignKey(to=WaitingList, related_name="reconfirmations", verbose_name="Waiting list",
                                     on_delete=models.CASCADE)
    first_reminder_sent = models.DateTimeField(null=True, blank=True, verbose_name="First reminder sent")
    second_reminder_sent = models.DateTimeField(null=True, blank=True, verbose_name="Second reminder sent")
    removed_sent = models.DateTimeField(null=True, blank=True, verbose_name="Removed email sent")

    def save(self, *args, **kwargs):
        if self.first_reminder > self.deadline:
            raise ValidationError("First reminder date cannot be later than the deadline date.")
        if self.second_reminder > self.deadline:
            raise ValidationError("Second reminder date cannot be later than the deadline date.")
        if self.first_reminder >= self.second_reminder:
            raise ValidationError("First reminder cannot be t the same time or later than second reminder.")
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "interest reconfirmation"
        verbose_name_plural = "interest reconfirmations"
