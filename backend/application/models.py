from django.db import models
from model_utils import FieldTracker

from applicant.models import Applicant
from waiting_list.models import WaitingList

STATUS_CHOICES = [
    ("created", "created"),
    ("waiting", "waiting"),
    ("selected", "selected"),
    ("removed", "removed"),
]


class Application(models.Model):
    waiting_list = models.ForeignKey(to=WaitingList, on_delete=models.CASCADE,
                                     verbose_name="Waiting list",
                                     related_name='applications')
    applicant = models.ForeignKey(to=Applicant, on_delete=models.CASCADE, verbose_name="Applicant",
                                  related_name='applications')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="created", verbose_name="Applicant status")
    position = models.PositiveIntegerField(null=True, blank=True, verbose_name="Waiting position")
    waiting_since_date = models.DateTimeField(null=True, verbose_name="Waiting since date")
    selected_date = models.DateTimeField(null=True, verbose_name="Selected date")
    created_date = models.DateTimeField(auto_now_add=True,
                                        verbose_name="Created date")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="Updated date")
    estimated_selection_date = models.DateTimeField(null=True, verbose_name="Estimated projected selection date")
    tracker = FieldTracker()

    def __str__(self):
        return f"Application #{self.id} by {self.applicant.user} for {self.waiting_list.name}"

    class Meta:
        verbose_name = "application"
        verbose_name_plural = "applications"
