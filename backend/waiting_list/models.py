from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from model_utils import FieldTracker

from organisation.models import Organisation

RECONFIRMATION_CYCLE_CHOICES = [  # months
    (0, "Never"),
    (1, "Every month"),
    (2, "Every 2 months"),
    (3, "Every 3 months"),
    (6, "Every 6 months"),
    (9, "Every 9 months"),
    (12, "Every 12 months"),
    (24, "Every 2 years"),
    (36, "Every 3 years"),
]

RECONFIRMATION_REMINDER_CHOICES = [  # days
    (0, "Do not remind"),
    (1, "One day"),
    (2, "Two days"),
    (7, "One week"),
    (14, "Two weeks"),
    (30, "One month"),
    (60, "Two months"),
    (90, "Three months"),
]

PRIORITIZATION_CHOICES = [
    ("oldest_first", "Oldest first"),
    ("random", "Random"),
]


class WaitingList(models.Model):
    name = models.CharField(max_length=255, verbose_name="Name")
    slug = models.CharField(max_length=255,
                            verbose_name="Slug",
                            unique=True,
                            error_messages={
                                'unique': "This slug is already taken.",
                            },
                            )
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    usual_waiting_time = models.CharField(max_length=255, blank=True,
                                          verbose_name="Usual waiting time")
    organisation = models.ForeignKey(to=Organisation, on_delete=models.CASCADE,
                                     verbose_name="Organisation", related_name='waiting_lists')
    reconfirmation_cycle = models.IntegerField(choices=RECONFIRMATION_CYCLE_CHOICES, default=0,
                                               verbose_name="Reconfirmation Cycle")
    reconfirmation_first_reminder = models.IntegerField(choices=RECONFIRMATION_REMINDER_CHOICES, default=0,
                                                        verbose_name="Reconfirmation First Reminder")
    reconfirmation_second_reminder = models.IntegerField(choices=RECONFIRMATION_REMINDER_CHOICES, default=0,
                                                         verbose_name="Reconfirmation Second Reminder")
    reconfirmation_message = models.TextField(blank=True, verbose_name="Reconfirmation Message")
    reconfirmation_remove = models.BooleanField(default=False, verbose_name="Reconfirmation Status")
    identity_verification_required = models.BooleanField(default=False, verbose_name="Require Identity Verification")
    num_selectable = models.IntegerField(default=1,
                                         validators=[MaxValueValidator(10), MinValueValidator(1)],
                                         verbose_name="Number of Selectable applicants")
    prioritization_sorting = models.CharField(choices=PRIORITIZATION_CHOICES, max_length=255, default="oldest_first")
    see_absolute_position = models.BooleanField(default=False, verbose_name="Show absolute position?")
    see_relative_position = models.BooleanField(default=False, verbose_name="Show relative position?")
    see_calculated_waiting_time = models.BooleanField(default=False,
                                                      verbose_name="Show calculated waiting time?")
    notify_applicant_monthly = models.BooleanField(default=False,
                                                   verbose_name="Send notifications about the applicants monthly?")
    notify_org_weekly = models.BooleanField(default=False,
                                            verbose_name="Send weekly organisation notification?")
    notify_org_no_reconfirm = models.BooleanField(default=False,
                                                  verbose_name="Send monthly organisation notification?")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    tracker = FieldTracker()

    def __str__(self):
        return f"{self.name} ({self.id})"

    class Meta:
        verbose_name = "waiting list"
        verbose_name_plural = "waiting lists"
