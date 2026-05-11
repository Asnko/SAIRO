from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Building, RouteNode, RouteEdge
from .serializers import (
    BuildingSerializer,
    RouteNodeSerializer,
    RouteEdgeSerializer,
    RouteRequestSerializer,
    RouteResultSerializer,
)


class BuildingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/campus/buildings/       — 건물 목록
    GET /api/v1/campus/buildings/{id}/  — 건물 상세
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.IsAuthenticated]


class RouteView(APIView):
    """
    POST /api/v1/campus/route/
    Body: { from_building, to_building, profile }
    Returns: 경로 탐색 결과 (A* 알고리즘 — 추후 구현)
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=RouteRequestSerializer,
        responses=RouteResultSerializer,
        summary='캠퍼스 경로 탐색',
        description='출발/도착 건물과 프로필(fast/balanced/accessible)을 받아 최적 경로를 반환합니다.',
    )
    def post(self, request):
        req_serializer = RouteRequestSerializer(data=request.data)
        req_serializer.is_valid(raise_exception=True)
        params = req_serializer.validated_data

        # ── Stub response (A* 구현 전 목업) ──────────────────────────────
        profile = params['profile']
        MOCK_ROUTES = {
            'fast': {
                'profile': 'fast', 'duration': '7분',
                'stairs': 42, 'elevators': 0, 'slope': '↑8%',
                'steps': [
                    {'icon': 'arrow',  'description': '멘토관 1층 후문으로 나가세요', 'time': '0분',  'is_warning': False},
                    {'icon': 'stairs', 'description': '계단 42단 하행',               'time': '+1분', 'is_warning': True},
                    {'icon': 'slope',  'description': '향설로를 따라 동쪽으로 직진',  'time': '4분',  'is_warning': False},
                    {'icon': 'check',  'description': '유담관 정문 도착',              'time': '6분',  'is_warning': False},
                    {'icon': 'flag',   'description': '4층 411호',                     'time': '7분',  'is_warning': False},
                ],
            },
            'balanced': {
                'profile': 'balanced', 'duration': '9분',
                'stairs': 18, 'elevators': 1, 'slope': '↑3%',
                'steps': [
                    {'icon': 'arrow',    'description': '멘토관 1층 후문으로 나가세요',        'time': '0분',  'is_warning': False},
                    {'icon': 'stairs',   'description': '계단 18단 하행 (대안: 엘리베이터)',   'time': '+1분', 'is_warning': True},
                    {'icon': 'slope',    'description': '향설로를 따라 동쪽으로 직진',         'time': '4분',  'is_warning': False},
                    {'icon': 'check',    'description': '유담관 정문 도착',                     'time': '8분',  'is_warning': False},
                    {'icon': 'flag',     'description': '4층 411호',                            'time': '9분',  'is_warning': False},
                ],
            },
            'accessible': {
                'profile': 'accessible', 'duration': '12분',
                'stairs': 0, 'elevators': 3, 'slope': '↑1%',
                'steps': [
                    {'icon': 'elevator', 'description': '멘토관 엘리베이터 1층으로 이동', 'time': '0분',  'is_warning': False},
                    {'icon': 'slope',    'description': '완만한 경사로 이용',              'time': '3분',  'is_warning': False},
                    {'icon': 'elevator', 'description': '유담관 엘리베이터 탑승',          'time': '9분',  'is_warning': False},
                    {'icon': 'flag',     'description': '4층 411호',                       'time': '12분', 'is_warning': False},
                ],
            },
        }
        result = MOCK_ROUTES.get(profile, MOCK_ROUTES['balanced'])
        serializer = RouteResultSerializer(result)
        return Response(serializer.data)
