from django.db import models

from application.models import Application
from user.models import AuthUser
from waiting_list.models import WaitingList

ACTIVITY_CHOICES = [
    ("edit", "edited"),
    ("apply", "applied"),
    ("team_join", "joined"),
    ("team_invite", "invited"),
    ("team_remove", "removed"),
    ("change_status", "changed the status"),
    ("do_something", "did something"),
    ("recalculate_positions", "recalculated positions"),
    ("verify", "verified the identity"),
    ("reconfirmed", "reconfirmed their interest"),
    ("edit_list", "edited waiting list"),
]


class Activity(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="Created date")
    waiting_list = models.ForeignKey(to=WaitingList, on_delete=models.CASCADE, verbose_name="Waiting list",
                                     related_name='activities')
    application = models.ForeignKey(to=Application, blank=True, null=True, on_delete=models.CASCADE,
                                    verbose_name="Application", related_name='activities')
    user = models.ForeignKey(to=AuthUser, on_delete=models.CASCADE, verbose_name="User",
                             related_name='activities')
    activity = models.CharField(max_length=255, choices=ACTIVITY_CHOICES, verbose_name="Activity",
                                default="do_something")
    note = models.TextField(blank=True, verbose_name="Note")

    class Meta:
        verbose_name = "activity"
        verbose_name_plural = "activities"
