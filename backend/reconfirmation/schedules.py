from datetime import timedelta

from django.utils import timezone

from application.models import Application
from project.sendgrid import send_email
from reconfirmation.models import Reconfirmation
from waiting_list.models import RECONFIRMATION_CYCLE_CHOICES, RECONFIRMATION_REMINDER_CHOICES


def create_reconfirmations():
    applications = Application.objects.all()

    summary = {
        "num_created": 0,
        "num_not_due": 0,
        "num_inactive": 0,
        "num_removed": 0,
        "num_no_reconfirmation": 0,
        "total": applications.count(),
    }

    for application in applications:
        waiting_list = application.waiting_list
        reconfirmation_cycle = waiting_list.reconfirmation_cycle
        reconfirmation_first_reminder = waiting_list.reconfirmation_first_reminder
        reconfirmation_second_reminder = waiting_list.reconfirmation_second_reminder

        if application.status in ("removed",):
            summary['num_inactive'] += 1
            continue  # No longer create reconfirmations for removed applications

        if reconfirmation_cycle == 0:
            summary['num_no_reconfirmation'] += 1
            continue  # Skip creating reconfirmation for this application, as there is none

        last_reconfirmation = application.reconfirmations.last()

        if last_reconfirmation and last_reconfirmation.deadline > timezone.now():
            summary['num_not_due'] += 1
            continue  # Deadline is not yet over; do not create a new reconfirmation yet

        if last_reconfirmation and last_reconfirmation.reconfirmation_date is None and waiting_list.reconfirmation_remove:
            application.status = "removed"
            application.save()
            summary['num_removed'] += 1
            continue  # Set applications to "removed" if reconfirmation was not done within deadline (if applicable)

        cycle_timedelta = get_cycle_timedelta_from_choice(reconfirmation_cycle, RECONFIRMATION_CYCLE_CHOICES)

        first_reminder_timedelta = get_reminder_timedelta_from_choice(reconfirmation_first_reminder,
                                                                      RECONFIRMATION_REMINDER_CHOICES)
        second_reminder_timedelta = get_reminder_timedelta_from_choice(reconfirmation_second_reminder,
                                                                       RECONFIRMATION_REMINDER_CHOICES)

        if not last_reconfirmation:
            deadline = waiting_list.created_date + cycle_timedelta

        else:
            deadline = last_reconfirmation.deadline + cycle_timedelta

        # if the first, second reminder and deadline none -> then the view not create a reconfirmation object
        if first_reminder_timedelta is not None:
            first_reminder = deadline - first_reminder_timedelta
        else:
            first_reminder = None

        if second_reminder_timedelta is not None:
            second_reminder = deadline - second_reminder_timedelta
        else:
            second_reminder = None

        Reconfirmation.objects.create(
            deadline=deadline,
            first_reminder=first_reminder,
            second_reminder=second_reminder,
            application=application,
            waiting_list=waiting_list
        )

        summary['num_created'] += 1

    return summary


def get_cycle_timedelta_from_choice(value, choices):
    for choice_value, _ in choices:
        if choice_value == value:
            if choice_value == 0:
                return None  # No reminder or cycle, so return None
            return timedelta(days=choice_value * 30)  # Assuming 1 month = 30 days TODO: Calculate exact date
    return None


def get_reminder_timedelta_from_choice(value, choices):
    for choice_value, _ in choices:
        if choice_value == value:
            if choice_value == 0:
                return None  # No reminder, so return None
            return timedelta(days=choice_value)
    return None


def send_first_reminder_email():
    now = timezone.now()
    reconfirmations = Reconfirmation.objects.all()

    for reconfirmation in reconfirmations:
        if now >= reconfirmation.first_reminder and not reconfirmation.first_reminder_sent:
            template_data = {
                'name': reconfirmation.application.applicant.user.first_name,
                'waiting_list_name': reconfirmation.waiting_list.name,
            }
            send_email(user=reconfirmation.application.applicant.user, event="reconfirmation-first-reminder",
                       template_data=template_data)
            # TODO: Only update the reconfirmation after the queued task was successfully executed (hook function)
            reconfirmation.first_reminder_sent = now
            reconfirmation.save()


def send_second_reminder_email():
    now = timezone.now()
    reconfirmations = Reconfirmation.objects.all()

    for reconfirmation in reconfirmations:
        if now >= reconfirmation.second_reminder and not reconfirmation.second_reminder_sent:
            template_data = {
                'name': reconfirmation.application.applicant.user.first_name,
                'waiting_list_name': reconfirmation.waiting_list.name,
            }
            send_email(user=reconfirmation.application.applicant.user, event="reconfirmation-second-reminder",
                       template_data=template_data)
            # TODO: Only update the reconfirmation after the queued task was successfully executed (hook function)
            reconfirmation.second_reminder_sent = now  # Set the second_reminder_sent date
            reconfirmation.save()


def send_removed_email():
    now = timezone.now()
    reconfirmations = Reconfirmation.objects.all()
    # Removed email
    for reconfirmation in reconfirmations:
        if reconfirmation.application.status == "removed" and not reconfirmation.removed_sent:
            template_data = {
                'name': reconfirmation.application.applicant.user.first_name,
                'waiting_list_name': reconfirmation.waiting_list.name,
            }
            send_email(user=reconfirmation.application.applicant.user, event="reconfirmation-removed",
                       template_data=template_data)
            # TODO: Only update the reconfirmation after the queued task was successfully executed (hook function)
            reconfirmation.removed_sent = now  # Set the removed_sent date
            reconfirmation.save()
