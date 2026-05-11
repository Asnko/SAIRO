from rest_framework import serializers
from .models import Building, RouteNode, RouteEdge


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = [
            'id', 'name', 'code', 'latitude', 'longitude',
            'map_x', 'map_y', 'map_w', 'map_h',
            'floors', 'has_elevator', 'description',
        ]


class RouteNodeSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source='building.name', read_only=True)

    class Meta:
        model = RouteNode
        fields = ['id', 'name', 'node_type', 'building', 'building_name', 'map_x', 'map_y']


class RouteEdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteEdge
        fields = [
            'id', 'source', 'target',
            'distance_m', 'stair_count', 'slope_pct',
            'has_elevator', 'is_indoor',
        ]


class RouteRequestSerializer(serializers.Serializer):
    """경로 탐색 요청 파라미터"""
    from_building = serializers.CharField(help_text='출발 건물 코드')
    to_building   = serializers.CharField(help_text='도착 건물 코드')
    profile       = serializers.ChoiceField(
        choices=['fast', 'balanced', 'accessible'],
        default='balanced',
        help_text='경로 프로필',
    )


class RouteStepSerializer(serializers.Serializer):
    icon        = serializers.CharField()
    description = serializers.CharField()
    time        = serializers.CharField()
    is_warning  = serializers.BooleanField(default=False)


class RouteResultSerializer(serializers.Serializer):
    """경로 탐색 결과"""
    profile    = serializers.CharField()
    duration   = serializers.CharField()
    stairs     = serializers.IntegerField()
    elevators  = serializers.IntegerField()
    slope      = serializers.CharField()
    steps      = RouteStepSerializer(many=True)
