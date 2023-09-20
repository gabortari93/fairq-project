from django.urls import path
from reconfirmation.views import HandleReconfirmation

urlpatterns = [
    path('list/<int:list_id>/application/<int:application_id>/reconfirmation', HandleReconfirmation.as_view(), name='handle_reconfirmation'),
]
