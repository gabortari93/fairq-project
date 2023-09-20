"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from django.conf import settings
from django.conf.urls.static import static

admin.site.site_title = "fairQ Admin"
admin.site.site_header = "fairQ Admin"
admin.site.index_title = "Welcome to the fairQ Admin"

schema_view = get_schema_view(
    openapi.Info(
        title="fairQ API",
        default_version="v1",
        description="fairQ API documentation",
        contact=openapi.Contact(email="alexander@muedespacher.ch"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,  # Set to False restrict access to protected endpoints
    permission_classes=[permissions.AllowAny],  # Permissions for docs access
)

urlpatterns = [

    # Admin backoffice
    path('api/admin/', admin.site.urls),

    # Waitinglist
    path("api/list/", include("waiting_list.urls")),

    # Organisation
    path("api/org/", include("organisation.urls")),

    # Application endpoints
    path('api/', include('application.urls')),

    # Reconfirmation User endpoints
    path('api/', include('reconfirmation.urls')),

    # Identity verification User endpoints
    path('api/', include('identity_verification.urls')),

    # Activity endpoints
    path('api/', include('activity.urls')),

    # Activity endpoints
    path('api/', include('stats.urls')),

    # auth
    path(
        "api/auth/token/",
        jwt_views.TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/auth/token/refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "api/auth/token/verify/",
        jwt_views.TokenVerifyView.as_view(),
        name="token_refresh",
    ),
    # API docs
    path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),

    # Organisation User endpoints
    path('api/user/', include('organisation_user.urls')),

    # AuthUser endpoints
    path('api/', include('user.urls')),

]

if settings.DEBUG:  # we only want to add these urls in debug mode
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
