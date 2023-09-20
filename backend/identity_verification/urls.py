from django.urls import path
from .views import IdentityVerificationCreateView

urlpatterns = [
    path('identity-verification/<int:applicant_id>/create/', IdentityVerificationCreateView.as_view(),
         name='create_identity_verification'),
]
