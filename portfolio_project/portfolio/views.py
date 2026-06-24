from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Project, Experience, Skill
from .serializers import ProjectSerializer, ExperienceSerializer, SkillSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """API endpoint for projects."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]


class ExperienceViewSet(viewsets.ModelViewSet):
    """API endpoint for experience."""
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]


class SkillViewSet(viewsets.ModelViewSet):
    """API endpoint for skills."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
