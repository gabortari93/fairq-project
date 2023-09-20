import os
from datetime import timedelta
from django.utils import timezone
import logging

from identity_verification.models import IdentityVerification
from project.sendgrid import send_email

logger = logging.getLogger(__name__)


def check_document_expiry():
    now = timezone.now()
    upcoming_expiry_docs = IdentityVerification.objects.filter(
        expiry_date__lte=now + timedelta(days=30),
        status__in=['valid', 'verified']
    )

    for verification in upcoming_expiry_docs:
        user_page_link = f"{os.environ.get('FRONTEND_BASE_URL')}/dashboard/"

        template_data = {
            "first_name": verification.applicant.user.first_name,
            "link": user_page_link,
            "expiry_date": verification.expiry_date  # Include the expiry date in the email
        }

        send_email(
            user=verification.applicant.user,
            event="identity_verification_expire",  # adjust the event name if necessary
            template_data=template_data
        )

        verification.notification_sent = True
        verification.save()
