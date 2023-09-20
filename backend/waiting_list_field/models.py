from django.db import models
from model_utils import FieldTracker

from waiting_list.models import WaitingList

FIELD_TYPE_CHOICES = [
    ("text", "Text field"),
    ("textarea", "Long text field"),
    ("integer", "Integer field"),
    ("select", "Dropdown field"),
    ("date", "Date field"),
    ("url", "URL field"),
    ("email", "Email field"),
    ("phone", "Phone field"),
    ("checkbox", "Checkbox field"),
    ("radio", "Radio button field"),
]

SECTION_CHOICES = [
    ("address", "Address"),
    ("contact", "Contact"),
    ("about", "About you"),
    ("motivation", "Motivation"),
    ("other", "Other"),
]


class WaitingListField(models.Model):
    name = models.CharField(max_length=255, verbose_name="Field name")
    section = models.CharField(choices=SECTION_CHOICES, default="other", verbose_name="Section")
    order = models.IntegerField(default=0, verbose_name="Order")
    type = models.CharField(choices=FIELD_TYPE_CHOICES, max_length=255, default="text", verbose_name="Field type")
    label = models.CharField(max_length=255, blank=True, null=True, verbose_name="Label")
    placeholder = models.CharField(max_length=255, blank=True, null=True, verbose_name="Placeholder")
    data = models.JSONField(blank=True, null=True, verbose_name="Data")
    is_required = models.BooleanField(default=False, verbose_name="Is required?")
    is_displayed = models.BooleanField(default=False, verbose_name="Is displayed?")
    waiting_list = models.ForeignKey(WaitingList, on_delete=models.CASCADE,
                                     related_name='fields')
    tracker = FieldTracker()

    def __str__(self):
        return f"Field '{self.name}' ({self.type}) on list '{self.waiting_list}'"

    class Meta:
        verbose_name = "waiting list field"
        verbose_name_plural = "waiting list fields"
