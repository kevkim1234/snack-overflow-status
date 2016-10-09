from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.item_list, name='item_list'),
    url(r'^item_list.html$', views.item_list, name='item_list'),
    url(r'^item_chart.html$', views.item_chart, name='item_chart'),
    url(r'^elements.html$', views.elements, name='elements')
]
