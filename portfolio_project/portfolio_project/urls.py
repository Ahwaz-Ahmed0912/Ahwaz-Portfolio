"""URL configuration for portfolio_project."""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import home


urlpatterns = [
    
    # Home page
    path('', home, name="home"),

    # Admin
    path('admin/', admin.site.urls),

    # Website pages
    path('blog/', include('blog.urls')),

    # API routes
    path('api/portfolio/', include('portfolio.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/contact/', include('contact.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)