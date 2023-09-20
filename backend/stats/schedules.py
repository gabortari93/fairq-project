from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, Avg
from datetime import datetime, date

from django.utils import timezone

from application.models import Application
from application_field.models import ApplicationField
from stats.models import DailyStatsPerWaitingList
from waiting_list.models import WaitingList
from waiting_list_field.models import WaitingListField


def calculate_stats_per_waiting_list(waiting_list):
    day = timezone.now().date()

    DailyStatsPerWaitingList.objects.create(
        waiting_list=waiting_list,
        total_applicants=Application.objects.filter(waiting_list=waiting_list,
                                                    status__in=['waiting', 'selected', 'removed']).count(),
        total_waiting=Application.objects.filter(waiting_list=waiting_list, status__in=['waiting']).count(),
        total_selected=Application.objects.filter(waiting_list=waiting_list, status__in=['selected']).count(),
        total_removed=Application.objects.filter(waiting_list=waiting_list, status__in=['removed']).count(),
        total_pending=Application.objects.filter(waiting_list=waiting_list, status__in=['created']).count(),
        new_applicants=Application.objects.filter(waiting_list=waiting_list, status='waiting',
                                                  waiting_since_date__date=day).count(),
        new_selected=Application.objects.filter(waiting_list=waiting_list, status='selected',
                                                selected_date__date=day).count(),
        average_current_waiting_time=calculate_estimated_time_for_new_applicants(waiting_list.id),
        average_waiting_time_of_selected_applicants=calculate_average_waiting_time_for_selected_applicants(
            waiting_list.id),
        date=day,
    )


def calculate_estimated_time_for_new_applicants(waiting_list_id=None):
    day = timezone.now().date()

    if waiting_list_id is None:
        applications = Application.objects.filter(status="waiting")
    else:
        applications = Application.objects.filter(waiting_list_id=waiting_list_id, status="waiting")

    average_waiting_time = applications.aggregate(
        average_waiting_time=Avg(day - F('waiting_since_date'))
    )['average_waiting_time']

    return int(average_waiting_time.total_seconds() / (60 * 60 * 24)) if average_waiting_time else None


def calculate_average_waiting_time_for_selected_applicants(waiting_list_id=None):
    if waiting_list_id is None:
        applications = Application.objects.filter(status="selected")
    else:
        applications = Application.objects.filter(waiting_list_id=waiting_list_id, status="selected")

    average_waiting_time = applications.aggregate(
        average_waiting_time=Avg(F('selected_date') - F('waiting_since_date'))
    )['average_waiting_time']

    # Convert average waiting time to days and store it in the integer field
    return int(average_waiting_time.total_seconds() / (60 * 60 * 24)) if average_waiting_time else None


def calculate_gender(application):
    try:
        # Get the 'gender' WaitingListField
        gender_field = WaitingListField.objects.get(name='gender', waiting_list=application.waiting_list)
        # Get the ApplicationField that has the actual gender value for this application
        application_field = ApplicationField.objects.get(application=application, waiting_list_field=gender_field)
        # Retrieve the gender value
        gender = application_field.value.lower()
        return gender
    except ObjectDoesNotExist:
        print(
            "Either 'gender' field does not exist for this waiting list, or it was not filled out for this application.")


def calculate_age(application):
    try:
        # Get the 'birthdate' WaitingListField
        birthdate_field = WaitingListField.objects.get(name='birthdate', waiting_list=application.waiting_list)
        # Get the ApplicationField that has the actual birthdate value for this application
        application_field = ApplicationField.objects.get(application=application, waiting_list_field=birthdate_field)
        # Parse the birthdate string into a datetime object
        birthdate = datetime.strptime(application_field.value, '%Y-%m-%d').date()
        # Calculate the age based on the birthdate
        today = date.today()
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
        return age
    except ObjectDoesNotExist:
        print(
            "Either 'birthdate' field does not exist for this waiting list, or it was not filled out for this application.")
    except ValueError:
        print("The 'birthdate' field is not in the correct format. It should be 'YYYY-MM-DD'.")


def calculate_age_gender_statistics(waiting_list):
    datetime.today()
    age_gender_statistics = {
        '0_18': 0,
        '19_25': 0,
        '26_35': 0,
        '36_50': 0,
        '51_65': 0,
        '65_plus': 0,
        'male': 0,
        'female': 0,
        'other': 0,
    }

    for application in Application.objects.filter(waiting_list=waiting_list):
        try:
            age = calculate_age(application)
        except ObjectDoesNotExist:
            # Continue to next iteration if birthdate field not found or not filled out
            continue
        if age is None:
            continue
        if age <= 18:
            age_gender_statistics['0_18'] += 1
        elif age <= 25:
            age_gender_statistics['19_25'] += 1
        elif age <= 35:
            age_gender_statistics['26_35'] += 1
        elif age <= 50:
            age_gender_statistics['36_50'] += 1
        elif age <= 65:
            age_gender_statistics['51_65'] += 1
        else:
            age_gender_statistics['65_plus'] += 1

        try:
            gender = calculate_gender(application)
        except ObjectDoesNotExist:
            # Continue to next iteration if gender field not found or not filled out
            continue
        if gender is None:
            continue
        if gender == 'male':
            age_gender_statistics['male'] += 1
        elif gender == 'female':
            age_gender_statistics['female'] += 1
        else:
            age_gender_statistics['other'] += 1

    return age_gender_statistics


def calculate_and_store_stats():
    waiting_lists = WaitingList.objects.all()
    for waiting_list in waiting_lists:
        # Calculate waiting list statistics
        calculate_stats_per_waiting_list(waiting_list)

        # Additional statistics - Age and Gender for each waiting list
        age_gender_statistics = calculate_age_gender_statistics(waiting_list)

        # Store the additional statistics in the WaitingListStats model
        waiting_list_stats_entry = DailyStatsPerWaitingList.objects.filter(waiting_list=waiting_list).last()

        if waiting_list_stats_entry:
            waiting_list_stats_entry.age_0_18 = age_gender_statistics['0_18']
            waiting_list_stats_entry.age_19_25 = age_gender_statistics['19_25']
            waiting_list_stats_entry.age_26_35 = age_gender_statistics['26_35']
            waiting_list_stats_entry.age_36_50 = age_gender_statistics['36_50']
            waiting_list_stats_entry.age_51_65 = age_gender_statistics['51_65']
            waiting_list_stats_entry.age_65_plus = age_gender_statistics['65_plus']
            waiting_list_stats_entry.gender_male = age_gender_statistics['male']
            waiting_list_stats_entry.gender_female = age_gender_statistics['female']
            waiting_list_stats_entry.gender_other = age_gender_statistics['other']

            waiting_list_stats_entry.save()
