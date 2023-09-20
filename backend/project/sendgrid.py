from django_q.tasks import async_task
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sendgrid.helpers.mail import From

from site_config.models import SiteConfiguration


def send_email(user, event, template_data):
    template_ids = {
        "complete-profile-signup": "d-dd7fcf3e79054108a4d9a1ddb3e701dd",
        "complete-profile-invitation": "d-97ce2401e60c416ea838b92afc343c79",
        "invitation-existing-user": "d-8584c78b541847079a2c976d81766114",
        "reconfirmation-first-reminder": "d-54b821ddac3448ac94fb3febb27e9533",
        "reconfirmation-second-reminder": "d-ffebd8fda0a5428da2bc29cefe27d969",
        "reconfirmation-removed": "d-1be62022670d45c0bef322d73e55cba3",
        "magic_link_applicant": "d-2bb61747851245059911d1449f1bbd6a",
        "magic_link_org_user": "d-c5723dd7d9b5468f907de609be4b0f7d",
        "identity_verification_admin": "d-29ee1a88096346efb1cc1e30b8e6f05f",
        "status_changed_to_waiting": "d-26ea7ec1f183464d95fd277b967744ab",
        "identity_verification_expire": "d-fdf0f541459e4d08bb90b1aae4c8fb39",
        "application_created": "d-0f530db9cd73497e9e8e707a3aa45e51",
    }

    template_id = template_ids.get(event)

    if template_id is None:
        return False

    site_config = SiteConfiguration.objects.first()

    if site_config.catch_all_emails_enabled:
        message = Mail(
            from_email=From(os.environ.get('EMAIL_FROM_ADDRESS'), os.environ.get('EMAIL_FROM_NAME')),
            to_emails=site_config.catch_all_email_address,
        )
    else:
        message = Mail(
            from_email=From(os.environ.get('EMAIL_FROM_ADDRESS'), os.environ.get('EMAIL_FROM_NAME')),
            to_emails=user.email,
        )

    message.dynamic_template_data = template_data
    message.template_id = template_id

    async_task(send_email_task, message, task_name=f"{event} to {user.email}", group="Email queuing")

    return True


def send_email_task(message):
    try:
        sendgrid_client = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sendgrid_client.send(message)
        return response.status_code, response.body

    except Exception as e:
        print(f"SendGrid API Error: {str(e)}")
