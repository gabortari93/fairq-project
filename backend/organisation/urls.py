from django.urls import path
from .views import OrganisationCreateAPIView, OrganisationRetrieveUpdateDestroyAPIView, \
    ListCreateOrganisationMembersView,  \
    MembershipDetailView

urlpatterns = [
    path('', OrganisationCreateAPIView.as_view(), name='org-create'),
    path('<int:pk>/', OrganisationRetrieveUpdateDestroyAPIView.as_view(), name='organisation-detail'),
    path('<int:pk>/members/', ListCreateOrganisationMembersView.as_view()),
    path('<int:id>/members/<int:user_id>/', MembershipDetailView.as_view(), name='membership-detail'),
]
