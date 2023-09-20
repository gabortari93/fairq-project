from django.utils import timezone
from django_q.tasks import async_task
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from .models import Application


# Task to update positions
def update_positions(waiting_list_id):
    applications = Application.objects.filter(waiting_list_id=waiting_list_id, status='waiting').order_by(
        'waiting_since_date')
    for i, application in enumerate(applications):
        application.position = i + 1
        application.save(update_fields=['position'])

    return f"{len(applications)} applications updated"


@receiver(post_delete, sender=Application)
def update_positions_after_delete(sender, instance, **kwargs):
    if instance.status == 'waiting':
        async_task(update_positions, instance.waiting_list_id,
                   task_name=f"Recalculate positions on list #{instance.waiting_list_id}", group="Calculate positions")


@receiver(pre_save, sender=Application)
def update_positions_before_status_change(sender, instance, **kwargs):
    if instance.pk:
        old_status = Application.objects.get(pk=instance.pk).status

        # Set "waiting_since_date" if status=>waiting and date not set before
        if old_status != 'waiting' and instance.status == 'waiting' and instance.waiting_since_date is None:
            instance.waiting_since_date = timezone.now()

        # Set "selected_date" if status=>selected and date not set before
        if old_status != 'selected' and instance.status == 'selected' and instance.selected_date is None:
            instance.selected_date = timezone.now()

        # Trigger tasks to recalculate positions
        if old_status == 'waiting' and instance.status != 'waiting':
            async_task(update_positions, instance.waiting_list_id,
                       task_name=f"Recalculate positions on list #{instance.waiting_list_id}",
                       group="Calculate positions")
            instance.position = None
        if old_status != 'waiting' and instance.status == 'waiting':
            async_task(update_positions, instance.waiting_list_id,
                       task_name=f"Recalculate positions on list #{instance.waiting_list_id}",
                       group="Calculate positions")
