from django.db import models
from singleton_model import SingletonModel


class SiteConfiguration(SingletonModel):
    catch_all_emails_enabled = models.BooleanField(default=False,
                                                   verbose_name="Catch all emails and send to a shared address.")
    catch_all_email_address = models.EmailField(blank=False, null=False, verbose_name="Shared address to catch emails.")

    class Meta:
        verbose_name = 'Site Configuration'

    def __str__(self):
        return "fairQ Settings"
