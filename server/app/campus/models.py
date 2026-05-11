from django.db import models


class Building(models.Model):
    """캠퍼스 건물"""
    name        = models.CharField(max_length=100, unique=True, verbose_name='건물명')
    code        = models.CharField(max_length=20, unique=True, verbose_name='건물코드')
    latitude    = models.FloatField(verbose_name='위도')
    longitude   = models.FloatField(verbose_name='경도')
    # SVG map coordinates
    map_x       = models.FloatField(default=0, verbose_name='지도 X')
    map_y       = models.FloatField(default=0, verbose_name='지도 Y')
    map_w       = models.FloatField(default=60, verbose_name='지도 너비')
    map_h       = models.FloatField(default=40, verbose_name='지도 높이')
    floors      = models.PositiveSmallIntegerField(default=5, verbose_name='층수')
    has_elevator = models.BooleanField(default=True, verbose_name='엘리베이터')
    description = models.TextField(blank=True, verbose_name='설명')

    class Meta:
        verbose_name = '건물'
        verbose_name_plural = '건물 목록'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class RouteNode(models.Model):
    """경로 그래프 노드 (교차점, 건물 입구 등)"""
    NODE_TYPES = [
        ('entrance', '건물 입구'),
        ('junction', '교차점'),
        ('stairs',   '계단'),
        ('elevator', '엘리베이터'),
        ('slope',    '경사로'),
    ]
    name      = models.CharField(max_length=100, verbose_name='노드명')
    node_type = models.CharField(max_length=20, choices=NODE_TYPES, verbose_name='노드 유형')
    building  = models.ForeignKey(
        Building, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='nodes',
    )
    map_x = models.FloatField(verbose_name='지도 X')
    map_y = models.FloatField(verbose_name='지도 Y')

    class Meta:
        verbose_name = '경로 노드'
        verbose_name_plural = '경로 노드 목록'

    def __str__(self) -> str:
        return f'{self.name} ({self.node_type})'


class RouteEdge(models.Model):
    """경로 그래프 엣지 (노드 간 연결)"""
    source      = models.ForeignKey(RouteNode, on_delete=models.CASCADE, related_name='outgoing')
    target      = models.ForeignKey(RouteNode, on_delete=models.CASCADE, related_name='incoming')
    distance_m  = models.FloatField(verbose_name='거리(m)')
    stair_count = models.IntegerField(default=0, verbose_name='계단 수')
    slope_pct   = models.FloatField(default=0, verbose_name='경사도(%)')
    has_elevator = models.BooleanField(default=False, verbose_name='엘리베이터')
    is_indoor   = models.BooleanField(default=False, verbose_name='실내')

    class Meta:
        unique_together = ('source', 'target')
        verbose_name = '경로 엣지'
        verbose_name_plural = '경로 엣지 목록'

    def __str__(self) -> str:
        return f'{self.source} → {self.target} ({self.distance_m}m)'
