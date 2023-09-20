from django.urls import path
from . import views

urlpatterns = [

    # Create application
    path('list/<int:list_id>/application/', views.CreateApplicationView.as_view()),

    # List my application(s)
    path('list/<int:list_id>/application/me', views.ListApplicationView.as_view()),

    # Retrieve, update, delete an application
    path('list/<int:list_id>/application/<int:application_id>/', views.RetrieveUpdateDeleteApplicationView.as_view()),

]
