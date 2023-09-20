from django.urls import path
from .views import (
    UserListMemberships,
)

app_name = 'organisation_user'

urlpatterns = [
    # path('me/', UserRetrieveUpdateDeleteAPIView.as_view(), name='user-retrieve-update-delete'),
    path('me/memberships', UserListMemberships.as_view(), name='user-list-memberships'),
    # path('<int:user_id>/', UserRetrieveDeleteAPIView.as_view(), name='user-retrieve-delete'),
]
