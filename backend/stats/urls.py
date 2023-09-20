from django.urls import path
from .views import WaitingListStatsView

urlpatterns = [
    path('stats/waitinglist_stats_data/<int:waiting_list_id>/',  WaitingListStatsView.as_view(), name='waitinglist_stats_data'),
]
