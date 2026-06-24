from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    """API endpoint for blog posts."""
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# HTML Blog Pages

def automation_python(request):
    return render(request, "blogs/automation-python.html")


def django_react(request):
    return render(request, "blogs/django-react.html")


def rest_api_design(request):
    return render(request, "blogs/rest-api-design.html")

# HTML Docs Pages

def airline_doc(request):
    return render(request, 'blogs/airline-doc.html')

def ai_automation_doc(request):
    return render(request, 'blogs/ai-automation-doc.html')

def athlete_doc(request):
    return render(request, 'blogs/athlete-doc.html')

def workflows_doc(request):
    return render(request, 'blogs/automation-workflows-doc.html')