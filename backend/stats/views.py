from rest_framework.generics import ListAPIView
from .models import DailyStatsPerWaitingList
from .serializers import WaitingListStatsSerializer


class WaitingListStatsView(ListAPIView):
    serializer_class = WaitingListStatsSerializer
    lookup_url_kwarg = 'waiting_list_id'
    pagination_class = None

    def get_queryset(self):
        waiting_list_id = self.kwargs.get(self.lookup_url_kwarg)
        return DailyStatsPerWaitingList.objects.filter(waiting_list__id=waiting_list_id).order_by('date')[:100]
