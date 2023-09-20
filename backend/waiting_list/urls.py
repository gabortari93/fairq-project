from django.urls import path
from . import views

urlpatterns = [

    # Create a waiting list
    path('', views.CreateWaitinglistView.as_view()),

    # Retrieve, patch, delete a waiting list
    path('<int:pk>/', views.RetrieveUpdateDeleteWaitinglistView.as_view()),

    # Retrieve, public information on a waiting list
    path('<str:slug>/public', views.RetrieveWaitinglistPublic.as_view()),

    # List applications per waiting list
    path('<int:list_id>/applications/', views.ListApplicationsPerWaitinglistView.as_view()),

    # Select an application
    path('<int:list_id>/applications/<int:application_id>/select/', views.SelectApplicationView.as_view()),

    # List configuration options per waiting list
    path('<int:list_id>/options/', views.ListWaitinglistConfigurationOptionsView.as_view()),

    # Update a field on a waiting list
    path('<int:list_id>/fields/<int:pk>/', views.UpdateWaitingListFieldView.as_view()),

    # Export CSV file
    path('<int:list_id>/export/<str:status>/', views.export_waiting_list_to_csv,
         name='export_waiting_list_to_csv'),

]
