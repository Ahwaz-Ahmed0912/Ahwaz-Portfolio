from django.urls import path
from .views import contact_submit, contact_list

urlpatterns = [
    path('contact/', contact_submit, name='contact-submit'),
    path('contact/list/', contact_list, name='contact-list'),
]
