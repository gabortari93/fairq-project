from django.urls import path
from .views import (
    AuthUserRetrieveUpdateMeView, RegisterUserView, CompleteUserProfileView, ValidateUserTokenView, MagicLinkLoginView,
    RequestLoginLink,
)

urlpatterns = [
    # Get Authentication Profile
    path('auth/me/', AuthUserRetrieveUpdateMeView.as_view()),

    # Request magic link
    path('auth/login/request-link', RequestLoginLink.as_view()),

    # Log in with magic link
    path('auth/login/link/<str:token>/', MagicLinkLoginView.as_view()),

    # Register as a new OrganisationUser
    path('user/register/', RegisterUserView.as_view()),

    # Validate token during Registration
    path('user/validate-token/', ValidateUserTokenView.as_view()),

    # Complete profile of an OrganisationUser
    path('user/complete-profile/', CompleteUserProfileView.as_view()),
]
