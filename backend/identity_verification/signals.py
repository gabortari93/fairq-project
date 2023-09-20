import os

from django.db.models.signals import post_save
from django.dispatch import receiver

from identity_verification.models import IdentityVerification
from django.utils.timezone import now as timezone_now

from project.sendgrid import send_email


@receiver(post_save, sender=IdentityVerification)
def send_email_on_verification_status_change(sender, instance, **kwargs):
    if kwargs.get('created', False):
        return

    if instance.is_valid and instance.status == "pending" and not instance.verification_date:
        instance.verification_date = timezone_now()
        instance.status = "verified"
        instance.save()

        # Get all waiting lists that require identity verification
        waiting_list_applications = instance.applicant.applications.filter(
            waiting_list__identity_verification_required=True)

        # If there are any such applications, update their status to 'waiting'
        if instance.applicant.user.is_active and waiting_list_applications.exists():
            for application in waiting_list_applications:
                application.status = 'waiting'
                application.save()

                dashboard_link = f"{os.environ.get('FRONTEND_BASE_URL')}/list/{application.waiting_list.slug}/dashboard/"

                # Prepare the data for the email
                template_data = {
                    "first_name": application.applicant.user.first_name,
                    "waiting_list_name": application.waiting_list.name,
                    "link": dashboard_link
                }

                # Send the email
                send_email(
                    user=instance.applicant.user,
                    event="status_changed_to_waiting",
                    template_data=template_data
                )
