from django.db.models import Avg, F
from application.models import Application
from waiting_list.models import WaitingList


def calculate_estimated_selection_date():
    waiting_lists = WaitingList.objects.all()

    for waiting_list in waiting_lists:
        applications = Application.objects.filter(
            waiting_list=waiting_list,
            status="waiting"
        )

        # Get the average number of days that applications spend in the waiting list before being selected
        average_waiting_time = Application.objects.filter(
            waiting_list=waiting_list,
            status="selected"
        ).annotate(
            waiting_time=F('selected_date') - F('waiting_since_date')
        ).aggregate(average_waiting_time=Avg('waiting_time'))['average_waiting_time']

        # If there are no selected applications in the waiting list yet, we can't predict the time
        if average_waiting_time is None:
            continue

        # Calculate the estimated selection date for each application in the waiting list, and save it
        for application in applications:
            if application.waiting_since_date is not None:
                application.estimated_selection_date = application.waiting_since_date + average_waiting_time
                application.save()
