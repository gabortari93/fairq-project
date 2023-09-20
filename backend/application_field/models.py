from django.db import models

from application.models import Application
from waiting_list_field.models import WaitingListField
from model_utils import FieldTracker


class ApplicationField(models.Model):
    waiting_list_field = models.ForeignKey(to=WaitingListField, on_delete=models.CASCADE,
                                           verbose_name="Waiting list field",
                                           related_name='waiting_list_field')
    application = models.ForeignKey(to=Application, on_delete=models.CASCADE, verbose_name="Application",
                                    related_name='application_fields')
    value = models.TextField(verbose_name="Application field value", blank=True, null=True)
    tracker = FieldTracker()

    def __str__(self):
        return f"Field '{self.waiting_list_field.name}' on application #{self.application.id} " \
               f"by {self.application.applicant.user} for {self.waiting_list_field.waiting_list.name}"

    class Meta:
        verbose_name = "application field"
        verbose_name_plural = "application fields"
