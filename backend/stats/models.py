from django.db import models

from waiting_list.models import WaitingList


class DailyStatsPerWaitingList(models.Model):
    waiting_list = models.ForeignKey(
        WaitingList,
        on_delete=models.CASCADE,
        related_name="stats",
        verbose_name="Waiting List"
    )
    total_applicants = models.IntegerField(verbose_name="Total Applicants")
    total_waiting = models.IntegerField(verbose_name="Total Waiting")
    total_selected = models.IntegerField(verbose_name="Total Selected")
    total_removed = models.IntegerField(verbose_name="Total Removed")
    total_pending = models.IntegerField(verbose_name="Total Pending")
    new_applicants = models.IntegerField(null=True, verbose_name="New Applicants")
    new_selected = models.IntegerField(null=True, verbose_name="Newly Selected Applicants")
    average_current_waiting_time = \
        models.IntegerField(null=True, verbose_name="Average waiting time of currently waiting applicants")
    average_waiting_time_of_selected_applicants = \
        models.IntegerField(null=True, verbose_name="Average waiting time of already selected applicants")
    # Add fields for age and gender statistics
    age_0_18 = models.IntegerField(null=True, blank=True, verbose_name="Age 0-18")
    age_19_25 = models.IntegerField(null=True, blank=True, verbose_name="Age 19-25")
    age_26_35 = models.IntegerField(null=True, blank=True, verbose_name="Age 26-35")
    age_36_50 = models.IntegerField(null=True, blank=True, verbose_name="Age 36-50")
    age_51_65 = models.IntegerField(null=True, blank=True, verbose_name="Age 51-65")
    age_65_plus = models.IntegerField(null=True, blank=True, verbose_name="Age 65+")
    male_count = models.IntegerField(null=True, blank=True, verbose_name="Male Count")
    female_count = models.IntegerField(null=True, blank=True, verbose_name="Female Count")
    other_count = models.IntegerField(null=True, blank=True, verbose_name="Other Count")
    date = models.DateTimeField(auto_now_add=False, verbose_name="Date")
    date_created = models.DateTimeField(auto_now_add=True, verbose_name="Date created")

    class Meta:
        verbose_name = "Statistic"
        verbose_name_plural = "Statistics"
