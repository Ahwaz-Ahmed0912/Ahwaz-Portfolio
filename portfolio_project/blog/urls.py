from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet
from . import views

router = DefaultRouter()
router.register(r'blog', BlogPostViewSet)

urlpatterns = [

    # API routes
    path('api/', include(router.urls)),

    # Blog HTML pages
    path(
        'automation-python/',
        views.automation_python,
        name='automation_python'
    ),

    path(
        'django-react/',
        views.django_react,
        name='django_react'
    ),

    path(
        'rest-api-design/',
        views.rest_api_design,
        name='rest_api_design'
    ),

    # Docs HTML pages

    path('airline-doc/', views.airline_doc, name='airline_doc'),
    path('ai-automation-doc/', views.ai_automation_doc, name='ai_automation_doc'),
    path('athlete-doc/', views.athlete_doc, name='athlete_doc'),
    path('workflows-doc/', views.workflows_doc, name='workflows_doc'),
]