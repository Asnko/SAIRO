from django.contrib import admin
from .models import Building, RouteNode, RouteEdge


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'floors', 'has_elevator']
    search_fields = ['name', 'code']


@admin.register(RouteNode)
class RouteNodeAdmin(admin.ModelAdmin):
    list_display = ['name', 'node_type', 'building']
    list_filter = ['node_type']


@admin.register(RouteEdge)
class RouteEdgeAdmin(admin.ModelAdmin):
    list_display = ['source', 'target', 'distance_m', 'stair_count', 'has_elevator']
