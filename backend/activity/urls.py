from django.urls import path
from activity.views import ActivitiesByApplication, ActivitiesByWaitingList

urlpatterns = [
    path('list/<int:list_id>/application/<int:application_id>/activities', ActivitiesByApplication.as_view(), name='activities-by-application'),
    path('list/<int:list_id>/activities', ActivitiesByWaitingList.as_view(), name='activities-by-waiting-list'),
]
