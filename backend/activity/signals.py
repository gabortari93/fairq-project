from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from application.models import Application
from application_field.models import ApplicationField
from identity_verification.models import IdentityVerification
from activity.models import Activity
from reconfirmation.models import Reconfirmation
from waiting_list.models import WaitingList
import logging

from waiting_list_field.models import WaitingListField


@receiver(post_save, sender=Application)
def log_application_status_activity(sender, instance, created, **kwargs):
    if not created:
        if 'status' in instance.tracker.changed():
            Activity.objects.create(
                user=instance.applicant.user,
                waiting_list=instance.waiting_list,
                application=instance,
                activity='edit',
                note=f"changed the status to '{instance.status}'"
            )


# For logging when new Applications are created or removed:
@receiver(post_save, sender=Application)
def log_application_creation(sender, instance, created, **kwargs):
    if created:  # i.e., if the Application was just created
        Activity.objects.create(
            user=instance.applicant.user,
            waiting_list=instance.waiting_list,
            application=instance,
            activity='apply',
            note="applied to"
        )


@receiver(pre_delete, sender=Application)
def log_application_removal(sender, instance, **kwargs):
    Activity.objects.create(
        user=instance.applicant.user,
        waiting_list=instance.waiting_list,
        application=instance,
        activity='remove',
        note="removed"
    )


# For logging when an Application's status changes to 'selected':
@receiver(post_save, sender=Application)
def log_application_selection(sender, instance, created, **kwargs):
    if not created and instance.status == 'selected':
        Activity.objects.create(
            user=instance.applicant.user,
            waiting_list=instance.waiting_list,
            application=instance,
            activity='select',
            note="selected"
        )


@receiver(post_save, sender=ApplicationField)
def log_application_field_change(sender, instance, created, **kwargs):
    if not created:
        if 'value' in instance.tracker.changed():
            Activity.objects.create(
                user=instance.application.applicant.user,
                waiting_list=instance.application.waiting_list,
                application=instance.application,
                activity='edit',
                note=f"changed field '{instance.waiting_list_field.label}' to '{instance.value}'"
            )


logger = logging.getLogger(__name__)


@receiver(post_save, sender=WaitingList)
def log_waitinglist_change(sender, instance, created, **kwargs):
    if not created:
        for field in instance._meta.get_fields():
            if not field.auto_created and not field.is_relation and not field.name == "updated_date":
                old_value = instance.tracker.previous(field.name)
                new_value = getattr(instance, field.name)
                if old_value != new_value:
                    note = f"changed field '{field.name}' to '{new_value}'"
                    # Assuming OrganisationUser is related to Organisation through the organisation_membership
                    owner = instance.organisation.organisation_membership.filter(role=3).first().member.user
                    Activity.objects.create(
                        user=owner,  # Use the owner of the Organisation as the user
                        waiting_list=instance,
                        application=None,
                        activity='edit_list',
                        note=note
                    )


@receiver(post_save, sender=WaitingListField)
def log_waitinglist_fields_change(sender, instance, created, **kwargs):
    if not created:
        old_value = instance.tracker.previous('is_displayed')
        new_value = getattr(instance, 'is_displayed')
        if old_value != new_value:
            if new_value:
                note = f"switched visibility of '{instance.label}' on"
            else:
                note = f"switched visibility of '{instance.label}' off"
            user = instance.waiting_list.organisation.organisation_membership.filter(role=3).first().member.user
            Activity.objects.create(
                user=user,
                waiting_list=instance.waiting_list,
                application=None,
                activity='edit_list',
                note=note
            )


@receiver(post_save, sender=Application)
def log_application_status_change(sender, instance, created, **kwargs):
    if created:
        Activity.objects.create(
            user=instance.applicant.user,
            waiting_list=instance.waiting_list,
            application=instance,
            activity='apply',
            note="applied to"
        )
    else:
        if 'status' in instance.tracker.changed():
            Activity.objects.create(
                user=instance.applicant.user,
                waiting_list=instance.waiting_list,
                application=instance,
                activity="change_status",
                note=f"changed the status to '{instance.status}'"
            )

        if 'position' in instance.tracker.changed() and instance.position == 1:
            Activity.objects.create(
                user=instance.applicant.user,
                waiting_list=instance.waiting_list,
                application=instance,
                activity='recalculate_positions',
                note=f"changed position to '{instance.position}'"
            )


@receiver(post_save, sender=IdentityVerification)
def log_identity_verification_change(sender, instance, created, **kwargs):
    if not created:
        changed_fields = instance.tracker.changed()
        # Remove 'created_date' and 'updated_date' from changed fields
        changed_fields.pop('created_date', None)
        changed_fields.pop('updated_date', None)

        # If there are still any changed fields
        if changed_fields:
            applicant = instance.applicant
            # Assuming an applicant has a single application, else you'll need to adjust this logic
            application = applicant.applications.first()

            # Form a note string with all changed fields and their new values
            note = "Changes in {0} #{1}:\n".format(
                instance._meta.verbose_name.capitalize(),
                instance.id
            )
            for field, new_value in changed_fields.items():
                note += "{0} updated: {1}\n".format(
                    field.replace('_', ' ').capitalize(),
                    new_value
                )

            Activity.objects.create(
                user=applicant.user,
                waiting_list=application.waiting_list,
                activity='verify',
                note=note
            )


@receiver(post_save, sender=Reconfirmation)
def log_reconfirmation(sender, instance, created, **kwargs):
    if not created and instance.reconfirmation_date:
        Activity.objects.create(
            user=instance.application.applicant.user,
            waiting_list=instance.waiting_list,
            application=instance.application,
            activity='reconfirm',
            note="reconfirmed their interest"
        )
